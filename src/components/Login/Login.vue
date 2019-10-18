<template>
    <div class="login-bg">
        <div class="login-contain">
            <div class="login-text">京华大地--综合后台</div>
            <el-input v-model="accountNumber" placeholder="请输入账号"></el-input>
            <el-input v-model="password" placeholder="请输入密码" show-password></el-input>
            <el-alert
                v-if="alertFlag"
                :title="alertTitle"
                type="error"
                show-icon
                @close='alertClose'
                >
            </el-alert>
            <el-button type="primary" :class="alertFlag?'login-btn-css login-btn':'login-btn'" @click="login" v-loading.fullscreen.lock="fullscreenLoading">登录</el-button>
        </div>
    </div>
</template>

<script>
import { login } from '../../request/api';
export default {
    data() {
        return {
            accountNumber: '',
            password: '',
            alertTitle: '',
            alertFlag: false,
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
                this.alertFlag = true;
                this.alertTitle = '亲，账号密码不能为空哦！'
            }else{
                this.$smoke_post(login, {
                    accountNumber: this.accountNumber,
                    password: this.password
                }).then(res => {
                    // console.log(res);
                    if(res.code == 200){
                        this.fullscreenLoading = true;
                        this.$store.dispatch('actionsSetCommonFlag', true);                        
                        localStorage.setItem("jhToken", res.data.token);
                        setTimeout(() => {
                            this.fullscreenLoading = false;
                            this.$router.push({ path: '/base/people'});
                        }, 1000);
                    }else{
                        this.alertFlag = true;
                        this.alertTitle = res.msg;
                    }
                })
            }
        },
        alertClose() {
            this.alertFlag = false;
        }
    },
    mounted() {
        
    }
}
</script>

<style scoped lang="less">

@media screen and (max-width: 1200px) {
    .login-contain{
        width: 14rem !important;
        height: 14rem !important;
        left: 15% !important;
        top: 35% !important;
        padding: 1rem !important;
        .login-text{
            font-size: 1rem !important;
            margin-bottom: 1.5rem !important;
        }
    }
}

.login-bg{
    width: 100vw;
    height: 100vh;
    background: url("../../assets/images/login_bg.jpg") no-repeat center;
}
.login-contain{
    width: 5rem;
    height: 5rem;
    background: #fff;
    border-radius: .1rem;
    position: absolute;
    top: 50%;
    margin-top: -2.5rem;
    left: 10%;
    padding: .8rem;
    .login-text{
        font-size: .25rem;
        text-align: center;
        margin-bottom: .3rem;
    }
    .el-input{
        margin-top: .2rem;
    }
    .login-btn{
        width: 100%;
        margin-top: 1rem;
        letter-spacing: .2rem;
        padding-left: .4rem
    }
    .login-btn-css{
        margin-top: .4rem !important;
    }
    .el-alert{
        margin-top: .2rem;
    }
}
</style>