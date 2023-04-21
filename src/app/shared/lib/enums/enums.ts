export enum DurationMode {
  Day = 1,
  Week = 2,
  Month = 3,
}
export enum AccessType {
  Owner = 1,
  Admin = 2,
  HiddenEditor = 3,
  Editor = 4,
  Visitor = 5,
}
export enum ConversationType {
  Text = 1,
  Upload = 2,
  Link = 3,
}
export enum SortType {
  Manual = 0,
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
export enum ReceiveNotificationType {
  ReceiveAll = 1,
  ReceiveMine = 2,
  ReceiveNone = 3,
}

export enum FileType {
  Any = 1,
  Image = 2,
  Audio = 3,
  Video = 4,
  Excel = 5,
  Word = 6,
  Pdf = 7,
  Specific = 8,
}
export enum WeekDay {
  Sunday = 0,
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6,
}
export enum FormElementType {
  Button = 0,
  Input = 1,
  AutoComplete = 3,
  Checkbox = 4,
  ColorPicker = 5,
  CountryPicker = 6,
  DatePicker = 7,
  DropDown = 8,
  Editor = 9,
  EmojiPicker = 10,
  File = 11,
  LocationPicker = 12,
  Radio = 13,
  Switch = 14,
  Tag = 15,
  ZonePicker = 16,
  Verification = 17,
  Label = 18,
  Number = 19,
  TimePicker = 20,
}
export enum DropdownKnownList {
  Countries = 1,
  Zones = 2,
}
export enum CalendarType {
  Default = 0,
  Persian = 1,
  Gregorian = 2,
  Hijri = 3,
}
