import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  ProjectViewModel,
  SubProjectViewModel,
  WorkPackageViewModel,
} from '../../../view-models/projects/project-types';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { AccessType } from 'src/app/library/app/enums';
import {DeviceDetectorService} from 'ngx-device-detector';

@Component({
  selector: 'app-project-tree-node',
  templateUrl: './project-tree-node.component.html',
  styleUrls: ['./project-tree-node.component.scss'],
})
export class ProjectTreeNodeComponent implements OnInit, OnDestroy {
  @Input() permission: AccessType;
  @Input() workPackage: WorkPackageViewModel;
  @Input() project: ProjectViewModel;
  @Input() subProject: SubProjectViewModel;
  @Input() level: number;
  @Input() reCreate: EventEmitter<string>;
  @Output() createSubProject = new EventEmitter<string>();
  @Output() createWorkPackage = new EventEmitter<string>();
  @Output() editSubProject = new EventEmitter<string>();
  @Output() deleteSubProject = new EventEmitter<string>();
  @Output() dropSubProject = new EventEmitter<CdkDragDrop<SubProjectViewModel[], any>>();
  @Output() dropWorkPackage = new EventEmitter<CdkDragDrop<WorkPackageViewModel[], any>>();
  subProjects: SubProjectViewModel[];
  expanded: boolean;
  from?: Date;
  to?: Date;
  workPackages: WorkPackageViewModel[];
  subscribe: Subscription;
  dragDelay: number;
  AccessType = AccessType;
  constructor(
    private readonly router: Router,
    private readonly deviceDetectorService: DeviceDetectorService
  ) {}

  ngOnInit() {
    this.dragDelay = (this.deviceDetectorService.isTablet() || this.deviceDetectorService.isMobile()) ? 2000 : 0;
    this.from = new Date();
    this.to = new Date();
    this.to.setDate(this.to.getDate() + 10);
    this.createTree();
    this.subscribe = this.reCreate.subscribe(() => this.createTree());
  }

  ngOnDestroy() {
    this.subscribe.unsubscribe();
  }

  openWorkPackage(workPackage: WorkPackageViewModel) {
    this.router.navigateByUrl('/work-package/' + workPackage.id);
  }
  createTree() {
    if (this.workPackage) {
      this.subProjects = [];
      this.workPackages = [];
    } else {
      this.subProjects = this.project.subProjects.filter(
        s => s.parentId === this.subProject.id,
      ).sort((a, b) => (a.order > b.order ? 1 : -1));
      this.workPackages = this.project.workPackages.filter(
        w => w.subProjectId === this.subProject.id,
      ).sort((a, b) => (a.order > b.order ? 1 : -1));
    }
  }
}
