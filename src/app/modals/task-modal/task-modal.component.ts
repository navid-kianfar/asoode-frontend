import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {SimpleModalComponent} from 'ngx-simple-modal';
import {TaskModalParameters} from '../../view-models/core/modal-types';
import {
  ProjectMemberViewModel,
  ProjectViewModel,
  WorkPackageLabelViewModel,
  WorkPackageTaskAttachmentViewModel,
  WorkPackageTaskTimeViewModel,
  WorkPackageTaskViewModel,
  WorkPackageViewModel,
} from '../../view-models/projects/project-types';
import {TaskService} from '../../services/projects/task.service';
import {OperationResultStatus} from '../../library/core/enums';
import {ProjectService} from '../../services/projects/project.service';
import {AccessType, ActivityType, WorkPackageTaskState,} from '../../library/app/enums';
import {IdentityService} from '../../services/auth/identity.service';
import {Socket} from 'ngx-socket-io';
import {UploadViewModel} from '../../view-models/storage/files-types';
import {FilesService} from '../../services/storage/files.service';
import {UsersService} from '../../services/general/users.service';
import {ModalService} from '../../services/core/modal.service';
import {StringHelpers} from '../../helpers/string.helpers';
import {TranslateService} from '../../services/core/translate.service';
import {WorkPackageService} from '../../services/projects/work-package.service';
import {MapModalComponent} from '../map-modal/map-modal.component';
import {OperationResult} from '../../library/core/operation-result';
import {MapMarker, MapModalParameters,} from '../../view-models/general/map-types';
import {NumberHelpers} from 'src/app/helpers/number.helpers';
import {TimeViewModel} from '../../view-models/core/general-types';
import {CulturedDateService} from '../../services/core/cultured-date.service';
import {MatMenu} from '@angular/material';
import {GroupService} from '../../services/groups/group.service';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {DeviceDetectorService} from 'ngx-device-detector';
import {UploadExceedModalComponent} from '../upload-exceed-modal/upload-exceed-modal.component';

