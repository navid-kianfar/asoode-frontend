import { Component, Input, OnInit } from '@angular/core';
import {
  GroupMemberViewModel,
  GroupViewModel, PendingInvitationViewModel,
} from '../../../view-models/groups/group-types';
import { AccessType } from 'src/app/library/app/enums';
import { ModalService } from '../../../services/core/modal.service';
import { InviteModalComponent } from '../../../modals/invite-modal/invite-modal.component';
import { OperationResult } from '../../../library/core/operation-result';
import { GroupService } from '../../../services/groups/group.service';
import { OperationResultStatus } from '../../../library/core/enums';
import { TranslateService } from '../../../services/core/translate.service';
import { StringHelpers } from '../../../helpers/string.helpers';

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
    private readonly translateService: TranslateService,
  ) {}

  ngOnInit() {}

  invite() {
    this.modalService
      .show(InviteModalComponent, {
        noGroup: true,
        existing: this.group.members,
        exclude: [
          this.group.userId,
          this.group.id,
          ...this.group.pending.map(p => p.identifier)
        ],
        handler: async access => {
          return this.groupService.addAccess(this.group.id, access);
        },
      })
      .subscribe(() => {});
  }

  removeAccess(member: GroupMemberViewModel) {
    const heading = StringHelpers.format(
      this.translateService.fromKey('REMOVE_MEMBER_CONFIRM_HEADING'),
      [member.member.fullName],
    );
    this.modalService
      .confirm({
        title: 'REMOVE_ACCESS',
        message: 'REMOVE_MEMBER_CONFIRM',
        heading,
        actionLabel: 'REMOVE_ACCESS',
        cancelLabel: 'CANCEL',
        action: async () => OperationResult.Success(true),
      })
      .subscribe(async confirmed => {
        if (!confirmed) {
          return;
        }
        member.waiting = true;
        const op = await this.groupService.removeAccess(member.id);
        member.waiting = false;
        if (op.status !== OperationResultStatus.Success) {
          // TODO: handle error
          return;
        }
      });
  }

  async accessChange(member: GroupMemberViewModel, access: AccessType) {
    member.access = access;
    member.waiting = true;
    const op = await this.groupService.changeAccess(member.id, { access });
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

  canRemovePendingAccess(member: PendingInvitationViewModel) {
    if (member.access === AccessType.Owner) {
      return false;
    }
    return (
      this.permission === AccessType.Owner ||
      this.permission === AccessType.Admin
    );
  }

  async accessPendingChange(member: PendingInvitationViewModel, access: AccessType) {
    member.access = access;
    member.waiting = true;
    const op = await this.groupService.changePendingAccess(member.id, { access });
    member.waiting = false;
    if (op.status !== OperationResultStatus.Success) {
      // TODO: handle error
      return;
    }
  }

  removePendingAccess(member: PendingInvitationViewModel) {
    const heading = StringHelpers.format(
      this.translateService.fromKey('REMOVE_MEMBER_CONFIRM_HEADING'),
      [member.identifier],
    );
    this.modalService
      .confirm({
        title: 'REMOVE_ACCESS',
        message: 'REMOVE_MEMBER_CONFIRM',
        heading,
        actionLabel: 'REMOVE_ACCESS',
        cancelLabel: 'CANCEL',
        action: async () => OperationResult.Success(true),
      })
      .subscribe(async confirmed => {
        if (!confirmed) {
          return;
        }
        member.deleting = true;
        const op = await this.groupService.removePendingAccess(member.id);
        member.deleting = false;
        if (op.status !== OperationResultStatus.Success) {
          // TODO: handle error
          return;
        }
        this.group.pending = this.group.pending.filter(g => g !== member);
      });
  }
}
