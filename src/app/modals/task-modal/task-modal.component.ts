import {Component, OnInit, ViewChild} from '@angular/core';
import {SimpleModalComponent} from 'ngx-simple-modal';
import {TaskModalParameters} from '../../view-models/core/modal-types';
import {
  ProjectMemberViewModel,
  ProjectViewModel,
  WorkPackageLabelViewModel,
  WorkPackageTaskAttachmentViewModel,
  WorkPackageTaskViewModel,
  WorkPackageViewModel
} from '../../view-models/projects/project-types';
import {TaskService} from '../../services/projects/task.service';
import {OperationResultStatus} from '../../library/core/enums';
import {ProjectService} from '../../services/projects/project.service';
import {AccessType, ActivityType, WorkPackageTaskState} from '../../library/app/enums';
import {IdentityService} from '../../services/auth/identity.service';
import {Socket} from 'ngx-socket-io';
import {UploadViewModel} from '../../view-models/storage/files-types';
import {FilesService} from '../../services/storage/files.service';
import {UsersService} from '../../services/general/users.service';
import {ModalService} from '../../services/core/modal.service';
import {StringHelpers} from '../../helpers/string.helpers';
import {TranslateService} from '../../services/core/translate.service';
import {WorkPackageService} from '../../services/projects/work-package.service';

