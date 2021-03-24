import request from "./request";

export function getUser(data) {   //通过账号密码查看是否有该用户
    return request({
        url:'/user/login',
        method:'post',
        data
    })
}

export function getInfo(token) {  //根据token获取用户信息
    return request({
        url:'/user/getInfo',
        // method:'post',
        method:'get',
        params: { token }
    })
}

export function registerUser(data) {  //注册用户
    return request({
        url:'/user/register',
        method:'post',
        data
    })
}

export function getOnePersonal(id) {   //获取个人资料
    return request({
        url:'/user/getOnePersonal',
        method:'get',
        params:{id}
    })
}


export function saveInfo(data) {  //保存用户信息
    return request({
        url:'/user/saveInfo',
        method:'post',
        data
    })
}

export function releaseArticle(data) {  //发表文章
    return request({
        url:'/user/release',
        method:'post',
        data
    })
}

export function gArticle(id) {
    return request({
        url:'/user/getArticle',
        method:'get',
        params:{
            id
        }
    })
}

export function getPArticle(articleid) {   //获取单页文章
    return request({
        url:'/user/pageArticle',
        method:'get',
        params:{
            articleid
        }
    })
}

export function gAllarticle() {  //获取所有的文章
    return request({
        url:'/user/getAllArticle',
        method:'get'
    })
}

export function addMark(data) {  //添加收藏信息
    return request({
        url:'/user/addMark',
        method:'post',
        data
    })
}

export function cancelMark(data) {
    return request({
        url:'/user/cancelMark',
        method:'post',
        data
    })
}

export function ismark(mark) {  //查看是否收藏了一篇文章
    return request({
        url:'/user/ismark',
        method:'get',
        params:{
            mark
        }
    })
}

export function getPMark(userid) {  //获取个人的所有收藏文章信息
    return request({
        url:'/user/getPersonalMark',
        method:'get',
        params:{
            userid
        }
    })
}

export function commitCom(data) {  //提交评论
    return request({
        url:'/user/commitComment',
        method:'post',
        data
    })
}

export function getPageComment(articleid) {  //获取一篇文章的评论
    return request({
        url:'/user/getPageComment',
        method:'get',
        params:{
            articleid
        }
    })
}

export function getSomePerson(data) {   //通过账号密码查看是否有该用户
    return request({
        url:'/user/getSomePerson',
        method:'post',
        data
    })
}

export function getClassify() {   //通过账号密码查看是否有该用户
    return request({
        url:'/user/getClassify',
        method:'get',
    })
}

export function pushImg(path,userid) {
    return request({
        url:'/user/pushImg',
        method:'get',
        params:{
            path,
            userid
        }
    })
}

export function addAdmin(userid,user) {
    return request({
        url:'/admin/addAdmin',
        method:'get',
        params:{
            userid,user
        }
    })
}

export function addCourrstage(userid,user) {
    return request({
        url:'/admin/Courrstage',
        method:'get',
        params:{
            userid,user
        }
    })
}

export function checkAdmin(adminid) {
    return request({
        url:'/admin/checkAdmin',
        method:'get',
        params:{
            adminid
        }
    })
}

export function getCourrstage() {
    return request({
        url:'/admin/getCourrstage',
        method:'get'
    })
}

export function addReply(data) {
    return request({
        url:'/user/addreply',
        method:'post',
        data
    })
}

export function getAllClass() {
    return request({
        url:'/user/getAllClass',
        method:'get'
    })
}

export function getAllUser() {
    return request({
        url:'/user/getAllUser',
        method:'get'
    })
}

export function getSomeArticle(data) {
    return request({
        url:'/user/someArticle',
        method:'post',
        data
    })
}
