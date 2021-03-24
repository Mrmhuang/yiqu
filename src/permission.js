import router from "./router";
import {getToken} from "./utils/auth";
import store from './store/index'

router.beforeEach((to,from,next)=>{
    const hasToken = getToken()
    if(hasToken!==null && hasToken!=="null" && hasToken!==undefined){
        // 分为还有token和token时间过期
        console.log('有token')/
        // console.log(hasToken)
        store.dispatch('getInfo',hasToken).then((result)=>{
            // console.log(store.state.user)
            next()
        })
        next()
    }else{
        console.log(window.location.href)
        if(/changeInfo/.exec(window.location.href) || /publish/.exec(window.location.href)){
            alert("请先登陆")
            window.location.href = 'http://localhost:8080/'
        }
        next()
    }
})
