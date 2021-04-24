<template>
    <el-container>
        <el-main>
            <div class="block">
                <div class="loading-shade"></div>
                <div class="introduciton">
                    <div class="changeInfo hidden-sm-and-down" v-if="parseInt(this.$store.state.userid)==parseInt(this.$route.query.id)">
                        <div @click="changeInfo" class="icon-i">
                            <i class="el-icon-s-custom"></i> 修改信息
                        </div>
                    </div>
                    <div class="avatar">
                        <img src="../assets/basicPage/7.jpg" v-if="!this.user.userpicture">
                        <img :src="this.user.userpicture" v-else>
                    </div>
                    <h1>{{this.user.username}}</h1>
                    <p class="describe">{{this.user.describe}}</p>
                </div>
            </div>
            <div class="article">
                <el-button type="primary" class="editmyarticle" @click.native.prevent="handleClickEdit">管理我的文章</el-button>
                <el-tabs v-model="activeName">
                    <el-tab-pane :label="getPersonalArticle" name="first" >
                        <div class="none" v-if="!this.article">
                            这个人好懒，没有过文章
                        </div>
                        <div class="loading"
                             v-loading="Aloading"
                             v-if="Aloading==true"
                             element-loading-text="拼命加载中"
                             element-loading-spinner="el-icon-loading"
                             element-loading-background="rgba(245, 245, 245, 0.8)"
                        ></div>
                        <div v-for="(item,index) in article" class="allAritcles" @click="toArticle(index)" v-else>
                            <transition
                                    name="custom-classes-transition"
                                    enter-active-class="animated bounceIn"
                                    leave-active-class="animated bounceOut"
                            >
                                <i class="el-icon-close" v-if="showdelete" @click.stop="deleteArticle(item)"></i>
                            </transition>
                            <p class="title">{{item.articletitle}}</p>
                            <p class="someContent" v-html="item.articleabstract"></p>
                            <p class="time">
                                <i class="iconfont icon-dianzan">&nbsp;&nbsp;{{item.articlegives}}</i>
                                <i class="el-icon-view">&nbsp;&nbsp;{{item.articleface}}</i>
                                <span>{{item.releasetime | parseT}}</span>
                            </p>
                        </div>
                        <div class="pagination">
                            <el-pagination
                                    @current-change="handleCurrentChange"
                                    :current-page.sync="currentPage3"
                                    :page-size="5"
                                    layout="prev, pager, next, jumper"
                                    :total="total">
                            </el-pagination>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane :label="getPersonalMark" name="second">
                        <div class="none" v-if="!this.markArticle">
                            这个人好高傲，从不收藏别人的文章
                        </div>
                        <div class="loading"
                             v-loading="Aloading"
                             v-if="Aloading==true"
                             element-loading-text="拼命加载中"
                             element-loading-spinner="el-icon-loading"
                             element-loading-background="rgba(245, 245, 245, 0.8)"
                        ></div>
                        <div v-for="(item,index) in markArticle" class="allAritcles" @click="toMarkArticle(index)" v-else>
                            <transition
                                    name="custom-classes-transition"
                                    enter-active-class="animated bounceIn"
                                    leave-active-class="animated bounceOut"
                            >
                                <i class="el-icon-close" v-if="showdelete" @click.stop="deleteArticle(item)"></i>
                            </transition>
                            <p class="title">{{item.articletitle}}</p>
                            <p class="someContent" v-html="item.articleabstract"></p>
                            <p class="time">
                                <i class="iconfont icon-dianzan">&nbsp;&nbsp;{{item.articlegives}}</i>
                                <i class="el-icon-view">&nbsp;&nbsp;{{item.articleface}}</i>
                                <span>{{item.releasetime | parseT}}</span>
                            </p>
                        </div>
                        <div class="pagination">
                            <el-pagination
                                    @current-change="handleCurrentChange2"
                                    :current-page.sync="currentPage2"
                                    :page-size="5"
                                    layout="prev, pager, next, jumper"
                                    :total="total2">
                            </el-pagination>
                        </div>
                    </el-tab-pane>

                </el-tabs>
            </div>
        </el-main>
    </el-container>
</template>

