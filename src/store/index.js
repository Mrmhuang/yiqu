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
    },
    SET_ROLE: (state, role) => {
      state.role = role
    }
  },
  actions: {
    loginM({commit,dispatch,state},userInfo){  //登陆请求数据库然后登陆
      return new Promise((resolve,reject)=>{
        getUser(userInfo).then((response)=>{
          if(response.data.code==200){  //如果成功返回数据，说明登陆成功
            var token = response.data.token
            var username = response.data.user.username
            var userid = response.data.user.userid
            commit('SET_USER',username)
            commit('SET_USERID',userid)
            commit('SET_TOKEN', token)
            setToken(token)
          }
          if(token){  //登陆赋予了token后立刻看看是否是管理员，是的话就增加登陆记录
            checkAdmin(userid).then(result1=>{
              if(result1.data.msg!==null){
                state.role = 'admin'
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
        removeToken()
        setToken(null)
        commit('SET_USERID',null)
        commit('SET_USER',null)
        commit('SET_ROLE',null)
        resolve()
      })
    } ,
    getInfo({commit,state}){  //hastoken
      return new Promise((resolve, reject) => {
        getInfo().then((result)=>{
              var username = result.data.data[0].username
              var userid = result.data.data[0].userid
              checkAdmin(userid).then(result1=>{
                if(result1.data.msg!==null){
                  commit('SET_ROLE','admin')
                }
              })
              commit('SET_USER',username)
              commit('SET_USERID',userid)
              resolve("getInfoSuccess")
        })
      })
    },
    resetToken({ commit }){
      return new Promise(resolve => {
          commit('SET_USER',null)
          commit('SET_USERID',null)
          commit('SET_ROLE',null)
          removeToken()
          // console.log(this)
          resolve()
      })
    },
    register({commit},registerForm){
      return new Promise((resolve, reject) => {
        try{
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
    getArticle({commit},text){
      let offset = text.offset
      let id = text.id
      console.log(offset)
      return new Promise((resolve, reject) => {
        gArticle(id,offset).then(result=>{
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
    getPerMark({commit},text){
      let userid = text.id
      let offset = text.offset
      return new Promise((resolve,reject)=>{
        getPMark(userid,offset).then(res=>{
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
