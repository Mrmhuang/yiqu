<template>
    <el-container>
        <el-container>
            <el-aside class="hidden-sm-only hidden-xs-only" width="700px">
                <!-- 上传头像 -->
                <div class="xian" ref="xian" @mouseleave="changeAvatar(1)">
                    <el-upload
                            :action="action"
                            class="avatar-uploader"
                            ref="avaLoader"
                            list-type="picture"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload"
                    >
                        <img v-if="imageUrl" :src="imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </div>
                <div class="myInfo" ref="myInfo">
                    <div class="admin" @click="checkadmin">管理员认证</div>
                    <div class="radius">
                        <img :src="this.user.avatar" alt="头像" @mouseenter="changeAvatar" v-if="this.user.avatar">
                        <img src="../assets/basicPage/7.jpg" alt="头像" @mouseenter="changeAvatar" v-else>
                    </div>
                    <p class="name">{{user.username}}</p>
                    <p class="desc">{{user.describe}}</p>
                </div>
            </el-aside>

            <el-main>
                <div class="infoForm">
                    <p class="title">基本资料</p>
                    <el-form ref="form" v-model="user" inline-message label-width="100px">
                        <el-form-item label="用户名">
                            <el-input v-model="user.username" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="电子邮箱" maxlength="16">
                            <el-input v-model="user.useremail"></el-input>
                        </el-form-item>
                        <el-form-item label="注册时间">
                            <el-input v-model="user.resigetTime" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="个人说明">
                            <el-input type="textarea" v-model="user.describe" class="text" maxlength="50"></el-input>
                        </el-form-item>
                        <div>
                            <el-button type="primary" class="baocun" @click="saveInfo" v-if="this.$store.state.user==this.user.username">
                                保存设置
                            </el-button>
                        </div>
                    </el-form>

                </div>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    import {pushImg} from "../axios/user";
    import {getOnePersonal} from "../axios/user";
    import {parseTime} from "../utils";
    import {mapMutations} from 'vuex'
    import {addAdmin} from "../axios/user";

    export default {
        name: "changeInfo",
        data() {
            return {
                user: {
                    username: '',
                    useremail: '',
                    resigetTime: '',
                    describe: '这个人很懒，什么都没有留下~',
                    avatar:null
                },
                imageUrl: "",  //头像地址
                action: `http://49.235.46.53:7000/upload/avatar`
            }
        },
        mounted() {
            getOnePersonal(this.$route.query.id).then((result) => {  //获取个人信息
                this.user.avatar = result.data.data[0].userpicture
                this.user.username = result.data.data[0].username
                this.user.useremail = result.data.data[0].useremail
                this.user.describe = result.data.data[0].describe
                this.user.resigetTime = parseTime(result.data.data[0].registertime, '{y}-{m}-{d}')
            }).catch(e => {
                console.log(e)
            })
        },
        methods: {
            ...mapMutations([
                'SET_AVATAR'
            ]),
            saveInfo() {  //保存个人信息
                this.$store.dispatch("saveInfo", this.user).then(result => {
                    this.$message({
                        type: 'success',
                        message: '保存成功'
                    })
                })
            },
            handleAvatarSuccess(res, file) {  //上传头像
                if(this.$store.state.id!==null){
                    this.$store.commit('SET_AVATAR', res.data.path)
                    var path = res.data.path.replace(/\\/g,'/');
                    pushImg(path,this.$store.state.userid).then(result=>{  //添加头像进数据库
                        this.$message({
                            type: 'success',
                            message: '上传成功'
                        })
                        setTimeout(()=>{
                            location.reload()
                        },200)
                    })

                }else{
                    this.$message({
                        type: 'warning',
                        message: '请先登陆'
                    })
                    this.$router.push('/')
                }
            },
            beforeAvatarUpload(file) {  //头像上传前的限制
                const isLt2M = file.size / 1024 / 1024 < 2;
                // console.log(isLt2M)
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isLt2M;
            },
            changeAvatar(index) {  //修改头像
                if (index == 1) {
                    this.$refs.xian.style.display = 'none'
                } else {
                    this.$refs.xian.style.display = 'block'
                }
            },
            checkadmin(){  //管理员凭证
                this.$prompt('请输入你的管理员凭证', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /^qweiopasdjkl$/,
                    inputErrorMessage: '凭证格式不正确'
                }).then(({ value }) => {
                    addAdmin(this.$store.state.userid,this.$store.state.user).then(result=>{
                        this.$message({
                            type: 'success',
                            message: '管理员认证成功'
                        });
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消输入'
                    });
                });
            }
        }
    }
</script>

<style scoped>
    .desc {
        color: #99a9bf;
        width: 80%;
        margin: 0 auto;
    }

    .name {
        height: 80px;
        line-height: 80px;
        font-size: 25px;
    }

    .el-button {
        position: absolute;
        bottom: -100px;
        right: 300px;
    }

    .baocun{
        position: absolute;
        right: 50px;
        bottom: -50px;
    }

    .text {
        width: 400px;
    }

    .el-input {
        width: 400px;
    }

    .el-form {
        position: relative;
        width: 100%;
    }


    .infoForm .title {
        height: 80px;
        line-height: 80px;
        font-size: 20px;
        text-indent: 40px;
    }

    .myInfo img {
        width: 120px;
        height: 120px;
        border: 0;
        border-radius: 50%;
    }

    .radius {
        display: inline-block;
        width: 120px;
        height: 120px;
        border-radius: 50%;
    }

    .infoForm {
        position: relative;
        height: 100%;
        background: white;
        width: 100%;
        min-height: 500px;
    }

    .myInfo {
        padding: 30px 0 0 0;
        text-align: center;
        width: 60%;
        height: 370px;
        background: white;
        position: absolute;
        right: 80px;
    }

    .admin{
        padding: 5px;
        background: deepskyblue;
        color: white;
        display: inline-block;
        border-radius: 5px;
        position: absolute;
        right: 20px;
        cursor: pointer;
    }

    .admin:hover{
        background: #42b983;
    }

    .el-aside {
        position: relative;
        padding: 70px 0;
    }

    .el-main {
        /*padding: 70px 0;*/
        height: 100%;
    }

    .el-footer {
        height: 100px;
        background: rgb(45, 50, 54);
    }

    .el-container {
        min-height: 90vh;
        background: rgb(243, 243, 243);
    }

    .avatar-uploader {
        height: 120px;
    }

    .xian {
        position: absolute;
        right: 80px;
        font-size: 28px;
        color: #8c939d;
        width: 120px;
        height: 120px;
        line-height: 178px;
        text-align: center;
        border-radius: 50%;
        top: 100px;
        right: 230px;
        z-index: 5;
        cursor: pointer;
        display: none;
    }

    .avatar-uploader:hover {
        border-radius: 50%;
        background: rgb(240,240,240);
        color: #42b983;
    }

    .avatar-uploader-icon {
        transform: translate(0, -25px);
    }

    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }

    .el-container{
        padding-top: 60px;
    }

    /deep/ .el-input__inner,/deep/ .el-textarea__inner{
        width: 55%;
    }
</style>
