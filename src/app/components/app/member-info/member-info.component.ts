import { Component, Input, OnInit } from '@angular/core';
import { MemberInfoViewModel } from '../../../view-models/auth/identity-types';
import {IdentityService} from '../../../services/auth/identity.service';

@Component({
  selector: 'app-member-info',
  templateUrl: './member-info.component.html',
  styleUrls: ['./member-info.component.scss'],
})
export class MemberInfoComponent implements OnInit {
  @Input() model: MemberInfoViewModel;
  @Input() email: string;
  @Input() me: boolean;
  @Input() selected: boolean;
  @Input() small: boolean;
  @Input() cssClass: string;
  constructor(private readonly identityService: IdentityService) {}

  ngOnInit() {
    if (this.me) {
      this.model = this.identityService.profile;
    }
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
