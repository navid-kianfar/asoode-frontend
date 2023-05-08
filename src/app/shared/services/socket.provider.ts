import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { v4 as Guid } from 'uuid';
import { IdentityService } from '../../auth/services/identity.service';
import { environment } from '../../../environments/environment';
import { NetworkService } from './network.service';

let deviceId = localStorage.getItem('DEVICE_ID') || Guid();
localStorage.setItem('DEVICE_ID', deviceId);


@Injectable()
export class PanelSocketProvider extends Socket {
  constructor(
    private readonly identityService: IdentityService,
    private readonly networkService: NetworkService,
  ) {
    super({
      url: environment.socket_endpoint,
      options: {
        query: {
          userId: identityService.identity.userId,
          sessionId: Guid(),
          deviceId: deviceId,
        },
      },
    });
    if (!environment.socket_disabled) {
      this.on('connect', () => {
        this.networkService.socketConnected();
      });
      this.on('connect_error', error => {
        if (error.message === 'xhr poll error') {
          this.networkService.socketDisconnected();
        } else {
          this.networkService.socketError(error);
        }
      });
      this.on('connect_timeout', error => {
        this.networkService.socketError(error);
      });
      this.on('error', error => {
        this.networkService.socketError(error);
      });
    }
  }
}
