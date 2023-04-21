import { WeekDay } from '../../shared/lib/enums/enums';

export interface ICulture {
  direction: string;
  rtl: boolean;
  lang: string;
  culture: string;
  dayNames: string[];
  dayNamesShort: string[];
  monthNames: string[];
  daysInMonths: number[];
  moneySign: string;
  startDay: WeekDay;
  weekMap: object;
}
