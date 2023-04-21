import {Component, Inject, OnInit} from '@angular/core';
import {DIALOG_DATA, DialogRef} from '@angular/cdk/dialog';
import { FormService } from '../../services/form.service';
import { PromptModalOptions } from '../../../view-models/core/modal-dtos';

@Component({
  selector: 'app-prompt',
  templateUrl: './prompt-modal.component.html',
  styleUrls: ['./prompt-modal.component.scss'],
})
export class PromptModalComponent implements OnInit
{
  constructor(
    private readonly formService: FormService,
    public dialogRef: DialogRef<any>,
    @Inject(DIALOG_DATA) public data: PromptModalOptions
  ) {
  }

  ngOnInit() {
    this.data.buttons = this.data.buttons || [];
    this.data.progress = this.data.progress || { uploading: false, uploadPercent: 0 };
    this.data.actionColor = this.data.actionColor || 'primary';
    this.data.cancel = this.data.cancel || (() => Promise.resolve());
    this.data.cancelLabel = this.data.cancelLabel || 'CANCEL';
    if (this.data.model) {
      this.formService.setModel(this.data.form, this.data.model);
    }
  }

  async onAction($event: MouseEvent) {
    $event.stopPropagation();
    $event.preventDefault();
    const model = this.formService.prepare(this.data.form);
    if (!model) {
      return;
    }
    this.data.actionWaiting = true;
    await this.data.action(model, this.data.form).then(
      () => {
        this.data.actionWaiting = false;
        this.dialogRef.close(model);
      },
      () => {
        this.data.actionWaiting = false;
      }
    );
  }

  async onCancel($event: MouseEvent) {
    $event.stopPropagation();
    $event.preventDefault();
    this.data.cancelWaiting = true;
    const model = this.formService.getModel(this.data.form);
    await this.data.cancel(model, this.data.form).then(
      () => {
        this.data.cancelWaiting = false;
        this.dialogRef.close();
      },
      () => {
        this.data.cancelWaiting = false;
      }
    );
  }
}
