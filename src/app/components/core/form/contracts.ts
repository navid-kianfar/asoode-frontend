import {
  DropdownKnownList,
  FormElementType,
} from '../../../library/core/enums';

export interface FormViewModel {
  disabled?: boolean;
  title?: string;
  visible?: boolean;
  size?: number;
  label?: string;
  elements: IFormElement[];
}

export interface IFormElementCheckbox extends IFormElement {
  params: {
    disabled?: boolean;
    model: boolean;
    label: string;
    summary?: string;
  };
}
export interface IFormElementCaptcha extends IFormElement {
  params: {
    disabled?: boolean;
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

export interface IFormElementButton extends IFormElement {
  params: {
    model: string;
    label?: string;
    requireModel?: boolean;
    action: () => Promise<void>;
  };
}
export interface IFormElementCountryPicker extends IFormElement {
  params: {
    model: any;
    disabled?: boolean;
    label?: string;
  };
}
export interface IFormElement {
  type?: FormElementType;
  config: IFormElementConfiguration;
  validation?: IFormElementStringValidation;
  params: any;
}

export interface IFormElementDropDown extends IFormElement {
  params: {
    model: any;
    items: any[];
    ltr?: boolean;
    disabled?: boolean;
    label?: string;
    backend?: string;
    prependIcon?: string;
    chooseLabel?: string;
    enum?: string;
    choose?: boolean;
    waiting?: boolean;
    allowClear?: boolean;
    backendParams?: any;
    enumExcept?: number;
    knownList?: DropdownKnownList;
  };
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
  pattern?: { value: RegExp; message: string };
}

export interface IFormElementCaptchaModel {
  token: string;
  code: string;
  expire: string;
}
