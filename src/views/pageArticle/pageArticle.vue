<template>
    <div class="main">
        <el-container>
            <el-aside class="hidden-sm-only hidden-xs-only" width="25%">
                <img :src="this.userpicture">
                <h2>{{this.username}}</h2>
                <p class="describe">
                    {{this.describe}}
                </p>
            </el-aside>
            <el-main ref="content" style="padding: 0">
                <div class="blogcontent">
                    <div class="decoreation"></div>
                    <h1>{{this.art.articletitle}}</h1>
                    <p v-html="this.art.articleabstract" class="content"></p>
                    <p class="time">
                        <i class="el-icon-time"></i>
                        <span>{{this.art.releasetime | parseT}}</span>
                        • 收藏 {{this.mark}}</p>
                    <p class="tags tagtype" ref="tags">
                        <span>文章标签：</span><span v-for="item in this.tags" class="tag">{{item}}</span>
                    </p>
                    <el-divider></el-divider>
                    <mavon-editor
                            class="md"
                            :value="this.art.articlecontent"
                            :subfield = "false"
                            :defaultOpen = "'preview'"
                            :toolbarsFlag = "false"
                            :editable="false"
                            :scrollStyle="true"
                            :ishljs = "true"
                            :boxShadow="false"
                    ></mavon-editor>
                </div>
                <div class="marktable" id="marktable" ref="marktable">
                    <div class="dianzan">
                        <i class="iconfont icon-dianzan" v-show="!iszan" @click="zanArticle(articleid)"></i>
                        <i class="iconfont icon-dianzan1-copy" v-show="iszan"
                           @click.stop="cancelZanArticle(articleid)"></i>
                        <span>点赞</span>
                    </div>
                    <div>
                        <i class="el-icon-star-off" id="staroff" v-show="!ismark" @click="markArticle(articleid)"></i>
                        <i class="el-icon-star-on" id="staron" v-show="ismark"
                           @click.stop="cancelMarkArticle(articleid)"></i>
                        <span>收藏</span>
                    </div>
                    <div><i class="el-icon-chat-dot-round" @click="addCom"></i><span>评论</span></div>
                </div>
            </el-main>
        </el-container>
        <div class="foot" ref="foot">
            <div class="comment">
                <div class="submitComment">
                    <p class="title">发表评论</p>
                    <el-input type="textarea" class="area" placeholder="在此输入正文" v-model="mycomment"
                              :rows="4"></el-input>
                    <el-button type="primary" round class="submit" @click="submitComment">提交</el-button>
                </div>
                <div class="commentArea" v-if="someInfo">
                    <p class="title">评论列表</p>
                    <div class="eachcomment" v-for="(item,index) in this.commonComment">
                        <div class="comment-inner">

                            <div class="vcard">
                                <img alt="头像"
                                     :src="getVcard(item.userid)" height="60" width="60" v-if="getVcard(item.userid)">
                                <img alt="头像"
                                     src="../../assets/basicPage/7.jpg" height="60" width="60" v-else>
                            </div>
                            <div class="comment-body">
                                <div class="nickname" @click="toPersonal(item.userid)">{{getName(item.userid)}}<br/>
                                    <span class="comment-time">{{item.commenttime | parseT}}</span>
                                </div>
                                <div class="comment-text">
                                    <p>{{item.commentcontent}}<i class="el-icon-chat-line-round" @click="reply(index)"></i></p>
                                </div>
                            </div>
                        </div>
                        <div class="reply" v-show="replyindex==index">
                            <el-input type="textarea" class="replyArea" placeholder="在此输入正文" v-model="replyComment"
                                      :rows="4"></el-input>
                            <div class="replyButton">
                                <div class="sub">
                                    <el-button plain round @click="cancelReply">取消回复</el-button>
                                    <el-button type="primary" round @click="submitReply(item.commentid,item.userid)">回复</el-button>
                                </div>
                            </div>
                        </div>
                        <div v-for="(item2,index2) in item.replyComments" class="replyDiv">
                                <img alt="头像" :src="getVcard(item2.userid)" height="20" width="20" class="replyAvatar" v-if="getVcard(item2.userid)">
                                 <img alt="头像" src="../../assets/basicPage/7.jpg" height="20" width="20" class="replyAvatar" v-else>
                            <span class="replyname" v-text="getName(item2.userid)" @click="toPersonal(item2.userid)"></span>
                            <span class="replySpan">回复</span>
                                <span v-if="item2.userid!==item2.touserid">
                                    <img alt="头像"
                                         :src="getVcard(item2.touserid)" height="20" width="20" class="replyAvatar" v-if="getVcard(item2.touserid)">
                                    <img alt="头像"
                                         src="../../assets/basicPage/7.jpg" height="20" width="20" class="replyAvatar" v-else>
                                    <span v-text="getName(item2.touserid)" class="replyname" @click="toPersonal(item2.touserid)"></span>
                                </span>
                                    <span class="replySpan">:</span>
                                    <span class="replyContent">
                                        {{item2.commentcontent}}
                                    </span>
                                <span class="replycomment-time">
                                    {{item2.commenttime | parseT}}
                                </span>
                            <i class="el-icon-chat-line-round" @click="reply2(index2)"></i>
                            <div class="reply" v-show="replyindex2==index2">
                                <el-input type="textarea" class="replyArea" placeholder="在此输入正文" v-model="replyComment"
                                          :rows="4"></el-input>
                                <div class="replyButton">
                                    <div class="sub">
                                        <el-button plain round @click="cancelReply">取消回复</el-button>
                                        <el-button type="primary" round @click="submitReply(item.commentid,item2.userid)">回复</el-button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import pageArticlejs from "./pageArticlejs";
    export default pageArticlejs
</script>

<style lang="less" scoped>
    @import "~assets/font/iconfont.css";
    @import "pageArticleless";
</style>
