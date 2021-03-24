<template>
    <el-container>
        <el-main>
            <div class="block">
                <div class="loading-shade"></div>
                <div class="introduciton">
                    <div class="changeInfo" v-if="parseInt(this.$store.state.userid)==parseInt(this.$route.query.id)">
                        <div @click="changeInfo" class="icon-i">
                            <i class="el-icon-s-custom"></i> 修改信息
                        </div>
                    </div>
                    <img src="../assets/basicPage/1.jpg">
                    <h1>{{this.user.username}}</h1>
                    <p class="describe">{{this.user.describe}}</p>
                </div>
            </div>
            <div class="article">
                <el-tabs v-model="activeName" @tab-click="">
                    <el-tab-pane :label="getPersonalArticle" name="first" >
                        <div v-for="(item,index) in article" class="allAritcles" @click="toArticle(index)">
                            <p class="title">{{item.articletitle}}</p>
                            <p class="someContent" v-html="item.articleabstract"></p>
                            <p class="time">
                                <i class="el-icon-view">1234</i>
                                <i class="el-icon-chat-dot-round">0</i>
                                <span>{{item.releasetime | parseT}}</span>
                            </p>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane :label="getPersonalMark" name="second">
                        <div v-for="(item,index) in markArticle" class="allAritcles" @click="toMarkArticle(index)">
                            <p class="title">{{item.articletitle}}</p>
                            <p class="someContent" v-html="item.articleabstract"></p>
                            <p class="time">
                                <i class="el-icon-view">1234</i>
                                <i class="el-icon-chat-dot-round">0</i>
                                <span>{{item.releasetime | parseT}}</span>
                            </p>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </el-main>
        <el-aside width="400px">
            <el-button type="primary" class="ask">问题咨询</el-button>
            <div class="news">
                <div v-for="item in questions" class="questions">
                    <h3>{{item.title}}</h3>
                    <p>{{item.describe}}</p>
                    <p class="Lmore"><i class="el-icon-caret-right"></i>查看更多</p>
                </div>
                <div class="read" ref="read">
                    <p class="readtitle">热门阅读</p>
                    <ul>
                        <li v-for="item in title"><i class="el-icon-caret-right"></i>{{item}}</li>
                    </ul>
                </div>
            </div>
        </el-aside>
    </el-container>
</template>

<script>
    import {parseTime} from "../utils";
    export default {
        name: "personal",
        mounted() {
            console.log(this.$route.query.id)
            console.log(this.$store)
            this.$store.dispatch('getArticle', this.$route.query.id).then(result => {
                // console.log(result)
                this.article = result.data.msg
                // console.log(this.article)
            })
            this.$store.dispatch('getOne',parseInt(this.$route.query.id)).then(result=>{
                console.log('getone',result)
                this.user = result.data.data[0]
                // console.log(this.user)
            })
            this.$store.dispatch('getPerMark',parseInt(this.$route.query.id)).then(result=>{
                console.log('getpersonalMark',result)
                this.markArticle = result.data.msg
            })
            window.addEventListener('scroll', this.handleScroll, true)
        },
        data() {
            return {
                user: {},
                activeName: 'first',
                questions: [{
                    title: '马化腾重回中国首富',
                    describe: '开发者入侵微博服务器刷流量，被判5年 | 极客日报'
                }, {
                    title: '未来畅想',
                    describe: '到2035年，你觉得科技领域会出现哪些颠覆性的创新技术?'
                }],
                article:[],
                markArticle:[],
                title:[`如果电脑没装这7个软件，基本算是废了！ - 16,948 浏览`,
            `WPS 2019专业版安装包+永久授权激活码 - 73,351 浏览`,
            `APKCombo-国内直接下载Google Play所有应用。 - 66,434 浏览`,
            `百度网盘超级会员账号分享，低调使用。 - 37,584 浏览`,
            `洛雪音乐助手—支持6大音乐平台，QQ音乐、网易音乐 - 33,476 浏览`,
            `四大经典迅雷版本，无广告无限制统统支持！！ - 29,381 浏览`,
            `Blackmart（谷歌黑市场）第三方谷歌市场替代软件，Google Play直接下载 - 26,099 浏览`,
            `高清无水印无广告影视资源下载网站分享！ - 24,833 浏览`,
            `无需登录账号的百度网盘高速下载方法！百度网盘直链在线解析网站 - 23,416 浏览`,
            `PotPlayer播放器+8000个电影电视直播源 - 20,949 浏览`,
            `PotPlayer播放器+上千个电影电视直播源 - 20,767 浏览`]
            }
        },
        methods: {
            handleScroll(e) {         //监听滚动条
                var read = document.querySelector(".read")
                console.log(read.offsetTop)
                // console.log(window.scrollY)
                let scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
                // if ((window.scrollY + 60) > (read.offsetTop)) {
                //     read.style.position = 'absolute'
                //     read.style.top = read.offsetTop + 60 + (window.scrollY - read.offsetTop) + 'px'
                //     console.log("进来了",window.scrollY - read.offsetTop)
                // }else {
                //
                // }
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
    .allAritcles .time{
        position: relative;
        color: #999;
        top: 10px;
    }
    .allAritcles .time span{
        position: absolute;
        right: 0;
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
        right: 50px;
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
    }
</style>
