<template>
    <div class="maincontent">
        <el-drawer
                :append-to-body="true"
                :modal-append-to-body="false"
                title="最近十条管理员登陆的记录"
                :visible.sync="table"
                direction="rtl"
                size="50%">
            <el-table
                    :data="admindata"
                    style="width: 100%">
                <el-table-column
                        prop="adminid"
                        label="管理员id"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="adminname"
                        label="管理员姓名"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="logtime"
                        label="登陆时间">
                </el-table-column>
            </el-table>
        </el-drawer>

        <el-container>
            <div :class="[{log:true},{ishidden:loghiddenOrNot}]" ref="log" class="loginpage">
                <div class="loginpage" v-if="this.page==1">
                    <img src="~assets/basicPage/5.png">
                    <i class="el-icon-circle-close" @click="logToTrue"></i>
                    <el-form ref="submitForm" class="submitForm" :model="submitForm">
                        <el-form-item label="账号" prop="user">
                            <el-input type="text" v-model="submitForm.user" autocomplete="on"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" prop="password">
                            <el-input type="password" v-model="submitForm.password" autocomplete="on"></el-input>
                        </el-form-item>
                        <p class="reg">还没有账号? <a href="#" @click="changeLoghiddenOrNot(0)">立即注册</a></p>
                        <el-button type="primary" @click.native.prevent="loginPlease">登陆</el-button>
                    </el-form>
                </div>
                <div class="registerpage" v-else>
                    <img src="~assets/basicPage/5.png">
                    <i class="el-icon-circle-close" @click="logToTrue"></i>
                    <el-form ref="submitForm" class="submitForm" :model="registerForm">
                        <el-form-item label="请输入账号" prop="user">
                            <el-input type="text" v-model="registerForm.user" autocomplete="on"></el-input>
                        </el-form-item>
                        <el-form-item label="请输入密码" prop="password">
                            <el-input type="password" v-model="registerForm.password" autocomplete="on"></el-input>
                        </el-form-item>
                        <el-form-item label="再次确认密码" prop="checkPass">
                            <el-input type="password" v-model="registerForm.checkpass" autocomplete="off"></el-input>
                        </el-form-item>
                        <p class="reg">已有账号? <a href="#" @click="changeLoghiddenOrNot(1)">马上登陆</a></p>
                        <el-button type="primary" @click.native.prevent="registerPlease">注册</el-button>
                    </el-form>
                </div>
            </div>
            <el-header>
                <div class="head-item">
                    <div class="head-left">
                        <ul>
                            <li class="headtitle">易趣</li>
                            <li><a href="/">首页</a></li>
                            <li><a href="#">前端</a></li>
                            <li><a href="#">后端</a></li>
                            <li><a href="#">电脑知识</a></li>
                            <li><a href="#">工具箱</a></li>
                            <li><a href="#">优惠推广</a></li>
                        </ul>
                    </div>
                    <div class="search">
                        <i class="el-icon-search"></i>
                        <input type="text">
                        <el-button type="primary">搜索</el-button>
                    </div>
                    <div class="login" v-if="!this.$store.state.user">
                        <span @click="changeLoghiddenOrNot(1)">登陆</span> | <span @click="changeLoghiddenOrNot(0)">注册</span>
                    </div>
                    <div class="login" v-else>
                        <el-dropdown>
                        <span class="el-dropdown-link">
                            <i class="el-icon-arrow-down el-icon-user-solid"></i>
                            {{this.$store.state.user}}
                            <i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item @click.native.prevent="toPersonal">个人中心</el-dropdown-item>
                                <el-dropdown-item>我的收藏夹</el-dropdown-item>
                                <el-dropdown-item v-if="this.$store.state.role" @click.native.prevent="turnAdminInfo">管理员信息</el-dropdown-item>
                                <el-dropdown-item @click.native="logout">退出</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                        <el-button type="danger" plain class="danger" @click="publish">发文章</el-button>
                    </div>
                </div>
            </el-header>
        </el-container>
    </div>
</template>

