import Vue from 'vue'
import VueRouter from 'vue-router'

const basicPage = ()=>import('views/basicPage')  //这样写是为了路由懒加载
const personal = ()=>import('views/personal')
const changeInfo = ()=>import('views/changeInfo')
const publish = ()=>import('views/publish')
const pageArticle = ()=>import('views/pageArticle')
const searchPage = ()=>import('views/searchPage')
const activity = ()=>import('views/activity')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'basicPage',
    component: basicPage  //主页面
  },
  {
    path: '/personal',
    name: 'personal',
    component: personal  //个人中心页面
  },{
    path: '/changeInfo',
    name: 'changeInfo',
    component: changeInfo  //修改个人信息页面
  },{
    path: '/publish',
    name: 'publish',
    component: publish  //主页面
  },{
    path: '/article',
    name: 'pageArticle',
    component: pageArticle  //主页面
  },{
    path: '/search',
    name: 'searchPage',
    component: searchPage  //主页面
  },{
    path: '/activity',
    name: 'activity',
    component: activity  //主页面
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
