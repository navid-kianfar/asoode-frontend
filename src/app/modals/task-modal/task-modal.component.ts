import {Component, OnInit} from '@angular/core';
import {SimpleModalComponent} from 'ngx-simple-modal';
import {TaskModalParameters} from '../../view-models/core/modal-types';
import {WorkPackageTaskViewModel} from '../../view-models/projects/project-types';
import {TaskService} from '../../services/projects/task.service';
import {OperationResultStatus} from '../../library/core/enums';
import { environment } from '../../../environments/environment';

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

  constructor(private readonly taskService: TaskService) { super(); }

  ngOnInit() {
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
}
export enum ViewMode {
  Detail = 1,
  TimeSpent = 2,
  Related = 3,
  CustomField = 4,
  Activity = 5,
}
