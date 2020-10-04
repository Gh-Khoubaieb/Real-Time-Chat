//declaration de path
const path = require('path');
// declaration de http module
const http = require('http');
const express = require ('express');


//declaration de socket.io
const socketio = require('socket.io');

//import the user from utils
const formatMessage = require('./utils/messages');
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//create variable message
const botChat = 'The Chat Bot';
//Run when client connect (initialise io with connection)
io.on('connection', socket => {

    //join chat with room and username
    socket.on('joinRoom',({ username, room}) => {

        const user = userJoin(socket.id,username , room);

        socket.join(user.room);

         //Welcome current use
    socket.emit('message',  formatMessage(botChat, `welcome to ${room} chat room ! Have fun :)`));
    console.log('New WS Connection...');
    //send message(variable) from server to main.js
    //emit => emit only user is conncecting
    //socket.emit('message', formatMessage(botChat ,'A user has joined the chat room'));

    //Broadcast when user connects
    socket.broadcast
        .to(user.room)
        .emit(
        'message',
        formatMessage(botChat, `${user.username}  has joined the chat`)

    );
            
  
    //Send users and room info
    io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
       
    });
    // broadcast.emit => emit to everyone except the user is connecting
    //socket.broadcast.emit();

    // io.emit() => every client is connecting
    });

   
    


    //listen for chatMessage
    socket.on('chatMessage', msg =>{
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username, msg));

    });

    //Runs when client disconnects
    socket.on('disconnect', ()=>{

        const user = userLeave(socket.id);

        if(user) {
         io.to(user.room).emit('message' ,formatMessage(botChat, `${user.username} has left the room`));
        
        

          // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
   });
});
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log (`Server running on port ${PORT}`));