import { Component, Input, OnInit } from '@angular/core';
import { MemberInfoViewModel } from '../../../view-models/auth/identity-types';

@Component({
  selector: 'app-member-info',
  templateUrl: './member-info.component.html',
  styleUrls: ['./member-info.component.scss'],
})
export class MemberInfoComponent implements OnInit {
  @Input() model: MemberInfoViewModel;
  @Input() email: string;
  @Input() selected: boolean;
  @Input() small: boolean;
  @Input() cssClass: string;
  constructor() {}

  ngOnInit() {
    if (this.email) {
      this.model = {
        email: this.email,
        id: this.email,
        username: this.email,
        fullName: '',
        lastName: '',
        firstName: '',
        initials: '',
        avatar: '',
        bio: ''
      };
    }
    this.cssClass = `${this.cssClass} member-info`;
  }
}
