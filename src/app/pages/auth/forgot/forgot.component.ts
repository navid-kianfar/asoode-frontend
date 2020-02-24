import { Component, OnInit } from '@angular/core';
import {IFormGroup} from '../../../components/core/form/contracts';
import {Router} from '@angular/router';
import {AppInitializerProvider} from '../../../services/app.initializer';
import {FormService} from '../../../services/core/form.service';
import {IdentityService} from '../../../services/auth/identity.service';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.scss'],
})
export class ForgotComponent implements OnInit {
  form: IFormGroup[];
  resetForm: IFormGroup[];
  waiting: boolean;
  mode: ViewMode;
  username: string;

  ViewMode = ViewMode;
  constructor(
    private readonly router: Router,
    private readonly initializerProvider: AppInitializerProvider,
    private readonly formService: FormService,
    private readonly identityService: IdentityService,
  ) {}

  ngOnInit() {
    this.mode = ViewMode.Forgot;
    this.username = '';
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
            config: { field: 'token', label: 'VERIFICATION_CODE' },
            params: { model: '' }
          }),
        ],
      },
    ];
    this.form = [
      {
        elements: [
          this.formService.createInput({
            config: {field: 'username', label: 'EMAIL_OR_PHONE'},
            params: {model: '', ltr: true},
            validation: {
              required: {value: true, message: 'EMAIL_OR_PHONE_REQUIRED'},
              minLength: {value: 10, message: 'EMAIL_OR_PHONE_MIN_LENGTH'},
              maxLength: {value: 50, message: 'EMAIL_OR_PHONE_MAX_LENGTH'},
            },
          }),
          this.formService.createCaptcha(),
        ]
      }
    ];
  }

  async forgot() {
    const model = this.formService.prepare(this.form);
    if (!model) {
      return;
    }
    this.waiting = true;
    const op = await this.identityService.forgot(model);
    console.log(op);
  }

  async reset() {
    const model = this.formService.prepare(this.resetForm);
    if (!model) {
      return;
    }
    this.waiting = true;
    const op = await this.identityService.resetPassword(model);
    console.log(op);
  }
}
export enum ViewMode {
  Forgot = 1,
  Confirm = 2
}
