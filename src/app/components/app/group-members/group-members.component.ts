import { Component, Input, OnInit } from '@angular/core';
import { GroupViewModel } from '../../../view-models/groups/group-types';
import { AccessType } from 'src/app/library/app/enums';

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
  constructor() {}

  ngOnInit() {
  }
}
