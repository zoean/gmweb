<template>
    <div class="board">
        <el-dialog width="56%" title="通时明细" :visible.sync="boardFlag_" :before-close="handleClose">
          
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="组织列表" name="first">

                    <el-row class="people-screen">

                        <el-col :span="7">

                            <el-cascader
                                style="width: 90%;"
                                ref="cascader"
                                size="small"
                                placeholder="选择统计单元"
                                collapse-tags
                                :show-all-levels=false
                                :options="zuzhiOptions"
                                @change='handleZuzhiChange1'
                                :props="{ checkStrictly: true, label: 'name', value: 'uuid', children: 'list', multiple: true }"
                                clearable>
                            </el-cascader>

                        </el-col>

                        <el-col :span="7">

                            <el-date-picker
                                style="width: 90%;"
                                size="small"
                                v-model="timeDate1"
                                type="date"
                                value-format='timestamp'
                                :picker-options="pickerOptions"
                                @change="timeChange1"
                                placeholder="请选择日期">
                            </el-date-picker>

                        </el-col>

                        <el-col :span="4">
                        
                            <el-button type="primary" @click="salesOrgBoardClick" size="small">查 询</el-button>

                        </el-col>

                    </el-row>
                    
                    <el-table
                        :data="list1"
                        ref="tableSelect1"
                        v-loading="fullscreenLoading1"
                        style="width: 100%; margin-top: 16px;">

                        <el-table-column
                          :prop="item.prop"
                          :label="item.label"
                          :min-width="item.width"
                          v-for="(item, index) in columnList1"
                          :key="index"
                          >

                        </el-table-column>

                    </el-table>

                </el-tab-pane>
                <el-tab-pane label="人员列表" name="second">

                    <el-row class="people-screen">

                        <el-col :span="7">

                            <el-cascader
                                style="width: 90%;"
                                ref="cascader"
                                size="small"
                                placeholder="选择统计单元"
                                collapse-tags
                                :show-all-levels=false
                                :options="zuzhiOptions"
                                @change='handleZuzhiChange2'
                                :props="{ checkStrictly: true, label: 'name', value: 'uuid', children: 'list', multiple: true }"
                                clearable>
                            </el-cascader>

                        </el-col>

                        <el-col :span="7">

                            <el-date-picker
                                style="width: 90%;"
                                size="small"
                                v-model="timeDate2"
                                type="date"
                                value-format='timestamp'
                                :picker-options="pickerOptions"
                                @change="timeChange2"
                                placeholder="请选择日期">
                            </el-date-picker>

                        </el-col>

                        <el-col :span="4">
                        
                            <el-button type="primary" @click="salesPeopleBoardClick" size="small">查 询</el-button>

                        </el-col>

                    </el-row>
                    
                    <el-table
                        :data="list2"
                        ref="tableSelect2"
                        v-loading="fullscreenLoading2"
                        style="width: 100%; margin-top: 16px;">

                        <el-table-column
                          :prop="item.prop"
                          :label="item.label"
                          :min-width="item.width"
                          v-for="(item, index) in columnList2"
                          :key="index"
                          >

                        </el-table-column>

                    </el-table>

                </el-tab-pane>
            </el-tabs>
            
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="handleClose" size="small">关闭</el-button>
            </span>
            
        </el-dialog>

    </div>
</template>

