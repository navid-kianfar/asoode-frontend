import { Component, OnInit } from '@angular/core';
import { ProjectViewModel } from '../../../view-models/projects/project-types';
import { ProjectService } from '../../../services/projects/project.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AccessType } from '../../../library/app/enums';
import { PromptComponent } from '../../../modals/prompt/prompt.component';
import { ModalService } from '../../../services/core/modal.service';
import { OperationResultStatus } from '../../../library/core/enums';
import { PromptModalParameters } from '../../../view-models/core/modal-types';
import { FormService } from '../../../services/core/form.service';
import { NotificationService } from '../../../services/core/notification.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
})
export class ProjectComponent implements OnInit {
  ViewMode = ViewMode;
  mode: ViewMode;
  project: ProjectViewModel;
  permission: AccessType;
  AccessType = AccessType;
  report: any;
  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly projectService: ProjectService,
    private readonly modalService: ModalService,
    private readonly formService: FormService,
    private readonly notificationService: NotificationService,
  ) {}

  ngOnInit() {
    this.mode = ViewMode.Tree;
    this.report = {
      percent: 0,
      progress: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      total: 0,
    };
    const id = this.activatedRoute.snapshot.params.id;
    this.project = this.projectService.projects.find(g => g.id === id);
    if (!this.project) {
      this.router.navigateByUrl('dashboard');
      return;
    }
    this.permission = this.projectService.getPermission(this.project);
  }

  prepareEdit() {
    this.modalService
      .show(PromptComponent, {
        icon: 'icon-tree7',
        title: 'EDIT_PROJECT',
        form: [
          {
            elements: [
              this.formService.createInput({
                config: { field: 'title' },
                params: { model: this.project.title, placeHolder: 'TITLE' },
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
                  model: this.project.description,
                  textArea: true,
                  placeHolder: 'DESCRIPTION',
                },
              }),
              this.formService.createDropDown({
                config: { field: 'template', label: 'TEMPLATE' },
                params: {
                  model: this.project.template,
                  items: [],
                  enum: 'ProjectTemplate'
                },
              }),
            ],
          },
        ],
        action: async (params, form) => {
          const op = await this.projectService.edit(this.project.id, params);
          if (op.status !== OperationResultStatus.Success) {
            // TODO: handle error
            return;
          }
          this.notificationService.success('PROJECT_EDITED');
        },
        actionLabel: 'SAVE_CHANGES',
        actionColor: 'primary',
      } as PromptModalParameters)
      .subscribe(() => {});
  }
}
export enum ViewMode {
  RoadMap = 1,
  Tree = 2,
  Seasons = 3,
  Objectives = 4,
  Settings = 5,
}
