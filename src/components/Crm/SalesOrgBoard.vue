<template>
    <el-main class="index-main">

        <div class="people-title">目标完成情况</div>

        <div class="board-target" v-loading="loadingNum">

            <div class="target-two">

                <div style="padding: 20px;">
                    <el-image style="width: 22px; height: 22px" :src="require('../../assets/images/board_date.png')"></el-image>
                    <span style="position: relative; top: -5px; left: 10px;">日目标</span>
                </div>

                <div style="display: flex; justify-content: space-between; text-align: center;">
                    <div style="width: calc(100% / 3);">
                        <p style="font-size: 36px; color: #409EFF;">{{saleAimsForm.aims}}</p>
                        <p style="font-size: 12px; color: #999999;">目标（万元）</p>
                    </div>
                    <div style="width: calc(100% / 3);">
                        <p style="font-size: 36px; color: #333333;">{{saleAimsForm.entry}}</p>
                        <p style="font-size: 12px; color: #999999;">完成（万元）</p>
                    </div>
                    <div style="width: calc(100% / 3);">
                        <p style="font-size: 36px; color: #333333;">{{saleAimsForm.aims_entry}}</p>
                        <p style="font-size: 12px; color: #999999;">未完成（万元）</p>
                    </div>
                </div>

                <el-progress :text-inside="true" :stroke-width="24" :percentage="Number(saleAimsForm.aims_entry_lv)" style="width: 80%; margin: 34px auto;"></el-progress>

            </div>

            <div class="target-two">
                
                <div style="padding: 20px;">
                    <el-image style="width: 22px; height: 22px" :src="require('../../assets/images/board_month.png')"></el-image>
                    <span style="position: relative; top: -5px; left: 10px;">月目标</span>
                </div>

                <div style="display: flex; justify-content: space-between; text-align: center;">
                    <div style="width: calc(100% / 3);">
                        <p style="font-size: 36px; color: #409EFF;">{{saleAimsForm.monthAims}}</p>
                        <p style="font-size: 12px; color: #999999;">目标（万元）</p>
                    </div>
                    <div style="width: calc(100% / 3);">
                        <p style="font-size: 36px; color: #333333;">{{saleAimsForm.monthEntry}}</p>
                        <p style="font-size: 12px; color: #999999;">完成（万元）</p>
                    </div>
                    <div style="width: calc(100% / 3);">
                        <p style="font-size: 36px; color: #333333;">{{saleAimsForm.monthAims_monthEntry}}</p>
                        <p style="font-size: 12px; color: #999999;">未完成（万元）</p>
                    </div>
                </div>

                <el-progress :text-inside="true" :stroke-width="24" :percentage="Number(saleAimsForm.monthAims_monthEntry_lv)" style="width: 80%; margin: 34px auto;"></el-progress>

            </div>

        </div>

        <div class="people-title">基本情况</div>

        <div class="board-details" v-loading="fullscreenLoadingBoard">

            <div class="target-four">
                <div>
                    <el-image style="width: 26px; height: 26px" :src="require('../../assets/images/board_all.png')"></el-image>
                    <span style="position: relative; top: -7px; left: 8px;">今日流水 (￥)</span>
                </div>
                <div style="font-size: 36px; color: #333333; margin-top: 10px;">{{dataJson.todayEntry}}</div>
                <div style="height: 42px; background: #F7F9FA; padding-top: 12px; border:1px solid rgba(233,233,233,1); position: absolute; width: 100%; bottom: 0;">
                    <div style="width: 50%; display: inline-block; border-right: 1px solid #E9E9E9;">本周 {{dataJson.thisWeekEntry}}</div>
                    <div style="width: 50%; display: inline-block;">本月 {{dataJson.thisMonthEntry}}</div>
                </div>
            </div>

            <div class="target-four">
                <div>
                    <el-image style="width: 26px; height: 26px" :src="require('../../assets/images/board_1.png')"></el-image>
                    <span style="position: relative; top: -7px; left: 8px;">今日人均首咨</span>
                </div>
                <div style="font-size: 36px; color: #333333; margin-top: 10px;">{{dataJson.todayFirstAverage}}</div>
                <div style="height: 42px; background: #F7F9FA; padding-top: 12px; border:1px solid rgba(233,233,233,1); position: absolute; width: 100%; bottom: 0;">
                    <div style="width: 30%; display: inline-block; border-right: 1px solid #E9E9E9;">人均机会 {{dataJson.todayChanceAverage}}</div>
                    <div style="width: 70%; display: inline-block;">人均回访(2-3天/3天以上) {{dataJson.todayReturnVisitAverage1}} / {{dataJson.todayReturnVisitAverage2}}</div>
                </div>
            </div>

            <div class="target-four">
                <div>
                    <el-image style="width: 26px; height: 26px" :src="require('../../assets/images/board_2.png')"></el-image>
                    <span style="position: relative; top: -7px; left: 8px;">高意向率</span>
                </div>
                <div style="font-size: 36px; color: #333333; margin-top: 10px;">{{dataJson.highIntentionNum_thisDayFirstCon}}</div>
                <div style="height: 42px; background: #F7F9FA; padding-top: 12px; border:1px solid rgba(233,233,233,1); position: absolute; width: 100%; bottom: 0;">
                    <div style="width: 50%; display: inline-block; border-right: 1px solid #E9E9E9;">本周 {{dataJson.weekHighIntention_thisWeekFirstCon}}</div>
                    <div style="width: 50%; display: inline-block;">本月 {{dataJson.thisMonthHighIntention_thisMonthFirstCon}}</div>
                </div>
            </div>

            <div class="target-four">
                <div>
                    <el-image style="width: 26px; height: 26px" :src="require('../../assets/images/board_3.png')"></el-image>
                    <span style="position: relative; top: -7px; left: 8px;">出勤/通话人数</span>
                </div>
                <div style="font-size: 36px; color: #333333; margin-top: 10px;">{{dataJson.attendanceNum}}/{{dataJson.callUserNum}}</div>
                <div style="height: 42px; background: #F7F9FA; padding-top: 12px; border:1px solid rgba(233,233,233,1); position: absolute; width: 100%; bottom: 0;">
                    <div style="width: 50%; display: inline-block; border-right: 1px solid #E9E9E9;">人均拨打 {{dataJson.userCallAverageNum}}</div>
                    <div style="width: 50%; display: inline-block;">人均时长 {{dataJson.todayTalkAverageTime}}</div>
                </div>
            </div>

        </div>

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
            style="width: 100%">
            
            <el-table-column
              :prop="item.prop"
              :label="item.label"
              :min-width="item.width"
              v-for="(item, index) in columnList"
              :key="index"
              >

            </el-table-column>

        </el-table>

        <SalesOrgBoardDetails 
            v-if="boardFlag"
            @changeBoardFlag="changeBoardFlag"
            :boardFlag.sync='boardFlag'
        >
        </SalesOrgBoardDetails>
        
    </el-main>
