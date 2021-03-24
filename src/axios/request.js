import axios from 'axios'

const url = 'http://localhost:7000'

const service = axios.create({
    baseURL: url,  //process.env.VUE_APP_BASE_API
    timeout: 5000
})

service.interceptors.request.use(function (config) {
    return config
},function (error) {
    return Promise.reject(error)
})

export default service
