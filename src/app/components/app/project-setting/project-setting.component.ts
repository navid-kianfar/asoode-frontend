import { Component, Input, OnInit } from '@angular/core';
import { ProjectViewModel } from '../../../view-models/projects/project-types';

@Component({
  selector: 'app-project-setting',
  templateUrl: './project-setting.component.html',
  styleUrls: ['./project-setting.component.scss'],
})
export class ProjectSettingComponent implements OnInit {
  @Input() model: ProjectViewModel;
  constructor() {}

  ngOnInit() {}
}
