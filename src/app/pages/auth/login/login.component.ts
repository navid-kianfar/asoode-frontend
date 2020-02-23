import { Component, OnInit } from '@angular/core';
import { IFormGroup } from '../../../components/core/form/contracts';
import { FormService } from '../../../services/core/form.service';
import { IdentityService } from '../../../services/auth/identity.service';
import { OperationResultStatus } from '../../../library/core/enums';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form: IFormGroup[];
  waiting: boolean;
  mode: ViewMode;

  ViewMode = ViewMode;
  constructor(
    private readonly router: Router,
    private readonly formService: FormService,
    private readonly identityService: IdentityService,
  ) {}

  ngOnInit() {
    this.mode = ViewMode.Login;
    this.form = [
      {
        elements: [
          this.formService.createInput({
            config: { field: 'username', label: 'EMAIL_OR_PHONE' },
            params: { model: '', ltr: true },
            validation: {
              required: { value: true, message: 'EMAIL_OR_PHONE_REQUIRED' },
              minLength: { value: 10, message: 'EMAIL_OR_PHONE_MIN_LENGTH' },
              maxLength: { value: 50, message: 'EMAIL_OR_PHONE_MAX_LENGTH' },
            },
          }),
          this.formService.createInput({
            config: { field: 'password', label: 'PASSWORD' },
            params: { model: '', password: true, ltr: true },
            validation: {
              required: { value: true, message: 'PASSWORD_REQUIRED' },
              minLength: { value: 6, message: 'PASSWORD_MIN_LENGTH' },
              maxLength: { value: 50, message: 'PASSWORD_MAX_LENGTH' },
            },
          }),
          this.formService.createCaptcha(),
        ],
      },
    ];
  }

  async login() {
    const model = this.formService.prepare(this.form);
    if (!model) {
      return;
    }
    this.waiting = true;
    const op = await this.identityService.login(model);
    if (op.status === OperationResultStatus.Success) {
      if (op.data.token) {
        await this.router.navigateByUrl('/dashboard');
        return;
      }
      this.waiting = false;
      if (op.data.invalidPassword || op.data.notFound) {
        this.formService.setErrors(this.form, 'password', [
          'INVALID_USERNAME_PASSWORD',
        ]);
        return;
      }
      if (op.data.lockedOut) {
        this.formService.setErrors(this.form, 'username', [
          'ACCOUNT_LOCKED_OUT',
        ]);
        return;
      }
      if (op.data.smsFailed) {
        this.formService.setErrors(this.form, 'username', [
          'ACCOUNT_SMS_FAILED',
        ]);
        return;
      }
      if (op.data.emailNotConfirmed) {
        this.mode = ViewMode.ConfirmEmail;
        return;
      }
      if (op.data.phoneNotConfirmed) {
        this.mode = ViewMode.ConfirmPhone;
      }
      return;
    }

    this.waiting = false;
  }

  confirmPhone() {}
}
export enum ViewMode {
  Login = 1,
  ConfirmEmail = 2,
  ConfirmPhone = 3,
}
