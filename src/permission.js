import router from "./router";
import {getToken} from "./utils/auth";
import store from './store/index'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

router.beforeEach((to,from,next)=>{
    const hasToken = getToken()
    NProgress.start()
    if(hasToken!==null && hasToken!=="null" && hasToken!==undefined){
        store.dispatch('getInfo').then((result)=>{
            NProgress.done()
            next()
        })
    }else{
        if(/changeInfo/.exec(window.location.href) || /publish/.exec(window.location.href)){
            alert("访问个人信息页前请先登陆")
            window.location.href = 'http://localhost:8080/'
        }
        NProgress.done()
        next()
    }
})
