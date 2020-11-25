import { Component, OnInit } from '@angular/core';
import { SimpleModalComponent } from 'ngx-simple-modal';
import { GroupService } from '../../services/groups/group.service';
import { OperationResultStatus } from '../../library/core/enums';
import { TimeOffDetailViewModel } from '../../view-models/groups/group-types';
import { WorkPackageTaskViewModel } from '../../view-models/projects/project-types';
import { TaskModalComponent } from '../task-modal/task-modal.component';
import { ModalService } from '../../services/core/modal.service';

@Component({
  selector: 'app-time-off-approve-modal',
  templateUrl: './time-off-approve-modal.component.html',
  styleUrls: ['./time-off-approve-modal.component.scss'],
})
export class TimeOffApproveModalComponent
  extends SimpleModalComponent<{ timeOff: any }, boolean>
  implements OnInit {
  timeOff: any;
  approving: boolean;
  waiting: boolean;
  declining: boolean;
  data: TimeOffDetailViewModel;
  constructor(
    private readonly groupService: GroupService,
    private readonly modalService: ModalService,
  ) {
    super();
  }

  ngOnInit() {
    this.fetch();
  }

  async fetch() {
    this.waiting = true;
    const op = await this.groupService.detailTimeOff(this.timeOff.id);
    this.waiting = false;
    if (op.status !== OperationResultStatus.Success) {
      this.close();
      return;
    }
    this.data = op.data;
  }

  async approve() {
    this.approving = true;
    const op = await this.groupService.approveTimeOff(this.timeOff.id);
    this.approving = false;
    if (op.status === OperationResultStatus.Success) {
      this.result = true;
      this.close();
      return;
    }
  }

  async decline() {
    this.declining = true;
    const op = await this.groupService.declineTimeOff(this.timeOff.id);
    this.declining = false;
    if (op.status === OperationResultStatus.Success) {
      this.result = true;
      this.close();
      return;
    }
  }

  openTask(log: WorkPackageTaskViewModel) {
    this.modalService
      .show(TaskModalComponent, {
        id: log.id,
        projectId: log.projectId,
        packageId: log.packageId,
      })
      .subscribe(() => {});
  }
}
