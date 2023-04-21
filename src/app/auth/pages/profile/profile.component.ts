import { Component, OnInit } from '@angular/core';
import { IdentityService } from '../../services/identity.service';
import { ModalService } from '../../../shared/services/modal.service';
import { Router } from '@angular/router';
import { FormViewModel } from '../../../shared/components/form/contracts';
import { FormService } from '../../../shared/services/form.service';
import { FileType } from '../../../shared/lib/enums/enums';
import { NotificationService } from '../../../shared/services/notification.service';
import { ChangePhoneComponent } from '../../../__/modals/change-phone/change-phone.component';
import { ChangeEmailComponent } from '../../../__/modals/change-email/change-email.component';
import { GoogleAnalyticsService } from 'ngx-google-analytics';
import { TranslateService } from '../../../shared/services/translate.service';
import { OperationResultStatus } from '../../../shared/lib/enums/operation-result-status';
import { PromptModalComponent } from '../../../shared/modals/prompt-modal/prompt-modal.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  editing: boolean;
  waiting: boolean;
  form: FormViewModel[];
  constructor(
    public readonly identityService: IdentityService,
    private readonly modalService: ModalService,
    private readonly formService: FormService,
    private readonly router: Router,
    private readonly notificationService: NotificationService,
    private readonly translateService: TranslateService,
    private readonly gaService: GoogleAnalyticsService,
  ) {}

  async prepareChangePhoneNumber() {
    // this.modalService.show(ChangePhoneComponent, {}).subscribe(result => {
    //   if (result) {
    //     this.identityService.profile.phone = result;
    //     this.edit();
    //   }
    // });
  }
  async prepareChangeEmail() {
    // this.modalService.show(ChangeEmailComponent, {}).subscribe(result => {
    //   if (result) {
    //     this.identityService.profile.email = result;
    //     this.edit();
    //   }
    // });
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
    await this.modalService.show(PromptModalComponent, {
      form: [
        {
          elements: [
            this.formService.createInput({
              config: { field: 'oldPassword' },
              params: {
                model: '',
                password: true,
                ltr: true,
                placeHolder: 'OLD_PASSWORD',
              },
              validation: {
                required: { value: true, message: 'OLD_PASSWORD_REQUIRED' },
                minLength: { value: 6, message: 'PASSWORD_MIN_LENGTH' },
                maxLength: { value: 50, message: 'PASSWORD_MAX_LENGTH' },
              },
            }),
            this.formService.createInput({
              config: { field: 'password' },
              params: {
                model: '',
                password: true,
                ltr: true,
                placeHolder: 'PASSWORD',
              },
              validation: {
                required: { value: true, message: 'PASSWORD_REQUIRED' },
                minLength: { value: 6, message: 'PASSWORD_MIN_LENGTH' },
                maxLength: { value: 50, message: 'PASSWORD_MAX_LENGTH' },
              },
            }),
            this.formService.createInput({
              config: { field: 'confirmPassword' },
              params: {
                model: '',
                password: true,
                ltr: true,
                placeHolder: 'CONFIRM_PASSWORD',
              },
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
    });
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
              field: 'phone',
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
          this.formService.createFilePicker({
            config: {
              cssClass: 'avatar',
              label: 'CHANGE_AVATAR',
              field: 'avatar',
            },
            params: {
              fileType: FileType.Image,
            },
          }),
          this.formService.createCheckbox({
            config: {
              cssClass: 'dark-mode',
              label: '',
              field: 'darkMode',
            },
            params: {
              model: false,
              label: 'DARK_MODE',
            },
          }),
        ],
      },
    ];

    this.gaService.pageView(
      window.location.pathname,
      this.translateService.fromKey('PROFILE'),
      undefined,
      { user_id: this.identityService.identity.userId },
    );
  }

  async logout() {
    const response = await this.modalService
      .confirm({
        title: 'MODALS_CONFIRM_TITLE',
        description: 'MODALS_CONFIRM_MESSAGE',
        subTitle: 'MODALS_CONFIRM_MESSAGE_HEADING',
        confirmLabel: 'LOGOUT',
        cancelLabel: 'CANCEL',
      });
    if (response.confirmed) {
      this.identityService.logout();
      setTimeout(() => {
        window.location.reload();
      }, 500);
      return Promise.resolve(true);
    }
  }

  edit() {
    this.formService.reset(this.form);
    this.formService.setModel(this.form, this.identityService.profile);
    if (
      this.identityService.profile.email &&
      this.identityService.profile.email.indexOf('@asoode.user') === -1 &&
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
    document.body.classList.remove('dark-mode');
    if (model.darkMode) {
      document.body.classList.add('dark-mode');
    }
    this.editing = false;
    this.notificationService.success('PROFILE_UPDATE_SUCCESS');
  }
}
