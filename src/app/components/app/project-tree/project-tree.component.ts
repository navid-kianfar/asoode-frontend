import { Component, Input, OnInit } from '@angular/core';
import {
  ProjectViewModel,
  SubProjectViewModel,
  WorkPackageViewModel,
} from '../../../view-models/projects/project-types';
import { AccessType } from '../../../library/app/enums';
import { ProjectService } from '../../../services/projects/project.service';
import { ModalService } from '../../../services/core/modal.service';
import { FormService } from '../../../services/core/form.service';
import { PromptComponent } from '../../../modals/prompt/prompt.component';
import { PromptModalParameters } from '../../../view-models/core/modal-types';
import { WorkPackageWizardComponent } from '../../../modals/work-package-wizard/work-package-wizard.component';
import { OperationResultStatus } from '../../../library/core/enums';
import { NotificationService } from '../../../services/core/notification.service';

@Component({
  selector: 'app-project-tree',
  templateUrl: './project-tree.component.html',
  styleUrls: ['./project-tree.component.scss'],
})
export class ProjectTreeComponent implements OnInit {
  @Input() model: ProjectViewModel;
  @Input() permission: AccessType;
  subProjects: SubProjectViewModel[];
  workPackages: WorkPackageViewModel[];
  constructor(
    private readonly projectService: ProjectService,
    private readonly modalService: ModalService,
    private readonly formService: FormService,
    private readonly notificationService: NotificationService,
  ) {}

  ngOnInit() {
    this.workPackages = this.model.workPackages.filter(w => !w.subProjectId);
    this.subProjects = this.model.subProjects.filter(s => !s.parentId);
  }

  newSubProject(parentId?: string) {
    this.modalService
      .show(PromptComponent, {
        icon: 'icon-sub-season',
        title: 'NEW_SUB_PROJECT',
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
          if (parentId) {
            params.parentId = parentId;
          }
          const op = await this.projectService.createSubProject(
            this.model.id,
            params,
          );
          if (op.status !== OperationResultStatus.Success) {
            // TODO: handle error
            return;
          }
          this.notificationService.success('WORK_PACKAGE_CREATED');
        },
        actionLabel: 'CREATE',
        actionColor: 'primary',
      } as PromptModalParameters)
      .subscribe(() => {});
  }

  newWorkPackage(parentId?: string) {
    this.modalService
      .show(WorkPackageWizardComponent, {
        projectId: this.model.id,
        parentId,
      })
      .subscribe(() => {});
  }
}
