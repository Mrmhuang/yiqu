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
                        <img src="../../assets/basicPage/7.jpg" v-if="!this.user.userpicture">
                        <img :src="this.user.userpicture" v-else>
                    </div>
                    <h1>{{this.user.username}}</h1>
                    <p class="describe">{{this.user.describe}}</p>
                </div>
            </div>
            <div class="article">
                <el-button type="primary" class="editmyarticle" @click.native.prevent="handleClickEdit" v-if="this.$store.state.userid == this.$route.query.id">管理我的文章</el-button>
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
    import personaljs from "./personaljs";
    export default personaljs
</script>
<style lang="less" scoped>
    @import "~@/assets/font/iconfont.css";
    @import "personalless";
</style>
