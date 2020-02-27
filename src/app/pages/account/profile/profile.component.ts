import { Component, OnInit } from '@angular/core';
import { IdentityService } from '../../../services/auth/identity.service';
import { ModalService } from '../../../services/core/modal.service';
import { Router } from '@angular/router';
import { IFormGroup } from '../../../components/core/form/contracts';
import { FormService } from '../../../services/core/form.service';
import { OperationResultStatus } from '../../../library/core/enums';
import { PromptComponent } from '../../../modals/prompt/prompt.component';
import { NotificationService } from '../../../services/core/notification.service';
import { ChangePhoneComponent } from '../../../modals/change-phone/change-phone.component';
import { ValidationService } from '../../../services/core/validation.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  editing: boolean;
  waiting: boolean;
  form: IFormGroup[];
  constructor(
    public readonly identityService: IdentityService,
    private readonly modalService: ModalService,
    private readonly formService: FormService,
    private readonly router: Router,
    private readonly notificationService: NotificationService,
  ) {}

  async prepareChangePhoneNumber() {
    this.modalService.show(ChangePhoneComponent, {}).subscribe(() => {});
  }
  async changeEmail(model: any, form) {
    if (model.email === this.identityService.profile.email) {
      this.formService.setErrors(form, 'email', ['NEW_EMAIL_MUST_DIFFER']);
      throw new Error('NEW_EMAIL_MUST_DIFFER');
    }
    const op = await this.identityService.changeEmail(model);
    if (op.status !== OperationResultStatus.Success) {
      // TODO: handle error
      return;
    }
    this.notificationService.success('PLEASE_CHECK_EMAIL');
  }
  async prepareChangeEmail() {
    this.modalService
      .show(PromptComponent, {
        form: [
          {
            elements: [
              this.formService.createInput({
                config: { label: 'EMAIL', field: 'email' },
                params: { model: '' },
                validation: {
                  required: {
                    value: true,
                    message: 'EMAIL_REQUIRED',
                  },
                  pattern: {
                    value: ValidationService.emailRegex,
                    message: 'EMAIL_INVALID',
                  },
                },
              }),
            ],
          },
        ],
        summary: 'CHANGE_EMAIL_CONFIRM_EMAIL',
        actionLabel: 'SEND_EMAIL_CONFIRMATION',
        action: (model, form) => this.changeEmail(model, form),
        actionColor: 'primary',
        title: 'CHANGE_EMAIL',
        width: 350,
        model: {
          email: this.identityService.profile.email,
        },
      })
      .subscribe(() => {});
  }
  async changePassword(model: any, form) {
    const op = await this.identityService.changePassword({
      newPassword: model.password,
      oldPassword: model.oldPassword,
    });
    if (op.status === OperationResultStatus.Success) {
      this.notificationService.success('GENERAL_SUCCESS');
    } else {
      this.formService.setErrors(form, 'oldPassword', ['OLD_PASSWORD_INVALID']);
      throw new Error('OLD_PASSWORD_INVALID');
    }
  }
  async prepareChangePassword() {
    this.modalService
      .show(PromptComponent, {
        form: [
          {
            elements: [
              this.formService.createInput({
                config: { field: 'oldPassword', label: 'OLD_PASSWORD' },
                params: { model: '', password: true, ltr: true },
                validation: {
                  required: { value: true, message: 'OLD_PASSWORD_REQUIRED' },
                  minLength: { value: 6, message: 'PASSWORD_MIN_LENGTH' },
                  maxLength: { value: 50, message: 'PASSWORD_MAX_LENGTH' },
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
                  required: {
                    value: true,
                    message: 'CONFIRM_PASSWORD_REQUIRED',
                  },
                  match: {
                    toField: 'password',
                    message: 'CONFIRM_PASSWORD_MISS_MATCH',
                  },
                },
              }),
            ],
          },
        ],
        actionLabel: 'RESET_PASSWORD',
        action: (model, form) => this.changePassword(model, form),
        actionColor: 'primary',
        title: 'RESET_PASSWORD',
        width: 350,
      })
      .subscribe(() => {});
  }

  ngOnInit() {
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
          this.formService.createInput({
            config: { field: 'bio', label: 'BIO' },
            params: { model: '' },
            validation: {
              required: { value: false },
              maxLength: { value: 500, message: 'BIO_MAX_LENGTH' },
            },
          }),
          this.formService.createButton({
            config: {
              label: 'PHONE_NUMBER',
              field: 'phoneNumber',
              cssClass: 'change-phone',
            },
            params: {
              model: '',
              requireModel: true,
              label: 'CHANGE_PHONE',
              action: () => this.prepareChangePhoneNumber(),
            },
          }),
          this.formService.createButton({
            config: {
              field: 'email',
              label: 'EMAIL',
              cssClass: 'change-email',
            },
            params: {
              model: '',
              requireModel: true,
              label: 'CHANGE_EMAIL',
              action: () => this.prepareChangeEmail(),
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
          this.formService.createTimezone({
            config: { field: 'timeZone', label: 'TIME_ZONE' },
            params: { model: undefined },
            validation: {
              required: { value: true, message: 'TIME_ZONE_REQUIRED' },
            },
          }),
          this.formService.createDropDown({
            config: { field: 'calendar', label: 'CALENDAR' },
            params: { model: undefined, items: [], enum: 'CalendarType' },
            validation: {
              required: { value: true, message: 'CALENDAR_REQUIRED' },
            },
          }),
          this.formService.createButton({
            config: {
              cssClass: 'change-password',
              label: '',
              field: '',
            },
            params: {
              model: '',
              label: 'CHANGE_PASSWORD',
              action: () => this.prepareChangePassword(),
            },
          }),
        ],
      },
    ];
  }

  logout() {
    this.modalService
      .confirm({
        title: 'MODALS_CONFIRM_TITLE',
        message: 'MODALS_CONFIRM_MESSAGE',
        heading: 'MODALS_CONFIRM_MESSAGE_HEADING',
        actionLabel: 'LOGOUT',
        cancelLabel: 'CANCEL',
        action: async () => {
          this.identityService.logout();
          return Promise.resolve(true);
        },
      })
      .subscribe(async result => {
        if (!result) {
          return;
        }
        await this.router.navigateByUrl('/dashboard');
      });
  }

  edit() {
    this.formService.reset(this.form);
    this.formService.setModel(this.form, this.identityService.profile);
    if (
      this.identityService.profile.email &&
      !this.identityService.profile.emailConfirmed
    ) {
      this.formService.setErrors(this.form, 'email', ['PLEASE_CHECK_EMAIL']);
    }
    this.editing = true;
  }

  async update() {
    const model = this.formService.prepare(this.form);
    if (!model) {
      return;
    }
    this.waiting = true;
    const op = await this.identityService.updateProfile(model);
    this.waiting = false;
    if (op.status !== OperationResultStatus.Success) {
      // TODO: handle error
      return;
    }
    Object.assign(this.identityService.profile, model);
    this.editing = false;
    this.notificationService.success('PROFILE_UPDATE_SUCCESS');
  }
}
