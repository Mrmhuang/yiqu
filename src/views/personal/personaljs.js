import {deleteArt, getMarkArticleN, getPArticleNums} from "@/axios/user";
import {parseTime} from "@/utils";

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
            var temp = this.$router.resolve({
                path: 'article',
                query: {
                    articleid: parseInt(this.article[index].articleid)
                }
            })
            window.open(temp.href, "_blank")
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