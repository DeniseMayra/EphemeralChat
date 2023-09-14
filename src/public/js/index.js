const socket = io();
let user = '';
const userElement = document.getElementById('user-name');
const messageElement = document.getElementById('input-msg');
const sendElement = document.getElementById('send');
const chatElement = document.getElementById('chat');


Swal.fire({
  title: 'Chat',
  text: 'Ingrese nombre',
  input: 'text',
  inputValidator: (value) => {
    return !value && 'Nombre Requerido'
  },
  allowOutsideClick: false,
  allowEscapeKey: false
}).then((inputValue) => {
  user = inputValue.value;
  userElement.innerHTML = user;
  socket.emit('newUser', user);
});

sendElement.addEventListener('click', () => {
  const objectToSend = {user, message: messageElement.value};
  socket.emit('message', objectToSend);
  messageElement.value = '';
});

socket.on('history', (data) => {
  agregarHtml(data);
});

function agregarHtml(data){
  let history = '';
  data.forEach(ele => {
    history += `<p> ${ele.user} >>> ${ele.message}</p>`;
  });
  chatElement.innerHTML = history;
}

socket.on('newUserNotification', (data) => {
  if (user) {
    Swal.fire({
      text: data,
      toast: true,
      position: 'top-right'
    });
  }
});
