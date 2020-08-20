var socket = io();
  socket.on('connect', function(){
    setInterval(() => {
      socket.emit('message', 'Hello from BattleShip', 'test')
    }, 5000); 
  });
  socket.on('event', function(data){
    // console.log('DATA RECEIVED', data)
    if (data.score) {
      console.log(`Score: ${data.score}`)
    }
    if (data.shot) {
      console.log(`Shot: ${data.shot}`)
    }
  });
  socket.on('disconnect', function(){});

