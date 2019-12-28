const path=require('path');
const http=require('http');
const Filter=require('bad-words');
const {generateMessage,generateLocationMessage}=require('./utils/messages');
const {addUser,removeUser,getUser,getUsersInRoom}=require('./utils/users');
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

    socket.on('join',(options,cb)=>{
        const {error,user}=addUser({id:socket.id,...options})
        if(error){
            return cb(error)
        }
        socket.join(user.room);

        //emit message to that particular connection
        socket.emit('messgae',generateMessage('Admin','Welcome'));
        //sending it to every connection except itself
        socket.broadcast.to(user.room).emit('message',generateMessage('Admin',`${user.username} has joined`));
        io.to(user.room).emit('roomData',{
            room:user.room,
            users:getUsersInRoom(user.room)
        })

        cb() //without an error
    }); 
    
    //when receiving data
    socket.on('sendMessage',(message,cb)=>{
        const user=getUser(socket.id)
        const filter=new Filter();

        if(filter.isProfane(message)){
            return cb('Warning for abusive content');
        }

        io.to(user.room).emit('message',generateMessage(user.username,message)); //emitting message event with message data to every connection
        cb();
    });

    socket.on('sendLocation',(coords,cb)=>{
        const user=getUser(socket.id)
        io.to(user.room).emit('locationMessage',generateLocationMessage(user.username,`https://google.com/maps?q=${coords.latitude}, ${coords.longitude}`));
        cb();
    });
    //when user disconnects 
    socket.on('disconnect',()=>{
        const user=removeUser(socket.id)
        if(user){
            io.to(user.room).emit('message',generateMessage('Admin',`${user.username} has left`)); //not using broadcast since that user has already disconnected
            io.to(user.room).emit('roomData',{
                room:user.room,
                users:getUsersInRoom(user.room)
            })
        }

    });
});
server.listen(port,()=>{
    console.log(`Server listening on port ${port}`);
});