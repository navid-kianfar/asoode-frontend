import {Component, Input, OnInit} from '@angular/core';
import {TaskService} from '../../../services/projects/task.service';
import {OperationResultStatus} from '../../../library/core/enums';
import {ActivityLogViewModel} from '../../../view-models/projects/project-types';
import {ActivityType} from '../../../library/app/enums';

@Component({
  selector: 'app-activity-log',
  templateUrl: './activity-log.component.html',
  styleUrls: ['./activity-log.component.scss']
})
export class ActivityLogComponent implements OnInit {

  @Input() taskId: string;
  waiting: boolean;
  model: ActivityLogViewModel[];
  constructor(private readonly taskService: TaskService) { }

  ngOnInit() {
    this.fetch();
  }

  async fetch() {
    this.waiting = true;
    const op = await this.taskService.logs(this.taskId);
    this.waiting = false;
    if (op.status !== OperationResultStatus.Success) {
      // TODO: handle error
      return;
    }
    this.model = op.data;
  }

  getText(log: ActivityLogViewModel): string {
    if (log.type === ActivityType.None) {
      return log.description;
    }
    return log.description;
  }
}
