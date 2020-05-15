import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CultureService} from '../../../services/core/culture.service';
import {ProjectService} from '../../../services/projects/project.service';
import {IdentityService} from '../../../services/auth/identity.service';
import {NotificationService} from '../../../services/core/notification.service';
import {GroupService} from '../../../services/groups/group.service';
import {PlansService} from '../../../services/general/plans.service';
import {OperationResultStatus} from '../../../library/core/enums';
import {OrderViewModel, PlansFetchViewModel, PlanViewModel, UserPlanInfoViewModel} from '../../../view-models/general/plan-types';
import {OrderDuration, OrderType, PlanType} from '../../../library/app/enums';
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
  OrderType = OrderType;
  mode: ViewMode;
  waiting: boolean;
  actionWaiting: boolean;
  @Input() showBack: boolean;
  @Output() exit = new EventEmitter();
  @Output() back = new EventEmitter();
  data: PlansFetchViewModel;
  order: OrderViewModel;
  OrderDuration = OrderDuration;
  PlanType = PlanType;
  NumberHelpers = NumberHelpers;
  selectedPlan: PlanViewModel;
  basedOn: PlanViewModel | UserPlanInfoViewModel;
  checkingDiscount: boolean;
  discountApplied: boolean;
  discountResult: OrderDiscountResultViewModel;
  private totalGap: number;
  private remainGap: number;
  private remainPercent: number;
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
      duration: OrderDuration.Monthly,
      useWallet: true,
      type: OrderType.Patch
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
    const current = op.data.plans.find(p => p.id === op.data.mine.planId);
    const customPlan = op.data.plans.find(p => p.type === PlanType.Custom);
    op.data.mine.createdAt = new Date(op.data.mine.createdAt);
    op.data.plans.forEach(p => {
      p.canUse = true;
      if (p.type === PlanType.Custom) { return; }
      if (p.type === PlanType.Free) {p.canUse = false; }
      if (p.order < current.order) {p.canUse = false; }
      if (p.users < op.data.mine.users) {p.canUse = false; }
      if (p.complexGroup < op.data.mine.complexGroup) {p.canUse = false; }
      if (p.simpleGroup < op.data.mine.simpleGroup) {p.canUse = false; }
      if (p.workPackage < op.data.mine.workPackage) {p.canUse = false; }
      if (p.project < op.data.mine.project) {p.canUse = false; }
      if (p.diskSpace < op.data.mine.space) {p.canUse = false; }
    });
    op.data.plans = op.data.plans.filter(p => p.type !== PlanType.Free);
    this.data = op.data;
    this.basedOn = current.type === PlanType.Free
        ? customPlan
        : this.identityService.profile.plan;

    if (this.identityService.profile.plan.type !== PlanType.Free) {
      op.data.mine.expireAt = new Date(op.data.mine.expireAt);
      this.totalGap = op.data.mine.expireAt.getTime() - op.data.mine.createdAt.getTime();
      this.remainGap = new Date().getTime() - op.data.mine.createdAt.getTime();
      this.remainPercent = 100 - (this.remainGap * 100 / this.totalGap);
    } else {
      this.order.type = OrderType.Change;
    }

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
      invalid: false
    };

    switch (this.mode) {
      case ViewMode.Init:

        switch (this.order.type) {
          case OrderType.Patch:
            this.mode = ViewMode.Choose;
            return;
          case OrderType.Renew:
            this.mode = ViewMode.Factor;
            return;
          case OrderType.Change:
            this.mode = ViewMode.Factor;
            return;
        }

        break;
      case ViewMode.Choose:
        this.mode = ViewMode.Factor;
        return;
      case ViewMode.Factor:
        break;
    }
  }
  onBack($event: MouseEvent) {
    if (this.actionWaiting || this.waiting) {
      return;
    }
    $event.stopPropagation();
    $event.preventDefault();

    // switch (this.mode) {
    //   case ViewMode.Init:
    //     this.back.emit();
    //     break;
    //   case ViewMode.Choose:
    //     this.mode = ViewMode.Init;
    //     break;
    //   case ViewMode.Factor:
    //     if (!this.order.upgrade || (this.selectedPlan || this.basedOn).type === PlanType.Custom) {
    //       this.mode = ViewMode.Choose;
    //       return;
    //     }
    //     this.mode = ViewMode.Init;
    //     break;
    // }
  }
  onCancel($event: MouseEvent) {
    if (this.actionWaiting || this.waiting) {
      return;
    }
    $event.stopPropagation();
    $event.preventDefault();
    this.exit.emit();
  }
  pick(plan: PlanViewModel) {
    if (this.actionWaiting || !plan.canUse) { return; }
    this.selectedPlan = plan;
    this.order = {
      useWallet: this.order.useWallet,
      payNow: this.order.payNow,
      type: this.order.type,
      duration: this.order.duration,
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
      complexGroupCost: 0
    };
  }
  calculateSpaceCost() {
    const total =
      this.order.diskSpace - this.identityService.profile.plan.totalSpace;
    const gb = total / 1024 / 1024 / 1024;
    this.order.spaceCost = gb * this.basedOn.additionalSpaceCost;
    if (this.order.duration === OrderDuration.Yearly) {
      const discount = this.order.spaceCost / 10;
      this.order.spaceCost = (this.order.spaceCost - discount) * 12;
    }
    if (this.order.type === OrderType.Patch) {
      this.order.spaceCost = Math.round(this.order.spaceCost * this.remainPercent / 100);
    }
    this.calculateTotalCost();
  }
  calculateUserCost() {
    const total =
      this.order.users - this.identityService.profile.plan.totalUsers;
    this.order.usersCost = total * this.basedOn.additionalUserCost;
    if (this.order.duration === OrderDuration.Yearly) {
      const discount = this.order.usersCost / 10;
      this.order.usersCost = (this.order.usersCost - discount) * 12;
    }
    if (this.order.type === OrderType.Patch) {
      this.order.usersCost = Math.round(this.order.usersCost * this.remainPercent / 100);
    }
    this.calculateTotalCost();
  }
  calculateProjectCost() {
    const total =
      this.order.project -
      this.identityService.profile.plan.totalComplexProjects;
    this.order.projectCost = total * this.basedOn.additionalProjectCost;
    if (this.order.duration === OrderDuration.Yearly) {
      const discount = this.order.projectCost / 10;
      this.order.projectCost = (this.order.projectCost - discount) * 12;
    }
    if (this.order.type === OrderType.Patch) {
      this.order.projectCost = Math.round(this.order.projectCost * this.remainPercent / 100);
    }
    this.calculateTotalCost();
  }
  calculatePackageCost() {
    const total =
      this.order.workPackage -
      this.identityService.profile.plan.totalWorkPackages;
    this.order.workPackageCost = total * this.basedOn.additionalWorkPackageCost;
    if (this.order.duration === OrderDuration.Yearly) {
      const discount = this.order.workPackageCost / 10;
      this.order.workPackageCost = (this.order.workPackageCost - discount) * 12;
    }
    if (this.order.type === OrderType.Patch) {
      this.order.workPackageCost = Math.round(this.order.workPackageCost * this.remainPercent / 100);
    }
    this.calculateTotalCost();
  }
  calculateSimpleGroupCost() {
    const total =
      this.order.simpleGroup -
      this.identityService.profile.plan.totalSimpleGroups;
    this.order.simpleGroupCost = total * this.basedOn.additionalSimpleGroupCost;
    if (this.order.duration === OrderDuration.Yearly) {
      const discount = this.order.simpleGroupCost / 10;
      this.order.simpleGroupCost = (this.order.simpleGroupCost - discount) * 12;
    }
    if (this.order.type === OrderType.Patch) {
      this.order.simpleGroupCost = Math.round(this.order.simpleGroupCost * this.remainPercent / 100);
    }
    this.calculateTotalCost();
  }
  calculateComplexGroupCost() {
    const total =
      this.order.complexGroup -
      this.identityService.profile.plan.totalComplexGroups;
    this.order.complexGroupCost =
      total * this.basedOn.additionalComplexGroupCost;
    if (this.order.duration === OrderDuration.Yearly) {
      const discount = this.order.complexGroupCost / 10;
      this.order.complexGroupCost =
        (this.order.complexGroupCost - discount) * 12;
    }
    if (this.order.type === OrderType.Patch) {
      this.order.complexGroupCost = Math.round(this.order.complexGroupCost * this.remainPercent / 100);
    }
    this.calculateTotalCost();
  }
  calculatePlanPrice(planCost: number): number {
    if (this.order.duration === OrderDuration.Yearly) {
      const discount = planCost / 10;
      return (planCost - discount) * 12;
    }
    return planCost;
  }
  calculateTotalCost(calc: boolean = false) {
    if (calc) {
      if (this.order.type === OrderType.Change && (this.selectedPlan || this.basedOn).type !== PlanType.Custom) {
        this.order.calculatedPrice = (this.selectedPlan || this.basedOn).planCost;
        this.order.valueAdded = Math.round(
          ((this.order.calculatedPrice - this.order.appliedDiscount) *
            this.data.valueAdded) /
          100,
        );

        return;
      }

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

  async checkDiscount() {
    const code = this.order.discountCode.trim();
    if (!code) { return; }
    this.discountResult = {
      alreadyUsed: false,
      amount: 0,
      expired: false,
      success: false,
      invalid: false
    };
    this.checkingDiscount = true;
    const op = await this.orderService.checkDiscount({
      code,
      amount: this.order.calculatedPrice
    });
    this.checkingDiscount = false;
    if (op.status !== OperationResultStatus.Success) {
      // TODO: handle error
      return;
    }
    if (!op.data.success) {
      this.order.discountCode = '';
    }
    this.discountResult = op.data;
    this.order.appliedDiscount = op.data.amount;
    this.calculateTotalCost(true);
  }
  async createFactor($event: MouseEvent) {
    // if (this.order.type === OrderType.Change) {
    //   this.calculateTotalCost(true);
    // }
    const model = {
      payNow: this.order.payNow,
      duration: this.order.duration,
      discountCode: this.order.discountCode,
      type: this.order.type,
      useWallet: this.order.useWallet
    } as any;

    if (this.order.type !== OrderType.Patch) {
      model.planId = this.selectedPlan.id;
    } else {
      model.planId = this.data.mine.planId;
    }

    if (this.order.type === OrderType.Patch || this.selectedPlan.type === PlanType.Custom) {
      model.users = this.order.users;
      model.diskSpace = this.order.diskSpace;
      model.workPackage = this.order.workPackage;
      model.project = this.order.project;
      model.complexGroup = this.order.complexGroup;
      model.simpleGroup = this.order.simpleGroup;
    }
    this.actionWaiting = true;
    const op = await this.orderService.order(model);
    this.actionWaiting = false;
    if (op.status !== OperationResultStatus.Success) {
      // TODO: handle error
      return;
    }
    this.notificationService.success('ORDER_CREATED');
    if (this.order.payNow) {
      this.orderService.pay(op.data);
      return;
    }
    this.exit.emit();
  }
}
export enum ViewMode {
  Init = 1,
  Choose = 2,
  Factor = 3,
}
