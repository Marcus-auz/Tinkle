const socket=io();

//recieving data on client side
socket.on('message',(message)=>{
    console.log(message);
});

//sending data from client side to server
document.querySelector('#message-form').addEventListener('submit',(e)=>{
    e.preventDefault() //preventing deafult browser refresh 

    const message=e.target.elements.message.value ;
    socket.emit('sendMessage',message);
});