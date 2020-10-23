<template>
    <div class="board">
        <el-dialog fullscreen title="工作明细" :visible.sync="boardFlag_" :before-close="handleClose">

            <el-row class="people-screen">

                <el-col :span="4">

                    <el-cascader
                        style="width: 90%;"
                        ref="cascader"
                        size="small"
                        placeholder="选择统计单元"
                        collapse-tags
                        :show-all-levels=false
                        :options="zuzhiOptions"
                        @change='handleZuzhiChange'
                        :props="{ checkStrictly: true, label: 'name', value: 'uuid', children: 'list', multiple: true }"
                        clearable>
                    </el-cascader>

                </el-col>

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

                    <el-select v-model="form.classType" placeholder="请选择组织列表或人员列表" style="width: 90%;" size="small" clearable>
                        <el-option
                          v-for="item in classTypeList"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                    </el-select>

                </el-col>

                <el-col :span="12">
                
                    <el-button type="primary" @click="salesOrgBoardClick" size="small">查 询</el-button>

                </el-col>

            </el-row>
            
            <el-table
                :data="list"
                ref="tableSelect1"
                :summary-method="getSummaries"
                show-summary
                v-loading="fullscreenLoading"
                :max-height="height"
                style="width: 100%; margin-top: 16px;">

                <el-table-column
                  :prop="item.prop"
                  :label="item.label"
                  :formatter="item.formatter"
                  :min-width="item.width"
                  v-for="(item, index) in columnList"
                  :key="index"
                  :sortable = "item.sortable"
                  >

                </el-table-column>

            </el-table>
            
            <!-- <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="handleClose" size="small">关闭</el-button>
            </span> -->
            
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
            form: {
                orgList: [],
                time: '',
                classType: 1,
            },
            fullscreenLoading: false,
            list: [],
            columnList: [],
            columnList1: [
                { 'prop': 'orgName', 'label': '统计单位', width: 120 },
                { 'prop': 'callTime', 'label': '总通话时长', width: 120, formatter: this.timeFormatter, 'sortable': true },
                { 'prop': 'callFirstNum', 'label': '首咨总次数', width: 120, 'sortable': true },
                { 'prop': 'firstConTime', 'label': '首咨总时长', width: 120, formatter: this.timeFormatter, 'sortable': true },
                { 'prop': 'callFirstNum1', 'label': '2-3天数据总次数', width: 150, 'sortable': true },
                { 'prop': 'daysTime1', 'label': '2-3天数据总时长', width: 150, formatter: this.timeFormatter, 'sortable': true },
                { 'prop': 'callFirstNum2', 'label': '3天以上数据总次数', width: 150, 'sortable': true },
                { 'prop': 'daysTime2', 'label': '3天以上数据总时长', width: 150, formatter: this.timeFormatter, 'sortable': true },
                { 'prop': 'callNum', 'label': '总通话次数', width: 120, 'sortable': true },
                // { 'prop': 'callStuNum', 'label': '拨打总人数', width: 120, 'sortable': true },
                { 'prop': 'callOpenStuNum', 'label': '接通人数', width: 120, 'sortable': true },
                { 'prop': 'callOpenLv', 'label': '接通率(人数)', width: 120, formatter: this.lvFormatter, 'sortable': true },
            ],
            columnList2: [
                { 'prop': 'saleName', 'label': '统计单位', width: 120 },
                { 'prop': 'callTime', 'label': '总通话时长', width: 120, formatter: this.timeFormatter, 'sortable': true },
                { 'prop': 'callFirstNum', 'label': '首咨总次数', width: 120, 'sortable': true },
                { 'prop': 'firstConTime', 'label': '首咨总时长', width: 120, formatter: this.timeFormatter, 'sortable': true },
                { 'prop': 'callFirstNum1', 'label': '2-3天数据总次数', width: 150, 'sortable': true },
                { 'prop': 'daysTime1', 'label': '2-3天数据总时长', width: 150, formatter: this.timeFormatter, 'sortable': true },
                { 'prop': 'callFirstNum2', 'label': '3天以上数据总次数', width: 150, 'sortable': true },
                { 'prop': 'daysTime2', 'label': '3天以上数据总时长', width: 150, formatter: this.timeFormatter, 'sortable': true },
                { 'prop': 'callNum', 'label': '总通话次数', width: 120, 'sortable': true },
                // { 'prop': 'callStuNum', 'label': '拨打总人数', width: 120, 'sortable': true },
                { 'prop': 'callOpenStuNum', 'label': '接通人数', width: 120, 'sortable': true },
                { 'prop': 'callOpenLv', 'label': '接通率(人数)', width: 120, formatter: this.lvFormatter, 'sortable': true },
            ],
            callOpenStuNumAll: 0,
            callStuNumAll: 0,
            timeDate: [new Date(new Date().toLocaleDateString()).getTime()],
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
            classTypeList: [
                { value: 0, label: '组织列表' },
                { value: 1, label: '人员列表' },
            ],
            height: document.documentElement.clientHeight - 150,
        }
    },
    created() {
        this.columnList = this.columnList2;
        this.timeReturn = timeReturn;
        this.saleDataOrg();
        this.form.time = new Date(new Date().toLocaleDateString()).getTime();
    },
    methods: {
        timeFormatter(row, column, cellValue){
            return timeReturn(Number(cellValue))
        },
        lvFormatter(row, column, cellValue){
            if(row.callStuNum == 0) {
                return (0).toFixed(2) + '%'
            }else{
                return ((row.callOpenStuNum / row.callStuNum) * 100).toFixed(2) + '%'
            }
        },
        getSummaries(param) {
          //合计
          const { columns, data } = param;
          // console.log(columns, data);
          const sums = [];
          columns.forEach((column, index) => {
            if (index === 0) {
              sums[index] = "合计";
              return;
            }
            const values = data.map((item) => {
              // console.log(item, item[column.property], column, column.property);
              return Number(item[column.property]); //如果直接取值a[a.b]取不到
            });
            // console.log(values);
            if (!values.every((value) => isNaN(value))) {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                  return prev + curr;
                } else {
                  return prev;
                } 
              }, 0);
            }
            if (index === 1 || index === 3 || index === 5 || index === 7) {
                sums[index] = this.timeReturn(sums[index]);
            }
            if(index === 11) {
                if(this.callStuNumAll == 0) {
                    sums[index] = (0).toFixed(2) + '%'
                }else{
                    sums[index] = ((this.callOpenStuNumAll / this.callStuNumAll) * 100).toFixed(2) + '%';
                }
            }
          });   

          return sums;
        },
        handleZuzhiChange(arr) {
            let brr = [];
            arr.map(res => {
                if(res.length == 1){
                    brr.push(res[0]);
                }else{
                    brr.push(res[res.length-1]);
                }
            })
            this.form.orgList = brr;
        },
        timeChange() {
            this.form.time = this.timeDate;
        },
        saleDataOrg() {
            this.$smoke_get(saleDataOrg, {}).then(res => {
                if(res.code == 200) {
                    this.zuzhiOptions = res.data;
                }
            })
        },
        salesOrgBoardClick() {
            if(this.form.orgList.length == 0) {
                this.$message({
                    type: 'error',
                    message: '请您先选择统计单元'
                })
            }else{
                if(this.form.classType == 0) {
                    this.columnList = this.columnList1;
                    this.orgDayWorkSum();
                }else{
                    this.columnList = this.columnList2;
                    this.orgSaleDayWork();
                }
            }
        },
        handleClose() {
            this.$emit("changeBoardFlag", false)
        },
        orgSaleDayWork() {
            this.fullscreenLoading = true;
            this.$smoke_post(orgSaleDayWork, this.form).then(res => {
                if(res.code == 200) {
                    let callOpenStuNumAll = 0;
                    let callStuNumAll = 0;
                    setTimeout(() => {
                        this.fullscreenLoading = false;
                        res.data.list.map(sll => {
                            callOpenStuNumAll = callOpenStuNumAll + sll.callOpenStuNum;
                            callStuNumAll = callStuNumAll + sll.callStuNum;
                        });
                        this.callOpenStuNumAll = callOpenStuNumAll;
                        this.callStuNumAll = callStuNumAll;
                        this.list = res.data.list;
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
        orgDayWorkSum() {
            this.fullscreenLoading = true;
            this.$smoke_post(orgDayWorkSum, this.form).then(res => {
                if(res.code == 200) {
                    setTimeout(() => {
                        this.fullscreenLoading = false;
                        this.list = res.data.list;
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
        .el-col-6{
            height: auto !important;
        }
    }
    .board /deep/ div.el-dialog__body{
        height: 92vh;
        overflow: auto;
        padding: 10px 20px;
    }
</style>