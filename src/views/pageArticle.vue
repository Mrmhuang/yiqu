<template>
    <div class="main">
        <el-container>
            <el-aside class="hidden-sm-only hidden-xs-only" width="25%">
                <img :src="this.userpicture">
                <h2>{{this.username}}</h2>
            </el-aside>
            <el-main ref="content">
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
                    <div><i class="el-icon-chat-dot-round"></i><span>评论</span></div>
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
                                     src="../assets/basicPage/7.jpg" height="60" width="60" v-else>
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
                                 <img alt="头像" src="../assets/basicPage/7.jpg" height="20" width="20" class="replyAvatar" v-else>
                            <span class="replyname" v-text="getName(item2.userid)" @click="toPersonal(item2.userid)"></span>
                            <span class="replySpan">回复</span>
                                <span v-if="item2.userid!==item2.touserid">
                                    <img alt="头像"
                                         :src="getVcard(item2.touserid)" height="20" width="20" class="replyAvatar" v-if="getVcard(item2.touserid)">
                                    <img alt="头像"
                                         src="../assets/basicPage/7.jpg" height="20" width="20" class="replyAvatar" v-else>
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
    import {parseTime} from "../utils";
    import {iszan, ismark, getPageComment, getSomePerson,addReply, getOnePersonal, addArticleFace, addArticleEnshrineNums, cancelArticleEnshrineNums,addArticleGives,cancelArticleGives} from "../axios/user";

    export default {
        name: "pageArticle",
        mounted() {
            window.addEventListener('scroll', this.handleScroll, true)  //添加滚动事件
            this.articleid = this.$route.query.articleid
            this.$store.dispatch('getPageArticle', this.$route.query.articleid).then(res => {    //获取文章的信息
                this.art = res.data.msg[0]
                this.mark = this.art.articleenshrinenums
                this.tags = this.art.articlelabel.split(',')
                if (this.tags[0] == "") {
                    this.$refs.tags.innerHTML = '文章标签：无'
                    this.$refs.tags.setAttribute("class", "tags")
                }
                getOnePersonal(this.art.userid).then(userInfo=>{  //获取个人信息
                    this.username = userInfo.data.data[0].username
                    this.userpicture = userInfo.data.data[0].userpicture
                })

            })
            ismark({userid: this.$store.state.userid, articleid: this.$route.query.articleid}).then(result => {  //获取用户是否收藏过
                if (result.data.msg[0].nums > 0) {
                    this.ismark = true
                } else {
                    this.ismark = false
                }
            })

            iszan({userid: this.$store.state.userid, articleid: this.$route.query.articleid}).then(result => {   //获取用户是否赞过
                if (result.data.msg[0].nums > 0) {
                    this.iszan = true
                } else {
                    this.iszan = false
                }
            })

            this.getPageC()

            setTimeout(()=>{
                var marktable = document.querySelector('.marktable')
                var elMain = document.querySelector('.el-main')
                // console.log(document.documentElement.clientHeight < elMain.getBoundingClientRect().bottom)
                if(document.documentElement.clientHeight < elMain.getBoundingClientRect().bottom){  //滚动事件
                    marktable.style.position = 'absolute'
                    marktable.style.left = 0
                    marktable.style.top = document.documentElement.clientHeight - 140 + 'px'
                }
            },200)

            addArticleFace(this.$route.query.articleid).then(result=>{  //让文章观看量+1
                // console.log('')
            })

        },
        data() {
            return {
                art: {},
                tags: null,
                mark: 0,
                articleid: undefined,
                ismark: true,
                mycomment: '',
                comment: [],
                someInfo: null,
                replyindex:-1,
                replyComment:'',
                commonComment:[],
                replyComments:[],
                replyindex2:-2,
                username:null,
                iszan:false,
                userpicture:null
            }
        },
        filters: {
            parseT(Value) {
                return parseTime(Value, '{y}-{m}-{d} {h}:{i}')
            }
        },
        methods: {
            toPersonal(id){
                let toPersonal = this.$router.resolve({
                    path:'/personal',
                    query:{
                        id
                    }
                })
                window.open(toPersonal.href,'_blank')
            },
            submitReply(commentid,toUserId){  //提交回复
                if(this.$store.state.userid){
                    let temp = {}
                    temp.articleid = this.$route.query.articleid
                    temp.parentcommentid = commentid  //被回复人的评论id
                    temp.content = this.replyComment
                    temp.userid = this.$store.state.userid
                    temp.touserid = toUserId  //被回复人的id
                    addReply(temp).then(res=>{
                        this.replyindex = -1
                        this.replyindex2 = -1
                        this.$message({
                            type: 'success',
                            message: '回复成功',
                            customClass:'zZindex'
                        })
                        location.reload()
                    })
                }else{
                    this.$message({
                        showClose: true,
                        message: '请先登陆'
                    });
                }
            },
            getPageC(){  //获取全部评论
                getPageComment(this.$route.query.articleid).then(result => {
                    this.comment = result.data.msg   //全部评论
                    this.replyComments = this.comment.filter(function (item,index) {
                        return item.parentcommentid!=null
                    })
                    this.commonComment = this.comment.filter(function (item,index) {
                        return item.parentcommentid==null
                    })

                    for(var j=0;j<this.commonComment.length;j++){
                        this.commonComment[j].replyComments = []
                        for(let i=0;i<this.replyComments.length;i++){  //如何优化
                            if(this.replyComments[i].parentcommentid==this.commonComment[j].commentid){
                                this.commonComment[j].replyComments.push(this.replyComments[i])
                            }
                        }
                    }
                    const map = new Map();
                    const get = []
                    if (this.comment.length > 0) {
                        this.comment.forEach(function (item, index) {
                            if (!map.has(item.userid)) {
                                map.set(item.userid, "")
                                get.push(item.userid)
                            }
                        })
                        getSomePerson(get).then(res => {
                            var newmap = new Map()
                            for (let i = 0; i < res.data.msg.length; i++) {
                                newmap.set(res.data.msg[i].userid, res.data.msg[i])
                            }
                            this.someInfo = newmap
                            // console.log(this.someInfo)
                        })
                    }

                })
            },
            submitComment() {  //增加评论
                if(this.$store.state.userid){
                    let temp = {}
                    temp.content = this.mycomment
                    temp.articleid = this.$route.query.articleid
                    temp.userid = this.$store.state.userid
                    this.$store.dispatch('submitComment', temp).then(res => {
                        this.$message({
                            type: 'success',
                            message: '添加成功',
                            customClass:'zZindex'
                        })
                        this.mycomment = ""
                        this.getPageC()
                    })
                }else {
                    this.$message({
                        showClose: true,
                        message: '请先登陆'
                    });
                }
            },
            handleScroll() {
                let scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
                var marktable = document.querySelector('.marktable')
                var elMain = document.querySelector('.el-main')
                if(document.documentElement.clientHeight < elMain.getBoundingClientRect().bottom - 70){
                    marktable.style.position = 'absolute'
                    marktable.style.left = 0
                    marktable.style.top = document.documentElement.clientHeight - 140 + scrollTop + 'px'
                }else{
                    marktable.style.position = 'static'
                }
            },
            markArticle(articleid) {  //收藏文章
                if (this.$store.state.userid) {
                    this.$store.dispatch('markArticle', articleid).then(res => {
                        // console.log('mark', res)
                        this.$message({
                            type: 'success',
                            message: '收藏成功'
                        })
                    })
                    addArticleEnshrineNums(articleid).then(result=>{
                        // console.log('收藏加1')
                    })
                    this.ismark = true
                } else {
                    this.$message({
                        type: 'warn',
                        message: '请先登陆',
                        customClass:'zZindex'
                    })
                }
            },
            cancelMarkArticle(articleid) {  //取消收藏文章
                if (this.$store.state.userid) {
                    this.$store.dispatch('cancelMarkArticle', articleid).then(res => {
                        // console.log('cancelMark', res)
                        this.$message({
                            type: 'success',
                            message: '取消成功'
                        })
                    })
                    this.ismark = false
                    cancelArticleEnshrineNums(articleid).then(result=>{
                        // console.log('取消收藏减1')
                    })
                } else {
                    this.$message({
                        type: 'warn',
                        message: '请先登陆',
                        customClass:'zZindex'
                    })
                }
            },
            zanArticle(articleid) {  //点赞文章
                if (this.$store.state.userid) {
                    this.iszan = true
                    addArticleGives(articleid,this.$store.state.userid).then(result=>{
                        this.$message({
                            type: 'success',
                            message: '成功点赞'
                        })
                    })
                } else {
                    this.$message({
                        type: 'warn',
                        message: '请先登陆',
                        customClass:'zZindex'
                    })
                }
            },
            cancelZanArticle(articleid) {  //取消点赞文章
                if (this.$store.state.userid) {
                    this.iszan = false
                    cancelArticleGives(articleid,this.$store.state.userid).then(result=>{
                            this.$message({
                                type: 'success',
                                message: '取消点赞成功'
                            })
                    })
                } else {
                    this.$message({
                        type: 'warn',
                        message: '请先登陆',
                        customClass:'zZindex'
                    })
                }
            },
            getVcard(id){  //获取个人头像
                return this.someInfo.get(id).userpicture
            },
            getName(id){  //获取个人的用户名
                return this.someInfo.get(id).username
            },
            reply(index){  //跟回复框的显示和删除有关
                this.replyindex = -1
                this.replyindex2 = -1
                this.replyindex = index
            },
            reply2(index){ //跟回复框的显示和删除有关
                this.replyindex = -1
                this.replyindex2 = -1
              this.replyindex2 = index
                // console.log(this.replyindex2)
            },
            cancelReply(){  //跟回复框的显示和删除有关
                this.replyindex = -1
                this.replyindex2 = -1
            }
        }
    }
