export interface ListViewModel {
  text: string;
  value: any;
  payload?: any;
  href?: string;
  icon?: string;
  description?: string;
  action?: () => void;
  separator?: boolean;
  selected?: boolean;
}
