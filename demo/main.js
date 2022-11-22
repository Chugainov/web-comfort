const db = new Dexie("UnsyncData");

db
  .version(1)
  .stores({messages: 'text'});

function putToLocal(data) {
  return db
    .messages
    .put({text: data});
}

if ('serviceWorker' in navigator) {
  navigator
    .serviceWorker
    .register('./sw.js')
    .then(() => navigator.serviceWorker.ready)
    .then((registration) => {
      document
        .getElementById('send')
        .addEventListener('click', (e) => {
          e.preventDefault();
          const message = document
            .getElementById('msg')
            .value;

          putToLocal(message).then(()=> {
            return registration
              .sync
              .register(message)
              .then(() => {
                console.log('Sync registered');
              });
          }).then(() => {
            document
            .getElementById('msg')
            .value = '';
          });
        });
    });
} else {
  document
    .getElementById('send')
    .addEventListener('click', () => {
      console.log('Fallback to fetch the image as usual');
    });
}

function isOnline() {
  let connectionStatus = document.getElementById('connectionStatus');

  if (navigator.onLine) {
    connectionStatus.innerHTML = 'Вы онлайн!';
  } else {
    connectionStatus.innerHTML = 'Вы офлайн! <br>Сообщение будет отправлено, когда появится сеть!';
  }
}

window.addEventListener('online', isOnline);
window.addEventListener('offline', isOnline);
isOnline();