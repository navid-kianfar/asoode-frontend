import { Component, OnInit } from '@angular/core';
import { SimpleModalComponent } from 'ngx-simple-modal';
import { InviteViewModel } from '../../view-models/auth/identity-types';
import { GroupService } from '../../services/groups/group.service';
import { OperationResult } from '../../library/core/operation-result';
import { OperationResultStatus } from '../../library/core/enums';

@Component({
  selector: 'app-invite-modal',
  templateUrl: './invite-modal.component.html',
  styleUrls: ['./invite-modal.component.scss'],
})
export class InviteModalComponent
  extends SimpleModalComponent<
    {
      existing: any[];
      exclude: string[];
      handler: (members) => Promise<OperationResult<boolean>>;
    },
    void
  >
  implements OnInit {
  constructor(private readonly groupService: GroupService) {
    super();
  }

  actionWaiting: boolean;
  members: InviteViewModel[];
  groups: InviteViewModel[];
  exclude: string[];
  existing: any[];
  handler: (members) => Promise<OperationResult<boolean>>;

  ngOnInit() {
    this.exclude = [...this.exclude, ...this.existing.map(e => e.recordId)];
  }

  async onCancel($event: MouseEvent) {
    $event.stopPropagation();
    $event.preventDefault();
    this.close();
  }

  async invite($event: MouseEvent) {
    $event.stopPropagation();
    $event.preventDefault();
    if (!this.groups.length && !this.members.length) {
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
    model.members = (this.members || []).map(m => {
      return {
        id: m.id,
        access: m.access,
      };
    });
    const op = await this.handler(model);
    this.actionWaiting = false;
    if (op.status === OperationResultStatus.Success) {
      this.close();
      return;
    }
    // TODO: handle error
  }
}