</script>

<style scoped>
    @import "~assets/font/iconfont.css";
    .md{
        margin-left: -20px;
        margin-right: -20px;
        margin-bottom: 50px;
    }

    .v-note-panel{
        border: none !important;
    }

    /deep/ .v-show-content{
        background-color: white !important;
    }

    .v-note-wrapper{
        border: none !important;
    }

    .replyname{
        margin: 0 2px 0 5px;
        font-size: 12px;
        vertical-align: top;
        cursor: pointer;
    }
    .nickname{
        cursor: pointer;
    }
    .comment-body .nickname:hover{
        color: #42b983;
    }
    .replyname:hover{
        color: #42b983;
    }
    .replycomment-time{
        margin-left: 8px;
        font-size: 12px;
        color: #6b6b6b;
        vertical-align: top;
    }
    .replyContent{
        font-size: 14px;
        margin-left: 0;
        vertical-align: top;
        color: black;
    }
    .replySpan{
        font-size: 12px;
        margin-left: 8px;
        margin-right: 6px;
        vertical-align: top;
    }
    .replyDiv{
        position: relative;
        /*margin-top: 5px;*/
        padding-left: 10px;
        margin-left: 48px;
        padding-top: 10px;
        padding-bottom: 10px;
        width: calc(100% - 58px);
        line-height: 22px;
        border-left: 2px solid gray;
    }
    .replyAvatar{
        border-radius: 50%;
    }
    .sub{
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translate(0,-50%);
    }
    .replyButton{
        position: relative;
        height: 70px;
        width: 80%;
        /*line-height: 70px;*/
    }
    .reply{
        position: relative;
        margin-left: 55px;
    }
    .comment-inner{
        position: relative;
    }
    .reply{
        margin-top: 10px;
    }
    .replyArea{
        /*float: right;*/
        width: 80%;
    }
    .comment-text{
        position: relative;
        font-size: 14px;
        line-height: 1.6;
        color: #333;
        width: calc(100% - 50px);
    }
    .vcard{
        float: left;
    }
    .vcard img{
        width: 50px;
        height: 50px;
        border-radius: 50%;
    }
    .comment-body{
        text-indent: 10px;
    }
    .comment-body span{
        display: inline-block;
        margin-top: 4px;
        font-size: 12px;
        line-height: 16px;
        font-weight: 400;
        color: #999;
    }
    .comment-body .nickname{
        font-size: 14px;
        font-weight: 500;
        line-height: 20px;
        color: #333;
    }
    .eachcomment {
        width: 100%;
        height: auto;
        padding: 10px 0 10px 0;
        min-height: 80px;
        /*background: #42b983;*/
        border-bottom: 1px solid #cccccc;
        margin-top: 10px;
    }
    .el-icon-chat-line-round{
        font-size: 15px;
        position: relative;
        left: 3px;
        bottom: 1px;
        cursor: pointer;
    }

    .commentArea .title {
        margin-top: 30px;
    }

    .submitComment {
        position: relative;
    }

    .submit {
        position: absolute;
        right: 10px;
        margin-top: 10px;
        bottom: -50px;
    }

    .comment {
        position: relative;
        /*height: 500px;*/
        width: 72%;
        left: 28%;
        padding: 20px;
        margin-top: 50px;
    }

    .comment .title {
        border-left: 3px solid blue;
        text-indent: 10px;
        font-weight: bold;
    }

    .comment .area {
        margin-top: 20px;
        width: 100%;
    }

    .foot {
        position: relative;
        width: 85%;
        height: auto;
        margin-top: 30px;
        margin: 0 auto;
    }

    #staron {
        color: orange;
    }

    .marktable div {
        display: inline-block;
        margin-left: 20px;
    }


    .marktable .icon-dianzan1-copy{
        font-size: 25px;
        color: red;
    }

    .time i {
        color: gray;
    }

    .decoreation {
        width: 5px;
        height: 140px;
        background: rgb(77, 77, 77);
        position: absolute;
        left: 0;
        top: 0;
    }

    .marktable span {
        display: inline-block;
        transform: translate(1px, -4px);
        font-size: 12px;
        font-weight: 100;
        color: black;
    }

    .marktable i {
        color: gray;
        font-size: 25px;
        margin-left: 5px;
        cursor: pointer;
    }

    .marktable i:nth-child(3) {
        margin-left: 20px;
    }

    .marktable {
        position: absolute;
        width: 100%;
        background: #c8e6c6;
        border-left: 2px solid silver;
        line-height: 50px;
        box-sizing: border-box;
        bottom: 0;
        left: 0;
        height: 50px;
        z-index: 9999;
    }

    .tag {
        display: inline-block;
        height: 20px;
        line-height: 20px;
        font-size: 10px;
        text-align: center;
        background: #42b983;
        margin-left: 10px;
        color: white;
    }


    .tagtype {
        padding: 2px 3px 2px 3px;
    }

    .tags {
        margin-top: 20px;
        color: #ccc;
        font-size: 14px;
    }

    .time {
        margin-top: 20px;
        color: #ccc;
        font-size: 14px;
    }

    .content {
        margin-top: 30px;
        font-size: 25px;
        font-weight: 500;
        color: gray;
        margin-bottom: 10px;
    }

    ::v-deep .content img{
        width:100%;
    }
    .el-main h1 {
        font-weight: 900;
        font-size: 28px;
    }

    .el-main {
        width: 72%;
        margin-left: 50px;
        position: relative;
        /*left: 40px;*/
        /*right: 0;*/
        background: white;
        overflow: hidden;
    }

    .el-aside h2 {
        margin-top: 20px;
    }

    .el-aside img {
        width: 120px;
        height: 120px;
        border-radius: 50%;
    }

    .el-aside {
        background: white;
        padding: 20px 0 0 0;
        text-align: center;
        height: 350px;
    }

    .main {
        background: rgb(240, 240, 240);
        height: auto;
        min-height: 100vh;
    }

    .el-container {
        position: relative;
        width: 85%;
        margin: 0 auto;
        height: auto;
        top: 30px;
    }

    .main{
        padding-top: 60px;
        padding-bottom: 100px;
    }

    .zZindex {
        z-index:3000 !important;
    }

    body{
        max-width: 100vw;
        overflow: hidden;
    }

    @media all and (max-width: 768px) {
        .el-container,.el-main{
            margin: 0;
        }
        .el-container{
            width: calc(100%);
            top: 0;
        }
        .el-main{
            width:100%;
        }
        .maincontent{
            overflow: hidden;
        }
        .comment{
            padding-right: 0;
        }
        .sub{
            display: flex;
        }
        #marktable {
           position: static !important;
        }
    }
</style>
