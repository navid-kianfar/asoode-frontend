import { Component, OnInit } from '@angular/core';
import { SimpleModalComponent } from 'ngx-simple-modal';
import {
  PromptModalParameters,
  ModalProgress,
} from '../../view-models/core/modal-types';
import { FormService } from '../../services/core/form.service';
import { FormViewModel } from '../../components/core/form/contracts';

@Component({
  selector: 'app-prompt',
  templateUrl: './prompt.component.html',
  styleUrls: ['./prompt.component.scss'],
})
export class PromptComponent
  extends SimpleModalComponent<PromptModalParameters, boolean>
  implements OnInit {
  progress?: ModalProgress;
  cancel?: (params?: any, form?: FormViewModel[]) => Promise<any>;
  action?: (params: any, form: FormViewModel[]) => Promise<any>;
  cssClass?: string;
  form: FormViewModel[];
  title?: string;
  summary?: string;
  actionLabel?: string;
  cancelLabel?: string;
  actionWaiting: boolean;
  cancelWaiting: boolean;
  actionColor: any;
  width?: number;
  model?: any;

  constructor(private readonly formService: FormService) {
    super();
  }

  ngOnInit() {
    this.progress = this.progress || { uploading: false, uploadPercent: 0 };
    this.actionColor = this.actionColor || 'warn';
    this.cancel = this.cancel || (() => Promise.resolve());
    this.cancelLabel = this.cancelLabel || 'CANCEL';
    if (this.model) {
      this.formService.setModel(this.form, this.model);
    }
  }

  async onAction($event: MouseEvent) {
    $event.stopPropagation();
    $event.preventDefault();
    const model = this.formService.prepare(this.form);
    if (!model) {
      return;
    }
    this.actionWaiting = true;
    await this.action(model, this.form).then(
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
    const model = this.formService.getModel(this.form);
    await this.cancel(model, this.form).then(
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
