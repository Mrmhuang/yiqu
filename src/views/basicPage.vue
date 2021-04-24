<template>
    <el-container>
        <el-main>
            <div class="block">
                <el-carousel trigger="click" height="350px">
                    <el-carousel-item :key="1" @click.native.prevent="pushBasicArticle(6)">
                        <img src="../assets/basicPage/Windows10.jpg">
                    </el-carousel-item>
                    <el-carousel-item :key="2" @click.native.prevent="pushBasicArticle(7)">
                        <img src="../assets/basicPage/2.jpg">
                    </el-carousel-item>
                    <el-carousel-item :key="3" @click.native.prevent="pushBasicArticle(8)">
                        <img src="../assets/basicPage/3.jpg">
                    </el-carousel-item>
                    <el-carousel-item :key="4" @click.native.prevent="pushBasicArticle(9)">
                        <img src="../assets/basicPage/4.png">
                    </el-carousel-item>
                </el-carousel>
            </div>
            <div class="article">
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane v-for="(item,index) in articleClass" :label="item" :name="item">
                        <div class="loading" v-loading="Aloading" v-if="Aloading==true" element-loading-text="拼命加载中"
                            element-loading-spinner="el-icon-loading"
                            element-loading-background="rgba(245, 245, 245, 0.8)"></div>
                        <div v-else>
                            <div v-for="(item1,index) in Allarticles[item]" class="allAritcles"
                                @click="toArticle(index)">

                                <span class="articleClass hidden-md-and-down"
                                    v-if="item=='最新博文'">{{item1.articleClass}}</span>
                                <p class="title">{{item1.articletitle}}</p>
                                <p class="someContent" v-html="item1.articleabstract"></p>
                                <p class="time">
                                    <i class="iconfont icon-dianzan">&nbsp;&nbsp;{{item1.articlegives}}</i>
                                    <i class="el-icon-view">&nbsp;&nbsp;{{item1.articleface}}</i>
                                    <span>{{item1.releasetime | parseT}}</span>
                                </p>
                            </div>
                            <div class="moreDiv" v-show="Allarticles[item]!=null">
                                <a href="#" class="more" v-loading="loading" @click.prevent="getmore">点击查看更多</a>
                            </div>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </el-main>
        <el-aside class="hidden-xs-only" width="400px">
            <div class="author">
                <p>🎖️他们也在创作</p>
                <div>
                    <a v-for="item in persons" class="eachperson" @click.prevent="toPerson(item.userid)">
                        <img :src="item.userpicture" alt="头像" v-if="item.userpicture">
                        <img src="../assets/basicPage/7.jpg" alt="头像" v-else>
                        <div class="info">
                            <a class="name">{{item.username}}</a>
                            <div class="describe">{{item.describe}}</div>
                        </div>
                    </a>
                </div>
            </div>
            <div class="copy">
                <p>关于营业执照 · <a href="www.baidu.com">友情链接</a></p>
                <p>用户协议隐私政策使用指南</p>
                <p>版权所有：Hsj-20180504</p>
                <p>公司地址：暂无</p>
                <p>举报邮箱： 1061691172@qq.com</p>
                <p>©2021 HSJ</p>
            </div>
            <div class="chat">
                <img src="../assets/wechat.ce329e6.png" alt="" @mouseover="displayWechat(1)"
                    @mouseleave="displayWechat">
                <img src="../assets/mypofile.png" alt="" id="wechat">
            </div>
        </el-aside>
    </el-container>
</template>

