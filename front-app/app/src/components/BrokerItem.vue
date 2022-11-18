<template>
  <form  v-bind:id='"formdelid: " + broker.id' >
  <div class='main'>
    <div class="field namefield">
      <label class='brokerlabel' v-bind:for='"broknamefold:" + broker.id' >
        имя:
      </label>
      <input v-bind:id='"broknamefold:" + broker.id'   class='brokers_input' v-bind:value='broker.name' readOnly/>

    </div>
    <div class="field">
      <label class='brokerlabel' for='moneyfold'>
        деньги:
      </label>
      <input class='brokers_input' type='number'  v-bind:value="broker.money"  v-bind:id = "'moneyfold: ' + broker.id" v-on:change="Change_money($event)"/>

    </div>
    <button v-bind:class='{"brokerbutton delbut": !broker.active,"brokerbutton locked": broker.active }'  v-bind:id='"buttonbrok: " + broker.id' v-on:click="Del_User($event)" >{{butname}}</button>

  </div>
  </form>
</template>

<script>
import {io} from "socket.io-client";

export default {
  name: "BrokerItem",
  props:['broker','butname'],
  methods:{
    Del_User(e){
      e.preventDefault()
      console.log(e.target.id.replace('buttonbrok:',''))
      const check = confirm('вы точно хотите удалить брокера?');
      if(check) {
      const message = {
        id: e.target.id.replace('buttonbrok:','')
      }
    //  const socket = this.$store.getters.GetSocket
        const socket = io('http://localhost:3000/usersocket')
      socket.emit('delUser',message)
      }

    },
    Change_money(e){
       if(parseFloat(e.target.value) > 0){
         //const socket = this.$store.getters.GetSocket
         const socket = io('http://localhost:3000/usersocket')
         const message = {
           id: e.target.id.replace('moneyfold:',''),
           money: parseFloat(e.target.value)
         }
         socket.emit('changeMoney',message)
       }
    }
  }
}
</script>

<style scoped>
div.main{
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  width: 550px;
  height: 110px;
  float: left;
  background: #747474;
  padding: 5px;
}
div.field.namefield{
  margin-top: 10px;
}
label.brokerlabel{
  float: left;
  color: #FF652F;
  font-size: 30px;
  padding-right: 10px;

}
input.brokers_input{
  text-align: center;
  background-color: #272727;
  color: #14A76C;
  height: 30px;
  font-size: 15px;
}
button.brokerbutton.delbut:hover{
  background-color: #980005;
}
button.brokerbutton.locked{
  background-color: gray;
  pointer-events: none;
}
button.brokerbutton{
  cursor: pointer;
  border-radius: 100px;
  margin-left: 10%;
  margin-top: 2%;
  width: 140px;
  height: 50px;
  color: #FFE400;
  background-color: #272727;
}
form + form {
  margin-top: 10px;
}
div.field {
  clear:both; text-align:right;
  margin-left: 10px;
}
</style>
