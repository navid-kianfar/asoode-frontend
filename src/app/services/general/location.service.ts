import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  constructor() {
    this.support = 'geolocation' in navigator;
    this.granted = undefined;
    this.current = undefined;
  }
  support: boolean;
  granted?: boolean;
  current?: any;
  getCurrent(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      if (!this.support) {
        resolve(null);
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.granted = true;
          this.current = position;
          resolve(position);
        },
        () => {
          this.granted = false;
          resolve(null);
        },
      );
    });
  }
}