<script>
    import {
        parseTime
    } from "../utils";
    import {
        getAllClass,
        getAllUser,
        getSomeArticle
    } from "../axios/user";
    export default {
        name: "basicPage",
        data() {
            return {
                activeName: '最新博文', //el-tab-pane需要用到
                label: '最新博文', //记录当前的label
                persons: [], //随机获取它们在创作的三个人
                Allarticles: { //放文章
                    '最新博文': []
                },
                articleClass: ['最新博文'],
                Aloading: false, //切换pane的时候要用的的
                loading: false //加载更多的时候要用到
            }
        },
        async mounted() {
            getAllUser().then(result => { //获取三个人的所有信息
                this.persons = result.data.msg
            })
            getAllClass().then(result => {
                var This = this
                let classData = result.data.msg
                classData.forEach(function (item) {
                    This.articleClass.push(item.classifyname)
                    This.$set(This.Allarticles, item.classifyname, new Array())
                })
            })

            this.Aloading = true
            await this.getSomeArticles(0, 10) //获取最新博文，渲染首页
            this.Aloading = false
            
        },
        methods: {
            async handleClick(tab, event) { //点击el-tab-pane触发事件
                // console.log(tab);
                this.label = tab.label
                this.lab
                if (this.Allarticles[tab.label].length !== 0) {
                    return;
                }
                if (this.Allarticles[tab.label].length == 0) { //如果长度是0，就渲染
                    this.Aloading = true
                    await this.getSomeArticles(0, 10, this.label) //从0开始获取当前分类的文章
                    this.Aloading = false
                }
            },
            toArticle(index) { //跳转去相应的文章
                let openArticle = this.$router.resolve({
                    path: '/article',
                    query: {
                        articleid: parseInt(this.Allarticles[this.label][index].articleid)
                    }
                })
                window.open(openArticle.href, "_blank") //在新页面打开
            },
            toPerson(userid) { //去某个人的个人中心
                let temp = this.$router.resolve({
                    path: '/personal',
                    query: {
                        id: userid
                    }
                })
                window.open(temp.href, "_blank")
            },
            displayWechat(index) { //显示个人二维码
                let wechat = document.getElementById("wechat")
                index == 1 ? wechat.style.display = "block" : wechat.style.display = "none"
            },
            async getSomeArticles(offset, limitsum, articleclass) { //获取某个类别的最新文章。参数：偏移量，获取条数，类别的文章(类别不填就当作最新博文)
                await getSomeArticle({
                    offset: offset,
                    limitsum: limitsum,
                    articleclass: articleclass
                }).then(result => {
                    if (result.data.code == -1) {
                        this.$message({
                            type: 'success',
                            message: '没有更多内容了'
                        })
                    } else if (articleclass == undefined) {
                        let temp1 = this.Allarticles['最新博文'].concat(result.data.msg)
                        this.Allarticles['最新博文'] = temp1
                    } else {
                        let temp1 = this.Allarticles[articleclass].concat(result.data.msg)
                        this.Allarticles[articleclass] = temp1
                    }
                })
            },
            async getmore() { //获取更多的文章
                this.loading = true
                if (this.label == '最新博文') {
                    await this.getSomeArticles(this.Allarticles['最新博文'].length, 10)
                } else {
                    await this.getSomeArticles(this.Allarticles[this.label].length, 10, this.label)
                }
                this.loading = false
            },
            pushBasicArticle(key) { //跳转去文章页
                var temp = this.$router.resolve({
                    path: 'article',
                    query: {
                        articleid: key
                    }
                })
                window.open(temp.href, "_blank")
            }
        },
        filters: {
            parseT(value) { //时间戳格式化
                return parseTime(value, '{y}-{m}-{d} {h}:{i}')
            }
        }
    }
</script>

