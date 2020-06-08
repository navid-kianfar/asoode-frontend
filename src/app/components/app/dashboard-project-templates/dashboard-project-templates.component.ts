import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../../services/projects/project.service';
import {ProjectViewModel} from '../../../view-models/projects/project-types';

@Component({
  selector: 'app-dashboard-project-templates',
  templateUrl: './dashboard-project-templates.component.html',
  styleUrls: ['./dashboard-project-templates.component.scss'],
})
export class DashboardProjectTemplatesComponent implements OnInit {
  projects: ProjectViewModel[] = [];

  constructor(
    readonly projectService: ProjectService,
  ) {}

  ngOnInit() { }
}
