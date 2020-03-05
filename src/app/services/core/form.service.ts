import { Injectable } from '@angular/core';
import {
  IFormElement,
  IFormElementButton,
  IFormElementCaptcha,
  IFormElementCountryPicker,
  IFormElementDropDown,
  IFormElementInput,
  IFormElementVerification,
  FormViewModel,
  IFormElementCheckbox,
} from '../../components/core/form/contracts';
import { DropdownKnownList, FormElementType } from '../../library/core/enums';

const CAPTCHA_LENGTH = 5;
const VERIFICATION_LENGTH = 6;

@Injectable({
  providedIn: 'root',
})
export class FormService {
  constructor() {}

  createCheckbox(options: IFormElementCheckbox): IFormElementCheckbox {
    options.type = FormElementType.Checkbox;
    options.validation = options.validation || { required: { value: false } };
    return options;
  }
  createInput(options: IFormElementInput): IFormElementInput {
    options.type = FormElementType.Input;
    options.validation = options.validation || { required: { value: false } };
    return options;
  }

  createVerification(
    options: IFormElementVerification,
  ): IFormElementVerification {
    options.type = FormElementType.Verification;
    options.validation = options.validation || {
      required: { value: true, message: 'VERIFICATION_REQUIRED' },
      length: {
        value: VERIFICATION_LENGTH,
        message: 'VERIFICATION_CODE_INVALID',
      },
    };
    return options;
  }

  createButton(options: IFormElementButton): IFormElementButton {
    options.type = FormElementType.Button;
    options.validation = { errors: [], required: { value: false } };
    return options;
  }
  createDropDown(options: IFormElementDropDown): IFormElementDropDown {
    options.type = FormElementType.DropDown;
    options.validation = options.validation || { required: { value: false } };
    return options;
  }
  createCountryPicker(
    options: IFormElementCountryPicker,
  ): IFormElementDropDown {
    const casted = options as IFormElementDropDown;
    casted.type = FormElementType.DropDown;
    casted.params.knownList = DropdownKnownList.Countries;
    casted.validation = casted.validation || { required: { value: false } };
    return casted;
  }
  createTimezone(options: IFormElementCountryPicker): IFormElementDropDown {
    const casted = options as IFormElementDropDown;
    casted.type = FormElementType.DropDown;
    casted.params.knownList = DropdownKnownList.Zones;
    casted.params.ltr = true;
    casted.validation = casted.validation || { required: { value: false } };
    return casted;
  }

  createCaptcha(): IFormElementCaptcha {
    return {
      validation: {
        required: { value: true, message: 'CAPTCHA_REQUIRED' },
        length: { value: CAPTCHA_LENGTH, message: 'CAPTCHA_LENGTH' },
      },
      config: { field: 'captcha', label: 'GENERAL_CAPTCHA' },
      params: { model: { code: '', expire: '', token: '' } },
      type: FormElementType.Captcha,
    } as IFormElementCaptcha;
  }

