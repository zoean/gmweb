<template>
    <el-header class="">

        <el-dialog
            title="设置密码"
            :visible.sync="centerDialogVisible"
            width="30%"
            center>
            <div style="height: .6rem; line-height: .6rem;">姓名<span style="margin-left: 50px;">{{$store.state.name}}</span></div>
            <div style="margin-bottom: .2rem; height: .6rem; line-height: .6rem;">手机号<span style="margin-left: 35px;">{{$store.state.accountNumber}}</span></div>
            <el-form :model="form">
              <el-form-item label="原密码" :label-width="formLabelWidth">
                <el-input v-model="form.password1" autocomplete="off" type="password"></el-input>
              </el-form-item>
              <el-form-item label="新密码" :label-width="formLabelWidth">
                <el-input v-model="form.password2" autocomplete="off" type="password"></el-input>
              </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
              <el-button @click="dialog_cancel">取 消</el-button>
              <el-button type="primary" @click="dialoghold">保 存</el-button>
            </span>
        </el-dialog>

        <el-row>
            <el-col :span="12">
                <div class="index-hleft">京华大地--综合后台</div>
            </el-col>
            <el-col :span="12">
                <el-dropdown>
                    <div class="el-dropdown-link index-hright">
                        {{$store.state.name}}<i class="el-icon-arrow-down el-icon--right"></i>
                    </div>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item @click.native="userInfo">个人资料</el-dropdown-item>
                      <el-dropdown-item @click.native="change_password">修改密码</el-dropdown-item>
                      <el-dropdown-item @click.native="logout">退出账号</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
    
            </el-col>
        </el-row>
        
    </el-header>
</template>

<script>
import { getUserByToken, logOut, updateUserPassword } from '../../request/api';
import { getTextByJs } from '../../assets/js/common';
import { pass_word } from '../../assets/js/data';
export default {
    name: '',
    data() {
        return {
            centerDialogVisible: this.$store.state.oneLogin,
            form: {
                password1: '',
                password2: '',
            },
            formLabelWidth: '120px'
        }
    },
    created() {
        this.getUserByToken();
    },
    methods: {
        change_password(){
            console.log("change_password");
            this.centerDialogVisible = true;
        },
        userInfo() {
            console.log("userInfo");
        },
        logout() {
            // this.$smoke_post(logOut,{}).then(res => {
            //     console.log(res);
            // })
            localStorage.removeItem('jhToken');
            this.$store.dispatch('actionsSetCommonFlag', false);
            this.$router.push({ path: '/login'});
        },
        dialog_cancel() {
            this.centerDialogVisible = false;
        },
        // 保存密码接口
        dialoghold() {
            let type = '';
            if((!pass_word.test(this.form.password2))||(!this.form.password1)||(!this.form.password2)){
                this.$message({
                    message: '密码必须由6-12位数字或字母组成',
                    type: 'error'
                });
            }else{
                this.$smoke_post(updateUserPassword,{
                    oldPassword: this.form.password1,
                    newPassword: this.form.password2
                }).then(res => {
                    if(res.code == 200){
                        type = 'success';
                        this.centerDialogVisible = false;
                    }else{
                        type = 'error';
                    }
                    this.$message({
                        message: res.msg,
                        type: type
                    });
                });
            }
        },
        getUserByToken() {
            this.$smoke_post(getUserByToken,{}).then(res => {
                console.log(res);
                this.$store.dispatch('actionsSetName', res.data.name);
                this.$store.dispatch('actionsSetAccountNumber', res.data.accountNumber);
                this.$store.dispatch('actionsSetJobNumber', res.data.jobNumber);
                this.$store.dispatch('actionsSetUuid', res.data.uuid);
                this.$store.dispatch('actionsSetOneLogin', res.data.oneLogin);
            })
        },
    },
    mounted() {
        
    }
}
</script>

<style lang="less" scoped>
    .el-header{
        background: #545c64;
        color: #fff;
        line-height: 60px;
        padding: 0 .4rem;
        width: 100%;
    }
    .index-hleft{
        font-size: 24px;
        letter-spacing: .04rem;
    }
    .el-dropdown{
        float: right;
    }
    .index-hright{
        font-size: 18px;
        text-align: right;
        cursor: pointer;
        color: #fff;
    }
</style>
<style>
    .el-form-item__label{
        text-align: left !important;
        width: 80px !important;
    }
    .el-form-item__content{
        margin-left: 80px !important;
    }
</style>