const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');

const { addUser, removeUser, getUser, getUsersInRoom } = require('./models/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const defaultRoom = "room 1";

app.use(cors());

io.on('connect', (socket) => {
  socket.on('join', ({ name, room }, callback) => {

    const { error, user } = addUser({ id: socket.id, name, room });

    console.log(name + ", " + room)

    if(error) return callback(error);

    socket.join(user.room);

    socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.room}.`});
    socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });

    io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });

    callback();
  });

  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit('message', { user: user.name, text: message });

    callback();
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if(user) {
      io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
      io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
    }
  })
});


server.listen(3000, () => {
  console.log('listening on *:3000');
});

/* create a sub
app.post('/api/subs', (req, res) => {
    console.log(req.body)
    Subscribers.create(req.body)
        .then(subs => res.json(subs))
})

// get all sub
app.get('/api/subs', (req, res) => {
    Subscribers.findAll().then(subs => res.json(subs))
})

// get with prenumeration number
app.get('/api/subs/:prenNmr?', (req, res) => {
    Subscribers.findAll({
        where: { id: req.params.prenNmr }
    }).then(subs => res.json(subs))
})

app.put('/api/subs/:id?', (req, res) => {
  const id = req.params.id;

  Subscribers.update(req.body, {
    where: { id: id }
  }).then(sub => res.json(sub))
})

app.put('/api/subs/firstName/:firstName?', (req, res) => {
  const id = req.params.firstName;

  Blog.update(req.body, {
    where: { firstName: id }
  })
})

app.put('/api/subs/lastName/:lastName?', (req, res) => {
  const id = req.params.lastName;

  Blog.update(req.body, {
    where: { lastName: id }
  })
})

app.put('/api/subs/adress/:adress?', (req, res) => {
  const id = req.params.adress;

  Blog.update(req.body, {
    where: { adress: id }
  })
})

app.put('/api/subs/postalCode/:postalCode?', (req, res) => {
  const id = req.params.postalCode;

  Blog.update(req.body, {
    where: { postalCode: id }
  })
})*/

/*app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});*/
