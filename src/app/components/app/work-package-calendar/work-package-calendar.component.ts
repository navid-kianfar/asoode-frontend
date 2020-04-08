import { Component, Input, OnInit } from '@angular/core';
import { WorkPackageViewModel } from '../../../view-models/projects/project-types';
import {AccessType} from '../../../library/app/enums';

@Component({
  selector: 'app-work-package-calendar',
  templateUrl: './work-package-calendar.component.html',
  styleUrls: ['./work-package-calendar.component.scss'],
})
export class WorkPackageCalendarComponent implements OnInit {
  @Input() model: WorkPackageViewModel;
  @Input() permission: AccessType;
  constructor() {}

  ngOnInit() {}
}
