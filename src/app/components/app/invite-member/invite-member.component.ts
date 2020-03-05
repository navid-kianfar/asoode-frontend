import {Component, Input, OnInit} from '@angular/core';
import {AccessType} from '../../../library/app/enums';
import {ListViewModel} from '../../../view-models/core/list-types';
import {MemberInfoViewModel} from '../../../view-models/auth/identity-types';

@Component({
  selector: 'app-invite-member',
  templateUrl: './invite-member.component.html',
  styleUrls: ['./invite-member.component.scss']
})
export class InviteMemberComponent implements OnInit {

  @Input() addOwner: boolean;

  AccessType = AccessType;
  roles: ListViewModel[];
  current: MemberInfoViewModel;

  constructor() { }

  ngOnInit() {
    this.roles = [
      {
        text: 'ENUMS_ACCESS_TYPE_ADMIN',
        value: AccessType.Admin,
        description: 'ACCESS_TYPE_ADMIN_DESCRIPTION'
      },
      {
        text: 'ENUMS_ACCESS_TYPE_EDITOR',
        value: AccessType.Editor,
        description: 'ACCESS_TYPE_EDITOR_DESCRIPTION'
      },
      {
        text: 'ENUMS_ACCESS_TYPE_HIDDEN_EDITOR',
        value: AccessType.HiddenEditor,
        description: 'ACCESS_TYPE_HIDDEN_EDITOR_DESCRIPTION'
      },
      {
        text: 'ENUMS_ACCESS_TYPE_VISITOR',
        value: AccessType.Visitor,
        description: 'ACCESS_TYPE_VISITOR_DESCRIPTION'
      }
    ];
  }

  memberPicked(member: MemberInfoViewModel) {
    this.current = member;
    console.log(member);
  }

  startModify(text: string) {
    this.current = undefined;
  }
}
