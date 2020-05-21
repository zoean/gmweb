<template>
    <el-main class="index-main">

        <Start></Start>
        <el-row class="people-screen">
            <el-col :span="5">
                <el-input v-model="form.tel" placeholder="请输入要查询的手机号" class="screen-li"></el-input>
            </el-col>
            <el-col :span="5">
                <el-button type="primary" @click="firstConDataList">搜 索</el-button>
            </el-col>
        </el-row>

        <el-table
            :data="list"
            v-loading="fullscreenLoading"
            style="width: 100%">

            <el-table-column
              :prop="item.prop"
              :label="item.label"
              :width="item.label == '最后联系时间' ? '110px ': item.label == '电话数据' ? '130px': item.label == '拨通 / 拨打' ? '100px' : ''"
              v-for="(item, index) in columnList"
              :key="index"
              >
              <template slot-scope="scope">
                    <span>{{scope.row[item.prop]}}</span>
                    <el-tooltip effect="dark" v-if="item.prop == 'phone'" content="复制手机号码" placement="top">
                        <el-image
                            class="copy-icon-style"
                            @click="phoneCopy(scope.row)"
                            :src="require('../../assets/images/copy-icon.png')">
                        </el-image>
                    </el-tooltip>
              </template>
            </el-table-column>

            <el-table-column prop="active" label="操作" min-width="220" fixed="right">
              <template slot-scope="scope">
                  <el-button @click="phoneOut(scope.row)" type="text" >手机外拨</el-button>
                  <el-button @click="seatOut(scope.row)" type="text" >座机外拨</el-button>
                  <el-popconfirm
                    confirmButtonText='确定'
                    cancelButtonText='取消'
                    icon="el-icon-info"
                    iconColor="red"
                    placement="top"
                    title="确认释放该数据吗？"
                    @onConfirm="release(scope.row)"
                  >
                    <el-button type="text" slot="reference">释放数据</el-button>
                  </el-popconfirm>
                  <el-button @click="customerInfo(scope.row)" type="text" >客户信息</el-button>
                  <el-button @click="handleAddClick(scope.row)" type="text" >添加备注</el-button>
              </template>
            </el-table-column>

        </el-table>

        <el-pagination
            background
            layout="total, sizes, prev, pager, next, jumper"
            style="text-align: right; margin-top: 20px;"
            :total='form.total'
            :page-size='form.pageSize'
            :page-sizes="[10, 20, 30]"
            :hide-on-single-page="totalFlag"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
        >
        </el-pagination>

        <CustomerNotes 
            v-if="drawer"
            @changeDrawer="changeDrawer"
            :followFlag='followFlag' 
            :drawer.sync='drawer'
            :userUuid='form.userUuid'
            :schoolId='schoolId'
            :examItem='examItem'
            :clueDataSUuid='clueDataSUuid'
            :comMode='comMode'
            :callLogUuid='callLogUuid'
            @fatherDataList='firstConDataList'
        >
        </CustomerNotes>

    </el-main>
</template>

