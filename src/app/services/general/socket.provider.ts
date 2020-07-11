import { Inject, Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { IdentityService } from '../auth/identity.service';
import { environment } from '../../../environments/environment';
import {NetworkService} from '../core/network.service';

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
        },
      },
    });
    if (!environment.socket_disabled) {
      this.on('connect', () => {
        this.networkService.socketConnected();
      });
      this.on('connect_error', (error) => {
        if (error.message === 'xhr poll error') {
          this.networkService.socketDisconnected();
        } else {
          this.networkService.socketError(error);
        }
      });
      this.on('connect_timeout', (error) => {
        this.networkService.socketError(error);
      });
      this.on('error', (error) => {
        this.networkService.socketError(error);
      });
    }

  }
}