@Component({
  selector: 'app-task-modal',
  templateUrl: './task-modal.component.html',
  styleUrls: ['./task-modal.component.scss']
})
export class TaskModalComponent
  extends SimpleModalComponent<TaskModalParameters, void>
  implements OnInit {
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
  changingState: boolean;
  project: ProjectViewModel;
  workPackage: WorkPackageViewModel;
  allowedTypes: string;

  @ViewChild('labelMenu', { static: false }) labelMenu;
  @ViewChild('filePicker', { static: false }) filePicker;
  togglingWatch: boolean;
  togglingArchive: boolean;
  showSubTasks: boolean;
  constructor(
    private readonly socket: Socket,
    private readonly taskService: TaskService,
    private readonly projectService: ProjectService,
    readonly translateService: TranslateService,
    readonly usersService: UsersService,
    readonly modalService: ModalService,
    readonly filesService: FilesService,
    private readonly identityService: IdentityService,
    private readonly workPackageService: WorkPackageService,
  ) { super(); }

  ngOnInit() {
    this.filesService.attaching = this.filesService.attaching.filter((a) => {
      if (a.recordId !== this.id) { return true; }
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
    if (this.model) { return; }
    this.fetch();
  }
  clearInputFile(f) {
    if (f.value) {
      try {
        f.value = '';
      } catch (err) { }
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
    if (!target.files || !target.files.length) { return; }
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
        recordId: this.id
      });
    }
    this.clearInputFile(target);
    this.filesService.attaching = [...this.filesService.attaching, ...upload];
    this.filesService.attach(upload, this.id);
  }

  bind() {
    this.socket.on('push-notification', (notification: any) => {
      switch (notification.type) {
        case ActivityType.WorkPackageTaskEdit:
          if (this.id === notification.data.id) {
            delete notification.data.members;
            delete notification.data.labels;
            Object.assign(this.model, notification.data);
          }
          break;
        case ActivityType.WorkPackageTaskComment:
          if (this.id === notification.data.taskId) {
            this.model.comments.unshift(notification.data);
          }
          break;
        case ActivityType.WorkPackageTaskLabelAdd:
          if (this.id === notification.data.taskId) {
            const already = this.model.labels.find(i => i.id === notification.data.labelId);
            if (!already) { this.model.labels.push(notification.data); }
          }
          break;
        case ActivityType.WorkPackageTaskLabelRemove:
          if (this.id === notification.data.taskId) {
            this.model.labels = this.model.labels.filter(i => i.labelId !== notification.data.labelId);
          }
          break;
        case ActivityType.WorkPackageTaskMemberAdd:
          if (this.id === notification.data.taskId) {
            const already = this.model.members.find(i => i.recordId === notification.data.recordId);
            if (!already) { this.model.members.push(notification.data); }
          }
          break;
        case ActivityType.WorkPackageTaskMemberRemove:
          if (this.id === notification.data.taskId) {
            this.model.members = this.model.members.filter(i => i.recordId !== notification.data.recordId);
          }
          break;
        case ActivityType.WorkPackageTaskAttachmentAdd:
          if (this.id === notification.data.taskId) {
            this.model.attachments.unshift(notification.data);
          }
          break;
        case ActivityType.WorkPackageTaskAttachmentRemove:
          if (this.id === notification.data.taskId) {
            this.model.attachments = this.model.attachments.filter(a => a.id !== notification.data.id);
          }
          break;
        case ActivityType.WorkPackageTaskAttachmentRename:
          if (this.id === notification.data.taskId) {
            const found = this.model.attachments.find(a => a.id === notification.data.id);
            if (found) {
              Object.assign(found, notification.data);
            }
          }
          break;
        case ActivityType.WorkPackageTaskAttachmentCover:
          if (this.id === notification.data.taskId) {
            const found = this.model.attachments.find(a => a.id === notification.data.id);
            if (found) {
              found.isCover = notification.data.isCover;
              this.model.coverId = notification.data.isCover ? notification.data.path : '';
            }
          }
          break;
      }
    });
  }

  async fetch() {
    this.waiting = true;
    const op = await this.taskService.fetch(this.id);
    if (op.status !== OperationResultStatus.Success) {
      this.close();
      return;
    }
    this.waiting = false;
    this.model = op.data;
    this.permission = this.workPackageService.getPermission(op.data.projectId, op.data.packageId);
    this.postProcess();
  }

  switchMode(mode: ViewMode) {
    // this.mode = mode;
  }

  async sendComment() {
    this.commenting = true;
    const op = await this.taskService.comment(this.id, {
      message: this.comment,
      private: false
    });
    this.commenting = false;
    if (op.status !== OperationResultStatus.Success) {
      // TODO: handle error
      return ;
    }
    this.comment = '';
  }

  getBackgroundUrl(coverId: string): string {
    if (!coverId) { return ''; }
    const attachment = this.model.attachments.find(a => a.id === coverId);
    if (!attachment) { return ''; }
    return attachment.path;
  }

  private postProcess() {
    const permission = this.project.members.find(m => m.recordId === this.identityService.identity.userId);
    this.permission = permission ? permission.access : AccessType.Visitor;
    this.model.comments.forEach(c => {
      c.member = this.project.members.find(m => m.recordId === c.userId).member;
    });
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
    if (!title) { return; }
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
    if (!title) { return; }
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
    const op = await this.taskService.changeState(this.id, {state});
    this.changingState = false;
    if (op.status !== OperationResultStatus.Success) {
      // TODO: handle error
    }
  }

  toggleMember(member: ProjectMemberViewModel) {
    if (member.waiting) {return;  }
    if (this.model.members.findIndex(i => i.recordId === member.recordId) === -1) {
      this.taskService.addMember(this.id, {
        isGroup: member.isGroup,
        recordId: member.recordId
      });
    } else {
      this.taskService.removeMember(this.id, member.recordId);
    }
  }

  toggleLabel(label: WorkPackageLabelViewModel) {
    if (label.waiting || label.editting) {return;  }
    if (this.model.labels.findIndex(i => i.labelId === label.id) === -1) {
      this.taskService.addLabel(this.id, label.id);
    } else {
      this.taskService.removeLabel(this.id, label.id);
    }
  }

  isMemberSelected(member: ProjectMemberViewModel): boolean {
    return this.model.members.findIndex(m => m.recordId === member.recordId) !== -1;
  }

  isLabelSelected(label: WorkPackageLabelViewModel) {
    return this.model.labels.findIndex(m => m.labelId === label.id) !== -1;
  }

  prepareUpload() {
    this.filePicker.nativeElement.click();
  }

  prepareChoose() {

  }

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
    attachment.tempName = this.filesService.getExtensionLessFileName(attachment.title);
    attachment.renaming = true;
    attachment.waiting = false;
  }

  async coverToggle(attachment: WorkPackageTaskAttachmentViewModel) {
    if (attachment.covering) { return; }
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
    const op = await this.taskService.renameAttachment(attachment.id, { title });
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
      [attachment.title]
    );
    this.modalService.confirm({
      title: 'REMOVE_ATTACHMENT',
      message: 'REMOVE_ATTACHMENT_CONFIRM',
      heading,
      actionLabel: 'REMOVE_ATTACHMENT',
      cancelLabel: 'CANCEL',
      action: async () => {
        return await this.taskService.removeAttachment(attachment.id);
      },
    }).subscribe(() => {});
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
      if (l.waiting) { return; }
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
      [label.title]
    );
    this.modalService.confirm({
      title: 'REMOVE_LABEL',
      message: 'REMOVE_LABEL_CONFIRM',
      heading,
      actionLabel: 'REMOVE_LABEL',
      cancelLabel: 'CANCEL',
      action: async () => {
        return await this.workPackageService.removeLabel(label.id);
      },
    }).subscribe(() => {});
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
  }

  prepareSubTask() {

  }
}
export enum ViewMode {
  Detail = 1,
  TimeSpent = 2,
  Related = 3,
  CustomField = 4,
  Activity = 5,
}
