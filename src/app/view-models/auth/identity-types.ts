import { CalendarType, UserType } from '../../library/core/enums';

export interface IdentityObject {
  token: string;
  userId: string;
  username: string;
}
export interface ProfileViewModel {
  email: string;
  avatar: string;
  firstName: string;
  fullName: string;
  id: string;
  initials: string;
  lastName: string;
  phoneNumber: string;
  username: string;
  userType: UserType;
  timeZone: string;
  calendar: CalendarType;
  bio: string;
  emailConfirmed: boolean;
  phoneConfirmed: boolean;
}
