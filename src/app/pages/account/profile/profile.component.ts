import {Component, OnInit} from '@angular/core';
import {IdentityService} from '../../../services/auth/identity.service';
import {ModalService} from '../../../services/core/modal.service';
import {Router} from '@angular/router';
import {IFormGroup} from '../../../components/core/form/contracts';
import {FormService} from '../../../services/core/form.service';
import {OperationResultStatus} from '../../../library/core/enums';

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
    public readonly modalService: ModalService,
    public readonly formService: FormService,
    public readonly router: Router,
  ) {}

  async changePhoneNumber() {}
  async changePassword() {}
  async changeEmail() {}

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
              action: this.changePhoneNumber,
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
              action: this.changeEmail,
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
              action: this.changePassword,
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
    this.editing = true;
  }

  async update() {
    const model = this.formService.prepare(this.form);
    if (!model) { return; }
    this.waiting = true;
    const op = await this.identityService.updateProfile(model);
    this.waiting = false;
    if (op.status !== OperationResultStatus.Success) {
      // TODO: handle error
      return;
    }
    Object.assign(this.identityService.profile, model);
    this.editing = false;
  }
}
