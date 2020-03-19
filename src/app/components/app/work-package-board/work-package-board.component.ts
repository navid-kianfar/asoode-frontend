import { Component, OnInit } from '@angular/core';
import {WorkPackageListViewModel, WorkPackageViewModel} from '../../../view-models/projects/project-types';
import {MockService} from '../../../services/mock.service';

@Component({
  selector: 'app-work-package-board',
  templateUrl: './work-package-board.component.html',
  styleUrls: ['./work-package-board.component.scss'],
})
export class WorkPackageBoardComponent implements OnInit {
  workPackage: WorkPackageViewModel;
  expanded: boolean;
  constructor(
    private readonly mockService: MockService
  ) {}

  ngOnInit() {
    this.workPackage = this.mockService.projects[1].workPackages[0];
  }



  cancelNewList() {
    this.expanded = false;
  }

  createNewList() {
    this.expanded = true;
  }

  createNewTask(list: WorkPackageListViewModel) {
    list.expanded = true;
  }
  cancelNewTask(list: WorkPackageListViewModel) {
    list.expanded = false;
  }
}
