import { Component } from '@angular/core';
import { AppInitializerProvider } from './services/general/app.initializer';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Socket } from 'ngx-socket-io';
import { SwUpdate } from '@angular/service-worker';
import { NetworkService } from './services/core/network.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(
    readonly networkService: NetworkService,
    private readonly device: DeviceDetectorService,
    readonly appInitializerProvider: AppInitializerProvider,
    private readonly swUpdate: SwUpdate,
  ) {
    swUpdate.available.subscribe(event => {
      console.log('current version is', event.current);
      console.log('available version is', event.available);
    });
    swUpdate.activated.subscribe(event => {
      console.log('old version was', event.previous);
      console.log('new version is', event.current);
    });
    swUpdate.available.subscribe(event => {
      swUpdate.activateUpdate().then(() => this.updateApp());
    });

    const loader = document.getElementById('app-loading-container');
    document.body.removeChild(loader);
    document.body.className = `${document.body.className} ${this.device.os} ${this.device.browser}`.toLowerCase();
  }

  updateApp() {
    document.location.reload();
    console.log('The app is updating right now');
  }

  refresh() {
    window.location.reload();
  }
}
