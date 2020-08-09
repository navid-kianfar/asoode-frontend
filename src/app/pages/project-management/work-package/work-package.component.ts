import { Component, OnInit } from '@angular/core';
import {
  ProjectViewModel,
  WorkPackageMemberViewModel,
  WorkPackageObjectiveViewModel,
  WorkPackageTaskViewModel,
  WorkPackageViewModel,
} from '../../../view-models/projects/project-types';
import { ProjectService } from '../../../services/projects/project.service';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkPackageService } from '../../../services/projects/work-package.service';
import { OperationResultStatus } from '../../../library/core/enums';
import { InviteModalComponent } from '../../../modals/invite-modal/invite-modal.component';
import { ModalService } from '../../../services/core/modal.service';
import { CultureService } from '../../../services/core/culture.service';
import {
  AccessType,
  ActivityType,
  ProjectTemplate,
  ReceiveNotificationType,
  SortType,
  WorkPackageObjectiveType,
  WorkPackageTaskState,
  WorkPackageTaskVisibility,
} from '../../../library/app/enums';
import { PromptComponent } from 'src/app/modals/prompt/prompt.component';
import { FormService } from 'src/app/services/core/form.service';
import { StringHelpers } from '../../../helpers/string.helpers';
import { TranslateService } from '../../../services/core/translate.service';
import { OperationResult } from '../../../library/core/operation-result';
import { GroupService } from '../../../services/groups/group.service';
import { PendingInvitationViewModel } from '../../../view-models/groups/group-types';
import { Socket } from 'ngx-socket-io';
import { moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { PromptModalParameters } from '../../../view-models/core/modal-types';
import { NotificationService } from '../../../services/core/notification.service';
import { UpgradeWorkPackageComponent } from '../../../modals/upgrade-work-package/upgrade-work-package.component';
import { IdentityService } from '../../../services/auth/identity.service';
import { WorkPackagePermissionComponent } from '../../../modals/work-package-permission/work-package-permission.component';
import { UsersService } from '../../../services/general/users.service';
import { CustomFieldsModalComponent } from '../../../modals/custom-fields-modal/custom-fields-modal.component';
import { LabelsModalComponent } from '../../../modals/labels-modal/labels-modal.component';
import { DateHelpers } from '../../../helpers/date.helpers';

@Component({
  selector: 'app-work-package',
  templateUrl: './work-package.component.html',
  styleUrls: ['./work-package.component.scss'],
})
export class WorkPackageComponent implements OnInit {
  ViewMode = ViewMode;
  ProjectTemplate = ProjectTemplate;
  mode: ViewMode;
  project: ProjectViewModel;
  workPackage: WorkPackageViewModel;
  waiting: boolean;
  filters: {
    labels: any;
    mine: boolean;
    archived: boolean;
    active: boolean;
  };
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
  updating: boolean;
  deleting: boolean;
  preWaiting: boolean;

  constructor(
    readonly identityService: IdentityService,
    readonly cultureService: CultureService,
    private readonly socket: Socket,
    private readonly usersService: UsersService,
    private readonly modalService: ModalService,
    private readonly formService: FormService,
    private readonly groupService: GroupService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly translateService: TranslateService,
    private readonly projectService: ProjectService,
    private readonly workPackageService: WorkPackageService,
    private readonly notificationService: NotificationService,
  ) {}

  ngOnInit() {
    this.settingNotificationWaiting = false;
    this.toggleSetting = false;
    this.filters = {
      mine: false,
      archived: false,
      active: false,
      labels: {},
    };
    this.mode = ViewMode.Board;
    this.preFetch();
    this.bind();
  }

  bind() {
    this.socket.on('push-notification', (notification: any) => {
      let find1 = null;
      let find2 = null;
      switch (notification.type) {
        case ActivityType.ProjectArchive:
          if (this.workPackage.projectId === notification.data.id) {
            return this.router.navigateByUrl('/dashboard');
          }
          break;
        case ActivityType.GroupRemove:
          this.workPackage.members = this.workPackage.members.filter(
            m => m.recordId !== notification.data,
          );
          break;
        case ActivityType.WorkPackageListAdd:
          if (this.workPackage.id === notification.data.packageId) {
            this.workPackage.lists.push(notification.data);
          }
          break;
        case ActivityType.WorkPackageListEdit:
          if (this.workPackage.id === notification.data.packageId) {
            find1 = this.workPackage.lists.find(
              l => l.id === notification.data.id,
            );
            if (find1) {
              Object.assign(find1, notification.data);
            }
            this.sortLists();
          }
          break;
        case ActivityType.WorkPackageListOrder:
          if (this.workPackage.id === notification.data.packageId) {
            find1 = this.workPackage.lists.find(
              l => l.id === notification.data.id,
            );
            if (!find1 || find1.order === notification.data.order) {
              return;
            }
            moveItemInArray(
              this.workPackage.lists,
              find1.order - 1,
              notification.data.order - 1,
            );
            this.sortLists();
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
          if (this.workPackage.id === notification.data.packageId) {
            this.workPackage.lists = this.workPackage.lists.filter(
              l => l.id !== notification.data.id,
            );
          }
          break;
        case ActivityType.WorkPackageListTasksArchive:
          const found = this.workPackage.lists.find(
            l => l.id === notification.data.id,
          );
          if (found) {
            found.tasks = [];
          }
          break;
        case ActivityType.WorkPackageListClone:
          this.ngOnInit();
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
          if (this.workPackage.id === notification.data.packageId) {
            this.workPackage.objectives.push(notification.data);
          }
          break;
        case ActivityType.WorkPackageObjectiveEdit:
          if (this.workPackage.id === notification.data.packageId) {
            find1 = this.workPackage.objectives.find(
              o => o.id === notification.data.id,
            );
            if (find1) {
              Object.assign(find1, notification.data);
            }
          }
          break;
        case ActivityType.WorkPackageObjectiveRemove:
          if (this.workPackage.id === notification.data.packageId) {
            this.workPackage.objectives = this.workPackage.objectives.filter(
              o => o.id !== notification.data.id,
            );
          }
          break;

        case ActivityType.WorkPackageTaskDone:
        case ActivityType.WorkPackageTaskBlocked:
        case ActivityType.WorkPackageTaskUnBlock:
        case ActivityType.WorkPackageTaskEdit:
          if (this.workPackage.id === notification.data.packageId) {
            if (notification.data.parentId) {
              const parent = this.findTask(notification.data.parentId);
              if (parent.state === WorkPackageTaskState.Done) {
                if (notification.data.state !== WorkPackageTaskState.Done) {
                  parent.subTasksDone--;
                }
              } else if (
                notification.data.state === WorkPackageTaskState.Done
              ) {
                parent.subTasksDone++;
              }
              return;
            }

            const task = this.findTask(notification.data.id);
            if (task) {
              const oldState = task.state;
              task.beginReminder = notification.data.beginReminder;
              task.endReminder = notification.data.endReminder;
              task.voteNecessity = notification.data.voteNecessity;
              task.objectiveValue = notification.data.objectiveValue;
              task.estimatedTime = notification.data.estimatedTime;
              task.coverId = notification.data.coverId;
              task.listId = notification.data.listId;
              task.state = notification.data.state;
              task.listName = notification.data.listName;
              task.timeSpent = notification.data.timeSpent;
              task.doneUserId = notification.data.doneUserId;
              task.archivedAt = notification.data.archivedAt;
              task.dueAt = notification.data.dueAt;
              task.beginAt = notification.data.beginAt;
              task.endAt = notification.data.endAt;
              task.doneAt = notification.data.doneAt;
              task.title = notification.data.title;
              task.description = notification.data.description;
              task.geoLocation = notification.data.geoLocation;
              task.hasDescription =
                task.description && task.description.length > 0;

              if (oldState !== notification.data.state) {
                switch (oldState) {
                  case WorkPackageTaskState.Done:
                    this.workPackage.progress.done--;
                    break;
                  case WorkPackageTaskState.Cancelled:
                  case WorkPackageTaskState.Duplicate:
                    this.workPackage.progress.canceledOrDuplicate--;
                    break;
                }

                switch (notification.data.state) {
                  case WorkPackageTaskState.Done:
                    this.workPackage.progress.done++;
                    break;
                  case WorkPackageTaskState.Cancelled:
                  case WorkPackageTaskState.Duplicate:
                    this.workPackage.progress.canceledOrDuplicate++;
                    break;
                }

                if (this.workPackage.progress.total === 0) {
                  this.workPackage.progress.percent = 0;
                } else {
                  this.workPackage.progress.percent =
                    ((this.workPackage.progress.done +
                      this.workPackage.progress.canceledOrDuplicate) *
                      100) /
                    this.workPackage.progress.total;
                }
              }
            }
          }
          break;
        case ActivityType.WorkPackageTaskAdd:
          if (this.workPackage.id === notification.data.packageId) {
            this.workPackage.progress.total++;
            if (notification.data.parentId) {
              find1 = this.findTask(notification.data.parentId);
              if (find1) {
                find1.subTasksCount++;
              }
            } else {
              find1 = this.workPackage.lists.find(
                l => l.id === notification.data.listId,
              );
              if (find1) {
                find1.tasks = find1.tasks || [];
                find1.tasks.unshift(notification.data);
              }
            }
            this.sortTasks();
          }
          break;
        case ActivityType.WorkPackageTaskBulkAdd:
          if (
            notification.data.length &&
            this.workPackage.id === notification.data[0].packageId
          ) {
            notification.data.forEach(d => {
              if (d.parentId) {
                find1 = this.findTask(d.parentId);
                if (find1) {
                  find1.subTasksCount++;
                }
              } else {
                find1 = this.workPackage.lists.find(l => l.id === d.listId);
                if (find1) {
                  find1.tasks = find1.tasks || [];
                  find1.tasks.unshift(d);
                }
              }
            });

            this.workPackage.progress.total += notification.data.length;
            this.sortTasks();
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
            find1 = this.findTask(notification.data.id);
            if (!find1 || find1.listId === notification.data.listId) {
              return;
            }
            const list = this.workPackage.lists.find(
              l => l.id === find1.listId,
            );
            const destination = this.workPackage.lists.find(
              l => l.id === notification.data.listId,
            );
            transferArrayItem(
              list.tasks,
              destination.tasks,
              list.tasks.indexOf(find1),
              notification.data.order - 1,
            );
          }
          break;
        case ActivityType.WorkPackageTaskReposition:
          if (this.workPackage.id === notification.data.packageId) {
            find1 = this.findTask(notification.data.id);
            if (!find1 || find1.order === notification.data.order) {
              return;
            }
            const list = this.workPackage.lists.find(
              l => l.id === find1.listId,
            );
            moveItemInArray(
              list.tasks,
              list.tasks.indexOf(find1),
              notification.data.order - 1,
            );
          }
          break;
        case ActivityType.WorkPackageTaskLabelAdd:
          if (this.workPackage.id === notification.data.packageId) {
            const task = this.findTask(notification.data.taskId);
            if (task) {
              find1 = task.labels.find(
                l => l.labelId === notification.data.labelId,
              );
              if (!find1) {
                task.labels.push(notification.data);
              }
            }
          }
          break;
        case ActivityType.WorkPackageTaskLabelRemove:
          find1 = this.findTask(notification.data.taskId);
          if (find1) {
            find1.labels = find1.labels.filter(
              i => i.labelId !== notification.data.labelId,
            );
          }
          break;
        case ActivityType.WorkPackageTaskMemberAdd:
          find1 = this.findTask(notification.data.taskId);
          if (!find1) {
            return;
          }
          const already = find1.members.find(
            i => i.recordId === notification.data.recordId,
          );
          if (!already) {
            find1.members.push(notification.data);
          }
          break;
        case ActivityType.WorkPackageTaskMemberRemove:
          find1 = this.findTask(notification.data.taskId);
          if (!find1) {
            return;
          }
          find1.members = find1.members.filter(
            i => i.recordId !== notification.data.recordId,
          );
          break;
        case ActivityType.WorkPackageTaskRemove:
        case ActivityType.WorkPackageTaskArchive:
          if (this.workPackage.id === notification.data.packageId) {
            const task = this.findTask(notification.data.id);
            if (task) {
              task.archivedAt = notification.data.archivedAt;
            }
            // this.workPackage.progress.total--;
          }
          break;
        case ActivityType.WorkPackageTaskAttachmentAdd:
          find1 = this.findTask(notification.data.taskId);
          if (find1) {
            find1.attachmentCount++;
          }
          break;
        case ActivityType.WorkPackageTaskAttachmentRemove:
          find1 = this.findTask(notification.data.taskId);
          if (find1) {
            find1.attachmentCount--;
          }
          break;
        case ActivityType.WorkPackageTaskAttachmentCover:
          find1 = this.findTask(notification.data.taskId);
          if (find1) {
            find1.coverUrl = notification.data.isCover
              ? notification.data.path
              : '';
          }
          break;
        case ActivityType.WorkPackageTaskWatch:
          find1 = this.findTask(notification.data.taskId);
          if (find1) {
            find1.watching = notification.data.watching;
          }
          break;
        case ActivityType.WorkPackageTaskVote:
          find1 = this.findTask(notification.data.taskId);
          if (find1) {
            if (!notification.data.updatedAt) {
              find1.upVotes += notification.data.vote ? 1 : 0;
              find1.downVotes += notification.data.vote ? 0 : 1;
            } else {
              if (notification.data.vote) {
                find1.downVotes--;
                find1.upVotes++;
              } else {
                find1.downVotes++;
                find1.upVotes--;
              }
            }
          }
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
              find1.color = notification.data.color;
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

        case ActivityType.WorkPackageEdit:
          if (this.workPackage.id === notification.data.id) {
            this.workPackage.title = notification.data.title;
            this.workPackage.description = notification.data.description;
            this.workPackage.order = notification.data.order;
            this.workPackage.permissionComment =
              notification.data.permissionComment;
            this.workPackage.permissionEditAttachment =
              notification.data.permissionEditAttachment;
            this.workPackage.permissionCreateAttachment =
              notification.data.permissionCreateAttachment;
            this.workPackage.permissionAssignMembers =
              notification.data.permissionAssignMembers;
            this.workPackage.permissionAssignLabels =
              notification.data.permissionAssignLabels;
            this.workPackage.permissionChangeTaskState =
              notification.data.permissionChangeTaskState;
            this.workPackage.permissionEditTask =
              notification.data.permissionEditTask;
            this.workPackage.permissionArchiveTask =
              notification.data.permissionArchiveTask;
            this.workPackage.permissionCreateTask =
              notification.data.permissionCreateTask;
            this.workPackage.permissionArchiveList =
              notification.data.permissionArchiveList;
            this.workPackage.permissionEditList =
              notification.data.permissionEditList;
            this.workPackage.permissionCreateList =
              notification.data.permissionCreateList;

            this.workPackage.listsSort = notification.data.listsSort;
            this.workPackage.attachmentsSort =
              notification.data.attachmentsSort;
            this.workPackage.tasksSort = notification.data.tasksSort;
            this.workPackage.subTasksSort = notification.data.subTasksSort;

            this.sortLists();
            this.sortTasks();
          }
          break;

        case ActivityType.WorkPackageConnect:
        case ActivityType.WorkPackageUpgrade:
        case ActivityType.WorkPackageMerge:
          if (this.workPackage.id === notification.data.id) {
            this.ngOnInit();
          }
          break;
      }
    });
  }
  async preFetch() {
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
      this.preWaiting = true;
      const op = await this.workPackageService.fetch(id, this.filters);
      if (op.status !== OperationResultStatus.Success) {
        this.router.navigateByUrl('dashboard');
        return;
      }
      this.workPackage = op.data;
      const projOp = await this.projectService.fetchArchived(op.data.projectId);
      if (projOp.status !== OperationResultStatus.Success) {
        this.router.navigateByUrl('dashboard');
        return;
      }
      this.preWaiting = false;
      this.project = projOp.data;
      this.permission = this.projectService.getWorkPackagePermission(
        this.project,
        this.workPackage,
      );
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
    this.sortLists();
    this.sortTasks();
    this.waiting = false;
  }

  findTask(id: string): WorkPackageTaskViewModel {
    for (const list of this.workPackage.lists) {
      for (const task of list.tasks) {
        if (task.id === id) {
          return task;
        }
        for (const sub of task.subTasks || []) {
          if (task.id === id) {
            return task;
          }
        }
      }
    }
  }

  mapData(model: WorkPackageViewModel): WorkPackageViewModel {
    model.lists.forEach(list => {
      list.tasks = model.tasks
        .filter(t => t.listId === list.id)
        .sort((a, b) => (a.order > b.order ? 1 : -1));
    });
    return model;
  }

  // findMember(recordId: string): MemberInfoViewModel {
  //   const access = this.project.members.find(m => m.recordId === recordId);
  //   return access.member;
  // }

  prepareInvite() {
    if (this.waiting) {
      return;
    }
    this.modalService
      .show(InviteModalComponent, {
        projectId: this.project.complex ? this.project.id : undefined,
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

  async removeAccess(
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
            : (await this.usersService.findUser(member.recordId)).fullName,
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
    if (mode === ViewMode.TimeSpan) {
      return;
    }
    this.mode = mode;
  }

  async leave() {
    const heading = StringHelpers.format(
      this.translateService.fromKey(
        this.project.complex
          ? 'LEAVE_WORK_PACKAGE_CONFIRM_HEADING'
          : 'LEAVE_PROJECT_CONFIRM_HEADING',
      ),
      [this.workPackage.title],
    );

    this.modalService
      .confirm({
        title: this.project.complex ? 'LEAVE_WORK_PACKAGE' : 'LEAVE_PROJECT',
        message: this.project.complex
          ? 'LEAVE_WORK_PACKAGE_CONFIRM'
          : 'LEAVE_PROJECT_CONFIRM',
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
      })
      .subscribe(() => {});
  }

  async archive() {
    const heading = StringHelpers.format(
      this.translateService.fromKey(
        this.project.complex
          ? 'ARCHIVE_WORK_PACKAGE_CONFIRM_HEADING'
          : 'ARCHIVE_PROJECT_CONFIRM_HEADING',
      ),
      [this.workPackage.title],
    );

    this.modalService
      .confirm({
        title: this.project.complex
          ? 'ARCHIVE_WORK_PACKAGE'
          : 'ARCHIVE_PROJECT',
        message: this.project.complex
          ? 'ARCHIVE_WORK_PACKAGE_CONFIRM'
          : 'ARCHIVE_PROJECT_DESCRIPTION',
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
      })
      .subscribe(() => {});
  }

  updateSettingNotification() {
    setTimeout(async () => {
      this.settingNotificationWaiting = true;
      const op = await this.workPackageService.updateUserSetting(
        this.workPackage.id,
        {
          notificationType: this.workPackage.userSetting.receiveNotification,
        },
      );
      this.settingNotificationWaiting = false;
      if (op.status !== OperationResultStatus.Success) {
        // TODO: handle error
        return;
      }
    }, 500);
  }

  async updateSettingShowTotal(showTotal: boolean) {
    this.workPackage.userSetting.showTotalCards = showTotal;
    this.settingShowTotalWaiting = true;
    const op = await this.workPackageService.updateUserSetting(
      this.workPackage.id,
      { showTotal },
    );
    this.settingShowTotalWaiting = false;
    if (op.status !== OperationResultStatus.Success) {
      // TODO: handle error
      return;
    }
  }

  async updateSettingVisibility(visibility: WorkPackageTaskVisibility) {
    this.workPackage.taskVisibility = visibility;
    this.settingVisibilityWaiting = true;
    const op = await this.workPackageService.updateSetting(
      this.workPackage.id,
      { visibility },
    );
    this.settingVisibilityWaiting = false;
    if (op.status !== OperationResultStatus.Success) {
      // TODO: handle error
      return;
    }
  }

  prepareRename() {
    if (
      this.updating ||
      !(
        this.permission === AccessType.Admin ||
        this.permission === AccessType.Owner
      )
    ) {
      return;
    }
    this.modalService
      .show(PromptComponent, {
        icon: 'icon-workpackage',
        title: 'EDIT_WORK_PACKAGE',
        form: [
          {
            elements: [
              this.formService.createInput({
                config: { field: 'title' },
                params: { model: this.workPackage.title, placeHolder: 'TITLE' },
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
                  model: this.workPackage.description,
                  textArea: true,
                  placeHolder: 'DESCRIPTION',
                },
              }),
            ],
          },
        ],
        action: async (params, form) => {
          const op = await this.workPackageService.edit(
            this.workPackage.id,
            params,
          );
          if (op.status !== OperationResultStatus.Success) {
            // TODO: handle error
            return;
          }
          this.notificationService.success('GENERAL_SUCCESS');
        },
        actionLabel: 'SAVE_CHANGES',
        actionColor: 'primary',
      } as PromptModalParameters)
      .subscribe(() => {});
  }

  prepareUpgrade() {
    this.modalService
      .show(UpgradeWorkPackageComponent, { workPackage: this.workPackage })
      .subscribe(() => {});
  }

  openPermissions() {
    this.modalService
      .show(WorkPackagePermissionComponent, {
        workPackage: { ...this.workPackage },
      })
      .subscribe(() => {});
  }

  async remove() {
    const heading = StringHelpers.format(
      this.translateService.fromKey(
        this.project.complex
          ? 'REMOVE_WORK_PACKAGE_CONFIRM_HEADING'
          : 'REMOVE_PROJECT_CONFIRM_HEADING',
      ),
      [this.workPackage.title],
    );

    this.modalService
      .confirm({
        title: this.project.complex ? 'REMOVE_WORK_PACKAGE' : 'REMOVE_PROJECT',
        message: this.project.complex
          ? 'REMOVE_WORK_PACKAGE_CONFIRM'
          : 'REMOVE_PROJECT_DESCRIPTION',
        heading,
        actionLabel: 'REMOVE',
        cancelLabel: 'CANCEL',
        action: async () => {
          this.deleting = true;
          const op = await (this.project.complex
            ? this.workPackageService.remove(this.workPackage.id)
            : this.projectService.remove(this.project.id));
          this.deleting = false;
          if (op.status !== OperationResultStatus.Success) {
            // TODO: handle error
            return;
          }
          return await this.router.navigateByUrl('/dashboard');
        },
      })
      .subscribe(() => {});
  }

  openCustomFields() {
    this.modalService
      .show(CustomFieldsModalComponent, { workPackage: this.workPackage })
      .subscribe(() => {});
  }

  openLabels() {
    this.modalService
      .show(LabelsModalComponent, { workPackage: this.workPackage })
      .subscribe(() => {});
  }

  openSortOrder() {
    this.modalService
      .show(PromptComponent, {
        icon: 'ikon-sort-alpha-asc',
        title: 'SORT_ORDERS',
        form: [
          {
            size: 6,
            elements: [
              this.formService.createDropDown({
                config: { field: 'listsSort', label: 'LISTS_ORDER' },
                params: {
                  model: this.workPackage.listsSort,
                  items: [],
                  enum: 'SortType',
                },
              }),
            ],
          },
          {
            size: 6,
            elements: [
              this.formService.createDropDown({
                config: {
                  field: 'attachmentsSort',
                  label: 'ATTACHMENTS_ORDER',
                },
                params: {
                  model: this.workPackage.attachmentsSort,
                  items: [],
                  enum: 'SortType',
                },
              }),
            ],
          },
          {
            size: 6,
            elements: [
              this.formService.createDropDown({
                config: { field: 'tasksSort', label: 'TASKS_ORDER' },
                params: {
                  model: this.workPackage.tasksSort,
                  items: [],
                  enum: 'SortType',
                },
              }),
            ],
          },
          {
            size: 6,
            elements: [
              this.formService.createDropDown({
                config: { field: 'subTasksSort', label: 'SUB_TASKS_ORDER' },
                params: {
                  model: this.workPackage.subTasksSort,
                  items: [],
                  enum: 'SortType',
                },
              }),
            ],
          },
        ],
        action: async (params, form) => {
          const op = await this.workPackageService.editSortOrders(
            this.workPackage.id,
            params,
          );
          if (op.status !== OperationResultStatus.Success) {
            // TODO: handle error
            return;
          }
          this.notificationService.success('GENERAL_SUCCESS');
        },
        actionLabel: 'SAVE_CHANGES',
        actionColor: 'primary',
      } as PromptModalParameters)
      .subscribe(() => {});
  }

  sortLists() {
    switch (this.workPackage.listsSort) {
      case SortType.DateAsc:
        this.workPackage.lists = this.workPackage.lists.sort((a, b) => {
          return DateHelpers.sort(a, b, 'createdAt');
        });
        break;
      case SortType.DateDesc:
        this.workPackage.lists = this.workPackage.lists
          .sort((a, b) => {
            return DateHelpers.sort(a, b, 'createdAt');
          })
          .reverse();
        break;
      case SortType.NameAsc:
        this.workPackage.lists = this.workPackage.lists.sort((a, b) =>
          a.title.localeCompare(b.title),
        );
        break;
      case SortType.NameDesc:
        this.workPackage.lists = this.workPackage.lists
          .sort((a, b) => a.title.localeCompare(b.title))
          .reverse();
        break;
      default:
        break;
    }
  }

  sortTasks() {
    this.workPackage.lists.forEach(list => {
      switch (this.workPackage.tasksSort) {
        case SortType.DateAsc:
          list.tasks = list.tasks.sort((a, b) => {
            return DateHelpers.sort(a, b, 'createdAt');
          });
          break;
        case SortType.DateDesc:
          list.tasks = list.tasks
            .sort((a, b) => {
              return DateHelpers.sort(a, b, 'createdAt');
            })
            .reverse();
          break;
        case SortType.NameAsc:
          list.tasks = list.tasks.sort((a, b) =>
            a.title.localeCompare(b.title),
          );
          break;
        case SortType.NameDesc:
          list.tasks = list.tasks
            .sort((a, b) => a.title.localeCompare(b.title))
            .reverse();
          break;
        default:
          break;
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
