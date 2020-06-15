import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CulturedDateService } from '../../../services/core/cultured-date.service';
import {
  IDateConverter,
  IDateEvent,
  IDateTimeProperties,
} from '../../../library/core/date-time/date-contracts';
import { ICulture } from '../../../view-models/core/date-types';
import {
  CalendarNodeItem,
  CalendarState,
} from '../../core/calendar/calendar.component';
import { NumberHelpers } from '../../../helpers/number.helpers';
import { DateHelpers } from '../../../helpers/date.helpers';
import { WorkPackageTaskViewModel } from '../../../view-models/projects/project-types';
import { ModalService } from '../../../services/core/modal.service';
import { TaskModalComponent } from '../../../modals/task-modal/task-modal.component';

@Component({
  selector: 'app-calendar-month',
  templateUrl: './calendar-month.component.html',
  styleUrls: ['./calendar-month.component.scss'],
})
export class CalendarMonthComponent implements OnInit, OnChanges {
  @Input() beginDate: Date;
  @Input() endDate: Date;
  @Input() model: WorkPackageTaskViewModel[];
  converter: IDateConverter;
  calendar: ICulture;
  today: CalendarNodeItem;
  current: CalendarNodeItem;
  temp: CalendarNodeItem;
  state: CalendarState;
  @Input() events: IDateEvent[];
  @Input() culture: string;
  constructor(
    readonly culturedDateService: CulturedDateService,
    private readonly modalService: ModalService,
  ) {
    this.reset();
  }

  openTask($event, task) {
    $event.stopPropagation();
    $event.preventDefault();
    this.modalService
      .show(TaskModalComponent, {
        id: task.id,
        projectId: task.projectId,
        packageId: task.workPackageId,
      })
      .subscribe(() => {});
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.beginDate && !changes.beginDate.firstChange) {
      this.ngOnInit();
    }
  }

  ngOnInit() {
    const now = new Date();
    this.calendar = this.culturedDateService.Calendar();
    this.converter = this.culturedDateService.Converter();
    this.culture = this.calendar.lang;
    this.state.rtl = this.calendar.rtl;
    this.today = this.parseFormDate(now);
    const start = new Date(this.beginDate || now);
    this.current = this.parseFormDate(start);
    this.temp = { ...this.current };
    this.paintDays();
  }
  parseFormDate(date: Date): CalendarNodeItem {
    const converted = this.converter.FromDateTime(date);
    return this.convert(converted);
  }
  convert(date: IDateTimeProperties): CalendarNodeItem {
    return {
      date: date.Date,
      week: date.WeekName,
      day: date.Day,
      month: date.Month,
      disabled: this.calculateDisabled(date.Year, date.Month, date.Day),
      year: date.Year,
      old: false,
      events: [],
    };
  }
  calculateDisabled(year: number, month: number, day: number): boolean {
    // const fromCondition =
    //   new Date(this.from).getTime() >
    //   this.converter
    //     .ToDateTime({
    //       Year: year,
    //       Month: month,
    //       Day: day,
    //     })
    //     .getTime();
    // const toCondition =
    //   new Date(this.to).getTime() <
    //   this.converter
    //     .ToDateTime({
    //       Year: year,
    //       Month: month,
    //       Day: day,
    //     })
    //     .getTime();
    // if (this.from && this.to) {
    //   return fromCondition && toCondition;
    // }
    // if (this.from) {
    //   return fromCondition;
    // }
    // if (this.to) {
    //   return toCondition;
    // }
    return false;
  }
  partition(items: CalendarNodeItem[]): CalendarNodeItem[][] {
    const result: CalendarNodeItem[][] = [];
    const mapped = [].concat.apply(
      [],
      items.map((elem, i) => {
        return i % 7 ? [] : [items.slice(i, i + 7)];
      }),
    );

    for (let i = 0; i < 7; i++) {
      result[i] = mapped.map(m => m[i]);
    }
    return result;
  }
  reset() {
    this.state = {
      days: [],
      mode: null,
      rtl: false,
      tempYears: [],
    };
  }
  truncateTime(date: IDateTimeProperties): string {
    return `${date.Year}/${NumberHelpers.pad(
      date.Month,
      2,
    )}/${NumberHelpers.pad(date.Day, 2)}`;
  }
  paintDays() {
    let i;
    this.model.forEach(t => {
      t.dueAtFormatted = this.converter.Format(t.dueAt, 'YYYY/MM/DD');
    });
    const cultured = this.converter.FromDateTime(this.beginDate);
    const daysInMonth = this.calendar.daysInMonths[cultured.Month - 1];
    const result: CalendarNodeItem[] = [];
    const currentMonthIndex = this.temp.month - 1;
    const prevMonthIndex = currentMonthIndex === 0 ? 11 : currentMonthIndex - 1;
    const prevMonthDays = this.calendar.daysInMonths[prevMonthIndex];
    const currentMonthDays = this.calendar.daysInMonths[currentMonthIndex];
    const nextMonthIndex = currentMonthIndex === 11 ? 0 : currentMonthIndex + 1;
    const nextYear = nextMonthIndex === 0 ? this.temp.year + 1 : this.temp.year;
    const prevYear =
      prevMonthIndex === 11 ? this.temp.year - 1 : this.temp.year;
    const dayIndex = this.converter
      .ToDateTime({
        Year: this.temp.year,
        Month: this.temp.month,
        Day: 1,
      })
      .getDay();

    let gap = this.calendar.weekMap[dayIndex];
    if (gap === 7) {
      gap = 0;
    }

    for (i = 0; i < gap; i += 1) {
      const culturedScoped = this.converter.Parse({
        Year: prevYear,
        Month: prevMonthIndex + 1,
        Day: prevMonthDays - gap + i + 1,
      });
      const str = this.truncateTime(culturedScoped);
      result.push({
        year: prevYear,
        month: prevMonthIndex + 1,
        day: prevMonthDays - gap + i + 1,
        old: true,
        disabled: this.calculateDisabled(
          prevYear,
          prevMonthIndex + 1,
          prevMonthDays - gap + i + 1,
        ),
        date: null,
        week: culturedScoped.WeekName,
        tasks: this.model.filter(t => t.dueAtFormatted === str),
      });
    }
    for (i = 1; i <= currentMonthDays; i += 1) {
      const culturedScoped = this.converter.Parse({
        Year: this.temp.year,
        Month: this.temp.month,
        Day: i,
      });
      const str = this.truncateTime(culturedScoped);
      result.push({
        year: this.temp.year,
        month: this.temp.month,
        day: i,
        old: false,
        disabled: this.calculateDisabled(this.temp.year, this.temp.month, i),
        date: null,
        week: culturedScoped.WeekName,
        tasks: this.model.filter(t => t.dueAtFormatted === str),
      });
    }
    const remaining = 7 - (result.length % 7);
    if (remaining) {
      for (i = 1; i <= remaining; i += 1) {
        const culturedScoped = this.converter.Parse({
          Year: nextYear,
          Month: nextMonthIndex + 1,
          Day: i,
        });
        const str = this.truncateTime(culturedScoped);
        result.push({
          year: nextYear,
          month: nextMonthIndex + 1,
          day: i,
          old: true,
          disabled: this.calculateDisabled(nextYear, nextMonthIndex + 1, i),
          date: null,
          week: culturedScoped.WeekName,
          tasks: this.model.filter(t => t.dueAtFormatted === str),
        });
      }
    }
    this.state.days = this.partition(result);
  }
}
