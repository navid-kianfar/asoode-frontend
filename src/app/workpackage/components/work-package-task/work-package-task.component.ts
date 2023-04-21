import { Component, Input, OnChanges, OnInit } from '@angular/core';
import {
  ProjectViewModel,
  WorkPackageLabelViewModel,
  WorkPackageListViewModel,
  WorkPackageTaskViewModel,
  WorkPackageViewModel,
} from '../../../view-models/projects/project-types';
import { ProjectService } from '../../../project/services/project.service';
import { CultureService } from '../../../shared/services/culture.service';
import { WorkPackageTaskVoteNecessity } from '../../../shared/lib/enums/workpackage';

@Component({
  selector: 'app-work-package-task',
  templateUrl: './work-package-task.component.html',
  styleUrls: ['./work-package-task.component.scss'],
})
export class WorkPackageTaskComponent implements OnInit {
  @Input() project: ProjectViewModel;
  @Input() workPackage: WorkPackageViewModel;
  @Input() model: WorkPackageTaskViewModel;
  @Input() list: WorkPackageListViewModel;

  WorkPackageTaskVoteNecessity = WorkPackageTaskVoteNecessity;
  constructor(
    private readonly projectService: ProjectService,
    readonly cultureService: CultureService,
  ) {}

  ngOnInit() {
    if (!this.project) {
      this.project = this.projectService.projects.find(
        p => p.id === this.model.projectId,
      );
      if (!this.project) {
        return;
      }
      this.workPackage = this.project.workPackages.find(
        w => w.id === this.model.packageId,
      );
    }
  }

  isLabelSelected(label: WorkPackageLabelViewModel): boolean {
    return this.model.labels.findIndex(i => i.labelId === label.id) !== -1;
  }
}