import { Component, Input, OnInit } from '@angular/core';
import { ProjectViewModel } from '../../../view-models/projects/project-types';
import {Router} from '@angular/router';

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
    this.router.navigateByUrl(this.project.complex ? 'project' : 'work-package');
  }
}
