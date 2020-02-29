import {BaseViewModel} from '../core/general-types';
import {AccessType, WorkPackageCommentPermission} from '../../library/app/enums';

export interface ProjectViewModel extends BaseViewModel {
  userId: string;
  title: string;
  description: string;
  members: ProjectMemberViewModel[];
  seasons: ProjectSeasonViewModel[];
  subProjects: SubProjectViewModel[];
  workPackages: WorkPackageViewModel[];
}
export interface ProjectMemberViewModel {
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
export interface ProjectSeasonViewModel extends BaseViewModel {
  userId: string;
  projectId: string;
  title: string;
  description: string;
}
export interface SubProjectViewModel {
  userId: string;
  projectId: string;
  parentId: string;
  title: string;
  description: string;
  level: number;
  order: number;
}
export interface WorkPackageViewModel extends BaseViewModel {
  userId: string;
  projectId: string;
  subProjectId: string;
  title: string;
  description: string;
  beginAt?: Date;
  endAt?: Date;
  actualBeginAt?: Date;
  actualEndAt?: Date;
  archivedAt?: Date;
  color: string;
  darkColor: boolean;
  commentPermission: WorkPackageCommentPermission;
  allowAttachment: boolean;
  allowBlockingBoardTasks: boolean;
  allowComments: boolean;
  allowCustomField: boolean;
  allowEndAt: boolean;
  allowEstimatedTime: boolean;
  allowGeoLocation: boolean;
  allowLabels: boolean;
  allowMembers: boolean;
  allowPoll: boolean;
  allowSegments: boolean;
  allowState: boolean;
  allowTimeSpent: boolean;
  members: WorkPackageMemberViewModel[];
}
export interface WorkPackageMemberViewModel extends BaseViewModel {
  userId: string;
  packageId: string;
  access: AccessType;
  blockNotification: boolean;
  showStats: boolean;
}
