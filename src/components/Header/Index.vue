<template>
    <el-header class="" style="height: 60px;">

        <el-dialog
            title="设置密码"
            :visible.sync="centerDialogVisible"
            width="30%"
            :show-close="centerDialogVisible"
            :before-close="handleClose"
            center>
            <div style="height: .6rem; line-height: .6rem;">
                <span style="margin-left: 72px;">姓名</span>
                <span style="margin-left: 20px;">{{$store.state.name}}</span>
            </div>
            <div style="margin-bottom: .2rem; height: .6rem; line-height: .6rem;">
                <span style="margin-left: 56px;">手机号</span>
                <span style="margin-left: 20px;">{{$store.state.accountNumber}}</span>
            </div>
            <el-form :model="form">
              <el-form-item label="原密码" :label-width="formLabelWidth">
                <el-input v-model="form.password1" autocomplete="off" type="password" style="width: 80%;"></el-input>
              </el-form-item>
              <el-form-item label="新密码" :label-width="formLabelWidth">
                <el-input v-model="form.password2" autocomplete="off" type="password" style="width: 80%;"></el-input>
              </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
              <el-button @click="dialog_cancel" v-if="!oneLogin">取 消</el-button>
              <el-button type="primary" @click="dialoghold">保 存</el-button>
            </span>
        </el-dialog>

        <el-row>
            <el-col :span="20" style="height: 60px !important;">
                <div class="index-hleft" @click="iconTitleClick" :class="back_Change ? 'back_Change' : ''">
                
                <el-image style="width: 200px; height: 35px; position: relative; top: 12px;" :src="back_Change ? require('../../assets/images/logo_Name_B.png') : require('../../assets/images/logo_Name_A.png')" fit="fit"></el-image>

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

            <el-col :span="4">
                <span style="position: absolute; right: 154px; font-size: 14px;">v 1.0.1</span>
                <el-badge :value="notReadNumValue" style="position: absolute; top: 4px; right: 110px; cursor: pointer;" @click.native="badgeClick">
                    <i class="el-icon-bell" style="font-size: 18px;"></i>
                </el-badge>
                <el-dropdown>
                    <div class="el-dropdown-link index-hright">
                        {{$store.state.name}}<i class="el-icon-arrow-down el-icon--right"></i>
                    </div>
                    <el-dropdown-menu slot="dropdown">
                      <!-- <el-dropdown-item @click.native="userInfo">个人资料</el-dropdown-item> -->
                      <el-dropdown-item @click.native="change_password">修改密码</el-dropdown-item>
                      <el-dropdown-item @click.native="logout">退出账号</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
    
            </el-col>
        </el-row>

        <el-drawer 
            :title="drawerTitle"
            size="50%"
            :visible.sync="drawer"
            :direction="direction"
            :before-close="handleCloseDrawer"
        >

            <el-table
                border
                :row-class-name="tableRowClassName"
                style="margin: 22px; width: 90%;"
                :data="tableData"
            >

                <el-table-column
                    :prop="item.props"
                    :label="item.label"
                    v-for="(item, index) in columnListTree"
                    :key="index">
                </el-table-column>

                <el-table-column prop="active" label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" @click="handleLookClick(scope.row)">查看</el-button>
                    </template>
                </el-table-column>

            </el-table>

            <el-pagination
                background
                class="pagination"
                layout="total, sizes, prev, pager, next, jumper"
                :total='newsForm.total'
                :page-size='newsForm.pageSize'
                :page-sizes="[10, 20, 30]"
                :hide-on-single-page="totalFlag"
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange"
            >
            </el-pagination>

        </el-drawer>
        
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
    noReadNum
} from '../../request/api';
import { getTextByJs, timestampToTime, menuNumberFunc } from '../../assets/js/common';
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
            drawer: false,
            drawerTitle: '消息列表',
            direction: 'rtl',
            notReadNumValue: null,
            newsForm: {
                pageSize: 10,
                currentPage: 1,
                total: null,
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
        }
    },
    created() {
        this.getClueDataNumber();
        this.noReadNum();
    },
    methods: {
        handleSizeChange(index) {
            console.log(index);
            this.newsForm.pageSize = index;
            this.getStationNews();
        },
        handleCurrentChange(index) {
            console.log(index);
            this.newsForm.currentPage = index;
            this.getStationNews();
        },
        handleLookClick(row) {
            this.$smoke_get(readUuid + row.uuid, {}).then(res => {
                if(res.code == 200) {
                    this.$message({
                        type: 'success',
                        message: '查看成功'
                    })
                    this.drawer = false;
                    if(row.type == 1) {
                        this.$router.push({
                            path: '/crm/myClient/firstTime'
                        })
                    }else{
                        this.$router.push({
                            path: '/crm/myStudents/newStudents'
                        })
                    }

                    this.noReadNum();

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
        getStationNews() {
            this.$smoke_post(getStationNews, this.newsForm).then(res => {
                if(res.code == 200) {
                    res.data.list.map(sll => {
                        sll.createTime = timestampToTime(Number(sll.createTime));
                        if(sll.readState == 0) {
                            sll.readState = '未读';
                        }else{
                            sll.readState = '已读';
                        }
                    })
                    this.tableData = res.data.list;
                    this.newsForm.total = res.data.total;
                }
            })
        },
        badgeClick() {
            this.drawer = true;
            this.getStationNews();
        },
        handleCloseDrawer(done) {
            done();
        },
        handleSelect(item) {
            console.log(item);
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
            localStorage.removeItem('initOptions');
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

                        var http = 'wss://testwebsocket.jhwx.com' + '/websocket/msg/' + res.data.uuid;

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
        tableRowClassName({row, rowIndex}) {
            if (row.readState == '未读') {
                return 'readState';
            }
            return '';
        },
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

<style lang="less" scoped>
    .el-header{
        background: #fff;
        color: #333333;
        line-height: 60px;
        padding: 0 40px 0 0;
        width: 100%;
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
        color: #333333;
    }
    .el-menu-demo{
        float: left;
        width: calc( 100% - 400px );
        padding-left: 30px;
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
        background: #3687FA;
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