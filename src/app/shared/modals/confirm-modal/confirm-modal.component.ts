import {Component, Inject, OnInit} from '@angular/core';
import {DIALOG_DATA, DialogRef} from '@angular/cdk/dialog';
import { ConfirmModalRequest, ConfirmModalResponse } from '../../../view-models/core/modal-dtos';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent implements OnInit {
  agreed: boolean = false;
  option: any = undefined;

  constructor(
    public dialogRef: DialogRef<ConfirmModalResponse>,
    @Inject(DIALOG_DATA) public data: ConfirmModalRequest
  ) { }

  ngOnInit(): void {
    this.data.cancelLabel = this.data.cancelLabel || 'Cancel';
    this.data.confirmLabel = this.data.confirmLabel || 'Confirm';
    this.data.icon = this.data.icon || 'ti ti-alert-octagon';
    if (this.data.options?.length) {
      this.option = this.data.options[0].value;
    }
  }

  onAgree($event: MouseEvent) {
    this.dialogRef.close({
      confirmed: true,
      agreed: this.agreed,
      option: this.option
    });
  }

  onCancel($event: MouseEvent) {
    this.dialogRef.close({
      confirmed: false,
      agreed: false,
      option: undefined
    });
  }
}
