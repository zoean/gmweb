<template>
    <div>
        <div class="login-bg"></div>
        <div class="login-contain">
            <el-image style="width: 2.4rem; height: .42rem; position: absolute; top: 1.2rem; left: .7rem;" :src="require('../../assets/images/logo_Name_A.png')" fit="fit"></el-image>
            <div class="contain-model">

                <div class="contain-title">欢迎登录</div>

                <el-input class="user" v-model="accountNumber" size="medium" placeholder="请输入账号" prefix-icon="el-icon-user"></el-input>
                <el-input class="lock" v-model="password" size="medium" placeholder="请输入密码" show-password prefix-icon="el-icon-lock"></el-input>
                <el-button type="primary" class="login-btn" size="medium" @click="login" v-loading.fullscreen.lock="fullscreenLoading">登录</el-button>

            </div>
        </div>
    </div>
</template>

<script>
import { login, getUserLoginMessage } from '../../request/api';
export default {
    data() {
        return {
            accountNumber: '',
            password: '',
            fullscreenLoading: false
        }
    },
    created() {
        this.keyupSubmit()
    },
    methods: {
        keyupSubmit(){
            document.onkeydown=e=>{
                let _key=window.event.keyCode;
                if(_key===13){
                    this.login();
                }
            }
        },
        login() {
            if( !this.accountNumber || !this.password){
                this.$message({
                    type: 'error',
                    message: '亲，账号密码不能为空哦！'
                })
            }else{
                this.fullscreenLoading = true;
                this.$smoke_post(login, {
                    accountNumber: this.accountNumber,
                    password: this.password
                }).then(res => {
                    // console.log(res);
                    if(res.code == 200){
                        this.$store.dispatch('actionsSetCommonFlag', true);                        
                        localStorage.setItem("jhToken", res.data.token);
                        this.getUserLoginMessage();
                        setTimeout(() => {
                            this.fullscreenLoading = false;
                            this.$router.push({ path: '/'});
                        }, 1000);

                        

                    }else{
                        setTimeout(() => {
                            this.fullscreenLoading = false;
                            this.$message({
                                type: 'error',
                                message: res.msg
                            })
                        }, 1000);
                    }
                })
            }
        },
        // 将用户菜单缓存到本地
        getUserLoginMessage() {
            this.$smoke_post(getUserLoginMessage,{}).then(res => {
                // console.log(JSON.stringify(res.data.userMenuList));
                if(res.code == 200) {
                    localStorage.setItem("userMenuList", JSON.stringify(res.data.userMenuList));
                    localStorage.setItem("buttonMap", JSON.stringify(res.data.buttonMap));
                    localStorage.setItem("userUuid", res.data.uuid);
                    this.$store.commit('setUserRole', res.data.roleName)
                    this.$store.commit('setUserDepartment', res.data.orgName)
                }
            })
        },
    },
    mounted() {
        
    }
}
</script>

<style scoped lang="less">

// @media screen and (max-width: 1200px) {
//     .login-contain{
//         width: 10rem !important;
//         height: 10rem !important;
//         left: 50% !important;
//         top: 35% !important;
//         margin-left: -5rem;
//         .login-text{
//             font-size: 1rem !important;
//             margin-bottom: 1.5rem !important;
//         }
//     }
// }

.login-bg{
    position:fixed;
    top: 0;
    left: 0;
    width:100%;
    height:100%;
    min-width: 1000px;
    z-index:-10;
    zoom: 1;
    background-color: #fff;
    background-repeat: no-repeat;
    background-size: cover;
    -webkit-background-size: cover;
    -o-background-size: cover;
    background-position: center 0;
    background: url("../../assets/images/login_bg.png") no-repeat center;
}
.login-contain{
    background: url("../../assets/images/login_contain.png") no-repeat center;
    background-repeat: no-repeat;
    background-size: cover;
    -webkit-background-size: cover;
    -o-background-size: cover;
    background-position: center 0;
    border-radius: 10px;
    position: absolute;
    width: 10rem;
    height: 6.4rem;
    z-index: 999;
    margin-left: -5rem;
    left: 50%;
    top: 50%;
    margin-top: 1.3rem;
    .contain-model{
        width: 2.6rem;
        height: 2.6rem;
        position: absolute;
        top: 2.4rem;
        left: 1.4rem;
        .contain-title{
            font-size: .24rem;
            color: #409EFF;
        }
        .login-btn{
            width: 100%;
            letter-spacing: .2rem;
            padding-left: .4rem;
            margin-top: .14rem;
            // position: absolute;
            // bottom: 0;
            // left: 0;
        }
        .el-input{
            font-size: 13px;
        }
        .user{
            margin-top: .5rem;
        }
        .lock{
            margin-top: .14rem;
        }
    }
}
</style>