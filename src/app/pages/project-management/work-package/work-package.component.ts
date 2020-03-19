import { Component, OnInit } from '@angular/core';
import {ProjectViewModel, WorkPackageViewModel} from '../../../view-models/projects/project-types';
import {MockService} from '../../../services/mock.service';

@Component({
  selector: 'app-work-package',
  templateUrl: './work-package.component.html',
  styleUrls: ['./work-package.component.scss'],
})
export class WorkPackageComponent implements OnInit {
  project: ProjectViewModel;
  workPackage: WorkPackageViewModel;
  constructor(private readonly mockService: MockService) {}

  ngOnInit() {
    this.project = this.mockService.projects[1];
    this.workPackage = this.project.workPackages[0];
  }
}
