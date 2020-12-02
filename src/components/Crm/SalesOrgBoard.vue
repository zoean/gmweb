<template>
    <el-main class="index-main">

        <div class="people-title">目标完成情况</div>

        <div class="board-target" v-loading="loadingNum">

            <div class="target-two">

                <div style="padding: 10px 20px;">
                    <el-image style="width: 22px; height: 22px" :src="require('../../assets/images/board_date.png')"></el-image>
                    <span style="position: relative; top: -5px; left: 10px;">日目标</span>
                </div>

                <div style="display: flex; justify-content: space-between; text-align: center;">
                    <div style="width: calc(100% / 3);">
                        <p style="font-size: 28px; color: #409EFF;">{{saleAimsForm.aims}}</p>
                        <p style="font-size: 12px; color: #999999;">目标（万元）</p>
                    </div>
                    <div style="width: calc(100% / 3);">
                        <p style="font-size: 28px; color: #333333;">{{saleAimsForm.entry}}</p>
                        <p style="font-size: 12px; color: #999999;">完成（万元）</p>
                    </div>
                    <div style="width: calc(100% / 3);">
                        <p style="font-size: 28px; color: #333333;">{{saleAimsForm.aims_entry}}</p>
                        <p style="font-size: 12px; color: #999999;">未完成（万元）</p>
                    </div>
                </div>

                <el-progress :stroke-width="20" :percentage="saleAimsForm.aims_entry_lv > 100 ? 100 : saleAimsForm.aims_entry_lv" style="width: 80%; margin: 24px auto;"></el-progress>

            </div>

            <div class="target-two">
                
                <div style="padding: 10px 20px;">
                    <el-image style="width: 22px; height: 22px" :src="require('../../assets/images/board_month.png')"></el-image>
                    <span style="position: relative; top: -5px; left: 10px;">月目标</span>
                </div>

                <div style="display: flex; justify-content: space-between; text-align: center;">
                    <div style="width: calc(100% / 3);">
                        <p style="font-size: 28px; color: #409EFF;">{{saleAimsForm.monthAims}}</p>
                        <p style="font-size: 12px; color: #999999;">目标（万元）</p>
                    </div>
                    <div style="width: calc(100% / 3);">
                        <p style="font-size: 28px; color: #333333;">{{saleAimsForm.monthEntry}}</p>
                        <p style="font-size: 12px; color: #999999;">完成（万元）</p>
                    </div>
                    <div style="width: calc(100% / 3);">
                        <p style="font-size: 28px; color: #333333;">{{saleAimsForm.monthAims_monthEntry}}</p>
                        <p style="font-size: 12px; color: #999999;">未完成（万元）</p>
                    </div>
                </div>

                <el-progress :stroke-width="20" :percentage="saleAimsForm.monthAims_monthEntry_lv > 100 ? 100 : saleAimsForm.monthAims_monthEntry_lv" style="width: 80%; margin: 24px auto;"></el-progress>

            </div>

        </div>

        <div class="people-title">基本情况</div>

        <div class="board-details" v-loading="fullscreenLoadingBoard">

            <div class="target-four">
                <li>
                    <img class="right_item item_img" :src="require('../../assets/images/board_all.png')" alt=""/>
                    <span class="left_item">今日流水 (￥)</span>
                </li>
                <div style="font-size: 28px; color: #333333; margin-top: 6px;">{{dataJson.todayEntry}}</div>
                <div style="height: 42px; background: #F7F9FA; padding-top: 12px; border:1px solid rgba(233,233,233,1); border-left: none; border-right: none; position: absolute; width: 100%; bottom: 0;">
                    <div style="width: 50%; display: inline-block; border-right: 1px solid #E9E9E9;">本周 {{dataJson.thisWeekEntry}}</div>
                    <div style="width: 50%; display: inline-block;">本月 {{dataJson.thisMonthEntry}}</div>
                </div>
            </div>

            <div class="target-four">
                <li>
                    <img class="right_item item_img" :src="require('../../assets/images/board_1.png')" alt=""/>
                    <span class="left_item">今日人均首咨</span>
                </li>
                <div style="font-size: 28px; color: #333333; margin-top: 6px;">{{dataJson.todayFirstAverage}}</div>
                <div style="height: 42px; background: #F7F9FA; padding-top: 12px; border:1px solid rgba(233,233,233,1); border-left: none; border-right: none; position: absolute; width: 100%; bottom: 0;">
                    <div style="width: 30%; display: inline-block; border-right: 1px solid #E9E9E9;">人均机会 {{dataJson.todayChanceAverage}}</div>
                    <div style="width: 70%; display: inline-block;">人均回访(2-3天/3天以上) {{dataJson.todayReturnVisitAverage1}} / {{dataJson.todayReturnVisitAverage2}}</div>
                </div>
            </div>

            <div class="target-four">
                <li>
                    <img class="right_item item_img" :src="require('../../assets/images/board_2.png')" alt=""/>
                    <span class="left_item">高意向率</span>
                </li>
                <div style="font-size: 28px; color: #333333; margin-top: 6px;">{{dataJson.highIntentionNum_thisDayFirstCon}}</div>
                <div style="height: 42px; background: #F7F9FA; padding-top: 12px; border:1px solid rgba(233,233,233,1); border-left: none; border-right: none; position: absolute; width: 100%; bottom: 0;">
                    <div style="width: 50%; display: inline-block; border-right: 1px solid #E9E9E9;">本周 {{dataJson.weekHighIntention_thisWeekFirstCon}}</div>
                    <div style="width: 50%; display: inline-block;">本月 {{dataJson.thisMonthHighIntention_thisMonthFirstCon}}</div>
                </div>
            </div>

            <div class="target-four">
                <li>
                    <img class="right_item item_img" :src="require('../../assets/images/board_3.png')" alt=""/>
                    <span class="left_item">出勤/通话人数</span>
                </li>
                <div style="font-size: 28px; color: #333333; margin-top: 6px;">{{dataJson.attendanceNum}}/{{dataJson.callUserNum}}</div>
                <div style="height: 42px; background: #F7F9FA; padding-top: 12px; border:1px solid rgba(233,233,233,1); border-left: none; border-right: none; position: absolute; width: 100%; bottom: 0;">
                    <div style="width: 50%; display: inline-block; border-right: 1px solid #E9E9E9;">人均拨打 {{dataJson.userCallAverageNum}}</div>
                    <div style="width: 50%; display: inline-block;">人均时长 {{dataJson.todayTalkAverageTime}}</div>
                </div>
            </div>

        </div>

        <div class="call-detail">

            <div class="people-title">工作明细</div>
            <el-row class="people-screen" style="margin-top: 10px;">

                <el-col :span="4">

                    <el-date-picker
                        style="width: 90%;"
                        size="small"
                        v-model="timeDateWork"
                        type="date"
                        value-format='timestamp'
                        :picker-options="pickerOptions"
                        @change="timeChangeWork"
                        placeholder="请选择日期">
                    </el-date-picker>

                </el-col>

                <el-col :span="4">

                    <el-button type="primary" @click="salesBoardClickWork" size="small">查 询</el-button>

                </el-col>

                <el-col :span="16">
                
                    <el-button @click="salesOrgBoardDetailsClickWork" style="float:right;" plain size="small">详 情</el-button>
    
                </el-col>

            </el-row>

            <el-table
                :data="listWork"
                ref="tableSelect"
                v-loading="fullscreenLoadingWork"
                style="width: 100%; padding: 0 20px 20px 20px;">

                <el-table-column
                  :prop="item.prop"
                  :label="item.label"
                  :min-width="item.width"
                  v-for="(item, index) in columnListWork"
                  :key="index"
                  >

                </el-table-column>

            </el-table>
        </div>

        <div class="call-detail" style="margin-top: 10px;">
            
            <div class="people-title">通话明细</div>
    
            <el-row class="people-screen">
            
                <el-col :span="4">
                    
                    <el-date-picker
                        style="width: 90%;"
                        size="small"
                        v-model="timeDate"
                        type="date"
                        value-format='timestamp'
                        :picker-options="pickerOptions"
                        @change="timeChange"
                        placeholder="请选择日期">
                    </el-date-picker>
    
                </el-col>
    
                <el-col :span="4">
                
                    <el-button type="primary" @click="salesOrgBoardClick" size="small">查 询</el-button>
    
                </el-col>
    
                <el-col :span="16">
                
                    <el-button @click="salesOrgBoardDetailsClick" style="float:right;" plain size="small">详 情</el-button>
    
                </el-col>
    
            </el-row>
    
            <el-table
                :data="list"
                ref="tableSelect"
                v-loading="fullscreenLoading"
                style="width: 100%; padding: 0 20px 20px 20px; margin-bottom: 15px;">
                
                <el-table-column
                  :prop="item.prop"
                  :label="item.label"
                  :min-width="item.width"
                  v-for="(item, index) in columnList"
                  :key="index"
                  >
    
                </el-table-column>
    
            </el-table>

        </div>

        <SalesOrgBoardDetails 
            v-if="boardFlag"
            @changeBoardFlag="changeBoardFlag"
            :boardFlag.sync='boardFlag'
        >
        </SalesOrgBoardDetails>

        <SalesOrgBoardDetailsWork 
            v-if="boardWorkFlag"
            @changeBoardWorkFlag="changeBoardWorkFlag"
            :boardWorkFlag.sync='boardWorkFlag'
        >
        </SalesOrgBoardDetailsWork>
        
    </el-main>
