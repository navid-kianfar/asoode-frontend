import { DateAdapter } from '@angular/material/core';
import * as gregorianMoment from 'moment';
import * as jalaliMoment from 'jalali-moment';
import * as hijriMoment from 'moment-hijri';
import { environment } from '../../../../environments/environment';

export const PERSIAN_DATE_FORMATS = {
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
export const HIJRI_DATE_FORMATS = {
  parse: {
    dateInput: 'iYYYY/iMM/iDD',
  },
  display: {
    dateInput: 'iYYYY/iMM/iDD',
    monthYearLabel: 'iYYYY iMMMM',
    dateA11yLabel: 'iYYYY/iMM/iDD',
    monthYearA11yLabel: 'iYYYY iMMM',
  },
};
export const GREGORIAN_DATE_FORMATS = {
  parse: {
    dateInput: 'YYYY/MM/DD',
  },
  display: {
    dateInput: 'YYYY/MM/DD',
    monthYearLabel: 'YYYY MMMM',
    dateA11yLabel: 'YYYY/MM/DD',
    monthYearA11yLabel: 'YYYY MMMM',
  },
};

// tslint:disable-next-line:typedef
export function CulturedDateFactory() {
  switch (environment.lang) {
    case 'fa':
      return new PersianDateAdapter();
    case 'ar':
      return new HijriDateAdapter();
    default:
      return new GregorianDateAdapter();
  }
}

// tslint:disable-next-line:typedef
export function CulturedDateFormatsFactory() {
  switch (environment.lang) {
    case 'fa':
      return PERSIAN_DATE_FORMATS;
    case 'ar':
      return HIJRI_DATE_FORMATS;
    default:
      return GREGORIAN_DATE_FORMATS;
  }
}

export class PersianDateAdapter extends DateAdapter<jalaliMoment.Moment> {
  constructor() {
    super();
    super.setLocale('fa');
  }
  getYear(date: jalaliMoment.Moment): number {
    return this.clone(date).jYear();
  }

  getMonth(date: jalaliMoment.Moment): number {
    return this.clone(date).jMonth();
  }

  getDate(date: jalaliMoment.Moment): number {
    return this.clone(date).jDate();
  }

  getDayOfWeek(date: jalaliMoment.Moment): number {
    return this.clone(date).day();
  }

  getMonthNames(style: 'long' | 'short' | 'narrow'): string[] {
    switch (style) {
      case 'long':
      case 'short':
        return jalaliMoment
          .localeData('fa')
          .jMonths()
          .slice(0);
      case 'narrow':
        return jalaliMoment
          .localeData('fa')
          .jMonthsShort()
          .slice(0);
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
        return jalaliMoment
          .localeData('fa')
          .weekdays()
          .slice(0);
      case 'short':
        return jalaliMoment
          .localeData('fa')
          .weekdaysShort()
          .slice(0);
      case 'narrow':
        return ['ی', 'د', 'س', 'چ', 'پ', 'ج', 'ش'];
    }
  }

  getYearName(date: jalaliMoment.Moment): string {
    return this.clone(date)
      .jYear()
      .toString();
  }

  getFirstDayOfWeek(): number {
    return jalaliMoment.localeData('fa').firstDayOfWeek();
  }

  getNumDaysInMonth(date: jalaliMoment.Moment): number {
    return this.clone(date).jDaysInMonth();
  }

  clone(date: jalaliMoment.Moment): jalaliMoment.Moment {
    return date.clone().locale('fa');
  }

  createDate(year: number, month: number, date: number): jalaliMoment.Moment {
    if (month < 0 || month > 11) {
      throw Error(
        `Invalid month index "${month}". Month index has to be between 0 and 11.`,
      );
    }
    if (date < 1) {
      throw Error(`Invalid date "${date}". Date has to be greater than 0.`);
    }

    month = month || 1;

    const result = jalaliMoment()
      .jYear(year)
      .jMonth(month)
      .jDate(date)
      .hours(0)
      .minutes(0)
      .seconds(0)
      .milliseconds(0)
      .locale('fa');

    // if (this.getMonth(result) !== month) {
    //   debugger;
    //   throw Error(`Invalid date ${date} for month with index ${month}.`);
    // }
    if (!result.isValid()) {
      throw Error(`Invalid date "${date}" for month with index "${month}".`);
    }
    return result;
  }

  today(): jalaliMoment.Moment {
    return jalaliMoment().locale('fa');
  }

  parse(
    value: any,
    parseFormat: string | string[],
  ): jalaliMoment.Moment | null {
    if (value && typeof value === 'string') {
      return jalaliMoment(value, parseFormat, 'fa');
    }
    return value ? jalaliMoment(value).locale('fa') : null;
  }

  format(date: jalaliMoment.Moment, displayFormat: string): string {
    date = this.clone(date);
    if (!this.isValid(date)) {
      throw Error('JalaliMomentDateAdapter: Cannot format invalid date.');
    }
    return date.format(displayFormat);
  }

  addCalendarYears(
    date: jalaliMoment.Moment,
    years: number,
  ): jalaliMoment.Moment {
    return this.clone(date).add(years, 'jYear');
  }

  addCalendarMonths(
    date: jalaliMoment.Moment,
    months: number,
  ): jalaliMoment.Moment {
    return this.clone(date).add(months, 'jmonth');
  }

  addCalendarDays(
    date: jalaliMoment.Moment,
    days: number,
  ): jalaliMoment.Moment {
    return this.clone(date).add(days, 'jDay');
  }

  toIso8601(date: jalaliMoment.Moment): string {
    return this.clone(date).format();
  }

  isDateInstance(obj: any): boolean {
    return jalaliMoment.isMoment(obj);
  }

  isValid(date: jalaliMoment.Moment): boolean {
    return this.clone(date).isValid();
  }

  invalid(): jalaliMoment.Moment {
    return jalaliMoment.invalid();
  }

  deserialize(value: any): jalaliMoment.Moment | null {
    let date;
    if (value instanceof Date) {
      date = jalaliMoment(value);
    }
    if (typeof value === 'string') {
      if (!value) {
        return null;
      }
      date = jalaliMoment(value).locale('fa');
    }
    if (date && this.isValid(date)) {
      return date;
    }
    return super.deserialize(value);
  }
}

export class HijriDateAdapter extends DateAdapter<hijriMoment.Moment> {
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

export class GregorianDateAdapter extends DateAdapter<gregorianMoment.Moment> {
  constructor() {
    super();
    super.setLocale('en');
  }
  getYear(date: gregorianMoment.Moment): number {
    return this.clone(date).year();
  }

  getMonth(date: gregorianMoment.Moment): number {
    return this.clone(date).month();
  }

  getDate(date: gregorianMoment.Moment): number {
    return this.clone(date).date();
  }

  getDayOfWeek(date: gregorianMoment.Moment): number {
    return this.clone(date).day();
  }

  getMonthNames(style: 'long' | 'short' | 'narrow'): string[] {
    switch (style) {
      case 'long':
      case 'short':
        return gregorianMoment.months().slice(0);
      case 'narrow':
        return gregorianMoment.monthsShort().slice(0);
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
        return gregorianMoment.weekdays().slice(0);
      case 'short':
        return gregorianMoment.weekdaysShort().slice(0);
      case 'narrow':
        return ['Su', 'Mo', 'Th', 'Wed', 'Thr', 'Fr', 'Sa'];
    }
  }

  getYearName(date: gregorianMoment.Moment): string {
    return this.clone(date)
      .year()
      .toString();
  }

  getFirstDayOfWeek(): number {
    return gregorianMoment.localeData('en').firstDayOfWeek();
  }

  getNumDaysInMonth(date: gregorianMoment.Moment): number {
    return this.clone(date).daysInMonth();
  }

  clone(date: gregorianMoment.Moment): gregorianMoment.Moment {
    return date.clone().locale('en');
  }

  createDate(
    year: number,
    month: number,
    date: number,
  ): gregorianMoment.Moment {
    if (month < 0 || month > 11) {
      throw Error(
        `Invalid month index "${month}". Month index has to be between 0 and 11.`,
      );
    }
    if (date < 1) {
      throw Error(`Invalid date "${date}". Date has to be greater than 0.`);
    }

    month = month || 1;

    const result = gregorianMoment()
      .year(year)
      .month(month)
      .date(date)
      .hours(0)
      .minutes(0)
      .seconds(0)
      .milliseconds(0)
      .locale('fa');

    // if (this.getMonth(result) !== month) {
    //   debugger;
    //   throw Error(`Invalid date ${date} for month with index ${month}.`);
    // }
    if (!result.isValid()) {
      throw Error(`Invalid date "${date}" for month with index "${month}".`);
    }
    return result;
  }

  today(): gregorianMoment.Moment {
    return gregorianMoment().locale('en');
  }

  parse(
    value: any,
    parseFormat: string | string[],
  ): gregorianMoment.Moment | null {
    if (value && typeof value === 'string') {
      return gregorianMoment(value, parseFormat, 'en');
    }
    return value ? gregorianMoment(value).locale('en') : null;
  }

  format(date: gregorianMoment.Moment, displayFormat: string): string {
    date = this.clone(date);
    if (!this.isValid(date)) {
      throw Error('JalaliMomentDateAdapter: Cannot format invalid date.');
    }
    return date.format(displayFormat);
  }

  addCalendarYears(
    date: gregorianMoment.Moment,
    years: number,
  ): gregorianMoment.Moment {
    return this.clone(date).add(years, 'year');
  }

  addCalendarMonths(
    date: gregorianMoment.Moment,
    months: number,
  ): gregorianMoment.Moment {
    return this.clone(date).add(months, 'month');
  }

  addCalendarDays(
    date: gregorianMoment.Moment,
    days: number,
  ): gregorianMoment.Moment {
    return this.clone(date).add(days, 'day');
  }

  toIso8601(date: gregorianMoment.Moment): string {
    return this.clone(date).format();
  }

  isDateInstance(obj: any): boolean {
    return gregorianMoment.isMoment(obj);
  }

  isValid(date: gregorianMoment.Moment): boolean {
    return this.clone(date).isValid();
  }

  invalid(): gregorianMoment.Moment {
    return gregorianMoment.invalid();
  }

  deserialize(value: any): gregorianMoment.Moment | null {
    let date;
    if (value instanceof Date) {
      date = gregorianMoment(value);
    }
    if (typeof value === 'string') {
      if (!value) {
        return null;
      }
      date = gregorianMoment(value).locale('en');
    }
    if (date && this.isValid(date)) {
      return date;
    }
    return super.deserialize(value);
  }
}
