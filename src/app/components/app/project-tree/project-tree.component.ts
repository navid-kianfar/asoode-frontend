import { Component, Input, OnInit } from '@angular/core';
import {
  ProjectViewModel,
  SubProjectViewModel,
  WorkPackageViewModel,
} from '../../../view-models/projects/project-types';

@Component({
  selector: 'app-project-tree',
  templateUrl: './project-tree.component.html',
  styleUrls: ['./project-tree.component.scss'],
})
export class ProjectTreeComponent implements OnInit {
  @Input() model: ProjectViewModel;
  subProjects: SubProjectViewModel[];
  workPackages: WorkPackageViewModel[];
  constructor() {}

  ngOnInit() {
    this.workPackages = this.model.workPackages.filter(w => !w.subProjectId);
    this.subProjects = this.model.subProjects.filter(s => !s.parentId);
  }
}
