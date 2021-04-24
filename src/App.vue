<template>
  <div id="app">
    <hea></hea>  <!-- 头部 -->
    <router-view/>
    <foo></foo>
  </div>
</template>

<script>
  import hea from "components/header";
  import foo from "./components/foo";
  export default {
    name: "App",
    components:{
      hea,
      foo
    }
  }
</script>

<style lang="less">
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
  /*/deep/ */
</style>
