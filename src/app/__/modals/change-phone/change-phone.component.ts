import { Component, OnInit } from '@angular/core';
import { SimpleModalComponent } from 'ngx-simple-modal';
import { ValidationService } from '../../../shared/services/validation.service';
import { IdentityService } from '../../../auth/services/identity.service';

import { OperationResultStatus } from '../../../shared/lib/enums/operation-result-status';

@Component({
  selector: 'app-change-phone',
  templateUrl: './change-phone.component.html',
  styleUrls: ['./change-phone.component.scss'],
})
export class ChangePhoneComponent extends SimpleModalComponent<{}, string>
  implements OnInit {
  cancel?: () => Promise<any>;
  action?: () => Promise<any>;
  actionWaiting: boolean;
  sent: boolean;
  newNumber: string;
  verificationCode: string;
  tokenId: string;
  ValidationService = ValidationService;
  numberError: string;
  sendWaiting: boolean;
  remaining: number;
  handler: any;

  constructor(readonly identityService: IdentityService) {
    super();
  }

  ngOnInit() {}

  async onAction($event: MouseEvent) {
    $event.stopPropagation();
    $event.preventDefault();
    this.actionWaiting = true;
    const op = await this.identityService.confirmPhone({
      id: this.tokenId,
      code: this.verificationCode,
    });
    this.actionWaiting = false;
    if (op.status === OperationResultStatus.Success) {
      this.identityService.profile.phone = this.newNumber;
      this.identityService.profile.phoneConfirmed = true;
      this.result = this.newNumber;
      this.close();
      return;
    }
    // TODO: handle error
  }

  async onCancel($event: MouseEvent) {
    $event.stopPropagation();
    $event.preventDefault();
    this.close();
  }

  async sendVerificationCode() {
    if (!ValidationService.isMobile(this.newNumber)) {
      this.numberError = 'PHONE_INVALID';
      return;
    }
    this.numberError = '';
    this.sendWaiting = true;
    const op = await this.identityService.changePhone({
      phone: this.newNumber,
    });
    this.sendWaiting = false;
    if (op.status === OperationResultStatus.Duplicate) {
      this.numberError = 'PHONE_TAKEN';
      return;
    }
    if (op.status === OperationResultStatus.Success) {
      this.sent = true;
      this.tokenId = op.data;
      this.countDown();
    }
  }

  countDown() {
    this.remaining = 120;
    this.handler = setInterval(() => {
      this.remaining--;
      if (this.remaining === 0) {
        clearInterval(this.handler);
        this.handler = null;
      }
    }, 1000);
  }

  async sendAgain() {
    this.countDown();
  }
}
