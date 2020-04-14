import { Component, OnInit } from '@angular/core';
import { FormViewModel } from '../../../components/core/form/contracts';
import { FormService } from '../../../services/core/form.service';
import { IdentityService } from '../../../services/auth/identity.service';
import { OperationResultStatus } from '../../../library/core/enums';
import { ActivatedRoute, Router } from '@angular/router';
import { AppInitializerProvider } from '../../../services/general/app.initializer';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form: FormViewModel[];
  waiting: boolean;
  mode: ViewMode;
  username: string;
  googleOauth: string;

  ViewMode = ViewMode;
  verificationCode: string;
  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly initializerProvider: AppInitializerProvider,
    private readonly formService: FormService,
    private readonly identityService: IdentityService,
  ) {}

  ngOnInit() {
    this.googleOauth = environment.googleOauth;
    this.mode = ViewMode.Login;
    this.username = '';

    const oauth = (this.activatedRoute.snapshot.queryParams as any).access;
    if (oauth) {
      const access = JSON.parse(atob(oauth));
      this.identityService.setIdentityInfo(access);
      this.mode = ViewMode.OAuth;
      this.initializerProvider.refresh().then(() => {
        this.router.navigateByUrl('/dashboard');
      });
    }
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
      this.verificationCode = op.data.id;
      if (op.data.token) {
        await this.initializerProvider.refresh();
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
      if (op.data.emailNotConfirmed) {
        this.username = model.username;
        this.mode = ViewMode.Confirm;
        return;
      }
      if (op.data.phoneNotConfirmed) {
        this.username = model.username;
        this.mode = ViewMode.Confirm;
      }
      return;
    }

    this.waiting = false;
  }

  confirmPhone() {}
}
export enum ViewMode {
  Login = 1,
  Confirm = 2,
  OAuth = 3,
}
