import Vue from 'vue'
import Vuex from 'vuex'
import {getToken, setToken, removeToken} from "../utils/auth";
import {getUser,getInfo,registerUser,saveInfo,releaseArticle,gArticle,getPArticle,getOnePersonal,gAllarticle,addMark,cancelMark,getPMark,commitCom,addCourrstage,checkAdmin} from "../axios/user";


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token:getToken(),
    user:null,
    userid:null,
    role:null,
    avatar:'../assets/basicPage/1.jpg'
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USER: (state, user) => {
      state.user = user
    },
    SET_USERID: (state, userid) => {
      state.userid = userid
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    }
  },
  actions: {
    loginM({commit,dispatch,state},userInfo){  //请求数据库然后登陆
      return new Promise((resolve,reject)=>{
        console.log("进来了login".userInfo)
        getUser(userInfo).then((response)=>{
          let token = response.data.token
          commit('SET_USER',response.data.user.username)
          commit('SET_USERID',response.data.user.userid)
          commit('SET_TOKEN', token)
          setToken(token)
          if(token){
            console.log(response)
            checkAdmin(response.data.user.userid).then(result1=>{
              console.log(result1)
              if(result1.data.msg!==null){
                state.role = 'admin'
                console.log('staterole',state.role)
                addCourrstage(result.data.data[0].userid,result.data.data[0].username).then(result2=>{
                  if(result2.status == 200){
                    console.log("添加成功")
                  }
                })
              }
            })
            resolve("success")
          }else{
            resolve("fail")
          }
        }).catch((err)=>{
          throw err
        })
      })
    },
    logout({commit}){
      return new Promise((resolve,reject)=>{
        console.log("进来了")
        removeToken()
        setToken(null)
        commit('SET_USERID',null)
        commit('SET_USER',null)
        resolve()
      })
    } ,
    getInfo({commit,state},hastoken){
      return new Promise((resolve, reject) => {
        getInfo(hastoken).then((result)=>{
          // if(result)
          if(result.data.data.code == '-2'){
            alert('身份失效了，请重新登陆')
            commit('SET_USER',null)
            commit('SET_USERID',null)
            removeToken()
            this.$router.push('/')
          } else{
            commit('SET_USER',result.data.data[0].username)
            commit('SET_USERID',result.data.data[0].userid)
            checkAdmin(result.data.data[0].userid).then(result1=>{
              // console.log(result1)
              if(result1.data.msg!==null){
                state.role = 'admin'
                // console.log('staterole',state.role)
                addCourrstage(result.data.data[0].userid,result.data.data[0].username).then(result2=>{
                  if(result2.status == 200){
                    // console.log("添加成功")
                  }
                })
              }
            })
            resolve("getInfoSuccess")
          }
        })
      })
    },
    register({commit},registerForm){
      return new Promise((resolve, reject) => {
        try{
          console.log(registerForm)
          registerUser(registerForm).then((result)=>{
            resolve(result)
          })
        }catch (e) {
         console.log(e)
        }
      })
    },
    saveInfo({commit},user){
      return new Promise((resolve,reject)=>{
        try {
          saveInfo(user).then(result=>{
            resolve(result)
          })
        }catch (e) {
          throw e
        }
      })
    },
    publishA({commit},article){
      return new Promise((resolve,reject)=>{
        releaseArticle(article).then(result=>{
          resolve(result)
        }).catch(e=>{
          throw e
        })
      })
    },
    getArticle({commit},id){
      return new Promise((resolve, reject) => {
        gArticle(id).then(result=>{
          resolve(result)
        })
      }).catch(e=>{
        throw e
      })
    },
    getPageArticle({commit},articleid){
      return new Promise((resolve, reject) => {
        getPArticle(articleid).then(result=>{
          resolve(result)
        })
      }).catch(e=>{
        throw e
      })
    },
    getOne({commit},id){
      return new Promise((resolve,reject)=>{
        getOnePersonal(id).then((result)=>{
          resolve(result)
        }).catch(e=>{
          console.log(e)
        })
      })
    },
    getAllArticle(){
      return new Promise((resolve,reject)=>{
        gAllarticle().then(result=>{
          resolve(result)
        })
      })
    },
    markArticle({state,commit},articleid){
      return new Promise((resolve,reject)=>{
        let temp = {userid:state.userid,articleid}
        addMark(temp).then(res=>{
          resolve(res)
        })
      }).catch(e=>{
        console.log(e)
      })
    },
    cancelMarkArticle({state,commit},articleid){
      return new Promise((resolve,reject)=>{
        let temp = {userid:state.userid,articleid}
        cancelMark(temp).then(res=>{
          resolve(res)
        })
      }).catch(e=>{
        console.log(e)
      })
    },
    getPerMark({commit},userid){
      return new Promise((resolve,reject)=>{
        getPMark(userid).then(res=>{
          resolve(res)
        }).catch(e=>{
          console.log(e)
        })
      })
    },
    submitComment({commit},comment){
      return new Promise((resolve,reject)=>{
        let temp = {}
        temp.content =  comment.content
        temp.articleid = comment.articleid
        temp.userid =  comment.userid
        commitCom(temp).then(result=>{
          resolve(result)
        })
      })
    }
  },
  getters:{
    getUser(state){
      return state.user
    },
    getUserId(state){
      return state.userid
    }
  },
  modules: {
  }
})
