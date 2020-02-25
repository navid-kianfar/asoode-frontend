export interface LoginResultViewModel {
  emailNotConfirmed: boolean;
  invalidPassword: boolean;
  lockedOut: boolean;
  notFound: boolean;
  phoneNotConfirmed: boolean;
  smsFailed: boolean;
  token: string;
  userId: string;
  username: string;
}
export interface RegisterResultViewModel {
  duplicate: boolean;
  emailFailed: boolean;
  emailNotConfirmed: boolean;
  phoneNotConfirmed: boolean;
  smsFailed: boolean;
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
