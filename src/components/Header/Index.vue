<template>
    <el-header style="height: 60px;">
        <el-dialog
            title="设置密码"
            :visible.sync="centerDialogVisible"
            :modal-append-to-body='false'
            width="40%"
            :show-close="centerDialogVisible"
            :before-close="handleClose"
            class="reset-password"
            center>
            <el-form :model="form">
                <el-form-item label="姓名" :label-width="formLabelWidth">
                    <el-input :value="$store.state.name" style="width: 80%;" disabled></el-input>
                </el-form-item>
                <el-form-item label="手机号" :label-width="formLabelWidth">
                    <el-input :value="$store.state.accountNumber" style="width: 80%;" disabled></el-input>
                </el-form-item>
                
              <el-form-item label="原密码" :label-width="formLabelWidth">
                <el-input v-model="form.password1" autocomplete="off" type="password" style="width: 80%;"></el-input>
              </el-form-item>
              <el-form-item label="新密码" :label-width="formLabelWidth">
                <el-input v-model="form.password2" autocomplete="off" type="password" style="width: 80%;"></el-input>
              </el-form-item>
              <el-form-item label="验证码" :label-width="formLabelWidth">
                <el-input :value="form.verCode" style="width: 40%;" @input="input_change_ma($event)"></el-input>
                <el-button style="display: inline-block; max-width: 150px; float: right; margin-right: 20%; width: 34%; height: 100%; margin-left: 6%; text-align: center;" plain @click="sendDingVerCode" :disabled="form_rule_flag">{{form_rule_name}}</el-button>
              </el-form-item>

              <el-form-item label="" :label-width="formLabelWidth">
                <div style="font-size: 12px; float: right; margin-right: 20%;">@：获取验证码后，请去钉钉查看</div>
              </el-form-item>
            </el-form>

            

            <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="dialoghold">保 存</el-button>
              <el-button @click="dialog_cancel" v-if="!oneLogin">取 消</el-button>
              <el-button @click="dialog_cancel_back" v-if="oneLogin">返回登录页</el-button>
            </span>
        </el-dialog>

        <el-dialog
            title="设置工作手机"
            :visible.sync="phoneDialogVisible"
            :modal-append-to-body='false'
            width="40%"
            :show-close="phoneDialogVisible"
            class="reset-phone"
            center>
            <el-form :model="form_phone" :rules="rules" ref="form_phone">
                <el-form-item label="姓名" :label-width="formLabelWidth">
                    <el-input :value="$store.state.name" style="width: 80%;" disabled></el-input>
                </el-form-item>
                <el-form-item label="手机号" :label-width="formLabelWidth" prop="phone">
                    <el-input :value="form_phone.phone" style="width: 80%;" @input="input_change($event)"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="dialoghold_phone('form_phone')">保 存</el-button>
              <el-button @click="dialog_cancel_phone">取 消</el-button>
            </span>
        </el-dialog>

        <el-row>
            <el-col :span="18" style="height: 60px !important;">
                <div class="index-hleft" @click="iconTitleClick" :class="back_Change ? 'back_Change' : ''">
                
                <el-image style="width: 200px; height: 35px; position: relative; top: 12px;" :src="back_Change ? require('../../assets/images/logo_Name_A.png') : require('../../assets/images/logo_Name_A.png')" fit="fit"></el-image>

                </div>

                <el-menu
                    :default-active="defaultActive"
                    class="el-menu-demo"
                    mode="horizontal"
                    @select="handleSelect"
                    background-color="#fff"
                    text-color="#333333"
                    active-text-color="#488FF7">
                    <el-menu-item 
                        v-for="(item,index) in $store.state.userMenuList"
                        v-if="item.disabled"
                        :index="`${item.url}`"
                        :key="index">
                        {{item.name}}
                    </el-menu-item>
                </el-menu>

            </el-col>

            <el-col :span="6">
                
                <el-dropdown>
                    <div class="el-dropdown-link index-hright">
                        {{$store.state.name}}<i class="el-icon-arrow-down el-icon--right"></i>
                    </div>
                    <el-dropdown-menu slot="dropdown">
                      <!-- <el-dropdown-item @click.native="userInfo">个人资料</el-dropdown-item> -->
                      <el-dropdown-item @click.native="change_password">修改密码</el-dropdown-item>
                      <el-dropdown-item @click.native="change_phone">修改工作手机</el-dropdown-item>
                      <el-dropdown-item @click.native="logout">退出账号</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>

                <el-popover
                    placement="bottom"
                    popper-class="message_popover"
                    width="400"
                    trigger="click">
                    <el-tabs v-model="activeName" @tab-click="tabClickHandle">
                        <el-tab-pane :label="`未读 (${notReadNumValue})`" name="first">
                            <dl v-for="(item, index) in unReadList" :key="index">
                                <dt title="点击查看消息内容" @click="handleLookClick(item)"><span></span>{{`${item.type}${ item.fold ? maxSlice(item.msg) : item.msg}`}}</dt>
                                <dd>{{item.createTime}}</dd>
                            </dl>
                            <dl v-if="!unReadList.length" class="no-data"><dt class="no-data">暂无未读消息</dt></dl>
                        </el-tab-pane>
                        <el-tab-pane label="已读" name="second">
                            <dl v-for="(item, index) in fullReadList" :key="index">
                                <dt title="点击查看消息内容" @click="item.fold = !item.fold">{{`${item.type}${ item.fold ? maxSlice(item.msg) : item.msg}`}}</dt>
                                <dd>{{item.createTime}}</dd>
                            </dl>
                            <dl v-if="!fullReadList.length" class="no-data"><dt class="no-data">暂无已读消息</dt></dl>
                        </el-tab-pane>
                    </el-tabs>
                    <el-badge slot="reference" :value="notReadNumValue" style="float: right; margin-right: 30px;" @click.native="badgeClick">
                    <i class="el-icon-bell" style="font-size: 18px;"></i>
                </el-badge>
                    
                </el-popover>

                <span style="float: right; margin-right: 14px; font-size: 14px;">v 1.0.1</span>
    
            </el-col>
        </el-row>
        
    </el-header>
