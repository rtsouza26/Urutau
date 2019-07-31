<template>
  <div class="container">
    <div class="row">
      <div class="col-12">
        <h2>Urutau Chat Encrypter</h2>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-7">
        <div class="row">
          <div class="col">
            <b-card title = "CHAT">

                <p v-for="message in messages">
                  > {{ message }}
                </p>

            </b-card>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <b-form @submit.prevent = 'sendMessage'>
              <b-form-input type="text" placeholder="Message" v-model="draft" @keyup.enter="sendMessage()">
            </b-form-input>
            </b-form>
          </div>
        </div>
      </div>

      <div class="col-lg-5">
        <div class="row">
          <div class="col">
            <b-card title = "NOTIFICATION LOG">

              <p v-for="notification in notifications">{{ notification.timestamp }} >> {{ notification.message }}</p>

            </b-card>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <b-card title = "USERS ON-LINE">

              <p v-for = "user in users">{{ user.login }}</p>

            </b-card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import  io from 'socket.io-client'
import RsaWorker from '@/RsaWorker'

export default {
  name: 'home',
  data(){
    return{
      socket: null,
      originPublicKey: null,
      destinationPublicKey: null,
      messages: [],
      user:{
        login:String
      },
      users:[],
      notifications: [],
      currentRoom: null,
      timestamp:null,
      pendingRoom: Math.floor(Math.random() * 1000),
      draft: ''
    }
  },
  async created(){
    this.addNotification('Bem vindo !!!! Gerando par de chaves!! ');
    this.originPublicKey = await this.getWebWorkerResponse('generate-keys');
    this.addNotification('Chaves geradas com sucesso!!!');
    this.addNotification('Sua Chave publica: '+ this.originPublicKey );

    this.socket = io('http://localhost:1366');
    this.setupSocketListeners();
  },
  methods:{
    addNotification(message){
      const timestamp = new Date().toLocaleDateString();
      this.notifications.push({ message, timestamp })
    },
     setupSocketListeners () {
      // Automatically join default room on connect
        this.socket.on('connect', () => {
          this.addNotification('Connected To Server.');

          this.joinRoom();
          this.sendPublicKey();

        });
       this.socket.on('OK',(msg)=>{
         this.addNotification("Key Recive");
       });

      // Notify user that they have lost the socket connection
      this.socket.on('disconnect', () => this.addNotification('Lost Connection'));

      // Display message when recieved
      this.socket.on('MESSAGE', (message) => {
        this.addMessage(message)
      })
      this.socket.on('ROOM_JOINED',(room)=>{

        this.addNotification('Add room: '+room);
        this.currentRoom = room;

      })
    },
    sendPublicKey() {
      if(this.originPublicKey){
        this.addNotification('Send you Public key');
        const key = this.originPublicKey;
        this.socket.emit('PUBLIC_KEY', key);

      }

    },
    sendMessage () {
      // Don't send message if there is nothing to send
      if (!this.draft || this.draft === '') { return }

      const message = this.draft

      // Reset the UI input draft text
      this.draft = ''

      // Instantly add message to local UI
      this.addMessage(message)

      // Emit the message
      this.socket.emit('MESSAGE', message)
    },
    /** Join the chatroom */
    joinRoom () {
      this.socket.emit('JOIN');


    },

    /** Add message to UI */

    addMessage (message) {
      this.messages.push(message)
    },
    getWebWorkerResponse(messageType,messagePayload){
      return new Promise((resolve,reject)=>{
        const messageId = Math.floor(Math.random()*100000);
        RsaWorker.send(messageType,messageId,messagePayload)
                .then(replay=>{
                  resolve(replay);
                });
      })



    },



  }
}
</script>

