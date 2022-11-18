<template>
<div>
  <h2>Авторизация</h2>
  <UsersList v-bind:users="users" v-bind:socket="socket"
             v-on:leave_user = "Leave_User"
  />
</div>
</template>

<script>
import UsersList from "@/components/UsersList";
import {io} from "socket.io-client";
export default {
  name: "MyAuthorization",
  components: {UsersList},
  data(){
    return{
      users: [],
      socket: io('http://localhost:3000/usersocket'),
      title: 'Nestjs Websockets Chat',
      name: '',
      text: '',
      messages: [],
    }
  },
  methods: {
    sendMessage() {
      if(this.validateInput()) {
        const message = {
          name: this.name,
          text: this.text
        }
        this.socket.emit('msgToServer', message)
        this.text = ''
      }
    },
    receivedMessage(message) {
      this.messages.push(message)
    },
    validateInput() {
      return this.name.length > 0 && this.text.length > 0
    }
  },
  async mounted(){
  },
  created() {

   // this.socket = io('http://localhost:3000/usersocket')
    //this.socket.on('msgToClient', (message) => {
   //   this.receivedMessage(message)
  //  })
    //const socket = this.$store.getters.GetSocket
     //const socket =  io('http://localhost:3000/usersocket');
    this.socket.on('authorization_status', (message) => {
         this.users = message
        })
  }
}
</script>

<style scoped>

</style>
