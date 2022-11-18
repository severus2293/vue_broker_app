<template>

  <div class='singlestock'>
  <div class='mainstock'>
    <div class='stockfield'>
      <p class='stockplabel'>
        Обозначение:
      </p>
      <p id='designationstockfold: ' class='stock_p'>{{stock.info.designation}}</p>

    </div>
    <div class='stockfield'>
      <p class='stockplabel'>
        Название компании:
      </p>
      <p class='stock_p'   v-bind:id = "'titlestockfold:' + stock.data.id ">{{stock.info.title}}</p>
    </div>

    <div class='stockfield countstock'>
      <label class='stockplabel' v-bind:for='"countfold: " + stock.data.id' >
      Количество акций:
      </label>
      <input class='stocks_input' type='number'  v-bind:id = "'countfold:' + stock.data.id" v-bind:value="countvalue" v-on:change="ChangeCountStock($event)"/>

    </div>
    <div class='stockfield'>
      <label class='stockplabel' v-bind:for='"checkfold: " + stock.data.id'  >
      Участие:
      </label>
      <input class='stockscheck_input' type='checkbox'  v-bind:id = "'checkfold:' + stock.data.id"  v-bind:checked="checkvalue" v-on:change="Change_particip($event)"/>

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
      <td class='stockstablebody'>{{this.pricearr[index]}}</td>
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
  name: "StockItem",
  components:{
    Line
  },
  props:['stock'],
  data() {
    return {
      datearr: [],
      countvalue: 0,
      checkvalue: false,
      pricearr: [],
      chartData: {}
    }
  },
  created() {
      this.renderInfoArr()
    this.countvalue = this.stock.data.count
    this.checkvalue = this.stock.data.participation
  },
  methods:{
    Change_particip(e){
      const message = {
        id: parseInt(e.target.id.replace("checkfold:" ,''))
      }
      //const socket = this.$store.getters.GetSocket
      const socket = io('http://localhost:3000/usersocket')
      socket.emit('changeParticipationStocks',message)
    },
    ChangeCountStock(e){
      if(parseInt(e.target.value) > 0){
        const message = {
          id: e.target.id.replace('countfold:',''),
          count: parseInt(e.target.value)
        }
        //const socket = this.$store.getters.GetSocket
        const socket = io('http://localhost:3000/usersocket')
        socket.emit('changeCountStocks',message)
      }
    },
    renderInfoArr(){
      var start = this.stock.info.data[this.stock.info.data.length - 1].Date
      var index = this.stock.info.data.length - 1
      while(index>0){
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
h2#changecoursetitle{
  color: #FFE400;
}
div.stockfield{
  height: 30px;
  display: flex;
  flex-direction: row;
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
  color: #14A76C;
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
input.stockscheck_input{
  margin-left: 10px;
  transform: scale(2);
}
div.countstock{
  margin-top: 20px;
}
p.stock_p{
  color: #14A76C;
  font-size: 20px;
  margin-left: 10px;
}
form + form {
  margin-top: 10px;
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
