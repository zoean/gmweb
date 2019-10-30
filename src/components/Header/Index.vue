<template>
    <el-header class="">

        <el-dialog
            title="设置密码"
            :visible.sync="centerDialogVisible"
            width="30%"
            :before-close="handleClose"
            center>
            <div style="height: .6rem; line-height: .6rem;">姓名<span style="margin-left: 25%;">{{$store.state.name}}</span></div>
            <div style="margin-bottom: .2rem; height: .6rem; line-height: .6rem;">手机号<span style="margin-left: 21%;">{{$store.state.accountNumber}}</span></div>
            <el-form :model="form">
              <el-form-item label="原密码" :label-width="formLabelWidth">
                <el-input v-model="form.password1" autocomplete="off" type="password"></el-input>
              </el-form-item>
              <el-form-item label="新密码" :label-width="formLabelWidth">
                <el-input v-model="form.password2" autocomplete="off" type="password"></el-input>
              </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
              <el-button @click="dialog_cancel" v-if="!oneLogin">取 消</el-button>
              <el-button type="primary" @click="dialoghold">保 存</el-button>
            </span>
        </el-dialog>

        <el-row>
            <el-col :span="20" style="height: 60px !important;">
                <div class="index-hleft" @click="iconTitleClick">
                
                <el-image style="width: 40px; height: 40px; position: relative; top: 10px;" :src="require('../../assets/images/logo.png')" fit="fit"></el-image>
                <span> 京华综合管理后台</span>

                </div>

                <el-menu
                    :default-active="defaultActive"
                    class="el-menu-demo"
                    mode="horizontal"
                    @select="handleSelect"
                    background-color="#545c64"
                    text-color="#fff"
                    active-text-color="#ffd04b">
                    <el-menu-item 
                        v-for="(item,index) in $store.state.userMenuList" 
                        v-if="item.disabled"
                        :index="`${item.url}`"
                        :key="index">
                        {{item.name}}
                    </el-menu-item>
                </el-menu>

            </el-col>

            <el-col :span="4">
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
import { getUserLoginMessage, logOut, updateUserPassword } from '../../request/api';
import { getTextByJs } from '../../assets/js/common';
import { pass_word } from '../../assets/js/data';
export default {
    name: '',
    data() {
        return {
            centerDialogVisible: false,
            form: {
                password1: '',
                password2: '',
            },
            formLabelWidth: '120px',
            defaultActive: '',
            oneLogin: null,
        }
    },
    created() {
        this.getUserLoginMessage();
    },
    methods: {
        handleSelect(item) {
            console.log(item);
            console.log(this.$store.state.userMenuList);
            let flag = true;
            if(item == '/base'){
                if(this.$store.state.userMenuList[0].includeSubsetList.length != 0){
                    this.$store.state.userMenuList[0].includeSubsetList.map(res => {
                        if(res.disabled && flag){
                            flag = false;
                            this.$router.push({
                                path: res.url,
                            });
                        }
                    })
                }else{
                    this.$router.push({
                        path: this.$store.state.userMenuList[0].url,
                    });
                }
            }else if(item == '/crm'){
                if(this.$store.state.userMenuList[1].includeSubsetList.length != 0){
                    this.$store.state.userMenuList[1].includeSubsetList.map(res => {
                        if(res.disabled && flag){
                            flag = false;
                            this.$router.push({
                                path: res.url,
                            });
                        }
                    })
                }else{
                    this.$router.push({
                        path: this.$store.state.userMenuList[1].url,
                    });
                }
            }else if(item == '/knowp'){
                if(this.$store.state.userMenuList[2].includeSubsetList.length != 0){
                    this.$store.state.userMenuList[2].includeSubsetList.map(res => {
                        if(res.disabled && flag){
                            flag = false;
                            this.$router.push({
                                path: res.url,
                            });
                        }
                    })
                }else{
                    this.$router.push({
                        path: this.$store.state.userMenuList[2].url,
                    });
                }
            }
        },
        iconTitleClick() {
            this.$router.push({path: '/'});
            this.defaultActive = '';
        },
        change_password(){
            console.log("change_password");
            this.centerDialogVisible = true;
        },
        userInfo() {
            console.log("userInfo");
            alert('暂未开发');
            // this.$router.push({path: '/base/people/default'});
        },
        logout() {
            // this.$smoke_post(logOut,{}).then(res => {
            //     console.log(res);
            // })
            localStorage.removeItem('jhToken');
            localStorage.removeItem('userMenuList');
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
        getUserLoginMessage() {
            this.$smoke_post(getUserLoginMessage,{}).then(res => {
                console.log(res);
                if(res.code == 200) {
                    this.centerDialogVisible = res.data.oneLogin;

                    this.oneLogin = res.data.oneLogin;

                    this.$store.dispatch('actionsSetName', res.data.name);
                    this.$store.dispatch('actionsSetAccountNumber', res.data.accountNumber);
                    this.$store.dispatch('actionsSetJobNumber', res.data.jobNumber);
                    this.$store.dispatch('actionsSetUuid', res.data.uuid);
                    this.$store.dispatch('actionsSetUserMenuList', res.data.userMenuList);

                    localStorage.setItem("userMenuList", JSON.stringify(res.data.userMenuList));
                    // this.$store.dispatch('actionsSetOneLogin', res.data.oneLogin);
                }else{
                    this.logout();
                }
            })
        },
        handleClose() {
            console.log(this.oneLogin);
            if(this.oneLogin){
                this.centerDialogVisible = true;
            }else{
                this.centerDialogVisible = false;
            }
        }
    },
    watch:{
      '$route.path': function(newVal,oldVal){
        if(newVal.indexOf('base') != -1){
            this.defaultActive = '/base';
        }else if(newVal.indexOf('crm') != -1){
            this.defaultActive = '/crm';
        }else if(newVal.indexOf('knowp') != -1){
            this.defaultActive = '/knowp';
        }
      }
    },
    mounted() {
        if(this.$route.path.indexOf('base') != -1){
            this.defaultActive = '/base';
        }else if(this.$route.path.indexOf('crm') != -1){
            this.defaultActive = '/crm';
        }else if(this.$route.path.indexOf('knowp') != -1){
            this.defaultActive = '/knowp';
        }
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
        width: 300px;
        float: left;
        font-size: 24px;
        letter-spacing: .04rem;
        cursor: pointer;
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
    .el-menu-demo{
        float: right;
        width: calc( 100% - 300px );
    }
    .el-menu.el-menu--horizontal{
        border-bottom: none;
    }
    .el-menu-item{
        font-size: 20px;
        line-height: 64px !important;
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