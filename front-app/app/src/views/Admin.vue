
<template>
  <html>
  <div class='flex_box'>
    <button class='exitbutton'  id='back' v-on:click="$router.push(backpath)">вернуться</button>
    <h2>Биржа акций</h2>
    <div class='contain_button'>
        <button id='brokerbut' class='mainbutton' v-on:click="$router.push('admin/brokers')"><img src='../assets/brokers_img.png'/> Брокеры</button>
        <button id='stockbut' class='mainbutton' v-on:click="$router.push('admin/stocks')"><img src='../assets/stocks_img.png'/> Акции</button>
        <button id='settingbut' class='mainbutton' v-on:click="$router.push('admin/settings')"><img src='../assets/settings_img.png'/>  Настройка биржи</button>
    </div>
  </div>
  </html>
</template>

<script>
export default {
  name: "MyAdmin",
  data(){
    return{backpath: window.location.href.replace('/admin','').replace('http://localhost:8080',''),}
  },

}
</script>

<style scoped>
div.flex_box{
  margin-top: 7%;
  display: flex;
  align-items: center;
  flex-direction: column;
}
div.contain_button{
  display: flex;
  align-items: center;
  flex-direction: row;
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
button#settingbut{
  color: #14A76C;
}

button#brokerbut{
  color: #FF652F;
}

button#stockbut{
  color:#FFE400;
}
h2 {
  color: #747474;
  font-family: Open Sans, sans-serif;
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
</style>
