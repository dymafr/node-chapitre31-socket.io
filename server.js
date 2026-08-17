const express = require('express');
const path = require('path');
const { Server } = require('socket.io');
const app = express();
const server = app.listen(4001);

app.use(express.static(__dirname, { index: false }));

app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const ios = new Server(server);
const admin = ios.of('/admin');

// ios.use((socket, next) => {
//   if (!socket.handshake.auth.token) {
//     next(new Error("no token"));
//   } else {
//     next();
//   }
// });

ios.on('connect', (socket) => {
  socket.on('message', (msg) => {
    console.log(msg);
  });
});

admin.on('connect', async (socket) => {
  // Get all clients connected to namespace /admin.
  // allSockets() est dépréciée : fetchSockets() rend de vraies sockets,
  // sur lesquelles on peut lire les rooms et les données attachées.
  const sockets = await admin.fetchSockets();
  console.log(sockets.map((s) => s.id));

  socket.join('room');

  // Get all clients connected to room 'room' in namespace '/admin'
  const roomSockets = await admin.in('room').fetchSockets();
  console.log(roomSockets.map((s) => s.id));

  // Emit to all namespace's sockets
  admin.emit('message', 'un message');

  // Emit to all sockets connected in room in namespace '/admin'
  admin.to('room').emit('message', 'un message');
  admin.in('room').emit('message', 'un message');

  // Emit to socket's room
  admin.to(socket.id).emit('message', 'un message');

  // Emit to socket client
  socket.emit('message', 'un message');

  // Emit to all sockets in room 'room' except sender
  socket.to('room').emit('message', 'un message');

  // Emit to all sockets in namespace except sender
  socket.broadcast.emit('message', 'un message');

  // Emit compress message to client socket
  socket.compress(true).emit('message', 'un message');

  // Emit a message which could be dropped
  socket.volatile.emit('message', 'un message');
});
