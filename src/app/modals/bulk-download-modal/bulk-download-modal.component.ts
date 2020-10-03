import { Component, OnInit } from '@angular/core';
import {SimpleModalComponent} from 'ngx-simple-modal';
import {TaskModalParameters} from '../../view-models/core/modal-types';
import {WorkPackageTaskViewModel} from '../../view-models/projects/project-types';
import {ListViewModel} from '../../view-models/core/list-types';
import {TaskService} from '../../services/projects/task.service';
import {NotificationService} from '../../services/core/notification.service';

@Component({
  selector: 'app-bulk-download-modal',
  templateUrl: './bulk-download-modal.component.html',
  styleUrls: ['./bulk-download-modal.component.scss']
})
export class BulkDownloadModalComponent
  extends SimpleModalComponent<{ tasks: WorkPackageTaskViewModel[], id: string }, void>
  implements OnInit {
  tasks: WorkPackageTaskViewModel[];
  id: string;
  actionWaiting: any;

  model: ListViewModel[];

  constructor(
    private readonly taskService: TaskService,
    private readonly notificationService: NotificationService,
  ) { super(); }

  ngOnInit() {
    this.model = this.tasks.map(t => {
      return {
        text: t.title,
        value: t.id
      } as ListViewModel;
    });
  }

  onCancel($event: MouseEvent) {
    if (this.actionWaiting) { return; }
    this.close();
  }

  async onAction($event: MouseEvent) {
    const picked = this.model.filter(i => i.selected).map(m => m.value);
    if (!picked.length) {
      this.notificationService.error('PICK_ONE');
      return;
    }
    this.taskService.bulkDownload(this.id, picked);
    this.close();
  }
}
