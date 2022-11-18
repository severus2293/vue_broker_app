<template>
  <html>
  <div class='settingspage_box'>
    <button class='exitbutton'  id='back' v-on:click="$router.push(backpath)">Назад</button>
    <h2>Настройка</h2>
    <div class='settingsmain'>
      <div class="field">
        <label class='settinglabel' for='date_start_fold'>
          Дата начала торгов:
        </label>
        <input id='date_start_fold' class='settings_input' type='date' max="2022-11-03" min="2021-11-04" v-bind:value="startdatevalue" v-on:change="ChangeStart($event)"/>

      </div>
      <div class="field">
        <label class='settinglabel' for='date_end_fold'>
          Дата окончания торгов:
        </label>
        <input id='date_end_fold' class='settings_input' type='date'  max="2022-11-03" min="2021-11-05" v-bind:value="enddatevalue" v-on:change="ChangeEnd($event)"/>

      </div>
      <div class="field">
        <label class='settinglabel' for='date_end_fold'>
          Скорость смены дат:
        </label>
        <input id='speed_date' class='settings_input speed' type='number' v-bind:value="speedvalue" v-on:change="ChangeSpeed($event)"/>

      </div>
      <button class='startbargbutton'  id='startbarg' v-on:click="start_Bargain($event)">Начало Торгов</button>
    </div>
  </div>
  </html>
</template>

<script>
import {io} from "socket.io-client";

export default {
  name: "MySettings",
  data(){
    return{
      backpath: window.location.href.replace('/settings','').replace('http://localhost:8080',''),
      startdatevalue: '',
      enddatevalue: '',
      speedvalue: 0
    }
  },
  created() {
    fetch('http://localhost:3000/settings')
        .then(response => response.json())
        .then(json =>{
          this.startdatevalue = json.start;
          this.enddatevalue = json.end;
          this.speedvalue = json.speed;

        })
  },
  methods: {
    ChangeStart(e) {
      const socket = this.$store.getters.GetSocket
      const message = {
        start: e.target.value
      }
      socket.emit('changeStart',message)

    },
    start_Bargain(e){
      e.preventDefault()
      const message = {
        process: true,
      }
     // const socket = this.$store.getters.GetSocket
      const socket = io('http://localhost:3000/usersocket')
      socket.emit('start_bargaing',message)
    },
    ChangeEnd(e) {
      const socket = this.$store.getters.GetSocket
      const message = {
        end: e.target.value
      }
      socket.emit('changeEnd',message)

    },
    ChangeSpeed(e) {
      if(parseInt(e.target.value) > 0) {
        const socket = this.$store.getters.GetSocket
        const message = {
          speed: parseInt(e.target.value)
        }
        socket.emit('changeSpeed', message)
      }
    },
  }
}
</script>

<style scoped>

h2 {
  color: #747474;
  font-family: Open Sans, sans-serif;
}
label.settinglabel{
  float: left;
  color: #FF652F;
  font-size: 30px;


}
div.field {
  clear:both; text-align:right;
  margin-left: 10px;
}

div.settingsmain{
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  width: 500px;
  height: 300px;
  float: left;
  padding: 5px;
}

input.settings_input{
  text-align: center;
  background-color: #272727;
  color: #14A76C;
  height: 30px;
  margin-top: 5px;
  font-size: 15px;
}
input.settings_input.speed{
  width: 120px
}
button.startbargbutton{
  margin-left: 30%;
  margin-top: 16%;
  cursor: pointer;
  border-radius: 100px;
  width: 200px;
  height: 50px;
  color: #FFE400;
  background-color: #272727;
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
button.startbargbutton:hover{
  background-color: green;
}

div.settingspage_box{
  display: flex;
  align-items: center;
  flex-direction: column;
}
</style>
