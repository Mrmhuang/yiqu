<template>
    <div class="main">
        <el-container>
            <el-button type="primary" class="yidong-publish hidden-sm-and-up" @click.native.prevent="publish">提交发布</el-button>
            <el-main>
                <el-form ref="form" :model="form" inline-message>
                    <el-form-item label="标题" label-width="50px">
                        <el-input v-model="form.title" placeholder="在此输入标题" class="title" maxlength="30"></el-input>
                    </el-form-item>
                    <el-form-item label="摘要" label-width="50px">
                        <el-input v-model="form.articleabstract" placeholder="在此输入标题" class="title" maxlength="30"></el-input>
                    </el-form-item>
                    <el-form-item class="hidden-sm-and-up" label="分类" label-width="50px">
                        <el-select v-model="classN" placeholder="请选择分类">
                            <el-option
                                    v-for="item in classifys"
                                    :key="item.classifyname"
                                    :label="item.classifyname"
                                    :value="item.classifyname">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="正文" label-width="50px" class="articlecontent">
                        <mavonEditor
                                :subfield="false"
                                :autofocus="false"
                                v-model="form.text"
                                ref="md"
                                style="width: 99%;"
                                placeholder="开始编辑~"
                                @imgAdd="$imgAdd" @imgDel="$imgDel"
                        />
                    </el-form-item>
                </el-form>
            </el-main>
            <el-aside width="20%" class="hidden-xs-only">
                <el-button type="primary" class="pub" @click.native="publish">提交发布</el-button>

                <div class="fenlei">
                    <el-select v-model="classN" placeholder="请选择分类">
                        <el-option
                                v-for="item in classifys"
                                :key="item.classifyname"
                                :label="item.classifyname"
                                :value="item.classifyname">
                        </el-option>
                    </el-select>
                </div>

                <p class="selftags">已自定义标签</p>
                <div class="tags">
                    <div v-for="(item,index) in labelarr" :key="index" class="spanbox">
                        <span class="tag">{{item}}</span>
                        <i class="el-icon-close" @click="removeitem(index,item)"></i>
                    </div>
                </div>
                <p class="add">添加标签</p>
                <!-- 自定义标签 -->
                <div class="inputbox">
                    <div class="arrbox">
                        <el-input
                                placeholder="输入后回车生成标签"
                                v-model="currentval"
                                @keyup.enter.native="addlabel"
                                type="text"

                        ></el-input>
                    </div>
                </div>
            </el-aside>
        </el-container>
    </div>
</template>

<script>
    import publishjs from "./publishjs";
    export default publishjs
</script>

<style lang="less" scoped>
    @import "publicless";
</style>
