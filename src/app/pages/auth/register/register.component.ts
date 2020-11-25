import { Component, OnInit } from '@angular/core';
import { FormViewModel } from '../../../components/core/form/contracts';
import { FormService } from '../../../services/core/form.service';
import { Router } from '@angular/router';
import { IdentityService } from '../../../services/auth/identity.service';
import { OperationResultStatus } from '../../../library/core/enums';
import { environment } from '../../../../environments/environment';
import {TranslateService} from '../../../services/core/translate.service';
import {GoogleAnalyticsService} from 'ngx-google-analytics';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  waiting: boolean;
  form: FormViewModel[];
  mode: ViewMode;
  ViewMode = ViewMode;
  username: string;
  verificationCode: string;
  googleOauth: string;

  constructor(
    private readonly router: Router,
    private readonly formService: FormService,
    private readonly identityService: IdentityService,
    private readonly translateService: TranslateService,
    private readonly gaService: GoogleAnalyticsService,
  ) {}

  ngOnInit() {
    this.googleOauth = environment.googleOauth;
    this.mode = ViewMode.Register;
    this.username = '';
    this.form = [
      {
        size: 6,
        elements: [
          this.formService.createInput({
            config: { field: 'firstName', label: 'FIRST_NAME' },
            params: { model: '' },
            validation: {
              required: { value: true, message: 'FIRST_NAME_REQUIRED' },
              minLength: { value: 2, message: 'FIRST_NAME_MIN_LENGTH' },
              maxLength: { value: 50, message: 'FIRST_NAME_MAX_LENGTH' },
            },
          }),
        ],
      },
      {
        size: 6,
        elements: [
          this.formService.createInput({
            config: { field: 'lastName', label: 'LAST_NAME' },
            params: { model: '' },
            validation: {
              required: { value: true, message: 'LAST_NAME_REQUIRED' },
              minLength: { value: 2, message: 'LAST_NAME_MIN_LENGTH' },
              maxLength: { value: 50, message: 'LAST_NAME_MAX_LENGTH' },
            },
          }),
        ],
      },
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
          this.formService.createCaptcha(),
        ],
      },
    ];

    this.gaService.pageView(
      window.location.pathname,
      this.translateService.fromKey('REGISTER')
    );
  }

  async register() {
    const model = this.formService.prepare(this.form);
    if (!model) {
      return;
    }
    this.waiting = true;
    const op = await this.identityService.register(model);
    this.waiting = false;
    if (op.status === OperationResultStatus.Success) {
      op.data = op.data || ({} as any);
      this.verificationCode = op.data.id;
      if (op.data.emailNotConfirmed) {
        this.username = model.username;
        this.mode = ViewMode.Confirm;
        return;
      }
      if (op.data.phoneNotConfirmed) {
        this.username = model.username;
        this.mode = ViewMode.Confirm;
        return;
      }
      if (op.data.duplicate) {
        this.formService.setErrors(this.form, 'username', ['USERNAME_TAKEN']);
        return;
      }
      if (op.data.smsFailed) {
        this.formService.setErrors(this.form, 'username', [
          'ACCOUNT_SMS_FAILED',
        ]);
        return;
      }
      if (op.data.emailFailed) {
        this.formService.setErrors(this.form, 'username', [
          'ACCOUNT_EMAIL_FAILED',
        ]);
        return;
      }
      this.username = model.username;
      this.mode = ViewMode.Confirm;
    }
  }

  async goBack() {
    await this.router.navigateByUrl('login');
  }
}
export enum ViewMode {
  Register = 1,
  Confirm = 2,
}