</template>

<script>
import { 
    orgDayWork,
    orgTodayWork,
    orgSaleAims,
    orgWorkDetail
} from '../../request/api';
import {  } from '../../assets/js/data';
import { timeReturn } from '../../assets/js/common';
import SalesOrgBoardDetails from '@/components/Share/SalesOrgBoardDetails';
import SalesOrgBoardDetailsWork from '@/components/Share/SalesOrgBoardDetailsWork';
export default {
    name: 'salesOrgBoard',
    components: {
        SalesOrgBoardDetails, SalesOrgBoardDetailsWork
    },
    data() {
        return {
            form: {
                time: '',
            },
            workForm: {
                time: '',
            },
            list: [],
            listWork: [],
            totalFlag: false,
            columnList: [
                { 'prop': 'heji', 'label': '' },
                { 'prop': 'callTime', 'label': '总通话时长', width: 120 },
                { 'prop': 'callFirstNum', 'label': '首咨总次数', width: 120 },
                { 'prop': 'firstConTime', 'label': '首咨总时长', width: 120 },
                { 'prop': 'callFirstNum1', 'label': '2-3天数据总次数', width: 120 },
                { 'prop': 'daysTime1', 'label': '2-3天数据总时长', width: 120 },
                { 'prop': 'callFirstNum2', 'label': '3天以上数据总次数', width: 140 },
                { 'prop': 'daysTime2', 'label': '3天以上数据总时长', width: 140 },
                { 'prop': 'callOpenStuNum', 'label': '接通人数', width: 120 },
                { 'prop': 'callOpenLv', 'label': '接通率', width: 120 },
            ],
            columnListWork: [
                { 'prop': 'totalFirstNum', 'label': '总首咨数' },
                { 'prop': 'todayFirstNum', 'label': '今日首咨' },
                { 'prop': 'todayChanceNum', 'label': '机会人数' },
                { 'prop': 'todayrvNum', 'label': '回访人数' },
                { 'prop': 'todayRvNum1', 'label': '2-3天数据回访', width: 120},
                { 'prop': 'todayRvNum2', 'label': '3天以上数据回访', width: 120},
                { 'prop': 'cjNum', 'label': '报名' },
                { 'prop': 'todayTotalMoney', 'label': '今日总流水' },
                { 'prop': 'todayTotalMoney1', 'label': '1-3天数据流水', width: 120},
                { 'prop': 'todayTotalMoney2', 'label': '3天以上数据流水', width: 120},
                { 'prop': 'totalARPU', 'label': 'ARPU' },
                { 'prop': 'refund', 'label': '退费' },
                { 'prop': 'performance', 'label': '业绩', width: 120},
            ],
            fullscreenLoading: false,
            fullscreenLoadingWork: false,
            fullscreenLoadingBoard: false,
            timeDate: '',
            timeDateWork: '',
            pickerOptions: {
                disabledDate(time) {
                  return time.getTime() > Date.now();
                },
                shortcuts: [{
                  text: '今天',
                  onClick(picker) {
                    const date = new Date(new Date(new Date().toLocaleDateString()).getTime());
                    date.setTime(date.getTime());
                    picker.$emit('pick', date);
                  }
                }, {
                  text: '昨天',
                  onClick(picker) {
                    const date = new Date(new Date(new Date().toLocaleDateString()).getTime());
                    date.setTime(date.getTime() - 3600 * 1000 * 24);
                    picker.$emit('pick', date);
                  }
                }, {
                  text: '前天',
                  onClick(picker) {
                    const date = new Date(new Date(new Date().toLocaleDateString()).getTime());
                    date.setTime(date.getTime() - 3600 * 1000 * 24 * 2);
                    picker.$emit('pick', date);
                  }
                }, {
                  text: '2天前',
                  onClick(picker) {
                    const date = new Date(new Date(new Date().toLocaleDateString()).getTime());
                    date.setTime(date.getTime() - 3600 * 1000 * 24 * 3);
                    picker.$emit('pick', date);
                  }
                }, {
                  text: '3天前',
                  onClick(picker) {
                    const date = new Date(new Date(new Date().toLocaleDateString()).getTime());
                    date.setTime(date.getTime() - 3600 * 1000 * 24 * 4);
                    picker.$emit('pick', date);
                  }
                }]
            },
            dataJson: {},
            boardFlag: false,
            boardWorkFlag: false,
            saleAimsForm: {
                aims: '',
                entry: '',
                aims_entry: '',
                aims_entry_lv: '',
                monthAims: '',
                monthEntry: '',
                monthAims_monthEntry: '',
                monthAims_monthEntry_lv: '',
            },
            loadingNum: false,
        }
    },
    created() {
        this.orgTodayWork();
        this.orgSaleAims();
    },
    methods: {
        orgWorkDetail() {
            let arr = [];
            this.fullscreenLoadingWork = true;
            this.$smoke_post(orgWorkDetail, this.workForm).then(res => {
                if(res.code == 200) {
                    setTimeout(() => {
                        this.fullscreenLoadingWork = false;
                        arr.push(res.data);
                        arr.map(sll => {
                            if(sll.cjAllNum == 0){
                                sll.totalARPU = 0;
                            }else{
                                sll.totalARPU = (sll.cjAllMoney / sll.cjAllNum).toFixed(2);
                            }
                        })
                        this.listWork = arr;
                    }, 300);
                }else{
                    setTimeout(() => {
                        this.fullscreenLoadingWork = false;
                        this.$message({
                            type: 'error',
                            message: res.msg
                        })
                    }, 300)
                }
            })
        },
        orgSaleAims() {
            this.loadingNum = true;
            this.$smoke_get(orgSaleAims, {}).then(res => {
                if(res.code == 200) {
                    setTimeout(() => {
                        this.loadingNum = false;
                        this.saleAimsForm.aims = (res.data.aims / 10000).toFixed(2);
                        this.saleAimsForm.entry = (res.data.entry / 10000).toFixed(2);
                        if(res.data.entry > res.data.aims) {
                            this.saleAimsForm.aims_entry = (0).toFixed(2);
                        }else{
                            this.saleAimsForm.aims_entry = ((res.data.aims - res.data.entry) / 10000).toFixed(2); 
                        }
                        if(res.data.aims != 0) {
                            this.saleAimsForm.aims_entry_lv = ((res.data.entry / res.data.aims) * 100).toFixed(2);
                        }else{
                            this.saleAimsForm.aims_entry_lv = (0).toFixed(2);
                        }
                        this.saleAimsForm.monthAims = (res.data.monthAims / 10000).toFixed(2);
                        this.saleAimsForm.monthEntry = (res.data.monthEntry / 10000).toFixed(2);
                        if(res.data.monthEntry > res.data.monthAims) {
                            this.saleAimsForm.monthAims_monthEntry = (0).toFixed(2);
                        }else{
                            this.saleAimsForm.monthAims_monthEntry = ((res.data.monthAims - res.data.monthEntry) / 10000).toFixed(2); 
                        }
                        if(res.data.monthAims != 0) {
                            this.saleAimsForm.monthAims_monthEntry_lv = ((res.data.monthEntry / res.data.monthAims) * 100).toFixed(2);
                        }else{
                            this.saleAimsForm.monthAims_monthEntry_lv = (0).toFixed(2);
                        }
                    }, 300);
                }else{
                    setTimeout(() => {
                        this.loadingNum = false;
                        this.$message({
                            type: 'error',
                            message: res.msg
                        })
                    }, 300)
                }
            })
        },
        changeBoardFlag(val){
            this.boardFlag = val;
        },
        changeBoardWorkFlag(val){
            this.boardWorkFlag = val;
        },
        salesOrgBoardDetailsClick() {
            this.boardFlag = true;
        },
        salesOrgBoardDetailsClickWork() {
            this.boardWorkFlag = true;
        },
        orgTodayWork() {
            this.fullscreenLoadingBoard = true;
            this.$smoke_get(orgTodayWork, {}).then(res => {
                if(res.code == 200) {
                    setTimeout(() => {
                        this.fullscreenLoadingBoard = false;
                        res.data.todayTalkAverageTime = timeReturn(res.data.todayTalkAverageTime);
                        if(res.data.thisDayFirstCon == 0) {
                            res.data.highIntentionNum_thisDayFirstCon = 0 + '%';
                        }else{
                            res.data.highIntentionNum_thisDayFirstCon = ((res.data.highIntentionNum / res.data.thisDayFirstCon) * 100).toFixed(2) + '%';
                        }
                        if(res.data.thisWeekFirstCon == 0) {
                            res.data.weekHighIntention_thisWeekFirstCon = 0 + '%';
                        }else{
                            res.data.weekHighIntention_thisWeekFirstCon = ((res.data.weekHighIntention / res.data.thisWeekFirstCon) * 100).toFixed(2) + '%';
                        }
                        if(res.data.thisMonthFirstCon == 0) {
                            res.data.thisMonthHighIntention_thisMonthFirstCon = 0 + '%';
                        }else{
                            res.data.thisMonthHighIntention_thisMonthFirstCon = ((res.data.thisMonthHighIntention / res.data.thisMonthFirstCon) * 100).toFixed(2) + '%';
                        }
                        res.data.todayEntry = res.data.todayEntry.toFixed(2);
                        res.data.thisWeekEntry = res.data.thisWeekEntry.toFixed(2);
                        res.data.thisMonthEntry = res.data.thisMonthEntry.toFixed(2);
                        this.dataJson = res.data;
                    }, 300);
                }else {
                    setTimeout(() => {
                        this.fullscreenLoadingBoard = false;
                        this.$message({
                            type: 'error',
                            message: res.msg
                        })
                    }, 300)
                }
            })
        },
        timeChange() {
            this.form.time = this.timeDate;
        },
        timeChangeWork() {
            this.workForm.time = this.timeDateWork;
        },
        salesOrgBoardClick() {
            if(this.form.time){
                this.orgDayWork();
            }else{
                this.$message({
                    type: 'error',
                    message: '请您先选择查询日期'
                })
            }
        },
        salesBoardClickWork() {
            if(this.workForm.time){
                this.orgWorkDetail();
            }else{
                this.$message({
                    type: 'error',
                    message: '请您先选择查询日期'
                })
            }
        },
        orgDayWork() {
            let arr = [];
            this.$smoke_post(orgDayWork, this.form).then(res => {
                if(res.code == 200) {
                    setTimeout(() => {
                        this.fullscreenLoading = false;
                        res.data.heji = '合计';
                        res.data.firstConTime = timeReturn(res.data.firstConTime);
                        res.data.callTime = timeReturn(res.data.callTime);
                        res.data.daysTime1 = timeReturn(res.data.daysTime1);
                        res.data.daysTime2 = timeReturn(res.data.daysTime2);
                        if(res.data.callStuNum == 0) {
                            res.data.callOpenLv = 0 + '%';
                        }else{
                            res.data.callOpenLv = ((res.data.callOpenStuNum / res.data.callStuNum) * 100).toFixed(2) + '%';
                        }
                        arr.push(res.data);
                        this.list = arr;
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
        }
    },
    mounted() {
        
    }
}
</script>

<style lang="less" scoped>
    .index-main{
        margin-top: 30px;
        overflow-y: scroll;
        padding: 0;
        background-color: #fff;
        .people-title{
            width: 100%;
            height: 40px;
            line-height: 40px;
            font-size: 15px;
            background: #fff;
            color: #333333;
            padding-left: 16px;
            border: 1px solid #dddddd;
            border-bottom: none;
            background: #F1F1F1;
        }
        .screen-li{
            width: 90%;
        }
        .board-target{
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            height: 170px;
            border: 1px solid #ddd;
            .target-two{
                height: 100%;
                width: 50%;
                background: #fff;
                &:nth-of-type(1){
                    border-right: 1px solid #dddddd;
                }
            }
        }
        .board-details{
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            height: 146px;
            border: 1px solid #ddd;
            border-right: none;
            .target-four{
                height: 146px;
                width: 25%;
                background: #fff;
                text-align: center;
                padding-top: 10px;
                position: relative;
                border-right: 1px solid #dddddd;
                &:last-of-type{
                    border-right: none !important;
                }
                .left_item {
                    height: 100%;
                    margin-left: 8px;
                    display: inline-block;
                    box-sizing: border-box;
                    vertical-align: middle; }                  

                .right_item {
                    height: 100%;
                    display: inline-block;
                    box-sizing: border-box;
                    vertical-align: middle; }                  

                .item_img{
                    width: 20px;
                    height: 20px; }                

                li {
                    width: 100%;
                    vertical-align: middle;
                    box-sizing: border-box;
                    margin-top: 10px;
                    display: block; }
            }
        }
        .call-detail{
            border: 1px solid #ddd;
            border-bottom: none;
            .people-title{
                border: none;
                border-bottom: 1px solid #ddd;
            }
        }
    }
    .people-screen{
        margin: 10px 20px;
        .screen-li{
            width: 90%;
        }
    }
    .timeData /deep/ .el-table .cell{
        text-align: center !important;
    }
</style>