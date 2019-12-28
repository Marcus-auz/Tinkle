const path=require('path');
const http=require('http');
const express=require('express');
const socketio=require('socket.io');
const app=express();
//created server outside of express lib and configured it to use our app
const server=http.createServer(app);
const io=socketio(server);

const port=process.env.PORT || 3000;
//served public files statically
const publicDirectoryPath=path.join(__dirname,'../public');
app.use(express.static(publicDirectoryPath));

//on new connection
io.on('connection',(socket)=>{
    console.log('New connection');
  
    //server sending message
    socket.emit('messgae','Welcome');
    //when receiving data
    socket.on('sendMessage',(message)=>{
        io.emit('message',message); //emitting message event with message data
    });
});
server.listen(port,()=>{
    console.log(`Server listening on port ${port}`);
});