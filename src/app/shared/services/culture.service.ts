import { Injectable } from '@angular/core';
import { StringDictionary } from '../lib/dictionary';
import { WeekDay } from '../lib/enums/enums';
import { ICulture } from '../../view-models/core/date-types';

@Injectable({
  providedIn: 'root',
})
export class CultureService {
  public cultures: StringDictionary<ICulture>;

  constructor() {
    const defLang = 'fa';
    const defDir = 'rtl';
    const html = document.getElementsByTagName('html')[0];
    this.currentLanguage = html.getAttribute('lang') || defLang;
    this.currentDir = html.getAttribute('dir') || defDir;
    this.cultures = new StringDictionary<ICulture>();
    this.cultures.Add('fa', {
      direction: 'rtl',
      rtl: true,
      lang: 'fa',
      culture: 'fa-IR',
      dayNames: [
        'شنبه',
        'یک شنبه',
        'دوشنبه',
        'سه شنبه',
        'چهار شنبه',
        'پنج شنبه',
        'جمعه',
      ],
      dayNamesShort: ['ش', '۱ش', '۲ش', '۳ش', '۴ش', '۵ش', 'ج'],
      monthNames: [
        'فروردین',
        'اردیبهشت',
        'خرداد',
        'تیر',
        'مرداد',
        'شهریور',
        'مهر',
        'آبان',
        'آذر',
        'دی',
        'بهمن',
        'اسفند',
      ],
      daysInMonths: [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29],
      moneySign: '',
      startDay: WeekDay.Saturday,
      weekMap: { 0: 1, 1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 7 },
    });
    this.cultures.Add('ar', {
      direction: 'rtl',
      rtl: true,
      lang: 'ar',
      culture: 'ar-SA',
      dayNames: [
        'الأحد',
        'الإثنين',
        'الثلاثاء',
        'الأربعاء',
        'الخميس',
        'الجمعة',
        'السبت',
      ],
      dayNamesShort: ['أح', 'إث', 'ثل', 'أر', 'خم', 'جم', 'سب'],
      monthNames: [
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
      ],
      daysInMonths: [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29],
      moneySign: '',
      startDay: WeekDay.Monday,
      weekMap: { 0: 1, 1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 7 },
    });
    this.cultures.Add('en', {
      direction: 'ltr',
      rtl: false,
      lang: 'en',
      culture: 'en-US',
      dayNames: [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ],
      dayNamesShort: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
      monthNames: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ],
      daysInMonths: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
      moneySign: '$',
      startDay: WeekDay.Sunday,
      weekMap: { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6 },
    });

    if (!this.cultures.ContainsKey(this.currentLanguage)) {
      const clone = {} as any;
      Object.assign(clone, this.cultures.Item('en'));
      clone.direction = this.currentDir;
      clone.rtl = this.currentDir === 'rtl';
      clone.lang = this.currentLanguage;
      this.currentCulture = clone;
    } else {
      this.currentCulture = this.cultures.Item(this.currentLanguage);
    }
  }

  private currentCulture: any;
  private currentLanguage: string;
  private currentDir: string;

  public get lang(): string {
    return this.currentLanguage;
  }

  public get dir(): string {
    return this.currentDir;
  }

  public get rtl(): boolean {
    return this.currentDir === 'rtl';
  }

  public get current(): ICulture {
    return this.currentCulture;
  }

  public init(lang: string, dir: string) {
    this.currentLanguage = lang;
    this.currentDir = dir;
  }
}
