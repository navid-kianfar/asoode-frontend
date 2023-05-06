import { Component, Inject, OnInit } from '@angular/core';

import { InviteViewModel } from '../../../view-models/auth/identity-types';
import { OperationResultStatus } from '../../../shared/lib/enums/operation-result-status';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { InviteModalParameters } from '../../../view-models/modals/modals-types';

@Component({
  selector: 'app-invite-modal',
  templateUrl: './invite-modal.component.html',
  styleUrls: ['./invite-modal.component.scss'],
})
export class InviteModalComponent implements OnInit {
  constructor(
    public dialogRef: DialogRef<void>,
    @Inject(DIALOG_DATA) public data: InviteModalParameters
  ) {
  }
  actionWaiting: boolean;
  groups: InviteViewModel[];
  members: InviteViewModel[];
  newMembers: InviteViewModel[];

  ngOnInit() {
    this.data.exclude = [...this.data.exclude, ...this.data.existing.map(e => e.recordId)];
    this.groups = this.groups || [];
    this.members = this.members || [];
    this.newMembers = this.newMembers || [];
  }

  async onCancel($event: MouseEvent) {
    $event.stopPropagation();
    $event.preventDefault();
    this.dialogRef.close();
  }

  async invite($event: MouseEvent) {
    $event.stopPropagation();
    $event.preventDefault();
    if (
      !this.groups.length &&
      !this.members.length &&
      !this.newMembers.length
    ) {
      // TODO: show error
      return;
    }
    this.actionWaiting = true;
    const model = {} as any;
    model.groups = (this.groups || [])
      .filter(g => g.selected)
      .map(g => {
        return {
          id: g.id,
          access: g.access,
        };
      });
    model.members = (this.members || [])
      .filter(g => g.selected)
      .map(g => {
        return {
          id: g.id,
          access: g.access,
        };
      })
      .concat(
        (this.newMembers || []).map(m => {
          return {
            id: m.id,
            access: m.access,
          };
        }),
      );
    const op = await this.data.handler(model);
    this.actionWaiting = false;
    if (op.status === OperationResultStatus.Success) {
      this.dialogRef.close();
      return;
    }
    // TODO: handle error
  }
}
