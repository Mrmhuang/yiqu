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
        <el-footer></el-footer>
    </div>
</template>

<script>
    import {postArticleImg} from "../axios/user";
    import {getClassify} from "../axios/user";
    import { mavonEditor } from 'mavon-editor'
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
                // editorOption: {},
                classN: '',
                classifys: [],
                img_file: {}
            }
        },
        components: {
            // quillEditor
            mavonEditor
        },
        methods: {
            // 绑定@imgAdd event
            $imgAdd(pos, $file){
                // 缓存图片信息
                this.img_file[pos] = $file;
            },
            $imgDel(pos){
                delete this.img_file[pos];
            },
            addTags(e) {
                console.log(e)
            },
            removeitem(index, item) {
                // console.log(index)
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
            async publish() {  //发布文章
                if(this.form.title!=='' && this.form.text!=='' && this.form.articleabstract!=='' && this.classN!==''){
                    await this.uploadimg()
                    let tags = this.labelarr.join(',')
                    let article = Object.assign({}, this.form)
                    article.tags = tags
                    article.id = this.$store.state.userid
                    article.classN = this.classN
                    // console.log(this.form.text)
                    this.$store.dispatch('publishA', article).then(result => {
                        // console.log(this)
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
                }else{
                    this.$message({
                        type:'warning',
                        message:'标题、摘要、分类和文章内容都不能为空'
                    })
                }
            },
            //富文本编辑器图片上传
            uploadimg($e){
                // 第一步.将图片上传到服务器.
                if(this.img_file!=={}){
                    var formdata = new FormData();
                    for(var _img in this.img_file){
                        formdata.append("imgs", this.img_file[_img]);
                    }
                    // console.log(this.img_file)
                    return postArticleImg(formdata).then((res) => {
                        if(res.data.code==-3){
                            this.$message({
                                type:'error',
                                message:'每张图片不得大于1M'
                            })
                            return Promise.reject('出错了')
                        }
                        console.log(res)
                        if(res.data.code==-1){
                            this.$message({
                                type:'error',
                                message:'暂不支持jepg格式的图片'
                            })
                            return Promise.reject('出错了')
                        }
                        var imgInfo = res.data.msg
                        // console.log(imgInfo)
                        for(var i=0;i<imgInfo.length;i++){
                            this.$refs.md.$img2Url(imgInfo[i].pos, imgInfo[i].url.replace(/\\/g,'\/'))
                        }
                    })
                }
            }
        },
        watch: {
            labelarr(newvalue) {
                // console.log(newvalue)
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

    .v-note-wrapper{
        min-height: 500px;
    }

    /*自定义标签开始*/
    .el-form{
        height: auto;
    }
    .el-main{
        position: relative;
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

    @media all and (max-width: 768px){
        .el-container{
            position: relative;
            margin:0;
            width: 100%;
            height: 100%;
        }
        .el-main{
            width: 100%;
            height: 100%;
        }
        .yidong-publish{
            position: absolute;
            bottom: 20px;
            right: 20px;
        }
    }
</style>
