import { Injectable } from '@angular/core';
import { OperationResultStatus } from '../../library/core/enums';
import { StringDictionary } from '../../library/core/dictionary';
import { TranslateService } from './translate.service';
// import { ToastrService } from './toastr.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(
    readonly translate: TranslateService, // readonly toastr: ToastrService,
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
    // this.toastr.clear();
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
    key: string,
    title: string = null,
    replace: StringDictionary<string> = null,
    options: NotificationOptions = null,
  ) {
    // this.toastr.error(
    //   this.clean(key, replace),
    //   this.clean(title, replace),
    //   options,
    // );
  }

  info(
    key: string,
    title: string = null,
    replace: StringDictionary<string> = null,
    options: NotificationOptions = null,
  ) {
    // this.toastr.info(
    //   this.clean(key, replace),
    //   this.clean(title, replace),
    //   options,
    // );
  }

  success(
    key: string,
    title: string = null,
    replace: StringDictionary<string> = null,
    options: NotificationOptions = null,
  ) {
    // this.toastr.success(
    //   this.clean(key, replace),
    //   this.clean(title, replace),
    //   options,
    // );
  }

  warning(
    key: string,
    title: string = null,
    replace: StringDictionary<string> = null,
    options: NotificationOptions = null,
  ) {
    // this.toastr.warning(
    //   this.clean(key, replace),
    //   this.clean(title, replace),
    //   options,
    // );
  }
}
