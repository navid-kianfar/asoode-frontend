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
import { WorkPackageService } from '../../services/work-package.service';
import {
  AccessType,
  SortType,
} from '../../../shared/lib/enums/enums';
import { TaskService } from '../../../task/services/task.service';
import { ModalService } from '../../../shared/services/modal.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { CultureService } from '../../../shared/services/culture.service';
import { PromptModalParameters } from '../../../view-models/core/modal-types';
import { FormService } from '../../../shared/services/form.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { StringHelpers } from '../../../shared/helpers/string.helpers';
import { TranslateService } from '../../../shared/services/translate.service';
import { WorkPackageTaskVoteNecessity } from '../../../shared/lib/enums/workpackage';
import { OperationResultStatus } from '../../../shared/lib/enums/operation-result-status';

@Component({
  selector: 'app-work-package-board',
  templateUrl: './work-package-board.component.html',
  styleUrls: ['./work-package-board.component.scss'],
})
export class WorkPackageBoardComponent implements OnInit {
  @Input() project: ProjectViewModel;
  @Input() model: WorkPackageViewModel;
  @Input() permission: AccessType;
  @Input() embed: boolean;
  AccessType = AccessType;
  SortType = SortType;
  WorkPackageTaskVoteNecessity = WorkPackageTaskVoteNecessity;
  expanded: boolean;
  dragDelay: number;
  creatingNewList: boolean;
  creatingNewTask: boolean;
  newListName: string;
  newTaskTitle: string;
  newTaskCounter: number;
  noDrag: boolean;
  constructor(
    private readonly workPackageService: WorkPackageService,
    private readonly taskService: TaskService,
    private readonly modalService: ModalService,
    private readonly formService: FormService,
    private readonly notificationService: NotificationService,
    private readonly translateService: TranslateService,
    private readonly deviceDetectorService: DeviceDetectorService,
    readonly cultureService: CultureService,
  ) {}

  ngOnInit() {
    this.dragDelay =
      this.deviceDetectorService.isTablet() ||
      this.deviceDetectorService.isMobile()
        ? 1000
        : 0;
    this.noDrag = this.deviceDetectorService.os.toLowerCase() === 'ios';
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
    this.newTaskCounter = 1;
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
    list.waiting = true;
    const op = await this.workPackageService.renameList(list.id, {
      title: name,
    });
    list.waiting = false;
    if (op.status !== OperationResultStatus.Success) {
      // TODO: handle error
      return;
    }
    this.cancelRenameList(list);
  }

  async createNewTask(list: WorkPackageListViewModel) {
    const name = (list.newTaskTitle || this.newTaskTitle).trim();
    if (!name) {
      return;
    }
    this.creatingNewTask = true;
    const op = await this.taskService.create(this.model.id, {
      listId: list.id,
      title: name,
      count: this.newTaskCounter,
      parentId: undefined,
    });
    this.creatingNewTask = false;
    if (op.status !== OperationResultStatus.Success) {
      // TODO: handle error
      return;
    }
    list.newTaskTitle = this.newTaskTitle = '';
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

  async openTask(task: WorkPackageTaskViewModel) {
    // await this.modalService
    //   .show(TaskModalComponent, {
    //     id: task.id,
    //     project: this.project,
    //     workPackage: this.model,
    //   });
  }

  cloneList(list: WorkPackageListViewModel) {
    // this.modalService
    //   .show(PromptComponent, {
    //     icon: 'ikon-copy3',
    //     title: 'CLONE_LIST',
    //     form: [
    //       {
    //         elements: [
    //           this.formService.createInput({
    //             config: { field: 'title' },
    //             params: { model: list.title + ' 2', placeHolder: 'TITLE' },
    //             validation: {
    //               required: {
    //                 value: true,
    //                 message: 'TITLE_REQUIRED',
    //               },
    //             },
    //           }),
    //         ],
    //       },
    //     ],
    //     action: async (params, form) => {
    //       const op = await this.workPackageService.cloneList(list.id, params);
    //       if (op.status !== OperationResultStatus.Success) {
    //         // TODO: handle error
    //         return;
    //       }
    //       this.notificationService.success('GENERAL_SUCCESS');
    //     },
    //     actionLabel: 'CLONE_LIST',
    //     actionColor: 'primary',
    //   } as PromptModalParameters)
    //   .subscribe(() => {});
  }

  archiveList(list: WorkPackageListViewModel) {
    const heading = StringHelpers.format(
      this.translateService.fromKey('ARCHIVE_LIST_CONFIRM_HEADING'),
      [list.title],
    );
    // this.modalService
    //   .confirm({
    //     title: 'ARCHIVE_LIST',
    //     message: 'ARCHIVE_LIST_CONFIRM',
    //     heading,
    //     actionLabel: 'ARCHIVE_LIST',
    //     cancelLabel: 'CANCEL',
    //     action: async () => {
    //       list.waiting = true;
    //       const op = await this.workPackageService.archiveList(list.id);
    //       list.waiting = false;
    //       if (op.status !== OperationResultStatus.Success) {
    //         // TODO: handle error
    //         return;
    //       }
    //     },
    //   })
    //   .subscribe(() => {});
  }

  archiveListTasks(list: WorkPackageListViewModel) {
    const heading = StringHelpers.format(
      this.translateService.fromKey('ARCHIVE_TASKS_CONFIRM_HEADING'),
      [list.title],
    );
    // this.modalService
    //   .confirm({
    //     title: 'ARCHIVE_TASKS',
    //     message: 'ARCHIVE_TASKS_CONFIRM',
    //     heading,
    //     actionLabel: 'ARCHIVE_TASKS',
    //     cancelLabel: 'CANCEL',
    //     action: async () => {
    //       list.waiting = true;
    //       const op = await this.workPackageService.archiveListTasks(list.id);
    //       list.waiting = false;
    //       if (op.status !== OperationResultStatus.Success) {
    //         // TODO: handle error
    //         return;
    //       }
    //     },
    //   })
    //   .subscribe(() => {});
  }

  clearList(list: WorkPackageListViewModel) {
    const heading = StringHelpers.format(
      this.translateService.fromKey('CLEAR_TASKS_CONFIRM_HEADING'),
      [list.title],
    );
    // this.modalService
    //   .confirm({
    //     title: 'CLEAR_TASKS',
    //     message: 'CLEAR_TASKS_CONFIRM',
    //     heading,
    //     actionLabel: 'CLEAR_TASKS',
    //     cancelLabel: 'CANCEL',
    //     action: async () => {
    //       list.waiting = true;
    //       const op = await this.workPackageService.clearListTasks(list.id);
    //       list.waiting = false;
    //       if (op.status !== OperationResultStatus.Success) {
    //         // TODO: handle error
    //         return;
    //       }
    //     },
    //   })
    //   .subscribe(() => {});
  }

  isAdminOrHasPermission(permission: boolean) {
    return (
      this.permission === AccessType.Owner ||
      this.permission === AccessType.Admin ||
      (this.permission !== AccessType.Visitor && permission)
    );
  }
}
