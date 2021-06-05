<template>
    <el-container>
        <el-main>
            <div class="block">
                <el-carousel trigger="click" height="350px">
                    <el-carousel-item :key="1" @click.native.prevent="pushBasicArticle(6)">
                        <img src="../../assets/basicPage/Windows10.jpg">
                    </el-carousel-item>
                    <el-carousel-item :key="2" @click.native.prevent="pushBasicArticle(7)">
                        <img src="../../assets/basicPage/2.jpg">
                    </el-carousel-item>
                    <el-carousel-item :key="3" @click.native.prevent="pushBasicArticle(8)">
                        <img src="../../assets/basicPage/3.jpg">
                    </el-carousel-item>
                    <el-carousel-item :key="4" @click.native.prevent="pushBasicArticle(9)">
                        <img src="../../assets/basicPage/4.png">
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
                            <img src="../../assets/basicPage/7.jpg" alt="头像" v-else>
                            <div class="info">
                                <a class="name">{{item.username}}</a>
                                <div class="describe">{{item.describe}}</div>
                            </div>
                        </a>
                    </div>
                </div>
            <div class="scroll">
                <div class="hotread">
                    <div class="content">
                        <p class="title">
                            <i class="iconfont icon-yuedu"></i>
                            <span>热门阅读</span>
                        </p>
                        <div class="list">
                            <p v-for="(item,index) in hotread" @click="toArticle(index)">
                                <span class="Atitle">{{item.articletitle}}</span> <span>- {{item.articleface}}浏览</span>
                            </p>
                        </div>
                    </div>
                </div>
                <div class="copy">
                    <p><span>友情链接</span> · <span class="myblob" @click="myblob">我的博客</span></p>
                    <p><span>用户协议</span> <span>隐私政策</span> <span>使用指南</span></p>
                    <p>版权所有：Hsj-20180504</p>
                    <p>公司地址：暂无</p>
                    <p>举报邮箱： 1061691172@qq.com</p>
                    <p>©2021 HSJ</p>
                </div>
            </div>
        </el-aside>
    </el-container>
</template>

<script>
    import basicPageJS from "./basicPagejs";
    export default basicPageJS
</script>

<style lang="less" scoped>
    @import "~@/assets/font/iconfont.css";
    @import "~@/assets/font2/iconfont.css";
    @import "basicPageless";
</style>