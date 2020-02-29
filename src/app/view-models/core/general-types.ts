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
