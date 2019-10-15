<template>
    <el-header class="">

        <el-dialog
            title="设置密码"
            :visible.sync="centerDialogVisible"
            width="30%"
            center>
            <div style="margin-bottom: 22px;">姓名<span style="margin-left: 50px;">{{$store.state.name}}</span></div>
            <div style="margin-bottom: 22px;">手机号<span style="margin-left: 35px;">{{$store.state.accountNumber}}</span></div>
            <el-form :model="form">
              <el-form-item label="新密码" :label-width="formLabelWidth">
                <el-input v-model="form.password1" autocomplete="off" type="password"></el-input>
              </el-form-item>
              <el-form-item label="确认密码" :label-width="formLabelWidth">
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
                <div class="index-hleft">京华教育--综合后台</div>
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
import { getUserByToken } from '../../request/api';
import { getTextByJs } from '../../assets/js/common'
export default {
    name: '',
    data() {
        return {
            centerDialogVisible: false,
            form: {
                password1: '',
                password2: '',
            },
            formLabelWidth: '120px'
        }
    },
    created() {
        // this.getUserByToken();
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
            console.log(22);
            localStorage.removeItem('jhToken');
            this.$router.push({ path: '/login'});
        },
        dialog_cancel() {
            this.centerDialogVisible = false;
        },
        // 保存密码接口
        dialoghold() {
            this.centerDialogVisible = false;
        },
        getUserByToken() {
            this.$smoke_post(`/smoke_api`+`${getUserByToken}`,{}).then(res => {
                console.log(res);
                this.$store.dispatch('actionsSetName', res.data.name);
                this.$store.dispatch('actionsSetAccountNumber', res.data.accountNumber);
                this.$store.dispatch('actionsSetJobNumber', res.data.jobNumber);
                this.$store.dispatch('actionsSetUuid', res.data.uuid);
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