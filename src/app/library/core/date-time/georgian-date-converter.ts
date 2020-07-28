import { IDateConverter, IDateTimeProperties } from './date-contracts';
import * as PersianDate from 'persian-date';
import { NumberHelpers } from '../../../helpers/number.helpers';

export default class GeorgianDateConverter implements IDateConverter {
  IsValid(date: string | IDateTimeProperties): boolean {
    throw new Error('Method not implemented.');
  }

  Format(date: Date, format: string): string {
    const converted = this.FromDateTime(date);
    return (format || '')
      .replace(/YYYY/g, NumberHelpers.pad(converted.Year, 4))
      .replace(/YY/g, NumberHelpers.pad(converted.Year % 100, 2))
      .replace(/MM/g, NumberHelpers.pad(converted.Month, 2))
      .replace(/M/g, converted.Month.toString())
      .replace(/DD/g, NumberHelpers.pad(converted.Day, 2))
      .replace(/D/g, converted.Day.toString())
      .replace(
        /hh/g,
        NumberHelpers.pad(
          converted.Hours > 12 ? converted.Hours - 12 : converted.Hours,
          2,
        ),
      )
      .replace(/HH/g, NumberHelpers.pad(converted.Hours, 2))
      .replace(/mm/g, NumberHelpers.pad(converted.Minutes, 2))
      .replace(/ss/g, NumberHelpers.pad(converted.Seconds, 2))
      .replace(/ll/g, NumberHelpers.pad(converted.Milliseconds, 2))
      .replace(/AP/g, converted.Hours > 12 ? 'PM' : 'AM')
      .replace(/NNN/g, converted.MonthName)
      .replace(/WW/g, converted.WeekName);
  }
  private innerParse(date: IDateTimeProperties): PersianDate {
    const temp = new Date(date.Year, date.Month - 1, date.Day);
    const gregorian = new PersianDate(temp)
      .toCalendar('gregorian')
      .toLocale('en');
    if (date.Hours !== undefined) {
      gregorian.hour(date.Hours);
    }
    if (date.Minutes !== undefined) {
      gregorian.minutes(date.Minutes);
    }
    if (date.Seconds !== undefined) {
      gregorian.seconds(date.Seconds);
    }
    return gregorian;
  }

  Parse(date: IDateTimeProperties): IDateTimeProperties {
    const gregorian = this.innerParse(date);
    return {
      Year: gregorian.year(),
      Month: gregorian.month(),
      Day: gregorian.date(),
      Hours: gregorian.hour(),
      Minutes: gregorian.minutes(),
      Seconds: gregorian.seconds(),
      Milliseconds: 0,
      MonthName: gregorian.format('MMMM'),
      WeekName: gregorian.format('dddd'),
      Date: gregorian.toDate(),
    } as IDateTimeProperties;
  }

  ToDateTime(date: IDateTimeProperties): Date {
    const gregorian = this.innerParse(date);
    return gregorian.toDate();
  }

  FromDateTime(date: Date): IDateTimeProperties {
    date = new Date(date);
    const gregorian = new PersianDate(date)
      .toCalendar('gregorian')
      .toLocale('en');
    return {
      Year: gregorian.year(),
      Month: gregorian.month(),
      Day: gregorian.date(),
      Hours: gregorian.hour(),
      Minutes: gregorian.minutes(),
      Seconds: gregorian.seconds(),
      Milliseconds: 0,
      MonthName: gregorian.format('MMMM'),
      WeekName: gregorian.format('dddd'),
      Date: date,
    } as IDateTimeProperties;
  }

  Now(): IDateTimeProperties {
    return this.FromDateTime(new Date());
  }
}