</template>

<script>
import { 
    orgDayWork,
    orgTodayWork,
    orgSaleAims
} from '../../request/api';
import {  } from '../../assets/js/data';
import { timeReturn } from '../../assets/js/common';
import SalesOrgBoardDetails from '@/components/Share/SalesOrgBoardDetails';
export default {
    name: 'salesOrgBoard',
    components: {
        SalesOrgBoardDetails
    },
    data() {
        return {
            form: {
                time: '',
            },
            list: [],
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
            fullscreenLoading: false,
            fullscreenLoadingBoard: false,
            timeDate: '',
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
        orgSaleAims() {
            this.loadingNum = true;
            this.$smoke_get(orgSaleAims, {}).then(res => {
                if(res.code == 200) {
                    setTimeout(() => {
                        this.loadingNum = false;
                        this.saleAimsForm.aims = (res.data.aims / 10000).toFixed(2);
                        this.saleAimsForm.entry = (res.data.entry / 10000).toFixed(2);
                        this.saleAimsForm.aims_entry = ((res.data.aims - res.data.entry) / 10000).toFixed(2);
                        this.saleAimsForm.aims_entry_lv = ((res.data.entry / res.data.aims) * 100).toFixed(2);
                        this.saleAimsForm.monthAims = (res.data.monthAims / 10000).toFixed(2);
                        this.saleAimsForm.monthEntry = (res.data.monthEntry / 10000).toFixed(2);
                        this.saleAimsForm.monthAims_monthEntry = ((res.data.monthAims - res.data.monthEntry) / 10000).toFixed(2);
                        this.saleAimsForm.monthAims_monthEntry_lv = ((res.data.monthEntry / res.data.monthAims) * 100).toFixed(2);
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
        salesOrgBoardDetailsClick() {
            this.boardFlag = true;
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
        .people-title{
            width: 100%;
            height: 40px;
            line-height: 40px;
            font-size: 15px;
            background: #fff;
            color: #333333;
            padding-left: 16px;
            margin-bottom: 16px;
        }
        .screen-li{
            width: 90%;
        }
        .board-target{
            display: flex;
            justify-content: space-between;
            margin-bottom: 16px;
            height: 224px;
            .target-two{
                height: 100%;
                width: 49.3%;
                background: #fff;
            }
        }
        .board-details{
            display: flex;
            justify-content: space-between;
            margin-bottom: 16px;
            height: 167px;
            .target-four{
                height: 167px;
                width: 24%;
                background: #fff;
                text-align: center;
                padding-top: 20px;
                position: relative;
            }
        }
    }
    .people-screen{
        margin-bottom: 16px;
        .screen-li{
            width: 90%;
        }
    }
    .timeData /deep/ .el-table .cell{
        text-align: center !important;
    }
    .el-main{
        padding: 0;
        background: #F1F1F1;
    }
</style>