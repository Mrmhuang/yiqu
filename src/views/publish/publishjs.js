import {mavonEditor} from "mavon-editor";
import {getClassify, postArticleImg} from "../../axios/user";

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