import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {WorkPackageListViewModel, WorkPackageViewModel,} from '../../../view-models/projects/project-types';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {WorkPackageService} from '../../../services/projects/work-package.service';
import {AccessType} from '../../../library/app/enums';

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
    // this.workPackageService.repositionList(id, { order: event.currentIndex + 1 });
  }

  cancelNewList() {
    this.expanded = false;
  }

  createNewList() {
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
}
