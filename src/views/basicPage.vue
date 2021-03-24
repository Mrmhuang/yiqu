<template>
    <el-container>
        <el-main>
            <div class="block">
                <el-carousel trigger="click" height="350px">
                    <el-carousel-item :key="1">
                        <img src="../assets/basicPage/1.jpg">
                    </el-carousel-item>
                    <el-carousel-item :key="2">
                        <img src="../assets/basicPage/2.jpg">
                    </el-carousel-item>
                    <el-carousel-item :key="3">
                        <img src="../assets/basicPage/3.jpg">
                    </el-carousel-item>
                    <el-carousel-item :key="4">
                        <img src="../assets/basicPage/4.png">
                    </el-carousel-item>
                </el-carousel>
            </div>
            <div class="article">
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane v-for="(item,index) in articleClass" :label="item" :name="item">
                        <div class="loading"
                             v-loading="Aloading"
                             v-if="Aloading==true"
                             element-loading-text="拼命加载中"
                             element-loading-spinner="el-icon-loading"
                             element-loading-background="rgba(245, 245, 245, 0.8)"
                        ></div>
                        <div v-else>
                            <div v-for="(item,index) in Allarticles[item]" class="allAritcles" @click="toArticle(index)">
                                <span class="articleClass" v-if="item.articleClass">{{item.articleClass}}</span>
                                <p class="title">{{item.articletitle}}</p>
                                <p class="someContent" v-html="item.articleabstract"></p>
                                <p class="time">
                                    <span>{{item.releasetime | parseT}}</span>
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
        <el-aside width="400px">
            <div class="author">
                <p>🎖️他们也在创作</p>
                <div>
                    <a v-for="item in persons" class="eachperson" @click.prevent="toPerson(item.userid)">
                        <img :src="item.userpicture" alt="">
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
    import {parseTime} from "../utils";
    import {getAllClass, getAllUser, getSomeArticle} from "../axios/user";

    export default {
        name: "basicPage",
        data() {
            return {
                user: 'hsj',
                activeName: '最新博文',
                persons: [],
                loading: false,
                Allarticles: {
                    '最新博文': [],
                    '前端知识': [],
                    '后端知识': [],
                    '算法知识': [],
                    '安卓': [],
                    '电脑技巧': [],
                    'Linux': [],
                    '其他': []
                },
                articleClass:['最新博文','前端知识','后端知识','算法知识','安卓','电脑技巧','Linux','其他'],
                label: '最新博文',
                Aloading: false
            }
        },
        mounted() {
            getAllUser().then(result => {
                this.persons = result.data.msg
            })
            this.getSomeArticles(0, 10)
        },
        methods: {
            handleClick(tab, event) {
                console.log(tab);
                this.label = tab.label
                if (this.Allarticles[tab.label].length == 0) {
                    this.Aloading = true
                    this.getSomeArticles(0, 10, tab.label)
                }
                setTimeout(()=>{
                    this.Aloading = false
                },300)
            },
            toArticle(index) {
                let openArticle = this.$router.resolve({
                    path: '/article',
                    query: {
                        articleid: parseInt(this.Allarticles[this.label][index].articleid)
                    }
                })
                window.open(openArticle.href, "_blank")
            },
            toPerson(userid) {
                let temp = this.$router.resolve({
                    path: '/personal',
                    query: {
                        id: userid
                    }
                })
                window.open(temp.href, "_blank")
            },
            displayWechat(index) {
                var wechat = document.getElementById("wechat")
                if (index == 1) {
                    wechat.style.display = "block"
                } else {
                    wechat.style.display = "none"
                }
            },
            getSomeArticles(offset, limitsum, articleclass) {
                getSomeArticle({offset: offset, limitsum: limitsum, articleclass: articleclass}).then(result => {
                    console.log(result)
                    if (result.data.code == -1) {
                        this.$message({
                            type: 'success',
                            message: '没有更多内容了'
                        })
                    } else if (articleclass == undefined) {
                        let temp1 = this.Allarticles['最新博文'].concat(result.data.msg)
                        this.Allarticles['最新博文'] = temp1
                        console.log(this.Allarticles['最新博文'])
                    } else {
                        for (var item in this.Allarticles) {
                            if (item == articleclass) {
                                let temp1 = this.Allarticles[item].concat(result.data.msg)
                                this.Allarticles[item] = temp1
                                console.log(this.Allarticles[item])
                            }
                        }
                    }
                })
            },
            getmore() {
                this.loading = true
                if (this.label == '最新博文') {
                    this.getSomeArticles(this.Allarticles['最新博文'].length, 10)
                    this.loading = false
                } else {
                    this.getSomeArticles(this.Allarticles[this.label].length, 10, this.label)
                    this.loading = false
                }
            }
        },
        filters: {
            parseT(value) {
                return parseTime(value, '{y}-{m}-{d} {h}:{i}')
            }
        }
    }
</script>

