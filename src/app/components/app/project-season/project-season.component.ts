import { Component, Input, OnInit } from '@angular/core';
import {
  ProjectSeasonViewModel,
  ProjectViewModel,
} from '../../../view-models/projects/project-types';
import { AccessType } from '../../../library/app/enums';
import { ProjectService } from '../../../services/projects/project.service';
import { ModalService } from '../../../services/core/modal.service';
import { FormService } from '../../../services/core/form.service';
import { NotificationService } from '../../../services/core/notification.service';
import { TranslateService } from '../../../services/core/translate.service';
import { PromptComponent } from '../../../modals/prompt/prompt.component';
import { OperationResultStatus } from '../../../library/core/enums';
import { PromptModalParameters } from '../../../view-models/core/modal-types';
import { StringHelpers } from '../../../helpers/string.helpers';

@Component({
  selector: 'app-project-season',
  templateUrl: './project-season.component.html',
  styleUrls: ['./project-season.component.scss'],
})
export class ProjectSeasonComponent implements OnInit {
  @Input() model: ProjectViewModel;
  @Input() permission: AccessType;
  selected: ProjectSeasonViewModel;
  AccessType = AccessType;
  constructor(
    private readonly projectService: ProjectService,
    private readonly modalService: ModalService,
    private readonly formService: FormService,
    private readonly notificationService: NotificationService,
    private readonly translateService: TranslateService,
  ) {}

  ngOnInit() {}

  prepareCreate() {
    this.modalService
      .show(PromptComponent, {
        icon: 'icon-flag7',
        title: 'NEW_SEASON',
        form: [
          {
            elements: [
              this.formService.createInput({
                config: { field: 'title' },
                params: { model: '', placeHolder: 'TITLE' },
                validation: {
                  required: {
                    value: true,
                    message: 'TITLE_REQUIRED',
                  },
                },
              }),
              this.formService.createInput({
                config: { field: 'description' },
                params: {
                  model: '',
                  textArea: true,
                  placeHolder: 'DESCRIPTION',
                },
              }),
            ],
          },
        ],
        action: async (params, form) => {
          const op = await this.projectService.createSeasonProject(
            this.model.id,
            params,
          );
          if (op.status !== OperationResultStatus.Success) {
            // TODO: handle error
            return;
          }
          this.notificationService.success('SEASON_CREATED');
        },
        actionLabel: 'CREATE',
        actionColor: 'primary',
      } as PromptModalParameters)
      .subscribe(() => {});
  }

  prepareDelete(season: ProjectSeasonViewModel) {
    const heading = StringHelpers.format(
      this.translateService.fromKey('REMOVE_SEASON_CONFIRM_HEADING'),
      [season.title],
    );
    this.modalService
      .confirm({
        title: 'REMOVE_SEASON',
        message: 'REMOVE_SEASON_CONFIRM',
        heading,
        actionLabel: 'REMOVE_SEASON',
        cancelLabel: 'CANCEL',
        action: async () => {
          return await this.projectService.removeSeason(season.id);
        },
      })
      .subscribe((confirmed) => {});
  }

  prepareEdit(season: ProjectSeasonViewModel) {
    this.modalService
      .show(PromptComponent, {
        icon: 'icon-flag7',
        title: 'EDIT_SEASON',
        form: [
          {
            elements: [
              this.formService.createInput({
                config: { field: 'title' },
                params: { model: season.title, placeHolder: 'TITLE' },
                validation: {
                  required: {
                    value: true,
                    message: 'TITLE_REQUIRED',
                  },
                },
              }),
              this.formService.createInput({
                config: { field: 'description' },
                params: {
                  model: season.description,
                  textArea: true,
                  placeHolder: 'DESCRIPTION',
                },
              }),
            ],
          },
        ],
        action: async (params, form) => {
          const op = await this.projectService.editSeason(season.id, params);
          if (op.status !== OperationResultStatus.Success) {
            // TODO: handle error
            return;
          }
          this.notificationService.success('SEASON_UPDATED');
        },
        actionLabel: 'SAVE_CHANGES',
        actionColor: 'primary',
      } as PromptModalParameters)
      .subscribe(() => {});
  }
}
