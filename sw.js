// sw.js
self.addEventListener('push', function(event) {
    const data = event.data.json();
    const options = {
        body: data.body,
        icon: '/icon-192x192.png', // Icon for notification
        badge: '/icon-192x192.png', // Badge for Android
        data: { url: data.url } // URL to open when clicked
    };
    event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(clients.openWindow(event.notification.data.url || '/'));
});