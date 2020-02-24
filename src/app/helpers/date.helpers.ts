export class DateHelpers {
  static addDays(source: Date, input: number): Date {
    const date = this.copy(source);
    date.setDate(date.getDate() + input);
    return date;
  }
  // static addHours(source: Date, input: number): Date {
  //   const date = this.copy(source);
  //   date.setHours(date.getHours() + input);
  //   return date;
  // }
  // static addMinutes(source: Date, input: number): Date {
  //   const date = this.copy(source);
  //   date.setMinutes(date.getMinutes() + input);
  //   return date;
  // }
  // static addMonths(source: Date, input: number): Date {
  //   const date = this.copy(source);
  //   date.setMonth(date.getMonth() + input);
  //   return date;
  // }
  // static addYears(source: Date, input: number): Date {
  //   const date = this.copy(source);
  //   date.setFullYear(date.getFullYear() + input);
  //   return date;
  // }
  // static addSeconds(source: Date, input: number): Date {
  //   const date = this.copy(source);
  //   date.setSeconds(date.getSeconds() + input);
  //   return date;
  // }
  static copy(source: Date): Date {
    return new Date(source.valueOf());
  }
  static truncateTime(source: Date, utc: boolean = false): Date {
    const date = this.copy(source);
    if (utc) {
      date.setUTCHours(0);
      date.setUTCMinutes(0);
      date.setUTCSeconds(0);
      date.setUTCMilliseconds(0);
    } else {
      date.setHours(0);
      date.setMinutes(0);
      date.setSeconds(0);
      date.setMilliseconds(0);
    }
    return date;
  }
  static toIsoDateWithTimeZone(source: Date): string {
    const tzo = -source.getTimezoneOffset(),
      dif = tzo >= 0 ? '+' : '-',
      pad = function(num) {
        const norm = Math.floor(Math.abs(num));
        return (norm < 10 ? '0' : '') + norm;
      };
    return (
      source.getFullYear() +
      '-' +
      pad(source.getMonth() + 1) +
      '-' +
      pad(source.getDate()) +
      'T' +
      pad(source.getHours()) +
      ':' +
      pad(source.getMinutes()) +
      ':' +
      pad(source.getSeconds()) +
      dif +
      pad(tzo / 60) +
      ':' +
      pad(tzo % 60)
    );
  }
}
