import { BaseViewModel } from '../core/general-types';
import { AccessType, GroupType } from '../../library/app/enums';

export interface GroupViewModel extends BaseViewModel {
  userId: string;
  title: string;
  premium: boolean;
  avatar?: string;
  subTitle?: string;
  brandTitle?: string;
  supervisorName?: string;
  supervisorNumber?: string;
  responsibleName?: string;
  responsibleNumber?: string;
  email?: string;
  description: string;
  website?: string;
  postalCode?: string;
  address?: string;
  tel?: string;
  fax?: string;
  geoLocation?: string;
  nationalId?: string;
  registrationId?: string;
  type: GroupType;
  expireAt?: Date;
  avatarId: string;
  registeredAt?: Date;
  offices?: number;
  employees?: number;
  members: GroupMemberViewModel[];
}
export interface GroupMemberViewModel {
  email: string;
  firstName: string;
  fullName: string;
  initials: string;
  lastName: string;
  phoneNumber: string;
  username: string;
  bio: string;
  access: AccessType;
}
