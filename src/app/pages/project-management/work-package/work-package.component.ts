import { Component, OnInit } from '@angular/core';
import {
  ProjectViewModel, WorkPackageMemberViewModel, WorkPackageObjectiveViewModel,
  WorkPackageViewModel,
} from '../../../view-models/projects/project-types';
import { ProjectService } from '../../../services/projects/project.service';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkPackageService } from '../../../services/projects/work-package.service';
import { OperationResultStatus } from '../../../library/core/enums';
import {MemberInfoViewModel} from '../../../view-models/auth/identity-types';
import {PopperContent} from 'ngx-popper';
import {InviteModalComponent} from '../../../modals/invite-modal/invite-modal.component';
import {ModalService} from '../../../services/core/modal.service';
import {CultureService} from '../../../services/core/culture.service';
import {AccessType, WorkPackageObjectiveType} from '../../../library/app/enums';
import { PromptComponent } from 'src/app/modals/prompt/prompt.component';
import { FormService } from 'src/app/services/core/form.service';
import {StringHelpers} from '../../../helpers/string.helpers';
import {TranslateService} from '../../../services/core/translate.service';
import {OperationResult} from '../../../library/core/operation-result';
import {GroupService} from '../../../services/groups/group.service';
import {PendingInvitationViewModel} from '../../../view-models/groups/group-types';

@Component({
  selector: 'app-work-package',
  templateUrl: './work-package.component.html',
  styleUrls: ['./work-package.component.scss'],
})
export class WorkPackageComponent implements OnInit {
  ViewMode = ViewMode;
  mode: ViewMode;
  project: ProjectViewModel;
  workPackage: WorkPackageViewModel;
  waiting: boolean;
  filters: {
    mine: boolean,
    archived: boolean,
    active: boolean
  };
  currentMember: WorkPackageMemberViewModel;
  toggleSetting: boolean;
  receiveNotification: number;
  permission: AccessType;
  AccessType = AccessType;
  constructor(
    readonly cultureService: CultureService,
    private readonly modalService: ModalService,
    private readonly formService: FormService,
    private readonly groupService: GroupService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly translateService: TranslateService,
    private readonly projectService: ProjectService,
    private readonly workPackageService: WorkPackageService,
  ) {}

