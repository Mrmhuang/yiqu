<template>
    <div>
        <el-header>
            <div class="head-item">
                <div class="head-left">
                    <ul>
                        <li class="headtitle">易趣</li>
                        <li class="hidden-sm-only"><a href="/">首页</a></li>
                    </ul>
                </div>
                <div class="search hidden-xs-only" v-if="this.$route.path!=='/search'">
                    <el-input v-model="searchContent" placeholder="探索易趣" class="search-input" size="medium"
                              clearable @keyup.enter.native="searchArticle()">
                    </el-input>
                    <el-button type="primary" @click.native.prevent="searchArticle()">搜索</el-button>
                    <div class="searchresult">
                        <ul>
                            <li v-for="item in this.searchList" @click="toArticle(item.articleid)">
                                {{item.articletitle}}
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="login" v-if="!this.$store.state.user">
                    <span @click="changeLoghiddenOrNot(1)">登陆</span> | <span
                        @click="changeLoghiddenOrNot(0)">注册</span>
                </div>
                <div class="login" v-else>
                    <el-dropdown>
                            <span class="el-dropdown-link">
                                <i class="el-icon-arrow-down el-icon-user-solid"></i>
                                {{this.$store.state.user}}
                                <i class="el-icon-arrow-down el-icon--right"></i>
                            </span>
                        <el-dropdown-menu class="hidden-sm-and-down" slot="dropdown">
                            <el-dropdown-item @click.native="toPersonal">个人中心</el-dropdown-item>
                            <el-dropdown-item @click.native="logout">退出</el-dropdown-item>
                        </el-dropdown-menu>
                        <el-dropdown-menu class="hidden-sm-and-up" slot="dropdown">
                            <el-dropdown-item @click.native="toPersonal">个人中心</el-dropdown-item>
                            <el-dropdown-item @click.native="publish">发文章</el-dropdown-item>
                            <el-dropdown-item @click.native="toChangeInfo">关于我</el-dropdown-item>
                            <el-dropdown-item @click.native="toSearch">找文章</el-dropdown-item>
                            <el-dropdown-item @click.native="toActivity">活动中心</el-dropdown-item>
                            <el-dropdown-item @click.native="logout">退出</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <el-button type="danger" plain class="danger hidden-xs-only" @click="publish">发文章</el-button>
                </div>
            </div>
        </el-header>
        <div class="maincontent">
            <el-container>
                <transition name="fade">
                    <div :class="[{log:true}]" v-show="!loghiddenOrNot" v-loading="loading">
                        <div class="loginpage" v-if="this.page==1">
                            <p class="headtitle">易趣</p>
                            <i class="el-icon-circle-close" @click="logToTrue"></i>
                            <el-form ref="submitForm" class="submitForm" :model="submitForm" :rules="LoginRules"
                                     name="submitForm" key='submitForm'>
                                <el-form-item label="账号" prop="user">
                                    <el-input type="text" v-model="submitForm.user" autocomplete="off" clearable></el-input>
                                </el-form-item>
                                <el-form-item label="密码" prop="password">
                                    <el-input type="password" v-model="submitForm.password" autocomplete="on" clearable
                                              show-password></el-input>
                                </el-form-item>
                                <slide-verify :l="42" :r="10" :w="310" :h="155" :imgs="imgs" slider-text="向右滑动"
                                              @success="onSuccess" @fail="onFail" @refresh="onRefresh"></slide-verify>
                                <p class="reg">还没有账号? <a href="#" @click="changeLoghiddenOrNot(0)">立即注册</a></p>
                                <el-button type="primary" @click.native.prevent="loginPlease('submitForm')">登陆</el-button>
                            </el-form>
                        </div>
                        <div class="registerpage" v-else>
                            <p class="headtitle">易趣</p>
                            <i class="el-icon-circle-close" @click="logToTrue"></i>
                            <el-form ref="registerForm" class="submitForm" :model="registerForm" :rules="LoginRules"
                                     name="registerForm" key='registerForm'>
                                <el-form-item label="请输入账号" prop="user">
                                    <el-input type="text" v-model="registerForm.user" autocomplete="on" clearable></el-input>
                                </el-form-item>
                                <el-form-item label="请输入密码" prop="password">
                                    <el-input placeholder="请输入密码" type="password" v-model="registerForm.password"
                                              autocomplete="on" clearable show-password></el-input>
                                </el-form-item>
                                <el-form-item label="再次确认密码" prop="checkpass">
                                    <el-input type="password" v-model="registerForm.checkpass" autocomplete="off" clearable
                                              show-password></el-input>
                                </el-form-item>
                                <p class="reg">已有账号? <a href="#" @click="changeLoghiddenOrNot(1)">马上登陆</a></p>
                                <el-button type="primary" @click.native.prevent="registerPlease('registerForm')">注册</el-button>
                            </el-form>
                        </div>
                    </div>
                </transition>
            </el-container>
        </div>
    </div>
