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
const sidebarTemplate=document.querySelector('#sidebar-template').innerHTML;
//Options
const {username,room}=Qs.parse(location.search,{ignoreQueryPrefix:true});

const autoscroll=()=>{
    //get new message element
    const $newMessage=$messages.lastElementChild
    //get height of new message
    const newMessageStyles=getComputedStyle($newMessage)
    const newMessageMargin=parseInt(newMessageStyles.marginBottom)
    const newMessageHeight=$newMessage.offsetHeight +newMessageMargin
    //visible height
    const visibleHeight=$messages.offsetHeight
    //Height of container of message
    const containerHeight=$messages.scrollHeight
    //where we are now
    const scrollOffSet=$messages.scrollTop+visibleHeight

    //logic for autoscroll
    if(containerHeight-newMessageHeight<=scrollOffSet){
        $messages.scrollTop=$messages.scrollHeight
    }
}

//recieving data on client side
socket.on('message',(message)=>{
    console.log(message);
    const html=Mustache.render(messageTemplate,{    //rendering template using mustache template
        username:message.username,
        message:message.text,
        createdAt:moment(message.createdAt).format('h:mm a')    //using moment script to make timestamp more understandable    
    });
    $messages.insertAdjacentHTML('beforeend',html);
    autoscroll();
});

socket.on('locationMessage',(message)=>{
    console.log(message);
    const html=Mustache.render(locationMessageTemplate,{
        username:message.username,
        url:message.url,
        createdAt:moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html);
    autoscroll();
});

//update sidebar on client side
socket.on('roomData',({room,users})=>{
    const html=Mustache.render(sidebarTemplate,{
        room,
        users
    })
    document.querySelector('#sidebar'),innerHTML=html;
})

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
});

socket.emit('join', {username,room},(error)=>{
    if(error){
        alert(error)
        location.href='/'
    }
});