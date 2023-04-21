import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CulturedDateService } from '../../services/cultured-date.service';
import { IDateConverter } from '../../lib/date-time/date-contracts';
import { DurationMode } from '../../lib/enums/enums';

@Component({
  selector: 'app-duration-picker',
  templateUrl: './duration-picker.component.html',
  styleUrls: ['./duration-picker.component.scss'],
})
export class DurationPickerComponent implements OnInit {
  @Input() mode: DurationMode;
  @Input() format: string;
  @Input() model: Date;
  @Input() endDate: Date;
  @Output() modelChange = new EventEmitter<Date>();
  @Output() endDateChange = new EventEmitter<Date>();
  converter: IDateConverter;
  constructor(readonly culturedDateService: CulturedDateService) {}

  ngOnInit() {
    this.model = this.model || new Date();
    this.mode = this.mode || DurationMode.Month;
    this.format = this.format || 'NNN YYYY';
    this.converter = this.culturedDateService.Converter();
    this.paint();
  }
  paint() {
    switch (this.mode) {
      case DurationMode.Day:
        this.day();
        break;
      case DurationMode.Week:
        this.week();
        break;
      case DurationMode.Month:
        this.month();
        break;
    }
  }
  today() {
    this.model = new Date();
    this.modelChange.emit(this.model);
  }

  month() {
    const parsed = this.converter.FromDateTime(this.model);
    this.model = this.converter.ToDateTime({
      Year: parsed.Year,
      Month: parsed.Month,
      Day: 1,
      Hours: 0,
      Minutes: 0,
    });
    const lastDayInMonth = this.culturedDateService.cultureService.current
      .daysInMonths[parsed.Month - 1];
    this.endDate = this.converter.ToDateTime({
      Year: parsed.Year,
      Month: parsed.Month,
      Day: lastDayInMonth,
      Hours: 23,
      Minutes: 59,
    });
    this.modelChange.emit(this.model);
    this.endDateChange.emit(this.endDate);
  }

  nextMonth() {
    const parsed = this.converter.FromDateTime(this.model);
    let year = parsed.Year;
    let month = parsed.Month + 1;
    if (month === 13) {
      month = 1;
      year++;
    }
    this.model = this.converter.ToDateTime({
      Year: year,
      Month: month,
      Day: 1,
      Hours: 0,
      Minutes: 0,
    });
    this.month();
  }

  prevMonth() {
    const parsed = this.converter.FromDateTime(this.model);
    let year = parsed.Year;
    let month = parsed.Month - 1;
    if (month === 0) {
      month = 12;
      year--;
    }
    this.model = this.converter.ToDateTime({
      Year: year,
      Month: month,
      Day: 1,
      Hours: 0,
      Minutes: 0,
    });
    this.month();
  }

  day() {
    const parsed = this.converter.FromDateTime(this.model);
    this.model = this.converter.ToDateTime({
      Year: parsed.Year,
      Month: parsed.Month,
      Day: parsed.Day,
      Hours: 0,
      Minutes: 0,
    });
    this.endDate = this.converter.ToDateTime({
      Year: parsed.Year,
      Month: parsed.Month,
      Day: parsed.Day,
      Hours: 23,
      Minutes: 59,
    });
    this.modelChange.emit(this.model);
    this.endDateChange.emit(this.endDate);
  }

  nextDay() {
    this.model.setDate(this.model.getDate() + 1);
    this.day();
  }

  prevDay() {
    this.model.setDate(this.model.getDate() - 1);
    this.day();
  }

  week() {
    const parsed = this.converter.FromDateTime(this.model);
    this.model = this.converter.ToDateTime({
      Year: parsed.Year,
      Month: parsed.Month,
      Day: parsed.Day,
      Hours: 0,
      Minutes: 0,
    });
    this.endDate = new Date(this.model);
    this.endDate.setDate(this.endDate.getDate() + 7);
    this.endDate.setSeconds(this.endDate.getSeconds() - 1);
    this.modelChange.emit(this.model);
    this.endDateChange.emit(this.endDate);
  }

  prevWeek() {
    this.model.setDate(this.model.getDate() - 7);
    this.week();
  }

  nextWeek() {
    this.model.setDate(this.model.getDate() + 7);
    this.week();
  }

  next() {
    switch (this.mode) {
      case DurationMode.Day:
        this.nextDay();
        break;
      case DurationMode.Week:
        this.nextWeek();
        break;
      case DurationMode.Month:
        this.nextMonth();
        break;
    }
  }

  prev() {
    switch (this.mode) {
      case DurationMode.Day:
        this.prevDay();
        break;
      case DurationMode.Week:
        this.prevWeek();
        break;
      case DurationMode.Month:
        this.prevMonth();
        break;
    }
  }
}
