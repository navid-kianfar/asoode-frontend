import { Component, OnInit } from '@angular/core';
import {ProjectViewModel} from '../../../view-models/projects/project-types';
import {MockService} from '../../../services/mock.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
})
export class ProjectComponent implements OnInit {
  project: ProjectViewModel;
  constructor(private readonly mockService: MockService) {}

  ngOnInit() {
    this.project = this.mockService.projects[0];
  }
}
