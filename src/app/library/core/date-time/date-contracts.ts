import {WorkPackageTaskState} from '../../app/enums';

export interface IDateProperties {
  Day: number;
  Month: number;
  Year: number;
  WeekName?: string;
  MonthName?: string;
  Date?: Date;
}

export interface ITimeProperties {
  Hours?: number;
  Minutes?: number;
  Seconds?: number;
  Milliseconds?: number;
}

export interface IDateTimeProperties extends ITimeProperties, IDateProperties {}

export interface IDateConverter {
  ToDateTime(date: IDateTimeProperties): Date;
  Now(): IDateTimeProperties;
  Parse(date: IDateTimeProperties): IDateTimeProperties;
  FromDateTime(date: Date): IDateTimeProperties;
  Format(date: Date, format: string): string;
  IsValid(date: string | IDateTimeProperties): boolean;
}
export interface IDateEvent {
  date: Date;
  title: Date;
  recordId: string;
  color?: string;
  cssClass?: string;
  state?: WorkPackageTaskState;
}