</template>

<script>
    import img0 from "../assets/img/img.jpg"
    import img1 from "../assets/img/img1.jpg"
    import img2 from "../assets/img/img2.jpg"
    import img3 from "../assets/img/img3.jpg"
    import {
        getCourrstage,
        postSearchContent
    } from "../axios/user";
    import {
        parseTime,
        Ddebounce,
        debounce
    } from "../utils";
    export default {
        name: "basicPage",
        created() {
            this.fn = debounce(this.getSearchContent, 500) //定义输入框加入防抖函数
            this.bus.$on('turndownSearch', () => { //关闭弹框
                var search = document.querySelector('.searchresult')
                search.style.display = 'none'
            })
        },
        data() {
            var validUserid = function (rule, value, callback) {
                if (value === '') {
                    callback(new Error('账号不能为空'))
                } else if (/^[a-z0-9A-Z]{4,10}$/.exec(value)) {
                    callback()
                } else {
                    callback(new Error('账号要由4-10位字母和数字组成'))
                }
            }
            var validPassword = function (rule, value, callback) {
                if (value === '') {
                    callback(new Error('密码不能为空'))
                } else if (/^[a-z0-9A-Z]{6,18}$/.exec(value)) {
                    callback()
                } else {
                    callback(new Error('密码要由6-18位数字和字母组成'))
                }
            }
            var This = this
            var validCheckPassword = function (rule, value, callback) {
                if (value !== This.registerForm.password) {
                    callback(new Error('两次密码不一致'))
                } else {
                    callback()
                }
            }
            return {
                submitForm: { //登陆表单
                    user: '',
                    password: ''
                },
                registerForm: { //注册表单
                    user: '',
                    password: '',
                    checkpass: ''
                },
                loghiddenOrNot: true,
                page: 1, //1表示登录页，0表示注册页
                direction: 'rtl', //抽屉的打开方式
                LoginRules: {
                    user: [{
                        validator: validUserid,
                        trigger: 'blur'
                    }],
                    password: [{
                        validator: validPassword,
                        trigger: 'blur'
                    }],
                    checkpass: [{
                        validator: validCheckPassword,
                        trigger: 'blur'
                    }]
                },
                searchContent: '',
                searchList: [],
                imgs: [
                    img0,
                    img1,
                    img2,
                    img3
                ],
                yanzheng: false,
                loading: false
            }
        },
        methods: {
            toArticle(articleid) { //跳去文章页
                var temp = this.$router.resolve({
                    path: 'article',
                    query: {
                        articleid: articleid
                    }
                })
                window.open(temp.href, "_blank")
            },
            searchArticle() { //跳去查询页
                if (this.searchContent != '') {
                    var temp = this.$router.resolve({
                        path: 'search',
                        query: {
                            content: this.searchContent
                        }
                    })
                    window.open(temp.href, "_blank")
                } else {
                    this.getSearchContent()
                }
            },
            getSearchContent() { //获取查询内容
                postSearchContent({
                    content: this.searchContent
                }).then(result => {
                    var searchresult = document.querySelector('.searchresult')
                    let res = result.data
                    if (res.data) {
                        console.log(res.data)
                        this.searchList = res.data
                        searchresult.style.display = 'block'
                    }
                })
            },
            changeLoghiddenOrNot(index) { //切换表单用到，点登陆和注册要用到
                // this.loading = true
                // setTimeout(()=>{
                //     this.loading = false
                // },500)
                this.loghiddenOrNot = false
                this.page = index
            },
            logToTrue(index) { //在登录页和注册页关闭表单要用到
                this.loghiddenOrNot = true
            },
            loginPlease(formName) { //登陆
                this.$refs[formName].validate((valid) => {
                    if (this.yanzheng) {
                        if (valid) {
                            this.$store.dispatch('loginM', this.submitForm).then((result) => {
                                if (result == "success") {
                                    this.loghiddenOrNot = true
                                    location.reload()

                                } else {
                                    this.$message({
                                        type: 'fail',
                                        message: '账号或密码错误，登陆失败'
                                    })
                                }
                            })
                        } else {
                            this.$message({
                                type: 'error',
                                message: '登陆的账号或密码格式错误'
                            })
                            return false;
                        }
                    } else {
                        this.$message({
                            type: 'error',
                            message: '滑动验证码失败'
                        })
                    }
                });
            },
            registerPlease(formname) { //注册
                this.$refs[formname].validate(valid => {
                    if (valid) {
                        this.$store.dispatch('register', this.registerForm).then(result => {
                            if (result.data.code !== -1) {
                                this.page = 1
                                this.submitForm.user = result.data.user
                                this.submitForm.password = result.data.password
                                this.$message({
                                    type: "success",
                                    message: '注册成功'
                                })
                            } else {
                                this.$message({
                                    type: "error",
                                    message: '用户名已存在，注册失败'
                                })
                            }
                        }).catch(e => {
                            alert("注册失败 出现" + e + "错误")
                        })
                    } else {
                        this.$message({
                            type: 'error',
                            message: '注册的账号或密码格式错误'
                        })
                    }
                })
            },
            logout() { //退出
                this.$store.dispatch('logout').then((result) => {
                    alert("成功退出")
                    this.$router.push('/')
                })
            },
            toPersonal() { //去个人中心页
                let _this = this
                this.$router.push({
                    path: '/personal',
                    query: {
                        id: _this.$store.state.userid
                    }
                })
            },
            publish() { //跳转去发布页
                this.$router.push('/publish')
            },
            toChangeInfo() { //跳去个人信息修改页
                this.$router.push({
                    path: '/changeInfo',
                    query: {
                        id: this.$store.state.userid
                    }
                })
            },
            toSearch() { //去查询页
                this.$router.push({
                    path: '/search'
                })
            },
            toActivity() { //去活动页
                this.$router.push({
                    path: '/activity'
                })
            },
            onSuccess() {
                this.yanzheng = true
            },
            onFail() {
                this.yanzheng = false
            },
            onRefresh() {
                this.yanzheng = false
            }
        },
        watch:{
            loghiddenOrNot(val){
                this.$emit('isroll',!val)
            }
        }
    }
