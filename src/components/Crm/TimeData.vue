<template>
    <el-main class="index-main">
        <el-row>

            <el-col :span="4">
                <el-cascader
                    ref="cascader"
                    size="small"
                    class="screen-li"
                    placeholder="选择统计单元"
                    collapse-tags
                    :show-all-levels=false
                    :options="zuzhiOptions"
                    @change='handleZuzhiChange'
                    :props="{ checkStrictly: true, label: 'name', value: 'uuid', children: 'includeSubsetList', multiple: true }"
                    clearable>
                </el-cascader>
            </el-col>

            <el-col :span="4">
                
                <el-date-picker
                    class="screen-li"
                    size="small"
                    v-model="timeDate"
                    type="date"
                    @change="timeChange"
                    placeholder="请选择日期">
                </el-date-picker>

            </el-col>

            <el-col :span="3">
                <el-button type="primary" size="small" @click="countCallRecord">查询</el-button>
            </el-col>

        </el-row>

        <el-table
            :data="tableData"
            v-loading="fullscreenLoading"
            style="width: 100%; margin-top: 10px;"
            :height="tableHeight">

            <el-table-column
                :prop="item.prop"
                :label="item.label"
                v-for="(item, index) in columnList"
                :fixed="index == 0 ? 'left' : index == columnList.length-1 ? 'right' : null"
                :width="index == 0 ? '160' : index == columnList.length-1 ? '160' : null"
                :key="index">
            </el-table-column>

        </el-table>

    </el-main>
</template>

<script>
import { countCallRecord, getOrgSubsetByUuid } from '../../request/api';
import { countDownTime } from '../../assets/js/common';
import { columnListYes, columnListNo } from '../../assets/js/data';
export default {
    name: 'timeData',
    props: ['tableHeight'],
    data() {
        return {
            zuzhiOptions: [],
            form: {
                orgUuidList: [],
                time: 0
            },
            columnList: columnListNo,
            tableData: [],
            timeDate: '',
            fullscreenLoading: false,
        }
    },
    created() {
        this.getOrgSubsetByUuid();
        this.timeDate = new Date();
    },
    methods: {
        getOrgSubsetByUuid() {
            this.$smoke_post(getOrgSubsetByUuid, {
                uuid: ""
            }).then(res => {
                this.zuzhiOptions = res.data;
            })
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
            this.form.orgUuidList = brr;
        },
        handleClick(row) {
            // console.log(row);
        },
        timeChange() {
            this.form.time = this.timeDate.getTime();
        },
        countCallRecord() {
            this.fullscreenLoading = true;
            this.form.time = this.timeDate.getTime();
            if(this.form.orgUuidList.length != 0 && this.form.time != 0) {
                this.$smoke_post(countCallRecord, this.form).then(res => {
                    if(res.code == 200){
                        setTimeout(() => {
                            this.fullscreenLoading = false;
                            res.data.map(lls => {
                                lls.totalPassTime = countDownTime(Number(lls.totalPassTime));
                                lls.list.map((act,index) => {
                                    lls['title' + index] = countDownTime(Number(act.passTime));
                                })
                            })
                            this.tableData = res.data;
                            this.columnList = columnListYes;
                            this.$emit('setTableHeight', this.tableData.length, 1)
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
            }else{
                setTimeout(() => {
                    this.fullscreenLoading = false;
                    this.$message({
                        type: 'error',
                        message: '请选择您查询的条件'
                    })
                }, 300)
            }
        }
    },
    mounted() {
        
    }
}
</script>

<style lang="less" scoped>
    .index-main{
        margin-top: 15px;
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
        .screen-li{
            width: 96%;
        }
    }
    .index-main /deep/ .el-table .cell{
        text-align: center !important;
    }
</style>