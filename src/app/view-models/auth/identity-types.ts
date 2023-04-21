import { CalendarType } from '../../shared/lib/enums/enums';
import { AccessType } from '../../shared/lib/enums/enums';

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
  model?: any;
}
export interface ProfileViewModel extends MemberInfoViewModel {
  workingGroupId?: string;
  workingProjectId?: string;
  workingPackageId?: string;
  workingTaskId?: string;
  workingGroupFrom?: Date;
  workingTaskFrom?: Date;

  darkMode: boolean;
  timeZone: string;
  calendar: CalendarType;
  phone: string;
  emailConfirmed: boolean;
  phoneConfirmed: boolean;
}
