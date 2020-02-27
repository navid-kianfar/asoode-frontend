import { Injectable } from '@angular/core';
import { OperationResultStatus } from '../../library/core/enums';
import { StringDictionary } from '../../library/core/dictionary';
import { TranslateService } from './translate.service';
import { MatSnackBar } from '@angular/material';

const CONFIG = {
  verticalPosition: 'top',
  horizontalPosition: 'center',
  duration: 7000,
};

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(
    private readonly translate: TranslateService,
    private readonly snackBar: MatSnackBar,
  ) {}

  handleRequest(op: OperationResultStatus) {
    switch (op) {
      case OperationResultStatus.Pending:
        this.error('GENERAL_PENDING');
        break;
      case OperationResultStatus.Success:
        this.success('GENERAL_SUCCESS');
        break;
      case OperationResultStatus.NotFound:
        this.error('GENERAL_NOTFOUND');
        break;
      case OperationResultStatus.Duplicate:
        this.error('GENERAL_DUPLICATE');
        break;
      case OperationResultStatus.Rejected:
        this.error('GENERAL_REJECTED');
        break;
      case OperationResultStatus.UnAuthorized:
        this.error('GENERAL_UNAUTHORIZED');
        break;
      case OperationResultStatus.Validation:
        this.error('GENERAL_VALIDATION');
        break;
      case OperationResultStatus.Failed:
        this.error('GENERAL_FAILED');
        break;
      case OperationResultStatus.Captcha:
        this.error('GENERAL_CAPTCHA');
        break;
    }
  }

  clear() {
    this.snackBar.dismiss();
  }

  clean(input: string, replace: StringDictionary<string> = null): string {
    if (input) {
      input = this.translate.fromKey(input);
    }
    if (replace !== null) {
      replace.Keys().forEach(k => {
        const value = replace.Item(k);
        k = k.replace('{', '\\{').replace('}', '\\}');
        input = input.replace(new RegExp(k, 'g'), value);
      });
    }
    return input;
  }

  error(
    message: string,
    replace: StringDictionary<string> = null,
    options: any = null,
  ) {
    const params = { ...CONFIG, panelClass: 'error-snack', ...options };
    this.snackBar.open(this.clean(message, replace), undefined, params);
  }

  info(
    message: string,
    replace: StringDictionary<string> = null,
    options: any = null,
  ) {
    const params = { ...CONFIG, panelClass: 'info-snack', ...options };
    this.snackBar.open(this.clean(message, replace), undefined, params);
  }

  success(
    message: string,
    replace: StringDictionary<string> = null,
    options: any = null,
  ) {
    const params = { ...CONFIG, panelClass: 'success-snack', ...options };
    this.snackBar.open(this.clean(message, replace), undefined, params);
  }

  warning(
    message: string,
    replace: StringDictionary<string> = null,
    options: any = null,
  ) {
    const params = { ...CONFIG, panelClass: 'warning-snack', ...options };
    this.snackBar.open(this.clean(message, replace), undefined, params);
  }
}
