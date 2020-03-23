import { Component, Input, OnInit } from '@angular/core';
import {
  ProjectSeasonViewModel,
  ProjectViewModel,
} from '../../../view-models/projects/project-types';
import { AccessType } from '../../../library/app/enums';

@Component({
  selector: 'app-project-season',
  templateUrl: './project-season.component.html',
  styleUrls: ['./project-season.component.scss'],
})
export class ProjectSeasonComponent implements OnInit {
  @Input() model: ProjectViewModel;
  @Input() permission: AccessType;
  selected: ProjectSeasonViewModel;
  constructor() {}

  ngOnInit() {}
}
