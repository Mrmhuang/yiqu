import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Elementui from 'element-ui'  //导入element-ui组件库
import 'element-ui/lib/theme-chalk/index.css';
import permission from "./permission"
import "../node_modules/element-ui/lib/theme-chalk/display.css";

import SlideVerify from 'vue-monoplasty-slide-verify';
Vue.use(SlideVerify);

// 全局注册
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import animated from 'animate.css'
Vue.use(animated)
Vue.use(mavonEditor)
Vue.use(Elementui)

Vue.mixin({
  created() {
    document.documentElement.addEventListener('click',()=>{
      this.$emit('turndownSearch')
    })
  }
})

Vue.prototype.bus = new Vue()
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
