const io = require("socket.io")();
const socketapi = {
  io: io
};

io.on('connection', function (socket) {
  console.log("socket conneted");

  socket.on('playerjoin', function (data) {
    console.log("playerjoin");
    io.emit('playerjoin', {

    });
  });



});

module.exports = socketapi;