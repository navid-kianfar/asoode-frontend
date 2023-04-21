import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MemberInfoViewModel } from '../../../../view-models/auth/identity-types';
import { IdentityService } from '../../../../auth/services/identity.service';
import { UsersService } from '../../../../project/services/users.service';

@Component({
  selector: 'app-member-info',
  templateUrl: './member-info.component.html',
  styleUrls: ['./member-info.component.scss'],
})
export class MemberInfoComponent implements OnInit {
  @Input() model: MemberInfoViewModel;
  @Input() id: string;
  @Input() email: string;
  @Input() me: boolean;
  @Input() waiting: boolean;
  @Input() selected: boolean;
  @Input() small: boolean;
  @Input() cssClass: string;
  @Output() modelChange = new EventEmitter<MemberInfoViewModel>();
  constructor(
    private readonly identityService: IdentityService,
    private readonly usersService: UsersService,
  ) {}

  update() {
    setTimeout(() => {
      this.modelChange.emit(this.model);
    }, 100);
  }

  ngOnInit() {
    if (this.me) {
      this.model = this.identityService.profile;
      this.update();
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
        bio: '',
      };
      this.update();
    }
    this.cssClass = `${this.cssClass} member-info`;
    this.fetch();
  }

  async fetch() {
    if (this.id && !this.model) {
      this.waiting = true;
      this.model = await this.usersService.findUser(this.id);
      this.waiting = false;
      this.update();
    }
  }
}
