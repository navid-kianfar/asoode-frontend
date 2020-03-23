import { Component, Input, OnInit } from '@angular/core';
import {
  GroupMemberViewModel,
  GroupViewModel,
} from '../../../view-models/groups/group-types';
import { AccessType } from 'src/app/library/app/enums';
import { ModalService } from '../../../services/core/modal.service';
import { InviteModalComponent } from '../../../modals/invite-modal/invite-modal.component';

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
  query: string[] = ['fullName', 'username', 'email', 'phoneNumber', 'bio'];
  constructor(private readonly modalService: ModalService) {}

  ngOnInit() {}

  invite() {
    this.modalService
      .show(InviteModalComponent, {
        existing: this.group.members,
        exclude: [this.group.userId, this.group.id],
      })
      .subscribe(() => {});
  }

  canRemoveAccess(member: GroupMemberViewModel): boolean {
    if (member.access === AccessType.Owner) {
      return false;
    }
    return (
      this.permission === AccessType.Owner ||
      this.permission === AccessType.Admin
    );
  }

  removeAccess(member: GroupMemberViewModel) {}

  transferOwnership(member: GroupMemberViewModel) {}
}
