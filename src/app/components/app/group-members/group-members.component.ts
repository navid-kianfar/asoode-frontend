import {Component, Input, OnInit} from '@angular/core';
import {GroupViewModel} from '../../../view-models/groups/group-types';

@Component({
  selector: 'app-group-members',
  templateUrl: './group-members.component.html',
  styleUrls: ['./group-members.component.scss']
})
export class GroupMembersComponent implements OnInit {

  @Input() group: GroupViewModel;
  filter: string;
  query: string[] = ['fullName', 'username', 'email', 'phoneNumber', 'bio'];
  constructor() { }

  ngOnInit() {
  }

}
