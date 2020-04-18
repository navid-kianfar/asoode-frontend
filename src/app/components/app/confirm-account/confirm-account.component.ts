import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ValidationService} from '../../../services/core/validation.service';
import {IdentityService} from '../../../services/auth/identity.service';
import {OperationResultStatus} from '../../../library/core/enums';
import {Router} from '@angular/router';
import {AppInitializerProvider} from '../../../services/general/app.initializer';

@Component({
  selector: 'app-confirm-account',
  templateUrl: './confirm-account.component.html',
  styleUrls: ['./confirm-account.component.scss'],
})
export class ConfirmAccountComponent implements OnInit {
  @Output() goBack = new EventEmitter();
  @Input() username: string;
  @Input() id: string;
  disabled: boolean;
  isEmail: boolean;
  remaining: number;
  handler: any;
  verificationCode: string;
  hasError: boolean;
  errorMessage: string;
  sendingAgain: boolean;

  constructor(
    private readonly identityService: IdentityService,
    private readonly router: Router,
    private readonly initializerProvider: AppInitializerProvider,
  ) {}

  ngOnInit() {
    this.errorMessage = '';
    this.isEmail = ValidationService.isEmail(this.username);
    this.countDown();
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
    this.sendingAgain = true;
    const op = await this.identityService.resendVerification(this.id);
    this.sendingAgain = false;
    if (op.status !== OperationResultStatus.Success) {
      // TODO: handle error
      return;
    }
    this.countDown();
  }

  async verify() {
    this.errorMessage = '';
    this.hasError = !ValidationService.validateToken(this.verificationCode);
    if (this.hasError) {
      this.errorMessage = 'VERIFICATION_CODE_INVALID';
      return;
    }
    this.disabled = true;
    const op = await this.identityService.verifyAccount({
      id: this.id,
      code: this.verificationCode,
    });
    if (op.status !== OperationResultStatus.Success) {
      // TODO: handle error
      return;
    }

    if (op.data.token) {
      await this.initializerProvider.refresh();
      await this.router.navigateByUrl('/dashboard');
      return;
    }
    this.disabled = false;

    if (op.data.smsFailed) {
      this.errorMessage = 'ACCOUNT_SMS_FAILED';
    } else {
      this.errorMessage = 'VERIFICATION_CODE_INVALID';
    }
  }
}
