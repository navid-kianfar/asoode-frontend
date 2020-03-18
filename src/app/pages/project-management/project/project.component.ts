import { Component, OnInit } from '@angular/core';
import { ProjectViewModel } from '../../../view-models/projects/project-types';
import { MockService } from '../../../services/mock.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
})
export class ProjectComponent implements OnInit {
  ViewMode = ViewMode;
  mode: ViewMode;
  project: ProjectViewModel;
  constructor(private readonly mockService: MockService) {}

  ngOnInit() {
    this.mode = ViewMode.Tree;
    this.project = this.mockService.projects[0];
  }
}
export enum ViewMode {
  RoadMap = 1,
  Tree = 2,
  Seasons = 3,
  Objectives = 4,
  Settings = 5,
}
