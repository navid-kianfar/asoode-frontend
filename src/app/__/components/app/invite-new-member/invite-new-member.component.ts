import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AccessType } from '../../../../shared/lib/enums/enums';
import {
  InviteViewModel,
  MemberInfoViewModel,
} from '../../../../view-models/auth/identity-types';
import { ValidationService } from '../../../../shared/services/validation.service';
import { NotificationService } from '../../../../shared/services/notification.service';

@Component({
  selector: 'app-invite-new-member',
  templateUrl: './invite-new-member.component.html',
  styleUrls: ['./invite-new-member.component.scss'],
})
export class InviteNewMemberComponent implements OnInit {
  @Input() exclude: string[];
  @Input() members: InviteViewModel[];
  @Output() membersChange = new EventEmitter<InviteViewModel[]>();

  AccessType = AccessType;
  current: MemberInfoViewModel;
  currentRole: AccessType;
  currentEmail: string;

  constructor(private readonly notificationService: NotificationService) {}

  ngOnInit() {
    this.currentRole = AccessType.Editor;
    this.members = this.members || [];
  }

  addMember() {
    const model = this.current
      ? { ...this.current }
      : ({
          email: this.currentEmail,
          fullName: 'UNKNOWN',
          initials: 'UK',
        } as MemberInfoViewModel);

    if (!ValidationService.isEmail(model.email)) {
      this.notificationService.error('EMAIL_INVALID');
      return;
    }
    if (
      this.exclude.indexOf(model.id) !== -1 ||
      this.exclude.indexOf(model.email) !== -1
    ) {
      this.notificationService.error('MEMBER_EXISTS');
      return;
    }
    const found = this.members.find(m => {
      return (
        m.model.email.toLowerCase().trim() ===
        this.currentEmail.toLowerCase().trim()
      );
    });
    if (found) {
      return;
    }
    const members: InviteViewModel[] = [
      ...this.members,
      {
        model,
        access: this.currentRole,
        id: model.id || model.email,
      },
    ];
    this.currentRole = AccessType.Editor;
    this.currentEmail = '';
    this.members = members;
    this.membersChange.emit(members);
  }

  remove(member: InviteViewModel) {
    const filtered = this.members.filter(m => m !== member);
    this.members = filtered;
    this.membersChange.emit(filtered);
  }
}
