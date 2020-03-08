import { Component, OnInit } from '@angular/core';
import { MockService } from '../../../services/mock.service';
import { ProjectService } from '../../../services/projects/project.service';

@Component({
  selector: 'app-dashboard-project-templates',
  templateUrl: './dashboard-project-templates.component.html',
  styleUrls: ['./dashboard-project-templates.component.scss'],
})
export class DashboardProjectTemplatesComponent implements OnInit {
  constructor(
    readonly projectService: ProjectService,
    readonly mockService: MockService,
  ) {}

  ngOnInit() {}
}
