import { EventEmitter, Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class SocketListenerService {

  readonly listener = new EventEmitter<any>();

  constructor(private readonly socket: Socket) {
    socket.on('activity', (payload) => {
      console.log(payload);
      this.listener.emit(payload);
    })
  }
}
