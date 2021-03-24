import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Elementui from  'element-ui'  //导入element-ui组件库
import 'element-ui/lib/theme-chalk/index.css';
import permission from "./permission"

Vue.use(Elementui)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
