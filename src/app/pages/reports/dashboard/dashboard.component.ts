import { Component, OnInit } from '@angular/core';
import { GroupService } from '../../../services/groups/group.service';
import { ProjectService } from '../../../services/projects/project.service';
import { ProjectFilter } from '../../../library/app/enums';
import { ReportService } from '../../../services/general/report.service';
import { DashboardViewModel } from '../../../view-models/general/report-types';
import { OperationResultStatus } from '../../../library/core/enums';
import { CulturedDateService } from '../../../services/core/cultured-date.service';

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
  begin: Date;
  end: Date;
  selectedActivityGroup: string;

  constructor(
    readonly groupService: GroupService,
    readonly projectService: ProjectService,
    private readonly reportService: ReportService,
  ) {}

  ngOnInit() {
    this.switchActivities(0);
    this.filter = ProjectFilter.All;
    this.fetch();
  }

  async fetch() {
    this.begin = new Date();
    this.begin.setDate(this.begin.getDate() - 6);
    this.end = new Date();
    this.end.setDate(this.end.getDate() + 1);
    this.waiting = true;
    const op = await this.reportService.dashboard({
      begin: this.begin,
      end: this.end,
    });
    if (op.status !== OperationResultStatus.Success) {
      // TODO: handle error
      return;
    }
    this.data = op.data;
    this.waiting = false;
  }

  switchActivities(index: number) {
    if (this.groupService.groups[index]) {
      this.selectedActivityGroup = this.groupService.groups[index].id;
      return;
    }
    this.selectedActivityGroup = '';
  }
}