<script>
    import {parseTime} from "../utils";
    import {getPArticleNums,getMarkArticleN,deleteArt} from "../axios/user";

    export default {
        name: "personal",
        mounted() {
            this.getArticle()  //获取我的文章内容
            this.getArticleNums()
            this.getMarkArticleNums()
            this.getMyMarkArticle()
            this.$store.dispatch('getOne',parseInt(this.$route.query.id)).then(result=>{  //获取我的个人信息
                this.user = result.data.data[0]
                // console.log(this.user)
            })
        },
        data() {
            return {
                user: {userpicture:null},
                activeName: 'first',
                article:[],
                Aloading:false,
                markArticle:null,
                currentPage3:1,
                total:0,  //和我的文章有关
                total2:0,  //和收藏有关
                currentPage2:0,
                showdelete:false
            }
        },
        methods: {
            deleteArticle(item){
                this.$confirm('确定删除该文章吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteArt(item.articleid).then(result=>{
                        this.$message({
                            type:'success',
                            message:'删除成功'
                        })
                    })
                    setTimeout(()=>{
                        location.reload()
                    },1000)
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            handleClickEdit(){
              this.showdelete = !this.showdelete
            },
            changeInfo(id) {
                this.$router.push({
                    path: '/changeInfo',
                    query: {
                        id: this.$route.query.id
                    }
                })
            },
            toArticle(index){
                this.$router.push({
                    path:'/article',
                    query:{
                        articleid:parseInt(this.article[index].articleid)
                    }
                })
            },
            toMarkArticle(index){
                this.$router.push({
                    path:'/article',
                    query:{
                        articleid:parseInt(this.markArticle[index].articleid)
                    }
                })
            },
            async getArticle(offset=0){
                this.Aloading = true
                await this.$store.dispatch('getArticle',{id:this.$route.query.id,offset:offset}).then(result => {
                    console.log(result)
                    this.article = result.data.msg
                    this.Aloading = false
                })
            },
            async getMyMarkArticle(offset=0){
                this.$store.dispatch('getPerMark',{id:this.$route.query.id,offset:offset}).then(result=>{  //获取我的收藏列表文章
                    if(result.data.msg){
                        this.markArticle = result.data.msg
                        console.log(this.markArticle)
                    }
                })
            },
            getArticleNums(id){
                id = this.$route.query.id
                getPArticleNums(id).then(result=>{
                    this.total = result.data.msg[0].nums
                })
            },
            getMarkArticleNums(id){
                id = this.$route.query.id
                getMarkArticleN(id).then(result=>{
                    this.total2 = result.data.msg[0].nums
                })
            },
            handleCurrentChange(){
                this.getArticle((this.currentPage3-1)*5)
            },
            handleCurrentChange2(){
                this.getMyMarkArticle((this.currentPage2-1)*5)
            }
        },
        computed: {
            getPersonalArticle() {
                return parseInt(this.$store.state.userid) == parseInt(this.$route.query.id) ? "我的文章" : "他的文章"
            },
            getPersonalMark() {
                return parseInt(this.$store.state.userid) == parseInt(this.$route.query.id) ? "我的收藏" : "他的收藏"
            },
            getPersonalAttention() {
                return parseInt(this.$store.state.userid) == parseInt(this.$route.query.id) ? "我的关注" : "他的关注"
            }
        },
        filters:{
            parseT(value){
                return parseTime(value)
            }
        }
    }
