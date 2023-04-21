import { Component, OnInit } from '@angular/core';
import { SimpleModalComponent } from 'ngx-simple-modal';
import { GroupViewModel } from '../../../view-models/groups/group-types';
import { FormViewModel } from '../../../shared/components/form/contracts';
import { FormService } from '../../../shared/services/form.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { GroupService } from '../../../groups/services/group.service';
import { OperationResultStatus } from '../../../shared/lib/enums/operation-result-status';

@Component({
  selector: 'app-group-detail',
  templateUrl: './group-detail.component.html',
  styleUrls: ['./group-detail.component.scss'],
})
export class GroupDetailComponent
  extends SimpleModalComponent<
    { group: GroupViewModel; canEdit: boolean },
    boolean
  >
  implements OnInit {
  group: GroupViewModel;
  canEdit: boolean;
  editing: boolean;
  form: FormViewModel[];
  waiting: boolean;
  constructor(
    private readonly formService: FormService,
    private readonly notificationService: NotificationService,
    private readonly groupService: GroupService,
  ) {
    super();
  }

  ngOnInit() {
    this.form = [
      {
        elements: [
          this.formService.createInput({
            config: { field: 'title', label: 'TITLE' },
            params: { model: '' },
            validation: {
              required: {
                value: true,
                message: 'GROUP_TITLE_REQUIRED',
              },
            },
          }),
          this.formService.createInput({
            config: { field: 'description', label: 'DESCRIPTION' },
            params: { model: '', textArea: true },
          }),
          this.formService.createInput({
            config: { field: 'brandTitle', label: 'BRAND_TITLE' },
            params: { model: '' },
          }),
          this.formService.createInput({
            config: { field: 'supervisorName', label: 'SUPERVISOR_NAME' },
            params: { model: '' },
          }),
          this.formService.createInput({
            config: { field: 'supervisorNumber', label: 'SUPERVISOR_NUMBER' },
            params: { model: '', numeric: true },
          }),
          this.formService.createInput({
            config: { field: 'responsibleName', label: 'RESPONSIBLE_NAME' },
            params: { model: '' },
          }),
          this.formService.createInput({
            config: { field: 'responsibleNumber', label: 'RESPONSIBLE_NUMBER' },
            params: { model: '', numeric: true },
          }),
          this.formService.createInput({
            config: { field: 'email', label: 'EMAIL' },
            params: { model: '' },
          }),
          this.formService.createInput({
            config: { field: 'website', label: 'WEBSITE' },
            params: { model: '' },
          }),
          this.formService.createInput({
            config: { field: 'postalCode', label: 'POSTAL_CODE' },
            params: { model: '', numeric: true },
          }),
          this.formService.createInput({
            config: { field: 'address', label: 'ADDRESS' },
            params: { model: '', textArea: true },
          }),
          this.formService.createInput({
            config: { field: 'tel', label: 'TEL' },
            params: { model: '', numeric: true },
          }),
          this.formService.createInput({
            config: { field: 'fax', label: 'FAX' },
            params: { model: '', numeric: true },
          }),
          this.formService.createInput({
            config: { field: 'nationalId', label: 'NATIONAL_ID' },
            params: { model: '' },
          }),
          this.formService.createInput({
            config: { field: 'registrationId', label: 'REGISTRATION_ID' },
            params: { model: '' },
          }),
          this.formService.createDatePicker({
            config: { field: 'registeredAt', label: 'REGISTRATION_DATE' },
            params: { model: undefined },
          }),
          this.formService.createInput({
            config: { field: 'offices', label: 'NO_OF_OFFICES' },
            params: { model: undefined, numeric: true },
          }),
          this.formService.createInput({
            config: { field: 'employees', label: 'NO_OF_EMPLOYEES' },
            params: { model: undefined, numeric: true },
          }),
        ],
      },
    ];
    this.formService.setModel(this.form, this.group);
  }

  async save() {
    const model = this.formService.prepare(this.form);
    if (!model) {
      return;
    }
    this.waiting = true;
    const op = await this.groupService.edit(this.group.id, model);
    this.waiting = false;
    if (op.status !== OperationResultStatus.Success) {
      // TODO: handle error;
      return;
    }
    this.notificationService.success('PROFILE_UPDATE_SUCCESS');
    this.editing = false;
  }
}
