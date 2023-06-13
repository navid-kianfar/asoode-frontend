import { Component, OnInit } from '@angular/core';
import { SimpleModalComponent } from 'ngx-simple-modal';
import {
  ProjectViewModel,
  WorkPackageViewModel,
} from '../../view-models/projects/project-types';
import { IdentityService } from '../../services/auth/identity.service';
import { WorkPackageService } from '../../services/projects/work-package.service';
import { OperationResultStatus } from '../../library/core/enums';
import { CultureService } from '../../services/core/culture.service';
import { ProjectService } from '../../services/projects/project.service';
import { AccessType } from '../../library/app/enums';
import { GroupService } from '../../services/groups/group.service';

@Component({
  selector: 'app-upgrade-work-package',
  templateUrl: './upgrade-work-package.component.html',
  styleUrls: ['./upgrade-work-package.component.scss'],
})
export class UpgradeWorkPackageComponent
  extends SimpleModalComponent<{ workPackage: WorkPackageViewModel }, any>
  implements OnInit
{
  WizardMode = WizardMode;
  mode: WizardMode;
  continueAs: WizardMode;
  workPackage: WorkPackageViewModel;
  upgrading: boolean;
  hasProject: boolean;
  selectedProject: string;
  selectedPackage: string;
  projects: ProjectViewModel[];
  packages: WorkPackageViewModel[];
  constructor(
    private readonly identityService: IdentityService,
    private readonly projectService: ProjectService,
    private readonly groupService: GroupService,
    private readonly workPackageService: WorkPackageService,
    readonly cultureService: CultureService,
  ) {
    super();
  }

  ngOnInit() {
    this.mode = WizardMode.Choose;
    this.continueAs = WizardMode.Upgrade;
    this.hasProject =
      this.identityService.profile.plan.project >
      this.identityService.profile.plan.usedProject;
    const groupIds = this.groupService.groups.map((g) => g.id);
    this.projects = this.projectService.projects.filter((p) => {
      return p.members.find(
        (m) =>
          p.complex &&
          p.id !== this.workPackage.projectId &&
          (m.access === AccessType.Admin || m.access === AccessType.Owner) &&
          (m.recordId === this.identityService.identity.userId ||
            groupIds.indexOf(m.recordId) !== -1),
      );
    });
    this.packages = this.projectService.projects
      .filter((p) => p.id !== this.workPackage.projectId)
      .map((p) => p.workPackages)
      .reduce((prev, current) => prev.concat(current), []);
  }

  async upgrade($event: MouseEvent) {
    if (!this.hasProject) {
      $event.stopPropagation();
      $event.preventDefault();
      this.mode = WizardMode.Plan;
      return;
    }
    this.upgrading = true;
    const op = await this.workPackageService.upgrade(this.workPackage.id);
    this.upgrading = false;
    if (op.status !== OperationResultStatus.Success) {
      // TODO: handle error
      return;
    }
    this.close();
  }

  async connect($event: MouseEvent) {
    $event.stopPropagation();
    $event.preventDefault();
    this.upgrading = true;
    const op = await this.workPackageService.connect(
      this.workPackage.id,
      this.selectedProject,
    );
    this.upgrading = false;
    if (op.status !== OperationResultStatus.Success) {
      // TODO: handle error
      return;
    }
    this.close();
  }

  async merge($event: MouseEvent) {
    $event.stopPropagation();
    $event.preventDefault();
    this.upgrading = true;
    const op = await this.workPackageService.merge(
      this.workPackage.id,
      this.selectedPackage,
    );
    this.upgrading = false;
    if (op.status !== OperationResultStatus.Success) {
      // TODO: handle error
      return;
    }
    this.close();
  }

  async onCancel($event: MouseEvent) {
    $event.stopPropagation();
    $event.preventDefault();
    this.result = false;
    this.close();
  }

  next($event: MouseEvent) {
    $event.stopPropagation();
    $event.preventDefault();
    this.mode = this.continueAs;
  }

  onBack($event: MouseEvent) {
    $event.stopPropagation();
    $event.preventDefault();
    this.continueAs = this.mode;
    this.mode = WizardMode.Choose;
  }
}
export enum WizardMode {
  Choose = 1,
  Upgrade = 2,
  Connect = 3,
  Merge = 4,
  Plan = 5,
}