</script>
<style scoped>
    @import "~@/assets/font/iconfont.css";
    .none{
        width: 100%;
        height: 100px;
        text-align: center;
        line-height: 100px;
        font-size: 20px;
        background-color: rgb(240,245,245);
        color: #6b6b6b;
    }
    .editmyarticle{
        position: absolute;
        width: auto;
        font-size: 12px;
        right: 20px;
        border-radius: 90%;
        cursor: pointer;
        z-index: 5;
    }
    .el-icon-close{
        position: absolute;
        right: 20px;
        font-size: 20px;
        font-weight: bold;
        color: darkcyan !important;
        z-index: 10;
    }

    .pagination{
        margin-top: 5px;
    }

    .loading {
        height: 140px;
    }

    .avatar{
        display: inline-block;
        border-radius: 50%;
        overflow: hidden;
    }

    .readtitle{
        display: inline-block;
        border-left: 4px solid blue;
        text-indent: 10px;
    }

    li{
        margin-top: 15px;
        font-size: 14px;
    }
    .el-icon-caret-right{
        color: gray;
    }
    .read{
        width: 300px;
        margin: 0 auto;
        position: relative;
        right: 10px;
        background: #42b983;
        margin-top: 25px;
        padding: 10px;
        background: rgb(255,255,255);
    }
    .allAritcles i{
        cursor: pointer;
        color: #999;
    }
    .allAritcles .time i:nth-child(2){
        margin-left: 30px;
    }
    .allAritcles .time i:nth-child(1) {
        font-size: 18px;
    }
    .allAritcles .time{
        position: relative;
        color: #999;
        top: 10px;
    }
    .allAritcles .time span{
        position: absolute;
        right: 0;
    }
    .el-icon-view,
    .el-icon-chat-dot-round{
        font-size: 20px;
    }
    .someContent{
        margin-top: 10px;
        color: rgb(96,98,102);
        font-size: 16px;
        height: 45px;
        max-height: 52px;
        word-break: break-all;
        text-overflow: ellipsis;
        display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
        -webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
        -webkit-line-clamp: 2; /** 显示的行数 **/
        overflow: hidden;  /** 隐藏超出的内容 **/
    }

    .allAritcles{
        position: relative;
        font-size: 14px;
        border-bottom-color: rgba(176, 173, 168);
        padding: 20px 20px;
        overflow: hidden;
        border: 1px solid rgba(230,239,239);

    }

    .allAritcles:hover{
        background: rgb(230,235,245);
    }

    .allAritcles .title{
        /*background: #42b983;*/
        cursor: pointer;
        font-size: 21px;
        font-weight: 500;
        color: black;
        font-family: inherit;
        color: rgb(54, 57, 59);
    }

    .allAritcles .title:hover{
        color: blue;
    }

    .changeInfo:hover {
        border: 1px solid blue;
        background: blue;
    }

    .changeInfo {
        cursor: pointer;
        position: absolute;
        right: 30px;
        top: 5px;
        font-size: 14px;
        width: 120px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        border: 1px solid white;
    }

    .loading-shade {
        position: absolute;
        background: rgba(0, 0, 0, .3);
        z-index: 1;
        height: 100%;
        width: 100%;
        top: 0;
        left: 0;
    }

    .introduciton .describe {
        margin-top: 20px;
    }

    .introduciton h1 {
        margin-top: 20px;
    }

    .introduciton img {
        width: 120px;
        height: 120px;
        border-radius: 50%;
    }

    .introduciton {
        position: relative;
        z-index: 999;
    }

    .block {
        position: relative;
        width: 100%;
        height: 370px;
        background-image: url("../assets/basicPage/1-1.png");
        padding: 30px 0 20px 0;
        text-align: center;
        background-size: cover;
    }

    .introduciton {
        font-size: 17px;
        color: white;
    }

    .news {
        margin-top: 40px;
    }

    .news .questions .Lmore {
        position: absolute;
        bottom: 10px;
        right: 10px;
    }

    .questions {
        cursor: pointer;
    }

    .questions {
        width: 280px;
        height: 120px;
        padding: 10px 10px 10px 10px;
        background-color: #42b983;
        border-radius: 5px;
        position: relative;
        left: 10%;
        margin-top: 25px;
        background-image: url("../assets/basicPage/bac.jpg");
        background-size: cover;
        color: white;
    }

    .questions h3 {
        margin-top: 5px;
    }

    .questions p {
        margin-top: 20px;
    }

    .el-aside .el-button {
        width: 300px;
        position: relative;
        left: 10%;
        top: 20px;
    }

    .more:hover {
        background: blue;
        color: white;
    }


    .more {
        display: block;
        position: relative;
        left: 50%;
        transform: translate(-125px);
        width: 250px;
        height: 50px;
        line-height: 50px;
        font-size: 15px;
        font-weight: 200;
        text-align: center;
        border: 1px solid darkblue;
        color: blue;
    }

    .el-header {
        background-color: #42b983;
    }

    .el-aside {
        /*background-color: wheat;*/
        background-color: rgb(245,245,245);
    }

    .el-main {
        background-color: rgb(245, 245, 245);
    }

    .el-carousel__item {
        border-radius: 5px;
    }

    .el-carousel__item img {
        width: 100%;
        height: 100%;
    }

    .el-carousel__item:nth-child(2n) {
        background-color: #99a9bf;
    }

    .el-carousel__item:nth-child(2n+1) {
        background-color: #d3dce6;
    }

    .el-container{
        padding-top: 60px;
        min-height: 101vh;
    }
</style>
