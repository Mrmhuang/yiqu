<template>
    <div class="main">
        <el-container>
            <el-main>
                <el-form ref="form" :model="form" inline-message>
                    <el-form-item label="标题" label-width="50px">
                        <el-input v-model="form.title" placeholder="在此输入标题" class="title"></el-input>
                    </el-form-item>
                    <el-form-item label="摘要" label-width="50px">
                        <el-input v-model="form.articleabstract" placeholder="在此输入标题" class="title"></el-input>
                    </el-form-item>
                    <el-form-item label="正文" label-width="50px">
                        <quill-editor v-model="form.text" ref="myQuillEditor" style="height: 500px;"
                                      :options="editorOption">
                        </quill-editor>
                    </el-form-item>
                </el-form>
            </el-main>
            <el-aside width="35%">
                <el-button type="primary" class="pub" @click="publish">提交发布</el-button>

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
        <el-footer></el-footer>
    </div>
</template>

<script>
    import {
        quillEditor
    } from 'vue-quill-editor'
    import 'quill/dist/quill.core.css'
    import 'quill/dist/quill.snow.css'
    import 'quill/dist/quill.bubble.css'
    import {getClassify} from "../axios/user";

    export default {
        name: "publish",
        data() {
            return {
                form: {
                    title: '',
                    text: '',
                    tags: '',
                    articleabstract:''
                },
                currentval: '',  //临时储存标签信息
                labelarr: [],  //储存所有标签
                editorOption: {},
                classN: '',
                classifys: []
            }
        },
        components: {
            quillEditor
        },
        methods: {
            addTags(e) {
                console.log(e)
            },
            removeitem(index, item) {
                console.log(index)
                this.labelarr.splice(index, 1)
            },
            addlabel() {   // input回车加入labelarr中
                let count = this.labelarr.indexOf(this.currentval)  //判断有无重复标签
                if (count === -1) {
                    this.labelarr.push(this.currentval)
                } else {
                    this.$message({
                        type: 'warning',
                        message: '请勿添加相同的标签',
                        customClass:'zZindex'
                    })
                }
                this.currentval = ''
            },
            publish() {
                let tags = this.labelarr.join(',')
                let article = Object.assign({}, this.form)
                article.tags = tags
                article.id = this.$store.state.userid
                article.classN = this.classN
                console.log(this.form.text)
                this.$store.dispatch('publishA', article).then(result => {
                    console.log(this)
                    this.$message({
                        type: 'success',
                        message: '发布成功'
                    })
                    this.$router.push({
                        path: '/personal',
                        query: {
                            id: this.$store.state.userid
                        }
                    })
                })
            },

        },
        watch: {
            labelarr(newvalue) {
                console.log(newvalue)
            }
        },
        mounted() {
            getClassify().then(res => {
                this.classifys = res.data.data
            })
        }
    }
</script>

<style scoped>
    /*自定义标签开始*/
    .el-form{
        height: auto;
    }
    .el-main{
        height: auto;
    }
    .fenlei {
        margin-top: 20px;
    }

    .add {
        margin-top: 20px;
    }

    .selftags {
        margin-top: 20px;
    }

    .tags {
        width: 100%;
        height: 100px;
        border: 1px solid rgb(220, 220, 220);
        padding: 10px 0 10px 0;
    }

    .spanbox {
        display: inline-block;
        background: rgb(26, 188, 156);
        width: auto;
        height: 30px;
        border-radius: 30px;
        margin-left: 10px;
        text-align: center;
        line-height: 30px;
        padding: 0 10px 0 10px;
        color: white;
    }

    /*自定义标签结束*/
    .el-footer {
        height: 100px;
        background: rgb(45, 50, 54);
    }

    .main {
        background: rgb(245, 245, 243);
        height: auto;
    }

    .pub {
        width: 100%;
    }

    .area {
        min-height: 200px;
    }

    .el-form {

    }

    .el-aside {
        padding: 40px 20px 0 20px;
    }

    .el-container {
        height: auto;
        min-height: 800px;
        width: 78%;
        margin: 0 auto;
        background: white;
        transform: translate(0, 50px);
    }

    .el-footer {
        margin-top: 80px;
    }

    .main {
        padding-top: 60px;
    }

    .zZindex {
        z-index:3000 !important;
    }
</style>
