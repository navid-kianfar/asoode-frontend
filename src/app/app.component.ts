import { Component } from '@angular/core';
import { AppInitializerProvider } from './services/app.initializer';
import { DeviceDetectorService } from 'ngx-device-detector';
import {Socket} from 'ngx-socket-io';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(
    private readonly device: DeviceDetectorService,
    readonly appInitializerProvider: AppInitializerProvider
  ) {
    const loader = document.getElementById('app-loading-container');
    document.body.removeChild(loader);
    document.body.className = `${document.body.className} ${this.device.os} ${this.device.browser}`.toLowerCase();
  }
}
