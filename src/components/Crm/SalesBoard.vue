<template>
    <el-main class="index-main">

        <div class="people-title"><span class="kanban_dian"></span>目标完成情况</div>

        <div class="board-target" v-loading="loadingNum">

            <div class="target-two">

                <div style="padding: 10px 20px;">
                    <el-image style="width: 22px; height: 22px" :src="require('../../assets/images/board_date.png')"></el-image>
                    <span style="position: relative; top: -5px; left: 10px;">日目标</span>
                </div>

                <div style="display: flex; justify-content: space-between; text-align: center;">
                    <div style="width: calc(100% / 3);">
                        <p style="font-size: 28px; color: #409EFF;">{{saleAimsForm.aims}}</p>
                        <p style="font-size: 12px; color: #666666;">目标（万元）</p>
                    </div>
                    <div style="width: calc(100% / 3);">
                        <p style="font-size: 28px; color: #333333;">{{saleAimsForm.entry}}</p>
                        <p style="font-size: 12px; color: #666666;">完成（万元）</p>
                    </div>
                    <div style="width: calc(100% / 3);">
                        <p style="font-size: 28px; color: #333333;">{{saleAimsForm.aims_entry}}</p>
                        <p style="font-size: 12px; color: #666666;">未完成（万元）</p>
                    </div>
                </div>

                <el-progress :text-inside="true" :stroke-width="24" :percentage="Number(saleAimsForm.aims_entry_lv)" style="width: 80%; margin: 18px auto;"></el-progress>

            </div>

            <div class="target-two">
                
                <div style="padding: 10px 20px;">
                    <el-image style="width: 22px; height: 22px" :src="require('../../assets/images/board_month.png')"></el-image>
                    <span style="position: relative; top: -5px; left: 10px;">月目标</span>
                </div>

                <div style="display: flex; justify-content: space-between; text-align: center;">
                    <div style="width: calc(100% / 3);">
                        <p style="font-size: 28px; color: #409EFF;">{{saleAimsForm.monthAims}}</p>
                        <p style="font-size: 12px; color: #666666;">目标（万元）</p>
                    </div>
                    <div style="width: calc(100% / 3);">
                        <p style="font-size: 28px; color: #333333;">{{saleAimsForm.monthEntry}}</p>
                        <p style="font-size: 12px; color: #666666;">完成（万元）</p>
                    </div>
                    <div style="width: calc(100% / 3);">
                        <p style="font-size: 28px; color: #333333;">{{saleAimsForm.monthAims_monthEntry}}</p>
                        <p style="font-size: 12px; color: #666666;">未完成（万元）</p>
                    </div>
                </div>

                <el-progress :text-inside="true" :stroke-width="24" :percentage="Number(saleAimsForm.monthAims_monthEntry_lv)" style="width: 80%; margin: 18px auto;"></el-progress>

            </div>

        </div>

        <div class="people-title"><span class="kanban_dian"></span>基本情况</div>

        <div class="board-details" v-loading="fullscreenLoadingBoard">

            <div class="target-four">
                <div>
                    <el-image style="width: 26px; height: 26px" :src="require('../../assets/images/board_all.png')"></el-image>
                    <span style="position: relative; top: -7px; left: 8px;">今日流水 (￥)</span>
                </div>
                <div style="font-size: 28px; color: #333333; margin-top: 6px;">{{dataJson.todayEntry}}</div>
                <div style="height: 42px; background: #F7F9FA; padding-top: 12px; border:1px solid rgba(233,233,233,1); border-left: none; border-right: none; position: absolute; width: 100%; bottom: 0;">
                    <div style="width: 50%; display: inline-block; border-right: 1px solid #E9E9E9;">本周 {{dataJson.thisWeekEntry}}</div>
                    <div style="width: 50%; display: inline-block;">本月 {{dataJson.thisMonthEntry}}</div>
                </div>
            </div>

            <div class="target-four">
                <div>
                    <el-image style="width: 26px; height: 26px" :src="require('../../assets/images/board_1.png')"></el-image>
                    <span style="position: relative; top: -7px; left: 8px;">今日首咨/机会</span>
                </div>
                <div style="font-size: 28px; color: #333333; margin-top: 6px;">{{dataJson.todayFirstCon}}/{{dataJson.todayChance}}</div>
                <div style="height: 42px; background: #F7F9FA; padding-top: 12px; border:1px solid rgba(233,233,233,1); border-left: none; border-right: none; position: absolute; width: 100%; bottom: 0;">
                    <div style="width: 50%; display: inline-block; border-right: 1px solid #E9E9E9;">本周 {{dataJson.thisWeekFirstCon}} / {{dataJson.thisWeekChance}}</div>
                    <div style="width: 50%; display: inline-block;">本月 {{dataJson.thisMonthFirstCon}} / {{dataJson.thisMonthChance}}</div>
                </div>
            </div>

            <div class="target-four">
                <div>
                    <el-image style="width: 26px; height: 26px" :src="require('../../assets/images/board_2.png')"></el-image>
                    <span style="position: relative; top: -7px; left: 8px;">今日回访（2-3天数据/3天以上数据）</span>
                </div>
                <div style="font-size: 28px; color: #333333; margin-top: 6px;">{{dataJson.todayReturnVisit1}}/{{dataJson.todayReturnVisit2}}</div>
                <div style="height: 42px; background: #F7F9FA; padding-top: 12px; border:1px solid rgba(233,233,233,1); border-left: none; border-right: none; position: absolute; width: 100%; bottom: 0;">
                    <div style="width: 50%; display: inline-block; border-right: 1px solid #E9E9E9;">本周 {{dataJson.thisWeekReturnVisit1}} / {{dataJson.thisWeekReturnVisit2}}</div>
                    <div style="width: 50%; display: inline-block;">本月 {{dataJson.thisMonthReturnVisit1}} / {{dataJson.thisMonthReturnVisit2}}</div>
                </div>
            </div>

            <div class="target-four">
                <div>
                    <el-image style="width: 26px; height: 26px" :src="require('../../assets/images/board_3.png')"></el-image>
                    <span style="position: relative; top: -7px; left: 8px;">今日通话时长</span>
                </div>
                <div style="font-size: 28px; color: #333333; margin-top: 6px;">{{dataJson.todayTalkTime}}</div>
                <div style="height: 42px; background: #F7F9FA; padding-top: 12px; border:1px solid rgba(233,233,233,1); border-left: none; border-right: none; position: absolute; width: 100%; bottom: 0;">
                    <div style="width: 50%; display: inline-block; border-right: 1px solid #E9E9E9;">本周平均时长 {{dataJson.thisWeekTalkTime}}</div>
                    <div style="width: 50%; display: inline-block;">本月平均时长 {{dataJson.thisMonthTalkTime}}</div>
                </div>
            </div>

        </div>

        <div style="background: #fff;">

            <div class="people-title" style="border-bottom: 1px solid #F1F1F1;"><span class="kanban_dian"></span>通话明细</div>

            <el-row class="people-screen" style="margin-top: 10px;">

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

                    <el-button type="primary" @click="salesBoardClick" size="small">查 询</el-button>

                </el-col>

            </el-row>

            <el-table
                :data="list"
                ref="tableSelect"
                v-loading="fullscreenLoading"
                style="width: 100%; padding: 0 20px 20px 20px;">

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

    </el-main>
