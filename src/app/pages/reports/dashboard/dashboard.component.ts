import { Component, OnInit } from '@angular/core';
import { GroupService } from '../../../services/groups/group.service';
import { ProjectService } from '../../../services/projects/project.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  activitiesWaiting: boolean;
  projectsWaiting: boolean;
  constructor(
    readonly groupService: GroupService,
    readonly projectService: ProjectService,
  ) {}

  ngOnInit() {}
}
