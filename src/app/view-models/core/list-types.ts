export interface ListViewModel {
  text: string;
  value: any;
  payload?: any;
  href?: string;
  description?: string;
  action?: () => void;
  separator?: boolean;
}
