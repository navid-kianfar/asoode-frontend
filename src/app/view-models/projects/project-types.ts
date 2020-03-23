import { BaseViewModel } from '../core/general-types';
import {
  AccessType,
  BoardTemplate,
  WorkPackageCommentPermission,
} from '../../library/app/enums';
import { MemberInfoViewModel } from '../auth/identity-types';

export interface ProjectObjectiveEstimatedPriceViewModel {
  date: Date;
  time: number;
  amount: number;
  user: string;
  group: string;
}
export interface WorkPackageObjectiveViewModel extends BaseViewModel {
  title: string;
  description: string;
  workPackage: string;
}

export interface ProjectTemplateViewModel extends BaseViewModel {
  title: string;
  description: string;
  image: string;
  icon: string;
  seasons: ProjectSeasonViewModel[];
  subProjects: SubProjectViewModel[];
  workPackages: WorkPackageViewModel[];
}

export interface ProjectViewModel extends BaseViewModel {
  userId: string;
  title: string;
  description: string;
  premium: boolean;
  complex: boolean;
  tasks: number;
  membersCapacity: number;
  membersUsed: number;
  diskSpaceCapacity: number;
  diskSpaceUsed: number;
  members: ProjectMemberViewModel[];
  seasons: ProjectSeasonViewModel[];
  subProjects: SubProjectViewModel[];
  workPackages: WorkPackageViewModel[];
}
export interface ProjectMemberViewModel extends BaseViewModel {
  isGroup: boolean;
  recordId: string;
  groupId: string;
  member: MemberInfoViewModel;
  access: AccessType;
  waiting?: boolean;
}
export interface ProjectSeasonViewModel extends BaseViewModel {
  userId: string;
  projectId: string;
  title: string;
  description: string;
}
export interface SubProjectViewModel extends BaseViewModel {
  userId: string;
  projectId: string;
  parentId: string;
  title: string;
  description: string;
  level: number;
  order: number;
}
export interface WorkPackageViewModel extends BaseViewModel {
  progress: number;
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
  lists: WorkPackageListViewModel[];
  tasks: WorkPackageTaskViewModel[];
  objectives: WorkPackageObjectiveViewModel[];
}
export interface WorkPackageMemberViewModel extends BaseViewModel {
  recordId: string;
  packageId: string;
  access: AccessType;
  blockNotification: boolean;
  showStats: boolean;
  isGroup: boolean;
}
export interface BoardTemplateViewModel {
  type: BoardTemplate;
  image: string;
  image_alt: string;
  lists: string[];
}
export interface WorkPackageListViewModel extends BaseViewModel {
  packageId: string;
  title: string;
  color: string;
  darkColor: boolean;
  expanded?: boolean;
  order: number;
}
export interface WorkPackageTaskViewModel extends BaseViewModel {}
