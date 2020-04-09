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
  WorkPackage = 4
}
export enum ConversationType {
  Text = 1,
  Upload = 2,
  Task = 3,
  Link = 4,
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
export enum TaskStatus {
  ToDo = 1,
  Done = 2,
  Blocked = 3,
}
export enum BoardTemplate {
  Blank = 1,
  WeekDay = 2,
  TeamMembers = 3,
  Departments = 4,
  Kanban = 5,
}
export enum ProjectFilter {
  All = 0,
  Simple = 1,
  Complex = 2,
  Public = 3,
}
export enum ActivityType {
  AccountEdit = 100,

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

  BoardAdd = 400,
  BoardEdit = 401,
  BoardRemove = 402,
  BoardFavorite = 403,
  BoardMemberAdd = 404,
  BoardMemberRemove = 405,
  BoardMemberPermission = 406,
  BoardArchive = 407,
  BoardRestore = 408,

  BoardListAdd = 500,
  BoardListEdit = 501,
  BoardListRemove = 502,
  BoardListArchive = 503,
  BoardListRestore = 504,
  BoardListMove = 505,
  BoardListCopy = 506,
  BoardListPermission = 507,
  BoardListOrder = 508,
  BoardListSort = 509,
  BoardListSetting = 510,

  BoardTaskAdd = 600,
  BoardTaskEdit = 601,
  BoardTaskDone = 602,
  BoardTaskRemove = 603,
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
  Student = 9
}
export enum CostUnit {
  Toman = 1
}
export enum WorkPackageObjectiveType {
  MustHave = 1,
  ShouldHave = 2,
  NiceToHave = 3
}