<style lang="less" scoped>
    @import "~@/assets/font/iconfont.css";

    .loading {
        height: 140px;
    }

    .moreDiv a {
        position: relative;
        display: block;
        margin: 0 auto;
        top: 50%;
        transform: translate(0, -50%);
    }

    .moreDiv {
        border-bottom: 1px solid rgb(245, 245, 245);
        border-left: 1px solid rgb(245, 245, 245);
        border-right: 1px solid rgb(245, 245, 245);
        display: flex;
        background: white;
        height: 100px;
    }

    .chat {
        position: relative;
        width: 80%;
        margin: 0 auto;
        margin-top: 20px;
    }

    .chat img:nth-child(1) {
        width: 40px;
        cursor: pointer;
    }

    .chat img:nth-child(2) {
        position: absolute;
        width: 150px;
        cursor: pointer;
        left: 0;
        top: 55px;
        display: none;
    }

    .copy p {
        margin-top: 10px;
    }

    .copy a {
        color: darkgrey;
    }

    .copy {
        /*background: white;*/
        width: 80%;
        margin: 0 auto;
        margin-top: 30px;
        border-radius: 2px;
        font-size: 14px;
        line-height: 1.29;
        color: darkgrey;
    }

    .author a {
        cursor: pointer;
    }

    .author a:hover {
        background: rgb(245, 245, 245);
    }

    .info .describe {
        color: #909090;
        font-size: 12px;
        margin-bottom: 3px;
        max-height: 52px;
        word-break: break-all;
        text-overflow: ellipsis;
        display: -webkit-box;
        /** 对象作为伸缩盒子模型显示 **/
        -webkit-box-orient: vertical;
        /** 设置或检索伸缩盒对象的子元素的排列方式 **/
        -webkit-line-clamp: 1;
        /** 显示的行数 **/
        overflow: hidden;
        /** 隐藏超出的内容 **/
    }

    .info .name {
        color: black;
        font-size: 18px;
        margin-bottom: 3px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .author .info {
        margin-left: 15px;
    }

    .eachperson {
        display: flex;
        align-items: center;
        margin-top: 15px;
    }

    .author img {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        /*flex: 0 0 auto;*/
    }

    .author p {
        text-indent: 5px;
        height: 50px;
        line-height: 50px;
        font-size: 18px;
        font-weight: 500;
        border-bottom: 1px solid darkgrey;
    }

    .author {
        padding: 10px;
        width: 80%;
        background: white;
        margin: auto;
        margin-top: 20px;
    }

    .articleClass {
        position: absolute;
        height: 10px;
        line-height: 10px;
        display: block;
        padding: 10px;
        background: rgba(0, 0, 0, .6);
        color: white;
        font-size: 8px;
        right: 20px;
    }

    .someContent {
        margin-top: 10px;
        color: rgb(96, 98, 102);
        font-size: 16px;
        height: 45px;
        max-height: 52px;
        word-break: break-all;
        text-overflow: ellipsis;
        display: -webkit-box;
        /** 对象作为伸缩盒子模型显示 **/
        -webkit-box-orient: vertical;
        /** 设置或检索伸缩盒对象的子元素的排列方式 **/
        -webkit-line-clamp: 2;
        /** 显示的行数 **/
        overflow: hidden;
        /** 隐藏超出的内容 **/
    }

    .allAritcles {
        font-size: 14px;
        border-bottom-color: rgba(176, 173, 168);
        padding: 20px 20px;
        overflow: hidden;
        border: 1px solid rgba(230, 239, 239);
        min-height: 100px;
    }

    .allAritcles:hover {
        background: rgb(230, 235, 245);
    }

    .allAritcles .title {
        cursor: pointer;
        font-size: 21px;
        font-weight: 500;
        color: black;
        font-family: inherit;
        color: rgb(54, 57, 59);
    }

    .allAritcles .title:hover {
        color: blue;
    }

    .allAritcles i {
        cursor: pointer;
        color: #999;
    }

    .allAritcles .time i:nth-child(2) {
        margin-left: 30px;
    }

    .allAritcles .time i:nth-child(1) {
        font-size: 15px;
    }

    .allAritcles .time {
        position: relative;
        color: #999;
        top: 10px;
    }

    .allAritcles .time span {
        position: absolute;
        right: 0;
    }

    .el-aside .el-button {
        width: 300px;
        position: fixed;
        right: 59px;
        top: 100px;
    }

    .more:hover {
        background: blue;
        color: white;
    }

    .more {
        width: 250px;
        height: 50px;
        line-height: 50px;
        font-size: 15px;
        font-weight: 200;
        text-align: center;
        border: 1px solid rgb(18, 57, 131);
        color: blue;
        border-radius: 10px;
    }

    .el-header {
        background-color: #42b983;
    }

    .el-main {
        height: auto;
        min-height: 100vh;
        background: white;
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

    .el-container {
        height: auto;
        padding-top: 60px;
        background-color: rgb(245, 245, 245);
    }
</style>