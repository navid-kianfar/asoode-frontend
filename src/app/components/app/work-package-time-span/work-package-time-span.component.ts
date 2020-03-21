import {Component, Input, OnInit} from '@angular/core';
import {WorkPackageViewModel} from '../../../view-models/projects/project-types';

@Component({
  selector: 'app-work-package-time-span',
  templateUrl: './work-package-time-span.component.html',
  styleUrls: ['./work-package-time-span.component.scss'],
})
export class WorkPackageTimeSpanComponent implements OnInit {
  @Input() model: WorkPackageViewModel;
  constructor() {}

  ngOnInit() {}
}
