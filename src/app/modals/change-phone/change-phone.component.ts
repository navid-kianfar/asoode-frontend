import { Component, OnInit } from '@angular/core';
import { SimpleModalComponent } from 'ngx-simple-modal';
import { ValidationService } from '../../services/core/validation.service';
import { IdentityService } from '../../services/auth/identity.service';
import { OperationResultStatus } from '../../library/core/enums';

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

  constructor(readonly identityService: IdentityService) {
    super();
  }

  ngOnInit() {}

  async onAction($event: MouseEvent) {
    $event.stopPropagation();
    $event.preventDefault();
    this.actionWaiting = true;
    const op = await this.identityService.confirmPhone({
      phone: this.newNumber,
      id: this.tokenId,
      code: this.verificationCode,
    });
    this.actionWaiting = false;
    if (op.status === OperationResultStatus.Success) {
      this.identityService.profile.phoneNumber = this.newNumber;
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
    }
  }

  async sendAgain() {}
}
