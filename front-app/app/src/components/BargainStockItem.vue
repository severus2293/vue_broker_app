<template>
  <div class='singlestock'>
  <div class='mainstock'>
    <div class='stockfield'>
      <p class='stockplabel'>
        Обозначение:
      </p>
      <p id='designationstockfold: ' class='stock_p'>{{this.mystock.info.designation}}</p>

    </div>
    <div class='stockfield'>
      <p class='stockplabel'>
        Название компании:
      </p>
      <p class='stock_p'   v-bind:id = "'titlestockfold:' + this.mystock.data.id">{{this.mystock.info.title}}</p>
    </div>

    <div class='stockfield'>
      <p class='stockplabel'>
        Количество акций:
      </p>
      <p class='stock_p'   v-bind:id = "'countstockfold-' +  this.mystock.data.id ">{{this.mystock.data.count}}</p>
    </div>
    <div class='stockfield'>
      <p class='stockplabel'>
        Количество акций брокера:
      </p>
      <p class='stock_p'   v-bind:id = "'countstockbrokfold-' + this.mystock.data.id">{{this.userstock.count}}</p>
    </div>
    <div class='stockfield'>
      <p class='stockplabel'>
        Текущая стоимость:
      </p>
      <p class='stock_p'  v-bind:id = "'curprice-' + this.mystock.data.id ">{{pricearr[pricearr.length-1]}}</p>
    </div>
    <div class='stockfield' v-if="this.userstock.difference > 0">
      <p class='stockplabel'>
        Прибыль:
      </p>
      <p class='stock_p'  v-bind:id = "'curprice:' + this.mystock.data.id ">{{Math.abs(this.userstock.difference)}}</p>
    </div>
    <div class='stockfield' v-if="this.userstock.difference < 0">
      <p class='stockplabel'>
        Убыток:
      </p>
      <p class='stock_p'  v-bind:id = "'curprice:' + this.mystock.data.id ">{{Math.abs(this.userstock.difference)}}</p>
    </div>
    <div class="buysellform">
    <div class='stockfield numbuy'>
    <input class='stocks_input numbargain' v-bind:id="'buycount-'+this.mystock.data.id" type='number' v-model="buycount"/>
  </div>
  <div class='stockfield'>
    <button v-bind:id="'buybut-'+this.mystock.data.id" v-bind:class="{buybut_blocked: !this.flag_access,buybut: this.flag_access}" v-on:click="$emit('buy_stock',$event,this.userid,pricearr[pricearr.length-1],buycount,this.mystock.data.id,this.mystock.data.count);buycount = 0">Купить</button>
  </div>
    </div>
    <div class="buysellform">
    <div class='stockfield numbuy'>
      <input class='stocks_input numbargain' v-bind:id="'sellcount-'+this.mystock.data.id" type='number' v-model="sellcount"/>
    </div>
    <div class='stockfield'>
      <button v-bind:id="'sellbut-'+this.mystock.data.id" v-bind:class="{buybut_blocked: !this.flag_access,buybut: this.flag_access}"   v-on:click="$emit('sell_stock',$event,this.userid,pricearr[pricearr.length-1],sellcount,this.mystock.data.id,this.userstock.count)">Продать</button>
    </div>
    </div>
  </div>
  <div class='databox'>
    <h2 id='changecoursetitle'>Изменение курса</h2>
    <table cellSpacing={5}>
      <thead>
      <tr>
      <th class='stockstablehead'>Дата</th>
      <th class='stockstablehead'>Стоимость</th>
      </tr>
      </thead>
      <tbody>
     <tr v-for="(item, index) of this.datearr" :key="item">
      <td class='stockstablebody'>{{item}}</td>
      <td class='stockstablebody'>{{pricearr[index]}}</td>
      </tr>

      </tbody>
    </table>
    <div class='graphic'>
      <Line :chart-data="chartData"/>
    </div>
  </div>
  </div>
</template>

