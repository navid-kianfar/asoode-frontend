import { BaseViewModel } from '../core/general-types';
import {
  AccessType,
  BoardTemplate,
  WorkPackageCommentPermission,
  WorkPackageObjectiveType, WorkPackageTaskAttachmentType,
  WorkPackageTaskObjectiveValue,
  WorkPackageTaskReminderType, WorkPackageTaskState,
  WorkPackageTaskVoteNecessity,
} from '../../library/app/enums';
import { MemberInfoViewModel } from '../auth/identity-types';
import {PendingInvitationViewModel} from '../groups/group-types';

export interface ProjectObjectiveEstimatedPriceViewModel {
  date: Date;
  time: number;
  amount: number;
  user: string;
  group: string;
}
export interface WorkPackageObjectiveViewModel extends BaseViewModel {
  type: WorkPackageObjectiveType;
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
  pending: PendingInvitationViewModel[];
  members: ProjectMemberViewModel[];
  seasons: ProjectSeasonViewModel[];
  subProjects: SubProjectViewModel[];
  workPackages: WorkPackageViewModel[];
}
export interface ProjectMemberViewModel extends BaseViewModel {
  selected: boolean;
  isGroup: boolean;
  recordId: string;
  projectId: string;
  member: MemberInfoViewModel;
  access: AccessType;
  waiting?: boolean;
  deleting?: boolean;
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
  pending: PendingInvitationViewModel[];
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
  labels: WorkPackageLabelViewModel[];
  members: WorkPackageMemberViewModel[];
  lists: WorkPackageListViewModel[];
  tasks: WorkPackageTaskViewModel[];
  objectives: WorkPackageObjectiveViewModel[];
  customFields: any[];
}
export interface WorkPackageMemberViewModel extends BaseViewModel {
  waiting?: boolean;
  recordId: string;
  packageId: string;
  access: AccessType;
  blockNotification: boolean;
  showStats: boolean;
  isGroup: boolean;
}
export interface WorkPackageLabelViewModel extends BaseViewModel {
  waiting: boolean;
  packageId: string;
  title: string;
  color: string;
  darkColor: boolean;
}
export interface BoardTemplateViewModel {
  type: BoardTemplate;
  icon: string;
  lists: string[];
}
export interface WorkPackageListViewModel extends BaseViewModel {
  tempName: string;
  renameWaiting?: boolean;
  renaming?: boolean;
  adding?: any;
  editing?: any;
  packageId: string;
  title: string;
  color: string;
  darkColor: boolean;
  expanded?: boolean;
  order: number;
  tasks: WorkPackageTaskViewModel[];
}
export interface WorkPackageTaskCommentViewModel extends BaseViewModel {
  taskId: string;
  userId: string;
  replyId?: string;
  private: boolean;
  message: string;
  member: MemberInfoViewModel;
}
export interface WorkPackageTaskViewModel extends BaseViewModel {
  comments: WorkPackageTaskCommentViewModel[];
  listName: string;
  attachmentCount: number;
  commentCount: number;
  hasDescription: boolean;
  timeSpent: number;
  targetCounts: number;
  downVotes: number;
  upVotes: number;
  subTasksDone: number;
  subTasks: number;
  state: WorkPackageTaskState;
  userId: string;
  listId: string;
  packageId: string;
  projectId: string;
  subProjectId: string;
  seasonId: string;
  coverId: string;
  doneUserId: string;
  parentId: string;
  estimatedTime?: Date;
  archivedAt?: Date;
  dueAt?: Date;
  beginAt?: Date;
  endAt?: Date;
  doneAt?: Date;
  title: string;
  description: string;
  geoLocation: string;
  order: number;
  restricted: boolean;
  votePaused: boolean;
  votePrivate: boolean;
  beginReminder: WorkPackageTaskReminderType;
  EndReminder: WorkPackageTaskReminderType;
  State: WorkPackageTaskState;
  voteNecessity: WorkPackageTaskVoteNecessity;
  objectiveValue: WorkPackageTaskObjectiveValue;
  members: WorkPackageTaskMemberViewModel[];
  labels: WorkPackageTaskLabelViewModel[];
  attachments: WorkPackageTaskAttachmentViewModel[];
  votes: WorkPackageTaskVoteViewModel[];
  timeSpents: WorkPackageTaskTimeViewModel[];
}
export interface WorkPackageTaskMemberViewModel extends BaseViewModel {
  taskId: string;
  recordId: string;
  isGroup: boolean;
  packageId: string;
  lastView?: Date;
  watching?: boolean;
  vote?: boolean;
}
export interface WorkPackageTaskLabelViewModel extends BaseViewModel {
  taskId: string;
  labelId: string;
  packageId: string;
  color: string;
  title: string;
  dark: boolean;
}
export interface WorkPackageTaskAttachmentViewModel extends  BaseViewModel {
  description: string;
  id: string;
  path: string;
  title: string;
  type: WorkPackageTaskAttachmentType;
  createdAt: Date;
  isCover: boolean;
  packageId: string;
  projectId: string;
  taskId: string;
  updatedAt: Date;
  uploadId: string;
  userId: string;
  subProjectId: string;
}
export interface WorkPackageTaskVoteViewModel extends  BaseViewModel {
  id: string;
  vote: boolean;
  createdAt: Date;
  packageId: string;
  projectId: string;
  taskId: string;
  updatedAt: Date;
  userId: string;
  subProjectId: string;
}
export interface WorkPackageTaskTimeViewModel extends  BaseViewModel {
  begin: Date;
  end?: Date;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  manual: boolean;
  userId: string;
  packageId: string;
  projectId: string;
  taskId: string;
  subProjectId: string;
}
