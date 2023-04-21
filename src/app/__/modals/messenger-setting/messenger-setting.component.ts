import { Component, OnInit } from '@angular/core';

import { IdentityService } from '../../../auth/services/identity.service';
import { ChannelNotificationReceive } from '../../../shared/lib/enums/channels';

@Component({
  selector: 'app-channel-setting',
  templateUrl: './messenger-setting.component.html',
  styleUrls: ['./messenger-setting.component.scss'],
})
export class MessengerSettingComponent extends SimpleModalComponent<{}, boolean>
  implements OnInit {
  actionWaiting: boolean;
  receiveMode: ChannelNotificationReceive;
  ChannelNotificationReceive = ChannelNotificationReceive;
  skipMobile: boolean;
  skipDesktop: boolean;
  showSummary: boolean;
  constructor(readonly identityService: IdentityService) {
    super();
  }

  ngOnInit() {}

  async onAction($event: MouseEvent) {
    $event.stopPropagation();
    $event.preventDefault();
    this.actionWaiting = true;
    this.result = true;
    this.close();
  }

  async onCancel($event: MouseEvent) {
    $event.stopPropagation();
    $event.preventDefault();
    this.result = false;
    this.close();
  }
}
