import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormViewModel } from '../../../../shared/components/form/contracts';
import { CultureService } from '../../../../shared/services/culture.service';
import { FormService } from '../../../../shared/services/form.service';
import { ValidationService } from '../../../../shared/services/validation.service';
import { NotificationService } from '../../../../shared/services/notification.service';
import { HttpService } from '../../../../shared/services/http.service';

import { OperationResultStatus } from '../../../../shared/lib/enums/operation-result-status';

@Component({
  selector: 'app-import-wizard',
  templateUrl: './import-wizard.component.html',
  styleUrls: ['./import-wizard.component.scss'],
})
export class ImportWizardComponent implements OnInit {
  @Input() complex: boolean;
  @Output() back = new EventEmitter();
  @Output() exit = new EventEmitter();
  mapForm: FormViewModel[];
  requireMapMembers: boolean;
  actionWaiting: boolean;
  uploading: boolean;
  uploadingProgress: number;
  private trelloImportFile: File;

  constructor(
    readonly cultureService: CultureService,
    private readonly httpService: HttpService,
    private readonly formService: FormService,
    private readonly notificationService: NotificationService,
  ) {}

  ngOnInit() {}
  onBack($event: MouseEvent) {
    $event.stopPropagation();
    $event.preventDefault();
    if (this.requireMapMembers) {
      this.requireMapMembers = false;
      return;
    }
    this.back.emit();
  }
  async onCancel($event: MouseEvent) {
    $event.stopPropagation();
    $event.preventDefault();
    this.exit.emit();
  }

  importFromTrello(target: any) {
    if (!target.files || !target.files.length) {
      return;
    }
    const trelloFile = target.files[0];
    this.trelloImportFile = trelloFile;
    if (!trelloFile) {
      return;
    }
    const reader = new FileReader();
    reader.onerror = (event: any) => {
      this.notificationService.error('GENERAL_FAILED');
    };
    reader.onload = (event: any) => {
      const contents = event.target.result;
      const trelloJson = JSON.parse(contents);
      const membersList = trelloJson.members.map(member => {
        return {
          id: member.id,
          username: member.username,
        };
      });
      if (membersList.length) {
        this.requireMapMembers = true;
        this.mapForm = [
          {
            elements: [
              this.formService.createLabel({
                config: { field: '', label: 'IMPORT_USERNAME' },
                params: { label: 'IMPORT_USER_MAPPED_EMAIL' },
              }),
              ...membersList.map(user => {
                return this.formService.createInput({
                  config: { field: user.id, label: user.username },
                  params: { model: '', ltr: true },
                  validation: {
                    required: {
                      value: true,
                      message: 'EMAIL_OR_PHONE_REQUIRED',
                    },
                    minLength: {
                      value: 10,
                      message: 'EMAIL_OR_PHONE_MIN_LENGTH',
                    },
                    maxLength: {
                      value: 50,
                      message: 'EMAIL_OR_PHONE_MAX_LENGTH',
                    },
                  },
                });
              }),
            ],
          },
        ];
      }
    };
    reader.readAsText(trelloFile);
  }
  async importTrelloMapped($event: MouseEvent) {
    const model = this.formService.prepare(this.mapForm);
    if (!model) {
      return;
    }

    let failed = false;
    for (const i of Object.keys(model)) {
      if (
        !ValidationService.isEmail(model[i]) &&
        !ValidationService.isMobile(model[i])
      ) {
        this.formService.setErrors(this.mapForm, i, [
          model[i].indexOf('@') !== -1 ? 'EMAIL_INVALID' : 'PHONE_INVALID',
        ]);
        failed = true;
      }
    }

    if (failed) {
      return;
    }

    // this.requireMapMembers = false;
    this.uploading = true;
    const op = await this.httpService.formUpload(
      '/import/trello',
      { mapData: model, ___FILE: this.trelloImportFile },
      percent => {
        this.uploadingProgress = percent;
      },
    );
    if (op.status !== OperationResultStatus.Success) {
      // TODO: handle error
      this.uploading = false;
      return;
    }
    this.uploadingProgress = 0;
    this.uploading = false;
    this.exit.emit();
  }
  async importFromTaskulu(target: any) {
    if (!target.files || !target.files.length) {
      return;
    }
    this.uploading = true;
    const op = await this.httpService.formUpload(
      '/import/taskulu',
      { ___FILE: target.files[0] },
      percent => {
        this.uploadingProgress = percent;
      },
    );
    if (op.status !== OperationResultStatus.Success) {
      // TODO: handle error
      return;
    }
    this.uploadingProgress = 0;
    this.uploading = false;
    this.exit.emit();
  }
  importFromTaskWorld() {}
  importFromMonday() {}
}
