import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { InviteViewModel } from '../../../view-models/auth/identity-types';
import { AccessType } from '../../../library/app/enums';

@Component({
  selector: 'app-invite-people',
  templateUrl: './invite-people.component.html',
  styleUrls: ['./invite-people.component.scss'],
})
export class InvitePeopleComponent implements OnInit {
  @Input() groups: InviteViewModel[];
  @Input() members: InviteViewModel[];
  @Output() groupsChange = new EventEmitter<InviteViewModel[]>();
  @Output() membersChange = new EventEmitter<InviteViewModel[]>();
  constructor() {}

  ngOnInit() {
    this.groups = this.groups || [];
    this.members = this.members || [];
  }

  updateGroups(groups: InviteViewModel[]) {
    this.groupsChange.emit(groups);
  }
  updateMembers(members: InviteViewModel[]) {
    this.members = members;
    this.membersChange.emit(members);
  }
}
