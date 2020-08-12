<template>
    <div class="board">
        <el-dialog width="56%" title="通时明细" :visible.sync="boardFlag_" :before-close="handleClose">
          
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="组织列表" name="first">

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
                        :data="list1"
                        ref="tableSelect1"
                        v-loading="fullscreenLoading1"
                        style="width: 100%">

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

ss

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
} from '../../request/api';
import { 
    timestampToTime
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
            activeName: 'first',
            fullscreenLoading1: false,
            list1: [],
            columnList1: [
                { 'prop': 'saleName', 'label': '统计单位', width: 80 },
                { 'prop': 'callTime', 'label': '总通话时长', width: 120 },
                { 'prop': 'callFirstNum', 'label': '首咨总次数', width: 120 },
                { 'prop': 'firstConTime', 'label': '首咨总时长', width: 120 },
                { 'prop': 'callFirstNum1', 'label': '2-3天数据总次数', width: 120 },
                { 'prop': 'daysTime1', 'label': '2-3天数据总时长', width: 120 },
                { 'prop': 'callFirstNum2', 'label': '3天以上数据总次数', width: 140 },
                { 'prop': 'daysTime2', 'label': '3天以上数据总时长', width: 140 },
                { 'prop': 'callOpenStuNum', 'label': '接通人数', width: 120 },
                { 'prop': 'callOpenLv', 'label': '接通率', width: 120 },
            ]
        }
    },
    created() {
        
    },
    methods: {
        salesOrgBoardClick() {
            
        },
        handleClick(tab, event) {
            if(tab.index == '0'){
                
            }else{
                
            }
        },
        handleClose() {
            this.$emit("changeBoardFlag", false)
        },
        orgSaleDayWork() {
            this.$smoke_post(orgSaleDayWork, this.formPeople).then(res => {
                if(res.code == 200) {

                }else{

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