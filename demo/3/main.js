const db = new Dexie("UnsyncData");

db
  .version(1)
  .stores({messages: 'text', notificationPermission: 'id, isAllowed'});

function putToLocal(data) {
  return db
    .messages
    .put({text: data});
}

function clearLocal() {
  document
    .getElementById('reject')
    .classList.add('reject--hidden');

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
            
            document
              .getElementById('reject')
              .classList.remove('reject--hidden');
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

document.getElementById('reject').addEventListener('click', clearLocal)

const notifyMeCheckbox = document.getElementById('notify-me');

function setPermission(data) {
  return db
    .notificationPermission
    .where("id")
    .equals(1)
    .modify({isAllowed: data});
}

notifyMeCheckbox.addEventListener('change', (event) => {
  if (event.currentTarget.checked) {

    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    } else if (Notification.permission === "granted") {
      setPermission(true);
    } else if (Notification.permission !== "denied") {

      Notification.requestPermission((permission) => {
        if (permission === "granted") {
          setPermission(true);
        } else {
          setPermission(false);
        }
      });
    }
  } else {
    setPermission(false);
  }
})

function isOnline() {
  let connectionStatus = document.getElementById('connectionStatus');
  const notifyMeElement = document.getElementById('notify-me-element');

  if (navigator.onLine) {
    connectionStatus.innerHTML = 'Вы онлайн! <br>Сообщение будет отправлено немедленно!';
    notifyMeElement.classList.add('notify-me-element--hidden');
  } else {
    connectionStatus.innerHTML = 'Вы офлайн! <br>Сообщение будет отправлено, когда появится сеть!';
    notifyMeElement.classList.remove('notify-me-element--hidden')
  }
}

window.addEventListener('online', isOnline);
window.addEventListener('offline', isOnline);
isOnline();

db
  .notificationPermission
  .put({ id: 1, isAllowed: false });