import { Component, OnInit } from '@angular/core';
import { SimpleModalComponent } from 'ngx-simple-modal';
import { IdentityService } from '../../services/auth/identity.service';
import { OperationResultStatus } from '../../library/core/enums';
import { ValidationService } from 'src/app/services/core/validation.service';

@Component({
  selector: 'app-change-email',
  templateUrl: './change-email.component.html',
  styleUrls: ['./change-email.component.scss'],
})
export class ChangeEmailComponent extends SimpleModalComponent<{}, string>
  implements OnInit {
  cancel?: () => Promise<any>;
  action?: () => Promise<any>;
  actionWaiting: boolean;
  sent: boolean;
  newEmail: string;
  verificationCode: string;
  tokenId: string;
  ValidationService = ValidationService;
  emailError: string;
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
    const op = await this.identityService.confirmEmail({
      id: this.tokenId,
      code: this.verificationCode,
    });
    this.actionWaiting = false;
    if (op.status === OperationResultStatus.Success) {
      this.identityService.profile.email = this.newEmail;
      this.identityService.profile.emailConfirmed = true;
      this.result = this.newEmail;
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
    if (!ValidationService.isEmail(this.newEmail)) {
      this.emailError = 'EMAIL_INVALID';
      return;
    }
    this.emailError = '';
    this.sendWaiting = true;
    const op = await this.identityService.changeEmail({
      email: this.newEmail,
    });
    this.sendWaiting = false;
    if (op.status === OperationResultStatus.Duplicate) {
      this.emailError = 'EMAIL_TAKEN';
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
