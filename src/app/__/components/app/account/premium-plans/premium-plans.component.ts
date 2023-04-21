import { Component, OnInit } from '@angular/core';
import { IdentityService } from '../../../../../auth/services/identity.service';
import { PlanType } from 'src/app/shared/lib/enums/enums';
import { ModalService } from '../../../../../shared/services/modal.service';
import { NumberHelpers } from '../../../../../shared/helpers/number.helpers';

@Component({
  selector: 'app-premium-plans',
  templateUrl: './premium-plans.component.html',
  styleUrls: ['./premium-plans.component.scss'],
})
export class PremiumPlansComponent implements OnInit {
  constructor(
    readonly identityService: IdentityService,
    readonly modalService: ModalService,
  ) {}
  PlanType = PlanType;
  NumberHelpers = NumberHelpers;
  ngOnInit() {}

  calculateDiskSpace() {
    return (
      (this.identityService.profile.plan.usedSpace * 100) /
      this.identityService.profile.plan.space
    );
  }

  upgrade() {
    // this.modalService.show(UpgradeComponent).subscribe(() => {});
  }
}