</template>

<script>
import { 
    dayWork,
    todayWork,
    saleAims
} from '../../request/api';
import {  } from '../../assets/js/data';
import { timeReturn } from '../../assets/js/common';
export default {
    name: 'salesBoard',
    data() {
        return {
            form: {
                time: '',
            },
            list: [],
            totalFlag: false,
            columnList: [
                { 'prop': 'callNum', 'label': '总通话个数' },
                { 'prop': 'callTime', 'label': '总通话时长', width: 120},
                { 'prop': 'aveTime', 'label': '平均通话时长', width: 120},
                { 'prop': 'firstConTime', 'label': '首咨总时长', width: 120},
                { 'prop': 'daysTime1', 'label': '2-3天数据总时长', width: 120 },
                { 'prop': 'daysTime2', 'label': '3天以上数据总时长', width: 120 },
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
        this.todayWork();
        this.saleAims();
    },
    methods: {
        saleAims() {
            this.loadingNum = true;
            this.$smoke_get(saleAims, {}).then(res => {
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
        todayWork() {
            this.fullscreenLoadingBoard = true;
            this.$smoke_get(todayWork, {}).then(res => {
                if(res.code == 200) {
                    setTimeout(() => {
                        this.fullscreenLoadingBoard = false;
                        res.data.todayTalkTime = timeReturn(res.data.todayTalkTime);
                        res.data.thisWeekTalkTime = timeReturn(res.data.thisWeekTalkTime);
                        res.data.thisMonthTalkTime = timeReturn(res.data.thisMonthTalkTime);
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
        salesBoardClick() {
            if(this.form.time){
                this.dayWork();
            }else{
                this.$message({
                    type: 'error',
                    message: '请您先选择查询日期'
                })
            }
        },
        dayWork() {
            let arr = [];
            this.fullscreenLoading = true;
            this.$smoke_post(dayWork, this.form).then(res => {
                if(res.code == 200) {
                    setTimeout(() => {
                        this.fullscreenLoading = false;
                        res.data.firstConTime = timeReturn(res.data.firstConTime);
                        res.data.callTime = timeReturn(res.data.callTime);
                        res.data.aveTime = timeReturn(res.data.aveTime);
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
            margin-bottom: 1px;
        }
        .screen-li{
            width: 90%;
        }
        .board-target{
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            height: 170px;
            .target-two{
                height: 100%;
                width: 50%;
                background: #fff;
                &:nth-of-type(1){
                    border-right: 1px solid #F1F1F1;
                }
            }
        }
        .board-details{
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            height: 146px;
            .target-four{
                height: 146px;
                width: 25%;
                background: #fff;
                text-align: center;
                padding-top: 10px;
                position: relative;
                border-right: 1px solid #F1F1F1;
                &:last-of-type{
                    border-right: none !important;
                }
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
    .el-main{
        padding: 0;
        background: #F1F1F1;
    }
</style>