<script>
    import {getCourrstage} from "../axios/user";
    import {mapMutations} from 'vuex'
    export default {
        name: "basicPage",
        data() {
            return {
                submitForm:{
                    user:'',
                    password:''
                },
                registerForm:{
                    user:'',
                    password:'',
                    checkpass:''
                },
                loghiddenOrNot:true,
                page:1,  //1表示登录页，0表示注册页
                loading: false,
                adminInfo:[],
                admindata:[],
                table: false,
                direction: 'rtl'
            }
        },
        methods:{
            changeLoghiddenOrNot(index){
                this.loghiddenOrNot = false
                this.page = index
            },
            logToTrue(index){
                this.loghiddenOrNot = true
            },
            loginPlease(){
                console.log(this.submitForm)
                this.$store.dispatch('loginM',this.submitForm).then((result)=>{
                    console.log(result)
                    if(result!=="fail"){
                        alert("登陆成功")
                        this.loghiddenOrNot = true
                    }else{
                        alert("账号或密码错误，登陆失败")
                    }
                })
            },
            registerPlease(){
                this.$store.dispatch('register',this.registerForm).then(result=>{
                    this.loghiddenOrNot = true
                    this.page = 1
                    this.loghiddenOrNot = false
                    console.log(result)
                    this.submitForm.user = result.data.user
                    this.submitForm.password = result.data.password
                    alert("注册成功")
                }).catch(e=>{
                    alert("注册失败 服务器错误")
                })
            },
            logout(){
                this.$store.dispatch('logout').then((result)=>{
                    alert("成功退出")
                })
            },
            toPersonal(){
                let _this = this
                this.$router.push({
                    path:'/personal',
                    query:{
                        id:_this.$store.state.userid
                    }
                })
            },
            publish(){
                this.$router.push('/publish')
            },
            turnAdminInfo(){
                getCourrstage().then(result=>{
                    console.log(result)
                    this.admindata = result.data.data
                    this.table = true
                })
            },
            handleClose(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => {});
            }
        }
    }
</script>

<style scoped>
    .danger{
        width: 90px;
        height: 40px;
        text-align: center;
        position: absolute;
        right: -80px;
        top: 50%;
        transform: translate(0,-20px);
    }
    .log .el-icon-circle-close{
        position: absolute;
        top: 20px;
        right: 20px;
        font-size: 20px;
        cursor: pointer;
    }
    .ishidden{
        display: none;
    }
    .reg a:hover{
        color: deepskyblue;
    }
    .el-form-item{
        margin-top: -5px;
    }
    .submitForm .el-button{
        width: 100%;
        margin-top: 30px;
    }
    .log img{
        width: 200px;
        position: relative;
        left: 50%;
        transform: translate(-100px);
    }
    .log{
        position: fixed;
        z-index: 999;
        left: 50%;
        height: 50%;
        width: 420px;
        height: 490px;
        transform: translate(-230px,125px);
        background: rgb(255,255,255);
        border-radius: 5px;
        padding: 50px 25px;
    }
    .logo{
        position: absolute;
        width: 120px;
        top: -2px;
        margin-left: 50px;
    }
    .login span{
        color: gray;
        cursor: pointer;
    }
    .login span:hover{
        color: deepskyblue;
    }
    .search i {
        position: absolute;
        left: 3px;
        top: 20px;
        font-size: 20px;
        font-weight: bold;
    }

    .login {
        position: absolute;
        right: 180px;
        top: 0;
        height: 60px;
        width: 100px;
    }

    .head-left {
        margin-left: 100px;
    }

    .search {
        position: relative;
        margin-left: 120px;
        position: absolute;
        top: 0px;
        display: inline-block;
        height: 60px;
    }

    .search .el-button {
        border-radius: 5px;
        margin-left: 2px;
    }

    .search input {
        border: 1px solid gainsboro;
        height: 38px;
        width: 200px;
        border-radius: 5px;
        padding-left: 30px;
    }

    .head-item {
        height: 60px;
    }

    .head-item div {
        display: inline-block;
    }

    .head-item > div {
        line-height: 60px;
    }

    .head-item > div ul li {
        margin-left: 50px;
        float: left;
        font-size: 15px;
    }

    .head-item > div ul li a {
        color: black;
    }

    .head-item > div ul li a:hover {
        color: lightblue;
    }

    .el-header {
        background-color: rgb(255,255,255);
    }

    .el-aside {
        background-color: wheat;
    }

    .el-main {
        background-color: gold;
    }

    .el-icon-search{
        color: darkcyan;
    }

    .loginpage,.registerpage{
        z-index: 4000;
    }

    .maincontent{
        position: fixed;
        width: 100vw;
        z-index: 2000;
        margin-bottom: 150px;
        box-shadow: 0 0 3px 1px gray;
    }

    .head-left .headtitle{
        font-size: 25px;
        position: relative;
        right: 10%;
        font-weight: 500;
        color: darkcyan;
    }

</style>
