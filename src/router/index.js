import Vue from 'vue'
import VueRouter from 'vue-router'

const basicPage = ()=>import('views/basicPage/basicPage.vue')  //路由懒加载
const personal = ()=>import('views/personal/personal.vue')
const changeInfo = ()=>import('views/changeInfo/changeInfo.vue')
const publish = ()=>import('views/publish/publish.vue')
const pageArticle = ()=>import('views/pageArticle/pageArticle.vue')
const searchPage = ()=>import('views/searchPage/searchPage.vue')

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
    component: publish  //文章发布页
  },{
    path: '/article',
    name: 'pageArticle',
    component: pageArticle  //文章页
  },{
    path: '/search',
    name: 'searchPage',
    component: searchPage  //查询页
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
