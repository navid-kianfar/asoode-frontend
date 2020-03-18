import { Component, Input, OnInit } from '@angular/core';
import {ProjectSeasonViewModel, ProjectViewModel} from '../../../view-models/projects/project-types';

@Component({
  selector: 'app-project-season',
  templateUrl: './project-season.component.html',
  styleUrls: ['./project-season.component.scss'],
})
export class ProjectSeasonComponent implements OnInit {
  @Input() model: ProjectViewModel;
  selected: ProjectSeasonViewModel;
  constructor() {}

  ngOnInit() {}
}
