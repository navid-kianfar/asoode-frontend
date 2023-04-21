import { DateAdapter } from '@angular/material/core';
import * as hijriMoment from 'moment-hijri';

export const HIJRI_DATE_FORMATS = {
  parse: {
    dateInput: 'jYYYY/jMM/jDD',
  },
  display: {
    dateInput: 'jYYYY/jMM/jDD',
    monthYearLabel: 'jYYYY jMMMM',
    dateA11yLabel: 'jYYYY/jMM/jDD',
    monthYearA11yLabel: 'jYYYY jMMMM',
  },
};

export class MaterialHijriDateAdapter extends DateAdapter<hijriMoment.Moment> {
  constructor() {
    super();
    super.setLocale('ar');
  }
  getYear(date: hijriMoment.Moment): number {
    return this.clone(date).iYear();
  }

  getMonth(date: hijriMoment.Moment): number {
    return this.clone(date).iMonth();
  }

  getDate(date: hijriMoment.Moment): number {
    return this.clone(date).iDate();
  }

  getDayOfWeek(date: hijriMoment.Moment): number {
    return this.clone(date).day();
  }

  getMonthNames(style: 'long' | 'short' | 'narrow'): string[] {
    switch (style) {
      case 'long':
      case 'short':
        return [
          'مُحَرَّم',
          'صَفَر',
          'رَبيع الأوّل',
          'رَبيع الثاني',
          'جُمادى الأولى',
          'جُمادى الآخرة',
          'رَجَب',
          'شَعْبان',
          'رَمَضان',
          'شَوّال',
          'ذو القعدة',
          'ذو الحجة',
        ];
      case 'narrow':
        return [
          'مُحَرَّم',
          'صَفَر',
          'رَبيع الأوّل',
          'رَبيع الثاني',
          'جُمادى الأولى',
          'جُمادى الآخرة',
          'رَجَب',
          'شَعْبان',
          'رَمَضان',
          'شَوّال',
          'ذو القعدة',
          'ذو الحجة',
        ];
    }
  }

  getDateNames(): string[] {
    const valuesArray = Array(31);
    for (let i = 0; i < 31; i++) {
      valuesArray[i] = String(i + 1);
    }
    return valuesArray;
  }

  getDayOfWeekNames(style: 'long' | 'short' | 'narrow'): string[] {
    switch (style) {
      case 'long':
      case 'short':
        return [
          'الأحد',
          'الإثنين',
          'الثلاثاء',
          'الأربعاء',
          'الخميس',
          'الجمعة',
          'السبت',
        ];
      case 'narrow':
        return ['أح', 'إث', 'ثل', 'أر', 'خم', 'جم', 'سب'];
    }
  }

  getYearName(date: hijriMoment.Moment): string {
    return this.clone(date)
      .iYear()
      .toString();
  }

  getFirstDayOfWeek(): number {
    return hijriMoment.localeData('ar').firstDayOfWeek();
  }

  getNumDaysInMonth(date: hijriMoment.Moment): number {
    return this.clone(date)
      .endOf('iMonth')
      .iDate();
  }

  clone(date: hijriMoment.Moment): hijriMoment.Moment {
    return date.clone();
  }

  createDate(year: number, month: number, date: number): hijriMoment.Moment {
    if (month < 0 || month > 11) {
      throw Error(
        `Invalid month index "${month}". Month index has to be between 0 and 11.`,
      );
    }
    if (date < 1) {
      throw Error(`Invalid date "${date}". Date has to be greater than 0.`);
    }
    const result = hijriMoment()
      .iYear(year)
      .iMonth(month)
      .iDate(date)
      .hours(0)
      .minutes(0)
      .seconds(0)
      .milliseconds(0)
      .locale('ar');

    if (this.getMonth(result) !== month) {
      throw Error(`Invalid date ${date} for month with index ${month}.`);
    }
    if (!result.isValid()) {
      throw Error(`Invalid date "${date}" for month with index "${month}".`);
    }
    return result;
  }

  today(): hijriMoment.Moment {
    return hijriMoment().locale('ar');
  }

  parse(value: any, parseFormat: string | string[]): hijriMoment.Moment | null {
    if (value && typeof value === 'string') {
      return hijriMoment(value, parseFormat, 'ar');
    }
    return value ? hijriMoment(value).locale('ar') : null;
  }

  format(date: hijriMoment.Moment, displayFormat: string): string {
    date = this.clone(date);
    if (!this.isValid(date)) {
      throw Error('hijriMomentDateAdapter: Cannot format invalid date.');
    }
    return date.format(displayFormat);
  }

  addCalendarYears(
    date: hijriMoment.Moment,
    years: number,
  ): hijriMoment.Moment {
    return this.clone(date).add(years, 'iYear');
  }

  addCalendarMonths(
    date: hijriMoment.Moment,
    months: number,
  ): hijriMoment.Moment {
    return this.clone(date).add(months, 'iMonth');
  }

  addCalendarDays(date: hijriMoment.Moment, days: number): hijriMoment.Moment {
    return (this.clone(date) as any).add(days, 'jDay');
  }

  toIso8601(date: hijriMoment.Moment): string {
    return this.clone(date).format();
  }

  isDateInstance(obj: any): boolean {
    return hijriMoment.isMoment(obj);
  }

  isValid(date: hijriMoment.Moment): boolean {
    return this.clone(date).isValid();
  }

  invalid(): hijriMoment.Moment {
    return hijriMoment.invalid();
  }

  deserialize(value: any): hijriMoment.Moment | null {
    let date;
    if (value instanceof Date) {
      date = hijriMoment(value);
    }
    if (typeof value === 'string') {
      if (!value) {
        return null;
      }
      date = hijriMoment(value).locale('ar');
    }
    if (date && this.isValid(date)) {
      return date;
    }
    return super.deserialize(value);
  }
}
