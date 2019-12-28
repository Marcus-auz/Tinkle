const socket=io();

//Elements used rept are made as variable
const $messageForm=document.querySelector('#message-from');
const $messageFormInput=$messageForm.querySelector('input');
const $messageFormButton=$messageForm.querySelector('button');
const $sendLocationButton=document.querySelector('#send-location');
const $messages=document.querySelector('#messages');

//Templates
const messageTemplate=document.querySelector('#message-template').innerHTML;
const locationMessageTemplate=document.querySelector('#location-message-template').innerHTML;
//recieving data on client side
socket.on('message',(message)=>{
    console.log(message);
    const html=Mustache.render(messageTemplate,{
        message:message.text,
        createdAt:moment(message.createdAt).format('h:mm a')
    });
    $messages.insertAdjacentHTML('beforeend',html);
});

socket.on('locationMessage',(message)=>{
    console.log(message);
    const html=Mustache.render(locationMessageTemplate,{
        url:message.url,
        createdAt:moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html);
});

//sending data from client side to server
$messageForm.addEventListener('submit',(e)=>{
    e.preventDefault() //preventing deafult browser refresh
    //disabling button once it has been submitted
    $messageFormButton.setAttribute('disabled','disabled');

    const message=e.target.elements.message.value ;
    socket.emit('sendMessage',message,(error)=>{
        //enabling button
        $messageFormButton.removeAttribute('disabled');
        $messageFormInput.value=''; //clearing the input once the form has been submitted
        $messageFormInput.focus(); //moving the cursor back to it
        //console.log('Message delivered',message);
        if(error){
            return console.log(error);
        }
        console.log('Message delivered');
    });
});

$sendLocationButton.addEventListener('click',()=>{
    if(!navigator.geolocation){
        return alert('Geolocaton is not supported by browser');
    }
    //disabling the send location button
    $sendLocationButton.setAttribute('disabled','disabled');
    navigator.geolocation.getCurrentPosition((position)=>{
        //console.log(position);
        socket.emit('sendLocation',{
            latitude:position.coords.latitude,
            longitute:position.coords.longitude
        },()=>{
            $sendLocationButton.removeAttribute('disabled'); //enabling the button again
            console.log('Location shared');
        });
    })
})