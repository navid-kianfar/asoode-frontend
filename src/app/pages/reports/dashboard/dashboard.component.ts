import { Component, OnInit } from '@angular/core';
import { GroupService } from '../../../services/groups/group.service';
import { ProjectService } from '../../../services/projects/project.service';
import { ProjectFilter } from '../../../library/app/enums';
import { ReportService } from '../../../services/general/report.service';
import { DashboardViewModel } from '../../../view-models/general/report-types';
import { OperationResultStatus } from '../../../library/core/enums';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  activitiesWaiting: boolean;
  projectsWaiting: boolean;
  filter: ProjectFilter;
  waiting: boolean;
  data: DashboardViewModel;
  constructor(
    readonly groupService: GroupService,
    readonly projectService: ProjectService,
    private readonly reportService: ReportService,
  ) {}

  ngOnInit() {
    this.filter = ProjectFilter.All;
    this.fetch();
  }

  async fetch() {
    this.waiting = true;
    const op = await this.reportService.dashboard();
    if (op.status !== OperationResultStatus.Success) {
      // TODO: handle error
      return;
    }
    this.data = op.data;
    this.waiting = false;
  }
}
