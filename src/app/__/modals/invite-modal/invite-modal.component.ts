import { Component, OnInit } from '@angular/core';

import { InviteViewModel } from '../../../view-models/auth/identity-types';
import { GroupService } from '../../../groups/services/group.service';
import { OperationResult } from '../../../shared/lib/operation-result';

import { OperationResultStatus } from '../../../shared/lib/enums/operation-result-status';

@Component({
  selector: 'app-invite-modal',
  templateUrl: './invite-modal.component.html',
  styleUrls: ['./invite-modal.component.scss'],
})
export class InviteModalComponent
  extends SimpleModalComponent<
    {
      noGroup: boolean;
      existing: any[];
      exclude: string[];
      projectId: string;
      handler: (members) => Promise<OperationResult<boolean>>;
    },
    void
  >
  implements OnInit {
  constructor(private readonly groupService: GroupService) {
    super();
  }

  noGroup: boolean;
  actionWaiting: boolean;
  members: InviteViewModel[];
  groups: InviteViewModel[];
  exclude: string[];
  existing: any[];
  projectId: string;
  handler: (members) => Promise<OperationResult<boolean>>;
  newMembers: InviteViewModel[];

  ngOnInit() {
    this.exclude = [...this.exclude, ...this.existing.map(e => e.recordId)];
    this.groups = this.groups || [];
    this.members = this.members || [];
    this.newMembers = this.newMembers || [];
  }

  async onCancel($event: MouseEvent) {
    $event.stopPropagation();
    $event.preventDefault();
    this.close();
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
    const op = await this.handler(model);
    this.actionWaiting = false;
    if (op.status === OperationResultStatus.Success) {
      this.close();
      return;
    }
    // TODO: handle error
  }
}
