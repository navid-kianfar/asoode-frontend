import { EventEmitter, Injectable } from '@angular/core';
import { fromEvent, merge, Observable, Observer } from 'rxjs';
import { map } from 'rxjs/operators';
import { ModalService } from './modal.service';

@Injectable({
  providedIn: 'root',
})
export class NetworkService {
  isOnline: boolean;
  isConnected: boolean;
  networkChanged = new EventEmitter<boolean>();
  connectionChanged = new EventEmitter<boolean>();

  constructor() {
    this.internetListener().subscribe(value => {
      console.log(value ? 'online' : 'offline');
      this.networkChanged.emit(value);
    });
  }

  private internetListener() {
    return merge<boolean>(
      fromEvent(window, 'offline').pipe(map(() => false)),
      fromEvent(window, 'online').pipe(map(() => true)),
      new Observable((sub: Observer<boolean>) => {
        sub.next(navigator.onLine);
        sub.complete();
      }),
    );
  }

  socketConnected() {
    this.isConnected = true;
    console.log('socket connected');
    this.connectionChanged.emit(true);
  }

  socketDisconnected() {
    this.isConnected = false;
    console.log('socket disconnected');
    this.connectionChanged.emit(false);
  }

  socketError(error) {
    this.isConnected = false;
    console.log('socket error');
    this.connectionChanged.emit(false);
  }
}
