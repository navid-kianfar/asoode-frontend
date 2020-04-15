import { IDateConverter, IDateTimeProperties } from './date-contracts';
import * as PersianDate from 'persian-date';
import { NumberHelpers } from '../../../helpers/number.helpers';

export default class PersianDateConverter implements IDateConverter {
  IsValid(date: string | IDateTimeProperties): boolean {
    throw new Error('Method not implemented.');
  }

  private innerParse(date: IDateTimeProperties): PersianDate {
    const persian = new PersianDate([date.Year, date.Month, date.Day]);
    if (date.Hours !== undefined) { persian.hour(date.Hours); }
    if (date.Minutes !== undefined) { persian.minutes(date.Minutes); }
    if (date.Seconds !== undefined) { persian.seconds(date.Seconds); }
    return persian;
  }

  Parse(date: IDateTimeProperties): IDateTimeProperties {
    const persian = this.innerParse(date);
    return {
      Year: persian.year(),
      Month: persian.month(),
      Day: persian.date(),
      Hours: persian.hour(),
      Minutes: persian.minutes(),
      Seconds: persian.seconds(),
      Milliseconds: 0,
      MonthName: persian.format('MMMM'),
      WeekName: persian.format('dddd'),
      Date: persian.toDate(),
    } as IDateTimeProperties;
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
      .replace(/NNN/g, converted.MonthName);
  }
  ToDateTime(date: IDateTimeProperties): Date {
    return this.innerParse(date).toDate();
  }

  FromDateTime(date: Date): IDateTimeProperties {
    date = new Date(date);
    const persian = new PersianDate(date);
    return {
      Year: persian.year(),
      Month: persian.month(),
      Day: persian.date(),
      Hours: persian.hour(),
      Minutes: persian.minutes(),
      Seconds: persian.seconds(),
      Milliseconds: 0,
      MonthName: persian.format('MMMM'),
      WeekName: persian.format('dddd'),
      Date: date,
    } as IDateTimeProperties;
  }

  Now(): IDateTimeProperties {
    return this.FromDateTime(new Date());
  }
}
