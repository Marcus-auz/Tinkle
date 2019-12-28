const path=require('path');
const http=require('http');
const express=require('express');
const socketio=require('socket.io');
const app=express();
//created server outside of express lib and configured it to use our app
const server=http.createServer(app);
const io=socketio(server);

const port=process.env.PORT || 3000;
const publicDirectoryPath=path.join(__dirname,'../public');
app.use(express.static(publicDirectoryPath));

io.on('connection',()=>{
    console.log('New connection');
});
server.listen(port,()=>{
    console.log(`Server listening on port ${port}`);
});