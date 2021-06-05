import {debounce, parseTime} from "../../utils";
import {postSearchArticle, postSearchContent} from "../../axios/user";

export default {
    name: "search",
    data() {
        return {
            searchContent: null,
            Allarticles: {
                comprehensively:[],
                latest:[],
                hot:[]
            },
            loading: false,
            label:"综合排序",
            searchList:[],
            labelss:[{value:'comprehensively',title:'综合排序'},{value:'latest',title:'最新优先'},{value:'hot',title:'热门优先'}]
        }
    },
    created() {
        this.fn = debounce(this.getSearchContent,500)  //定义输入框加入防抖函数
    },
    mounted() {
        this.searchContent = this.$route.query.content
        this.getSearchArts()
    },
    methods: {
        getSearchArts(refresh,more){  //获取跟查询内容有关的所有文章

            var temptitle = ''
            this.labelss.forEach(item=>{
                if(this.label == item.title)
                    temptitle = item.value
            })
            if(refresh){
                // console.log('重新')
                this.Allarticles = Object.assign({},{
                    comprehensively:[],
                    latest:[],
                    hot:[]
                })
            }
            if(this.Allarticles[temptitle].length == 0 || more=='more'){
                postSearchArticle({content: this.searchContent,offset:this.Allarticles[temptitle].length,temptitle:temptitle}).then(result => {
                    let temp = result.data.data
                    if(temp){
                        temp.forEach(item=>{
                            this.Allarticles[temptitle].push(item)
                        })
                    }else {
                        this.$message({
                            type:'warning',
                            message:'没有搜到任何内容'
                        })
                    }
                })
            }
        },
        toArticle(index) {
            var temptitle = ''
            if(this.label == '综合排序'){
                temptitle = 'comprehensively'
            }else if(this.label == '最新优先'){
                temptitle = 'latest'
            }else {
                temptitle = 'hot'
            }
            // console.log(temptitle)
            console.log(this.Allarticles[temptitle][index])
            var temp = this.$router.resolve({
                path: 'article',
                query: {
                    articleid: this.Allarticles[temptitle][index].articleid
                }
            })
            window.open(temp.href,'_blank')
        },
        toArticles(articleid){
            var temp = this.$router.resolve({
                path: 'article',
                query: {
                    articleid: articleid
                }
            })
            window.open(temp.href,'_blank')
        },
        getmore(){
            this.getSearchArts(false,'more')
        },
        handleClick(tab){
            this.label = tab.label
            this.getSearchArts()
        },
        getSearchContent(){
            postSearchContent({content:this.searchContent}).then(result=>{
                var searchresult = document.querySelector('.searchresult')
                let res = result.data
                if(res.data){
                    this.searchList = res.data
                    searchresult.style.display = 'block'
                }
            })
        },
        searchArticle(refresh){
            this.getSearchArts(refresh)
        }
    },
    filters: {
        parseT(value) {  //时间戳格式化
            return parseTime(value, '{y}-{m}-{d} {h}:{i}')
        }
    }
}