<script>
import { 
    orgSaleDayWork,
    saleDataOrg,
    orgDayWorkSum
} from '../../request/api';
import { 
    timestampToTime, timeReturn
} from '../../assets/js/common';
import { 
    
} from '../../assets/js/data';
export default {
    name: 'salesOrgBoardDetails',
    props: {
        boardFlag: {
          type: Boolean,
          default: false
        },
    },
    data() {
        return {
            formPeople: {
                orgList: [],
                time: ''
            },
            formOrg: {
                orgList: [],
                time: ''
            },
            activeName: 'first',
            fullscreenLoading1: false,
            fullscreenLoading2: false,
            list1: [],
            list2: [],
            columnList1: [
                { 'prop': 'orgName', 'label': '统计单位', width: 120 },
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
            columnList2: [
                { 'prop': 'saleName', 'label': '统计单位', width: 120 },
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
            timeDate1: '',
            timeDate2: '',
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
            zuzhiOptions: [],
        }
    },
    created() {
        this.saleDataOrg();
    },
    methods: {
        handleZuzhiChange1(arr) {
            let brr = [];
            arr.map(res => {
                if(res.length == 1){
                    brr.push(res[0]);
                }else{
                    brr.push(res[res.length-1]);
                }
            })
            this.formOrg.orgList = brr;
        },
        timeChange1() {
            this.formOrg.time = this.timeDate1;
        },
        handleZuzhiChange2(arr) {
            let brr = [];
            arr.map(res => {
                if(res.length == 1){
                    brr.push(res[0]);
                }else{
                    brr.push(res[res.length-1]);
                }
            })
            this.formPeople.orgList = brr;
        },
        timeChange2() {
            this.formPeople.time = this.timeDate2;
        },
        saleDataOrg() {
            this.$smoke_get(saleDataOrg, {}).then(res => {
                if(res.code == 200) {
                    this.zuzhiOptions = res.data;
                }
            })
        },
        salesOrgBoardClick() {
            this.orgDayWorkSum();
        },
        salesPeopleBoardClick() {
            this.orgSaleDayWork();
        },
        handleClick(tab, event) {
            // if(tab.index == '0'){
                
            // }else{
                
            // }
        },
        handleClose() {
            this.$emit("changeBoardFlag", false)
        },
        orgSaleDayWork() {
            this.fullscreenLoading2 = true;
            this.$smoke_post(orgSaleDayWork, this.formPeople).then(res => {
                if(res.code == 200) {
                    setTimeout(() => {
                        this.fullscreenLoading2 = false;
                        res.data.list.map(sll => {
                            sll.firstConTime = timeReturn(sll.firstConTime);
                            sll.callTime = timeReturn(sll.callTime);
                            sll.daysTime1 = timeReturn(sll.daysTime1);
                            sll.daysTime2 = timeReturn(sll.daysTime2);
                            if(sll.callStuNum == 0) {
                                sll.callOpenLv = 0 + '%';
                            }else{
                                sll.callOpenLv = ((sll.callOpenStuNum / sll.callStuNum) * 100).toFixed(2) + '%';
                            }
                        })
                        this.list2 = res.data.list;
                    }, 300);
                }else{
                    setTimeout(() => {
                        this.fullscreenLoading2 = false;
                        this.$message({
                            type: 'error',
                            message: res.msg
                        })
                    }, 300)
                }
            })
        },
        orgDayWorkSum() {
            this.fullscreenLoading1 = true;
            this.$smoke_post(orgDayWorkSum, this.formOrg).then(res => {
                if(res.code == 200) {
                    setTimeout(() => {
                        this.fullscreenLoading1 = false;
                        res.data.list.map(sll => {
                            sll.firstConTime = timeReturn(sll.firstConTime);
                            sll.callTime = timeReturn(sll.callTime);
                            sll.daysTime1 = timeReturn(sll.daysTime1);
                            sll.daysTime2 = timeReturn(sll.daysTime2);
                            if(sll.callStuNum == 0) {
                                sll.callOpenLv = 0 + '%';
                            }else{
                                sll.callOpenLv = ((sll.callOpenStuNum / sll.callStuNum) * 100).toFixed(2) + '%';
                            }
                        })
                        this.list1 = res.data.list;
                    }, 300);
                }else{
                    setTimeout(() => {
                        this.fullscreenLoading1 = false;
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
        
    },
    computed: {
        boardFlag_:{
            get(){
                return this.boardFlag
            },
            set(val){
                this.$emit("changeBoardFlag",val)
            }
        }
    },
}
</script>

<style lang="less" scoped>
    .board{
        
    }
    .board /deep/ div.el-dialog__body{
        height: 55vh;
        overflow: auto;
        padding: 10px 20px;
    }
</style>