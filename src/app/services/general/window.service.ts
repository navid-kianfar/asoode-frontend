import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WindowService {
  active: boolean;
  constructor() {
    this.active = true;
    window.addEventListener('focus', event => {
      this.active = true;
    });
    window.addEventListener('blur', event => {
      this.active = false;
    });
  }
}
