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
    import searchPagejs from "./searchPagejs";
    export default searchPagejs
</script>

<style lang="less" scoped>
    @import "searchPageless";
</style>
