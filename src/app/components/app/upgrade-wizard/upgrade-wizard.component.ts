import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CultureService} from '../../../services/core/culture.service';
import {ProjectService} from '../../../services/projects/project.service';
import {IdentityService} from '../../../services/auth/identity.service';
import {NotificationService} from '../../../services/core/notification.service';
import {GroupService} from '../../../services/groups/group.service';
import {PlansService} from '../../../services/general/plans.service';
import {OperationResultStatus} from '../../../library/core/enums';
import {OrderViewModel, PlansFetchViewModel, PlanViewModel, UserPlanInfoViewModel,} from '../../../view-models/general/plan-types';
import {PlanType} from '../../../library/app/enums';
import {NumberHelpers} from '../../../helpers/number.helpers';
import {OrderService} from '../../../services/general/order.service';
import {OrderDiscountResultViewModel} from '../../../view-models/general/order-types';

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
  PlanType = PlanType;
  NumberHelpers = NumberHelpers;
  selectedPlan: PlanViewModel;
  basedOn: PlanViewModel | UserPlanInfoViewModel;
  checkingDiscount: boolean;
  discountApplied: boolean;
  discountResult: OrderDiscountResultViewModel;
  constructor(
    readonly cultureService: CultureService,
    readonly projectService: ProjectService,
    readonly groupService: GroupService,
    readonly identityService: IdentityService,
    private readonly notificationService: NotificationService,
    private readonly plansService: PlansService,
    private readonly orderService: OrderService,
  ) {}

  formatSpaceLabel(value: number) {
    return value / 1024 / 1024 / 1024;
  }
  ngOnInit() {
    this.order = {
      payNow: true,
      discountCode: '',
      valueAdded: 0,
      appliedDiscount: 0,
      calculatedPrice: 0,
      complexGroup: 0,
      diskSpace: 0,
      project: 0,
      simpleGroup: 0,
      workPackage: 0,
      users: 0,
      spaceCost: 0,
      projectCost: 0,
      workPackageCost: 0,
      usersCost: 0,
      simpleGroupCost: 0,
      complexGroupCost: 0,
      yearly: false,
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
    this.basedOn =
      this.identityService.profile.plan.type === PlanType.Free
        ? op.data.plans[0]
        : this.identityService.profile.plan;
    this.pick(null);
  }
  onBack($event: MouseEvent) {
    if (this.actionWaiting || this.waiting) {
      return;
    }
    $event.stopPropagation();
    $event.preventDefault();

    if (this.mode === ViewMode.Factor) {
      if (this.selectedPlan === null) {
        this.mode = ViewMode.Choose;
        return;
      }
      this.mode = ViewMode.Init;
      return;
    }
    if (this.mode === ViewMode.Choose) {
      this.mode = ViewMode.Init;
      return;
    }
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
    this.order.discountCode = '';
    this.order.appliedDiscount = 0;
    this.discountResult = {
      alreadyUsed: false,
      amount: 0,
      expired: false,
      success: false,
    };
    if (this.mode === ViewMode.Choose) {
      this.mode = ViewMode.Factor;
      return;
    }
    if (this.selectedPlan === null) {
      this.mode = ViewMode.Choose;
      return;
    }
    this.calculateTotalCost(true);
    this.mode = ViewMode.Factor;
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
        payNow: true,
        discountCode: '',
        valueAdded: 0,
        appliedDiscount: 0,
        calculatedPrice: 0,
        diskSpace: this.identityService.profile.plan.totalSpace,
        complexGroup: this.identityService.profile.plan.totalComplexGroups,
        project: this.identityService.profile.plan.totalComplexProjects,
        simpleGroup: this.identityService.profile.plan.totalSimpleGroups,
        workPackage: this.identityService.profile.plan.totalWorkPackages,
        users: this.identityService.profile.plan.totalUsers,
        spaceCost: 0,
        projectCost: 0,
        workPackageCost: 0,
        usersCost: 0,
        simpleGroupCost: 0,
        complexGroupCost: 0,
        yearly: false,
      };
      return;
    }
    this.order = {
      payNow: true,
      discountCode: '',
      valueAdded: 0,
      appliedDiscount: 0,
      calculatedPrice: 0,
      diskSpace: plan.diskSpace,
      complexGroup: plan.complexGroup,
      project: plan.project,
      workPackage: plan.workPackage,
      simpleGroup: plan.simpleGroup,
      users: plan.users,
      spaceCost: 0,
      projectCost: 0,
      workPackageCost: 0,
      usersCost: 0,
      simpleGroupCost: 0,
      complexGroupCost: 0,
      yearly: false,
    };
  }
  calculateSpaceCost() {
    const total =
      this.order.diskSpace - this.identityService.profile.plan.totalSpace;
    const gb = total / 1024 / 1024 / 1024;
    this.order.spaceCost = gb * this.basedOn.additionalSpaceCost;
    if (this.order.yearly) {
      const discount = this.order.spaceCost / 10;
      this.order.spaceCost = (this.order.spaceCost - discount) * 12;
    }
    this.calculateTotalCost();
  }
  calculateUserCost() {
    const total =
      this.order.users - this.identityService.profile.plan.totalUsers;
    this.order.usersCost = total * this.basedOn.additionalUserCost;
    if (this.order.yearly) {
      const discount = this.order.usersCost / 10;
      this.order.usersCost = (this.order.usersCost - discount) * 12;
    }
    this.calculateTotalCost();
  }
  calculateProjectCost() {
    const total =
      this.order.project -
      this.identityService.profile.plan.totalComplexProjects;
    this.order.projectCost = total * this.basedOn.additionalProjectCost;
    if (this.order.yearly) {
      const discount = this.order.projectCost / 10;
      this.order.projectCost = (this.order.projectCost - discount) * 12;
    }
    this.calculateTotalCost();
  }
  calculatePackageCost() {
    const total =
      this.order.workPackage -
      this.identityService.profile.plan.totalWorkPackages;
    this.order.workPackageCost = total * this.basedOn.additionalWorkPackageCost;
    if (this.order.yearly) {
      const discount = this.order.workPackageCost / 10;
      this.order.workPackageCost = (this.order.workPackageCost - discount) * 12;
    }
    this.calculateTotalCost();
  }
  calculateSimpleGroupCost() {
    const total =
      this.order.simpleGroup -
      this.identityService.profile.plan.totalSimpleGroups;
    this.order.simpleGroupCost = total * this.basedOn.additionalSimpleGroupCost;
    if (this.order.yearly) {
      const discount = this.order.simpleGroupCost / 10;
      this.order.simpleGroupCost = (this.order.simpleGroupCost - discount) * 12;
    }
    this.calculateTotalCost();
  }
  calculateComplexGroupCost() {
    const total =
      this.order.complexGroup -
      this.identityService.profile.plan.totalComplexGroups;
    this.order.complexGroupCost =
      total * this.basedOn.additionalComplexGroupCost;
    if (this.order.yearly) {
      const discount = this.order.complexGroupCost / 10;
      this.order.complexGroupCost =
        (this.order.complexGroupCost - discount) * 12;
    }
    this.calculateTotalCost();
  }
  calculateTotalCost(calc: boolean = false) {
    if (calc) {
      this.calculateComplexGroupCost();
      this.calculateSimpleGroupCost();
      this.calculateUserCost();
      this.calculatePackageCost();
      this.calculateProjectCost();
      this.calculateSpaceCost();
    }
    this.order.calculatedPrice =
      this.order.complexGroupCost +
      this.order.simpleGroupCost +
      this.order.usersCost +
      this.order.workPackageCost +
      this.order.projectCost +
      this.order.spaceCost;
    this.order.valueAdded = Math.round(
      ((this.order.calculatedPrice - this.order.appliedDiscount) *
        this.data.valueAdded) /
        100,
    );
  }
  calculatePlanPrice(planCost: number): number {
    if (this.order.yearly) {
      const discount = planCost / 10;
      return (planCost - discount) * 12;
    }
    return planCost;
  }

  async checkDiscount() {
    this.discountResult = {
      alreadyUsed: false,
      amount: 0,
      expired: false,
      success: false,
    };
    this.checkingDiscount = true;
    const op = await this.orderService.checkDiscount({
      code: this.order.discountCode,
      amount: this.order.calculatedPrice
    });
    this.checkingDiscount = false;
    if (op.status !== OperationResultStatus.Success) {
      // TODO: handle error
      return;
    }
    this.discountResult = op.data;
    this.order.appliedDiscount = op.data.amount;
    this.calculateTotalCost(true);
  }

  async createFactor($event: MouseEvent) {
    this.calculateTotalCost(true);
    const model = {} as any;
    if (this.selectedPlan) {
      model.planId = this.selectedPlan.id;
      model.payNow = this.order.payNow;
      model.yearly = this.order.yearly;
    } else {
      model.payNow = this.order.payNow;
      model.discountCode = this.order.discountCode;
      model.valueAdded = this.order.valueAdded;
      model.appliedDiscount = this.order.appliedDiscount;
      model.yearly = this.order.yearly;
      model.users = this.order.users;
      model.diskSpace = this.order.diskSpace;
      model.workPackage = this.order.workPackage;
      model.project = this.order.project;
      model.complexGroup = this.order.complexGroup;
      model.simpleGroup = this.order.simpleGroup;
    }
    const op = await this.orderService.order(model);
    if (op.status !== OperationResultStatus.Success) {
      // TODO: handle error
      return;
    }
    this.notificationService.success('ORDER_CREATED');
    if (this.order.payNow) {
      this.orderService.pay(op.data);
      return;
    }
    setTimeout(() => { window.location.reload(); }, 3000);
  }
}
export enum ViewMode {
  Init = 1,
  Choose = 2,
  Factor = 3,
}
