<template>
    <div class="">

        <el-container class="index-main">

            <el-main>

                <div class="people-title">通时数据统计</div>

                    <el-row>

                        <el-col :span="4">
                            <el-cascader
                                ref="cascader"
                                class="screen-li"
                                placeholder="请选择统计单元"
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
                        style="width: calc( 100vw - 3.65rem)">

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

        </el-container>
        
    </div>
</template>

<script>
import { countCallRecord, getOrgSubsetByUuid } from '../../request/api';
export default {
    name: 'index',
    data() {
        return {
            zuzhiOptions: [],
            form: {
                orgUuidList: [],
                time: 0
            },
            columnList: [
                { 'prop': 'orgName', 'label': '统计单元' },
                { 'prop': 'title0', 'label': '0--1' },
                { 'prop': 'title1', 'label': '1--2' },
                { 'prop': 'title2', 'label': '2--3' },
                { 'prop': 'title3', 'label': '3--4' },
                { 'prop': 'title4', 'label': '4--5' },
                { 'prop': 'title5', 'label': '5--6' },
                { 'prop': 'title6', 'label': '6--7' },
                { 'prop': 'title7', 'label': '7--8' },
                { 'prop': 'title8', 'label': '8--9' },
                { 'prop': 'title9', 'label': '9--10' },
                { 'prop': 'title10', 'label': '10--11' },
                { 'prop': 'title11', 'label': '11--12' },
                { 'prop': 'title12', 'label': '12--13' },
                { 'prop': 'title13', 'label': '13--14' },
                { 'prop': 'title14', 'label': '14--15' },
                { 'prop': 'title15', 'label': '15--16' },
                { 'prop': 'title16', 'label': '16--17' },
                { 'prop': 'title17', 'label': '17--18' },
                { 'prop': 'title18', 'label': '18--19' },
                { 'prop': 'title19', 'label': '19--20' },
                { 'prop': 'title20', 'label': '20--21' },
                { 'prop': 'title21', 'label': '21--22' },
                { 'prop': 'title22', 'label': '22--23' },
                { 'prop': 'title23', 'label': '23--24' },
                { 'prop': 'totalPassTime', 'label': '全天合计单位：小时' },
            ],
            tableData: [],
            timeDate: '',
        }
    },
    created() {
        this.getOrgSubsetByUuid();

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
            console.log(arr);
            arr.map(res => {
                if(res.length == 1){
                    brr.push(res[0]);
                }else{
                    brr.push(res[res.length-1]);
                }
            })
            console.log(brr);
            this.form.orgUuidList = brr;
        },
        handleClick(row) {
            console.log(row);
        },
        timeChange() {
            console.log(this.timeDate.getTime());
            this.form.time = this.timeDate.getTime();
        },
        countCallRecord() {
            this.$smoke_post(countCallRecord, this.form).then(res => {
                console.log(res);
                res.data.map(lls => {
                    lls.list.map((act,index) => {
                        lls['title' + index] = act.passTime;
                    })
                })
                console.log(res.data);
                this.tableData = res.data;
            })
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
            height: .6rem;
            line-height: .6rem;
            text-align: center;
            font-size: .2rem;
            background: #aaa;
            margin-bottom: .3rem;
            color: #fff;
        }
        .screen-li{
            width: 90%;
            margin-bottom: 1rem;
        }
    }
</style>
<style>
    .el-table td, .el-table th{
        text-align: center !important;
    }
</style>