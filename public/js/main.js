const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

console.log('users list',userList);
//Get username and room from URL
const {username, room} = Qs.parse(location.search, {
  ignoreQueryPrefix : true
});

const socket = io();

//Join chat room
socket.emit('joinRoom',{username, room});

//Get room and users
socket.on('roomUsers',({ room, users}) => {
  console.log('users',users);
  outputRoomName(room);
  outputUsers(users);
})

//recive 'message' from sever  
socket.on('message', message => {
  console.log(message);
  outputMessage(message);

  //Scroll down 
  chatMessages.scrollTop = chatMessages.scrollHeight;
})

//Message submit

chatForm.addEventListener('submit', e => {
  e.preventDefault();


  let msg = e.target.elements.msg.value;
  console.log(msg);
  msg = msg.trim();
  
  if (!msg){
    return false;
  }
  //Emit message to server
  socket.emit('chatMessage', msg);

  //Clear input after send the messaeg + focus on the empty input 
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus() ;
})

 //output message to DOM
 function outputMessage(message) {
   //add div with message to chat.html 
   const div = document.createElement('div');
   div.classList.add('message');
   div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p> 
   <p class="text"> ${message.text}
      </p>`;

      document.querySelector('.chat-messages').appendChild(div); 
 }

 //Add room name to DOM

 function outputRoomName(room) {
  
    roomName.innerHTML = room;
  
 }

 //Add users to DOM

 function outputUsers(users)  {
  
   userList.innerHTML = '';
   users.forEach(user=>{
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
 
 }