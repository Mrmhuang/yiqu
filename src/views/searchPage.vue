<template>
    <el-container>
        <div class="search">
            <el-row>
                <el-col :xs="24" :sm="18" :md="18" :lg="18" :xl="18" class="search-left">
                    <el-input v-model="searchContent" class="search-input" size="medium" clearable @keydown.native="fn" @focus="fn">
                        <el-button slot="append" icon="el-icon-search" @click.native="searchArticle(true)"></el-button>
                    </el-input>
                    <div class="searchresult">
                        <ul>
                            <li v-for="item in this.searchList" @click="toArticles(item.articleid)">
                                {{item.articletitle}}
                            </li>
                        </ul>
                    </div>
                </el-col>
                <el-col :sm="6" :md="6" :lg="6" :xl="6" class="hidden-sm-and-down">
                </el-col>
            </el-row>
        </div>
        <div class="content">
            <el-tabs type="border-card" class="border-card" @tab-click="handleClick">
                <el-tab-pane v-for="item2 in this.labelss" :label="item2.title">
                    <div v-for="(item,index) in Allarticles[item2.value]" class="allAritcles"
                         @click="toArticle(index)">
                        <span class="articleClass" v-if="item.articleClass">{{item.articleClass}}</span>
                        <p class="title">{{item.articletitle}}</p>
                        <p class="someContent" v-html="item.articleabstract"></p>
                        <p class="time">
                            <i class="iconfont icon-dianzan">&nbsp;&nbsp;{{item.articlegives}}</i>
                            <i class="el-icon-view">&nbsp;&nbsp;{{item.articleface}}</i>
                            <span>{{item.releasetime | parseT}}</span>
                        </p>
                    </div>
                    <div class="moreDiv" v-show="Allarticles[item2.value].length!==0">
                        <a href="#" class="more" v-loading="loading" @click.prevent="getmore">点击查看更多</a>
                    </div>
                    <div class="moreDiv" v-show="Allarticles[item2.value].length==0">
                        <span class="none">
                            没有找到任何内容
                        </span>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </el-container>
</template>

<script>
    import {postSearchArticle, postSearchContent} from "../axios/user";
    import {debounce, parseTime} from "../utils";

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
</script>

<style lang="less" scoped>
    @import "~assets/font/iconfont.css";
    .el-container {
        display: block;
        height: auto;
        min-height: calc(100vh - 60px);
        background-color: rgb(245, 245, 245);
        padding-top: 70px;

        .search {
            line-height: 50px;
            height: 50px;
            width: 85%;
            margin: 0 auto;
            .searchresult{
                display: none;
                border-radius: 5px;
                position: absolute;
                z-index: 1999;
                background-color: white;
                box-shadow: 0 0 0 3px rgb(240,240,240);
                top: 48px;
                width: 75%;
                padding: 10px 0;
            }

            .searchresult ul{
                height: auto;
            }

            .searchresult ul li{
                width: auto;
                height: 50px;
                line-height: 50px;
                font-size: 15px;
                overflow:hidden;
                text-overflow:ellipsis;
                white-space:nowrap;
                cursor: pointer;
                padding: 0 10px 0;
            }

            .searchresult ul li:hover{
                background-color: #42b983;
            }
        }

        .content {
            width: 85%;
            margin: 0 auto;

            .border-card {
                margin-top: 10px;
                /*width: 80%;*/
            }
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

            .time span {
                position: absolute;
                right: 0;
            }

            .title {
                cursor: pointer;
                font-size: 21px;
                font-weight: 500;
                color: black;
                font-family: inherit;
                color: rgb(54, 57, 59);
            }

            .title:hover {
                color: blue;
            }

            i {
                cursor: pointer;
                color: #999;
            }

            .time i:nth-child(2) {
                margin-left: 30px;
            }

            .time i:nth-child(1),.time i:nth-child(2) {
                font-size: 18px;
                font-weight: 500;
            }

            .time {
                position: relative;
                color: #999;
                top: 10px;
            }
        }

        .allAritcles:hover {
            background: rgb(230, 235, 245);
        }

        .moreDiv {
            border-bottom: 1px solid rgb(245, 245, 245);
            border-left: 1px solid rgb(245, 245, 245);
            border-right: 1px solid rgb(245, 245, 245);
            display: flex;
            background: white;
            height: 100px;

            a {
                position: relative;
                display: block;
                margin: 0 auto;
                top: 50%;
                transform: translate(0, -50%);
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

            .more:hover {
                background: blue;
                color: white
            }

            .none{
                display: block;
                font-size: 20px;
                color: #6b6b6b;
                text-align: center;
            }
        }
    }

</style>

<!--<style>-->
<!--    .el-message,-->
<!--    .el-message&#45;&#45;warning{-->
<!--        font-size: 50px;-->
<!--    }-->
<!--</style>-->
