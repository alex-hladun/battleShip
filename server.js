"use strict";

// Basic express setup:

// Dependencies
const express = require('express');
const http = require('http');
const path = require('path');

const app = express();
const server = require('http').createServer(app)
const io = require('socket.io').listen(server)

app.set('port', 8080);
app.use('/static', express.static(__dirname + '/public/'));


const PORT          = 8080;
const bodyParser    = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, './public/index.html'));
});

server.listen(app.get('port'))

// This is wrong!!!
// app.listen(PORT, () => {
//   console.log("Example app listening on port " + PORT);
// });


io.on('connection', function(socket) {
  console.log('a user connected');

  socket.on('message', (msg) => {
    console.log('message: ' + msg);
  });

});

setInterval(function() {
  io.sockets.emit('message', 'hi!');
  io.sockets.emit('event', { 
    type: 'test-event', 
    score: 20,
    shot: "A12",
    type: "HIT"
});
}, 1000);