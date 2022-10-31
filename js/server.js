let io = require('socket.io')(3000, {
  cors: {origin: ['http://localhost:8080']},
})

io.on('connection', socket => {
  console.log(socket.id)

  //TODO: send this stream to google speech
  socket.on('audioStream', (obj) => {
      console.log('RECEIVING STREAM')
      console.log(obj)
      
  })
 
})

console.log('socket server running')