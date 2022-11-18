<template>
  <html>
  <div class='brokerpage_box'>
    <button class='exitbutton'  id='back' v-on:click="$router.push(backpath)">Назад</button>
    <h2>Брокеры</h2>
    <BrokerItem v-for="broker of brokers" v-bind:broker = 'broker' v-bind:butname='"удалить"' :key="broker.id"/>
    <form>
      <div class='main'>
        <div class="field namefield">
          <label class='brokerlabel' for='broknamefold'>
            имя:
          </label>
          <input v-bind:id='"broknamefold:" + brokers.length'   class='brokers_input' v-on:change="Change_Name($event)" v-bind:value="name_field"/>

        </div>
        <div class="field">
          <label class='brokerlabel' v-bind:for='"moneyfold:" + brokers.length'>
          деньги:
          </label>
          <input class='brokers_input' type='number'  v-bind:id = "'moneyfold:' + brokers.length" v-on:change="Change_Mon($event)" v-bind:value="money_field"/>

        </div>
        <button class='brokerbutton addbut' v-on:click="Add_brok($event)">Добавить</button>
      </div>
    </form>


  </div>
  </html>
</template>

<script>
import BrokerItem from "@/components/BrokerItem";
import {io} from "socket.io-client";
export default {
  name: "MyBrokers",
  components:{
    BrokerItem
  },
  data(){
    return{
      brokers: [],
      backpath: window.location.href.replace('/brokers','').replace('http://localhost:8080',''),
      name_field: '',
      money_field: ''
    }
  },
  created() {
   // const socket = this.$store.getters.GetSocket
    const socket = io('http://localhost:3000/usersocket')
    fetch('http://localhost:3000/brokers')
        .then(response => response.json())
        .then(json =>{
          this.brokers = json
        })
    socket.on('authorization_status', (message) => {
      this.brokers = message
    })
  },
  methods:{
    Change_Mon(e){
      this.money_field = e.target.value
    },
    Change_Name(e){
      this.name_field = e.target.value
    },
    Add_brok(e){
      e.preventDefault()
      if(parseFloat(this.money_field) > 0 && this.name_field.trim().length > 0){

        const message = {
          id: this.brokers.length > 0 ? this.brokers[this.brokers.length - 1].id + 1 : 0,
          name: this.name_field,
          money: parseFloat(this.money_field),
          active: false,
          stocks: [{
            "id": 0,
            "count": 0
          },{"id": 1,
            "count": 0},{"id": 2,
            "count": 0},{"id": 3,
            "count": 0},{"id": 4,
            "count": 0},{"id": 5,
            "count": 0},{"id": 6,
            "count": 0},{"id": 7,
            "count": 0}],
          role: "user"
        }
        this.money_field = ''
        this.name_field = ''
        const socket = this.$store.getters.GetSocket
        socket.emit('addUser',message)
      }
    }
  }
}
</script>

<style scoped>
div.brokerpage_box{
  display: flex;
  align-items: center;
  flex-direction: column;
}
button.exitbutton{
  margin-left: 70%;
  margin-top: 1%;
  cursor: pointer;
  width: 200px;
  height: 50px;
  color: #FFE400;
  background-color: #272727;
}
button.exitbutton:hover{
  background-color: green;
}
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
div.field {
  clear:both; text-align:right;
  margin-left: 10px;
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
button.brokerbutton.addbut:hover{
  background-color: #259803;
}
html{
  position: absolute;
  margin: 0;
  padding: 0;
  min-width: 1540px;
  min-height: 700px;
  background-image: url('~@/assets/back_main.png');
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  background-repeat: no-repeat
}
body{
  margin: 0;
  padding: 0;
}
form + form {
  margin-top: 10px;
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
h2 {
  color: #747474;
  font-family: Open Sans, sans-serif;
}
</style>
