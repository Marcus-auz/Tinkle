//generating normal message in the browser
const generateMessage=(username,text)=>{
    return{
        username,
        text,
        createdAt:new Date().getTime()
    }
}

//generating location message in the browser
const generateLocationMessage=(username,url)=>{
    return{
        username,
        url,
        createdAt:new Date().getTime()
    }
}
//exported both the methods
module.exports={
    generateMessage,
    generateLocationMessage
}