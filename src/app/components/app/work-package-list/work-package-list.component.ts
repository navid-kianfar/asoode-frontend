import { Component, Input, OnInit } from '@angular/core';
import { WorkPackageViewModel } from '../../../view-models/projects/project-types';
import {AccessType} from '../../../library/app/enums';

@Component({
  selector: 'app-work-package-list',
  templateUrl: './work-package-list.component.html',
  styleUrls: ['./work-package-list.component.scss'],
})
export class WorkPackageListComponent implements OnInit {
  @Input() model: WorkPackageViewModel;
  @Input() permission: AccessType;
  constructor() {}

  ngOnInit() {}
}
