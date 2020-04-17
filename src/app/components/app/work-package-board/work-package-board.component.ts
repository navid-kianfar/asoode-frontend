import { Component, Input, OnInit } from '@angular/core';
import {
  ProjectViewModel,
  WorkPackageListViewModel,
  WorkPackageTaskViewModel,
  WorkPackageViewModel,
} from '../../../view-models/projects/project-types';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { WorkPackageService } from '../../../services/projects/work-package.service';
import { AccessType } from '../../../library/app/enums';
import { OperationResultStatus } from '../../../library/core/enums';
import { TaskService } from '../../../services/projects/task.service';
import { TaskModalComponent } from '../../../modals/task-modal/task-modal.component';
import { ModalService } from '../../../services/core/modal.service';

@Component({
  selector: 'app-work-package-board',
  templateUrl: './work-package-board.component.html',
  styleUrls: ['./work-package-board.component.scss'],
})
export class WorkPackageBoardComponent implements OnInit {
  @Input() project: ProjectViewModel;
  @Input() model: WorkPackageViewModel;
  @Input() permission: AccessType;
  AccessType = AccessType;
  expanded: boolean;
  dragDelay: number;
  creatingNewList: boolean;
  creatingNewTask: boolean;
  newListName: string;
  newTaskTitle: string;
  constructor(
    private readonly workPackageService: WorkPackageService,
    private readonly taskService: TaskService,
    private readonly modalService: ModalService,
  ) {}

  ngOnInit() {
    this.dragDelay = 0;
  }

  cancelNewList() {
    this.expanded = false;
  }

  prepareNewList() {
    this.expanded = true;
  }

  prepareNewTask(list: WorkPackageListViewModel) {
    this.model.lists.forEach(l => (l.expanded = false));
    list.expanded = true;
    this.newTaskTitle = '';
  }
  cancelNewTask(list: WorkPackageListViewModel) {
    list.expanded = false;
  }

  changeSort(list: WorkPackageListViewModel) {}

  showChart(list: WorkPackageListViewModel) {}

  async createNewList() {
    const name = this.newListName.trim();
    if (!name) {
      return;
    }
    this.creatingNewList = true;
    const op = await this.workPackageService.createList(this.model.id, {
      title: name,
    });
    this.creatingNewList = false;
    if (op.status !== OperationResultStatus.Success) {
      // TODO: handle error
      return;
    }
    this.newListName = '';
    this.expanded = false;
  }

  prepareRenameTask(list: WorkPackageListViewModel) {
    list.expanded = false;
    list.renaming = true;
    list.tempName = list.title;
  }

  cancelRenameList(list: WorkPackageListViewModel) {
    list.expanded = false;
    list.renaming = false;
  }

  async renameList(list: WorkPackageListViewModel) {
    const name = list.tempName.trim();
    if (!name || name === list.title) {
      this.cancelRenameList(list);
      return;
    }
    list.renameWaiting = true;
    const op = await this.workPackageService.renameList(list.id, {
      title: name,
    });
    list.renameWaiting = false;
    if (op.status !== OperationResultStatus.Success) {
      // TODO: handle error
      return;
    }
    this.cancelRenameList(list);
  }

  async createNewTask(list: WorkPackageListViewModel) {
    const name = this.newTaskTitle.trim();
    if (!name) {
      return;
    }
    this.creatingNewTask = true;
    const op = await this.taskService.create(this.model.id, {
      listId: list.id,
      title: name,
      parentId: undefined,
    });
    this.creatingNewTask = false;
    if (op.status !== OperationResultStatus.Success) {
      // TODO: handle error
      return;
    }
    this.newTaskTitle = '';
    list.expanded = false;
  }

  getConnectedList() {
    return this.model.lists.map(l => l.id);
  }

  dropTask(event: CdkDragDrop<WorkPackageTaskViewModel[], any>, listId) {
    const id = event.item.data.id;
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      this.taskService.reposition(id, { order: event.currentIndex + 1 });
    } else {
      event.item.data.listId = listId;
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      this.taskService.move(id, {
        listId,
        order: event.currentIndex + 1,
      });
    }
  }

  drop(event: CdkDragDrop<WorkPackageListViewModel[]>) {
    const id = event.item.data.id;
    moveItemInArray(
      event.container.data,
      event.previousIndex,
      event.currentIndex,
    );
    event.item.data.order = event.currentIndex + 1;
    this.workPackageService.repositionList(id, {
      order: event.item.data.order,
    });
  }

  openTask(task: WorkPackageTaskViewModel) {
    this.modalService
      .show(TaskModalComponent, {
        id: task.id,
        project: this.project,
        workPackage: this.model,
      })
      .subscribe(() => {});
  }
}
