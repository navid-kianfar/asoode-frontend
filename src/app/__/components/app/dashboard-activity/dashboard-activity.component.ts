import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ReportService } from '../../../../reports/services/report.service';
import { WorkPackageTaskViewModel } from '../../../../view-models/projects/project-types';
import { ModalService } from '../../../../shared/services/modal.service';
import { TaskModalComponent } from '../../../modals/task-modal/task-modal.component';
import { OperationResultStatus } from '../../../../shared/lib/enums/operation-result-status';

@Component({
  selector: 'app-dashboard-activity',
  templateUrl: './dashboard-activity.component.html',
  styleUrls: ['./dashboard-activity.component.scss'],
})
export class DashboardActivityComponent implements OnInit, OnChanges {
  @Input() groupId: string;
  waiting: boolean;
  logs: WorkPackageTaskViewModel[];
  constructor(
    private readonly reportService: ReportService,
    private readonly modalService: ModalService,
  ) {}

  ngOnInit() {
    this.fetch();
  }

  async fetch() {
    this.logs = [];
    this.waiting = true;
    const op = await this.reportService.recentActivities(this.groupId);
    this.waiting = false;
    if (op.status !== OperationResultStatus.Success) {
      // TODO: handle error
      return;
    }
    this.logs = op.data;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.groupId && !changes.groupId.firstChange) {
      this.fetch();
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
