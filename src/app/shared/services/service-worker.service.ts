// import { Injectable } from '@angular/core';
//
// const PWA = 'PWA';
// const WORKER = 'https://panel.asoode.com/assets/service-worker.js';
//
// @Injectable({
//   providedIn: 'root'
// })
// export class ServiceWorkerService {
//   worker: any;
//   registry: ServiceWorkerRegistration;
//   updateAvailable: boolean;
//   constructor() {
//     if ('serviceWorker' in navigator) {
//       navigator.serviceWorker
//         .register(WORKER, { scope: '/' })
//         .then(registry => {
//           this.registry = registry;
//           this.registry.addEventListener('updatefound', () => {
//             // An updated service worker has appeared in reg.installing!
//             this.worker = this.registry.installing;
//             this.worker.addEventListener('statechange', () => {
//               // Has service worker state changed?
//               switch (this.worker.state) {
//                 case 'installed':
//                   // There is a new service worker available, show the notification
//                   if (navigator.serviceWorker.controller) {
//                     this.updateAvailable = true;
//                   }
//                   break;
//               }
//             });
//           });
//           // navigator.serviceWorker.addEventListener('controllerchange', () => {
//           //
//           // });
//         }, (e) => console.error('FAILED TO REGISTER WORKER...', e.message));
//     }
//   }
// }
