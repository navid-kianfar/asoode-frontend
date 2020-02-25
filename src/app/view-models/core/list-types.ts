export interface ListViewModel {
  text: string;
  value: any;
  extra?: any;
  href?: string;
  action?: () => void;
  separator?: boolean;
}
