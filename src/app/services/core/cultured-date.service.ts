import { Injectable } from '@angular/core';
import { CultureService } from './culture.service';

import {
  IDateConverter,
  IDateTimeProperties,
} from '../../library/core/date-time/date-contracts';
import PersianDateConverter from '../../library/core/date-time/persian-date-converter';
import HijriDateConverter from '../../library/core/date-time/hijri-date-converter';
import GeorgianDateConverter from '../../library/core/date-time/georgian-date-converter';
import { NumberHelpers } from '../../helpers/number.helpers';
import { IdentityService } from '../auth/identity.service';

@Injectable({
  providedIn: 'root',
})
export class CulturedDateService {
  constructor(
    readonly cultureService: CultureService,
    private readonly identityService: IdentityService,
  ) {}

  Calendar(culture?: string) {
    culture = culture || this.cultureService.lang || 'fa';
    return this.cultureService.cultures.Item(culture);
  }

  Converter(culture?: string): IDateConverter {
    culture = culture || this.cultureService.lang;
    switch (culture) {
      case 'fa':
        return new PersianDateConverter();
      case 'ar':
        return new HijriDateConverter();
      default:
        return new GeorgianDateConverter();
    }
  }

  Now(): IDateTimeProperties {
    return this.Converter().Now();
  }

  toString(value: string | Date, time?: boolean, format?: string) {
    if (!value) {
      return '';
    }
    value = new Date(value);
    format = format || (time ? 'YYYY/MM/DD HH:mm:ss' : 'YYYY/MM/DD');
    return this.Converter().Format(value, format);
  }
}
