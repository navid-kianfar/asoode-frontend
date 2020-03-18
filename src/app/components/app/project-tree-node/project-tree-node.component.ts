import {Component, Input, OnInit} from '@angular/core';
import {ProjectViewModel, SubProjectViewModel, WorkPackageViewModel} from '../../../view-models/projects/project-types';

@Component({
  selector: 'app-project-tree-node',
  templateUrl: './project-tree-node.component.html',
  styleUrls: ['./project-tree-node.component.scss']
})
export class ProjectTreeNodeComponent implements OnInit {
  @Input() workPackage: WorkPackageViewModel;
  @Input() project: ProjectViewModel;
  @Input() subProject: SubProjectViewModel;
  @Input() level: number;
  subProjects: SubProjectViewModel[];
  expanded: boolean;
  from?: Date;
  to?: Date;
  workPackages: WorkPackageViewModel[];
  constructor() {}

  ngOnInit() {
    this.from = new Date();
    this.to = new Date();
    this.to.setDate(this.to.getDate() + 10);
    if (this.workPackage) {
      this.subProjects = [];
      this.workPackages = [];
    } else {
      this.subProjects = this.project.subProjects.filter(s => s.parentId === this.subProject.id);
      this.workPackages = this.project.workPackages.filter(w => w.subProjectId === this.subProject.id);
    }
  }

}
