import { Component, OnInit } from '@angular/core';
import { IdentityService } from '../../../../auth/services/identity.service';
import { DeviceViewModel } from '../../../../view-models/auth/identity-view-models';
import { SwPush } from '@angular/service-worker';
import { environment } from '../../../../../environments/environment';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ModalService } from '../../../../shared/services/modal.service';
import { StringHelpers } from '../../../../shared/helpers/string.helpers';
import { TranslateService } from '../../../../shared/services/translate.service';
import { PromptComponent } from '../../../../shared/modals/prompt/prompt.component';
import { PromptModalParameters } from '../../../../view-models/core/modal-types';
import { FormService } from '../../../../shared/services/form.service';
import { NotificationService } from '../../../../shared/services/notification.service';
import { Socket } from 'ngx-socket-io';
import { PushNotificationService } from '../../../../shared/services/push-notification.service';
import { ActivityType } from '../../../../shared/lib/enums/activity-type';
import { OperationResultStatus } from '../../../../shared/lib/enums/operation-result-status';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss'],
})
export class DevicesComponent implements OnInit {
  waiting: boolean;
  checkDevice: boolean;
  devices: DeviceViewModel[];
  checkingDevice: boolean;
  registered: any;

  constructor(
    private readonly identityService: IdentityService,
    private readonly swPush: SwPush,
    private readonly detector: DeviceDetectorService,
    private readonly modalService: ModalService,
    private readonly translateService: TranslateService,
    private readonly formService: FormService,
    private readonly notificationService: NotificationService,
    private readonly pushNotificationService: PushNotificationService,
    private readonly socket: Socket,
  ) {}

  ngOnInit() {
    this.fetch();
    this.bind();
  }
  bind() {
    this.socket.on('push-notification', (notification: any) => {
      let find: DeviceViewModel;
      switch (notification.type) {
        case ActivityType.AccountDeviceAdd:
          this.devices.push(notification.data);
          break;
        case ActivityType.AccountDeviceEdit:
          find = this.devices.find(d => d.id === notification.data.id);
          if (find) {
            Object.assign(find, notification.data);
          }
          break;
        case ActivityType.AccountDeviceRemove:
          this.devices = this.devices.filter(d => d.id !== notification.data);
          break;
      }
    });
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

  async checkOldSubscription() {
    return new Promise<void>((resolve, reject) => {
      if (this.swPush.isEnabled) {
        let ranAlready = false;
        this.swPush.subscription.subscribe(old => {
          if (old) {
            const json = old.toJSON();
            if (
              !ranAlready &&
              json.keys.p256dh &&
              json.keys.p256dh !== environment.vapid
            ) {
              ranAlready = true;
              console.log('SUBSCRIPTION_CHANGED!');
              old.unsubscribe();
            }
          }
          ranAlready = true;
          resolve();
        });
        return;
      }
      resolve();
    });
  }

  async checkThisDevice() {
    try {
      await this.checkOldSubscription();
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
      this.checkingDevice = true;
      const op = await this.identityService.addDevice(payload);
      this.checkingDevice = false;
      if (op.status !== OperationResultStatus.Success) {
        // TODO: handle error
        return;
      }
      this.checkDevice = true;
      if (this.registered) {
        return;
      }
      this.registered = this.swPush.messages.subscribe(notification => {
        this.pushNotificationService.handlePush(notification);
      });
      this.swPush.notificationClicks.subscribe(notification => {
        this.pushNotificationService.handlePushClick(notification);
      });
    } catch (e) {
      console.error(e);
    }
  }

  getIcon(device: DeviceViewModel): string {
    switch (device.os) {
      case 'android':
        return 'ikon-android';
      case 'ios':
        return 'ikon-ios';
      default:
        return 'ikon-display';
    }
  }

  prepareDelete(device: DeviceViewModel) {
    const heading = StringHelpers.format(
      this.translateService.fromKey('REMOVE_DEVICE_CONFIRM_HEADING'),
      [device.title || device.os],
    );
    this.modalService
      .confirm({
        title: 'REMOVE_DEVICE',
        message: 'REMOVE_DEVICE_CONFIRM',
        heading,
        actionLabel: 'REMOVE_DEVICE',
        cancelLabel: 'CANCEL',
        action: async () => {
          device.deleting = true;
          const op = await this.identityService.removeDevice(device.id);
          device.deleting = false;
          if (op.status !== OperationResultStatus.Success) {
            // TODO: handle error
            return;
          }
        },
      })
      .subscribe(() => {});
  }

  prepareRename(device: DeviceViewModel) {
    this.modalService
      .show(PromptComponent, {
        icon: this.getIcon(device),
        title: 'EDIT_DEVICE',
        form: [
          {
            elements: [
              this.formService.createInput({
                config: { field: 'title' },
                params: { model: device.title, placeHolder: 'TITLE' },
                validation: {
                  required: {
                    value: true,
                    message: 'TITLE_REQUIRED',
                  },
                },
              }),
            ],
          },
        ],
        action: async (params, form) => {
          device.editing = true;
          const op = await this.identityService.renameDevice(device.id, params);
          device.editing = false;
          if (op.status !== OperationResultStatus.Success) {
            // TODO: handle error
            return;
          }
          this.notificationService.success('GENERAL_SUCCESS');
        },
        actionLabel: 'SAVE_CHANGES',
        actionColor: 'primary',
      } as PromptModalParameters)
      .subscribe(() => {});
  }

  async prepareToggle(device: DeviceViewModel) {
    device.toggling = true;
    const op = await this.identityService.toggleDevice(device.id);
    device.toggling = false;
    if (op.status !== OperationResultStatus.Success) {
      // TODO: handle error
      return;
    }
    this.notificationService.success('GENERAL_SUCCESS');
  }
}
