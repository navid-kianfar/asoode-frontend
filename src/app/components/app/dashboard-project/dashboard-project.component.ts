import { Component, OnInit } from '@angular/core';
import {ProjectService} from '../../../services/projects/project.service';
import {MockService} from '../../../services/mock.service';

@Component({
  selector: 'app-dashboard-project',
  templateUrl: './dashboard-project.component.html',
  styleUrls: ['./dashboard-project.component.scss']
})
export class DashboardProjectComponent implements OnInit {

  constructor(
    // readonly projectService: ProjectService,
    readonly projectService: MockService,
  ) { }

  ngOnInit() {
  }

}
