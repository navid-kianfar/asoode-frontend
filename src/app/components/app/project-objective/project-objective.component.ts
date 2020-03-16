import { Component, Input, OnInit } from '@angular/core';
import {
  ProjectObjectiveViewModel,
  ProjectViewModel,
} from '../../../view-models/projects/project-types';
import { MockService } from '../../../services/mock.service';

@Component({
  selector: 'app-project-objective',
  templateUrl: './project-objective.component.html',
  styleUrls: ['./project-objective.component.scss'],
})
export class ProjectObjectiveComponent implements OnInit {
  @Input() model: ProjectViewModel;
  selected: ProjectObjectiveViewModel;
  constructor(readonly mockService: MockService) {}

  ngOnInit() {}
}
