import { IDateConverter, IDateTimeProperties } from './date-contracts';
import HijriDate, { toHijri } from 'hijri-date/lib/safe';
import { NumberHelpers } from '../../../helpers/number.helpers';

export default class HijriDateConverter implements IDateConverter {
  IsValid(date: string | IDateTimeProperties): boolean {
    throw new Error('Method not implemented.');
  }

  private innerParse(date: IDateTimeProperties): HijriDate {
    return new HijriDate(
      date.Year,
      date.Month,
      date.Day,
      date.Hours,
      date.Minutes,
    );
  }

  Parse(date: IDateTimeProperties): IDateTimeProperties {
    const hijri = this.innerParse(date);
    return {
      Year: hijri.year,
      Month: hijri.month,
      Day: hijri.date,
      Hours: hijri.hours,
      Minutes: hijri.minutes,
      Seconds: hijri.seconds,
      Milliseconds: hijri.milliseconds,
      MonthName: hijri.format('MMMM'),
      WeekName: hijri.format('ddd'),
      Date: new Date(hijri.toGregorian()),
    } as IDateTimeProperties;
  }

  ToDateTime(date: IDateTimeProperties): Date {
    const hijri = this.innerParse(date);
    return new Date(hijri.toGregorian());
  }

  Now(): IDateTimeProperties {
    return this.FromDateTime(new Date());
  }
  FromDateTime(date: Date): IDateTimeProperties {
    date = new Date(date);
    const hijri = toHijri(date);
    return {
      Year: hijri.year,
      Month: hijri.month,
      Day: hijri.date,
      Hours: hijri.hours,
      Minutes: hijri.minutes,
      Seconds: hijri.seconds,
      Milliseconds: hijri.milliseconds,
      MonthName: hijri.format('MMMM'),
      WeekName: hijri.format('ddd'),
      Date: date,
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
        NumberHelpers.pad(converted.Hours > 12 ? converted.Hours - 12 : converted.Hours, 2),
      )
      .replace(/HH/g, NumberHelpers.pad(converted.Hours, 2))
      .replace(/mm/g, NumberHelpers.pad(converted.Minutes, 2))
      .replace(/ss/g, NumberHelpers.pad(converted.Seconds, 2))
      .replace(/ll/g, NumberHelpers.pad(converted.Milliseconds, 2))
      .replace(/AP/g, converted.Hours > 12 ? 'PM' : 'AM')
      .replace(/NNN/g, converted.MonthName);
  }
}
