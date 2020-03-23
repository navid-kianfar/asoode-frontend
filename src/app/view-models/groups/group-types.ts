import { BaseViewModel } from '../core/general-types';
import { AccessType, GroupType } from '../../library/app/enums';
import { MemberInfoViewModel } from '../auth/identity-types';

export interface GroupViewModel extends BaseViewModel {
  access?: AccessType;
  parentId: string;
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
export interface GroupMemberViewModel extends BaseViewModel {
  isGroup: boolean;
  recordId: string;
  groupId: string;
  member: MemberInfoViewModel;
  access: AccessType;
  waiting?: boolean;
}
