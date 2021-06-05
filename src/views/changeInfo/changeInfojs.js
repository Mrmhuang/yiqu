import {addAdmin, getOnePersonal, pushImg} from "@/axios/user";
import {parseTime} from "@/utils";
import {mapMutations} from "vuex";

export default {
    name: "changeInfo",
    data() {
        return {
            user: {
                username: '',
                useremail: '',
                resigetTime: '',
                describe: '这个人很懒，什么都没有留下~',
                avatar:null
            },
            imageUrl: "",  //头像地址
            action: `http://49.235.46.53:7000/upload/avatar`
        }
    },
    mounted() {
        getOnePersonal(this.$route.query.id).then((result) => {  //获取个人信息
            this.user.avatar = result.data.data[0].userpicture
            this.user.username = result.data.data[0].username
            this.user.useremail = result.data.data[0].useremail
            this.user.describe = result.data.data[0].describe
            this.user.resigetTime = parseTime(result.data.data[0].registertime, '{y}-{m}-{d}')
        }).catch(e => {
            console.log(e)
        })
    },
    methods: {
        ...mapMutations([
            'SET_AVATAR'
        ]),
        saveInfo() {  //保存个人信息
            this.$store.dispatch("saveInfo", this.user).then(result => {
                this.$message({
                    type: 'success',
                    message: '保存成功'
                })
            })
        },
        handleAvatarSuccess(res, file) {  //上传头像
            if(this.$store.state.id!==null){
                this.$store.commit('SET_AVATAR', res.data.path)
                var path = res.data.path.replace(/\\/g,'/');
                pushImg(path,this.$store.state.userid).then(result=>{  //添加头像进数据库
                    this.$message({
                        type: 'success',
                        message: '上传成功'
                    })
                    setTimeout(()=>{
                        location.reload()
                    },200)
                })

            }else{
                this.$message({
                    type: 'warning',
                    message: '请先登陆'
                })
                this.$router.push('/')
            }
        },
        beforeAvatarUpload(file) {  //头像上传前的限制
            const isLt2M = file.size / 1024 / 1024 < 2;
            // console.log(isLt2M)
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isLt2M;
        },
        changeAvatar(index) {  //修改头像
            if (index == 1) {
                this.$refs.xian.style.display = 'none'
            } else {
                this.$refs.xian.style.display = 'block'
            }
        },
        checkadmin(){  //管理员凭证
            this.$prompt('请输入你的管理员凭证', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /^qweiopasdjkl$/,
                inputErrorMessage: '凭证格式不正确'
            }).then(({ value }) => {
                addAdmin(this.$store.state.userid,this.$store.state.user).then(result=>{
                    this.$message({
                        type: 'success',
                        message: '管理员认证成功'
                    });
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消输入'
                });
            });
        }
    }
}