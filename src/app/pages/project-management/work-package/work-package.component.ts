import {Component, OnInit} from '@angular/core';
import {
  ProjectViewModel,
  WorkPackageMemberViewModel,
  WorkPackageObjectiveViewModel,
  WorkPackageTaskViewModel,
  WorkPackageViewModel,
} from '../../../view-models/projects/project-types';
import {ProjectService} from '../../../services/projects/project.service';
import {ActivatedRoute, Router} from '@angular/router';
import {WorkPackageService} from '../../../services/projects/work-package.service';
import {OperationResultStatus} from '../../../library/core/enums';
import {MemberInfoViewModel} from '../../../view-models/auth/identity-types';
import {PopperContent} from 'ngx-popper';
import {InviteModalComponent} from '../../../modals/invite-modal/invite-modal.component';
import {ModalService} from '../../../services/core/modal.service';
import {CultureService} from '../../../services/core/culture.service';
import {
  AccessType,
  ActivityType,
  ReceiveNotificationType,
  WorkPackageObjectiveType,
  WorkPackageTaskVisibility,
} from '../../../library/app/enums';
import {PromptComponent} from 'src/app/modals/prompt/prompt.component';
import {FormService} from 'src/app/services/core/form.service';
import {StringHelpers} from '../../../helpers/string.helpers';
import {TranslateService} from '../../../services/core/translate.service';
import {OperationResult} from '../../../library/core/operation-result';
import {GroupService} from '../../../services/groups/group.service';
import {PendingInvitationViewModel} from '../../../view-models/groups/group-types';
import {Socket} from 'ngx-socket-io';
import {moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

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
    mine: boolean;
    archived: boolean;
    active: boolean;
  };
  currentMember: WorkPackageMemberViewModel;
  toggleSetting: boolean;
  permission: AccessType;
  AccessType = AccessType;
  ReceiveNotificationType = ReceiveNotificationType;
  WorkPackageTaskVisibility = WorkPackageTaskVisibility;
  leaving: boolean;
  archiving: boolean;
  settingNotificationWaiting: boolean;
  settingShowTotalWaiting: boolean;
  settingVisibilityWaiting: boolean;

  constructor(
    readonly cultureService: CultureService,
    private readonly socket: Socket,
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
    this.toggleSetting = false;
    this.filters = {
      mine: false,
      archived: false,
      active: false,
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
    // if (this.workPackage.progress === undefined) {
    //   this.workPackage.progress = 0;
    // }
    this.permission = this.projectService.getWorkPackagePermission(
      this.project,
      this.workPackage,
    );
    this.fetch();
    this.bind();
  }

  bind() {
    this.socket.on('push-notification', (notification: any) => {
      let find1 = null;
      let find2 = null;
      switch (notification.type) {
        case ActivityType.WorkPackageListAdd:
          if (this.workPackage.id === notification.data.packageId) {
            this.workPackage.lists.push(notification.data);
          }
          break;
        case ActivityType.WorkPackageListEdit:
          if (this.workPackage.id === notification.data.packageId) {
            const found = this.workPackage.lists.find(
              l => l.id === notification.data.id,
            );
            if (found) {
              Object.assign(found, notification.data);
            }
          }
          break;
        case ActivityType.WorkPackageListOrder:
          if (this.workPackage.id === notification.data.packageId) {
            const found = this.workPackage.lists.find(
              l => l.id === notification.data.id,
            );
            if (!found || found.order === notification.data.order) {
              return;
            }
            moveItemInArray(
              this.workPackage.lists,
              found.order - 1,
              notification.data.order - 1,
            );
            let index = 1;
            this.workPackage.lists.forEach(l => {
              l.order = index++;
            });
          }
          break;
        case ActivityType.WorkPackageListPermission:
          break;
        case ActivityType.WorkPackageListSetting:
          break;
        case ActivityType.WorkPackageListSort:
          break;
        case ActivityType.WorkPackageListRemove:
        case ActivityType.WorkPackageListArchive:
          break;

        case ActivityType.WorkPackageMemberAdd:
          if (this.workPackage.id === notification.data.id) {
            this.workPackage.members = [
              ...this.workPackage.members,
              ...(notification.data.members || []),
            ];
            this.workPackage.pending = [
              ...this.workPackage.pending,
              ...(notification.data.pending || []),
            ];
          }
          break;
        case ActivityType.WorkPackageMemberPermission:
          if (notification.data.packageId) {
            if (notification.data.packageId !== this.workPackage.id) {
              return;
            }
            find2 = this.workPackage.members.find(
              m => m.id === notification.data.id,
            );
            if (find2) {
              find2.access = notification.data.access;
              return;
            }
          }
          if (notification.data.recordId !== this.workPackage.id) {
            return;
          }
          find2 = this.workPackage.pending.find(
            m => m.id === notification.data.id,
          );
          if (find2) {
            find2.access = notification.data.access;
            return;
          }
          break;
        case ActivityType.WorkPackageMemberRemove:
          if (notification.data.packageId) {
            if (notification.data.packageId !== this.workPackage.id) {
              return;
            }
            this.workPackage.members = this.workPackage.members.filter(
              m => m.id !== notification.data.id,
            );
            return;
          }
          if (notification.data.recordId !== this.workPackage.id) {
            return;
          }
          this.workPackage.pending = this.workPackage.pending.filter(
            m => m.id !== notification.data.id,
          );
          break;

        case ActivityType.WorkPackageObjectiveAdd:
          break;
        case ActivityType.WorkPackageObjectiveEdit:
          break;
        case ActivityType.WorkPackageObjectiveRemove:
          break;

        case ActivityType.WorkPackageTaskAdd:
          if (
            this.workPackage.id === notification.data.packageId &&
            !notification.data.parentId
          ) {
            const found = this.workPackage.lists.find(
              l => l.id === notification.data.listId,
            );
            if (found) {
              found.tasks = found.tasks || [];
              found.tasks.unshift(notification.data);
            }
          }
          break;
        case ActivityType.WorkPackageTaskEdit:
          if (this.workPackage.id === notification.data.packageId) {
            const task = this.findTask(notification.data.id);
            if (task) {
              delete notification.data.members;
              delete notification.data.labels;
              Object.assign(task, notification.data);
              task.hasDescription =
                task.description && task.description.length > 0;
            }
          }
          break;
        case ActivityType.WorkPackageTaskComment:
          if (this.workPackage.id === notification.data.packageId) {
            const task = this.findTask(notification.data.taskId);
            if (task) {
              task.commentCount++;
            }
          }
          break;
        case ActivityType.WorkPackageTaskMove:
          if (this.workPackage.id === notification.data.packageId) {
            const found = this.findTask(notification.data.id);
            if (!found || found.listId === notification.data.listId) {
              return;
            }
            const list = this.workPackage.lists.find(
              l => l.id === found.listId,
            );
            const destination = this.workPackage.lists.find(
              l => l.id === notification.data.listId,
            );
            transferArrayItem(
              list.tasks,
              destination.tasks,
              list.tasks.indexOf(found),
              notification.data.order - 1,
            );
          }
          break;
        case ActivityType.WorkPackageTaskReposition:
          if (this.workPackage.id === notification.data.packageId) {
            const found = this.findTask(notification.data.id);
            if (!found || found.order === notification.data.order) {
              return;
            }
            const list = this.workPackage.lists.find(
              l => l.id === found.listId,
            );
            moveItemInArray(
              list.tasks,
              list.tasks.indexOf(found),
              notification.data.order - 1,
            );
          }
          break;
        case ActivityType.WorkPackageTaskLabelAdd:
          if (this.workPackage.id === notification.data.packageId) {
            const task = this.findTask(notification.data.taskId);
            if (task) {
              const already = task.labels.find(
                l => l.labelId === notification.data.labelId,
              );
              if (!already) {
                task.labels.push(notification.data);
              }
            }
          }
          break;
        case ActivityType.WorkPackageTaskLabelRemove:
          {
            const task = this.findTask(notification.data.taskId);
            if (task) {
              task.members = task.members.filter(
                m => m.recordId !== notification.data.recordId,
              );
            }
          }
          break;
        case ActivityType.WorkPackageTaskMemberAdd:
          {
            const task = this.findTask(notification.data.taskId);
            if (!task) {
              return;
            }
            const already = task.members.find(
              i => i.recordId === notification.data.recordId,
            );
            if (!already) {
              task.members.push(notification.data);
            }
          }
          break;
        case ActivityType.WorkPackageTaskMemberRemove:
          {
            const task = this.findTask(notification.data.taskId);
            if (!task) {
              return;
            }
            task.members = task.members.filter(
              i => i.recordId !== notification.data.recordId,
            );
          }
          break;
        case ActivityType.WorkPackageTaskRemove:
        case ActivityType.WorkPackageTaskArchive:
          break;

        case ActivityType.WorkPackageLabelAdd:
          if (this.workPackage.id === notification.data.packageId) {
            this.workPackage.labels.push(notification.data);
          }
          break;
        case ActivityType.WorkPackageLabelRename:
          if (this.workPackage.id === notification.data.packageId) {
            find1 = this.workPackage.labels.find(
              l => l.id === notification.data.id,
            );
            if (find1) {
              find1.title = notification.data.title;
            }
          }
          break;
        case ActivityType.WorkPackageLabelRemove:
          if (this.workPackage.id === notification.data.packageId) {
            this.workPackage.labels = this.workPackage.labels.filter(
              l => l.id !== notification.data.id,
            );
          }
          break;
      }
    });
  }

  findTask(id: string): WorkPackageTaskViewModel {
    for (const list of this.workPackage.lists) {
      for (const task of list.tasks) {
        if (task.id === id) {
          return task;
        }
      }
    }
  }

  async fetch() {
    this.waiting = true;
    const op = await this.workPackageService.fetch(
      this.workPackage.id,
      this.filters,
    );
    if (op.status !== OperationResultStatus.Success) {
      this.router.navigateByUrl('dashboard');
      return;
    }
    this.workPackage = this.mapData(op.data);
    this.waiting = false;
  }

  mapData(model: WorkPackageViewModel): WorkPackageViewModel {
    model.lists.forEach(list => {
      list.tasks = model.tasks
        .filter(t => t.listId === list.id)
        .sort((a, b) => (a.order > b.order ? 1 : -1));
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
    if (this.waiting) {
      return;
    }
    this.modalService
      .show(InviteModalComponent, {
        noProject: true,
        existing: this.workPackage.members,
        exclude: [...(this.workPackage.pending || []).map(p => p.identifier)],
        handler: async access => {
          return this.workPackageService.addWorkPackageAccess(
            this.workPackage.id,
            access,
          );
        },
      })
      .subscribe(() => {});
  }

  removeAccess(
    member: WorkPackageMemberViewModel,
    permission: AccessType,
    pending: PendingInvitationViewModel = null,
  ) {
    {
      const heading = StringHelpers.format(
        this.translateService.fromKey('REMOVE_MEMBER_CONFIRM_HEADING'),
        [
          member.isGroup
            ? this.groupService.groups.find(g => g.id === member.recordId).title
            : pending
            ? pending.identifier
            : this.findMember(member.recordId).fullName,
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
                  chooseLabel: 'OBJECTIVE_TYPE',
                },
              }),
            ],
          },
        ],
        actionLabel: 'CREATE_OBJECTIVE',
        action: (model, form) =>
          this.workPackageService.createObjective(this.workPackage.id, model),
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
                  chooseLabel: 'OBJECTIVE_TYPE',
                },
              }),
            ],
          },
        ],
        actionLabel: 'SAVE_CHANGES',
        action: (model, form) =>
          this.workPackageService.editObjective(obj.id, model),
        actionColor: 'primary',
        title: 'EDIT_OBJECTIVE',
      })
      .subscribe(() => {});
  }

  removeObjective(obj: WorkPackageObjectiveViewModel) {
    const heading = StringHelpers.format(
      this.translateService.fromKey('REMOVE_OBJECTIVE_CONFIRM_HEADING'),
      [obj.title],
    );

    this.modalService
      .confirm({
        title: 'REMOVE_OBJECTIVE',
        message: 'REMOVE_OBJECTIVE_CONFIRM',
        heading,
        actionLabel: 'REMOVE_OBJECTIVE',
        cancelLabel: 'CANCEL',
        action: async () => {
          return await this.workPackageService.deleteObjective(obj.id);
        },
      })
      .subscribe(confirmed => {});
  }

  async changePermission(
    member: WorkPackageMemberViewModel,
    access: AccessType,
  ) {
    member.access = access;
    member.waiting = true;
    const op = await this.workPackageService.changeAccess(member.id, {
      access,
    });
    member.waiting = false;
    if (op.status !== OperationResultStatus.Success) {
      // TODO: handle error
      return;
    }
  }

  async changePendingPermission(
    member: PendingInvitationViewModel,
    access: AccessType,
  ) {
    member.access = access;
    member.waiting = true;
    const op = await this.workPackageService.changePendingAccess(member.id, {
      access,
    });
    member.waiting = false;
    if (op.status !== OperationResultStatus.Success) {
      // TODO: handle error
      return;
    }
  }

  async removePendingAccess(
    member: PendingInvitationViewModel,
    permission: AccessType,
  ) {
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

  settingMenuToggle() {
    if (this.waiting) {
      return;
    }
    this.toggleSetting = !this.toggleSetting;
  }

  switchMode(mode: ViewMode) {
    // this.mode = mode;
  }

  async leave() {
    const heading = StringHelpers.format(
      this.translateService.fromKey(
        this.project.complex ?
          'LEAVE_WORK_PACKAGE_CONFIRM_HEADING' :
          'LEAVE_PROJECT_CONFIRM_HEADING'
      ),
      [this.workPackage.title],
    );

    this.modalService
      .confirm({
        title: this.project.complex ?
          'LEAVE_WORK_PACKAGE' :
          'LEAVE_PROJECT',
        message: this.project.complex ?
          'LEAVE_WORK_PACKAGE_CONFIRM' :
          'LEAVE_PROJECT_CONFIRM',
        heading,
        actionLabel: 'LEAVE',
        cancelLabel: 'CANCEL',
        action: async () => {
          this.leaving = true;
          const op = await this.workPackageService.leave(this.workPackage.id);
          this.leaving = false;
          if (op.status !== OperationResultStatus.Success) {
            // TODO: handle error
            return;
          }
          return await this.router.navigateByUrl('/dashboard');
        },
      }).subscribe(() => {});
  }

  async archive() {
    const heading = StringHelpers.format(
      this.translateService.fromKey(
        this.project.complex ?
          'ARCHIVE_WORK_PACKAGE_CONFIRM_HEADING' :
          'ARCHIVE_PROJECT_CONFIRM_HEADING'
      ),
      [this.workPackage.title],
    );

    this.modalService
      .confirm({
        title: this.project.complex ?
          'ARCHIVE_WORK_PACKAGE' :
          'ARCHIVE_PROJECT',
        message: this.project.complex ?
          'ARCHIVE_WORK_PACKAGE_CONFIRM' :
          'ARCHIVE_PROJECT_DESCRIPTION',
        heading,
        actionLabel: 'ARCHIVE',
        cancelLabel: 'CANCEL',
        action: async () => {
          this.archiving = true;
          const op = await this.workPackageService.archive(this.workPackage.id);
          this.archiving = false;
          if (op.status !== OperationResultStatus.Success) {
            // TODO: handle error
            return;
          }
          return await this.router.navigateByUrl('/dashboard');
        },
      }).subscribe(() => {});
  }

  async updateSettingNotification(notificationType: ReceiveNotificationType) {
    this.workPackage.userSetting.receiveNotification = notificationType;
    this.settingNotificationWaiting = true;
    const op = await this.workPackageService.updateUserSetting(this.workPackage.id, {notificationType});
    this.settingNotificationWaiting = false;
    if (op.status !== OperationResultStatus.Success) {
      // TODO: handle error
      return;
    }
  }

  async updateSettingShowTotal(showTotal: boolean) {
    this.workPackage.userSetting.showTotalCards = showTotal;
    this.settingShowTotalWaiting = true;
    const op = await this.workPackageService.updateUserSetting(this.workPackage.id, {showTotal});
    this.settingShowTotalWaiting = false;
    if (op.status !== OperationResultStatus.Success) {
      // TODO: handle error
      return;
    }
  }

  async updateSettingVisibility(visibility: WorkPackageTaskVisibility) {
    this.workPackage.taskVisibility = visibility;
    this.settingVisibilityWaiting = true;
    const op = await this.workPackageService.updateSetting(this.workPackage.id, {visibility});
    this.settingVisibilityWaiting = false;
    if (op.status !== OperationResultStatus.Success) {
      // TODO: handle error
      return;
    }
  }
}

export enum ViewMode {
  Board = 1,
  List = 2,
  TimeSpan = 3,
  Calendar = 4,
}
