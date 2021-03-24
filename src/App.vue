<template>
  <div id="app">
    <hea></hea>  <!-- 头部 -->
    <router-view/>
  </div>
</template>

<script>
  import hea from "components/header";
  export default {
    name: "App",
    components:{
      hea
    }
  }
</script>

<style>
  *{
    margin: 0;
    padding: 0;
  }
  li{
    list-style: none;
  }
  a{
    text-decoration: none;
  }
</style>
