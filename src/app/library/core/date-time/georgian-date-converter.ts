import { IDateConverter, IDateTimeProperties } from './date-contracts';
import { NumberHelpers } from '../../../helpers/number.helpers';
import * as moment from 'moment';

export default class GeorgianDateConverter implements IDateConverter {
  innerConvert(date: IDateTimeProperties): any {
    const result = moment().locale('en')
      .year(date.Year)
      .month(date.Month)
      .date(date.Day);

    result.hours(date.Hours);
    result.minutes(date.Minutes);
    result.seconds(date.Seconds);
    result.milliseconds(date.Milliseconds);

    return result;
  }
  IsValid(date: string | IDateTimeProperties): boolean {
    if (typeof date === 'string') {
      return moment(date).isValid();
    }
    return this.innerConvert(date).isValid();
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

  Parse(date: IDateTimeProperties): IDateTimeProperties {
    const gregorian = this.innerConvert(date);
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
    const gregorian = this.innerConvert(date);
    return gregorian.toDate();
  }

  FromDateTime(date: Date): IDateTimeProperties {
    date = new Date(date);
    let gregorian = moment(date.toISOString()).locale('en');
    if (!gregorian.isValid()) {
      date = new Date(2019, 0, 1);
      gregorian = moment(date.toISOString()).locale('en');
    }
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
