export enum WorkPackageCommentPermission {
  Disabled = 1,
  Members = 2,
  MembersAndObservers = 3,
}

export enum WorkPackageTaskVisibility {
  Normal = 1,
  MembersOnly = 2,
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

export enum BoardTemplate {
  Blank = 0,
  WeekDay = 1,
  TeamMembers = 2,
  Departments = 3,
  Kanban = 4
}
