import { Component, Input, OnInit } from '@angular/core';
import { GroupViewModel } from '../../../view-models/groups/group-types';
import { GroupService } from '../../services/group.service';
import { AccessType } from '../../../shared/lib/enums/enums';
import { ModalService } from '../../../shared/services/modal.service';
import { OperationResultStatus } from '../../../shared/lib/enums/operation-result-status';

@Component({
  selector: 'app-group-chart',
  templateUrl: './group-chart.component.html',
  styleUrls: ['./group-chart.component.scss'],
})
export class GroupChartComponent implements OnInit {
  @Input() group: GroupViewModel;
  @Input() permission: AccessType;
  AccessType = AccessType;
  waiting: boolean;
  constructor(
    readonly groupService: GroupService,
    private readonly modalService: ModalService,
  ) {}

  ngOnInit() {}

  async goPremium() {
    this.waiting = true;
    const op = await this.groupService.upgrade(this.group.id);
    this.waiting = false;
    if (op.status !== OperationResultStatus.Success) {
      // TODO: handle error
      return;
    }
  }
}
