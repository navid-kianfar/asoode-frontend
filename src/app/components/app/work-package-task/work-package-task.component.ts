import {Component, Input, OnInit} from '@angular/core';
import {WorkPackageListViewModel, WorkPackageTaskViewModel, WorkPackageViewModel} from '../../../view-models/projects/project-types';

@Component({
  selector: 'app-work-package-task',
  templateUrl: './work-package-task.component.html',
  styleUrls: ['./work-package-task.component.scss']
})
export class WorkPackageTaskComponent implements OnInit {
  @Input() workPackage: WorkPackageViewModel;
  @Input() model: WorkPackageTaskViewModel;
  @Input() list: WorkPackageListViewModel;
  date: Date = new Date();
  constructor() { }

  ngOnInit() {
  }

}
