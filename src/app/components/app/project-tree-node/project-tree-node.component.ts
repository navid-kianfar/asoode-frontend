import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {
  ProjectViewModel,
  SubProjectViewModel,
  WorkPackageViewModel,
} from '../../../view-models/projects/project-types';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-project-tree-node',
  templateUrl: './project-tree-node.component.html',
  styleUrls: ['./project-tree-node.component.scss'],
})
export class ProjectTreeNodeComponent implements OnInit, OnDestroy {
  @Input() workPackage: WorkPackageViewModel;
  @Input() project: ProjectViewModel;
  @Input() subProject: SubProjectViewModel;
  @Input() level: number;
  @Input() reCreate: EventEmitter<string>;
  @Output() createSubProject = new EventEmitter<string>();
  @Output() createWorkPackage = new EventEmitter<string>();
  @Output() editSubProject = new EventEmitter<string>();
  @Output() deleteSubProject = new EventEmitter<string>();
  subProjects: SubProjectViewModel[];
  expanded: boolean;
  from?: Date;
  to?: Date;
  workPackages: WorkPackageViewModel[];
  subscribe: Subscription;
  constructor() {}

  ngOnInit() {
    this.from = new Date();
    this.to = new Date();
    this.to.setDate(this.to.getDate() + 10);
    this.createTree();
    this.subscribe = this.reCreate.subscribe(() => this.createTree());
  }

  ngOnDestroy() {
    this.subscribe.unsubscribe();
  }

  createTree() {
    if (this.workPackage) {
      this.subProjects = [];
      this.workPackages = [];
    } else {
      this.subProjects = this.project.subProjects.filter(
        s => s.parentId === this.subProject.id,
      );
      this.workPackages = this.project.workPackages.filter(
        w => w.subProjectId === this.subProject.id,
      );
    }
  }
}
