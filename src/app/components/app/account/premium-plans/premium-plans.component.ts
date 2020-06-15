import { Component, OnInit } from '@angular/core';
import { IdentityService } from '../../../../services/auth/identity.service';
import { PlanType } from 'src/app/library/app/enums';
import { UpgradeComponent } from '../../../../modals/upgrade/upgrade.component';
import { ModalService } from '../../../../services/core/modal.service';
import { NumberHelpers } from '../../../../helpers/number.helpers';

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
      this.identityService.profile.plan.totalSpace
    );
  }

  upgrade() {
    this.modalService.show(UpgradeComponent).subscribe(() => {});
  }
}