  prepare(form: FormViewModel[]): any {
    this.clearErrors(form);
    const model = this.getModel(form);
    const isValid = this.validateModel(form, model);
    if (!isValid) {
      return null;
    }
    return model;
  }
  clean(form: FormViewModel[]) {
    this.reset(form);
    this.clearErrors(form);
  }
  clearErrors(form: FormViewModel[]) {
    form.forEach(group => {
      group.elements.forEach(element => {
        if (!element.validation) {
          return;
        }
        element.validation.errors = [];
      });
    });
  }
  setErrors(form: FormViewModel[], field: string, errors: string[]) {
    form.forEach(group => {
      group.elements.forEach(element => {
        if (!element.validation || element.config.field !== field) {
          return;
        }
        element.validation.errors = errors;
      });
    });
  }
  getModel(form: FormViewModel[]): any {
    const model = {} as any;
    form.forEach(group => {
      group.elements.forEach(element => {
        if (element.type === FormElementType.Button) {
          return;
        }
        model[element.config.field] = element.params.model;
      });
    });
    return model;
  }
  setModel(form: FormViewModel[], model: any): void {
    form.forEach(group => {
      group.elements.forEach(element => {
        element.params.model = model[element.config.field];
      });
    });
  }
  reset(form: FormViewModel[]) {
    form.forEach(group => {
      group.elements.forEach(element => {
        element.params.model = undefined;
      });
    });
  }
  private validateModel(form: FormViewModel[], model: any): boolean {
    let isValid = true;
    form.forEach(group => {
      group.elements.forEach(element => {
        if (element.type === FormElementType.Button) {
          return;
        }
        if (!element.validation) {
          return;
        }
        const validated = this.validateField(element, model);
        if (validated) {
          return;
        }
        isValid = false;
      });
    });
    return isValid;
  }
  private validateField(element: IFormElement, model: any): boolean {
    switch (element.type) {
      case FormElementType.Input:
      case FormElementType.Verification:
      case FormElementType.AutoComplete:
        return this.validateString(element, model);
      case FormElementType.Captcha:
        return this.validateCaptcha(element);
      case FormElementType.DatePicker:
        return this.validateDate(element);
      case FormElementType.Radio:
      case FormElementType.Checkbox:
      case FormElementType.Switch:
      case FormElementType.ZonePicker:
      case FormElementType.CountryPicker:
      case FormElementType.DropDown:
      case FormElementType.Editor:
      case FormElementType.LocationPicker:
        return this.validateDefined(element);
      case FormElementType.ColorPicker:
        return this.validateColor(element);
      case FormElementType.File:
        return this.validateFile(element);
      case FormElementType.Tag:
        return this.validateArray(element);
    }
  }
  private validateDefined(element: IFormElement): boolean {
    const isValid = element.params.model !== undefined;
    if (!isValid) {
      element.validation.errors = [element.validation.required.message];
    }
    return isValid;
  }
  private validateCaptcha(element: IFormElement): boolean {
    const code = (element.params.model as any).code;
    if (!code) {
      element.validation.errors = [element.validation.required.message];
      return false;
    }
    if (code.length !== CAPTCHA_LENGTH) {
      element.validation.errors = [element.validation.length.message];
      return false;
    }
    return true;
  }
  private validateString(element: IFormElement, model: any): boolean {
    if (element.validation.required && element.validation.required.value) {
      if (!element.params.model || !element.params.model.length) {
        element.validation.errors = [element.validation.required.message];
        return false;
      }
    }
    if (element.validation.match && element.validation.match.toField) {
      if (element.params.model !== model[element.validation.match.toField]) {
        element.validation.errors = [element.validation.match.message];
        return false;
      }
    }
    if (element.validation.length && element.validation.length.value) {
      if (
        !element.params.model ||
        element.params.model.length !== element.validation.length.value
      ) {
        element.validation.errors = [element.validation.length.message];
        return false;
      }
    }
    if (element.validation.minLength && element.validation.minLength.value) {
      if (
        !element.params.model ||
        element.params.model.length < element.validation.minLength.value
      ) {
        element.validation.errors = [element.validation.minLength.message];
        return false;
      }
    }
    if (element.validation.maxLength && element.validation.maxLength.value) {
      if (
        element.params.model &&
        element.params.model.length > element.validation.maxLength.value
      ) {
        element.validation.errors = [element.validation.maxLength.message];
        return false;
      }
    }
    if (element.validation.pattern && element.validation.pattern.value) {
      if (!element.validation.pattern.value.test(element.params.model || '')) {
        element.validation.errors = [element.validation.pattern.message];
        return false;
      }
    }
    return true;
  }
  private validateArray(element: IFormElement): boolean {
    return false;
  }
  private validateDate(element: IFormElement): boolean {
    return false;
  }
  private validateColor(element: IFormElement): boolean {
    return false;
  }
  private validateFile(element: IFormElement): boolean {
    return false;
  }
}
