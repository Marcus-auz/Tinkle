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
  
    //emit message to that particular connection
    socket.emit('messgae','Welcome');
    //sending it to every connection except itself
    socket.broadcast.emit('message','New user connected');
    //when receiving data
    socket.on('sendMessage',(message)=>{
        io.emit('message',message); //emitting message event with message data to every connection
    });

    socket.on('sendLocation',(coords)=>{
        io.emit('message',`https://google.com/maps?q=${coords.latitude}, ${coords.longitude}`);
    });
    //when user disconnects 
    socket.on('disconnect',()=>{
        io.emit('message','User left'); //not using broadcast since that user has already disconnected
    });
});
server.listen(port,()=>{
    console.log(`Server listening on port ${port}`);
});