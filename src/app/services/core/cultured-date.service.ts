import { Injectable } from '@angular/core';
import { CultureService } from './culture.service';

import { IDateTimeProperties } from '../../library/core/date-time/date-contracts';
import PersianDateConverter from '../../library/core/date-time/persian-date-converter';
import HijriDateConverter from '../../library/core/date-time/hijri-date-converter';
import GeorgianDateConverter from '../../library/core/date-time/georgian-date-converter';
import { NumberHelpers } from '../../helpers/number.helpers';

@Injectable({
  providedIn: 'root',
})
export class CulturedDateService {
  constructor(readonly service: CultureService) {}

  Now(): IDateTimeProperties {
    switch (this.service.lang) {
      case 'fa':
        return new PersianDateConverter().Now();
      case 'ar':
        return new HijriDateConverter().Now();
      default:
        return new GeorgianDateConverter().Now();
    }
  }

  toString(value: string | Date, time?: boolean, format?: string) {
    if (!value) {
      return '';
    }
    value = new Date(value);
    format = format || (time ? 'YYYY/MM/DD HH:mm:ss' : 'YYYY/MM/DD');
    switch (this.service.lang) {
      case 'fa':
        return new PersianDateConverter().Format(value, format);
      case 'ar':
        return new HijriDateConverter().Format(value, format);
      default:
        return new GeorgianDateConverter().Format(value, format);
    }
  }
}