@Component({
  selector: 'app-task-modal',
  templateUrl: './task-modal.component.html',
  styleUrls: ['./task-modal.component.scss'],
})
export class TaskModalComponent
  extends SimpleModalComponent<TaskModalParameters, void>
  implements OnInit, OnDestroy {
  ViewMode = ViewMode;
  id: string;
  mode: ViewMode;
  model: WorkPackageTaskViewModel;
  comment: string;
  commenting: boolean;
  waiting: boolean;
  newTitle: string;
  changingTitle: boolean;
  savingTitle: boolean;
  changingDescription: boolean;
  savingDescription: boolean;
  newDescription: string;
  allStates: number[];
  permission: AccessType;
  AccessType = AccessType;
  DateMode = DateMode;
  changingState: boolean;
  project: ProjectViewModel;
  workPackage: WorkPackageViewModel;
  allowedTypes: string;

  @ViewChild('labelMenu', { static: false }) labelMenu;
  @ViewChild('filePicker', { static: false }) filePicker;
  togglingWatch: boolean;
  togglingArchive: boolean;
  showSubTasks: boolean;
  showVotes: boolean;
  showMap: boolean;
  voting: boolean;
  addingSub: boolean;
  subTaskTitle: string;
  bg: string;
  savingSub: boolean;
  NumberHelpers = NumberHelpers;
  tempEstimatedTime: number;
  savingEstimated: boolean;
  recording: boolean;
  intervalInstance: number;
  totalTimeSpent: TimeViewModel;
  tempDueAt: Date;
  tempBeginAt: Date;
  tempEndAt: Date;
  tempDateMode: DateMode;
  tempHour: number;
  tempMinute: number;
  deletingDate: boolean;
  savingDate: boolean;
  projectId: string;
  packageId: string;

  groupMembers: ProjectMemberViewModel[];
  individualMembers: ProjectMemberViewModel[];
  noDrag: boolean;
  dragging: boolean;
  dragDelay: number;


  constructor(
    private readonly socket: Socket,
    private readonly taskService: TaskService,
    private readonly projectService: ProjectService,
    private readonly groupService: GroupService,
    readonly translateService: TranslateService,
    readonly usersService: UsersService,
    readonly modalService: ModalService,
    readonly filesService: FilesService,
    readonly identityService: IdentityService,
    private readonly workPackageService: WorkPackageService,
    private readonly culturedDateService: CulturedDateService,
    private readonly deviceDetectorService: DeviceDetectorService,
  ) {
    super();
  }

  ngOnInit() {
    this.dragDelay =
      this.deviceDetectorService.isTablet() ||
      this.deviceDetectorService.isMobile()
        ? 1000
        : 0;
    this.noDrag = this.deviceDetectorService.os.toLowerCase() === 'ios';
    this.totalTimeSpent = { day: 0, hour: 0, minute: 0 };
    this.filesService.attaching = this.filesService.attaching.filter(a => {
      if (a.recordId !== this.id) {
        return true;
      }
      return a.uploading;
    });
    this.allStates = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    this.allowedTypes = [
      'image/*',
      'audio/*',
      'video/*',
      '.xls,.xlsx,.csv',
      '.zip,.rar,.7z,.tar,.gz',
      '.pdf',
      '.ppt,.pptx',
      '.doc,.docx,.rtf,.txt',
    ].join(',');
    this.mode = ViewMode.Detail;
    this.bind();
    this.fetch();
  }

  ngOnDestroy(): void {
    if (this.intervalInstance) {
      clearInterval(this.intervalInstance);
    }
    super.ngOnDestroy();
  }

  clearInputFile(f) {
    if (f.value) {
      try {
        f.value = '';
      } catch (err) {}
      if (f.value) {
        const form = document.createElement('form');
        const parentNode = f.parentNode;
        const ref = f.nextSibling;
        form.appendChild(f);
        form.reset();
        parentNode.insertBefore(f, ref);
      }
    }
  }

  onChange(target: any) {
    if (!target.files || !target.files.length) {
      return;
    }
    const upload: UploadViewModel[] = [];
    for (let i = 0; i < target.files.length; i++) {
      const f = target.files.item(i);
      upload.push({
        uploading: false,
        success: false,
        failed: false,
        progress: 0,
        name: f.name,
        size: f.size,
        file: f,
        extensionLessName: this.filesService.getExtensionLessFileName(f.name),
        extension: this.filesService.getFileExtension(f.name),
        promise: undefined,
        recordId: this.id,
      });
    }
    this.clearInputFile(target);
    this.filterFiles(upload)
      .then((filtered) => {
        this.filesService.attach(filtered, this.id);
        this.filesService.attaching = [...this.filesService.attaching, ...filtered];
      });
  }

  async filterFiles(upload: UploadViewModel[]): Promise<UploadViewModel[]> {
    return new Promise((resolve, reject) => {
      const filtered: UploadViewModel[] = [];
      const allowed: UploadViewModel[] = [];
      (upload || []).forEach(u => {
        if (u.file.size > this.project.attachmentSize) {
          filtered.push(u);
        } else {
          allowed.push(u);
        }
      });
      if (filtered.length) {
        this.modalService.show(UploadExceedModalComponent, {
          uploads: filtered,
          attachmentSize: this.project.attachmentSize
        }).subscribe(() => resolve(allowed));
        return;
      }
      resolve(allowed);
    });
  }

  bind() {
    this.socket.on('push-notification', (notification: any) => {
      [this.model, ...this.model.subTasks].forEach(travel => {
        switch (notification.type) {
          case ActivityType.WorkPackageTaskDone:
          case ActivityType.WorkPackageTaskBlocked:
          case ActivityType.WorkPackageTaskUnBlock:
          case ActivityType.WorkPackageTaskEdit:
            if (travel.id === notification.data.id) {
              travel.beginReminder = notification.data.beginReminder;
              travel.endReminder = notification.data.endReminder;
              travel.voteNecessity = notification.data.voteNecessity;
              travel.objectiveValue = notification.data.objectiveValue;
              travel.estimatedTime = notification.data.estimatedTime;
              travel.coverId = notification.data.coverId;
              travel.listId = notification.data.listId;
              travel.state = notification.data.state;
              travel.listName = notification.data.listName;
              travel.timeSpent = notification.data.timeSpent;
              travel.doneUserId = notification.data.doneUserId;
              travel.archivedAt = notification.data.archivedAt;
              travel.dueAt = notification.data.dueAt;
              travel.beginAt = notification.data.beginAt;
              travel.endAt = notification.data.endAt;
              travel.doneAt = notification.data.doneAt;
              travel.title = notification.data.title;
              travel.description = notification.data.description;
              travel.geoLocation = notification.data.geoLocation;
              this.tempEstimatedTime = travel.estimatedTime;
              this.postProcess();
            }
            break;
          case ActivityType.WorkPackageTaskAdd:
            if (
              this.workPackage.id === notification.data.packageId &&
              notification.data.parentId === travel.id
            ) {
              const found = travel.subTasks.find(
                l => l.id === notification.data.id,
              );
              if (!found) {
                travel.subTasks.unshift(notification.data);
              }
            }
            break;
          case ActivityType.WorkPackageTaskComment:
            if (travel.id === notification.data.taskId) {
              travel.comments.unshift(notification.data);
            }
            break;
          case ActivityType.WorkPackageTaskLabelAdd:
            if (travel.id === notification.data.taskId) {
              const already = travel.labels.find(
                i => i.id === notification.data.labelId,
              );
              if (!already) {
                travel.labels.push(notification.data);
              }
            }
            break;
          case ActivityType.WorkPackageTaskLabelRemove:
            if (travel.id === notification.data.taskId) {
              travel.labels = travel.labels.filter(
                i => i.labelId !== notification.data.labelId,
              );
            }
            break;
          case ActivityType.WorkPackageTaskMemberAdd:
            if (travel.id === notification.data.taskId) {
              const already = travel.members.find(
                i => i.recordId === notification.data.recordId,
              );
              if (!already) {
                travel.members.push(notification.data);
              }
            }
            break;
          case ActivityType.WorkPackageTaskMemberRemove:
            if (travel.id === notification.data.taskId) {
              travel.members = travel.members.filter(
                i => i.recordId !== notification.data.recordId,
              );
            }
            break;
          case ActivityType.WorkPackageTaskAttachmentAdd:
            if (travel.id === notification.data.taskId) {
              travel.attachments.unshift(notification.data);
            }
            break;
          case ActivityType.WorkPackageTaskAttachmentRemove:
            if (travel.id === notification.data.taskId) {
              travel.attachments = travel.attachments.filter(
                a => a.id !== notification.data.id,
              );
            }
            break;
          case ActivityType.WorkPackageTaskAttachmentRename:
            if (travel.id === notification.data.taskId) {
              const found = travel.attachments.find(
                a => a.id === notification.data.id,
              );
              if (found) {
                Object.assign(found, notification.data);
              }
            }
            break;
          case ActivityType.WorkPackageTaskAttachmentCover:
            if (travel.id === notification.data.taskId) {
              const found = travel.attachments.find(
                a => a.id === notification.data.id,
              );
              if (found) {
                found.isCover = notification.data.isCover;
                travel.coverId = notification.data.isCover
                  ? notification.data.id
                  : '';
                this.bg = this.getBackgroundUrl();
              }
            }
            break;
          case ActivityType.WorkPackageTaskWatch:
            if (travel.id === notification.data.taskId) {
              travel.watching = notification.data.watching;
            }
            break;
          case ActivityType.WorkPackageTaskVote:
            if (travel.id === notification.data.taskId) {
              const found = travel.votes.find(
                i => i.id === notification.data.id,
              );
              if (found) {
                Object.assign(found, notification.data);
              } else {
                travel.votes.push(notification.data);
              }
              travel.upVotes = travel.votes.filter(m => m.vote).length;
              travel.downVotes = travel.votes.filter(m => !m.vote).length;
            }
            break;
          case ActivityType.WorkPackageTaskArchive:
            if (travel.id === notification.data.id) {
              travel.archivedAt = notification.data.archivedAt;
            }
            break;
          case ActivityType.WorkPackageTaskTime:
            if (travel.id === notification.data.taskId) {
              const found = (travel.timeSpents || []).find(
                t => t.id === notification.data.id,
              );
              if (!found) {
                travel.timeSpents.unshift(notification.data);
              } else {
                found.end = notification.data.end;
              }
            }
            break;
        }
      });
    });
  }

  async fetch() {
    this.waiting = true;

    const op = await this.taskService.fetch(this.id);
    if (op.status !== OperationResultStatus.Success) {
      console.error('Task not found');
      return this.close();
    }

    if (!this.project) {
      this.project = this.projectService.projects.find(p => p.id === op.data.projectId);
    }

    if (!this.project) {
      const archivedProject = await this.projectService.fetchArchived(this.projectId);
      if (archivedProject.status !== OperationResultStatus.Success) {
        console.error('Project not found');
        return this.close();
      }
      this.projectService.projects.push(archivedProject.data);
      this.project = archivedProject.data;
    }

    if (!this.workPackage) {
      this.workPackage = this.project.workPackages.find(w => w.id === op.data.packageId);
    }
    if (!this.workPackage) {
      console.error('Package not found');
      return this.close();
    }

    this.groupMembers = this.project.members
      .filter(i => i.isGroup)
      .filter(f => {
        return this.workPackage.members.find(d => d.recordId === f.recordId);
      });
    this.individualMembers = this.project.members.filter(i => !i.isGroup);

    this.groupMembers.forEach(g => {
      const grp = this.groupService.groups.find(i => i.id === g.recordId);
      if (grp) {
        grp.members.forEach(m => {
          const found = this.individualMembers.find(
            d => d.recordId === m.userId,
          );
          if (found) {
            return;
          }
          this.individualMembers.push({
            recordId: m.userId,
            isGroup: false,
            id: m.id,
            access: m.access,
            updatedAt: m.updatedAt,
            selected: false,
            projectId: this.project.id,
            deleting: false,
            createdAt: m.createdAt,
            waiting: false,
            member: undefined,
          });
        });
      }
    });

    this.waiting = false;
    this.model = op.data;
    this.permission = this.workPackageService.getPermission(
      op.data.projectId,
      op.data.packageId,
    );
    this.postProcess();
    this.calculateAll();
    this.intervalInstance = setInterval(() => this.calculateAll(), 10000);
  }

  calculateAll() {
    const total = this.model.timeSpents
      .map(t => {
        t.diff = this.calcDiff(t);
        return t.diff;
      })
      .reduce((a, b) => a + b, 0);
    this.totalTimeSpent = NumberHelpers.ticksToTimeSpan(total * 10000);
  }

  calcDiff(log: WorkPackageTaskTimeViewModel): number {
    const begin = new Date(log.begin);
    const end = log.end ? new Date(log.end) : new Date();
    return end.getTime() - begin.getTime();
  }

  switchMode(mode: ViewMode) {
    this.mode = mode;
  }

  async sendComment() {
    this.commenting = true;
    const op = await this.taskService.comment(this.id, {
      message: this.comment,
      private: false,
    });
    this.commenting = false;
    if (op.status !== OperationResultStatus.Success) {
      // TODO: handle error
      return;
    }
    this.comment = '';
  }

  getBackgroundUrl(): string {
    if (!this.model.coverId) {
      return '';
    }
    const attachment = this.model.attachments.find(
      a => a.id === this.model.coverId,
    );
    if (!attachment) {
      return '';
    }
    return `url("${attachment.path}")`;
  }

  private postProcess() {
    // const permission = this.project.members.find(
    //   m => m.recordId === this.identityService.identity.userId,
    // );
    // this.permission = permission ? permission.access : AccessType.Visitor;
    this.model.comments.forEach(c => {
      const found = this.project.members.find(m => m.recordId === c.userId);
      if (found) {
        c.member = found.member;
      }
    });
    this.model.subTasksDone = this.model.subTasks.filter(i => i.doneAt).length;
    this.bg = this.getBackgroundUrl();
    this.tempEstimatedTime = this.model.estimatedTime;

    this.tempDateMode =
      this.model.dueAt || (!this.model.beginAt && !this.model.endAt)
        ? DateMode.Due
        : DateMode.Range;
    this.tempBeginAt = this.model.beginAt;
    this.tempEndAt = this.model.endAt;
    this.tempDueAt = this.model.dueAt ? new Date(this.model.dueAt) : null;
    if (this.tempDateMode === DateMode.Due && this.tempDueAt) {
      this.tempHour = this.tempDueAt.getHours();
      this.tempMinute = this.tempDueAt.getMinutes();
    }

    this.model.upVotes = this.model.votes.filter(m => m.vote).length;
    this.model.downVotes = this.model.votes.filter(m => !m.vote).length;
  }

  dueSelected() {
    this.tempDateMode = DateMode.Due;
    // this.tempBeginAt = undefined;
    // this.tempEndAt = undefined;
    if (this.tempDateMode === DateMode.Due && this.tempDueAt) {
      this.tempHour = this.tempDueAt.getHours();
      this.tempMinute = this.tempDueAt.getMinutes();
    }
  }

  rangeSelected() {
    this.tempDateMode = DateMode.Range;
    // this.tempDueAt = undefined;
  }

  prepareChangeTitle() {
    this.changingDescription = false;
    this.changingTitle = true;
    this.newTitle = this.model.title;
  }

  prepareChangeDescription() {
    this.changingTitle = false;
    this.changingDescription = true;
    this.newDescription = this.model.description;
  }

  async changeTitle() {
    const title = this.newTitle.trim();
    if (!title) {
      return;
    }
    if (title === this.model.title) {
      this.changingTitle = false;
      this.savingTitle = false;
      return;
    }
    this.savingTitle = true;
    const op = await this.taskService.changeTitle(this.id, { title });
    if (op.status !== OperationResultStatus.Success) {
      // TODO: handle error
      return;
    }
    this.changingTitle = false;
    this.savingTitle = false;
  }

  async changeDescription() {
    const title = (this.newDescription || '').trim();
    if (title === (this.model.description || '')) {
      this.changingDescription = false;
      this.savingDescription = false;
      return;
    }
    if (!title) {
      return;
    }
    this.savingDescription = true;
    const op = await this.taskService.changeDescription(this.id, { title });
    if (op.status !== OperationResultStatus.Success) {
      // TODO: handle error
      return;
    }
    this.changingDescription = false;
    this.savingDescription = false;
  }

  async changeState(state: WorkPackageTaskState) {
    this.model.state = state;
    this.changingState = true;
    const op = await this.taskService.changeState(this.id, { state });
    this.changingState = false;
    if (op.status !== OperationResultStatus.Success) {
      // TODO: handle error
    }
  }

  async toggleMember(member: ProjectMemberViewModel) {
    if (member.waiting) {
      return;
    }
    member.waiting = true;
    if (
      this.model.members.findIndex(i => i.recordId === member.recordId) === -1
    ) {
      await this.taskService.addMember(this.id, {
        isGroup: member.isGroup,
        recordId: member.recordId,
      });
    } else {
      await this.taskService.removeMember(this.id, member.recordId);
    }
    member.waiting = false;
  }

  toggleLabel(label: WorkPackageLabelViewModel) {
    if (label.waiting || label.editting) {
      return;
    }
    if (this.model.labels.findIndex(i => i.labelId === label.id) === -1) {
      this.taskService.addLabel(this.id, label.id);
    } else {
      this.taskService.removeLabel(this.id, label.id);
    }
  }

  isMemberSelected(member: ProjectMemberViewModel): boolean {
    return (
      this.model.members.findIndex(m => m.recordId === member.recordId) !== -1
    );
  }

  isLabelSelected(label: WorkPackageLabelViewModel) {
    return this.model.labels.findIndex(m => m.labelId === label.id) !== -1;
  }

  prepareUpload() {
    this.filePicker.nativeElement.click();
  }

  prepareChoose() {}

  getPath(attachment: WorkPackageTaskAttachmentViewModel) {
    if (attachment.path.indexOf('https://') === -1) {
      return 'https://storage.asoode.com' + attachment.path;
    }
    return attachment.path;
  }

  openAttachment(attachment: WorkPackageTaskAttachmentViewModel) {
    window.open(this.getPath(attachment), '_blank');
  }

  downloadAttachment(attachment: WorkPackageTaskAttachmentViewModel) {
    this.filesService.download(attachment.path, null);
  }

  editAttachment(attachment: WorkPackageTaskAttachmentViewModel) {
    attachment.tempName = this.filesService.getExtensionLessFileName(
      attachment.title,
    );
    attachment.renaming = true;
    attachment.waiting = false;
  }

  async coverToggle(attachment: WorkPackageTaskAttachmentViewModel) {
    if (attachment.covering) {
      return;
    }
    attachment.covering = true;
    const op = await this.taskService.coverAttachment(attachment.id);
    attachment.covering = false;
    if (op.status !== OperationResultStatus.Success) {
      // TODO:handle error
      return;
    }
  }

  async renameAttachment(attachment: WorkPackageTaskAttachmentViewModel) {
    const old = this.filesService.getExtensionLessFileName(attachment.title);
    const title = attachment.tempName.trim();
    if (old === title) {
      attachment.renaming = false;
      return;
    }
    attachment.waiting = true;
    const op = await this.taskService.renameAttachment(attachment.id, {
      title,
    });
    attachment.waiting = false;
    if (op.status !== OperationResultStatus.Success) {
      // TODO: handle error
      return;
    }
    attachment.renaming = false;
    attachment.waiting = false;
  }

  deleteAttachment(attachment: WorkPackageTaskAttachmentViewModel) {
    const heading = StringHelpers.format(
      this.translateService.fromKey('REMOVE_ATTACHMENT_CONFIRM_HEADING'),
      [attachment.title],
    );
    this.modalService
      .confirm({
        title: 'REMOVE_ATTACHMENT',
        message: 'REMOVE_ATTACHMENT_CONFIRM',
        heading,
        actionLabel: 'REMOVE_ATTACHMENT',
        cancelLabel: 'CANCEL',
        action: async () => {
          return await this.taskService.removeAttachment(attachment.id);
        },
      })
      .subscribe(() => {});
  }

  async toggleWatch() {
    this.togglingWatch = true;
    const op = await this.taskService.toggleWatch(this.id);
    this.togglingWatch = false;
    if (op.status !== OperationResultStatus.Success) {
      // TODO: handle error
      return;
    }
  }

  async toggleArchive() {
    this.togglingArchive = true;
    const op = await this.taskService.toggleArchive(this.id);
    this.togglingArchive = false;
    if (op.status !== OperationResultStatus.Success) {
      // TODO: handle error
      return;
    }
  }

  prepareRenameLabel(label: WorkPackageLabelViewModel, $event: MouseEvent) {
    $event.stopPropagation();
    $event.preventDefault();
    this.workPackage.labels.forEach(l => {
      if (l.waiting) {
        return;
      }
      if (l.editting) {
        l.editting = false;
      }
    });
    label.editting = true;
    label.tempName = label.title;
  }

  deleteLabel(label: WorkPackageLabelViewModel, $event: MouseEvent) {
    $event.preventDefault();
    $event.stopPropagation();
    this.labelMenu.close.emit();
    const heading = StringHelpers.format(
      this.translateService.fromKey('REMOVE_LABEL_CONFIRM_HEADING'),
      [label.title],
    );
    this.modalService
      .confirm({
        title: 'REMOVE_LABEL',
        message: 'REMOVE_LABEL_CONFIRM',
        heading,
        actionLabel: 'REMOVE_LABEL',
        cancelLabel: 'CANCEL',
        action: async () => {
          return await this.workPackageService.removeLabel(label.id);
        },
      })
      .subscribe(() => {});
  }

  async saveLabelName(label: WorkPackageLabelViewModel) {
    const title = label.tempName.trim();
    if (title === label.title) {
      label.editting = false;
      return;
    }
    label.waiting = true;
    const op = await this.workPackageService.renameLabel(label.id, { title });
    label.waiting = false;
    if (op.status !== OperationResultStatus.Success) {
      // TODO: handle error
      return;
    }
    label.title = label.tempName;
    label.editting = false;
  }

  prepareSubTask() {
    this.subTaskTitle = '';
    this.addingSub = true;
  }

  openSubTask(sub: WorkPackageTaskViewModel, $event: MouseEvent) {
    $event.stopPropagation();
    $event.preventDefault();
    this.modalService
      .show(TaskModalComponent, {
        id: sub.id,
        project: this.project,
        workPackage: this.workPackage,
      })
      .subscribe(() => {});
  }

  prepareMap() {
    this.modalService
      .show<MapModalParameters, MapMarker[]>(MapModalComponent, {
        mapLocation: this.model.geoLocation,
      })
      .subscribe(async markers => {
        let op: OperationResult<boolean>;
        if (!markers.length) {
          if (this.model.geoLocation) {
            op = await this.taskService.removeLocation(this.model.id);
            if (op.status !== OperationResultStatus.Success) {
              // TODO: handle error
              return;
            }
          }
          return;
        }
        const location =
          markers[0].location.latitude + ',' + markers[0].location.longitude;
        op = await this.taskService.setLocation(this.model.id, { location });
        if (op.status !== OperationResultStatus.Success) {
          // TODO: handle error
          return;
        }
      });
  }

  async removeLocation() {
    const op = await this.taskService.removeLocation(this.model.id);
    if (op.status !== OperationResultStatus.Success) {
      // TODO: handle error
      return;
    }
  }

  async vote(vote: boolean) {
    if (
      this.voting ||
      this.model.votes.find(
        v => v.userId === this.identityService.identity.userId,
      )
    ) {
      return;
    }
    this.voting = true;
    const op = await this.taskService.vote(this.model.id, { vote });
    this.voting = false;
    if (op.status !== OperationResultStatus.Success) {
      // TODO: handle error
      return;
    }
  }

  async createSub() {
    const title = this.subTaskTitle.trim();
    if (!title) {
      return;
    }
    this.savingSub = true;
    const op = await this.taskService.create(this.model.packageId, {
      listId: this.model.listId,
      title,
      parentId: this.model.id,
    });
    this.savingSub = false;
    if (op.status !== OperationResultStatus.Success) {
      // TODO: handle error;
      return;
    }
    this.subTaskTitle = '';
    this.addingSub = false;
  }

  async saveEstimated() {
    if (!this.tempEstimatedTime) {
      return;
    }
    this.savingEstimated = true;
    const op = await this.taskService.changeEstimated(this.model.id, {
      duration: this.tempEstimatedTime,
    });
    this.savingEstimated = false;
    if (op.status !== OperationResultStatus.Success) {
      // TODO: handle error
      return;
    }
  }

  async removeTimeSpan() {
    this.savingEstimated = true;
    const op = await this.taskService.changeEstimated(this.model.id, {
      duration: 0,
    });
    this.savingEstimated = false;
    if (op.status !== OperationResultStatus.Success) {
      // TODO: handle error
      return;
    }
    this.tempEstimatedTime = 0;
  }

  addManualTime() {}

  async toggleWorking() {
    this.recording = true;
    const op = await this.taskService.spendTime(this.model.id, {});
    this.recording = false;
    if (op.status !== OperationResultStatus.Success) {
      // TODO: handle error
      return;
    }
  }

  async removeRecord(log: WorkPackageTaskTimeViewModel) {}

  async saveDate(timeRangeMenu: MatMenu) {
    let payload: any;
    const converter = this.culturedDateService.Converter();
    if (this.tempDateMode === DateMode.Due) {
      if (!this.tempDueAt) {
        return;
      }
      const parsed = converter.FromDateTime(new Date(this.tempDueAt));
      const date = converter.ToDateTime({
        Year: parsed.Year,
        Month: parsed.Month,
        Day: parsed.Day,
        Hours: this.tempHour,
        Minutes: this.tempMinute,
      });
      payload = { dueAt: date };
    } else {
      if (!this.tempBeginAt || !this.tempEndAt) {
        return;
      }
      payload = { beginAt: this.tempBeginAt, endAt: this.tempEndAt };
    }
    this.savingDate = true;
    const op = await this.taskService.setDate(this.model.id, payload);
    this.savingDate = false;
    if (op.status !== OperationResultStatus.Success) {
      // TODO: handle error
      return;
    }
    timeRangeMenu.closed.emit();
  }

  async removeDate(timeRangeMenu: MatMenu) {
    this.deletingDate = true;
    const op = await this.taskService.setDate(this.model.id, {});
    this.deletingDate = false;
    if (op.status !== OperationResultStatus.Success) {
      // TODO: handle error
      return;
    }
    if (timeRangeMenu) {
      timeRangeMenu.closed.emit();
    }
  }

  drop(event: CdkDragDrop<WorkPackageTaskViewModel[], any>) {
    const id = event.item.data.id;
    moveItemInArray(
      event.container.data,
      event.previousIndex,
      event.currentIndex,
    );
    event.item.data.order = event.currentIndex + 1;
    this.taskService.reposition(id, { order: event.currentIndex + 1 });
  }

  isAdminOrHasPermission(permission: boolean) {
    return (this.permission === AccessType.Owner || this.permission === AccessType.Admin) ||
      (this.permission !== AccessType.Visitor && permission);
  }

  onAudioEnded($event: any, attachment: WorkPackageTaskAttachmentViewModel) {

  }
}
export enum DateMode {
  Due = 1,
  Range = 2,
}
export enum ViewMode {
  Detail = 1,
  TimeSpent = 2,
  Related = 3,
  CustomField = 4,
  Activity = 5,
}
