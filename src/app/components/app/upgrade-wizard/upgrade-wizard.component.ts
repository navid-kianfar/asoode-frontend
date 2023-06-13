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
  UserPlanInfoViewModel,
} from '../../../view-models/general/plan-types';
import { OrderDuration, OrderType, PlanType } from '../../../library/app/enums';
import { NumberHelpers } from '../../../helpers/number.helpers';
import { OrderService } from '../../../services/general/order.service';
import { OrderDiscountResultViewModel } from '../../../view-models/general/order-types';

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
  @Input() requireProject: boolean;
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
  alreadyExpired: boolean;
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
  calculateSpaceCost() {
    const total =
      this.order.diskSpace - this.identityService.profile.plan.space;
    const gb = total / 1024 / 1024 / 1024;
    this.order.spaceCost = gb * this.basedOn.additionalSpaceCost;
    this.order.spaceCost = this.calculatePlanPrice(this.order.spaceCost);
    console.log(gb, this.order.spaceCost);
    if (this.order.type === OrderType.Patch) {
      this.order.spaceCost = Math.round(
        (this.order.spaceCost * this.remainPercent) / 100,
      );
    }
    console.log(gb, this.order.spaceCost);
    this.calculateTotalCost(true);
  }
  calculateUserCost() {
    const total = this.order.users - this.identityService.profile.plan.users;
    this.order.usersCost = total * this.basedOn.additionalUserCost;
    this.order.usersCost = this.calculatePlanPrice(this.order.usersCost);
    if (this.order.type === OrderType.Patch) {
      this.order.usersCost = Math.round(
        (this.order.usersCost * this.remainPercent) / 100,
      );
    }
    this.calculateTotalCost(true);
  }
  calculateProjectCost() {
    const total =
      this.order.project - this.identityService.profile.plan.project;
    this.order.projectCost = total * this.basedOn.additionalProjectCost;
    this.order.projectCost = this.calculatePlanPrice(this.order.projectCost);
    if (this.order.type === OrderType.Patch) {
      this.order.projectCost = Math.round(
        (this.order.projectCost * this.remainPercent) / 100,
      );
    }
    this.calculateTotalCost(true);
  }
  calculatePackageCost() {
    const total =
      this.order.workPackage - this.identityService.profile.plan.workPackage;
    this.order.workPackageCost = total * this.basedOn.additionalWorkPackageCost;
    this.order.workPackageCost = this.calculatePlanPrice(
      this.order.workPackageCost,
    );
    if (this.order.type === OrderType.Patch) {
      this.order.workPackageCost = Math.round(
        (this.order.workPackageCost * this.remainPercent) / 100,
      );
    }
    this.calculateTotalCost(true);
  }
  calculateSimpleGroupCost() {
    const total =
      this.order.simpleGroup - this.identityService.profile.plan.simpleGroup;
    this.order.simpleGroupCost = total * this.basedOn.additionalSimpleGroupCost;
    this.order.simpleGroupCost = this.calculatePlanPrice(
      this.order.simpleGroupCost,
    );
    if (this.order.type === OrderType.Patch) {
      this.order.simpleGroupCost = Math.round(
        (this.order.simpleGroupCost * this.remainPercent) / 100,
      );
    }
    this.calculateTotalCost(true);
  }
  calculateComplexGroupCost() {
    const total =
      this.order.complexGroup - this.identityService.profile.plan.complexGroup;
    this.order.complexGroupCost =
      total * this.basedOn.additionalComplexGroupCost;
    this.order.complexGroupCost = this.calculatePlanPrice(
      this.order.complexGroupCost,
    );
    if (this.order.type === OrderType.Patch) {
      this.order.complexGroupCost = Math.round(
        (this.order.complexGroupCost * this.remainPercent) / 100,
      );
    }
    this.calculateTotalCost(true);
  }
  calculatePlanPrice(planCost: number): number {
    if (this.order.duration === OrderDuration.Yearly) {
      const discount = planCost / 10;
      return (planCost - discount) * 12;
    }
    return planCost;
  }
  calculateTotalCost(sum: boolean = false) {
    switch (this.order.type) {
      case OrderType.Renew:
        const cost =
          this.data.mine.days === 30
            ? this.data.mine.planCost
            : (this.data.mine.planCost + (this.data.mine.planCost * 10) / 100) /
              12;
        this.order.calculatedPrice = this.calculatePlanPrice(cost);
        break;
      case OrderType.Patch:
        // this.calculateComplexGroupCost();
        // this.calculateSimpleGroupCost();
        // this.calculateUserCost();
        // this.calculatePackageCost();
        // this.calculateProjectCost();
        // this.calculateSpaceCost();
        // calc = true;
        break;
      case OrderType.Change:
        if ((this.selectedPlan || this.basedOn).type !== PlanType.Custom) {
          this.order.calculatedPrice = (
            this.selectedPlan || this.basedOn
          ).planCost;
        } else {
          sum = true;
        }
        break;
    }

    if (sum) {
      this.order.calculatedPrice =
        this.order.complexGroupCost +
        this.order.simpleGroupCost +
        this.order.usersCost +
        this.order.workPackageCost +
        this.order.projectCost +
        this.order.spaceCost;
    }
    this.order.calculatedPrice = Math.round(this.order.calculatedPrice);
    // this.order.valueAdded = Math.round(
    //   ((this.order.calculatedPrice - this.order.appliedDiscount) *
    //     this.data.valueAdded) /
    //     100,
    // );
  }
  pick(plan: PlanViewModel) {
    if (this.actionWaiting || !plan.canUse) {
      return;
    }
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
      complexGroupCost: 0,
    };
  }
  onCancel($event: MouseEvent) {
    if (this.actionWaiting || this.waiting) {
      return;
    }
    $event.stopPropagation();
    $event.preventDefault();
    this.exit.emit();
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
      type: OrderType.Patch,
    };
    this.mode = ViewMode.Init;
    this.fetch();
  }
  async checkDiscount() {
    const code = this.order.discountCode.trim();
    if (!code) {
      return;
    }
    this.discountResult = {
      alreadyUsed: false,
      amount: 0,
      expired: false,
      success: false,
      invalid: false,
      invalidPlan: false,
    };
    this.checkingDiscount = true;
    const model = { code, amount: this.order.calculatedPrice } as any;

    switch (this.order.type) {
      case OrderType.Patch:
        model.planId = this.data.mine.planId;
        break;
      case OrderType.Change:
        model.planId = this.selectedPlan.id;
        break;
      case OrderType.Renew:
        model.planId = this.data.mine.planId;
        break;
    }
    const op = await this.orderService.checkDiscount(model);
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
    this.calculateTotalCost();
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
    const current = op.data.plans.find((p) => p.id === op.data.mine.planId);
    const customPlan = op.data.plans.find((p) => p.type === PlanType.Custom);
    op.data.mine.createdAt = new Date(op.data.mine.createdAt);
    op.data.plans.forEach((p) => {
      p.canUse = true;
      if (p.type === PlanType.Custom) {
        return;
      }
      if (p.id === this.identityService.profile.plan.planId) {
        p.canUse = false;
      }
      if (p.type === PlanType.Free) {
        p.canUse = false;
      }
      if (p.order < current.order) {
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
    op.data.plans = op.data.plans.filter((p) => p.type !== PlanType.Free);
    this.data = op.data;
    this.basedOn =
      current.type === PlanType.Free
        ? customPlan
        : this.identityService.profile.plan;

    if (this.identityService.profile.plan.type !== PlanType.Free) {
      op.data.mine.expireAt = new Date(op.data.mine.expireAt);
      this.totalGap =
        op.data.mine.expireAt.getTime() - op.data.mine.createdAt.getTime();
      this.remainGap = new Date().getTime() - op.data.mine.createdAt.getTime();
      this.remainPercent = 100 - (this.remainGap * 100) / this.totalGap;
    } else {
      this.order.type = OrderType.Change;
    }
    if (op.data.mine.expireAt) {
      op.data.mine.expireAt = new Date(op.data.mine.expireAt);
      this.alreadyExpired =
        op.data.mine.expireAt.getTime() < new Date().getTime();
      if (this.alreadyExpired) {
        this.order.type = OrderType.Renew;
      }
    }
  }

  next($event: MouseEvent) {
    $event.stopPropagation();
    $event.preventDefault();

    if (this.order.type === OrderType.Change) {
      if (!this.selectedPlan) {
        this.notificationService.warning('PLEASE_SELECT_A_PLAN');
        return;
      }
      if (
        this.requireProject &&
        !this.selectedPlan.project &&
        this.selectedPlan.type !== PlanType.Custom
      ) {
        this.notificationService.warning('PLEASE_SELECT_A_PLAN_WITH_PROJECT');
        return;
      }
    }

    this.order.discountCode = '';
    this.order.appliedDiscount = 0;
    this.discountResult = {
      alreadyUsed: false,
      amount: 0,
      expired: false,
      success: false,
      invalid: false,
      invalidPlan: false,
    };
    this.calculateTotalCost();

    switch (this.mode) {
      case ViewMode.Init:
        switch (this.order.type) {
          case OrderType.Patch:
            this.mode = ViewMode.Choose;

            switch (this.data.mine.days) {
              case 30:
                this.order.duration = OrderDuration.Monthly;
                break;
              case 90:
                this.order.duration = OrderDuration.Season;
                break;
              case 180:
                this.order.duration = OrderDuration.HalfYear;
                break;
              case 365:
                this.order.duration = OrderDuration.Yearly;
                break;
            }

            return;
          case OrderType.Renew:
            this.mode = ViewMode.Factor;
            return;
          case OrderType.Change:
            if ((this.selectedPlan || this.basedOn).type === PlanType.Custom) {
              this.mode = ViewMode.Choose;
              return;
            }
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

    switch (this.mode) {
      case ViewMode.Init:
        this.back.emit();
        break;
      case ViewMode.Choose:
        this.mode = ViewMode.Init;
        break;
      case ViewMode.Factor:
        switch (this.order.type) {
          case OrderType.Renew:
            this.mode = ViewMode.Init;
            break;
          case OrderType.Patch:
          case OrderType.Change:
            if ((this.selectedPlan || this.basedOn).type !== PlanType.Custom) {
              this.mode = ViewMode.Init;
              return;
            }
            this.mode = ViewMode.Choose;
            break;
        }
        break;
    }
  }

  async createFactor() {
    // if (this.order.type === OrderType.Change) {
    //   this.calculateTotalCost(true);
    // }
    const model = {
      payNow: this.order.payNow,
      duration: this.order.duration,
      discountCode: this.order.discountCode,
      type: this.order.type,
      useWallet: this.order.useWallet,
      users: this.order.users,
      diskSpace: this.order.diskSpace,
      workPackage: this.order.workPackage,
      project: this.order.project,
      complexGroup: this.order.complexGroup,
      simpleGroup: this.order.simpleGroup,
    } as any;

    switch (this.order.type) {
      case OrderType.Patch:
        model.planId = this.data.mine.planId;
        break;
      case OrderType.Change:
        model.planId = this.selectedPlan.id;
        break;
      case OrderType.Renew:
        model.planId = this.data.mine.planId;
        break;
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
