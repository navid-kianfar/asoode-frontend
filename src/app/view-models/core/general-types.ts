export interface CountryViewModel {
  id: number;
  code: string;
  text: string;
}

export interface BaseViewModel {
  id: string;
  createdAt: Date;
  updatedAt?: Date;
}
export interface TimeViewModel {
  day: number;
  hour: number;
  minute: number;
}
