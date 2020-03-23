import {Component, Input, OnInit} from '@angular/core';
import {GroupMemberViewModel, GroupViewModel,} from '../../../view-models/groups/group-types';
import {AccessType} from 'src/app/library/app/enums';
import {ModalService} from '../../../services/core/modal.service';
import {InviteModalComponent} from '../../../modals/invite-modal/invite-modal.component';
import {OperationResult} from '../../../library/core/operation-result';
import {GroupService} from '../../../services/groups/group.service';
import {OperationResultStatus} from '../../../library/core/enums';

@Component({
  selector: 'app-group-members',
  templateUrl: './group-members.component.html',
  styleUrls: ['./group-members.component.scss'],
})
export class GroupMembersComponent implements OnInit {
  @Input() group: GroupViewModel;
  @Input() permission: AccessType;
  AccessType = AccessType;
  filter: string;
  constructor(
    private readonly modalService: ModalService,
    private readonly groupService: GroupService,
  ) {}

  ngOnInit() {}

  invite() {
    this.modalService
      .show(InviteModalComponent, {
        existing: this.group.members,
        exclude: [this.group.userId, this.group.id],
        handler: async (access) => {
          return this.groupService.addAccess(this.group.id, access);
        }
      })
      .subscribe(() => { });
  }

  async removeAccess(member: GroupMemberViewModel) {
    member.waiting = true;
    const op = await this.groupService.removeAccess(member.id);
    member.waiting = false;
    if (op.status !== OperationResultStatus.Success) {
      // TODO: handle error
      return;
    }
    this.group.members = this.group.members.filter(g => g !== member);
  }

  async accessChange(member: GroupMemberViewModel, access: AccessType) {
    member.access = access;
    member.waiting = true;
    const op = await this.groupService.changeAccess(member.id, {access});
    member.waiting = false;
    if (op.status !== OperationResultStatus.Success) {
      // TODO: handle error
      return;
    }
  }
  transferOwnership(member: GroupMemberViewModel) {}

  canRemoveAccess(member: GroupMemberViewModel): boolean {
    if (member.access === AccessType.Owner) {
      return false;
    }
    return (
      this.permission === AccessType.Owner ||
      this.permission === AccessType.Admin
    );
  }

}
