import { FormElementType } from '../../../library/core/enums';

export interface IFormGroup {
  disabled?: boolean;
  title?: string;
  visible?: boolean;
  size?: number;
  label?: string;
  elements: IFormElement[];
}

export interface IFormElementCaptcha extends IFormElement {
  params: {
    model: IFormElementCaptchaModel;
  };
}
export interface IFormElementInput extends IFormElement {
  params: {
    model: string;
    textArea?: boolean;
    password?: boolean;
    readonly?: boolean;
    disabled?: boolean;
    growable?: boolean;
    appendIcon?: string;
    prependIcon?: string;
    label?: string;
    ltr?: boolean;
    autofocus?: boolean;
    placeHolder?: string;
    rows?: number;
  };
}
export interface IFormElementVerification extends IFormElement {
  params: {
    cssClass?: string;
    model: string;
    disabled?: boolean;
  };
}
export interface IFormElement {
  type?: FormElementType;
  config: IFormElementConfiguration;
  validation?: IFormElementStringValidation;
  params: any;
}
export interface IFormElementConfiguration {
  cssClass?: string;
  label?: string;
  hideLabel?: boolean;
  visible?: boolean;
  labelSize?: number;
  field: string;
}
export interface IFormElementValidation {
  required: { value: boolean; message?: string };
  errors?: string[];
}

export interface IFormElementStringValidation extends IFormElementValidation {
  length?: { value: number; message: string };
  minLength?: { value: number; message: string };
  maxLength?: { value: number; message: string };
  match?: { toField: string; message: string };
}

export interface IFormElementCaptchaModel {
  token: string;
  code: string;
  expire: string;
}
