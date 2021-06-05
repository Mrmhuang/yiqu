import {getAllClass, getAllUser, getHotRead, getSomeArticle} from "@/axios/user";
import {parseTime} from "@/utils";

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
            loading: false, //加载更多的时候要用到
            hotread: []
        }
    },
    async mounted() {
        window.addEventListener('scroll', this.handleScroll, true)  //添加滚动事件
        getAllUser().then(result => { //获取三个人的所有信息
            this.persons = result.data.msg
        })
        getHotRead().then((result) => {
            console.log(result)
            this.hotread = result.data.msg
            console.log(this.hotread)
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
        handleScroll(e) {
            var scroll = document.querySelector('.scroll')
            var author = document.querySelector('.author')
            console.log(author)
            var bouding = author.getBoundingClientRect()
            if (bouding.bottom < 70) {
                scroll.style.position = 'fixed'
                scroll.style.top = 70 + 'px'
            } else {
                scroll.style.position = 'static'
            }

        },
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
        },
        myblob() {
            window.location.href = 'https://mrmhuang.github.io/';
        }
    },
    filters: {
        parseT(value) { //时间戳格式化
            return parseTime(value, '{y}-{m}-{d} {h}:{i}')
        }
    }
}