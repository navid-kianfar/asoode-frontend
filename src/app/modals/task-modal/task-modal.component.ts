import {Component, OnInit} from '@angular/core';
import {SimpleModalComponent} from 'ngx-simple-modal';
import {TaskModalParameters} from '../../view-models/core/modal-types';
import {
  ProjectMemberViewModel,
  ProjectViewModel, WorkPackageLabelViewModel,
  WorkPackageTaskViewModel,
  WorkPackageViewModel
} from '../../view-models/projects/project-types';
import {TaskService} from '../../services/projects/task.service';
import {OperationResultStatus} from '../../library/core/enums';
import {environment} from '../../../environments/environment';
import {ProjectService} from '../../services/projects/project.service';
import {AccessType, ActivityType, WorkPackageTaskState} from '../../library/app/enums';
import {IdentityService} from '../../services/auth/identity.service';
import {moveItemInArray} from '@angular/cdk/drag-drop';
import {Socket} from 'ngx-socket-io';

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

  constructor(
    private readonly socket: Socket,
    private readonly taskService: TaskService,
    private readonly projectService: ProjectService,
    private readonly identityService: IdentityService,
  ) { super(); }

  ngOnInit() {
    this.allStates = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    this.mode = ViewMode.Detail;
    this.bind();
    if (this.model) { return; }
    this.fetch();
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
    return `${environment.api_endpoint}/attachments/${coverId}/download`;
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
    if (label.waiting) {return;  }
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
}
export enum ViewMode {
  Detail = 1,
  TimeSpent = 2,
  Related = 3,
  CustomField = 4,
  Activity = 5,
}
