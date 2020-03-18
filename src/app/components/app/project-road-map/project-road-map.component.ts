import { Component, Input, OnInit } from '@angular/core';
import {
  ProjectViewModel,
  SubProjectViewModel,
} from '../../../view-models/projects/project-types';

@Component({
  selector: 'app-project-road-map',
  templateUrl: './project-road-map.component.html',
  styleUrls: ['./project-road-map.component.scss'],
})
export class ProjectRoadMapComponent implements OnInit {
  @Input() model: ProjectViewModel;
  subProjects: SubProjectViewModel[];
  constructor() {}

  ngOnInit() {
    this.subProjects = this.model.subProjects.filter(s => !s.parentId);
  }
}
