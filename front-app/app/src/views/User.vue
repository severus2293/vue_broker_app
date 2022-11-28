<template>
  <html>
  <button class='exitbutton'  id='back' v-on:click="$router.push('/');Leave_User(this.$route.params.num) ">Выход</button>
    <h2>Брокер</h2>
    <div class="userpagebox">
      <div class="firstbox">
    <div class="databox">
    <div class='stockfield'>
    <p class='stockplabel'>
      Имя Пользователя:
    </p>
    <p class='stock_p'>{{user.name}}</p>
    </div>
    <div class='stockfield'>
      <p class='stockplabel'>
        Баланс:
      </p>
      <p class='stock_p'>{{user.money}}</p>
    </div>
    </div>
        <div class="tablebox">
          <div class="scroll-table">
            <table border="1">
              <thead>
              <tr class="title-row">
                <th>Акция</th>
                <th>Количество</th>
                <th>Прибыль/Убыток</th>
              </tr>
              </thead>
            </table>
            <div class = "scroll-table-body">
              <table border='1'>
                <tbody>
                <tr v-for="stock of user.stocks" :key="stock.id">
                  <td>
                    {{this.stocks[stock.id].title}}
                  </td>
                  <td>
                    {{stock.count}}
                  </td>
                  <td v-if="stock.difference - this.difference[stock.id]*stock.count  > 0">
                    {{'Прибыль: '+ Math.abs((Math.abs(stock.difference).toFixed(2) - this.difference[stock.id]*stock.count))}}
                  </td>
                  <td v-if="stock.difference - this.difference[stock.id]*stock.count < 0">
                    {{'Убыток: '+ Math.abs((Math.abs(stock.difference).toFixed(2) - this.difference[stock.id]*stock.count))}}
                  </td>
                  <td v-if="stock.difference === 0">
                    -
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    <div class='contain_button'>
      <button id='bargaingbut' class='mainbutton' v-on:click="$router.push('/user/'+ user.id +'/bargaing')"><img src='../assets/bargaing_img.png'/> Торги</button>
      <button id='adminbut' class='mainbutton' v-if="user.role === 'admin'" v-on:click="$router.push('/user/'+ user.id +'/admin')"><img src='../assets/admin_img.png'/> Администрирование</button>
    </div>

    </div>

  </html>
</template>

<script>

import {io} from "socket.io-client";

export default {
  name: "MyUser",
  components: {},
  data(){
    return{
      user: this.$store.getters.GetUser,
      userid: parseInt(window.location.href.replace('/user/','').replace('http://localhost:8080','')),
      stocks: [],
      difference: [0,0,0,0,0,0,0,0]
    }
  },
  created() {
    fetch('http://localhost:3000/stocks/stocks_info')
        .then(response => response.json())
        .then(json =>{
          this.stocks = json
          console.log(this.stocks)
        })
    fetch('http://localhost:3000/brokers')
        .then(response => response.json())
        .then(json =>{
              for(let broker of json) {
                if (broker.id === this.userid) {
                  this.user = broker
                  //this.countvalue = stock.data.count
                  //this.checkvalue = stock.data.participation
                }
              }
        })
    const socket = io('http://localhost:3000/usersocket')
    socket.on('authorization_status', (message) => {
      for(let broker of message) {
        if (broker.id === this.userid) {
          this.user = broker
          //this.countvalue = stock.data.count
          //this.checkvalue = stock.data.participation
        }
      }
    })
    socket.on('priceUpdate', (message) => {
      this.difference[message.id] = message.price
      console.log(this.difference)
    })

  },
  methods:{
    Leave_User(id){
      //const socket = this.$store.getters.GetSocket
      const socket = io('http://localhost:3000/usersocket')
      const message = {
        id: id
      }
      socket.emit('changeactiveUser',message)
    }
  }
}
</script>

<style scoped>
h2 {
  color: #747474;
  font-family: Open Sans, sans-serif;
}
div.stockfield{
  height: 30px;
  display: flex;
  flex-direction: row;
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
.stockplabel{
  color: #FF652F;
  font-size: 20px;
}
td{
  color: #FFE400;
  background-color: #747474;
  font-size: 20px;
  text-align: center;
}
th{
  color: #FFE400;
  background-color: #747474;
  font-size: 20px;
  text-align: center;
}
div.contain_button{
  order: 1;
  display: flex;
  align-items: center;
  flex-direction: row;
  margin-top: 7%;
}
button#adminbut{
  color: #14A76C;
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
button.mainbutton{
  cursor: pointer;
  background-color: #272727;
  width: 227px;
  height: 393px;
  line-height: 40px;
  font-size: 20px;
}
button.mainbutton:hover{
  background-color: white;
}

button#bargaingbut{
  color:#FFE400;
}
p.stock_p{
  color: #14A76C;
  font-size: 20px;
  margin-left: 10px;
}
div.tablebox{
  order: 0;
  margin-top: 10%;
}
div.databox{
  order: -1;
  display: flex;
  flex-direction: column;
}
div.userpagebox{
  display: flex;
  flex-direction: row;
}
table{
  display: table;
  table-layout: fixed;
  width: 40%;
}
table thead, table tbody {
  float: left;
  width: 100%;
}
table tbody {
  overflow: auto;

}
table tr {
  width: 100%;
  display: table;
  text-align: center;
}
table th, table td {
  width: 33%;
}

div.firstbox{
  display: flex;
  flex-direction: column;
  width: 540px;
}
div.scroll-table{
  width: 900px;
}
tbody::-webkit-scrollbar {
  width: 5px;
}

/* Track */
tbody::-webkit-scrollbar-track {
  background: orange;
  border-radius: 5px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: white;
  border-radius: 5px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
