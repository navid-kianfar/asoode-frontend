export enum GroupType {
  Holding = 1,
  Organization = 2,
  Company = 3,
  Committee = 4,
  Branch = 5,
  Office = 6,
  Department = 7,
  Team = 8,
  Unit = 9,
  Quad = 10,
  Sbu = 11,
  Individual = 12,
}
export enum AccessType {
  Owner = 1,
  Admin = 2,
  Editor = 3,
  HiddenEditor = 4,
  Visitor = 5,
}
export enum WorkPackageCommentPermission {
  Disabled = 1,
  Members = 2,
  MembersAndObservers = 3,
}
export enum ChannelType {
  Direct = 1,
  Project = 2,
  Group = 3,
  WorkPackage = 4,
  Bot = 5,
}
export enum ConversationType {
  Text = 1,
  Upload = 2,
  Link = 3,
}
export enum ChannelNotificationReceive {
  All = 1,
  Mine = 2,
  None = 3,
}
export enum SortType {
  DateAsc = 1,
  DateDesc = 2,
  NameAsc = 3,
  NameDesc = 4,
}
export enum RequestStatus {
  Pending = 1,
  Approved = 2,
  Canceled = 3,
}
export enum ShiftType {
  Fixed = 1,
  Float = 2,
  Open = 3,
}
export enum BoardTemplate {
  Blank = 1,
  WeekDay = 2,
  TeamMembers = 3,
  Departments = 4,
  Kanban = 5,
}
export enum TransactionStatus {
  Pending = 1,
  Success = 2,
  Canceled = 3
}
export enum OrderStatus {
  Pending = 1,
  Success = 2,
  Canceled = 3
}
export enum ProjectFilter {
  All = 0,
  Simple = 1,
  Complex = 2,
  Public = 3,
}
export enum WorkPackageTaskVisibility {
  Normal = 1,
  MembersOnly = 2,
}
export enum ReceiveNotificationType {
  ReceiveAll = 1,
  ReceiveMine = 2,
  ReceiveNone = 3,
}
export enum ActivityType {
  None = 0,
  AccountEdit = 100,
  AccountDeviceAdd = 101,
  AccountDeviceEdit = 102,
  AccountDeviceRemove = 103,
  AccountDeviceState = 104,

  GroupAdd = 200,
  GroupEdit = 201,
  GroupRemove = 202,
  GroupWorkEntry = 203,
  GroupTimeOffAdd = 204,
  GroupTimeOffResponse = 205,
  GroupMemberAdd = 206,
  GroupMemberRemove = 207,
  GroupMemberPermission = 208,

  ProjectAdd = 300,
  ProjectEdit = 301,
  ProjectRemove = 302,
  ProjectMemberAdd = 303,
  ProjectMemberRemove = 304,
  ProjectMemberPermission = 305,
  ProjectSubAdd = 306,
  ProjectSubEdit = 307,
  ProjectSubRemove = 308,
  ProjectSeasonAdd = 309,
  ProjectSeasonEdit = 310,
  ProjectSeasonRemove = 311,

  WorkPackageAdd = 400,
  WorkPackageEdit = 401,
  WorkPackageRemove = 402,
  WorkPackageFavorite = 403,
  WorkPackageMemberAdd = 404,
  WorkPackageMemberRemove = 405,
  WorkPackageMemberPermission = 406,
  WorkPackageArchive = 407,
  WorkPackageRestore = 408,
  WorkPackageLabelRename = 409,
  WorkPackageLabelRemove = 410,
  WorkPackageLabelAdd = 411,
  WorkPackageUserSetting = 412,
  WorkPackageSetting = 413,
  WorkPackageUpgrade = 414,
  WorkPackageConnect = 415,
  WorkPackageMerge = 416,

  WorkPackageListAdd = 500,
  WorkPackageListEdit = 501,
  WorkPackageListRemove = 502,
  WorkPackageListArchive = 503,
  WorkPackageListRestore = 504,
  WorkPackageListMove = 505,
  WorkPackageListCopy = 506,
  WorkPackageListPermission = 507,
  WorkPackageListOrder = 508,
  WorkPackageListSort = 509,
  WorkPackageListSetting = 510,
  WorkPackageListTasksArchive = 511,
  WorkPackageListClone = 512,

  WorkPackageTaskAdd = 600,
  WorkPackageTaskEdit = 601,
  WorkPackageTaskDone = 602,
  WorkPackageTaskRemove = 603,
  WorkPackageTaskReposition = 604,
  WorkPackageTaskMove = 605,
  WorkPackageTaskArchive = 606,
  WorkPackageTaskRestore = 607,
  WorkPackageTaskComment = 608,
  WorkPackageTaskView = 609,
  WorkPackageTaskMemberRemove = 610,
  WorkPackageTaskMemberAdd = 611,
  WorkPackageTaskLabelRemove = 612,
  WorkPackageTaskLabelAdd = 613,
  WorkPackageTaskAttachmentRemove = 614,
  WorkPackageTaskAttachmentAdd = 615,
  WorkPackageTaskAttachmentCover = 616,
  WorkPackageTaskAttachmentRename = 617,
  WorkPackageTaskWatch = 618,
  WorkPackageTaskTime = 619,
  WorkPackageTaskVote = 620,
  WorkPackageTaskVoteReset = 621,
  WorkPackageTaskUnBlock = 622,
  WorkPackageTaskBlocked = 623,

  WorkPackageObjectiveAdd = 700,
  WorkPackageObjectiveEdit = 701,
  WorkPackageObjectiveRemove = 702,

  ChannelMessage = 800,
  ChannelUpload = 801,
}
export enum PlanType {
  Free = 1,
  Personal = 2,
  Economy = 3,
  Company = 4,
  Organization = 5,
  Custom = 6,
  SaaS = 7,
  Startup = 8,
  Student = 9,
}
export enum CostUnit {
  Toman = 1,
}
export enum WorkPackageObjectiveType {
  MustHave = 1,
  ShouldHave = 2,
  NiceToHave = 3,
}
export enum WorkPackageTaskReminderType {
  None = 1,
  AtTheTime = 2,
  FiveMinutesBefore = 3,
  TenMinutesBefore = 4,
  FifteenMinutesBefore = 5,
  OneHourBefore = 6,
  TwoHoursBefore = 7,
  OneDayBefore = 8,
  TwoDaysBefore = 9,
}
export enum WorkPackageTaskState {
  ToDo = 1,
  InProgress = 2,
  Done = 3,
  Paused = 4,
  Blocked = 5,
  Cancelled = 6,
  Duplicate = 7,
  Incomplete = 8,
  Blocker = 9,
}
export enum WorkPackageTaskVoteNecessity {
  None = 1,
  CardMembers = 2,
  BoardMembers = 3,
}
export enum WorkPackageTaskObjectiveValue {
  BarelyValuable = 1,
  SlightlyValuable = 2,
  ModeratelyValuable = 3,
  VeryValuable = 4,
  ExtremelyValuable = 5,
}
export enum WorkPackageTaskAttachmentType {
  Link = 1,
  Upload = 2,
}
