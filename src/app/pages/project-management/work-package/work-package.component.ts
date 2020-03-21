import { Component, OnInit } from '@angular/core';
import {
  ProjectViewModel,
  WorkPackageViewModel,
} from '../../../view-models/projects/project-types';
import { MockService } from '../../../services/mock.service';
import { ProjectService } from '../../../services/projects/project.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-work-package',
  templateUrl: './work-package.component.html',
  styleUrls: ['./work-package.component.scss'],
})
export class WorkPackageComponent implements OnInit {
  ViewMode = ViewMode;
  mode: ViewMode;
  project: ProjectViewModel;
  workPackage: WorkPackageViewModel;
  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly projectService: ProjectService,
  ) {}

  ngOnInit() {
    this.mode = ViewMode.Board;
    const id = this.activatedRoute.snapshot.params.id;
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.projectService.projects.length; i++) {
      this.workPackage = this.projectService.projects[i].workPackages.find(
        w => w.id === id,
      );
      if (this.workPackage) {
        this.project = this.projectService.projects[i];
        break;
      }
    }
    if (!this.workPackage) {
      this.router.navigateByUrl('dashboard');
      return;
    }
  }
}
export enum ViewMode {
  Board = 1,
  List = 2,
  TimeSpan = 3,
  Calendar = 4,
}
