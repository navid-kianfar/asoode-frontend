import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CaptchaService } from '../../../services/core/captcha.service';
import { Subscription } from 'rxjs';
import { CaptchaObject } from '../../../view-models/core/captcha-types';
import { OperationResultStatus } from '../../../library/core/enums';

@Component({
  selector: 'app-captcha',
  templateUrl: './captcha.component.html',
  styleUrls: ['./captcha.component.scss']
})
export class CaptchaComponent implements OnInit, OnDestroy {

  @Output() modelChange = new EventEmitter<CaptchaObject>();
  @Input() model: CaptchaObject;
  @Input() disabled: boolean;
  @Input() cssClass: string;

  image: string;
  waiting: boolean;
  subscription: Subscription;
  focusState: string;

  constructor(private readonly service: CaptchaService) {}

  ngOnInit() {
    this.model = this.model || {
      code: '',
      token: '',
      expire: '',
    };
    this.modelChange.emit(this.model);
    if (this.disabled === undefined) {
      this.disabled = false;
    }
    this.generate();
    this.subscription = this.service.trigger.subscribe(() =>
      this.generate(),
    );
  }

  async generate() {
    this.waiting = true;
    this.image = '';
    const model = { code: '', token: '', expire: '' };
    const op = await this.service.generate();
    this.waiting = false;
    if (op.status === OperationResultStatus.Success) {
      this.image = op.data.image;
      model.token = op.data.token;
      model.expire = op.data.expire;
    }
    this.modelChange.emit(model);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onFocus() {
    this.focusState = 'focus';
  }
  onBlur() {
    this.focusState = 'blur';
  }
}
