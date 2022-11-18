<template>
<li v-bind:class="{blocked: user.active,active: !user.active}"><router-link v-bind:to="{name:'user',params:{num: user.id}}" v-on:click="$emit('active_user',user.id)">{{user.name}}</router-link></li>
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
li.active {
  background-color: aqua;
  pointer-events: auto;
}
.blocked{
  background-color: gray;
  pointer-events: none;
}
</style>
