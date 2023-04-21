import { BaseViewModel } from '../core/general-types';

export interface LoginResultViewModel {
  emailNotConfirmed: boolean;
  invalidPassword: boolean;
  lockedOut: boolean;
  lockedUntil?: Date;
  notFound: boolean;
  phoneNotConfirmed: boolean;
  smsFailed: boolean;
  token: string;
  userId: string;
  username: string;
  id: string;
}
export interface RegisterResultViewModel {
  username: string;
  userId: string;
  token: string;
  duplicate: boolean;
  emailFailed: boolean;
  emailNotConfirmed: boolean;
  phoneNotConfirmed: boolean;
  smsFailed: boolean;
  id: string;
}

export interface ForgotResultViewModel {
  emailFailed: boolean;
  emailNotConfirmed: boolean;
  phoneNotConfirmed: boolean;
  smsFailed: boolean;
  lockedOut: boolean;
  notFound: boolean;
  wait: boolean;
  id: string;
}
export interface DeviceViewModel extends BaseViewModel {
  title: string;
  os: string;
  enabled: boolean;

  deleting?: boolean;
  toggling?: boolean;
  editing?: boolean;
}
