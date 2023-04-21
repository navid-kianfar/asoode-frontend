import {
  CostUnit,
  OrderDuration,
  OrderType,
  PlanType,
} from '../../shared/lib/enums/enums-2';
import { BaseViewModel } from '../core/general-types';

export interface UserPlanInfoViewModel extends BaseViewModel {
  expireAt?: Date;
  canUse?: boolean;
  userId: string;
  planId: string;
  title: string;
  description: string;
  picture: string;
  type: PlanType;
  unit: CostUnit;
  space: number;
  enabled: boolean;
  oneTime: boolean;
  canExtend: boolean;
  days: number;
  attachmentSize: number;
  planCost: number;
  users: number;
  workPackage: number;
  project: number;
  simpleGroup: number;
  complexGroup: number;
  additionalWorkPackageCost: number;
  additionalUserCost: number;
  additionalSpaceCost: number;
  additionalProjectCost: number;
  additionalSimpleGroupCost: number;
  additionalComplexGroupCost: number;
  usedUser: number;
  usedSpace: number;
  usedProject: number;
  usedSimpleGroup: number;
  usedComplexGroup: number;
  usedWorkPackage: number;
  featureCustomField: boolean;
  featureTimeSpent: boolean;
  featureTimeValue: boolean;
  featureTimeOff: boolean;
  featureShift: boolean;
  featureReports: boolean;
  featurePayments: boolean;
  featureChat: boolean;
  featureFiles: boolean;
  featureWbs: boolean;
  featureRoadMap: boolean;
  featureTree: boolean;
  featureObjectives: boolean;
  featureSeasons: boolean;
  featureVote: boolean;
  featureSubTask: boolean;
  featureKartabl: boolean;
  featureCalendar: boolean;
  featureBlocking: boolean;
  featureRelated: boolean;
  featureComplexGroup: boolean;
  featureGroupTimeSpent: boolean;
}
export interface PlanViewModel extends BaseViewModel {
  canUse?: boolean;
  title: string;
  description: string;
  picture: string;
  type: PlanType;
  unit: CostUnit;
  enabled: boolean;
  oneTime: boolean;
  order: number;
  days: number;
  attachmentSize: number;
  planCost: number;
  canExtend: boolean;
  diskSpace: number;
  users: number;
  workPackage: number;
  project: number;
  simpleGroup: number;
  complexGroup: number;
  additionalWorkPackageCost: number;
  additionalUserCost: number;
  additionalSpaceCost: number;
  additionalProjectCost: number;
  additionalSimpleGroupCost: number;
  additionalComplexGroupCost: number;
  featureCustomField: boolean;
  featureTimeSpent: boolean;
  featureTimeValue: boolean;
  featureTimeOff: boolean;
  featureShift: boolean;
  featureReports: boolean;
  featurePayments: boolean;
  featureChat: boolean;
  featureFiles: boolean;
  featureWbs: boolean;
  featureRoadMap: boolean;
  featureTree: boolean;
  featureObjectives: boolean;
  featureSeasons: boolean;
  featureVote: boolean;
  featureSubTask: boolean;
  featureKartabl: boolean;
  featureCalendar: boolean;
  featureBlocking: boolean;
  featureRelated: boolean;
  featureComplexGroup: boolean;
  featureGroupTimeSpent: boolean;
}
export interface PlansFetchViewModel {
  mine: UserPlanInfoViewModel;
  plans: PlanViewModel[];
  valueAdded: number;
}
export interface OrderViewModel {
  duration: OrderDuration;
  useWallet: boolean;
  type: OrderType;
  spaceCost: number;
  usersCost: number;
  simpleGroupCost: number;
  complexGroupCost: number;
  workPackageCost: number;
  projectCost: number;
  calculatedPrice: number;
  payNow: boolean;
  discountCode: string;
  valueAdded: number;
  appliedDiscount: number;
  users: number;
  diskSpace: number;
  workPackage: number;
  project: number;
  complexGroup: number;
  simpleGroup: number;
}
