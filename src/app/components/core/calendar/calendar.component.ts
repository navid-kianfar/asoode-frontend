import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ICulture } from '../../../view-models/core/date-types';
import { CultureService } from '../../../services/core/culture.service';
import {
  IDateConverter,
  IDateEvent,
  IDateTimeProperties,
} from '../../../library/core/date-time/date-contracts';
import PersianDateConverter from '../../../library/core/date-time/persian-date-converter';
import HijriDateConverter from '../../../library/core/date-time/hijri-date-converter';
import GeorgianDateConverter from '../../../library/core/date-time/georgian-date-converter';
import { DateHelpers } from '../../../helpers/date.helpers';
import { CulturedDateService } from '../../../services/core/cultured-date.service';
import {NumberHelpers} from '../../../helpers/number.helpers';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit, OnChanges {
  initialized: boolean;
  converter: IDateConverter;
  today: CalendarNodeItem;
  current: CalendarNodeItem;
  temp: CalendarNodeItem;
  state: CalendarState;
  calendar: ICulture;
  @Input() events: IDateEvent[];
  @Input() cssClass: string;
  @Input() dateField: string;
  @Input() culture: string;
  @Input() disabled: boolean;
  @Input() allowNull: boolean;
  @Input() pickButton: boolean;
  @Input() plateOpen: boolean;
  @Input() monthView: boolean;
  @Input() model: Date;
  @Input() from: Date;
  @Input() to: Date;
  @Output() formattedDate = new EventEmitter<string>();
  @Output() hourChange = new EventEmitter<number>();
  @Output() minuteChange = new EventEmitter<number>();
  @Output() modelChange = new EventEmitter<Date>();
  constructor(readonly culturedDateService: CulturedDateService) {
    this.reset();
  }
  ngOnInit(skip?: boolean) {
    const now = new Date();
    this.calendar = this.culturedDateService.Calendar();
    this.converter = this.culturedDateService.Converter();
    this.culture = this.calendar.lang;
    this.state.rtl = this.calendar.rtl;
    this.today = this.parseFormDate(now);
    const start = new Date(this.model || this.from || this.to || now);
    this.current = this.parseFormDate(start);

    this.temp = { ...this.current };
    if (!skip && !this.allowNull) {
      this.model = this.current.date;
    }
    this.switch('days');
    this.initialized = true;
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.model && !changes.model.firstChange) {
      this.ngOnInit(false);
      return;
    }

    if (changes.events && !changes.events.firstChange) {
      if (this.state.mode === 'days') {
        this.repaint();
      }
    }
  }
  get monthName(): string {
    return this.calendar.monthNames[this.temp.month - 1];
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
  partition(items: CalendarNodeItem[]): CalendarNodeItem[][] {
    return [].concat.apply(
      [],
      items.map((elem, i) => {
        return i % 7 ? [] : [items.slice(i, i + 7)];
      }),
    );
  }
  reset() {
    this.state = {
      days: [],
      mode: null,
      rtl: false,
      tempYears: [],
    };
  }
  parseFormDate(date: Date): CalendarNodeItem {
    const converted = this.converter.FromDateTime(date);
    this.formattedDate.emit(
      `${converted.Year}/${NumberHelpers.pad(converted.Month, 2)}/${NumberHelpers.pad(converted.Day, 2)}`,
    );
    return this.convert(converted);
  }
  parseFromValues(year: number, month: number, day: number): CalendarNodeItem {
    let converted: IDateTimeProperties;
    switch (this.culture) {
      case 'fa':
        converted = new PersianDateConverter().Parse({
          Year: year,
          Month: month,
          Day: day,
        });
        break;
      case 'ar':
        converted = new HijriDateConverter().Parse({
          Year: year,
          Month: month,
          Day: day,
        });
        break;
      default:
        converted = new GeorgianDateConverter().Parse({
          Year: year,
          Month: month,
          Day: day,
        });
        break;
    }
    this.formattedDate.emit(
      `${converted.Year}/${converted.Month}/${converted.Day}`,
    );
    return this.convert(converted);
  }
  switch(mode: string) {
    if (this.initialized && this.disabled) {
      return;
    }
    this.state.mode = mode;
    this.repaint();
  }
  repaint() {
    switch (this.state.mode) {
      case 'days':
        this.paintDays();
        break;
      case 'years':
        this.paintYears();
        break;
      default:
        break;
    }
  }
  paintYears() {
    const result = [];
    for (let i = this.temp.year - 6; i <= this.temp.year + 5; i += 1) {
      result.push(i);
    }
    this.state.tempYears = result;
  }
  forwardMonth() {
    if (this.disabled) {
      return;
    }
    if (this.temp.month === 12) {
      this.temp.month = 1;
      this.temp.year += 1;
    } else {
      this.temp.month += 1;
    }
    this.paintDays();
  }
  backwardMonth() {
    if (this.disabled) {
      return;
    }
    if (this.temp.month === 1) {
      this.temp.month = 12;
      this.temp.year -= 1;
    } else {
      this.temp.month -= 1;
    }
    this.paintDays();
  }
  backwardYears(years: number) {
    if (this.disabled) {
      return;
    }
    this.temp.year += years;
    this.paintYears();
  }
  forwardYears(years: number) {
    if (this.disabled) {
      return;
    }
    this.temp.year -= years;
    this.paintYears();
  }
  updateYear(year: number) {
    if (this.disabled) {
      return;
    }
    this.update(year, this.temp.month, this.temp.day);
  }
  updateMonth(month: number) {
    if (this.disabled) {
      return;
    }
    this.update(this.temp.year, month, this.temp.day);
  }
  setToday() {
    if (this.disabled) {
      return;
    }
    this.update(this.today.year, this.today.month, this.today.day);
  }
  update(year: number, month: number, day: number) {
    if (this.disabled) {
      return;
    }
    this.temp = this.parseFromValues(year, month, day);
    if (!this.pickButton) {
      this.current = { ...this.temp };
      this.modelChange.emit(this.current.date);
    }
    this.repaint();
  }
  calculateClass(day: CalendarNodeItem) {
    let css = 'day ';
    if (day.old || day.disabled) {
      css += 'old ';
    }
    if (
      this.model &&
      day.year === this.current.year &&
      day.month === this.current.month &&
      day.day === this.current.day
    ) {
      css += 'active ';
    }
    return css;
  }
  calculateDisabled(year: number, month: number, day: number): boolean {
    const fromCondition =
      new Date(this.from).getTime() >
      this.converter
        .ToDateTime({
          Year: year,
          Month: month,
          Day: day,
        })
        .getTime();
    const toCondition =
      new Date(this.to).getTime() <
      this.converter
        .ToDateTime({
          Year: year,
          Month: month,
          Day: day,
        })
        .getTime();
    if (this.from && this.to) {
      return fromCondition && toCondition;
    }
    if (this.from) {
      return fromCondition;
    }
    if (this.to) {
      return toCondition;
    }
    return false;
  }
  paintDays() {
    let i;
    const cultured = this.converter.FromDateTime(this.model);
    const daysInMonth = this.calendar.daysInMonths[cultured.Month - 1];
    const grouped = this.groupCards();
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
      const str = this.truncateTime(culturedScoped.Date);
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
        events: grouped[str] || [],
      });
    }
    for (i = 1; i <= currentMonthDays; i += 1) {
      const culturedScoped = this.converter.Parse({
        Year: this.temp.year,
        Month: this.temp.month,
        Day: i,
      });
      const str = this.truncateTime(culturedScoped.Date);
      result.push({
        year: this.temp.year,
        month: this.temp.month,
        day: i,
        old: false,
        disabled: this.calculateDisabled(this.temp.year, this.temp.month, i),
        date: null,
        week: culturedScoped.WeekName,
        events: grouped[str] || [],
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
        const str = this.truncateTime(culturedScoped.Date);
        result.push({
          year: nextYear,
          month: nextMonthIndex + 1,
          day: i,
          old: true,
          disabled: this.calculateDisabled(nextYear, nextMonthIndex + 1, i),
          date: null,
          week: culturedScoped.WeekName,
          events: grouped[str] || [],
        });
      }
    }
    this.state.days = this.partition(result);
  }
  pick(day: CalendarNodeItem) {
    if (day.old && this.monthView) {
      return;
    }
    if (day.disabled || this.disabled) {
      return;
    }
    this.update(day.year, day.month, day.day);
  }
  truncateTime(date: Date): string {
    return DateHelpers.toIsoDateWithTimeZone(date).split('T')[0] + 'T12:00:00';
  }
  groupCards() {
    const result = {};
    (this.events || []).forEach(c => {
      c[this.dateField] = new Date(c[this.dateField]);
      const str = this.truncateTime(c[this.dateField]);
      result[str] = result[str] || [];
      result[str].push(c);
    });
    return result;
  }
  pickAndClose() {
    this.current = { ...this.temp };
    this.modelChange.emit(this.current.date);
  }
}

export interface CalendarState {
  tempYears: number[];
  rtl: boolean;
  days: CalendarNodeItem[][];
  mode: string;
}
export interface CalendarNodeItem {
  year: number;
  month: number;
  day: number;
  old: boolean;
  disabled: boolean;
  date: Date;
  week: string;
  events?: IDateEvent[];
}
