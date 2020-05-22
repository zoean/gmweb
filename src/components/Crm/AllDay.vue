<template>
    <el-main class="index-main">

        <Start></Start>
        <el-row class="people-screen">

            <el-col :span="4">
                <el-input v-model="form.tel" size="small" placeholder="请输入查询的手机号" class="screen-li"></el-input>
            </el-col>

            <el-col :span="4">
                <el-input v-model="form.name" size="small" placeholder="请输入查询的客户姓名" class="screen-li"></el-input>
            </el-col>

            <el-col :span="4">
                
                <el-select v-model="form.dialState" size="small" placeholder="请选择是否首咨" class="screen-li">
                    <el-option
                      v-for="item in dialStateList"
                      :key="item.name"
                      :label="item.name"
                      :value="item.number">
                    </el-option>
                </el-select>

            </el-col>

            <el-col :span="4">

                <el-select v-model="form.education" size="small" placeholder="请选择最高学历" class="screen-li">
                    <el-option
                      v-for="item in enumList['MJ-1']"
                      :key="item.name"
                      :label="item.name"
                      :value="item.number">
                    </el-option>
                </el-select>

            </el-col>

            <el-col :span="4">

                <el-select v-model="form.workingLife" size="small" placeholder="请选择工作年限" class="screen-li">
                    <el-option
                      v-for="item in enumList['MJ-2']"
                      :key="item.name"
                      :label="item.name"
                      :value="item.number">
                    </el-option>
                </el-select>

            </el-col>

        </el-row>

        <el-row class="people-screen">

            <el-col :span="4">

                <el-select @change="selectTimeChange" size="small" v-model="form.selectTime" placeholder="请选择未联间隔" class="screen-li" clearable>
                    <el-option
                      v-for="item in selectTimeList"
                      :key="item.name"
                      :label="item.name"
                      :value="item.number">
                    </el-option>
                </el-select>

            </el-col>

            <el-col :span="4">

                <el-select v-model="form.ruleNumberName" size="small" placeholder="请选择分配组" class="screen-li">
                    <el-option
                      v-for="item in ruleNumberNameList"
                      :key="item.name"
                      :label="item.name"
                      :value="item.ruleNumberName">
                    </el-option>
                </el-select>

            </el-col>

            <el-col :span="4">
                <el-button type="primary" size="small" @click="getClueDataAll">查 询</el-button>
            </el-col>
            <el-col :span="12">
                <el-row type="flex" justify="end">
                    <el-button plain size="small" @click="editFieldHandle">表头管理</el-button>
                </el-row>
            </el-col>
        </el-row>

        <el-table
            :data="list"
            v-loading="fullscreenLoading"
            :row-class-name="tableRowClassName"
            style="width: 100%"
            :row-key="getRowKey"
            >
            <el-table-column
              :prop="item.props"
              v-for="(item, index) in columnList"
              :min-width="item.width"
              :key="index"
              >
              <template slot="header">
                {{item.label}}
                <span class="caret-wrapper" v-if="item.ifSort">
                    <i class="sort-caret ascending" @click="tableSort('ascending', item.props)"></i>
                    <i class="sort-caret descending" @click="tableSort('descending', item.props)"></i>
                </span>
              </template>
              <template slot-scope="scope">
                    <span>{{scope.row[item.props]}}</span>
                    <el-tooltip effect="dark" v-if="item.props == 'tel'" content="复制手机号码" placement="top">
                        <el-image
                            class="copy-icon-style"
                            @click="phoneCopy(scope.row)"
                            :src="require('../../assets/images/copy-icon.png')">
                        </el-image>
                    </el-tooltip>
                    
              </template>
            </el-table-column>

            <el-table-column prop="active" label="操作" fixed="right" min-width="340">
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
            @fatherDataList='getClueDataAll'
        >
        </CustomerNotes>

        <PageFieldManage :setPageNum="setPageNum" />

    </el-main>
    
