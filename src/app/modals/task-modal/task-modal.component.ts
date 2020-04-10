import {Component, OnInit} from '@angular/core';
import {SimpleModalComponent} from 'ngx-simple-modal';
import {TaskModalParameters} from '../../view-models/core/modal-types';
import {WorkPackageTaskViewModel} from '../../view-models/projects/project-types';
import {TaskService} from '../../services/projects/task.service';
import {OperationResultStatus} from '../../library/core/enums';
import {environment} from '../../../environments/environment';
import {ProjectService} from '../../services/projects/project.service';

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

  constructor(
    private readonly taskService: TaskService,
    private readonly projectService: ProjectService,
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
    this.mode = mode;
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
    const project = this.projectService.projects.find(p => p.id === this.model.projectId);
    this.model.comments.forEach(c => {
      c.member = project.members.find(m => m.recordId === c.userId).member;
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
}
export enum ViewMode {
  Detail = 1,
  TimeSpent = 2,
  Related = 3,
  CustomField = 4,
  Activity = 5,
}
