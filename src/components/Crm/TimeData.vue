<template>
    <el-main class="index-main">

        <div class="people-title">通时数据统计</div>

        <el-row>

            <el-col :span="4">
                <el-cascader
                    ref="cascader"
                    class="screen-li"
                    placeholder="请选择统计单元"
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
                    style="width: 90%;"
                    v-model="timeDate"
                    type="date"
                    @change="timeChange"
                    placeholder="请选择日期">
                </el-date-picker>

            </el-col>

            <el-col :span="4">
                <el-button 
                    type="primary" 
                    plain 
                    style="width: 50%;"
                    @click="countCallRecord"
                >确定</el-button>
            </el-col>

        </el-row>

        <el-table
            :data="tableData"
            border
            v-loading="fullscreenLoading"
            style="width: 100%">

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
import { columnListYes, columnListNo } from '../../assets/js/data';
export default {
    name: 'timeData',
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
                console.log(res);
                this.zuzhiOptions = res.data;
            })
        },
        handleZuzhiChange(arr) {
            let brr = [];
            // console.log(arr);
            arr.map(res => {
                if(res.length == 1){
                    brr.push(res[0]);
                }else{
                    brr.push(res[res.length-1]);
                }
            })
            // console.log(brr);
            this.form.orgUuidList = brr;
        },
        handleClick(row) {
            // console.log(row);
        },
        timeChange() {
            // console.log(this.timeDate.getTime());
            this.form.time = this.timeDate.getTime();
        },
        countCallRecord() {
            this.fullscreenLoading = true;
            this.form.time = this.timeDate.getTime();
            if(this.form.orgUuidList.length != 0 && this.form.time != 0) {
                this.$smoke_post(countCallRecord, this.form).then(res => {
                    if(res.code == 200){
                        // console.log(res);
                        setTimeout(() => {
                            this.fullscreenLoading = false;
                            res.data.map(lls => {
                                lls.totalPassTime = Math.round((lls.totalPassTime / 3600) * 100) / 100;
                                lls.list.map((act,index) => {
                                    lls['title' + index] = Math.round((act.passTime / 3600) * 100) / 100;
                                })
                            })
                            console.log(res.data);
                            this.tableData = res.data;
                            this.columnList = columnListYes;
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
        height: calc( 100vh - 60px);
        .people-title{
            width: 100%;
            height: 40px;
            line-height: 40px;
            text-align: center;
            font-size: 15px;
            background: #aaa;
            margin-bottom: .3rem;
            color: #fff;
        }
        .screen-li{
            width: 90%;
            margin-bottom: 1rem;
        }
    }
    .index-main /deep/ .el-table .cell{
        text-align: center !important;
    }
</style>