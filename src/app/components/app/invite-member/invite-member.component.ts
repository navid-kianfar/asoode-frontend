import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AccessType } from '../../../library/app/enums';
import {
  InviteViewModel,
  MemberInfoViewModel,
} from '../../../view-models/auth/identity-types';

@Component({
  selector: 'app-invite-member',
  templateUrl: './invite-member.component.html',
  styleUrls: ['./invite-member.component.scss'],
})
export class InviteMemberComponent implements OnInit {
  @Input() members: InviteViewModel[];
  @Output() membersChange = new EventEmitter<InviteViewModel[]>();

  AccessType = AccessType;
  current: MemberInfoViewModel;
  currentRole: AccessType;
  currentEmail: string;

  constructor() {}

  ngOnInit() {
    this.currentRole = AccessType.Editor;
    this.members = this.members || [];
  }

  addMember() {
    const model = this.current ? { ...this.current } : {
      email: this.currentEmail,
      fullName: 'UNKNOWN',
      initials: 'UK',
    } as MemberInfoViewModel;
    const found = this.members.find(m => {
      return m.model.email.toLowerCase().trim() === this.currentEmail.toLowerCase().trim();
    });
    if (found) { return; }
    const members: InviteViewModel[] = [
      ...this.members,
      {
        model,
        access: this.currentRole,
        id: model.id || model.email
      }
    ];
    this.currentRole = AccessType.Editor;
    this.currentEmail = '';
    this.membersChange.emit(members);
  }

  remove(member: InviteViewModel) {
    const filtered = this.members.filter(m => m !== member);
    this.membersChange.emit(filtered);
  }
}
