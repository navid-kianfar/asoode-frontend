import { Component, OnInit } from '@angular/core';
import {IdentityService} from '../../../../services/auth/identity.service';
import { PlanType } from 'src/app/library/app/enums';

@Component({
  selector: 'app-premium-plans',
  templateUrl: './premium-plans.component.html',
  styleUrls: ['./premium-plans.component.scss'],
})
export class PremiumPlansComponent implements OnInit {
  constructor(readonly identityService: IdentityService) {}
  PlanType = PlanType;
  ngOnInit() {}
}
