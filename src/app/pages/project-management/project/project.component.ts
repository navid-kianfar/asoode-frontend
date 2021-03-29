import { Component, OnInit } from '@angular/core';
import { ProjectViewModel } from '../../../view-models/projects/project-types';
import { ProjectService } from '../../../services/projects/project.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AccessType,
  ActivityType,
  ProjectTemplate,
} from '../../../library/app/enums';
import { PromptComponent } from '../../../modals/prompt/prompt.component';
import { ModalService } from '../../../services/core/modal.service';
import { OperationResultStatus } from '../../../library/core/enums';
import { PromptModalParameters } from '../../../view-models/core/modal-types';
import { FormService } from '../../../services/core/form.service';
import { NotificationService } from '../../../services/core/notification.service';
import { Socket } from 'ngx-socket-io';
import { IdentityService } from '../../../services/auth/identity.service';
import { GoogleAnalyticsService } from 'ngx-google-analytics';
import { TranslateService } from '../../../services/core/translate.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
})
export class ProjectComponent implements OnInit {
  ViewMode = ViewMode;
  ProjectTemplate = ProjectTemplate;
  mode: ViewMode;
  project: ProjectViewModel;
  permission: AccessType;
  AccessType = AccessType;
  report: any;
  waiting: boolean;
  progressWaiting: boolean;
  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly projectService: ProjectService,
    private readonly identityService: IdentityService,
    private readonly modalService: ModalService,
    private readonly formService: FormService,
    private readonly socket: Socket,
    private readonly notificationService: NotificationService,
    private readonly gaService: GoogleAnalyticsService,
    private readonly translateService: TranslateService,
  ) {}

  ngOnInit() {
    this.mode = ViewMode.Tree;
    this.report = {
      done: {
        total: 0,
        percent: 0,
        progress: [],
      },
      created: {
        total: 0,
        percent: 0,
        progress: [],
      },
      blocked: {
        total: 0,
        percent: 0,
        progress: [],
      },
    };
    this.fetch();
    this.bind();
  }

  async fetch() {
    const id = this.activatedRoute.snapshot.params.id;
    this.project = this.projectService.projects.find(g => g.id === id);
    if (!this.project) {
      this.waiting = true;
      const op = await this.projectService.fetchArchived(id);
      this.waiting = false;
      if (op.status !== OperationResultStatus.Success) {
        this.router.navigateByUrl('dashboard');
        return;
      }
      this.project = op.data;
    }

    this.gaService.pageView(
      window.location.pathname,
      this.translateService.fromKey('PROJECT'),
      undefined,
      { user_id: this.identityService.identity.userId },
    );
    this.permission = this.projectService.getPermission(this.project);
    this.progressWaiting = true;
    const progress = await this.projectService.progress(id);

    if (progress.data.length < 90) {
      for (let i = 0; i < 90 - progress.data.length; i++) {
        progress.data.push({
          blocked: 0,
          created: 0,
          date: '',
          done: 0
        });
      }
    }

    this.report.blocked.progress = progress.data.map(d => d.blocked);
    this.report.blocked.total = progress.data.reduce((prev, obj, current) => prev + obj.blocked, 0);
    this.report.done.progress = progress.data.map(d => d.done);
    this.report.done.total = progress.data.reduce((prev, obj, current) => prev + obj.done, 0);
    this.report.created.progress = progress.data.map(d => d.created);
    this.report.created.total = progress.data.reduce((prev, obj, current) => prev + obj.created, 0);
    console.log(this.report);
    this.progressWaiting = false;
  }

  bind() {
    this.socket.on('push-notification', (notification: any) => {
      switch (notification.type) {
        case ActivityType.ProjectArchive:
          if (this.project.id === notification.data.id) {
            return this.router.navigateByUrl('/dashboard');
          }
          break;
        case ActivityType.ProjectMemberRemove:
          if (
            this.project.id === notification.data.projectId &&
            this.identityService.identity.userId === notification.data.recordId
          ) {
            return this.router.navigateByUrl('/dashboard');
          }
          break;
      }
    });
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
                  enum: 'ProjectTemplate',
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
