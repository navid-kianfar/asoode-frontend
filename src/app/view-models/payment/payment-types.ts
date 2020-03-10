import { BaseViewModel } from '../core/general-types';

export interface TransactionViewModel extends BaseViewModel {
  title: string;
  amount: number;
  dueAt?: Date;
  previousDebt?: number;
}
