import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AccessType } from '../../../library/app/enums';
import { ListViewModel } from '../../../view-models/core/list-types';
import {
  InviteMemberViewModel,
  MemberInfoViewModel,
} from '../../../view-models/auth/identity-types';
import { IdentityService } from '../../../services/auth/identity.service';

@Component({
  selector: 'app-invite-member',
  templateUrl: './invite-member.component.html',
  styleUrls: ['./invite-member.component.scss'],
})
export class InviteMemberComponent implements OnInit {
  @Input() addOwner: boolean;
  @Input() members: InviteMemberViewModel[];
  @Output() membersChange = new EventEmitter<InviteMemberViewModel[]>();

  AccessType = AccessType;
  roles: ListViewModel[];
  current: MemberInfoViewModel;
  currentRole: AccessType;
  currentEmail: string;

  constructor(private readonly identityService: IdentityService) {}

  ngOnInit() {
    this.currentRole = AccessType.Editor;
    if (!this.members) {
      this.members = [];
      if (this.addOwner) {
        this.members.push({
          ...this.identityService.profile,
          access: AccessType.Owner,
        });
      }
      this.membersChange.emit(this.members);
    } else {
      if (this.addOwner) {
        this.members.unshift({
          ...this.identityService.profile,
          access: AccessType.Owner,
        });
      }
      this.membersChange.emit(this.members);
    }
    this.roles = [
      {
        text: 'ENUMS_ACCESS_TYPE_ADMIN',
        value: AccessType.Admin,
        description: 'ACCESS_TYPE_ADMIN_DESCRIPTION',
      },
      {
        text: 'ENUMS_ACCESS_TYPE_EDITOR',
        value: AccessType.Editor,
        description: 'ACCESS_TYPE_EDITOR_DESCRIPTION',
      },
      {
        text: 'ENUMS_ACCESS_TYPE_HIDDEN_EDITOR',
        value: AccessType.HiddenEditor,
        description: 'ACCESS_TYPE_HIDDEN_EDITOR_DESCRIPTION',
      },
      {
        text: 'ENUMS_ACCESS_TYPE_VISITOR',
        value: AccessType.Visitor,
        description: 'ACCESS_TYPE_VISITOR_DESCRIPTION',
      },
    ];
  }

  memberPicked(member: MemberInfoViewModel) {
    this.current = member;
    console.log(member);
  }

  startModify(text: string) {
    this.current = undefined;
  }

  addMember() {
    if (this.current) {
      this.members.push({
        ...this.current,
        access: this.currentRole,
      });
      this.current = undefined;
    } else {
      this.members.push({
        access: this.currentRole,
        email: this.currentEmail,
        fullName: 'UNKNOWN',
        initials: 'UK',
      } as InviteMemberViewModel);
    }
    this.currentRole = AccessType.Editor;
    this.currentEmail = '';
  }
}
