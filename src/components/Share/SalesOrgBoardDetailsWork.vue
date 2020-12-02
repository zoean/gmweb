<template>
    <div class="board">
        <el-dialog fullscreen title="工作明细" :visible.sync="boardWorkFlag_" :before-close="handleClose">

            <el-row class="people-screen" style="width: 100%; height: 42px; position: fixed; top: 54px; z-index: 999; background: #fff; border-bottom: 1px solid #dedede;">

                <el-col :span="4">

                    <el-cascader
                        style="width: 90%;"
                        ref="cascader"
                        size="small"
                        placeholder="选择统计单元"
                        collapse-tags
                        :show-all-levels=false
                        :options="zuzhiOptions"
                        filterable
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
                
                    <el-button type="primary" @click="salesOrgBoardClickWork" size="small">查 询</el-button>

                </el-col>

            </el-row>

            <div style="height: 16px;"></div>
            
            <el-table
                :data="list"
                ref="tableSelect1"
                :summary-method="getSummaries"
                show-summary
                v-loading="fullscreenLoading"
                style="width: 100%; margin-top: 16px;">

                <el-table-column
                  :prop="item.prop"
                  :label="item.label"
                  :min-width="item.width"
                  v-for="(item, index) in columnList"
                  :key="index"
                  :sortable = "item.sortable"
                  >

                </el-table-column>

            </el-table>

            <div style="height: 31px;"></div>
            
            <!-- <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="handleClose" size="small">关闭</el-button>
            </span> -->
            
        </el-dialog>

    </div>
</template>

<script>
import { 
    orgWorkDetailBySeat,
    saleDataOrg,
    orgWorkDetailByOrg
} from '../../request/api';
import { 
    timestampToTime, timeReturn
} from '../../assets/js/common';
import { 
    
} from '../../assets/js/data';
export default {
    name: 'salesOrgBoardDetails',
    props: {
        boardWorkFlag: {
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
                { 'prop': 'performance', 'label': '业绩' },
            ],
            columnList2: [
                { 'prop': 'saleName', 'label': '统计单位', width: 120 },
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
                { 'prop': 'performance', 'label': '业绩' },
            ],
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
        }
    },
    created() {
        this.columnList = this.columnList2;
        this.timeReturn = timeReturn;
        this.saleDataOrg();
        this.form.time = new Date(new Date().toLocaleDateString()).getTime();
    },
    methods: {
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
            if(index === 11) {
                sums[index] = sums[index].toFixed(2);
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
        salesOrgBoardClickWork() {
            if(this.form.orgList.length == 0) {
                this.$message({
                    type: 'error',
                    message: '请您先选择统计单元'
                })
            }else{
                if(this.form.classType == 0) {
                    this.columnList = this.columnList1;
                    this.orgWorkDetailByOrg();
                }else{
                    this.columnList = this.columnList2;
                    this.orgWorkDetailBySeat();
                }
            }
        },
        orgWorkDetailByOrg() {
            this.fullscreenLoading = true;
            this.$smoke_post(orgWorkDetailByOrg, this.form).then(res => {
                if(res.code == 200) {
                    setTimeout(() => {
                        this.fullscreenLoading = false;
                        res.data.list.map(sll => {
                            if(sll.cjAllNum == 0){
                                sll.totalARPU = 0;
                            }else{
                                sll.totalARPU = (sll.cjAllMoney / sll.cjAllNum).toFixed(2);
                            }
                        })
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
        orgWorkDetailBySeat() {
            this.fullscreenLoading = true;
            this.$smoke_post(orgWorkDetailBySeat, this.form).then(res => {
                if(res.code == 200) {
                    setTimeout(() => {
                        this.fullscreenLoading = false;
                        res.data.list.map(sll => {
                            if(sll.cjAllNum == 0){
                                sll.totalARPU = 0;
                            }else{
                                sll.totalARPU = (sll.cjAllMoney / sll.cjAllNum).toFixed(2);
                            }
                        })
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
        handleClose() {
            this.$emit("changeBoardWorkFlag", false)
        },
    },
    mounted() {
        
    },
    computed: {
        boardWorkFlag_:{
            get(){
                return this.boardWorkFlag
            },
            set(val){
                this.$emit("changeBoardWorkFlag",val)
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