<script>
import { Line} from 'vue-chartjs'
import { Chart, Title, Tooltip, Legend, LineController, LineElement, CategoryScale, LinearScale,PointElement } from 'chart.js'
import {io} from "socket.io-client";
Chart.register(Title, Tooltip, Legend, LineController, LineElement, CategoryScale, LinearScale,PointElement)
export default {
  name: "BargainStockItem",
  props:['stock','startdate','enddate','userid'],
  components:{
    Line
  },
  data() {
    return {
      datearr: [],
      pricearr: [],
      chartData: {},
      cur_date: this.enddate,
      userstock: 0,
      buycount: 0,
      sellcount: 0,
      mystock: this.stock,
      flag_access: false
    }
  },
  created() {
    this.renderInfArr()
   // const socket = this.$store.getters.GetSocket
    //const socket = io('http://localhost:3000/usersocket')
    const sock = io('http://localhost:3000/usersocket')
    sock.on('ChangeTime', (message) => {
      this.flag_access = true
      var dat = message.date
      if(dat !== this.cur_date) {
        this.cur_date = message.date
        this.renderInfArr()
      }
    })
    sock.on('authorization_status', (message) => {
      for(let broker of message){
        if(broker.id === this.userid){
          for(let stock of broker.stocks){
            if(stock.id === this.stock.data.id){
              this.userstock =   stock ///stock.count
              break
            }
          }
          //this.countvalue = stock.data.count
          //this.checkvalue = stock.data.participation
        }
      }
    })
    sock.on('access',(message)=>{
      this.flag_access = message.value
    })
    sock.on('BargainStocks', (message) => {
      for(let stock of message){
        if(stock.data.id === this.mystock.data.id){
          this.mystock = stock
          //this.countvalue = stock.data.count
          //this.checkvalue = stock.data.participation
        }
      }
    })

  },
  watch:{
cur_date(){
}
  },
  methods: {
    renderInfArr(){
      this.datearr = []
      this.pricearr = []
      var start = this.startdate
      const end = this.cur_date
      console.log('конец:'+this.cur_date)
      console.log('старт:'+this.startdate)
      var index = this.stock.info.data.length - 1
      var a = new Date(this.stock.info.data[index].Date)
      var b = new Date(start)
      while(a < b){
        index--;
        let day = new Date(this.stock.info.data[index].Date);
        const offset = day.getTimezoneOffset();
        day = new Date(day.getTime() - offset * 60 * 1000);
        day.setDate(day.getDate() + 1);
        const tmp = day.toISOString().split('T')[0].split('-');
        a = new Date('' + tmp[1] + '/' + tmp[2] + '/' + tmp[0]);
      }
      while(end >= start){
        if(this.stock.info.data[index].Date === start){     //если есть данные о дне в таблице
          this.datearr.push(start);
          this.pricearr.push(this.stock.info.data[index].Open);
          index--;

        }
        else{
          this.datearr.push(start);
          this.pricearr.push(this.pricearr[this.pricearr.length-1]);
        }
        let day = new Date(start);
        const offset = day.getTimezoneOffset();
        day = new Date(day.getTime() - offset * 60 * 1000);
        day.setDate(day.getDate() + 1);
        const tmp = day.toISOString().split('T')[0].split('-');
        start = '' + tmp[1] + '/' + tmp[2] + '/' + tmp[0];
      }
      console.log('дни: ' + this.datearr)
      console.log('деньги: ' + this.pricearr)
      const sock = io('http://localhost:3000/usersocket')
      const message = {
        id: this.mystock.data.id,
        price: parseFloat((this.pricearr[this.pricearr.length-1]).replace('$','')),
      }
      console.log('sdfsfgdfhdgh')
      sock.emit('changePrice',message)
      this.chartData = {
        labels: this.datearr,
        datasets: [
          {
            data: this.pricearr.map(price => parseFloat((price).replace('$',''))),
            label: "Курс",
            borderColor: "green",
            fill: true,
          }
        ]
      }
    }
  }
}
</script>

<style scoped>
h2 {
  color: #747474;
  font-family: Open Sans, sans-serif;
}

div.mainstock{
  display: flex;
  flex-direction: column;
  width: 500px;
  height: 160px;
  float: left;
  padding: 5px;
}
div.buysellform + div.buysellform{
  margin-top: 12%;
}
.buybut_blocked{
  background-color: gray;
  border-radius: 100px;
  margin-top: 7%;
  width: 200px;
  height: 50px;
  color: #FFE400;
}
h2#changecoursetitle{
  color: #FFE400;
}
div.stockfield{
  height: 30px;
  display: flex;
  flex-direction: row;
}
div.stockfield.numbuy{
  margin-top: 60px;
}
.stockplabel{
  color: #FF652F;
  font-size: 20px;
}
th.stockstablehead{
  color: #FF652F;
  background-color: #747474;
  font-size: 20px;
}
div.singlestock{
  display: flex;
  flex-direction: row;
  border:1px solid #747474;
}

div.mainstock + div.databox{
  margin-left: 60px;
}
div.graphic{
  width: 900px;
  background-color: #272727;
  margin-bottom: 10px;
  margin-right: 10px;
}
td.stockstablebody{
  color: #FFE400;
  background-color: #747474;
  font-size: 20px;
  text-align: center;
}
input.stocks_input{
  background-color: #272727;
  margin-left: 10px;
  color: #14A76C;
  width: 50px;
  font-size: 17px;
}
input.stocks_input.numbargain{
  width: 100px;
  margin-left: 40px;
  text-align: center;
}
p.stock_p{
  color: #14A76C;
  font-size: 20px;
  margin-left: 10px;
}
form + form {
  margin-top: 10px;
}
button.buybut{
  cursor: pointer;
  border-radius: 100px;
  margin-top: 7%;
  width: 200px;
  height: 50px;
  color: #FFE400;
  background-color: #272727;
}
button.buybut:hover{
  background-color: green;
}

table{
  display: table;
  width: 100%;
}
table thead, table tbody {
  float: left;
  width: 100%;
}
table tbody {
  overflow: auto;
  height: 100px;
}
table tr {
  width: 100%;
  display: table;
  text-align: center;
}
table th, table td {
  width: 33%;
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
