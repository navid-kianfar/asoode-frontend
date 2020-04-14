import { Component, Input, OnInit } from '@angular/core';
import { ProjectService } from '../../../services/projects/project.service';
import { MockService } from '../../../services/general/mock.service';
import { ProjectFilter } from '../../../library/app/enums';

@Component({
  selector: 'app-dashboard-project',
  templateUrl: './dashboard-project.component.html',
  styleUrls: ['./dashboard-project.component.scss'],
})
export class DashboardProjectComponent implements OnInit {
  @Input() filter: ProjectFilter;
  ProjectFilter = ProjectFilter;
  constructor(readonly projectService: ProjectService) {}

  ngOnInit() {}
}
