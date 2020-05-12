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
  TreeReportViewModel,
  TreeViewModel,
  WorkPackageViewModel,
} from '../../../view-models/projects/project-types';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { AccessType } from 'src/app/library/app/enums';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ArrayHelpers } from '../../../helpers/array.helpers';

@Component({
  selector: 'app-project-tree-node',
  templateUrl: './project-tree-node.component.html',
  styleUrls: ['./project-tree-node.component.scss'],
})
export class ProjectTreeNodeComponent implements OnInit, OnDestroy {
  @Input() data: TreeViewModel;
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
  @Output() dropSubProject = new EventEmitter<
    CdkDragDrop<SubProjectViewModel[], any>
  >();
  @Output() dropWorkPackage = new EventEmitter<
    CdkDragDrop<WorkPackageViewModel[], any>
  >();
  subProjects: SubProjectViewModel[];
  expanded: boolean;
  from?: Date;
  to?: Date;
  workPackages: WorkPackageViewModel[];
  subscribe: Subscription;
  dragDelay: number;
  AccessType = AccessType;
  noDrag: boolean;
  reportViewModel: TreeReportViewModel;
  constructor(
    private readonly router: Router,
    private readonly deviceDetectorService: DeviceDetectorService,
  ) {}

  ngOnInit() {
    this.dragDelay =
      this.deviceDetectorService.isTablet() ||
      this.deviceDetectorService.isMobile()
        ? 1000
        : 0;
    this.from = new Date();
    this.to = new Date();
    this.to.setDate(this.to.getDate() + 10);
    this.createTree();
    this.subscribe = this.reCreate.subscribe(() => this.createTree());
    this.noDrag =
      !(
        this.permission === AccessType.Admin ||
        this.permission === AccessType.Owner
      ) || this.deviceDetectorService.os.toLowerCase() === 'ios';
  }

  ngOnDestroy() {
    this.subscribe.unsubscribe();
  }

  openWorkPackage(workPackage: WorkPackageViewModel) {
    this.router.navigateByUrl('/work-package/' + workPackage.id);
  }
  createTree() {
    this.reportViewModel = {
      done: 0,
      timeSpent: 0,
      total: 0,
      progress: 0,
      from: null,
      to: null,
      members: [],
    };
    if (this.workPackage) {
      this.subProjects = [];
      this.workPackages = [];
      if (this.data.tree[this.workPackage.id]) {
        this.reportViewModel = this.data.tree[this.workPackage.id];
        this.reportViewModel.members = [...this.workPackage.members];
      }
    } else {
      this.subProjects = this.project.subProjects
        .filter(s => s.parentId === this.subProject.id)
        .sort((a, b) => (a.order > b.order ? 1 : -1));
      this.workPackages = this.project.workPackages
        .filter(w => w.subProjectId === this.subProject.id)
        .sort((a, b) => (a.order > b.order ? 1 : -1));
      this.findAllSubs(this.subProject.id).forEach(p => {
        const report = this.data.tree[p.id];
        if (!report) { return; }
        this.reportViewModel.members = [
          ...this.reportViewModel.members,
          ...p.members,
        ];
        this.reportViewModel.timeSpent += report.timeSpent;
        this.reportViewModel.done += report.done;
        this.reportViewModel.total += report.total;
        if (report.from) {
          report.from = new Date(report.from);
          if (!this.reportViewModel.from) {
            this.reportViewModel.from = report.from;
          } else if (
            report.from.getTime() < this.reportViewModel.from.getTime()
          ) {
            this.reportViewModel.from = report.from;
          }
        }
        if (report.to) {
          report.to = new Date(report.to);
          if (!this.reportViewModel.to) {
            this.reportViewModel.to = report.to;
          } else if (report.to.getTime() > this.reportViewModel.to.getTime()) {
            this.reportViewModel.to = report.to;
          }
        }
      });
    }
    const duplicates = {} as any;
    this.reportViewModel.progress = this.reportViewModel.total
      ? Math.floor(
          (this.reportViewModel.done * 100) / this.reportViewModel.total,
        )
      : 0;
    this.reportViewModel.members = this.reportViewModel.members.filter(m => {
      if (duplicates[m.recordId]) {
        return false;
      }
      duplicates[m.recordId] = true;
      return true;
    });
  }

  private findAllSubs(id: string): WorkPackageViewModel[] {
    const subs = this.project.subProjects.filter(s => s.parentId === id);
    const packages = this.project.workPackages.filter(
      w => w.subProjectId === id,
    );
    const include = subs.map(s => this.findAllSubs(s.id));
    return [...packages, ...ArrayHelpers.flat(include)];
  }
}
