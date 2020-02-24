import { Component, OnInit } from '@angular/core';
import { SimpleModalComponent } from 'ngx-simple-modal';
import { ModalParameters } from '../../view-models/core/modal-types';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss'],
})
export class ConfirmComponent
  extends SimpleModalComponent<ModalParameters, boolean>
  implements OnInit {
  cancel?: () => Promise<any>;
  action?: () => Promise<any>;
  cssClass?: string;
  icon?: string;
  title?: string;
  message?: string;
  actionLabel?: string;
  cancelLabel?: string;
  actionWaiting: boolean;
  cancelWaiting: boolean;

  constructor() {
    super();
  }

  ngOnInit() {}

  async onAction($event: MouseEvent) {
    $event.stopPropagation();
    $event.preventDefault();
    this.actionWaiting = true;
    await this.action().then(
      () => {
        this.actionWaiting = false;
        this.result = true;
        this.close();
      },
      () => {
        this.actionWaiting = false;
      },
    );
  }

  async onCancel($event: MouseEvent) {
    $event.stopPropagation();
    $event.preventDefault();
    this.cancelWaiting = true;
    await this.cancel().then(
      () => {
        this.cancelWaiting = false;
        this.result = false;
        this.close();
      },
      () => {
        this.cancelWaiting = false;
      },
    );
  }
}
