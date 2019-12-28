//users array
const users=[]
//adding user with the username provided and room name passed
const addUser=({id,username,room})=>{
    //cleaning the data provided by the user
    username=username.trim().toLowerCase()
    room=room.trim().toLowerCase()
    //validating the data
    if(!username ||!room){
        return {
            error:'Username and room are required'
        }
    }
    //check for existing user
    const existingUser=users.find((user) => {
        return user.room===room && user.username===username 

    })
    //validating username
    if(existingUser){
        return{
            error:'Username in use'
        }
    }
    //storing the user in the user array
    const user={id,username,room}
    users.push(user)
    return {user}
}
//removing the user with the id from the user array
const removeUser=(id)=>{
    const index=users.findIndex((user)=>{
        return user.id===id
    })
    //if found remove 
    if(index!=-1){
        return users.splice(index,1)[0]
    }
}
//getting the user with specefic id in the user array
const getUser=(id)=>{
    return users.find((user)=>{
        user.id===id
    })
}
//get all the users in the room
const getUsersInRoom=(room)=>{
    room=room.trim().toLowerCase()
    return users.filter((user)=>{
        users.room===room
    })
}
//export all the methods
module.exports={
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}