<style scoped>
    .loading{
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
        border-bottom: 1px solid rgb(245,245,245);
        border-left: 1px solid rgb(245,245,245);
        border-right: 1px solid rgb(245,245,245);
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
        display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
        -webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
        -webkit-line-clamp: 1; /** 显示的行数 **/
        overflow: hidden; /** 隐藏超出的内容 **/
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
        display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
        -webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
        -webkit-line-clamp: 2; /** 显示的行数 **/
        overflow: hidden; /** 隐藏超出的内容 **/
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
        border: 1px solid rgb(18,57,131);
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


<!--                    <el-tab-pane label="最新博文" name="first">-->
<!--                        <div v-for="(item,index) in Allarticles['最新博文']" class="allAritcles" @click="toArticle(index)">-->
<!--                            <span class="articleClass" v-if="item.articleClass">{{item.articleClass}}</span>-->
<!--                            <p class="title">{{item.articletitle}}</p>-->
<!--                            <p class="someContent" v-html="item.articleabstract"></p>-->
<!--                            <p class="time">-->
<!--                                <span>{{item.releasetime | parseT}}</span>-->
<!--                            </p>-->
<!--                        </div>-->
<!--                    </el-tab-pane>-->
<!--                    <el-tab-pane label="前端知识" name="second"-->
<!--                                 element-loading-text="拼命加载中"-->
<!--                                 element-loading-spinner="el-icon-loading"-->
<!--                                 element-loading-background="rgba(0, 0, 0, 0.8)"-->
<!--                                 v-loading="this.Aloading"-->
<!--                    >-->
<!--                        <div v-for="(item,index) in Allarticles['前端知识']" class="allAritcles"-->
<!--                             v-if="checkTitle(item.articleClass,`前端知识`)" @click="toArticle(index)">-->
<!--                            <span class="articleClass" v-if="item.articleClass">{{item.articleClass}}</span>-->
<!--                            <p class="title">{{item.articletitle}}</p>-->
<!--                            <p class="someContent" v-html="item.articleabstract"></p>-->
<!--                            <p class="time">-->
<!--                                <span>{{item.releasetime | parseT}}</span>-->
<!--                            </p>-->
<!--                        </div>-->
<!--                    </el-tab-pane>-->
<!--                    <el-tab-pane label="后端知识" name="sixth">-->
<!--                        <div v-for="(item,index) in Allarticles['后端知识']" class="allAritcles"-->
<!--                             v-if="checkTitle(item.articleClass,`后端知识`)" @click="toArticle(index)">-->
<!--                            <span class="articleClass" v-if="item.articleClass">{{item.articleClass}}</span>-->
<!--                            <p class="title">{{item.articletitle}}</p>-->
<!--                            <p class="someContent" v-html="item.articleabstract"></p>-->
<!--                            <p class="time">-->
<!--                                <span>{{item.releasetime | parseT}}</span>-->
<!--                            </p>-->
<!--                        </div>-->
<!--                    </el-tab-pane>-->
<!--                    <el-tab-pane label="算法知识" name="seventh">-->
<!--                        <div v-for="(item,index) in Allarticles['算法知识']" class="allAritcles"-->
<!--                             v-if="checkTitle(item.articleClass,`算法知识`)" @click="toArticle(index)">-->
<!--                            <span class="articleClass" v-if="item.articleClass">{{item.articleClass}}</span>-->
<!--                            <p class="title">{{item.articletitle}}</p>-->
<!--                            <p class="someContent" v-html="item.articleabstract"></p>-->
<!--                            <p class="time">-->
<!--                                <span>{{item.releasetime | parseT}}</span>-->
<!--                            </p>-->
<!--                        </div>-->
<!--                    </el-tab-pane>-->
<!--                    <el-tab-pane label="安卓" name="third">-->
<!--                        <div v-for="(item,index) in Allarticles['安卓']" class="allAritcles"-->
<!--                             v-if="checkTitle(item.articleClass,`安卓`)" @click="toArticle(index)">-->
<!--                            <span class="articleClass" v-if="item.articleClass">{{item.articleClass}}</span>-->
<!--                            <p class="title">{{item.articletitle}}</p>-->
<!--                            <p class="someContent" v-html="item.articleabstract"></p>-->
<!--                            <p class="time">-->
<!--                                <span>{{item.releasetime | parseT}}</span>-->
<!--                            </p>-->
<!--                        </div>-->
<!--                    </el-tab-pane>-->
<!--                    <el-tab-pane label="电脑技巧" name="fourth">-->
<!--                        <div v-for="(item,index) in Allarticles['电脑技巧']" class="allAritcles"-->
<!--                             v-if="checkTitle(item.articleClass,`电脑技巧`)" @click="toArticle(index)">-->
<!--                            <span class="articleClass" v-if="item.articleClass">{{item.articleClass}}</span>-->
<!--                            <p class="title">{{item.articletitle}}</p>-->
<!--                            <p class="someContent" v-html="item.articleabstract"></p>-->
<!--                            <p class="time">-->
<!--                                <span>{{item.releasetime | parseT}}</span>-->
<!--                            </p>-->
<!--                        </div>-->
<!--                    </el-tab-pane>-->
<!--                    <el-tab-pane label="Linux" name="eighth">-->
<!--                        <div v-for="(item,index) in Allarticles['Linux']" class="allAritcles"-->
<!--                             v-if="checkTitle(item.articleClass,`Linux`)" @click="toArticle(index)">-->
<!--                            <span class="articleClass" v-if="item.articleClass">{{item.articleClass}}</span>-->
<!--                            <p class="title">{{item.articletitle}}</p>-->
<!--                            <p class="someContent" v-html="item.articleabstract"></p>-->
<!--                            <p class="time">-->
<!--                                <span>{{item.releasetime | parseT}}</span>-->
<!--                            </p>-->
<!--                        </div>-->
<!--                    </el-tab-pane>-->
<!--                    <el-tab-pane label="其他" name="fifth">-->
<!--                        <div v-for="(item,index) in Allarticles['其他']" class="allAritcles"-->
<!--                             v-if="checkTitle(item.articleClass,`其他`)" @click="toArticle(index)">-->
<!--                            <span class="articleClass" v-if="item.articleClass">{{item.articleClass}}</span>-->
<!--                            <p class="title">{{item.articletitle}}</p>-->
<!--                            <p class="someContent" v-html="item.articleabstract"></p>-->
<!--                            <p class="time">-->
<!--                                <span>{{item.releasetime | parseT}}</span>-->
<!--                            </p>-->
<!--                        </div>-->
<!--                    </el-tab-pane>-->

