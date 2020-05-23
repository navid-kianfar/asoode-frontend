import {Component, Input, OnInit} from '@angular/core';
import {GroupViewModel} from '../../../view-models/groups/group-types';
import {AccessType} from '../../../library/app/enums';
import {GroupService} from '../../../services/groups/group.service';
import {TimeSpentViewModel} from '../../../view-models/projects/project-types';
import {CulturedDateService} from '../../../services/core/cultured-date.service';
import {ModalService} from '../../../services/core/modal.service';
import {OperationResultStatus} from '../../../library/core/enums';
import {IDateConverter} from '../../../library/core/date-time/date-contracts';

@Component({
  selector: 'app-group-timespent',
  templateUrl: './group-timespent.component.html',
  styleUrls: ['./group-timespent.component.scss'],
})
export class GroupTimespentComponent implements OnInit {
  @Input() group: GroupViewModel;
  @Input() permission: AccessType;
  waiting: boolean;
  model: TimeSpentViewModel[];
  endDate: Date;
  beginDate: Date;
  converter: IDateConverter;
  constructor(
    readonly culturedDateService: CulturedDateService,
    readonly modalService: ModalService,
    private readonly groupService: GroupService
  ) {}

  ngOnInit() {  }

  onBeginChange($event: Date) {
    if (!$event) { return; }
    setTimeout(() => {
      if (!this.beginDate || this.beginDate.getTime() !== $event.getTime()) {
        this.beginDate = $event;
        this.fetch();
      }
    }, 100);
  }

  onEndChange($event: Date) {
    setTimeout(() => {
      this.endDate = $event;
    }, 10);
  }

  async fetch() {
    this.model = [];
    this.waiting = true;
    const op = await this.groupService.timeSpent(this.group.id, {
      begin: this.beginDate,
      end: this.endDate,
    });
    this.waiting = false;
    if (op.status !== OperationResultStatus.Success) {
      // TODO: handle error
      return;
    }
    this.model = op.data;
  }
}
