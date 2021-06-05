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
                        <img src="../../assets/basicPage/7.jpg" alt="头像" @mouseenter="changeAvatar" v-else>
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
    import changeInfojs from "./changeInfojs";
    export default changeInfojs
</script>

<style lang="less" scoped>
    @import "changeInfoless.less";
</style>