<script>
import { 
    firstConDataList,
    phoneOut,
    seatOut,
    clueDataRelease,
    copyTel
} from '../../request/api';
import Start from '../../components/Share/Start';
import { timestampToTime, backType, smoke_MJ_4, smoke_MJ_5, pathWayText, classTypeText, copyData } from '../../assets/js/common';
import { MJ_1, MJ_2, MJ_3, MJ_4, MJ_5 } from '../../assets/js/data';
import CustomerNotes from '../Share/CustomerNotes';
export default {
    name: 'firstTime',
    data() {
        return {
            form: {
                currentPage: 1,
                pageSize: 10,
                userUuid: '',
                total: null,
                tel: '',
            },
            totalFlag: false,
            list: [],
            columnList: [
                { 'prop': 'phone', 'label': '电话数据' },
                { 'prop': 'name', 'label': '姓名' },
                { 'prop': 'education', 'label': '学历' },
                { 'prop': 'workingLife', 'label': '工作年限' },
                { 'prop': 'lastCallTime', 'label': '最后联系时间' },
                // { 'prop': 'dataType', 'label': '下次联系时间' },
                { 'prop': 'callDialUp', 'label': '拨通 / 拨打' },
                { 'prop': 'school', 'label': '注册平台' },
            ],
            initOptions: {},
            jqStart: null,

            followFlag: false,
            drawer: false,
            clueDataSUuid: '',
            callLogUuid: '',
            comMode: '',
            schoolId: '',
            examItem: '',

            fullscreenLoading: false,
        }
    },
    components: {
        Start, CustomerNotes
    },
    created() {
        const uuid = localStorage.getItem('userUuid');
        this.form.userUuid = uuid;
        this.firstConDataList();
        const initOptions = localStorage.getItem('initOptions');
        this.initOptions = JSON.parse(initOptions);
        this.jqStart = browserfly.noConflict();
    },
    methods: {
        handleCurrentChange(index) {
            console.log(index);
            this.form.currentPage = index;
            this.getClueDataAll();
        },
        handleSizeChange(index) {
            console.log(index);
            this.form.pageSize = index;
            this.getClueDataAll();
        },
        //客户信息
        customerInfo(row) {
            this.drawer = true;
            this.clueDataSUuid = row.clueDataSUuid;
            this.followFlag = false;
        },
        handleAddClick(row) {
            this.drawer = true;
            this.clueDataSUuid = row.clueDataSUuid;
            this.followFlag = true;
            this.comMode = '微信沟通';
            this.examItem = row.examItemId;
        },
        changeDrawer(val){
            // console.log(val);
            this.drawer = val;
        },
        firstConDataList() {
            this.fullscreenLoading = true;
            this.drawer = false;
            this.$smoke_post(firstConDataList, this.form).then(res => {
                console.log(res);
                if(res.code == 200) {
                    setTimeout(() => {
                        this.fullscreenLoading = false;
                        res.data.list.map(sll => {
                            sll.lastCallTime = timestampToTime(Number(sll.lastCallTime));
                            sll.callDialUp = sll.dialUpNum + '/' + sll.callNum;
                        })
                        this.list = res.data.list;
                        this.form.total = res.data.total;
                        this.schoolId = res.data.schoolId;
                    }, 300);
                }else{
                    setTimeout(() => {
                        this.fullscreenLoading = false;
                        this.$message({
                            type: 'error',
                            message: res.msg
                        })
                    }, 300)
                }
            })
        },
        release(scope) {
            let arr = [];
            arr.push(scope.userCDARUuid);
            this.$smoke_post(clueDataRelease, {
                list: arr
            }).then(res => {
                console.log(res);
                if(res.code == 200) {
                    this.$message({
                        type: 'success',
                        message: '释放数据成功'
                    })
                    this.firstConDataList();
                }
            })
        },
        phoneOut( scope ) {
            console.log(this.initOptions);
            console.log(scope);
            if(this.initOptions != undefined){
                this.$smoke_post(phoneOut, {
                    adminUin: this.initOptions.adminUin,
                    uin: this.initOptions.uin,
                    uuid: scope.userCDARUuid,
                }).then(res => {
                    if(res.code == 200){
                        if(res.data.result){
                            this.callLogUuid = res.data.callLogUuid;
                            this.clueDataSUuid = scope.clueDataSUuid;
                            this.drawer = true;
                            this.followFlag = true;
                            this.comMode = '手机外呼';
                            this.examItem = scope.examItemId;
                        }else{
                            this.$message({
                                type: 'error',
                                message: '目前服务线路忙，请稍后重试'
                            })
                        }
                    }else{
                        this.$message({
                            type: 'error',
                            message: res.msg
                        })
                    }
	                this.jqStart.monitorEvent("callTip", function(message, jsonObject) {
                        console.log('监听成功-callTip');
                        console.log(message);
                        console.log(jsonObject);
                    });
                })
            }else{
                this.$message({
                    type: 'error',
                    message: '请联系主管配置jq账号'
                })
            }
        },
        seatOut( scope ) {
            if(this.initOptions != undefined){
                this.$smoke_post(seatOut, {
                    adminUin: this.initOptions.adminUin,
                    uin: this.initOptions.uin,
                    uuid: scope.userCDARUuid,
                }).then(res => {
                    if(res.code == 200){
                        if(res.data.result){
                            this.callLogUuid = res.data.callLogUuid;
                            this.clueDataSUuid = scope.clueDataSUuid;
                            this.drawer = true;
                            this.followFlag = true;
                            this.comMode = '座机外呼';
                            this.examItem = scope.examItemId;
                        }else{
                            this.$message({
                                type: 'error',
                                message: '目前服务线路忙，请稍后重试'
                            })
                        }
                    }else{
                        this.$message({
                            type: 'error',
                            message: res.msg
                        })
                    }
	                this.jqStart.monitorEvent("seatState", function(message, jsonObject) {
                        console.log('监听成功-seatState');
                        console.log(message);
                        console.log(jsonObject);
                    }); 
                    this.jqStart.monitorEvent("callEvent", function(message, jsonObject) {
                        console.log('监听成功-callEvent');
                        console.log(message);
                        console.log(jsonObject);
                    });
                    this.jqStart.monitorEvent("callTip",function(message, jsonObject){
                        console.log('监听成功-callTip');
                        console.log(message);
                        console.log(jsonObject);
                    })
                })
            }else{
                this.$message({
                    type: 'error',
                    message: '请联系主管配置jq账号'
                })
            }
        },
        phoneCopy(row) {
            console.log(row.clueDataSUuid);
            this.copyTel(row.clueDataSUuid);
        },
        copyTel(id) {
            this.$smoke_post(copyTel, {
                uuid: id
            }).then(res => {
                if(res.code == 200) {
                    copyData(res.data);
                    this.$message({
                        type: 'success',
                        message: '复制成功',
                    });
                }else{
                    this.$message({
                        type: 'error',
                        message: res.msg
                    })
                }
            })
        },
    },
    mounted() {
        
    }
}
</script>

<style lang="less" scoped>
    .index-main{
        height: calc( 100vh - 140px);
        .people-title{
            width: 100%;
            height: 40px;
            line-height: 40px;
            text-align: center;
            font-size: 15px;
            background: #fff;
            margin-bottom: .3rem;
            color: #666666;
        }
        .people-screen{
            margin-bottom: 16px;
            .screen-li{
                width: 90%;
            }
        }
        .el-button{
          margin-left: 10px;
        }
        .edit-field-icon{
          color: #5cb6ff;
          font-size: 20px;
          cursor: pointer;
        }
    }
</style>