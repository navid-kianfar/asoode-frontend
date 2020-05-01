import { Component, Input, OnInit } from '@angular/core';
import {ProjectViewModel, WorkPackageTaskViewModel, WorkPackageViewModel} from '../../../view-models/projects/project-types';
import { AccessType } from '../../../library/app/enums';
import {CultureService} from '../../../services/core/culture.service';
import {NumberHelpers} from '../../../helpers/number.helpers';
import {CulturedDateService} from '../../../services/core/cultured-date.service';
import {IDateConverter} from '../../../library/core/date-time/date-contracts';

@Component({
  selector: 'app-work-package-calendar',
  templateUrl: './work-package-calendar.component.html',
  styleUrls: ['./work-package-calendar.component.scss'],
})
export class WorkPackageCalendarComponent implements OnInit {
  @Input() project: ProjectViewModel;
  @Input() model: WorkPackageViewModel;
  @Input() permission: AccessType;
  ViewMode = ViewMode;
  mode: ViewMode;
  beginDate: Date;
  endDate: Date;
  hours: number[];
  NumberHelpers = NumberHelpers;
  private converter: IDateConverter;
  days: { date: string; events: any }[];
  constructor(
    readonly cultureService: CultureService,
    private readonly culturedDateService: CulturedDateService,
  ) {}

  ngOnInit() {
    this.hours = Array(24).fill(0).map((e, i) => i + 1);
    this.beginDate = new Date();
    this.converter = this.culturedDateService.Converter();
    this.switchMode(ViewMode.Day);
  }

  allTasks(): WorkPackageTaskViewModel[] {
    return this.model.lists.map(l => l.tasks)
      .reduce((prev, curr) => prev.concat(curr), []);
  }

  switchMode(mode: ViewMode) {
    const data = {};
    const begin = new Date(this.beginDate.getTime());
    const tasks = this.allTasks();
    switch (mode) {
      case ViewMode.Day:
        break;
      case ViewMode.Week:
        this.endDate = new Date();
        this.endDate.setDate(this.endDate.getDate() + 7);

        let condition = true;
        do {
          const date = this.converter.FromDateTime(begin);
          const key = `${date.Year}/${date.Month}/${date.Day}`;
          // const info = this.model.find(i => this.sameDay(i.date, begin)) || {
          //   total: 0,
          //   done: 0,
          //   blocked: 0,
          //   date: undefined,
          // };
          data[key] = data[key] || [];

          begin.setDate(begin.getDate() + 1);
          condition = this.sameDay(begin, this.endDate);
        } while (!condition);
        this.days = Object.keys(data).map(k => {
          return {
            date: k,
            events: data[k]
          };
        });
        break;
      case ViewMode.Month:
        break;
    }
    this.mode = mode;
  }

  sameDay(begin: Date | string, end: Date | string): boolean {
    if (typeof begin === 'string') {
      begin = new Date(begin);
    }
    if (typeof end === 'string') {
      end = new Date(end);
    }
    return (
      begin.getDate() === end.getDate() &&
      begin.getMonth() === end.getMonth() &&
      begin.getFullYear() === end.getFullYear()
    );
  }
}
export enum ViewMode {
  Day = 1,
  Week = 2,
  Month = 3
}
