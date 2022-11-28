<template>
  <button v-bind:class="{blocked: user.active,active: !user.active}"  id='but' v-on:click="$router.push('/user/' + user.id);$emit('active_user',user.id)">{{user.name}}</button>
</template>

<script>
export default {
  props:{
    user:{
      type: Object,
      required: true,
    }
  },
  name: "MyUserItem"
}
</script>

<style scoped>
button.active{
  text-align: center;
  background-color: #272727;
  color: #14A76C;
  width: 200px;
  height: 30px;
  font-size: 15px;
  cursor: pointer;
}
button.active:hover{
  background-color: #FFE400;
}
button.blocked{
  text-align: center;
  color: #14A76C;
  width: 200px;
  height: 30px;
  font-size: 15px;
  background-color: gray;
  pointer-events: none;
}
</style>
