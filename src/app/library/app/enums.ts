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
