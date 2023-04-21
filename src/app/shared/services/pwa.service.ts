// import { Inject, Injectable } from '@angular/core';
// import { DeviceDetectorService } from 'ngx-device-detector';
// import { CookieService } from 'ngx-cookie-service';
// import { HttpService } from './http.service';
// import { OperationResultStatus } from '../library/enums';
// import OperationResult from '../library/operation-result';
// import { IdentityService } from './identity.service';
//
// const PWA = 'PWA';
// const WORKER = '/service-worker.js';
//
// @Injectable({
//   providedIn: 'root',
// })
// export class PwaService {
//   isMobile: boolean;
//   installed: boolean;
//   platform: string;
//   android: boolean;
//   ios: boolean;
//   safari: boolean;
//   isTablet: boolean;
//   worker: any;
//   updateAvailable: boolean;
//   registry: ServiceWorkerRegistration;
//   oldKey: string;
//   key: string;
//   prepared: boolean;
//   constructor(
//     @Inject('env') readonly environment,
//     readonly detector: DeviceDetectorService,
//     readonly cookie: CookieService,
//     readonly httpService: HttpService,
//     readonly identityService: IdentityService,
//   ) {
//     if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
//       window.document.addEventListener(
//         'touchmove',
//         (e: any) => {
//           if ((e.touches && e.touches.length > 1) || e.scale !== 1) {
//             e.preventDefault();
//           }
//           document.body.style.transform = 'scale(1)';
//         },
//         { passive: false },
//       );
//     }
//
//     this.updateAvailable = false;
//     this.isTablet = this.detector.isTablet();
//     this.isMobile = this.detector.isMobile() || this.detector.isTablet();
//     this.installed = window.location.href.indexOf('pwa=true') !== -1;
//     this.platform = this.detector.os.toLowerCase();
//     this.android = this.isMobile && this.platform === 'android';
//     this.ios = this.isMobile && this.platform === 'ios';
//     this.safari = this.detector.browser === 'Safari';
//
//     if (!this.installed) {
//       const installed = this.cookie.get(PWA);
//       if (installed) {
//         this.installed = true;
//       }
//     } else {
//       const expireDate = new Date();
//       expireDate.setDate(expireDate.getDate() + 120);
//       this.cookie.set(PWA, PWA, expireDate, '/');
//     }
//     this.oldKey = '' + `PUSH-${this.identityService.userId}`;
//     this.key = '' + `PUSH-${this.identityService.userId}-DEVICE`;
//   }
//   refreshCache() {
//     // console.log('pwa');
//     // window.location.reload();
//   }
//   preparePushNotification(force: boolean = false): Promise<void> {
//     return new Promise<void>(resolve => {
//       if (!force) {
//         if (window.localStorage) {
//           if (window.localStorage.getItem(this.key)) {
//             this.prepared = true;
//             resolve();
//             return;
//           }
//           if (window.localStorage.getItem(this.oldKey)) {
//             window.localStorage.removeItem(this.oldKey);
//           } else {
//             resolve();
//             return;
//           }
//         }
//       }
//       this.registry.pushManager
//         .subscribe({
//           userVisibleOnly: true,
//           applicationServerKey: this.urlBase64ToUint8Array(
//             this.environment.vapid,
//           ),
//         })
//         .then(subscription => {
//           if (window.localStorage) {
//             window.localStorage.setItem(this.key, 'SYNCED');
//           }
//           this.prepared = true;
//           const json = subscription.toJSON();
//           const payload = {
//             endpoint: json.endpoint,
//             expirationTime: json.expirationTime,
//             auth: json.keys.auth,
//             p256dh: json.keys.p256dh,
//             browser: this.detector.browser,
//             desktop: this.detector.isDesktop(),
//             tablet: this.isTablet,
//             mobile: this.isMobile,
//             android: this.android,
//             ios: this.ios,
//             safari: this.safari,
//             platform: this.platform,
//             device: this.detector.device,
//           };
//           this.httpService
//             .post('/push-notification/register', payload)
//             .then((op: OperationResult<any>) => {
//               if (op.status !== OperationResultStatus.Success) {
//                 console.error('FAILED TO JOIN FOR NOTIFICATION...');
//                 resolve();
//                 return;
//               }
//               console.log('PUSH NOTIFICATION IS ENABLED...');
//             });
//         });
//     });
//   }
//   registerServiceWorker(panel: boolean = false) {
//     window.ononline = () => {
//       if (this.installed) {
//         this.refreshCache();
//       }
//     };
//     let refreshing;
//     if ('serviceWorker' in navigator) {
//       try {
//         navigator.serviceWorker
//           .register(WORKER, { scope: '/' })
//           .then(registry => {
//             this.registry = registry;
//             this.registry.addEventListener('updatefound', () => {
//               // An updated service worker has appeared in reg.installing!
//               this.worker = this.registry.installing;
//               this.worker.addEventListener('statechange', () => {
//                 // Has service worker state changed?
//                 switch (this.worker.state) {
//                   case 'installed':
//                     // There is a new service worker available, show the notification
//                     if (navigator.serviceWorker.controller) {
//                       this.updateAvailable = true;
//                     }
//                     break;
//                 }
//               });
//             });
//             navigator.serviceWorker.addEventListener('controllerchange', () => {
//               if (refreshing) {
//                 return;
//               }
//               this.refreshCache();
//               refreshing = true;
//             });
//             // TODO ; REMOVE THIS
//             if (panel) {
//               this.preparePushNotification();
//             }
//           });
//       } catch (e) {
//         console.error('FAILED TO REGISTER WORKER...');
//       }
//     }
//   }
//   urlBase64ToUint8Array(base64String) {
//     const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
//     const base64 = (base64String + padding)
//       .replace(/-/g, '+')
//       .replace(/_/g, '/');
//     const rawData = window.atob(base64);
//     const outputArray = new Uint8Array(rawData.length);
//     for (let i = 0; i < rawData.length; ++i) {
//       outputArray[i] = rawData.charCodeAt(i);
//     }
//     return outputArray;
//   }
// }
