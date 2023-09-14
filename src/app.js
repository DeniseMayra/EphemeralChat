import express from 'express';
import path from 'path';
import { engine } from 'express-handlebars';
import { __dirname } from './utils.js';
import { viewsRouter } from './routes/views.router.js';
import { Server } from 'socket.io';

const port = process.env.PORT || 8080;
const app = express();
const httpServer = app.listen(port, () => console.log('Server funcionando en el puerto ' + port));
const io = new Server(httpServer);

let conversation = [];
let usersConected = [];

// ------------ MIDDLEWARES ------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')));


// ------------ HBS VIEWS ------------
app.engine('.hbs', engine({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, '/views'));


// ------------ HBS VIEWS ------------
app.use(viewsRouter);


// ------------ SOCKET SERVER ------------
io.on('connection', (socket) => {
  socket.emit('history', conversation);

  socket.on('message', (data) => {
    conversation.push(data);

    io.emit('history', conversation);
  })

  socket.on('newUser', (data) => {
    usersConected.push(data);

    socket.broadcast.emit('newUserNotification', `Usuario ${data} conectado`);
  })
});