</template>

<script>
import { 
    getUserLoginMessage,
    logOut, 
    updateUserPassword,
    readUuid,
    getStationNews,
    getClueDataNumber,
    noReadNum,
    getProfile,
    upProfile,
    sendDingVerCode
} from '../../request/api';
import { getTextByJs, timestampToTime, menuNumberFunc } from '../../assets/js/common';
import { pass_word, websockHttp } from '../../assets/js/data';
export default {
    name: '',
    data() {
        return {
            activeName: 'first',
            centerDialogVisible: false,
            form: {
                password1: '',
                password2: '',
                verCode: '',
            },
            form_rule_flag: false,
            form_rule_name: '获取钉钉验证码',
            timer:null,
            form_phone: {
                phone: '',
            },
            rules: {
                phone: [
                  { pattern:/^1[34578]\d{9}$/, message: "请输入合法手机号", trigger: "blur" }
                ],
            },
            formLabelWidth: '120px',
            defaultActive: '',
            oneLogin: null,
            direction: 'rtl',
            notReadNumValue: 0,
            newsForm: {
                pageSize: 1000,
                currentPage: 1,
                pageCount: 0,
                readState: 0 //0是未读，1是已读
            },
            tableData: [],
            columnListTree: [
                { props: 'createTime', label: '创建时间' },
                { props: 'msg', label: '消息内容' },
                { props: 'readState', label: '读取状态' },
            ],
            totalFlag: false, //当只有一页时隐藏分页
            clueDataNumberList: [],
            back_Change: false,
            unReadList: [],
            fullReadList: [],
            maxLength: 16,
            phoneDialogVisible: false,
        }
    },
    created() {
        this.getClueDataNumber();
        this.noReadNum();
    },
    methods: {
        sendDingVerCode() {
            let num = 60;
            this.$smoke_get(sendDingVerCode, {}).then(res => {
                if(res.code == 200) {
                    if(res.data == 0) {
                        this.$message({
                            type: 'success',
                            message: '获取钉钉验证码成功'
                        })
                        this.timer = setInterval(() => {
                            num--;
                            if(num <= 0){
                                clearInterval(this.timer);
                                this.form_rule_name = '获取钉钉验证码';
                                this.form_rule_flag = false;
                            }else{
                                this.form_rule_name = num + 's';
                                this.form_rule_flag = true;
                            }
                        },1000)
                        
                    }else{
                        this.$message({
                            type: 'error',
                            message: '亲，一分钟以后再获取'
                        })
                        this.timer = setInterval(() => {
                            num--;
                            if(num <= 0){
                                clearInterval(this.timer);
                                this.form_rule_name = '获取钉钉验证码';
                                this.form_rule_flag = false;
                            }else{
                                this.form_rule_name = num + 's';
                                this.form_rule_flag = true;
                            }
                        },1000)
                    }
                }else{
                    this.$message({
                        type: 'error',
                        message: '获取钉钉验证码失败'
                    })
                    this.form_rule_flag = false;
                }
            })
        },
        input_change(e) {
            this.form_phone.phone = e;
            this.$forceUpdate();
        },
        input_change_ma(e) {
            this.form.verCode = e;
            this.$forceUpdate();
        },
        dialog_cancel_back() {
            this.logout();
        },
        tabClickHandle(tab){
            this.getStationNews(tab.index)
        },
        maxSlice(msg){
            return msg.length > this.maxLength ? `${msg.slice(0, this.maxLength)}...` : msg
        },
        handleLookClick(row) {
            row.fold = !row.fold
            this.$smoke_get(readUuid + row.uuid, {}).then(res => {
                if(res.code == 200) {
                    this.$message({
                        type: 'success',
                        message: '查看成功'
                    })
                    if(row.type == '【首咨】') {
                        this.$router.push({
                            path: '/crm/myClient/firstTime'
                        })
                    }else if(row.type == '【新学员】'){
                        this.$router.push({
                            path: '/crm/myStudents/newStudents'
                        })
                    }
                    this.noReadNum();
                    // this.getStationNews(this.newsForm.readState)
                }
            })
        },
        noReadNum() {
            this.$smoke_post(noReadNum, {}).then(res => {
                if(res.code == 200) {
                    this.notReadNumValue = res.data;
                }
            })
        },
        getStationNews(readState) {
            this.unReadList = []
            this.fullReadList = []
            this.newsForm.readState = readState
            this.$smoke_post(getStationNews, this.newsForm).then(res => {
                if(res.code == 200) {
                    res.data.list.map(sll => {
                        sll.createTime = timestampToTime(Number(sll.createTime));
                        sll.type = sll.type == 1 ? '【首咨】' : '【新学员】'
                        sll.fold = true
                        // if(sll.readState == 0) {
                        //     sll.readState = '未读';
                        //     this.unReadList.push(sll)
                        // }else{
                        //     sll.readState = '已读';
                        //     this.fullReadList.push(sll)
                        // }
                    })
                    if(this.newsForm.readState == 0){ //未读
                      this.unReadList =  res.data.list
                    }else{
                        this.fullReadList = res.data.list
                    }
                    // this.newsForm.pageCount = this.newsForm.total % this.newsForm.pageSize == 0 ? this.newsForm.total / this.newsForm.pageSize : this.newsForm.total / this.newsForm.pageSize + 1
                    // this.tableData = res.data.list;
                    this.newsForm.total = res.data.total;
                }
            })
        },
        badgeClick() {
            this.getStationNews(0);
        },
        handleSelect(item) {
            if(item == '/base'){
                this.$router.push({
                    path: this.$store.state.userMenuList[0].defaultUrl,
                });
            }else if(item == '/crm'){
                this.$router.push({
                    path: this.$store.state.userMenuList[1].defaultUrl,
                });
            }else if(item == '/knowp'){
                this.$router.push({
                    path: this.$store.state.userMenuList[2].defaultUrl,
                });
            }else if(item == '/operate'){
                this.$router.push({
                    path: this.$store.state.userMenuList[3].defaultUrl,
                });
            }
        },
        iconTitleClick() {
            this.$router.push({path: '/'});
            this.defaultActive = '';
        },
        change_password(){
            this.centerDialogVisible = true;
        },
        change_phone() {
            this.phoneDialogVisible = true;
            this.$nextTick(() => {
              this.$refs['form_phone'].resetFields();
            }) 
            this.getProfile();
        },
        userInfo() {
            alert('暂未开发');
            // this.$router.push({path: '/base/people/default'});
        },
        logout() {
            // this.$smoke_post(logOut,{}).then(res => {
            //     console.log(res);
            // })
            localStorage.removeItem('jhToken');
            localStorage.removeItem('userMenuList');
            localStorage.removeItem('initOptions');
            this.$store.dispatch('actionsSetCommonFlag', false);
            this.$router.push({ path: '/login'});
        },
        dialog_cancel() {
            this.centerDialogVisible = false;
        },
        dialog_cancel_phone() {
            this.phoneDialogVisible = false;
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
                    newPassword: this.form.password2,
                    verCode: this.form.verCode
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
        dialoghold_phone(formName) {
            this.$refs[formName].validate((valid) => {
              if (valid) {
                console.log(this.form_phone);
                this.upProfile();
              } else {
                console.log('error submit!!');
                return false;
              }
            });
        },
        getProfile() {
            this.$smoke_get(getProfile, {}).then(res => {
                if(res.code == 200) {
                    this.form_phone.phone = res.data.workTel;
                }
            })
        },
        upProfile() {
            this.$smoke_post(upProfile, {
                workTel: this.form_phone.phone
            }).then(res => {
                if(res.code == 200) {
                    this.$message({
                        type: 'success',
                        message: '修改成功'
                    });
                    this.phoneDialogVisible = false;
                }else{
                    this.$message({
                        type: 'error',
                        message: res.msg
                    });
                }
            })
        },
        getClueDataNumber() {
            let arr = [];
            this.$smoke_get(getClueDataNumber, {}).then(res => {
                if(res.code == 200) {
                    for(let i in res.data) {
                        arr.push(res.data[i]);
                    }
                    this.clueDataNumberList = arr;
                    this.getUserLoginMessage();
                }else{
                    this.getUserLoginMessage();
                }
            })
        },
        getUserLoginMessage() {
            var that = this;
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
                    this.$store.dispatch('actionsSetAvatar', res.data.avatar);
                    this.$store.commit('setUserRole', res.data.roleName)
                    this.$store.commit('setUserDepartment', res.data.orgName)
                    this.$store.commit('setCurrentDate', res.data.time)

                    localStorage.setItem("buttonMap", JSON.stringify(res.data.buttonMap));
                    console.log(this.clueDataNumberList);
                    // this.$store.dispatch('actionsSetOneLogin', res.data.oneLogin);

                    localStorage.setItem("userMenuList", JSON.stringify(menuNumberFunc(res.data.userMenuList, this.clueDataNumberList)));

                    if( "WebSocket" in window ) {

                        console.log("您的浏览器支持 WebSocket!");


                        var http = websockHttp + res.data.uuid;

                        var ws = new WebSocket(http);

                        ws.onopen = function() {
                            // Web Socket 已连接上，使用 send() 方法发送数据
                            // alert("数据发送中...");
                            ws.send('消息发送');
                        };

                        ws.onmessage = function (evt) { 
                            if(evt.data.indexOf("notReadNum") != -1) {
                                console.log(evt);
                                let infoData = eval("(" + evt.data + ")");;
                                console.log(infoData);
                                that.$notify({
                                    title: '消息',
                                    message: infoData.msg,
                                    type: 'success',
                                    offset: 60
                                });
                                that.noReadNum();
                            }
                        };

                    }else{
                        console.log("您的浏览器不支持 WebSocket!");
                    }

                }else{
                    this.logout();
                }
            })
        },
        handleClose() {
            if(this.oneLogin){
                this.centerDialogVisible = true;
            }else{
                this.centerDialogVisible = false;
            }
        },
        tableRowClassName({row}) {
            if (row.readState == '未读') {
                return 'readState';
            }
            return '';
        }
    },
    watch:{
      '$route.path': function(newVal,oldVal){
        if(newVal.indexOf('base') != -1){
            this.defaultActive = '/base';
            this.back_Change = true;
        }else if(newVal.indexOf('crm') != -1){
            this.defaultActive = '/crm';
            this.back_Change = true;
        }else if(newVal.indexOf('knowp') != -1){
            this.defaultActive = '/knowp';
            this.back_Change = true;
        }else if(newVal.indexOf('operate') != -1){
            this.defaultActive = '/operate';
            this.back_Change = true;
        }else{
            this.back_Change = false;
        }
      }
    },
    mounted() {
        if(this.$route.path.indexOf('base') != -1){
            this.defaultActive = '/base';
            this.back_Change = true;
        }else if(this.$route.path.indexOf('crm') != -1){
            this.defaultActive = '/crm';
            this.back_Change = true;
        }else if(this.$route.path.indexOf('knowp') != -1){
            this.defaultActive = '/knowp';
            this.back_Change = true;
        }else if(this.$route.path.indexOf('operate') != -1){
            this.defaultActive = '/operate';
            this.back_Change = true;
        }else{
            this.back_Change = false;
        }
    }
}
</script>
<style lang="less">
.message_popover{
    padding: 0 !important;
    
    .el-tabs{
        .el-tabs__header{
            margin: 0;
        }
        .el-tabs__content{
            height: 270px;
            overflow-y: scroll;
        }
        .el-tabs__nav{
            width: 100%;
            .el-tabs__active-bar{
                width: 50% !important;
            }
            .el-tabs__item{
                text-align: center;
            }
        }
        .el-tabs__item{
            width: 50%;
        }
        .el-tab-pane{
            dl{
                display: flex;
                flex-direction: column;
                padding: 15px 20px;
                border-bottom: 1px solid #e8e8e8;
                dt{
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-start;
                    cursor: pointer;
                    span{
                        width: 5px;
                        height: 5px;
                        background: #409EFF;
                        border-radius: 50%;
                        margin:12px 0 0 0;
                    }
                }
                dd{
                    color:#999;
                    padding-left: 15px;
                }
            }
            dl.no-data{
                border: none;
            }
            dl.no-data dt{
                    justify-content: center;
                    display: block;
                    text-align: center;
                }
        }
    }
}
</style>
<style lang="less" scoped>
    .el-header{
        background: #fff;
        color: #333;
        line-height: 60px;
        padding: 0 40px 0 0;
        width: 100%;
        position: fixed;
        z-index: 999;
        .reset-password{
            /deep/ .el-dialog{
               .el-dialog__body{
                    padding: 0 !important;
                }
            }
        }
        .reset-phone{
            /deep/ .el-dialog{
               .el-dialog__body{
                    padding: 0 !important;
                }
            }
        }
        /deep/ .el-table{
            .el-table__header{
                line-height: 22px;
            }
        }
    }
    .index-hleft{
        width: 3rem;
        min-width: 200px;
        max-width: 256px;
        float: left;
        height: 60px;
        font-size: 18px;
        letter-spacing: .04rem;
        cursor: pointer;
        padding-left: 12px;
    }
    .el-dropdown{
        float: right;
    }
    .index-hright{
        font-size: 16px;
        text-align: right;
        cursor: pointer;
        color: #333;
    }
    .el-menu-demo{
        float: left;
        width: calc( 100% - 400px );
        padding-left: 20px;
        font-weight: 500 !important;
        // border-left: 1px solid #eeeeee;
    }
    .el-menu.el-menu--horizontal{
        border-bottom: none;
    }
    .el-menu-item{
        font-size: 16px;
        line-height: 62px !important;
        height: 60px !important;
    }
    .el-menu-item:hover{
        background-color: #fff!important;
        color: #488FF7!important;
    }
    .back_Change{
        // background: #3687FA;
        background: #fff;
    }
    .pagination{
        text-align: right;
        margin-top: .4rem;
        margin-right: .6rem;
    }
    /* //element-ui table的去除右侧滚动条的样式 */
    ::-webkit-scrollbar {
        width: 8px;
        height: 1px;
    }
        /* // 滚动条的滑块 */
    ::-webkit-scrollbar-thumb {
        background-color: #a1a3a9;
        border-radius: 0px;
        border-radius: 8px;
    }
</style>