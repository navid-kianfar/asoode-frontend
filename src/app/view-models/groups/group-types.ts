import { BaseViewModel } from '../core/general-types';
import { AccessType } from '../../shared/lib/enums/enums';
import { MemberInfoViewModel } from '../auth/identity-types';
import { WorkPackageTaskViewModel } from '../projects/project-types';
import { GroupType } from '../../shared/lib/enums/group-type';

export interface TimeOffDetailViewModel {
  tasks: WorkPackageTaskViewModel[];
}
export interface GroupViewModel extends BaseViewModel {
  archivedAt?: Date;
  access?: AccessType;
  parentId?: string;
  rootId?: string;
  userId: string;
  title: string;
  complex: boolean;
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
  pending: PendingInvitationViewModel[];
}
export interface PendingInvitationViewModel extends BaseViewModel {
  identifier: string;
  recordId: string;
  waiting?: boolean;
  deleting?: boolean;
  access: AccessType;
}
export interface GroupMemberViewModel extends BaseViewModel {
  userId: string;
  groupId: string;
  member: MemberInfoViewModel;
  access: AccessType;
  waiting?: boolean;
}
