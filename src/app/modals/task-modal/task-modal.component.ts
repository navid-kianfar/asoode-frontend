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
import {AccessType, WorkPackageTaskState} from '../../library/app/enums';
import {IdentityService} from '../../services/auth/identity.service';

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
  selectedMembers: string[];
  selectedLabels: string[];

  constructor(
    private readonly taskService: TaskService,
    private readonly projectService: ProjectService,
    private readonly identityService: IdentityService,
  ) { super(); }

  ngOnInit() {
    this.allStates = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    this.mode = ViewMode.Detail;
    if (this.model) { return; }
    this.fetch();
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
    this.selectedMembers = this.model.members.map(m => m.userId);
    this.selectedLabels = this.model.labels.map(m => m.id);
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
    if (this.selectedMembers.indexOf(member.recordId) === -1) {
      this.selectedMembers.push(member.recordId);
      this.taskService.addMember(this.id, {
        isGroup: member.isGroup,
        recordId: member.recordId
      });
    } else {
      this.selectedMembers = this.selectedMembers.filter(i => i !== member.recordId);
      this.taskService.removeMember(member.id);
    }
  }

  toggleLabel(label: WorkPackageLabelViewModel) {
    if (label.waiting) {return;  }
    if (this.selectedLabels.indexOf(label.id) === -1) {
      this.selectedLabels.push(label.id);
      this.taskService.addLabel(this.id, label.id);
    } else {
      this.selectedLabels = this.selectedLabels.filter(i => i !== label.id);
      this.taskService.removeLabel(label.id);
    }
  }
}
export enum ViewMode {
  Detail = 1,
  TimeSpent = 2,
  Related = 3,
  CustomField = 4,
  Activity = 5,
}
