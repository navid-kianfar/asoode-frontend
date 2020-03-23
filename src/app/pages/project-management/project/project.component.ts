import { Component, OnInit } from '@angular/core';
import { ProjectViewModel } from '../../../view-models/projects/project-types';
import { MockService } from '../../../services/mock.service';
import { ProjectService } from '../../../services/projects/project.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AccessType } from '../../../library/app/enums';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
})
export class ProjectComponent implements OnInit {
  ViewMode = ViewMode;
  mode: ViewMode;
  project: ProjectViewModel;
  permission: AccessType;
  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly projectService: ProjectService,
  ) {}

  ngOnInit() {
    this.mode = ViewMode.RoadMap;
    const id = this.activatedRoute.snapshot.params.id;
    this.project = this.projectService.projects.find(g => g.id === id);
    if (!this.project) {
      this.router.navigateByUrl('dashboard');
      return;
    }
    this.permission = this.projectService.getPermission(this.project);
  }
}
export enum ViewMode {
  RoadMap = 1,
  Tree = 2,
  Seasons = 3,
  Objectives = 4,
  Settings = 5,
}
