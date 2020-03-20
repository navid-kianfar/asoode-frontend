import { CalendarType, UserType } from '../../library/core/enums';
import { AccessType } from '../../library/app/enums';
import { GroupViewModel } from '../groups/group-types';

export interface IdentityObject {
  token: string;
  userId: string;
  username: string;
}
export interface MemberInfoViewModel {
  email: string;
  avatar: string;
  firstName: string;
  fullName: string;
  id: string;
  initials: string;
  lastName: string;
  username: string;
  bio: string;
}
export interface InviteViewModel {
  id: string;
  access: AccessType;
  selected?: boolean;
  model?: MemberInfoViewModel | GroupViewModel;
}
export interface ProfileViewModel extends MemberInfoViewModel {
  phoneNumber: string;
  userType: UserType;
  timeZone: string;
  calendar: CalendarType;
  emailConfirmed: boolean;
  phoneConfirmed: boolean;
}
