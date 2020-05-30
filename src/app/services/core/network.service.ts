import { Injectable } from '@angular/core';
import {fromEvent, merge, Observable, Observer} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  isOnline: boolean;

  constructor() {
    this.listener().subscribe((isOnline) => {
      this.isOnline = isOnline;
    });
  }

  listener() {
    return merge<boolean>(
      fromEvent(window, 'offline').pipe(map(() => false)),
      fromEvent(window, 'online').pipe(map(() => true)),
      new Observable((sub: Observer<boolean>) => {
        sub.next(navigator.onLine);
        sub.complete();
      }));
  }
}
