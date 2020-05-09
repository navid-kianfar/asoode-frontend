import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CultureService } from '../../../services/core/culture.service';
import { ProjectService } from '../../../services/projects/project.service';
import { IdentityService } from '../../../services/auth/identity.service';
import { NotificationService } from '../../../services/core/notification.service';
import { GroupService } from '../../../services/groups/group.service';
import { PlansService } from '../../../services/general/plans.service';
import { OperationResultStatus } from '../../../library/core/enums';
import {
  OrderViewModel,
  PlansFetchViewModel,
  PlanViewModel,
} from '../../../view-models/general/plan-types';
import { PlanType } from '../../../library/app/enums';
import { NumberHelpers } from '../../../helpers/number.helpers';

@Component({
  selector: 'app-upgrade-wizard',
  templateUrl: './upgrade-wizard.component.html',
  styleUrls: ['./upgrade-wizard.component.scss'],
})
export class UpgradeWizardComponent implements OnInit {
  ViewMode = ViewMode;
  mode: ViewMode;
  waiting: boolean;
  actionWaiting: boolean;
  @Input() showBack: boolean;
  @Output() exit = new EventEmitter();
  @Output() back = new EventEmitter();
  data: PlansFetchViewModel;
  order: OrderViewModel;
  NumberHelpers = NumberHelpers;
  selectedPlan: PlanViewModel;
  constructor(
    readonly cultureService: CultureService,
    readonly projectService: ProjectService,
    readonly groupService: GroupService,
    readonly identityService: IdentityService,
    private readonly notificationService: NotificationService,
    private readonly plansService: PlansService,
  ) {}

  formatSpaceLabel(value: number) {
    return value / 1024 / 1024 / 1024;
  }
  ngOnInit() {
    this.order = {
      calculatedPrice: 0,
      complexGroup: 0,
      diskSpace: 0,
      project: 0,
      simpleGroup: 0,
      workPackage: 0,
      users: 0,
    };
    this.mode = ViewMode.Init;
    this.fetch();
  }

  async fetch() {
    this.waiting = true;
    const op = await this.plansService.fetch();
    if (op.status !== OperationResultStatus.Success) {
      // TODO: handle error;
      this.exit.emit();
      return;
    }
    this.waiting = false;
    op.data.plans.forEach(p => {
      if (p.type === PlanType.Free) {
        p.canUse = false;
      }
      if (p.users < op.data.mine.users) {
        p.canUse = false;
      }
      if (p.complexGroup < op.data.mine.complexGroup) {
        p.canUse = false;
      }
      if (p.simpleGroup < op.data.mine.simpleGroup) {
        p.canUse = false;
      }
      if (p.workPackage < op.data.mine.workPackage) {
        p.canUse = false;
      }
      if (p.project < op.data.mine.project) {
        p.canUse = false;
      }
      if (p.diskSpace < op.data.mine.space) {
        p.canUse = false;
      }
    });
    op.data.plans = op.data.plans.filter(p => p.type !== PlanType.Free);
    this.data = op.data;
    this.pick(null);
  }
  onBack($event: MouseEvent) {
    if (this.actionWaiting || this.waiting) {
      return;
    }
    $event.stopPropagation();
    $event.preventDefault();
    this.back.emit();
  }
  onCancel($event: MouseEvent) {
    if (this.actionWaiting || this.waiting) {
      return;
    }
    $event.stopPropagation();
    $event.preventDefault();
    this.exit.emit();
  }
  next($event: MouseEvent) {
    $event.stopPropagation();
    $event.preventDefault();
  }

  pick(plan: PlanViewModel) {
    if (this.actionWaiting || (plan && !plan.canUse)) {
      return;
    }
    const hasSelected = this.selectedPlan !== null;
    this.selectedPlan = plan;
    if (plan === null) {
      if (!hasSelected) {
        return;
      }
      this.order = {
        calculatedPrice: 0,
        diskSpace: this.identityService.profile.plan.space,
        complexGroup: this.identityService.profile.plan.complexGroup,
        project: this.identityService.profile.plan.project,
        simpleGroup: this.identityService.profile.plan.simpleGroup,
        workPackage: this.identityService.profile.plan.workPackage,
        users: this.identityService.profile.plan.users,
      };
      return;
    }
    this.order = {
      calculatedPrice: 0,
      diskSpace: plan.diskSpace,
      complexGroup: plan.complexGroup,
      project: plan.project,
      simpleGroup: plan.simpleGroup,
      workPackage: plan.workPackage,
      users: plan.users,
    };
  }
}
export enum ViewMode {
  Init = 1,
  Choose = 2,
  Factor = 3,
}
