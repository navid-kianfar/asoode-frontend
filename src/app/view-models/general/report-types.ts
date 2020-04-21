import { IDateEvent } from '../../library/core/date-time/date-contracts';

export interface DashboardViewModel {
  events: IDateEvent[];
  overall: OverallViewModel;
  progress: DayReportViewModel[];
}
export interface OverallViewModel {
  total: number;
  done: number;
  blocked: number;
  inProgress: number;
}
export interface DayReportViewModel extends OverallViewModel {
  date: Date;
}
export interface RecentActivityLog {}
