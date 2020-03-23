import { Component, OnInit } from '@angular/core';
import { GroupService } from '../../../services/groups/group.service';
import { ProjectService } from '../../../services/projects/project.service';
import {ProjectFilter} from '../../../library/app/enums';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  activitiesWaiting: boolean;
  projectsWaiting: boolean;
  filter: ProjectFilter;
  constructor(
    readonly groupService: GroupService,
    readonly projectService: ProjectService,
  ) {}

  ngOnInit() {
    this.filter = ProjectFilter.All;
  }
}
