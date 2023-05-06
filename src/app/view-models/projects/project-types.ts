import { BaseViewModel } from '../core/general-types';
import {
  AccessType,
  ReceiveNotificationType,
  SortType,



} from '../../shared/lib/enums/enums';
import { MemberInfoViewModel } from '../auth/identity-types';
import { PendingInvitationViewModel } from '../groups/group-types';
import { IDateTimeProperties } from '../../shared/lib/date-time/date-contracts';
import {
  BoardTemplate,
  WorkPackageCommentPermission,
  WorkPackageObjectiveType,
  WorkPackageTaskAttachmentType,
  WorkPackageTaskObjectiveValue, WorkPackageTaskReminderType, WorkPackageTaskState, WorkPackageTaskVisibility,
  WorkPackageTaskVoteNecessity,
} from '../../shared/lib/enums/workpackage';
import { ActivityType } from '../../shared/lib/enums/activity-type';

export interface TreeViewModel {
  tree: { [key: string]: TreeReportViewModel };
}
export interface TreeReportViewModel {
  doneWorkPackages: number;
  workPackages: number;
  workPackageProgress: number;
  progress: number;
  timeSpent: number;
  from?: Date;
  to?: Date;
  total: number;
  done: number;
  members: WorkPackageMemberViewModel[];
}
export interface ProjectProgressViewModel {
  date: string;
  created: number;
  blocked: number;
  done: number;
}
export interface RoadMapViewModel {}
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
  archivedAt?: Date;
  userId: string;
  title: string;
  description: string;
  premium: boolean;
  complex: boolean;
  tasks: number;
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
export interface WorkPackageProgressViewModel {
  percent: number;
  total: number;
  done: number;
  canceledOrDuplicate: number;
}
export interface WorkPackageUserSetting extends BaseViewModel {
  showTotalCards: boolean;
  receiveNotification: ReceiveNotificationType;
  userId: string;
  packageId: string;
  projectId: string;
}
export interface WorkPackageViewModel extends BaseViewModel {
  listsSort: SortType;
  tasksSort: SortType;
  subTasksSort: SortType;
  attachmentsSort: SortType;
  permissionComment: boolean;
  permissionEditAttachment: boolean;
  permissionCreateAttachment: boolean;
  permissionAssignMembers: boolean;
  permissionAssignLabels: boolean;
  permissionChangeTaskState: boolean;
  permissionEditTask: boolean;
  permissionArchiveTask: boolean;
  permissionCreateTask: boolean;
  permissionArchiveList: boolean;
  permissionEditList: boolean;
  permissionCreateList: boolean;
  permissionClearList: boolean;

  order: number;
  userSetting: WorkPackageUserSetting;
  pending: PendingInvitationViewModel[];
  progress: WorkPackageProgressViewModel;
  taskVisibility: WorkPackageTaskVisibility;
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
  isGroup: boolean;
}
export interface WorkPackageLabelViewModel extends BaseViewModel {
  tempColor?: string;
  tempName?: string;
  editting?: boolean;
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
  expandedAlt?: boolean;
  newTaskTitle?: string;
  tempName: string;
  waiting?: boolean;
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
export interface ActivityLogViewModel extends BaseViewModel {
  description: string;
  type: ActivityType;
  member?: MemberInfoViewModel;
  userId: string;
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
  dueAtFormatted?: string;
  attachmentCount: number;
  commentCount: number;
  hasDescription: boolean;
  watching: boolean;
  targetCounts: number;
  downVotes: number;
  upVotes: number;
  subTasksDone: number;
  subTasksCount: number;
  userId: string;
  packageId: string;
  projectId: string;
  subProjectId: string;
  seasonId: string;
  parentId: string;
  order: number;
  restricted: boolean;
  votePaused: boolean;
  votePrivate: boolean;
  comments: WorkPackageTaskCommentViewModel[];
  subTasks: WorkPackageTaskViewModel[];
  members: WorkPackageTaskMemberViewModel[];
  labels: WorkPackageTaskLabelViewModel[];
  attachments: WorkPackageTaskAttachmentViewModel[];
  votes: WorkPackageTaskVoteViewModel[];
  timeSpents: WorkPackageTaskTimeViewModel[];

  beginReminder: WorkPackageTaskReminderType;
  endReminder: WorkPackageTaskReminderType;
  voteNecessity: WorkPackageTaskVoteNecessity;
  objectiveValue: WorkPackageTaskObjectiveValue;
  estimatedTime?: number;
  coverUrl?: string;
  coverId: string;
  listId: string;
  state: WorkPackageTaskState;
  listName: string;
  timeSpent: number;
  doneUserId: string;
  archivedAt?: Date;
  dueAt?: Date;
  beginAt?: Date;
  endAt?: Date;
  doneAt?: Date;
  title: string;
  description: string;
  geoLocation: string;
}

export interface TimeSpentViewModel {
  style: any;
  parsed: IDateTimeProperties;
  task: WorkPackageTaskViewModel;
  time: WorkPackageTaskTimeViewModel;
}
export interface TimeSpentMappedViewModel {
  date: IDateTimeProperties;
  title: string;
  members: TimeSpentMappedMembersViewModel[];
}
export interface TimeSpentMappedMembersViewModel {
  userId: string;
  member?: MemberInfoViewModel;
  times: TimeSpentViewModel[];
}

export interface KartablViewModel {
  tasks: WorkPackageTaskViewModel[];
}

export interface WorkPackageTaskMemberViewModel extends BaseViewModel {
  taskId: string;
  recordId: string;
  isGroup: boolean;
  packageId: string;
}
export interface WorkPackageTaskLabelViewModel extends BaseViewModel {
  taskId: string;
  labelId: string;
  packageId: string;
  color: string;
  title: string;
  dark: boolean;
}
export interface AdvancedPlayerShapeViewModel extends BaseViewModel {
  attachmentId: string;
  startFrame: number;
  endFrame: number;
  payload?: string;
}
export interface AdvancedPlayerCommentViewModel extends BaseViewModel {
  attachmentId: string;
  startFrame: number;
  endFrame: number;
  message: string;
  payload?: string;
}
export interface AdvancedPlayerViewModel {
  comments: AdvancedPlayerCommentViewModel[];
  shapes: AdvancedPlayerShapeViewModel[];
}
export interface WorkPackageTaskAttachmentViewModel extends BaseViewModel {
  covering?: boolean;
  tempName?: string;
  waiting?: boolean;
  renaming?: boolean;
  description: string;
  id: string;
  path: string;
  thumbnailPath: string;
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
export interface WorkPackageTaskVoteViewModel extends BaseViewModel {
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
export interface WorkPackageTaskTimeViewModel extends BaseViewModel {
  member: MemberInfoViewModel;
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
  diff?: number;
}
