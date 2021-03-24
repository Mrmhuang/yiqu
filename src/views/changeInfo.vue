<template>
    <el-container>
        <el-container>
            <el-aside width="700px">
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
                        <img :src="this.user.avatar" alt="" @mouseenter="changeAvatar">
                    </div>
                    <p class="name">{{user.username}}</p>
                    <p class="desc">{{user.describe}}</p>
                </div>
            </el-aside>
            <el-main>
                <div class="infoForm">
                    <p class="title">基本资料</p>
                    <el-form ref="form" v-model="user" :inline="true" label-width="100px">
                        <el-form-item label="用户名">
                            <el-input v-model="user.username" disabled></el-input>
                        </el-form-item>
<!--                        <el-form-item label="用户名">-->
<!--                            <el-input v-model="" disabled></el-input>-->
<!--                        </el-form-item>-->
                        <el-form-item label="电子邮箱">
                            <el-input v-model="user.useremail"></el-input>
                        </el-form-item>
                        <el-form-item label="注册时间">
                            <el-input v-model="user.resigetTime" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="个人说明">
                            <el-input type="textarea" v-model="user.describe" class="text"></el-input>
                        </el-form-item>
                        <el-button type="primary" @click="saveInfo" v-if="this.$store.state.user==this.user.username">
                            保存设置
                        </el-button>
                    </el-form>
                </div>
            </el-main>
        </el-container>
        <el-footer></el-footer>
    </el-container>
</template>

<script>
    // import {getMy} from "../axios/user";
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
                    username: '123',
                    useremail: '106',
                    resigetTime: '',
                    describe: '这个人很懒，什么都没有留下~',
                    avatar:null
                },
                imageUrl: "",  //头像地址
                action: `${process.env.VUE_APP_BASE_API}/upload/avatar`,
                addXian: true
            }
        },
        mounted() {
            getOnePersonal(this.$route.query.id).then((result) => {
                console.log(result)
                this.user.avatar = result.data.data[0].userpicture
                this.user.username = result.data.data[0].username
                this.user.useremail = result.data.data[0].useremail
                this.user.describe = result.data.data[0].describe
                this.user.resigetTime = parseTime(result.data.data[0].registertime, '{y}-{m}-{d}')
                console.log('this.user.avatar',this.user.avatar)
            }).catch(e => {
                console.log(e)
            })
        },
        methods: {
            ...mapMutations([
                'SET_AVATAR'
            ]),
            saveInfo() {
                this.$store.dispatch("saveInfo", this.user).then(result => {
                    this.$message({
                        type: 'success',
                        message: '保存成功'
                    })
                })
            },
            handleAvatarSuccess(res, file) {
                console.log(res)
                if(this.$store.state.id!==null){
                    var path = res.data.path.replace(/\\/g,'/');
                    pushImg(path,this.$store.state.userid).then(result=>{
                        console.log(result)
                    })
                    this.$store.commit('SET_AVATAR', res.data.path)
                    this.$message({
                        type: 'success',
                        message: '上传成功'
                    })
                }else{
                    window.location.href = 'http://localhost:8080/'
                }
            },
            beforeAvatarUpload(file) {
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isLt2M;
            },
            changeAvatar(index) {
                if (index == 1) {
                    this.$refs.xian.style.display = 'none'
                } else {
                    this.$refs.xian.style.display = 'block'
                }
            },
            checkadmin(){
                this.$prompt('请输入你的管理员凭证', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /\d*/,
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

    .el-form-item {
        width: 800px;
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
        border-radius: 50%;
    }

    .infoForm {
        height: 700px;
        background: white;
        width: 80%;
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
        padding: 70px 0;
    }

    .el-footer {
        height: 100px;
        background: rgb(45, 50, 54);
    }

    .el-container {
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
        background: #99a9bf;
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

</style>
