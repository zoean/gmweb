<template>
    <el-main class="index-main">

        <Start></Start>
        <el-tabs @tab-click="tabChange">
            <el-tab-pane label="学员">

                <el-row class="people-screen">
                    <el-col :span="4">
                        <el-input v-model="form.tel" size="small" placeholder="请输入要查询的手机号" class="screen-li"></el-input>
                    </el-col>
                    <el-col :span="4">
                        <el-button type="primary" size="small" @click="orderCallDataList">查 询</el-button>
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

                    <el-table-column prop="active" label="操作" min-width="160" fixed="right">
                    <template slot-scope="scope">
                        <el-button @click="phoneOut(scope.row)" type="text" >手机外拨</el-button>
                        <el-button @click="seatOut(scope.row)" type="text" >座机外拨</el-button>
                        <!-- <el-button @click="release(scope.row)" type="text" >释放数据</el-button> -->
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
            </el-tab-pane>
            <el-tab-pane label="订单">
                <el-row type="flex" :gutter="20">
                    <el-col :span="4">
                        <el-input placeholder="请输入手机号" size="small" v-model="orderForm.tel"></el-input>
                    </el-col>
                    <el-col :span="4">
                        <el-input placeholder="请输入客户姓名" size="small" v-model="orderForm.name"></el-input>
                    </el-col>
                    <el-col :span="4">
                        <el-select v-model="orderForm.commodityClassId" size="small" placeholder="请选择商品班型" clearable>
                            <el-option
                            v-for="item in commodityClassOptions"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="4">
                        <el-select v-model="orderForm.purchaseStatus" size="small" placeholder="请选择购买状态" clearable>
                            <el-option
                            v-for="(item, index) in purchaseOptions"
                            :key="index"
                            :label="item"
                            :value="index">
                            </el-option>
                        </el-select>
                    </el-col>
                    
                </el-row>
                <el-row type="flex" :gutter="20" style="margin-top: 16px;">
                    <el-col :span="8">
                        <el-date-picker
                            style="width: 100%;"
                            size="small"
                            v-model="orderForm.time"
                            type="daterange"
                            align="right"
                            unlink-panels
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            @change="changeTime"
                            value-format="timestamp">
                        </el-date-picker>
                    </el-col>
                    <el-col :span="4">
                        <el-button type="primary" size="small" @click="getUserOrderList">搜索</el-button>
                    </el-col>
                </el-row>
                <el-table
                :data="userOrderList"
                style="width: 100%; margin-top: 16px;">
                    <el-table-column v-for="(item, index) in userOrderColumn" :width="item.width" :prop="item.prop" :label="item.label" :key="index">
                    <template slot-scope="scope">
                        <span>{{scope.row[item.prop]}}</span>
                        <el-tooltip v-if="item.prop=='tel'" effect="dark" content="复制手机号码" placement="top">
                            <el-image
                                class="copy-icon-style"
                                @click="phoneCopy(scope.row)"
                                :src="require('../../assets/images/copy-icon.png')">
                            </el-image>
                        </el-tooltip>
                    </template>
                    
                    </el-table-column>
                    <el-table-column prop="active" label="操作">
                    <template slot-scope="scope">
                        <el-button @click="payDetail(scope.row)" type="text">支付记录</el-button>
                    </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                    background
                    @size-change="handleOrderSizeChange"
                    @current-change="handleOrderCurrentChange"
                    :current-page="orderForm.currentPage"
                    :page-sizes="[10, 20, 30]"
                    :page-size="orderForm.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    style="text-align: right; margin-top: 20px;"
                    :total="userOrderTotal"
                    >
                </el-pagination>
            </el-tab-pane>
        </el-tabs>

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
            @fatherDataList='orderCallDataList'
        >
        </CustomerNotes>
        <el-dialog width="50%" class="show-pay-detail" :visible.sync="payDetailVisible" title="支付记录">
            <el-table :data="orderDetail">
                <el-table-column v-for="(item, index) in paymentRecordColumn" :key="index" :label="item.label" :prop="item.prop" :formatter="item.formatter" :min-width="item.width">
                </el-table-column>
            </el-table>
        </el-dialog>
    </el-main>
</template>

