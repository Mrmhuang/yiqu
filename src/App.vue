<template>
  <div id="app">
    <div class='popContainer' @mousewheel.prevent v-show="isRoll" ></div>
    <hea @isroll="changeRoll"></hea>
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
    },
    data(){
      return{
        isRoll:false
      }
    },
    methods:{
      changeRoll(val){
        this.isRoll = val
      }
    }
  }
</script>

<style lang="less">
  *{
    margin: 0;
    padding: 0;
  }

  div.popContainer {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 2000;
  }
  li{
    list-style: none;
  }
  a{
    text-decoration: none;
  }
  /*/deep/ */
</style>
