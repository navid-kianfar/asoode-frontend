// const cacheName = '2.0.0';
// const baseUrl = 'https://panel.asoode.com';
// const avatar = baseUrl + '/assets/images/logo-colored.png';
//
// self.addEventListener('install', event => {
//     self.skipWaiting();
//     event.waitUntil(caches.open(cacheName));
// });
// self.addEventListener('push', event => {
//     let data;
//     try {
//         data = event.data.json();
//     } catch (e) {
//         data = {
//             type: 0,
//             data: {},
//             push: {
//                 title: 'Error parsing JSON!',
//                 description: e.message,
//                 avatar: avatar,
//                 url: baseUrl
//             }
//         };
//     }
//     self.registration.showNotification(data.push.title, {
//         body: data.push.description,
//         icon: data.push.avatar || avatar,
//         data: data,
//         silent: false,
//         requireInteraction: true,
//         vibrate: [300, 100, 400],
//     }).catch(e => console.error(e));
// });
// self.addEventListener('notificationclick', (event) => {
//     const url = baseUrl + (event.notification.data.push.url || '');
//     event.notification.close();
//     event.waitUntil(
//         clients.matchAll({type: 'window'}).then( windowClients => {
//             for (let i = 0; i < windowClients.length; i++) {
//                 const client = windowClients[i];
//                 if (client.url === url && 'focus' in client) {
//                     return client.focus();
//                 }
//             }
//             if (clients.openWindow) {
//                 return clients.openWindow(url);
//             }
//         })
//     );
// });
// console.log('SERVICE WORKER IS RUNNING...');
