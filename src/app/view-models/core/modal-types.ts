import { IFormGroup } from '../../components/core/form/contracts';

export interface ModalParameters {
  cancel?: () => Promise<any>;
  action?: () => Promise<any>;
  cssClass?: string;
  icon?: string;
  title?: string;
  message?: string;
  heading?: string;
  actionColor?: string;
  actionLabel?: string;
  cancelLabel?: string;
}

export interface PromptModalParameters extends ModalParameters {
  form: IFormGroup[];
  waiting: boolean;
}
