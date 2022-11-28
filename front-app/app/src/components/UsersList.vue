<template>
<div  class="userbox">
    <UserItem v-for="user of users"
              v-bind:user="user" :key="user.id"
    v-on:active_user = "Active_User"/>
</div>
</template>

<script>
import UserItem from "@/components/UserItem";
import {io} from "socket.io-client";
export default {
  props:['users','socket'],
  data () {
    return {
      Socket: this.socket,
    }
  },
  name: "UsersList",
  components:{
    UserItem
  },
  methods:{
    Active_User(id){
      console.log(id)
      const message = {
        id: id
      }
    //  const socket = this.$store.getters.GetSocket
      const socket = io('http://localhost:3000/usersocket')
      this.$store.dispatch("CreateSocket")
      this.$store.dispatch("CreateUser",this.users.filter(broker => broker.id === id)[0])
     // this.socket.emit('msgToServer', message)
      socket.emit('changeactiveUser',message)
    },
  }
}
</script>

<style scoped>
div.userbox{
  margin-top: 3%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
