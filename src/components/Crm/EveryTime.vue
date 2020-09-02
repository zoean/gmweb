<template>
    <el-main class="index-main">
        <el-row style="margin-bottom: 20px;">

            <el-col :span="4">
                <el-cascader
                    ref="cascader"
                    size="small"
                    style="width: 90%;"
                    placeholder="请选择拨打人部门"
                    collapse-tags
                    :show-all-levels=false
                    :options="zuzhiOptions"
                    @change='handleZuzhiChange'
                    :props="{ checkStrictly: true, label: 'name', value: 'uuid', children: 'includeSubsetList', multiple: true }"
                    clearable>
                </el-cascader>
            </el-col>

            <el-col :span="4">
                <el-select v-model="form.callStyle" size="small" placeholder="请选择拨打方式" style="width: 90%;" clearable>
                    <el-option
                      v-for="item in callStyleArr"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                </el-select>
            </el-col>
    
            <el-col :span="4">
                <el-input v-model="form.calledId" size="small" placeholder="请输入拨打人电话" style="width: 90%;" clearable></el-input>
            </el-col>
    
            <el-col :span="4">
                <el-input v-model="form.callerId" size="small" placeholder="请输入客户电话" style="width: 90%;" clearable></el-input>
            </el-col>
    
            <el-col :span="4">
                <el-select v-model="form.isCalledPhone" size="small" placeholder="请选择是否接通" style="width: 90%;" clearable>
                    <el-option
                      v-for="item in isCalledPhoneArr"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                </el-select>
            </el-col>

            <el-col :span="4">
                <el-select v-model="form.pathway" size="small" placeholder="请选择呼叫途径" style="width: 100%;" clearable>
                    <el-option
                      v-for="item in pathwayArr"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                </el-select>
            </el-col>
    
        </el-row>
    
        <el-row>
        
            <el-col :span="8">
                <el-date-picker
                    clearable
                    style="width: 95%;"
                    size="small"
                    v-model="dataPicker"
                    type="datetimerange"
                    range-separator="至"
                    :default-time="['00:00:00', '23:59:59']"
                    @change="datePickerChange"
                    start-placeholder="拨打时间"
                    end-placeholder="拨打时间">
                </el-date-picker>
            </el-col>
    
            <el-col :span="4">
                <el-input v-model="form.seatName" size="small" placeholder="请输入拨打人姓名" style="width: 90%;" clearable></el-input>
            </el-col>
    
            <el-col :span="8">
                <el-button type="primary" size="small" @click="timeClick">查询</el-button>
            </el-col>
    
        </el-row>
    
        <el-table
            :data="tableData"
            fit
            :key="Math.random()"
            v-loading="fullscreenLoading"
            style="width: 100%; margin-top: 20px;">
    
            <el-table-column
                :prop="item.prop"
                :label="item.label"
                v-for="(item, index) in columnList"
                :key="index">
            </el-table-column>
    
            <el-table-column
                prop="bofang" label="录音播放"
                fixed="right"
                :width="columnWidth"
                v-if="columnFlag"
            >
                <template slot-scope="scope">
                    <VueAudio 
                        :theUrl="scope.row.recordFile" 
                        v-if="scope.row.recordFile"
                        theControlList="onlyOnePlaying noMuted noVolume"
                    >
                    </VueAudio>
                </template>
            </el-table-column>
    
        </el-table>
    
        <el-pagination
            background
            style="margin-top: 30px; text-align:right; margin-right: 1.2%; margin-bottom: 50px;"
            layout="total, sizes, prev, pager, next, jumper"
            :total='total'
            :page-size='form.pageSize'
            :current-page='form.currentPage'
            :page-sizes="[10, 20, 30, 50, 100]"
            :hide-on-single-page="totalFlag"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
        >
        </el-pagination>

    </el-main>
</template>

