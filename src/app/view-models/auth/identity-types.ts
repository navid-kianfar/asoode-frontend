import { CalendarType, UserType } from '../../library/core/enums';
import { AccessType, CostUnit, PlanType } from '../../library/app/enums';
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
  workingGroupId?: string;
  workingProjectId?: string;
  workingPackageId?: string;
  workingTaskId?: string;
  workingGroupFrom?: Date;
  workingTaskFrom?: Date;

  phoneNumber: string;
  userType: UserType;
  timeZone: string;
  calendar: CalendarType;
  emailConfirmed: boolean;
  phoneConfirmed: boolean;
  plan: UserPlanInfoViewModel;
}
export interface UserPlanInfoViewModel {
  userId: string;
  planId: string;
  title: string;
  description: string;
  picture: string;
  type: PlanType;
  unit: CostUnit;
  space: number;
  enabled: boolean;
  oneTime: boolean;
  canExtend: boolean;
  days: number;
  attachmentSize: number;
  planCost: number;
  users: number;
  workPackage: number;
  project: number;
  simpleGroup: number;
  complexGroup: number;
  additionalUser: number;
  additionalSpace: number;
  additionalProject: number;
  additionalSimpleGroup: number;
  additionalComplexGroup: number;
  additionalWorkPackage: number;
  additionalWorkPackageCost: number;
  additionalUserCost: number;
  additionalSpaceCost: number;
  additionalProjectCost: number;
  additionalSimpleGroupCost: number;
  additionalComplexGroupCost: number;
  usedUser: number;
  usedSpace: number;
  usedProject: number;
  usedSimpleGroup: number;
  usedComplexGroup: number;
  usedWorkPackage: number;
  featureCustomField: boolean;
  featureTimeSpent: boolean;
  featureTimeValue: boolean;
  featureTimeOff: boolean;
  featureShift: boolean;
  featureReports: boolean;
  featurePayments: boolean;
  featureChat: boolean;
  featureFiles: boolean;
  featureWbs: boolean;
  featureRoadMap: boolean;
  featureTree: boolean;
  featureObjectives: boolean;
  featureSeasons: boolean;
  featureVote: boolean;
  featureSubTask: boolean;
  featureKartabl: boolean;
  featureCalendar: boolean;
  featureBlocking: boolean;
  featureRelated: boolean;
  featureComplexGroup: boolean;
  featureGroupTimeSpent: boolean;
  totalGroups: number;
  totalSimpleGroups: number;
  totalComplexGroups: number;
  totalUsedGroups: number;
  totalProjects: number;
  totalWorkPackages: number;
  totalComplexProjects: number;
  totalUsedProjects: number;
  totalSpace: number;
}
