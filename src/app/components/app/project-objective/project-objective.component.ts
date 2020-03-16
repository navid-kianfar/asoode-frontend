import {Component, Input, OnInit} from '@angular/core';
import {ProjectViewModel} from '../../../view-models/projects/project-types';

@Component({
  selector: 'app-project-objective',
  templateUrl: './project-objective.component.html',
  styleUrls: ['./project-objective.component.scss']
})
export class ProjectObjectiveComponent implements OnInit {
  @Input() model: ProjectViewModel;
  constructor() { }

  ngOnInit() {
  }

}