  ngOnInit() {
    this.receiveNotification = 1;
    this.toggleSetting = false;
    this.filters = {
      mine: false,
      archived: false,
      active: true
    };
    this.mode = ViewMode.Board;
    const id = this.activatedRoute.snapshot.params.id;
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.projectService.projects.length; i++) {
      this.workPackage = this.projectService.projects[i].workPackages.find(
        w => w.id === id,
      );
      if (this.workPackage) {
        this.project = this.projectService.projects[i];
        break;
      }
    }
    if (!this.workPackage) {
      this.router.navigateByUrl('dashboard');
      return;
    }
    if (this.workPackage.progress === undefined) {
      this.workPackage.progress = 0;
    }
    this.permission = this.projectService.getWorkPackagePermission(this.project, this.workPackage);
    this.fetch();
  }

  async fetch() {
    this.waiting = true;
    const op = await this.workPackageService.fetch(this.workPackage.id, this.filters);
    if (op.status !== OperationResultStatus.Success) {
      this.router.navigateByUrl('dashboard');
      return;
    }
    this.workPackage = this.mapData(op.data);
    this.waiting = false;
  }

  mapData(model: WorkPackageViewModel): WorkPackageViewModel {
    model.lists.forEach(list => {
      list.tasks = model.tasks.filter(t => t.listId === list.id)
        .sort((a, b) => (a.order > b.order) ? 1 : -1);
    });
    return model;
  }

  findMember(recordId: string): MemberInfoViewModel {
    const access = this.project.members.find(m => m.recordId === recordId);
    return access.member;
  }

  showMemberInfo(member: WorkPackageMemberViewModel, popper: PopperContent) {
    this.currentMember = member;
  }

  prepareInvite() {
    this.modalService.show(InviteModalComponent, {
      noProject: true,
      existing: this.workPackage.members,
      exclude: [
        ...(this.workPackage.pending || []).map(p => p.identifier)
      ],
      handler: async access => {
        return this.workPackageService.addWorkPackageAccess(this.workPackage.id, access);
      },
    }).subscribe(() => {});
  }

  removeAccess(member: WorkPackageMemberViewModel, permission: AccessType, pending: PendingInvitationViewModel = null) {
    {
      const heading = StringHelpers.format(
        this.translateService.fromKey('REMOVE_MEMBER_CONFIRM_HEADING'),
        [
          member.isGroup
            ? this.groupService.groups.find(g => g.id === member.recordId).title
            : (pending ? pending.identifier : this.findMember(member.recordId).fullName)
        ],
      );
      this.modalService
        .confirm({
          title: 'REMOVE_ACCESS',
          message: 'REMOVE_MEMBER_CONFIRM',
          heading,
          actionLabel: 'REMOVE_ACCESS',
          cancelLabel: 'CANCEL',
          action: async () => OperationResult.Success(true),
        })
        .subscribe(async confirmed => {
          if (!confirmed) {
            return;
          }
          member.waiting = true;
          const op = await this.workPackageService.removeAccess(member.id);
          member.waiting = false;
          if (op.status !== OperationResultStatus.Success) {
            // TODO: handle error
            return;
          }
        });
    }
  }

  addObjective() {
    this.modalService
      .show(PromptComponent, {
        form: [
          {
            elements: [
              this.formService.createInput({
                config: { field: 'title' },
                params: {
                  model: '',
                  placeHolder: 'TITLE',
                },
                validation: {
                  required: { value: true, message: 'TITLE_REQUIRED' },
                },
              }),
              this.formService.createInput({
                config: { field: 'description' },
                params: {
                  model: '',
                  placeHolder: 'DESCRIPTION',
                },
              }),
              this.formService.createDropDown({
                config: { field: 'type' },
                params: {
                  items: [],
                  model: WorkPackageObjectiveType.MustHave,
                  enum: 'WorkPackageObjectiveType',
                  chooseLabel: 'OBJECTIVE_TYPE'
                }
              })
            ],
          },
        ],
        actionLabel: 'CREATE_OBJECTIVE',
        action: (model, form) => this.workPackageService.createObjective(this.workPackage.id, model),
        actionColor: 'primary',
        title: 'CREATE_OBJECTIVE',
      })
      .subscribe(() => {});
  }

  editObjective(obj: WorkPackageObjectiveViewModel) {
    this.modalService
      .show(PromptComponent, {
        form: [
          {
            elements: [
              this.formService.createInput({
                config: { field: 'title' },
                params: {
                  model: obj.title,
                  placeHolder: 'TITLE',
                },
                validation: {
                  required: { value: true, message: 'TITLE_REQUIRED' },
                },
              }),
              this.formService.createInput({
                config: { field: 'description' },
                params: {
                  model: obj.description,
                  placeHolder: 'DESCRIPTION',
                },
              }),
              this.formService.createDropDown({
                config: { field: 'type' },
                params: {
                  items: [],
                  model: obj.type,
                  enum: 'WorkPackageObjectiveType',
                  chooseLabel: 'OBJECTIVE_TYPE'
                }
              })
            ],
          },
        ],
        actionLabel: 'SAVE_CHANGES',
        action: (model, form) => this.workPackageService.editObjective(obj.id, model),
        actionColor: 'primary',
        title: 'EDIT_OBJECTIVE',
      })
      .subscribe(() => {});
  }

  removeObjective(obj: WorkPackageObjectiveViewModel) {
    const heading = StringHelpers.format(
      this.translateService.fromKey('REMOVE_OBJECTIVE_CONFIRM_HEADING'),
      [obj.title]
    );

    this.modalService.confirm({
      title: 'REMOVE_OBJECTIVE',
      message: 'REMOVE_OBJECTIVE_CONFIRM',
      heading,
      actionLabel: 'REMOVE_OBJECTIVE',
      cancelLabel: 'CANCEL',
      action: async () => {
        return await this.workPackageService.deleteObjective(obj.id);
      },
    }).subscribe((confirmed) => { });
  }

  async changePermission(member: WorkPackageMemberViewModel, access: AccessType) {
    member.access = access;
    member.waiting = true;
    const op = await this.workPackageService.changeAccess(member.id, { access });
    member.waiting = false;
    if (op.status !== OperationResultStatus.Success) {
      // TODO: handle error
      return;
    }
  }

  async changePendingPermission(member: PendingInvitationViewModel, access: AccessType) {
    member.access = access;
    member.waiting = true;
    const op = await this.workPackageService.changePendingAccess(member.id, { access });
    member.waiting = false;
    if (op.status !== OperationResultStatus.Success) {
      // TODO: handle error
      return;
    }
  }

  async removePendingAccess(member: PendingInvitationViewModel, permission: AccessType) {
    const heading = StringHelpers.format(
      this.translateService.fromKey('REMOVE_MEMBER_CONFIRM_HEADING'),
      [member.identifier],
    );
    this.modalService
      .confirm({
        title: 'REMOVE_ACCESS',
        message: 'REMOVE_MEMBER_CONFIRM',
        heading,
        actionLabel: 'REMOVE_ACCESS',
        cancelLabel: 'CANCEL',
        action: async () => OperationResult.Success(true),
      })
      .subscribe(async confirmed => {
        if (!confirmed) {
          return;
        }
        member.deleting = true;
        const op = await this.workPackageService.removePendingAccess(member.id);
        member.deleting = false;
        if (op.status !== OperationResultStatus.Success) {
          // TODO: handle error
          return;
        }
      });
  }
}
export enum ViewMode {
  Board = 1,
  List = 2,
  TimeSpan = 3,
  Calendar = 4,
}
