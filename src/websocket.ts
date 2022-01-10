import {io} from "./http"
interface RommUser{
    socket_id:string,
    userName:string,
    room:string
}
interface Message{
    room:string,
    text:string,
    createdAt:Date,
    userName:string
}
const users:RommUser[]=[]
const messages:Message[]=[]
io.on("connection",socket=>{
    socket.on("select_ROM",(data,callback)=>{
        socket.join(data.room);

        const userInRoom = users.find(user => user.userName === data.userName && user.room === data.room)
        if(userInRoom){
            userInRoom.socket_id = socket.id
        }else{

            users.push({
                room:data.room,
                userName:data.userName,
                socket_id:socket.id
            })
        }
        const messagesRoom = getMessagesRoom(data.room)
        callback(messagesRoom)
    })
    socket.on("message",data=>{
        console.log(data)
        const message:Message={
            room:data.room,
            userName:data.userName,
            text:data.menssage,
            createdAt:new Date()
        }
        messages.push(message)
        io.to(data.room).emit("message",message)

    })
})
function getMessagesRoom(room:string) {
    const messagesRoom = messages.filter(message=>message.room === room)
    return messagesRoom    
}