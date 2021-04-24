import axios from 'axios'
import store from '@/store'
import {getToken} from "../utils/auth";

const url = 'http://localhost:7000'
// const url = 'http://49.235.46.53:7000'

const service = axios.create({
    baseURL: url,  //process.env.VUE_APP_BASE_API
    // withCredentials:true,
    timeout: 10000
})

service.interceptors.request.use(function (config) {
    config.headers['Authorization'] = `Bearer ${getToken()}`
    return config
},function (error) {
    return Promise.reject(error)
})

service.interceptors.response.use(function (response) {
    const res = response.data
    if(res.code=='-2'){
        alert('token失效了,请重新登陆')
            store.dispatch('resetToken').then(() => {
                location.reload()
            })
        return Promise.reject(new Error('请求失败'))
    }
    return response
},function (err) {
    return Promise.reject(err)
})

export default service
