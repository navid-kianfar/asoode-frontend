import { FormViewModel } from '../../shared/components/form/contracts';

export interface ConfirmModalRequest {
  title: string;
  subTitle?: string;
  icon?: string;
  description?: string;
  agreement?: string;
  agreementRequired?: boolean;
  confirmLabel?: string;
  cancelLabel?: string;
  options?: ConfirmModalOption[];
}
export interface ConfirmModalResponse {
  confirmed: boolean;
  agreed?: boolean;
  option?: any;
}
export interface ConfirmModalOption {
  value: any;
  title: string;
  subTitle?: string;
  icon?: string;
}
export interface PromptCommands {
  waiting: boolean;
  label: string;
  color: any;
  action: ($event, btn) => void;
}

export interface PromptModalOptions {
  title: string;
  form: FormViewModel[];
  buttons?: PromptCommands[];
  progress?: ModalProgress;
  cancel?: (params?: any, form?: FormViewModel[]) => Promise<any>;
  action?: (params: any, form: FormViewModel[]) => Promise<any>;
  cssClass?: string;
  summary?: string;
  actionColor?: any;
  actionLabel?: string;
  cancelLabel?: string;
  width?: number;
  actionWaiting?: boolean;
  cancelWaiting?: boolean;
  icon?: string;
  message?: string;
  heading?: string;
  model?: any;
}

export interface ModalProgress {
  uploading: boolean;
  uploadPercent: number;
}
export interface ForwardMessagesModalDto {
  conversationId: string;
  messages: string[];
  channelId: string;
}
