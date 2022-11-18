<template>
  <html>
  <div class='stockspage_box'>

    <button class='exitbutton'  id='back' v-on:click="$router.push(backpath)">Назад</button>
    <h2>Акции</h2>
    <StockItem v-for="stock of stocks" v-bind:stock = 'stock' :key="stock.data.id"/>
  </div>
  </html>
</template>

<script>

import StockItem from "@/components/StockItem";
import {io} from "socket.io-client";
export default {
  name: "MyStocks",
  components:{
    StockItem
  },
  data(){
    return{
      backpath: window.location.href.replace('/stocks','').replace('http://localhost:8080',''),
      stocks: []
    }
  },
  created() {
   // const socket = this.$store.getters.GetSocket
    const socket = io('http://localhost:3000/usersocket')
    fetch('http://localhost:3000/stocks')
        .then(response => response.json())
        .then(json =>{
          this.stocks = json
        })
    socket.on('UpdateStocks', (message) => {
      this.stocks = message
    })
  }
}
</script>

<style scoped>
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
div.stockspage_box{
  display: flex;
  align-items: center;
  flex-direction: column;
}
h2 {
  color: #747474;
  font-family: Open Sans, sans-serif;
}
</style>
