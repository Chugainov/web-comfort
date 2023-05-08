importScripts('../shared/dexie.js');

self.addEventListener('install', function(event) {
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  if (self.clients && clients.claim) {
      clients.claim();
  }
});

self.addEventListener('sync', function(event) {
  event.waitUntil(sendToChat());
});

function sendToChat()
{
  return new Dexie('UnsyncData').open().then(function (db) {
    const token = "696487450:AAHkp3Dh2Akp0lXFrjevLicuSoFbV3I2XAc";
    const chat_id = "@tkitreal";
    const params = {
      method: 'POST',
    }

    db.table('messages').each((item) => {

      fetch(`https://api.telegram.org/bot${token}/sendMessage?chat_id=${chat_id}&text=${item.text}`, params)
        .then(() => {
          new Dexie('UnsyncData').open().then(db => {
            db.table('notificationPermission').get(1).then((permission) => {
              if (permission.isAllowed) {
                self.registration.showNotification('Ваше обращение доставлено');
              }
            });
          });
        });
    });

    db.table('messages').clear();
  });
}
