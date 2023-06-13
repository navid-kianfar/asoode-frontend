import { Component, Input, OnInit } from '@angular/core';
import { GroupViewModel } from '../../../view-models/groups/group-types';
import { GroupService } from '../../../services/groups/group.service';
import { AccessType } from '../../../library/app/enums';
import { OperationResultStatus } from '../../../library/core/enums';
import { UpgradeComponent } from '../../../modals/upgrade/upgrade.component';
import { ModalService } from '../../../services/core/modal.service';

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
