import {Inject, Injectable} from '@angular/core';
import { Socket } from 'ngx-socket-io';
import {IdentityService} from './auth/identity.service';
import { environment } from '../../environments/environment';

@Injectable()
export class PanelSocketProvider extends Socket {
  constructor(
    private readonly identityService: IdentityService
  ) {
    super({
      url: environment.socket_endpoint,
      options: {
        query: {
          userId: identityService.identity.userId,
        },
      },
    });
  }
}
