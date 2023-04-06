import { Component, OnInit } from '@angular/core';
import { FormViewModel } from '../../../components/core/form/contracts';
import { Router } from '@angular/router';
import { AppInitializerProvider } from '../../../services/general/app.initializer';
import { FormService } from '../../../services/core/form.service';
import { IdentityService } from '../../../services/auth/identity.service';
import { OperationResultStatus } from '../../../library/core/enums';
import { ValidationService } from '../../../services/core/validation.service';
import { GoogleAnalyticsService } from 'ngx-google-analytics';
import { TranslateService } from '../../../services/core/translate.service';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.scss'],
})
export class ForgotComponent implements OnInit {
  ViewMode = ViewMode;
  form: FormViewModel[];
  resetForm: FormViewModel[];
  waiting: boolean;
  mode: ViewMode;
  username: string;
  tokenId: string;
  isEmail: boolean;

  constructor(
    private readonly router: Router,
    private readonly initializerProvider: AppInitializerProvider,
    private readonly formService: FormService,
    private readonly identityService: IdentityService,
    private readonly gaService: GoogleAnalyticsService,
    private readonly translateService: TranslateService,
  ) {}

  ngOnInit() {
    this.mode = ViewMode.Forgot;
    this.isEmail = false;
    this.resetForm = [
      {
        elements: [
          this.formService.createInput({
            config: { field: 'password', label: 'PASSWORD' },
            params: { model: '', password: true, ltr: true },
            validation: {
              required: { value: true, message: 'PASSWORD_REQUIRED' },
              minLength: { value: 6, message: 'PASSWORD_MIN_LENGTH' },
              maxLength: { value: 50, message: 'PASSWORD_MAX_LENGTH' },
            },
          }),
          this.formService.createInput({
            config: { field: 'confirmPassword', label: 'CONFIRM_PASSWORD' },
            params: { model: '', password: true, ltr: true },
            validation: {
              required: { value: true, message: 'CONFIRM_PASSWORD_REQUIRED' },
              match: {
                toField: 'password',
                message: 'CONFIRM_PASSWORD_MISS_MATCH',
              },
            },
          }),
          this.formService.createVerification({
            config: { field: 'code', label: 'VERIFICATION_CODE' },
            params: { model: '' },
          }),
        ],
      },
    ];
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
        ],
      },
    ];

    this.gaService.pageView(
      window.location.pathname,
      this.translateService.fromKey('FORGOT_PASSWORD'),
    );
  }

  async forgot() {
    const model = this.formService.prepare(this.form);
    if (!model) {
      return;
    }
    this.waiting = true;
    const op = await this.identityService.forgot(model);
    this.waiting = false;
    if (op.status !== OperationResultStatus.Success) {
      // TODO: handle error
      return;
    }
    if (op.data.lockedOut) {
      this.formService.setErrors(this.form, 'username', ['ACCOUNT_LOCKED_OUT']);
      return;
    }
    if (op.data.notFound) {
      this.formService.setErrors(this.form, 'username', [
        'IF_YOU_DONT_HAVE_ACCOUNT',
      ]);
      return;
    }
    if (op.data.smsFailed) {
      this.formService.setErrors(this.form, 'username', ['ACCOUNT_SMS_FAILED']);
      return;
    }
    if (op.data.emailFailed) {
      this.formService.setErrors(this.form, 'username', [
        'ACCOUNT_EMAIL_FAILED',
      ]);
      return;
    }
    if (op.data.emailNotConfirmed) {
      this.formService.setErrors(this.form, 'username', [
        'EMAIL_NOT_CONFIRMED',
      ]);
      return;
    }
    if (op.data.phoneNotConfirmed) {
      this.formService.setErrors(this.form, 'username', [
        'PHONE_NOT_CONFIRMED',
      ]);
      return;
    }

    this.mode = ViewMode.Confirm;
    this.username = model.username;
    this.tokenId = op.data.id;
    this.isEmail = ValidationService.isEmail(model.username);
  }

  async reset() {
    const model = this.formService.prepare(this.resetForm) as any;
    if (!model) {
      return;
    }
    model.id = this.tokenId;
    this.waiting = true;
    const op = await this.identityService.resetPassword(model);
    this.waiting = false;
    if (op.status !== OperationResultStatus.Success) {
      this.formService.setErrors(this.resetForm, 'code', [
        'VERIFICATION_CODE_INVALID',
      ]);
      return;
    }

    if (op.data.token) {
      await this.initializerProvider.refresh();
      await this.router.navigateByUrl('/dashboard');
      return;
    }
  }
}
export enum ViewMode {
  Forgot = 1,
  Confirm = 2,
}
