import { Component, OnInit } from '@angular/core';
import { GroupService } from '../../../services/groups/group.service';
import { ProjectService } from '../../../services/projects/project.service';
import { ProjectFilter } from '../../../library/app/enums';
import { ReportService } from '../../../services/general/report.service';
import { DashboardViewModel } from '../../../view-models/general/report-types';
import { OperationResultStatus } from '../../../library/core/enums';
import { CulturedDateService } from '../../../services/core/cultured-date.service';
import {IDateConverter} from '../../../library/core/date-time/date-contracts';

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
  monthBegin: Date;
  monthEnd: Date;
  selectedActivityGroup: string;
  converter: IDateConverter;

  constructor(
    readonly groupService: GroupService,
    readonly projectService: ProjectService,
    private readonly reportService: ReportService,
    private readonly culturedDateService: CulturedDateService,
  ) {}

  ngOnInit() {
    this.switchActivities(0);
    this.filter = ProjectFilter.All;
    this.converter = this.culturedDateService.Converter();
    this.fetch();
  }

  async fetch() {
    this.begin = new Date();
    this.begin.setDate(this.begin.getDate() - 6);
    this.end = new Date();
    this.end.setDate(this.end.getDate() + 1);

    const now = new Date();
    const parsed = this.converter.FromDateTime(now);
    this.monthBegin = this.converter.ToDateTime({
      Year: parsed.Year,
      Month: parsed.Month,
      Day: 1,
      Hours: 0,
      Minutes: 0,
    });
    const lastDayInMonth = this.culturedDateService.cultureService.current
      .daysInMonths[parsed.Month - 1];
    this.monthEnd = this.converter.ToDateTime({
      Year: parsed.Year,
      Month: parsed.Month,
      Day: lastDayInMonth,
      Hours: 23,
      Minutes: 59,
    });

    this.waiting = true;
    const op = await this.reportService.dashboard({
      begin: this.begin,
      end: this.end,
      monthBegin: this.monthBegin,
      monthEnd: this.monthEnd
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
