<template>
  <html>
  <div class='stockspage_box'>
    <h2>Торги</h2>
    <button class='exitbutton'  id='back' v-on:click="$router.push(backpath)">Назад</button>
    <div class='stockfield userform'>
      <p class='stockplabel'>
        Брокер:
      </p>
      <p class='stock_p'>{{broker.name}}</p>
    </div>
    <div class='stockfield userform'>
      <p class='stockplabel'>
        Баланс:
      </p>
      <p class='stock_p'>{{broker.money}}</p>
    </div>
    <div class='changedatabox'>

      <div class='stockfield timer'>
      <p class='stockplabel'>
        Таймер:
      </p>
      <p class='stock_p'   id = "itersec">{{timervalue}}</p>
    </div>

    <div class='stockfield'>
      <p class='stockplabel datachange'>
      Дата:
      </p>
      <p class='stock_p'   id = "iterdat">{{datevalue}}</p>
    </div>
  </div>
  <BargainStockItem v-on:buy_stock = "Buy_Stock" v-on:sell_stock ='Sell_Stock' v-for="stock of stocks" v-bind:stock = 'stock' v-bind:userid="userid"  v-bind:id = 'stock.info.id' v-bind:startdate="''+ setting.start.split('-')[1] +'/'+ setting.start.split('-')[2] + '/'+ setting.start.split('-')[0]" v-bind:enddate='datevalue' :key="stock.info.id"/>
  </div>
  </html>
</template>

<script>
import BargainStockItem from "@/components/BargainStockItem";
import {io} from "socket.io-client";
export default {
  name: "MyBargaing",
  components:{BargainStockItem},
  data(){
    return{
      backpath: window.location.href.replace('/bargaing','').replace('http://localhost:8080',''),
      stocks: [],
      userbalance: 0,
      usercountstocks: 0,
      setting: {},
      timervalue: 0,
      broker: {},
      datevalue: '',
      socket: {},
      userid: parseInt(window.location.href.replace('/bargaing','').replace('/user/','').replace('http://localhost:8080','')),
    }
  },
  async created() {
    //const socket = this.$store.getters.GetSocket
    //const socket = io('http://localhost:3000/usersocket')
    await fetch('http://localhost:3000/stocks/stocks_bargaining')
        .then(response => response.json())
        .then(json =>{
          this.stocks = json
        })

    /*socket.on('BargainStocks', (message) => {
      this.stocks = message
    })*/
    await fetch('http://localhost:3000/settings')
        .then(response => response.json())
        .then(json =>{
          this.setting = json
          this.timervalue = json.speed
          this.datevalue = ''+ json.start.split('-')[1] +'/'+ json.start.split('-')[2] + '/'+ json.start.split('-')[0]
        })
    /*socket.on('SettingsUpdate', (message) => {
      this.setting = message
      this.timervalue = message.speed
          this.datevalue = ''+ message.start.split('-')[1] +'/'+ message.start.split('-')[2] + '/'+ message.start.split('-')[0]
    })*/
    const sock = io('http://localhost:3000/usersocket')
    this.socket = sock
    sock.on('ChangeTime', (message) => {
      this.timervalue = message.speed
      this.datevalue = message.date

    })
    sock.on('BargainStocks', (message) => {
      this.stocks = message

    })

    sock.on('authorization_status', (message) => {
      for(let broker of message){
        if(broker.id === this.userid){
          this.broker = broker
          //this.countvalue = stock.data.count
          //this.checkvalue = stock.data.participation
          break
        }
      }
    })
  },
  methods: {
    Buy_Stock(e,userid,price,count,stockid,stockcount){
      e.preventDefault()
      if(parseInt(count) > 0 && parseInt(count) <= stockcount && parseFloat((price).replace('$',''))*parseInt(count) <= this.broker.money){
        const message = {
          count: count,
          price: parseFloat((price).replace('$','')),
          userid:  userid,
          stockid: stockid,
        }
        this.socket.emit('BuyStock',message)
      }
    },
    Sell_Stock(e,userid,price,count,stockid,userstockcount){
      e.preventDefault()
      if(parseInt(count) > 0 && parseInt(count) <= userstockcount){
        const message = {
          count: count,
          price: parseFloat((price).replace('$','')),
          userid:  userid,
          stockid: stockid,
        }
        this.socket.emit('SellStock',message)
      }
    }
  }
}
</script>

<style scoped>
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
div.changedatabox{
  display: flex;
  align-items: center;
  flex-direction: row;
  margin-bottom: 30px;
  margin-left: 800px;
}

p.stockplabel.datachange{
  margin-left: 50px;
}
h2 {
  color: #747474;
  font-family: Open Sans, sans-serif;
}
div.stockspage_box{
  display: flex;
  align-items: center;
  flex-direction: column;
}

div.stockfield{
  height: 30px;
  display: flex;
  flex-direction: row;
}
div.stockfield.userform{
  margin-right: 80%;
}
.stockplabel{
  color: #FF652F;
  font-size: 20px;
}
p.stock_p{
  color: #14A76C;
  font-size: 20px;
  margin-left: 10px;
}
form + form {
  margin-top: 10px;
}
</style>
