import {Component, Injector} from '@angular/core';
import { AppInitializerProvider } from './shared/services/app.initializer';
import { DeviceDetectorService } from 'ngx-device-detector';
import { SwUpdate } from '@angular/service-worker';
import { NetworkService } from './shared/services/network.service';
import { ModalService } from './shared/services/modal.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(
    readonly networkService: NetworkService,
    readonly modalService: ModalService,
    private readonly device: DeviceDetectorService,
    readonly appInitializerProvider: AppInitializerProvider,
    private readonly swUpdate: SwUpdate,
    private readonly injector: Injector,
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
      swUpdate.activateUpdate().then(() => {
        this.injector.get<ModalService>(ModalService).confirm({
          actionLabel: 'UPDATE_AVAILABLE',
          title: 'UPDATE_AVAILABLE',
          heading: 'UPDATE_AVAILABLE_HEADING',
          cancelLabel: 'LATER',
          action: async () => {
            setTimeout(() => document.location.reload(), 1000);
          }
        });
      });
    });

    // let subscription: any;
    // this.networkService.connectionChanged.subscribe(status => {
    //   if (status) {
    //     if (subscription) {
    //       subscription.unsubscribe();
    //       subscription = null;
    //     }
    //   } else {
    //     if (!subscription) {
    //       const offlineModal = this.modalService.show(OfflineComponent, {
    //         isConnected: this.networkService.isConnected,
    //         isOnline: this.networkService.isOnline,
    //       });
    //       subscription = offlineModal.subscribe(() => {});
    //     }
    //   }
    // });
    // this.networkService.networkChanged.subscribe(status => {
    //   if (status) {
    //     if (subscription) {
    //       subscription.unsubscribe();
    //       subscription = null;
    //     }
    //   } else {
    //     if (!subscription) {
    //       const offlineModal = this.modalService.show(OfflineComponent, {
    //         isConnected: this.networkService.isConnected,
    //         isOnline: this.networkService.isOnline,
    //       });
    //       subscription = offlineModal.subscribe(() => {});
    //     }
    //   }
    // });

    const loader = document.getElementById('app-loading-container');
    document.body.removeChild(loader);
    document.body.className = `${document.body.className} ${this.device.os} ${this.device.browser}`.toLowerCase();
  }

  refresh() {
    window.location.reload();
  }
}