<script>
import { 
    orderCallDataList,
    phoneOut,
    seatOut,
    clueDataRelease,  
    copyTel,
    userOrderDataList,
    getGoodsList,
    getOrderPayRecord
} from '../../request/api';
import Start from '../../components/Share/Start';
import { timestampToTime, copyData } from '../../assets/js/common';
import CustomerNotes from '../Share/CustomerNotes';
export default {
    name: 'completed',
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
            orderForm: {
                pageSize: 10,
                currentPage: 1,
                tel: '',
                name: '',
                commodityClassId: '',
                purchaseStatus: '',
                startTime: '',
                endTime: ''
            },
            commodityClassOptions: [],
            purchaseOptions: ['已交全款', '已交定金', '已交尾款'],
            userOrderList: [],
            userOrderTotal: null,
            userOrderColumn: [{
                label: '下单时间',
                prop: 'orderTime',
                width: 180
            },{
                label: '姓名',
                prop: 'name'
            },{
                label: '电话数据',
                prop: 'tel',
                width: 130
            },{
                label: '订单归属',
                prop: 'orderUserName'
            },{
                label: '下单平台',
                prop: 'school'
            },{
                label: '商品班型',
                prop: 'commodityClass',
                width: 180
            },{
                label: '累付金额',
                prop: 'sumMoney'
            },{
                label: '购买状态',
                prop: 'purchaseStatus'
            },
            ],
            payDetailVisible: false,
            orderDetail: {},
            paymentRecordColumn: [
                {
                    label: '支付时间', prop: 'payTime', width: 120, formatter: (row)=> {
                        return row.payTime ? timestampToTime(Number(row.payTime)*1000) : '--'
                    }
                },
                {
                    label: '订单类型', prop: 'orderType'
                },
                {
                    label: '支付方式', prop: 'payTypeName',
                },
                {
                    label: '支付金额', prop: 'moneyPaid', formatter: (row) => {
                        return `￥${row.moneyPaid}`
                    }
                },
                {
                    label: '订单号', prop: 'orderNo', width: 120
                }
            ]
        }
    },
    components: {
        Start, CustomerNotes
    },
    created() {
        const uuid = localStorage.getItem('userUuid');
        this.form.userUuid = uuid;
        this.orderCallDataList();
        const initOptions = localStorage.getItem('initOptions');
        this.initOptions = JSON.parse(initOptions);
        this.jqStart = browserfly.noConflict();
    },
    methods: {
        parsePurchase(row){
            return this.purchaseOptions[row.purchaseStatus]
        },
        tabChange(tab){
            if(tab.index){
               this.getUserOrderList();
                this.initCommodityClass() 
            }else{
                this.orderCallDataList();
            }
        },
        initCommodityClass(){
            this.$smoke_post(getGoodsList, {itemId: 15, schoolName: 'jhwx'}).then(res => {
                if(res.code == 200){
                    this.commodityClassOptions = res.data
                }
            })
        },
        changeTime(val){
            this.orderForm.startTime = val[0]
            this.orderForm.endTime = val[1]
        },
        getUserOrderList(){
            this.$smoke_post(userOrderDataList, this.orderForm).then(res => {
                if(res.code == 200){
                    res.data.list.map(sll => {
                        sll.orderTime = timestampToTime(Number(sll.orderTime));
                        sll.purchaseStatus = this.purchaseOptions[sll.purchaseStatus]
                    })
                    this.userOrderList = res.data.list
                    this.userOrderTotal = res.data.total
                }
            })
        },
        payDetail(row){
            this.payDetailVisible = true
            this.$smoke_post(getOrderPayRecord, {orderId: row.orderId, schoolName: row.schoolId}).then(res =>{
                if(res.code == 200){
                    this.orderDetail = res.data
                }
            })
        },
        handleOrderSizeChange(size){
            this.orderForm.pageSize = size
        },
        handleOrderCurrentChange(page){
            this.orderForm.currentPage = page
        },
        handleCurrentChange(index) {
            this.form.currentPage = index;
            this.getClueDataAll();
        },
        handleSizeChange(index) {
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
        orderCallDataList() {
            this.fullscreenLoading = true;
            this.drawer = false;
            this.$smoke_post(orderCallDataList, this.form).then(res => {
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
                if(res.code == 200) {
                    this.$message({
                        type: 'success',
                        message: '释放数据成功'
                    })
                    this.orderCallDataList();
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
        .show-pay-detail{
            .el-row{
                margin-bottom: 20px;
                .col-label{
                    width: 120px;
                    text-align: right;
                }
            }
            .line{
                border-bottom: 1px solid #ccc;
                width: 100%;
                display: block;
                height: 1px;
            }
        }
        
    }
</style>