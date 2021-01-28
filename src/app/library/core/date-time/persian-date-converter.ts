import { IDateConverter, IDateTimeProperties } from './date-contracts';
import { NumberHelpers } from '../../../helpers/number.helpers';
import * as jalaliMoment from 'jalali-moment';
const INVALID_DATE = '0001-01-01T00:00:00Z';

export default class PersianDateConverter implements IDateConverter {

  IsValid(date: string | IDateTimeProperties): boolean {
    if (typeof date === 'string') {
      return jalaliMoment(date).isValid();
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
      Year: gregorian.jYear(),
      Month: gregorian.jMonth() + 1,
      Day: gregorian.jDate(),
      Hours: gregorian.hour(),
      Minutes: gregorian.minutes(),
      Seconds: gregorian.seconds(),
      Milliseconds: 0,
      MonthName: gregorian.format('MMMM'),
      WeekName: gregorian.format('dddd'),
      Date: gregorian.toDate(),
    } as IDateTimeProperties;
  }

  innerConvert(date: IDateTimeProperties): jalaliMoment.Moment {
    const result = jalaliMoment()
      .locale('fa')
      .jYear(date.Year)
      .jMonth(date.Month - 1)
      .jDate(date.Day);

    result.hours(date.Hours);
    result.minutes(date.Minutes);
    result.seconds(date.Seconds);
    result.milliseconds(date.Milliseconds);
    return result;
  }

  ToDateTime(date: IDateTimeProperties): Date {
    const gregorian = this.innerConvert(date);
    return gregorian.toDate();
  }

  FromDateTime(date: Date | string): IDateTimeProperties {
    const defaultDate = new Date(2019, 0, 1);
    date = date === INVALID_DATE ? new Date(date) : defaultDate;
    let gregorian = jalaliMoment(date.toISOString()).locale('fa');
    if (!gregorian.isValid()) {
      date = defaultDate;
      gregorian = jalaliMoment(date.toISOString()).locale('fa');
    }

    return {
      Year: gregorian.jYear(),
      Month: gregorian.jMonth() + 1,
      Day: gregorian.jDate(),
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
