<template>
    <el-main class="index-main">

        <div class="people-title">目标完成情况</div>

        <div class="board-target">

            <div class="target-two">

                <div style="padding: 20px;">
                    <el-image style="width: 22px; height: 22px" :src="require('../../assets/images/board_date.png')"></el-image>
                    <span style="position: relative; top: -5px; left: 10px;">日目标</span>
                </div>

                <div style="display: flex; justify-content: space-between; text-align: center;">
                    <div style="width: calc(100% / 3);">
                        <p style="font-size: 36px; color: #409EFF;">10</p>
                        <p style="font-size: 12px; color: #999999;">目标（万元）</p>
                    </div>
                    <div style="width: calc(100% / 3);">
                        <p style="font-size: 36px; color: #333333;">3</p>
                        <p style="font-size: 12px; color: #999999;">完成（万元）</p>
                    </div>
                    <div style="width: calc(100% / 3);">
                        <p style="font-size: 36px; color: #333333;">7</p>
                        <p style="font-size: 12px; color: #999999;">未完成（万元）</p>
                    </div>
                </div>

                <el-progress :text-inside="true" :stroke-width="24" :percentage="30" style="width: 80%; margin: 34px auto;"></el-progress>

            </div>

            <div class="target-two">
                
                <div style="padding: 20px;">
                    <el-image style="width: 22px; height: 22px" :src="require('../../assets/images/board_month.png')"></el-image>
                    <span style="position: relative; top: -5px; left: 10px;">月目标</span>
                </div>

                <div style="display: flex; justify-content: space-between; text-align: center;">
                    <div style="width: calc(100% / 3);">
                        <p style="font-size: 36px; color: #409EFF;">10</p>
                        <p style="font-size: 12px; color: #999999;">目标（万元）</p>
                    </div>
                    <div style="width: calc(100% / 3);">
                        <p style="font-size: 36px; color: #333333;">3</p>
                        <p style="font-size: 12px; color: #999999;">完成（万元）</p>
                    </div>
                    <div style="width: calc(100% / 3);">
                        <p style="font-size: 36px; color: #333333;">7</p>
                        <p style="font-size: 12px; color: #999999;">未完成（万元）</p>
                    </div>
                </div>

                <el-progress :text-inside="true" :stroke-width="24" :percentage="30" style="width: 80%; margin: 34px auto;"></el-progress>

            </div>

        </div>

        <div class="people-title">基本情况</div>

        <div class="board-details" v-loading="fullscreenLoadingBoard">

            <div class="target-four">
                <div>
                    <el-image style="width: 26px; height: 26px" :src="require('../../assets/images/board_all.png')"></el-image>
                    <span style="position: relative; top: -7px; left: 8px;">今日流水</span>
                </div>
                <div style="font-size: 36px; color: #333333; margin-top: 10px;">{{dataJson.todayEntry}}</div>
                <div style="height: 42px; background: #F7F9FA; padding-top: 12px; border:1px solid rgba(233,233,233,1); margin-top: 10px;">
                    <div style="width: 50%; display: inline-block; border-right: 1px solid #E9E9E9;">本周 {{dataJson.thisWeekEntry}}</div>
                    <div style="width: 50%; display: inline-block;">本月 {{dataJson.thisMonthEntry}}</div>
                </div>
            </div>

            <div class="target-four">
                <div>
                    <el-image style="width: 26px; height: 26px" :src="require('../../assets/images/board_1.png')"></el-image>
                    <span style="position: relative; top: -7px; left: 8px;">今日首咨/机会</span>
                </div>
                <div style="font-size: 36px; color: #333333; margin-top: 10px;">{{dataJson.todayFirstCon}}/{{dataJson.todayChance}}</div>
                <div style="height: 42px; background: #F7F9FA; padding-top: 12px; border:1px solid rgba(233,233,233,1); margin-top: 10px;">
                    <div style="width: 50%; display: inline-block; border-right: 1px solid #E9E9E9;">本周 {{dataJson.thisWeekFirstCon}}/{{dataJson.thisWeekChance}}</div>
                    <div style="width: 50%; display: inline-block;">本月 {{dataJson.thisMonthFirstCon}}/{{dataJson.thisMonthChance}}</div>
                </div>
            </div>

            <div class="target-four">
                <div>
                    <el-image style="width: 26px; height: 26px" :src="require('../../assets/images/board_2.png')"></el-image>
                    <span style="position: relative; top: -7px; left: 8px;">今日回访（2-3天数据/4-7天数据）</span>
                </div>
                <div style="font-size: 36px; color: #333333; margin-top: 10px;">{{dataJson.todayReturnVisit1}}/{{dataJson.todayReturnVisit2}}</div>
                <div style="height: 42px; background: #F7F9FA; padding-top: 12px; border:1px solid rgba(233,233,233,1); margin-top: 10px;">
                    <div style="width: 50%; display: inline-block; border-right: 1px solid #E9E9E9;">本周 {{dataJson.thisWeekReturnVisit1}}/{{dataJson.thisWeekReturnVisit2}}</div>
                    <div style="width: 50%; display: inline-block;">本月 {{dataJson.thisMonthReturnVisit1}}/{{dataJson.thisMonthReturnVisit2}}</div>
                </div>
            </div>

            <div class="target-four">
                <div>
                    <el-image style="width: 26px; height: 26px" :src="require('../../assets/images/board_3.png')"></el-image>
                    <span style="position: relative; top: -7px; left: 8px;">今日通话时长</span>
                </div>
                <div style="font-size: 36px; color: #333333; margin-top: 10px;">{{dataJson.todayTalkTime}}</div>
                <div style="height: 42px; background: #F7F9FA; padding-top: 12px; border:1px solid rgba(233,233,233,1); margin-top: 10px;">
                    <div style="width: 50%; display: inline-block; border-right: 1px solid #E9E9E9;">本周平均时长 {{dataJson.thisWeekTalkTime}}</div>
                    <div style="width: 50%; display: inline-block;">本月平均时长 {{dataJson.thisMonthTalkTime}}</div>
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
        
    </el-main>
</template>

<script>
import { 
    orgDayWork,
    todayWork
} from '../../request/api';
import {  } from '../../assets/js/data';
import { timeReturn } from '../../assets/js/common';
export default {
    name: 'salesOrgBoard',
    data() {
        return {
            form: {
                time: '',
            },
            list: [],
            totalFlag: false,
            columnList: [
                { 'prop': 'heji', 'label': '' },
                { 'prop': 'callTime', 'label': '总通话时长' },
                { 'prop': 'callFirstNum', 'label': '首咨总次数', width: 120},
                { 'prop': 'firstConTime', 'label': '首咨总时长', width: 120},
                { 'prop': 'callFirstNum1', 'label': '2-3天数据总次数', width: 120},
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
        }
    },
    created() {
        this.todayWork();
    },
    methods: {
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
        background: #f7f7f7;
    }
</style>