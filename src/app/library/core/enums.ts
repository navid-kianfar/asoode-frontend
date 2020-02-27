export enum OperationResultStatus {
  Pending = 1,
  Success = 2,
  NotFound = 3,
  Duplicate = 4,
  Rejected = 5,
  UnAuthorized = 6,
  Validation = 7,
  Failed = 8,
  Captcha = 9,
  OverCapacity = 10,
  Expire = 11,
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
  Captcha = 2,
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
export enum UserType {
  User = 2,
  Marketer = 3,
}
