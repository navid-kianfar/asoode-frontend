import { Component, Input, OnInit } from '@angular/core';
import {ProjectViewModel, WorkPackageTaskViewModel, WorkPackageViewModel} from '../../../view-models/projects/project-types';
import { AccessType } from '../../../library/app/enums';
import {CultureService} from '../../../services/core/culture.service';
import {NumberHelpers} from '../../../helpers/number.helpers';
import {CulturedDateService} from '../../../services/core/cultured-date.service';
import {IDateConverter} from '../../../library/core/date-time/date-contracts';
import {TaskModalComponent} from '../../../modals/task-modal/task-modal.component';
import {ModalService} from '../../../services/core/modal.service';

@Component({
  selector: 'app-work-package-calendar',
  templateUrl: './work-package-calendar.component.html',
  styleUrls: ['./work-package-calendar.component.scss'],
})
export class WorkPackageCalendarComponent implements OnInit {
  @Input() project: ProjectViewModel;
  @Input() model: WorkPackageViewModel;
  @Input() permission: AccessType;
  calendarData: WorkPackageTaskViewModel[];
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
    private readonly modalService: ModalService
  ) {}

  ngOnInit() {
    this.hours = Array(24).fill(0).map((e, i) => i + 1);
    this.beginDate = new Date();
    this.converter = this.culturedDateService.Converter();
    this.switchMode(ViewMode.Month);
  }

  allTasks(): WorkPackageTaskViewModel[] {
    return this.model.lists.map(l => l.tasks)
      .reduce((prev, curr) => prev.concat(curr), []);
  }

  switchMode(mode: ViewMode) {
    const data = {};
    const begin = new Date(this.beginDate);
    this.calendarData = this.allTasks().filter(f => f.dueAt).map(t => {
      t.dueAt = new Date(t.dueAt);
      t.dueAtFormatted = this.converter.Format(t.dueAt, 'YYYY/MM/DD');
      return t;
    });
    this.endDate = new Date();

    switch (mode) {
      case ViewMode.Day:
        this.endDate.setDate(this.endDate.getDate() + 1);
        break;
      case ViewMode.Week:
        this.endDate.setDate(this.endDate.getDate() + 7);
        break;
      case ViewMode.Month:
        break;
    }

    let condition = true;
    const endParsed = this.converter.Format(this.endDate, 'YYYY/MM/DD');
    do {
      let beginParsed = this.converter.Format(begin, 'YYYY/MM/DD');

      data[beginParsed] = this.calendarData.filter(f => {
        return beginParsed === f.dueAtFormatted;
      });
      condition = beginParsed !== endParsed;

      begin.setDate(begin.getDate() + 1);
      beginParsed = this.converter.Format(begin, 'YYYY/MM/DD');
    } while (condition);

    this.days = Object.keys(data).map(k => {
      return {
        date: k,
        events: data[k]
      };
    });
    this.mode = mode;
  }

  sameDay(begin: Date | string, end: Date | string): boolean {
    const beginParsed = this.converter.FromDateTime(new Date(begin));
    const endParsed = this.converter.FromDateTime(new Date(end));
    return beginParsed.Year === endParsed.Year &&
      beginParsed.Month === endParsed.Month &&
      beginParsed.Day === endParsed.Day;
  }

  openTask($event, task) {
    $event.stopPropagation();
    $event.preventDefault();
    this.modalService.show(TaskModalComponent, { id: task.id }).subscribe(() => {});
  }
}
export enum ViewMode {
  Day = 1,
  Week = 2,
  Month = 3
}
