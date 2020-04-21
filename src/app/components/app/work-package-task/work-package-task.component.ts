import { Component, Input, OnChanges, OnInit } from '@angular/core';
import {
  ProjectViewModel,
  WorkPackageLabelViewModel,
  WorkPackageListViewModel,
  WorkPackageMemberViewModel,
  WorkPackageTaskLabelViewModel,
  WorkPackageTaskViewModel,
  WorkPackageViewModel,
} from '../../../view-models/projects/project-types';
import { IdentityService } from '../../../services/auth/identity.service';
import { WorkPackageTaskVoteNecessity } from '../../../library/app/enums';
import { MemberInfoViewModel } from '../../../view-models/auth/identity-types';
import { ProjectService } from '../../../services/projects/project.service';

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
  constructor(private readonly projectService: ProjectService) {}

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
