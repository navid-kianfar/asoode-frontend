import { Component, OnInit } from '@angular/core';
import { IdentityService } from '../../../services/auth/identity.service';
import { ModalService } from '../../../services/core/modal.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  constructor(
    public readonly identityService: IdentityService,
    public readonly modalService: ModalService,
    public readonly router: Router,
  ) {}

  ngOnInit() {}

  edit() {}

  logout() {
    this.modalService
      .confirm({
        title: 'MODALS_CONFIRM_TITLE',
        message: 'MODALS_CONFIRM_MESSAGE',
        actionLabel: 'LOGOUT',
        cancelLabel: 'CANCEL',
        action: async () => {
          this.identityService.logout();
          return Promise.resolve(true);
        },
      })
      .subscribe(async result => {
        if (!result) {
          return;
        }
        await this.router.navigateByUrl('/dashboard');
      });
  }
}
