const socket=io();

//recieving data on client side
socket.on('message',(message)=>{
    console.log(message);
});

//sending data from client side to server
document.querySelector('#message-form').addEventListener('submit',(e)=>{
    e.preventDefault() //preventing deafult browser refresh 

    const message=e.target.elements.message.value ;
    socket.emit('sendMessage',message,(error)=>{
        //console.log('Message delivered',message);
        if(error){
            return console.log(error);
        }
        console.log('Message delivered');
    });
});

document.querySelector('#send-location').addEventListener('click',()=>{
    if(!navigator.geolocation){
        return alert('Geolocaton is not supported by browser');
    }
    navigator.geolocation.getCurrentPosition((position)=>{
        //console.log(position);
        socket.emit('sendLocation',{
            latitude:position.coords.latitude,
            longitute:position.coords.longitude
        },()=>{
            console.log('Location shared');
        });
    })
})