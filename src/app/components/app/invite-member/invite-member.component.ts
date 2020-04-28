import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { InviteViewModel } from '../../../view-models/auth/identity-types';
import { AccessType } from 'src/app/library/app/enums';

@Component({
  selector: 'app-invite-member',
  templateUrl: './invite-member.component.html',
  styleUrls: ['./invite-member.component.scss'],
})
export class InviteMemberComponent implements OnInit {
  @Input() exclude: string[];
  @Input() members: InviteViewModel[];
  @Output() membersChange = new EventEmitter<InviteViewModel[]>();
  AccessType = AccessType;
  constructor() {}

  ngOnInit() {}
}