</template>

<script>
import { 
    getClueDataAll,
    phoneOut,
    seatOut,
    clueDataRelease,  
    enumByEnumNums,
    getRuleItem,
    getClueDataNumber,
    copyTel
} from '../../request/api';
import PageFieldManage from '@/components/Base/PageFieldManage';
import Start from '../../components/Share/Start';
import { menuNumberFunc, copyData, removeEvery } from '../../assets/js/common';
import { MJ_1, MJ_2, MJ_3, MJ_4, MJ_5 } from '../../assets/js/data';
import CustomerNotes from '../Share/CustomerNotes';
export default {
    name: 'AllDay',
    components: {
        Start, 
        CustomerNotes,
        PageFieldManage
    },
    // watch:{
    //     '$store.state.editFieldVisible'(val){
    //         if(!val && this.$store.state.pageNum == 'YM_1'){
    //             this.getClueDataAll()
    //         }
            
    //     }
    // },
    data() {
        return {
            fieldNum: [],
            form: {
                currentPage: 1,
                pageSize: 10,
                total: null,
                userUuid: '',
                tel: '',
                endTime: '', //筛选条件结束条件
                startTime: '', //筛选条件开始条件
                name: '', 
                dialState: '', //是否首咨（0：首咨 1：非首咨）
                education: '', //最高学历
                workingLife: '', //工作年限
                selectTime: '', //未联间隔
                ruleNumberName: '', //分配组组名
                num: '',
                sortSet: []
            },
            totalFlag: false,
            ruleNumberNameList: [], //分配组数组
            selectTimeList: [
                { 'name': '今日已联', 'number': 0 },
                { 'name': '1-3日未联', 'number': 1 },
                { 'name': '4-6日未联', 'number': 2 },
                { 'name': '7-10日未联', 'number': 3 },
            ],
            dialStateList: [
                { 'name': '首咨', 'number': 0 },
                { 'name': '非首咨', 'number': 1 },
            ],
            list: [],
            columnList: [
                // { 'prop': 'tel', 'label': '电话数据' },
                // { 'prop': 'name', 'label': '姓名' },
                // { 'prop': 'education', 'label': '学历' },
                // { 'prop': 'workingLife', 'label': '工作年限' },
                // { 'prop': 'lastCallTime', 'label': '最后联系时间' },
                // // { 'prop': 'dataType', 'label': '下次联系时间' },
                // { 'prop': 'callDialUp', 'label': '拨通 / 拨打' },
                // { 'prop': 'school', 'label': '注册平台' },
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

            enumList: {},
            fullscreenLoading: false,
            clueDataNumberList: []
        }
    },
    created() {
        const uuid = localStorage.getItem('userUuid');
        this.form.userUuid = uuid;
        this.getClueDataNumber();
        const initOptions = localStorage.getItem('initOptions');
        this.initOptions = JSON.parse(initOptions);
        this.jqStart = browserfly.noConflict();
        let arr = [MJ_1, MJ_2, MJ_3, MJ_4, MJ_5];
        this.enumByEnumNums(arr);
        this.getRuleItem();
    },
    methods: {
        setPageNum(pageNum){
            this.form.num = pageNum
        },
    getRowKey(row){
      return row.num
    },
    editFieldHandle(){
        this.$store.commit('setEditFieldVisible', true)
    },
        handleCurrentChange(index) {
            this.form.currentPage = index;
            this.getClueDataAll();
        },
        handleSizeChange(index) {
            this.form.pageSize = index;
            this.getClueDataAll();
        }, 
        selectTimeChange(value) {
            const time = new Date(new Date().toLocaleDateString()).getTime();
            const oneTime = time - ( 3600 * 1000 * 24 * 1 );
            const threeTime = time - ( 3600 * 1000 * 24 * 3 );
            const fourTime = time - ( 3600 * 1000 * 24 * 4 );
            const sixTime = time - ( 3600 * 1000 * 24 * 6 );
            const sevenTime = time - ( 3600 * 1000 * 24 * 7 );
            const tenTime = time - ( 3600 * 1000 * 24 * 10 );
            if(value == 0) {
                this.form.startTime = time;
                this.form.endTime = '';
            }
            if(value == 1) {
                this.form.startTime = threeTime;
                this.form.endTime = oneTime;
            }
            if(value == 2) {
                this.form.startTime = sixTime;
                this.form.endTime = fourTime;
            }
            if(value == 3) {
                this.form.startTime = tenTime;
                this.form.endTime = sevenTime;
            }
            if(value.length == 0) {
                this.form.startTime = '';
                this.form.endTime = '';
            }
        },
        getRuleItem() {
            this.$smoke_get(getRuleItem, {
                type: ''
            }).then(res => {
                if(res.code == 200){
                    this.ruleNumberNameList = res.data;
                }
            })
        },
        enumByEnumNums(arr) {
            this.$smoke_post(enumByEnumNums, {
                numberList: arr
            }).then(res => {
                if(res.code == 200){
                    for (var i in res.data) {
                        res.data[i].map(sll => {
                            if(sll.enable == 0) {
                                res.data[i] = removeEvery(sll, res.data[i]);
                            }
                        })
                    }
                    for (var i in res.data) {
                        res.data[i].map(sll => {
                            if(sll.enable == 0) {
                                res.data[i] = removeEvery(sll, res.data[i]);
                            }
                        })
                    }
                    this.enumList = res.data;
                }
            })
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
        getClueDataNumber() {
            let arr = [];
            this.$smoke_get(getClueDataNumber, {}).then(res => {
                if(res.code == 200) {
                    for(let i in res.data) {
                        arr.push(res.data[i]);
                    }
                    this.clueDataNumberList = arr;
                    this.getClueDataAll();
                }else{
                    this.getClueDataAll();
                }
            })
        },
        getClueDataAll() {
            this.fullscreenLoading = true;
            this.drawer = false;
            this.$smoke_post(getClueDataAll, this.form).then(res => {
                if(res.code == 200) {
                    setTimeout(() => {
                        this.fullscreenLoading = false;
                        this.columnList = res.data.filedList;
                        this.schoolId = res.data.schoolId;
                        this.list = res.data.list;
                        this.form.total = this.clueDataNumberList[0] = res.data.total;
                        this.$nextTick(() => {
                            console.log(menuNumberFunc(this.$store.state.userMenuList, this.clueDataNumberList));
                            this.$store.commit('setUserMenuList', menuNumberFunc(this.$store.state.userMenuList, this.clueDataNumberList));
                            localStorage.setItem("userMenuList", JSON.stringify(menuNumberFunc(this.$store.state.userMenuList, this.clueDataNumberList)));
                        })
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
        tableSort(type, props){
            this.form.sortSet = []
            this.form.sortSet.push({[props]: type === 'ascending' ? 'ASC' : 'DESC'})
            this.getClueDataAll()
        },
        release(scope) {
            let arr = [];
            arr.push(scope.userCDARUuid);
            this.$smoke_post(clueDataRelease, {
                list: arr
            }).then(res => {
                if(res.code == 200) {
                    this.$message({
                        type: 'success',
                        message: '释放数据成功'
                    })
                    this.getClueDataAll();
                }
            })
        },
        phoneOut( scope ) {
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
                            this.examItem = scope.examItem;
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
                            this.examItem = scope.examItem;
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
        tableRowClassName({row}) {
            if (row.dialState == 0) {
                return 'dialState';
            }
            return '';
        },
        phoneCopy(row) {
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
        }
    }
}
</script>

<style lang="less" scoped>
    .index-main{
        height: auto;
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
          margin-left: 5px;
        }
        .edit-field-icon{
          color: #5cb6ff;
          font-size: 20px;
          cursor: pointer;
        }
    }
</style>