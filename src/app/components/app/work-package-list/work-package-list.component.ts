import { Component, Input, OnInit } from '@angular/core';
import { WorkPackageViewModel } from '../../../view-models/projects/project-types';

@Component({
  selector: 'app-work-package-list',
  templateUrl: './work-package-list.component.html',
  styleUrls: ['./work-package-list.component.scss'],
})
export class WorkPackageListComponent implements OnInit {
  @Input() model: WorkPackageViewModel;
  constructor() {}

  ngOnInit() {}
}
