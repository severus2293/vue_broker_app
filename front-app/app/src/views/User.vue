<template>
  <div>
    <router-link to="/" v-on:click="Leave_User(this.$route.params.num)">Выход</router-link>
    <h2>Брокер</h2>
    <p>Имя пользователя: {{user.name}}</p>
    <p>Баланс: {{user.money}}</p>
    <router-link to="/bargaing">Торги</router-link>
    <router-link v-if="user.role === 'admin'" v-bind:to="'/user/'+ user.id +'/admin'">Администрирование</router-link>
    <div class="scroll-table">
      <table border="1">
        <thead>
        <tr class="title-row">
          <th>Акция</th>
          <th>Количество</th>
        </tr>
        </thead>
      </table>
      <div class = "scroll-table-body">
        <table border='1'>
          <tbody>
          <tr v-for="stock of user.stocks" :key="stock.id">
            <th>
              {{this.stocks[stock.id].title}}
            </th>
            <th>
              {{stock.count}}
            </th>

          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>

import {io} from "socket.io-client";

export default {
  name: "MyUser",
  components: {},
  data(){
    return{
      user: this.$store.getters.GetUser,
      stocks: []
    }
  },
  created() {
    fetch('http://localhost:3000/stocks/stocks_info')
        .then(response => response.json())
        .then(json =>{
          this.stocks = json
          console.log(this.stocks)
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

</style>