<script>
import { getCallRecord, getOrgSubsetByUuid } from '../../request/api';
import { everyTimeList } from '../../assets/js/data'
import { getTextByTime, timestampToTime, timeReturn } from '../../assets/js/common'
import VueAudio from '../Share/VueAudio';
export default {
    name: 'everyTime',
    components: {
        VueAudio
    },
    data() {
        return {
            form: {
                callStyle: '', //呼叫方式 3:外呼电话 4:直线呼入
                calledId: '', //座席电话(4位和11位)
                callerId: '', //客户电话
                currentPage: 1, //当前页数
                // dealState: '', //处理状态 1:处理 0：未处理
                // hangupSide: '', //挂机方 1：座席侧 2：客户侧
                insertTimeStartTime: '', //电话开始呼叫开始时间；时间戳10位
                insertTimeEndTime: '', //电话开始呼叫结束时间；时间戳10位
                isCalledPhone: '', //是否接通 1:接通 0、2、其他:未接通
                pageSize: 20, //每页显示条目个数
                pathway: '', //呼叫途径 1：呼叫中心 2：工作手机
                // seatId: '', //坐席工号
                sortSet: [
                    {insert_time: 'DESC'}
                ], //排序集合
                seatName: '',
                seatOrgList: []
            },
            callStyleArr: [
                { label: '外呼电话', value: 3 },
                { label: '直线呼入', value: 4 },
            ],
            dealStateArr: [
                { label: '处理', value: 1 },
                { label: '未处理', value: 0 },
            ],
            hangupSideArr: [
                { label: '座席侧', value: 1 },
                { label: '客户侧', value: 2 },
            ],
            isCalledPhoneArr: [
                { label: '接通', value: 1 },
                { label: '其他', value: 0 },
            ],
            pathwayArr: [
                { label: '呼叫中心', value: 1 },
                { label: '工作手机', value: 2 },
            ],
            dataPicker: [],
            tableData: [],
            columnList: everyTimeList,
            total: null, //总条目数
            totalFlag: false, //当只有一页时隐藏分页
            columnWidth: 90,
            columnFlag: false,
            fullscreenLoading: false,

            zuzhiOptions: [],
        }
    },
    created() {
        this.getCallRecord();
        this.getOrgSubsetByUuid();
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
            this.form.seatOrgList = brr;
        },
        getCallRecord() {
            this.fullscreenLoading = true;
            this.$smoke_post(getCallRecord, this.form).then(res => {
                if(res.code == 200){
                    this.fullscreenLoading = false;
                    this.columnFlag = false;
                    res.data.list.map((sll,index) => {
                        sll.callStyle = getTextByTime(sll.callStyle, 3, 4, '外呼电话', '直线呼入');
                        // sll.dealState = getTextByTime(sll.dealState, 1, 0, '处理', '未处理');
                        // sll.hangupSide = getTextByTime(sll.hangupSide, 1, 2, '座席侧', '客户侧');
                        sll.isCalledPhone = getTextByTime(sll.isCalledPhone, 1, 0, '接通', '其他');
                        sll.pathway = getTextByTime(sll.pathway, 1, 2, '呼叫中心', '工作手机');
                        sll.callerQueueTime = timestampToTime(sll.callerQueueTime);
                        sll.callerStime = timestampToTime(sll.callerStime);
                        sll.duration = timeReturn(sll.duration);
                        sll.insertDbTime = timestampToTime(sll.insertDbTime);
                        sll.insertTime = timestampToTime(sll.insertTime);
                        sll.seatOrgName = sll.seatPOrgName + sll.seatOrgName;
                        if(sll.recordFile){
                            this.columnWidth = 400;
                            this.columnFlag = true;
                        }
                    })
                    this.tableData = res.data.list;
                    this.total = res.data.total;
                    this.form.currentPage = res.data.currentPage;
                }else{
                    this.fullscreenLoading = false;
                    this.$message({
                        type: 'error',
                        message: res.msg
                    })
                }
            })
        },
        datePickerChange(value) { 
            if (value == null) {
                this.form.insertTimeStartTime = '';
                this.form.insertTimeEndTime = '';
            }else{
                this.form.insertTimeStartTime = value[0].getTime()/1000;
                this.form.insertTimeEndTime = value[1].getTime()/1000;
            }
        },
        timeClick() {
            this.form.currentPage = 1;
            this.getCallRecord();
        },
        handleCurrentChange(index) {
            this.form.currentPage = index;
            this.getCallRecord();
        },
        handleSizeChange(index) {
            this.form.pageSize = index;
            this.getCallRecord();
        },
    },
    mounted() {
        
    }
}
</script>

<style lang="less" scoped>
    .index-main{
        height: auto;
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
        .people-screen{
            margin-bottom: 16px;
            .screen-li{
                width: 90%;
            }
        }
    }
    .el-pagination{
        text-align: right;
        margin-top: .4rem;
    }
    .index-main /deep/ .bofang-column{
        padding: 0 !important;
    }
</style>