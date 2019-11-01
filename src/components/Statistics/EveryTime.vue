<template>
    <div class="every-title">
        <el-row style="margin-bottom: 20px;">

            <el-col :span="4">
                <el-select v-model="form.callStyle" placeholder="请选择呼叫方式" style="width: 90%;">
                    <el-option
                      v-for="item in callStyleArr"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                </el-select>
            </el-col>

            <el-col :span="4">
                <el-input v-model="form.calledId" placeholder="请输入座席电话" style="width: 90%;"></el-input>
            </el-col>

            <el-col :span="4">
                <el-input v-model="form.callerId" placeholder="请输入客户电话" style="width: 90%;"></el-input>
            </el-col>

            <el-col :span="4">
                <el-select v-model="form.dealState" placeholder="请选择处理状态" style="width: 90%;">
                    <el-option
                      v-for="item in dealStateArr"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                </el-select>
            </el-col>

            <el-col :span="4">
                <el-select v-model="form.hangupSide" placeholder="请选择挂机方" style="width: 90%;">
                    <el-option
                      v-for="item in hangupSideArr"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                </el-select>
            </el-col>

            <el-col :span="4">
                <el-select v-model="form.isCalledPhone" placeholder="请选择是否接通" style="width: 90%;">
                    <el-option
                      v-for="item in isCalledPhoneArr"
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
                    style="width: 90%;"
                    v-model="dataPicker"
                    type="datetimerange"
                    range-separator="至"
                    @change="datePickerChange"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
            </el-col>

            <el-col :span="4">
                <el-select v-model="form.pathway" placeholder="请选择呼叫途径" style="width: 90%;">
                    <el-option
                      v-for="item in pathwayArr"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                </el-select>
            </el-col>

            <el-col :span="4">
                <el-input v-model="form.seatId" placeholder="请输入坐席工号" style="width: 90%;"></el-input>
            </el-col>

            <el-col :span="8">
                <el-button type="primary" style="width: 1.5rem;" @click="timeClick">确定</el-button>
            </el-col>

        </el-row>

        <el-table
            :data="tableData"
            border
            fit
            style="width: calc( 100vw - 3.65rem); margin-top: 40px;">

            <af-table-column
                :prop="item.prop"
                :label="item.label"
                v-for="(item, index) in columnList"
                :key="index">
            </af-table-column>

            <af-table-column
                prop="bofang" label="录音播放"
                fixed="right"
                :width="columnWidth"
                v-if="columnFlag"
            >
                <template slot-scope="scope">
                    <el-button v-if="scope.row.recordFile" @click="bofangClick(scope.row)" type="text" size="small">
                        <audio 
                            :src="scope.row.recordFile"
                            controls="controls"
                            style="height: 30px;"
                        ></audio>
                    </el-button>
                </template>
            </af-table-column>

        </el-table>

        <el-pagination
            background
            style="margin-top: 30px; text-align:right; margin-right: 1.2%; margin-bottom: 50px;"
            layout="total, sizes, prev, pager, next, jumper"
            :total='total'
            :page-size='form.pageSize'
            :page-sizes="[8, 10, 20, 30]"
            :hide-on-single-page="totalFlag"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
        >
        </el-pagination>

    </div>
</template>

<script>
import { getCallRecord } from '../../request/api';
import { everyTimeList } from '../../assets/js/data'
import { getTextByTime, timestampToTime } from '../../assets/js/common'
export default {
    name: 'everyTime',
    data() {
        return {
            form: {
                callStyle: '', //呼叫方式 3:外呼电话 4:直线呼入
                calledId: '', //座席电话(4位和11位)
                callerId: '', //客户电话
                currentPage: 1, //当前页数
                dealState: '', //处理状态 1:处理 0：未处理
                hangupSide: '', //挂机方 1：座席侧 2：客户侧
                insertTimeStartTime: '', //电话开始呼叫开始时间；时间戳10位
                insertTimeEndTime: '', //电话开始呼叫结束时间；时间戳10位
                isCalledPhone: '', //是否接通 1:接通 0、2、其他:未接通
                pageSize: 10, //每页显示条目个数
                pathway: '', //呼叫途径 1：呼叫中心 2：工作手机
                seatId: '', //坐席工号
                sortSet: [], //排序集合
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
        }
    },
    created() {
        this.getCallRecord();
    },
    methods: {
        bofangClick(row) {
            console.log(row);
        },
        getCallRecord() {
            this.$smoke_post(getCallRecord, this.form).then(res => {
                console.log(res);
                this.columnFlag = false;
                res.data.list.map((sll,index) => {
                    sll.callStyle = getTextByTime(sll.callStyle, 3, 4, '外呼电话', '直线呼入');
                    sll.dealState = getTextByTime(sll.dealState, 1, 0, '处理', '未处理');
                    sll.hangupSide = getTextByTime(sll.hangupSide, 1, 2, '座席侧', '客户侧');
                    sll.isCalledPhone = getTextByTime(sll.isCalledPhone, 1, 0, '接通', '其他');
                    sll.pathway = getTextByTime(sll.pathway, 1, 2, '呼叫中心', '工作手机');
                    sll.callerQueueTime = timestampToTime(sll.callerQueueTime);
                    sll.callerStime = timestampToTime(sll.callerStime);

                    sll.insertDbTime = timestampToTime(sll.insertDbTime);
                    sll.insertTime = timestampToTime(sll.insertTime);
                    if(sll.recordFile){
                        this.columnWidth = 330;
                        this.columnFlag = true;
                    }
                })
                this.tableData = res.data.list;
                this.total = res.data.total;
            })
        },
        datePickerChange(value) {
            console.log(value);
            this.form.insertTimeStartTime = value[0].getTime()/1000;
            this.form.insertTimeEndTime = value[1].getTime()/1000;
        },
        timeClick() {
            // console.log(this.form);
            this.getCallRecord();
        },
        handleCurrentChange(index) {
            this.form.currentPage = index;
            this.getCallRecord();
        },
        handleSizeChange(index) {
            console.log(index);
            this.form.pageSize = index;
            this.getCallRecord();
        },
    },
    mounted() {
        
    }
}
</script>

<style lang="less" scoped>
    .every-title{
        width: 100vw;
        padding: 20px;        
    }
    .every-title /deep/ .bofang-column{
        padding: 0 !important;
    }
</style>