import { Component, Input, OnInit } from '@angular/core';
import { MemberInfoViewModel } from '../../../view-models/auth/identity-types';

@Component({
  selector: 'app-member-info',
  templateUrl: './member-info.component.html',
  styleUrls: ['./member-info.component.scss'],
})
export class MemberInfoComponent implements OnInit {
  @Input() model: MemberInfoViewModel;
  @Input() selected: boolean;
  @Input() small: boolean;
  constructor() {}

  ngOnInit() {}
}
