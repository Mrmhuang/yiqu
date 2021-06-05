import {parseTime} from "@/utils";
import {
    iszan,
    ismark,
    getPageComment,
    getSomePerson,
    addReply,
    getOnePersonal,
    addArticleFace,
    addArticleEnshrineNums,
    cancelArticleEnshrineNums,
    addArticleGives,
    cancelArticleGives
} from "@/axios/user";

export default {
    name: "pageArticle",
    created() {
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
            getOnePersonal(this.art.userid).then(userInfo => {  //获取个人信息
                this.username = userInfo.data.data[0].username
                this.userpicture = userInfo.data.data[0].userpicture
                this.describe = userInfo.data.data[0].describe
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
        addArticleFace(this.$route.query.articleid)
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        })
    },
    mounted() {
        setTimeout(()=>{
            this.handleScroll()
        },200)
    },
    data() {
        return {
            art: {},
            tags: null,
            mark: 0,
            articleid: undefined,
            ismark: false,
            mycomment: '',
            comment: [],
            someInfo: null,
            replyindex: -1,
            replyComment: '',
            commonComment: [],
            replyComments: [],
            replyindex2: -2,
            username: null,
            iszan: false,
            userpicture: null,
            describe: null
        }
    },
    filters: {
        parseT(Value) {
            return parseTime(Value, '{y}-{m}-{d} {h}:{i}')
        }
    },
    methods: {
        toPersonal(id) {
            let toPersonal = this.$router.resolve({
                path: '/personal',
                query: {
                    id
                }
            })
            window.open(toPersonal.href, '_blank')
        },
        submitReply(commentid, toUserId) {  //提交回复
            if (this.$store.state.userid) {
                let temp = {}
                temp.articleid = this.$route.query.articleid
                temp.parentcommentid = commentid  //被回复人的评论id
                temp.content = this.replyComment
                temp.userid = this.$store.state.userid
                temp.touserid = toUserId  //被回复人的id
                addReply(temp).then(res => {
                    this.replyindex = -1
                    this.replyindex2 = -1
                    this.$message({
                        type: 'success',
                        message: '回复成功',
                        customClass: 'zZindex'
                    })
                    location.reload()
                })
            } else {
                this.$message({
                    showClose: true,
                    message: '请先登陆'
                });
            }
        },
        getPageC() {  //获取全部评论
            getPageComment(this.$route.query.articleid).then(result => {
                this.comment = result.data.msg   //全部评论
                this.replyComments = this.comment.filter(function (item, index) {
                    return item.parentcommentid != null
                })
                this.commonComment = this.comment.filter(function (item, index) {
                    return item.parentcommentid == null
                })

                for (var j = 0; j < this.commonComment.length; j++) {
                    this.commonComment[j].replyComments = []
                    for (let i = 0; i < this.replyComments.length; i++) {  //如何优化
                        if (this.replyComments[i].parentcommentid == this.commonComment[j].commentid) {
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
                    })
                }

            })
        },
        submitComment() {  //增加评论
            if (this.$store.state.userid) {
                let temp = {}
                temp.content = this.mycomment
                temp.articleid = this.$route.query.articleid
                temp.userid = this.$store.state.userid
                this.$store.dispatch('submitComment', temp).then(res => {
                    this.$message({
                        type: 'success',
                        message: '添加成功',
                        customClass: 'zZindex'
                    })
                    this.mycomment = ""
                    this.getPageC()
                })
            } else {
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
            if (document.documentElement.clientHeight < (elMain.getBoundingClientRect().bottom)) {
                marktable.style.position = 'absolute'
                marktable.style.top = document.documentElement.clientHeight - 140 + scrollTop + 'px'
            } else {
                marktable.style.position = 'absolute'
                marktable.style.top = elMain.clientHeight - 50 + 'px'
            }
        },
        markArticle(articleid) {  //收藏文章
            if (this.$store.state.userid) {
                this.$store.dispatch('markArticle', articleid).then(res => {
                    this.$message({
                        type: 'success',
                        message: '收藏成功'
                    })
                })
                addArticleEnshrineNums(articleid).then(result => {
                })
                this.ismark = true
            } else {
                this.$message({
                    type: 'warn',
                    message: '请先登陆',
                    customClass: 'zZindex'
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
                cancelArticleEnshrineNums(articleid).then(result => {
                    // console.log('取消收藏减1')
                })
            } else {
                this.$message({
                    type: 'warn',
                    message: '请先登陆',
                    customClass: 'zZindex'
                })
            }
        },
        zanArticle(articleid) {  //点赞文章
            if (this.$store.state.userid) {
                this.iszan = true
                addArticleGives(articleid, this.$store.state.userid).then(result => {
                    this.$message({
                        type: 'success',
                        message: '成功点赞'
                    })
                })
            } else {
                this.$message({
                    type: 'warn',
                    message: '请先登陆',
                    customClass: 'zZindex'
                })
            }
        },
        cancelZanArticle(articleid) {  //取消点赞文章
            if (this.$store.state.userid) {
                this.iszan = false
                cancelArticleGives(articleid, this.$store.state.userid).then(result => {
                    this.$message({
                        type: 'success',
                        message: '取消点赞成功'
                    })
                })
            } else {
                this.$message({
                    type: 'warn',
                    message: '请先登陆',
                    customClass: 'zZindex'
                })
            }
        },
        getVcard(id) {  //获取个人头像
            return this.someInfo.get(id).userpicture
        },
        getName(id) {  //获取个人的用户名
            return this.someInfo.get(id).username
        },
        reply(index) {  //跟回复框的显示和删除有关
            this.replyindex = -1
            this.replyindex2 = -1
            this.replyindex = index
        },
        reply2(index) { //跟回复框的显示和删除有关
            this.replyindex = -1
            this.replyindex2 = -1
            this.replyindex2 = index
            // console.log(this.replyindex2)
        },
        cancelReply() {  //跟回复框的显示和删除有关
            this.replyindex = -1
            this.replyindex2 = -1
        },
        addCom() {
            var submitComment = document.querySelector('.foot')
            // console.log(submitComment)
            // console.log(submitComment.offsetTop)
            window.scrollTo({
                top: submitComment.offsetTop,
                behavior: "smooth"
            })
        }
    }
}