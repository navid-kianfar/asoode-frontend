import { Component, OnInit } from '@angular/core';
import {SimpleModalComponent} from 'ngx-simple-modal';
import { ChannelNotificationReceive } from 'src/app/library/app/enums';

@Component({
  selector: 'app-channel-setting',
  templateUrl: './channel-setting.component.html',
  styleUrls: ['./channel-setting.component.scss']
})
export class ChannelSettingComponent
  extends SimpleModalComponent<{}, boolean>
  implements OnInit {
  actionWaiting: boolean;
  receiveMode: ChannelNotificationReceive;
  ChannelNotificationReceive = ChannelNotificationReceive;
  skipMobile: boolean;
  skipDesktop: boolean;
  showSummary: boolean;
  constructor() { super(); }

  ngOnInit() {
  }

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
