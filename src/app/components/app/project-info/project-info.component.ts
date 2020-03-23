import { Component, Input, OnInit } from '@angular/core';
import { ProjectViewModel } from '../../../view-models/projects/project-types';
import { Router } from '@angular/router';
import { ProjectFilter } from '../../../library/app/enums';

@Component({
  selector: 'app-project-info',
  templateUrl: './project-info.component.html',
  styleUrls: ['./project-info.component.scss'],
})
export class ProjectInfoComponent implements OnInit {
  @Input() project: ProjectViewModel;
  @Input() template: boolean;

  constructor(private readonly router: Router) {}

  ngOnInit() {}

  openProject() {
    if (this.project.complex) {
      this.router.navigateByUrl('project/' + this.project.id);
      return;
    }
    this.router.navigateByUrl(
      'work-package/' + this.project.workPackages[0].id,
    );
  }
}
