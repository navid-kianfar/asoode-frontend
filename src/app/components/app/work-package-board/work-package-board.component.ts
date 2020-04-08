import {Component, Input, OnInit} from '@angular/core';
import {WorkPackageListViewModel, WorkPackageViewModel,} from '../../../view-models/projects/project-types';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {WorkPackageService} from '../../../services/projects/work-package.service';
import {AccessType} from '../../../library/app/enums';
import {OperationResultStatus} from '../../../library/core/enums';

@Component({
  selector: 'app-work-package-board',
  templateUrl: './work-package-board.component.html',
  styleUrls: ['./work-package-board.component.scss'],
})
export class WorkPackageBoardComponent implements OnInit {
  @Input() model: WorkPackageViewModel;
  @Input() permission: AccessType;
  AccessType = AccessType;
  expanded: boolean;
  dragDelay: number;
  creatingNewList: boolean;
  newListName: string;
  constructor(private readonly workPackageService: WorkPackageService) {}

  ngOnInit() {
    this.dragDelay = 0;
  }

  drop(event: CdkDragDrop<any[]>) {
    const id = event.item.data.id;
    moveItemInArray(
      event.container.data,
      event.previousIndex,
      event.currentIndex,
    );
    this.workPackageService.repositionList(id, { order: event.currentIndex + 1 });
  }

  cancelNewList() {
    this.expanded = false;
  }

  prepareNewList() {
    this.expanded = true;
  }

  createNewTask(list: WorkPackageListViewModel) {
    this.model.lists.forEach(l => l.expanded = false);
    list.expanded = true;
  }
  cancelNewTask(list: WorkPackageListViewModel) {
    list.expanded = false;
  }

  changeSort(list: WorkPackageListViewModel) {

  }

  showChart(list: WorkPackageListViewModel) {

  }

  async createNewList() {
    const name = this.newListName.trim();
    if (!name) { return; }
    this.creatingNewList = true;
    const op = await this.workPackageService.createList(this.model.id, {title: name});
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
    const op = await this.workPackageService.renameList(list.id, {title: name});
    list.renameWaiting = false;
    if (op.status !== OperationResultStatus.Success) {
      // TODO: handle error
      return;
    }
    this.cancelRenameList(list);
  }
}
