import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ModalService } from '../../../services/core/modal.service';
import { MessengerSettingComponent } from '../../../modals/messenger-setting/messenger-setting.component';
import { ChannelViewModel } from '../../../view-models/communication/messenger-types';
import { MessengerService } from '../../../services/communication/messenger.service';
import { ProjectService } from '../../../services/projects/project.service';
import { GroupService } from '../../../services/groups/group.service';
import {IdentityService} from '../../../services/auth/identity.service';

const STORAGE_KEY = 'dashboard_bot_visible';

@Component({
  selector: 'app-messenger-shortcut',
  templateUrl: './messenger-shortcut.component.html',
  styleUrls: ['./messenger-shortcut.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MessengerShortcutComponent implements OnInit {
  @Input() dashboard: boolean;
  showMessages: boolean;
  current: ChannelViewModel;
  unread: number;

  constructor(
    private readonly router: Router,
    readonly modalService: ModalService,
    readonly messengerService: MessengerService,
    readonly projectService: ProjectService,
    readonly identityService: IdentityService,
    readonly groupService: GroupService,
  ) {}

  ngOnInit() {
    this.current = this.messengerService.channels.directs[0];
    const closed = localStorage.getItem(STORAGE_KEY);
    if (!closed && this.dashboard) {
      this.showMessages = true;
    }
    if (
      !this.projectService.projects.length &&
      !this.groupService.groups.length
    ) {
      this.dashboard = true;
    }
  }

  open() {
    if (this.dashboard) {
      this.showMessages = true;
      return;
    }
    this.router.navigateByUrl('/messenger');
  }

  hide() {
    if (this.dashboard) {
      localStorage.setItem(STORAGE_KEY, '1');
    }
    this.showMessages = false;
  }

  goToMessenger() {
    this.showMessages = false;
    this.router.navigateByUrl('/messenger');
  }

  setting() {
    this.modalService.show(MessengerSettingComponent, {}).subscribe(() => {});
  }
}
