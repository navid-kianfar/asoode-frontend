import { Component, Input, OnInit } from '@angular/core';
import {ProjectViewModel, WorkPackageViewModel} from '../../../view-models/projects/project-types';
import { AccessType } from '../../../library/app/enums';

@Component({
  selector: 'app-work-package-calendar',
  templateUrl: './work-package-calendar.component.html',
  styleUrls: ['./work-package-calendar.component.scss'],
})
export class WorkPackageCalendarComponent implements OnInit {
  @Input() project: ProjectViewModel;
  @Input() model: WorkPackageViewModel;
  @Input() permission: AccessType;
  ViewMode = ViewMode;
  mode: ViewMode;
  beginDate: Date;
  endDate: Date;
  hours: number[];
  constructor() {}

  ngOnInit() {
    this.hours = Array(24).fill(0).map((e, i) => i + 1);
    this.mode = ViewMode.Day;
    this.beginDate = new Date();
    this.endDate = new Date();
    this.endDate.setDate(this.endDate.getDate() + 7);
  }
}
export enum ViewMode {
  Day = 1,
  Week = 2,
  Month = 3
}