</script>
<style>
    .el-loading-mask{
        background-color: white !important;
    }
</style>
<style lang="less" scoped>

    .fade-enter-active, .fade-leave-active {
        transition: opacity .3s;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
        opacity: 0;
    }

    .maincontent {
        position: fixed;
        width: 100vw;
        margin-bottom: 150px;
        box-shadow: 0 0 4px 0 gray;
        z-index: 2000;

        .el-aside {
            background-color: wheat;
        }

        .log {
            position: fixed;
            left: 50%;
            top: 50%;
            width: 30%;
            height: auto;
            transform: translate(-50%, -50%);
            background: rgb(255, 255, 255);
            border-radius: 5px;
            padding: 50px 25px;
            box-shadow: 0 0 1px 0 gray;

            p.headtitle {
                font-size: 30px;
                text-align: center;
                font-weight: 500;
                color: darkcyan;
            }


            .el-icon-circle-close {
                position: absolute;
                top: 20px;
                right: 20px;
                font-size: 20px;
                cursor: pointer;
            }

            .el-form-item {
                margin-top: -5px;
            }

            .submitForm .el-button {
                width: 100%;
                margin-top: 30px;
            }

            .reg a:hover {
                color: deepskyblue;
            }
        }

    }

    .el-header {
        background-color: rgb(255, 255, 255);
        position: fixed;
        width: 100vw;
        z-index: 1000;
        border-bottom: 1px solid gainsboro;
        box-shadow: 0 0 1px 0 gray;
        .head-item {
            display: flex;
            height: 60px;
            justify-content: space-around;

            >div {
                line-height: 60px;
            }

            >div ul li a:hover {
                color: lightblue;
            }

            .login {
                height: 60px;
                width: auto;

                span:hover {
                    color: deepskyblue;
                }

                span {
                    margin-right: 10px;
                    color: gray;
                    cursor: pointer;
                }

                .danger {
                    width: auto;
                    height: 40px;
                    text-align: center;
                }

            }
        }

        .search {
            position: relative;
            height: 60px;

            .el-input {
                width: 70%;
            }

            .searchresult {
                display: none;
                border-radius: 5px;
                position: absolute;
                z-index: 1999;
                background-color: white;
                box-shadow: 0 0 0 3px rgb(240, 240, 240);
                top: 52px;
                width: 260px;
                padding: 10px 0;
            }

            .searchresult ul {
                height: auto;
            }

            .searchresult ul li {
                width: auto;
                height: 50px;
                line-height: 50px;
                font-size: 15px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                cursor: pointer;
                padding: 0 10px 0;
            }

            .searchresult ul li:hover {
                background-color: #42b983;
            }

            .el-button {
                display: inline-block;
                height: 38px;
                border-radius: 5px;
                margin-left: 4px;
            }

        }

        .head-left {
            width: auto;

            .headtitle {
                font-size: 30px;
                position: relative;
                right: 10%;
                font-weight: 500;
                color: darkcyan;
            }

            >ul li {
                float: left;
                margin-left: 30px;
            }

            >ul li a {
                font-size: 20px;
                font-weight: 500;
                color: #71777c;
            }

        }

    }

    @media all and (max-width :768px) {
        .log {
            width: 70% !important;
        }
    }
</style>