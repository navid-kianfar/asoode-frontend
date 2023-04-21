import { Component, Input, OnInit } from '@angular/core';
import { GroupViewModel } from '../../../../view-models/groups/group-types';
import { AccessType } from '../../../../shared/lib/enums/enums-2';
import { GroupService } from '../../../../groups/services/group.service';
import { TimeSpentViewModel } from '../../../../view-models/projects/project-types';
import { CulturedDateService } from '../../../../shared/services/cultured-date.service';
import { ModalService } from '../../../../shared/services/modal.service';
import { IDateConverter } from '../../../../shared/lib/date-time/date-contracts';
import { OperationResultStatus } from '../../../../shared/lib/enums/operation-result-status';

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
    private readonly groupService: GroupService,
  ) {}

  ngOnInit() {}

  onBeginChange($event: Date) {
    if (!$event) {
      return;
    }
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
