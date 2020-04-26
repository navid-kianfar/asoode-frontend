import { Component, OnInit } from '@angular/core';
import { IdentityService } from '../../../services/auth/identity.service';
import { OperationResultStatus } from '../../../library/core/enums';
import { DeviceViewModel } from '../../../view-models/auth/identity-view-models';
import { SwPush } from '@angular/service-worker';
import { environment } from '../../../../environments/environment';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss'],
})
export class DevicesComponent implements OnInit {
  waiting: boolean;
  checkDevice: boolean;
  devices: any[];
  checkingDevice: boolean;

  constructor(
    private readonly identityService: IdentityService,
    private readonly swPush: SwPush,
    private readonly detector: DeviceDetectorService,
  ) {}

  ngOnInit() {
    this.fetch();
  }

  async fetch() {
    this.checkDevice = true;
    this.waiting = true;
    const op = await this.identityService.devices();
    this.waiting = false;
    if (op.status !== OperationResultStatus.Success) {
      // TODO: handle error
      return;
    }
    this.devices = op.data;
  }

  async checkThisDevice() {
    try {
      const subscription = await this.swPush.requestSubscription({
        serverPublicKey: environment.vapid,
      });
      const json = subscription.toJSON();
      const platform = this.detector.os.toLowerCase();
      const payload = {
        platform,
        endpoint: json.endpoint,
        expirationTime: json.expirationTime,
        auth: json.keys.auth,
        p256dh: json.keys.p256dh,
        browser: this.detector.browser,
        desktop: this.detector.isDesktop(),
        tablet: this.detector.isTablet(),
        mobile: this.detector.isMobile(),
        android: platform === 'android',
        ios: platform === 'ios',
        safari: this.detector.browser === 'Safari',
        device: this.detector.device,
      };
      console.log(subscription, payload);
      this.checkingDevice = true;
      const op = await this.identityService.addDevice(subscription);
      this.checkingDevice = false;
      if (op.status !== OperationResultStatus.Success) {
        // TODO: handle error
        return;
      }
      this.devices.push(op.data);
      this.checkDevice = true;
    } catch (e) {
      console.error(e);
    }
  }

  getIcon(device: DeviceViewModel): string {
    return 'ikon-android';
    // switch (device.os) {
    //   case '':
    //     break;
    // }
  }
}
