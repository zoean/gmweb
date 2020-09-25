<template>
    <el-main class="index-main">

        <el-row :class="['people-screen', {actionHide: toggleAction, actionShow: !toggleAction, noSearch: hideSearch}]">
            <el-col :span="3">
                <el-input v-model="form.telephone" placeholder="请输入手机号" class="screen-li" size="small"></el-input>
            </el-col>
            <el-col :span="3">
                <el-input v-model="form.name" placeholder="请输入姓名" class="screen-li" size="small"></el-input>
            </el-col>
            <el-col :span="3">
                <el-input v-model="form.examLable" placeholder="输入考试项目" class="screen-li" size="small" clearable></el-input>
            </el-col>
            <el-col :span="3">
                <el-autocomplete
                    clearable
                    size="small"
                    class="screen-li"
                    ref="autocomplete"
                    v-model="form.itemNameText"
                    :fetch-suggestions="querySearchBaoKao"
                    placeholder="输入报考项目"
                    :trigger-on-focus="true"
                    @select="handleSelectItemName"
                    @clear="autocompleteClearItemName"
                ></el-autocomplete>
            </el-col>
            <el-col :span="3">
                <el-select v-model="form.province" placeholder="选择所在省份" class="screen-li" size="small" clearable>
                    <el-option
                      v-for="item in provinceList"
                      :key="item.provinceName"
                      :label="item.provinceName"
                      :value="item.provinceName">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="3">
                <el-input v-model="form.customerId" placeholder="请输入用户id" class="screen-li" size="small" clearable></el-input>
            </el-col>

            <el-col :span="3">
                <el-select v-model="form.basicInfoStatus" placeholder="基本信息情况" class="screen-li" size="small" clearable>
                    <el-option
                      v-for="item in basicInfoStatusList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="3">
                <el-select v-model="form.examProvince" placeholder="选择报考省份" style="width: 100%" size="small" clearable>
                    <el-option
                      v-for="item in provinceList"
                      :key="item.provinceName"
                      :label="item.provinceName"
                      :value="item.provinceName">
                    </el-option>
                </el-select>
            </el-col>
        </el-row>

        <el-row class="people-screen">
            <el-col :span="6">
                <el-date-picker
                    class="screen-li"
                    v-model="dateRange"
                    size="small"
                    type="daterange"
                    value-format='timestamp'
                    :picker-options="pickerOptions"
                    range-separator="至"
                    start-placeholder="分配时间"
                    end-placeholder="分配时间"
                    @change="changeDateRange">
                </el-date-picker>
            </el-col>

            <el-col :span="3">
                <el-select v-model="form.pictureStatus" placeholder="选择照片情况" class="screen-li" size="small" clearable>
                    <el-option
                      v-for="item in pictureStatusList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                </el-select>
            </el-col>

            <el-col :span="3">
                <el-select v-model="form.checkStatus" placeholder="选择审核情况" class="screen-li" size="small" clearable>
                    <el-option
                      v-for="item in checkStatusList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                </el-select>
            </el-col>

            <el-col :span="3">
                <el-select v-model="form.paymentStatus" placeholder="选择交费情况" class="screen-li" size="small" clearable>
                    <el-option
                      v-for="item in paymentStatusList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                </el-select>
            </el-col>

            <el-col :span="3">

                <el-button type="primary" @click="registerListClick" size="small">查 询</el-button>

            </el-col>

            <el-col :span="6">
                <el-button style="float: right;" @click="downloadListClick" size="small" plain>查看下载任务</el-button>
                <el-button style="float: right; margin-right: 10px;" @click="exportClick" size="small" plain>导 出</el-button>
            </el-col>
        </el-row>

        <el-table
            :data="list"
            ref="tableSelect"
            v-loading="fullscreenLoading"
            style="width: 100%"
            :height="tableHeight">

            <el-table-column
              type="selection"
              width="45">
            </el-table-column>
            
            <el-table-column
              :prop="item.prop"
              :label="item.label"
              :min-width="item.width"
              v-for="(item, index) in columnList"
              :key="index"
              >

              <template slot-scope="scope">
                <span>{{scope.row[item.prop] || '- -'}}</span>
              </template>

            </el-table-column>

            <el-table-column prop="active" label="操作" fixed="right" width="90" class-name="table_active">
              <template slot-scope="scope">
                <div style="text-align: left;">
                    <svg-icon @click="studentDetails(scope.row)" icon-title="学员详情" icon-class="detail" />
                    <el-popover
                        placement="top"
                        width="230"
                        trigger="click"
                        :ref="`popover-${scope.$index}`">

                        <el-select v-model="paymentForm.paymentStatus" placeholder="请选择交费情况" style="width: 200px; margin: 10px 0 16px 0;" size="small" clearable>
                            <el-option
                              v-for="item in paymentStatusList"
                              :key="item.value"
                              :label="item.label"
                              :value="Number(item.value)">
                            </el-option>
                        </el-select>

                        <div style="text-align: right; margin: 0">
                          <el-button size="mini" plain @click="scope._self.$refs[`popover-${scope.$index}`].doClose()">取消</el-button>
                          <el-button type="primary" size="mini" @click="updataPaymentClick(scope)">确定</el-button>
                        </div>
                        <svg-icon slot="reference" icon-title="修改交费状态" icon-class="addnotes" />
                    </el-popover>
                    <svg-icon @click="lookBaoKaoMessage(scope.row)" icon-title="查看报考信息" icon-class="members" />
                </div>
              </template>
            </el-table-column>
        </el-table>

        <el-pagination
            background
            layout="total, sizes, prev, pager, next, jumper"
            :total='form.total'
            :page-size='form.pageSize'
            :current-page='form.currentPage'
            :page-sizes="[10, 20, 30, 50, 100]"
            :hide-on-single-page="totalFlag"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
        >
        </el-pagination>

        <StudentsNotes 
            v-if="drawer"
            @changeDrawer="changeDrawer"
            :drawer.sync='drawer'
            :studentUuid='studentUuid'
            :userId='userId'
            :clueDataSUuid='clueDataSUuid'
            :callLogUuid='callLogUuid'
        >
        </StudentsNotes>

        <BaoKaoMessage 
            v-if="baokaoFlag"
            @changebaokaoFlag="changebaokaoFlag"
            :baokaoFlag.sync='baokaoFlag'
            :registerId='registerId'
        >
        </BaoKaoMessage>

        <DownloadList 
            v-if="downloadFlag"
            @changedownloadFlag="changedownloadFlag"
            :downloadFlag.sync='downloadFlag'
        >
        </DownloadList>

    </el-main>
</template>

<script>
import { 
    registerList,
    queryProvinceAll,
    queryItemList,
    registerExportExcel,
    registerExportZip,
    updataPayment
} from '../../request/api';
import StudentsNotes from '@/components/Share/StudentsNotes';
import BaoKaoMessage from '@/components/Share/BaoKaoMessage';
import DownloadList from '@/components/Share/DownloadList';
import { 
    timestampToTime, 
    genderText,
    classTypeString,
    getTextByJs,
    sortTextNum,
    citiesFun,
    filepostDown
} from '../../assets/js/common';
import { 

} from '../../assets/js/data';
import pcaa from 'area-data/pcaa';
export default {
    name: 'studentsMyBaoKao',
    props: ['tableHeight','toggleAction', 'hideSearch'],
    components: {
        StudentsNotes,
        BaoKaoMessage,
        DownloadList
    },
    data() {
        return {
            form: {
                basicInfoStatus: '', //基本信息是否完整（0-否，1-是）
                checkStatus: '', //审核状态（0-待审核，1-审核通过，2-审核失败）
                currentPage: 1,
                examLable: '', //考试项目
                examProvince: '', //报考省份	
                itemName: '', //报考项目
                itemNameText: '',
                name: '',
                pageSize: 20,
                pageType: 3, //页面类型（1-报考学员管理，2-报考员管理，3-报考管理）
                paymentStatus: '', //交费状态（0-未交费，1-已交费）
                pictureStatus: '', //报考材料图片状态（0-不完整，1-完整）
                province: '', //所在省份
                sortSet: [],
                telephone: '', // 手机号
                total: null,
                registerIds: [],
                startTime: '',
                endTime: ''
            },
            dateRange: [],
            pickerOptions: {
                disabledDate(time) {
                return time.getTime() > Date.now();
                }
            },
            list: [],
            totalFlag: false,
            columnList: [
                { 'prop': 'telephone', 'label': '手机号码', width: 120},
                { 'prop': 'name', 'label': '姓名' },
                { 'prop': 'examLable', 'label': '考试项目' },
                { 'prop': 'itemName', 'label': '报考项目', width: 120 },
                { 'prop': 'itemGradeName', 'label': '报考等级/专业', width: 120 },
                { 'prop': 'province', 'label': '所在省份', width: 120},
                { 'prop': 'examProvince', 'label': '报考省份', width: 120},
                { 'prop': 'basicInfoStatus', 'label': '基本信息情况', width: 110},
                { 'prop': 'pictureStatus', 'label': '照片情况' },
                { 'prop': 'checkStatus', 'label': '审核情况' },
                { 'prop': 'paymentStatusText', 'label': '交费情况' },
            ],
            provinceList: [],
            fullscreenLoading: false,

            drawer: false,
            studentUuid: '',
            userId: '',
            clueDataSUuid: '',
            callLogUuid: '',

            baokaoFlag: false,
            registerId: '',

            downloadFlag: false,

            basicInfoStatusList: [
                { value: 0, label: '不完整' },
                { value: 1, label: '完整' },
            ],
            pictureStatusList: [
                { value: 0, label: '不完整' },
                { value: 1, label: '完整' },
            ],
            paymentStatusList: [
                { value: 0, label: '未交费' },
                { value: 1, label: '已交费' },
            ],
            checkStatusList: [
                { value: 0, label: '待审核' },
                { value: 1, label: '审核通过' },
                { value: 2, label: '审核失败' },
            ],
            ItemBaoKaoList: [],

            paymentForm: {
                paymentStatus: '',
                registerId: ''
            }
        }
    },
    created() {
        const studentsPageSize = localStorage.getItem('studentsPageSize');
        if(studentsPageSize) {
            this.form.pageSize = Number(studentsPageSize);
        }else{
            this.form.pageSize = 20;
        }
        this.queryProvinceAll();
        this.registerList();
        this.queryItemList();
    },
    methods: {        
        changeDateRange(){
        this.form.startTime = this.dateRange[0]
        this.form.endTime = this.dateRange[1]
        },
        downloadListClick() {
            this.downloadFlag = true;
        },
        updataPaymentClick(scope) {
            this.paymentForm.registerId = scope.row.registerId;
            if(this.paymentForm.paymentStatus === ''){
                this.$message({
                    type: 'error',
                    message: '请您选择交费情况'
                });
            }else{
                this.updataPayment(scope);
            }
        },
        updataPayment(scope) {
            this.$smoke_post(updataPayment, this.paymentForm).then(res => {
                if(res.code == 200){
                    this.$message({
                        type: 'success',
                        message: '交费情况更新成功'
                    });
                    scope._self.$refs[`popover-${scope.$index}`].doClose();
                    this.paymentForm.paymentStatus = '';
                    this.registerList();
                }
            })
        },
        exportClick() {
            let arr = [];
            this.$refs.tableSelect.selection.map(sll => {
                arr.push(sll.registerId);
            })
            this.form.registerIds = arr;
            let tmp = (new Date()).getTime();
            tmp = timestampToTime(tmp);
            this.registerExportExcel(tmp);
            this.registerExportZip();
        },
        registerExportExcel(tmp) {
            filepostDown(registerExportExcel, this.form, '报考数据-' + tmp + '.xlsx');
        },  
        registerExportZip(){
            this.$smoke_post(registerExportZip, this.form).then(res => {
                if(res.code == 200) {
                    this.$message({
                        type: 'success',
                        message: '导出成功'
                    });
                }else{
                    this.$message({
                        type: 'error',
                        message: '导出失败'
                    });
                }
            })
        },
        lookBaoKaoMessage(row) {
            this.baokaoFlag = true;
            this.registerId = row.registerId;
        },
        queryItemList() {
            let arr;
            this.$smoke_get(queryItemList, {}).then(res => {
                if(res.code == 200) {
                    arr = JSON.parse(JSON.stringify(res.data).replace(/itemName/g,"value"));
                    this.ItemBaoKaoList = arr;
                }
            })
        },
        changeDrawer(val){
            this.drawer = val;
        },
        changebaokaoFlag(val){
            this.baokaoFlag = val;
            this.registerList();
        },
        changedownloadFlag(val){
            this.downloadFlag = val;
        },
        registerListClick() {
            this.form.currentPage = 1;
            this.registerList();
        },
        registerList() {
            this.fullscreenLoading = true;
            this.$smoke_post(registerList, this.form).then(res => {
                if(res.code == 200) {
                    setTimeout(() => {
                        this.fullscreenLoading = false;

                        res.data.list.map(sll => {
                            sll.basicInfoStatus = sll.basicInfoStatus == '1' ? '完整' : '不完整';
                            sll.pictureStatus = sll.pictureStatus == '1' ? '完整' : '不完整';
                            sll.paymentStatusText = sll.paymentStatus == '1' ? '已交费' : '未交费';
                            sll.checkStatus = sll.checkStatus == '1' ? '审核通过' : sll.checkStatus == '2' ? '审核失败' : '待审核';
                        })

                        this.list = res.data.list;
                        this.form.total = res.data.total;
                        this.$emit('setTableHeight', this.form.total, 1)
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
        queryProvinceAll() {
          this.$smoke_get(queryProvinceAll, {}).then(res => {
            if(res.code == 200) {
                this.provinceList = res.data;
            }
          })
        },
        handleCurrentChange(index) {
            this.form.currentPage = index;
            this.form.pageSize = Number(localStorage.getItem('studentsPageSize')) ? Number(localStorage.getItem('studentsPageSize')) : 20;
            this.registerList();
        },
        handleSizeChange(index) {
            this.form.pageSize = index;
            this.form.currentPage = 1;
            localStorage.setItem('studentsPageSize', index);
            this.registerList();
        }, 
        querySearchBaoKao(queryString, cb) {
            var restaurants = this.ItemBaoKaoList;
            var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        createFilter(queryString) {
            return (restaurant) => {
              return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) > -1);
            };
        },
        handleSelectItemName(item) {
            this.form.itemName = item.itemId;
            this.form.itemNameText = item.value;
        },
        autocompleteClearItemName() {
            this.$nextTick(() => {
                this.$refs.autocomplete.$children
                    .find(c => c.$el.className.includes('el-input'))
                    .blur();
                this.form.itemName = '';
                this.$refs.autocomplete.focus();
            })
        },
        getSupStuListClick() {
            this.form.currentPage = 1;
            this.getSupStuList();
        },
        studentDetails( row ) {
            this.drawer = true;
            this.studentUuid = row.studentUuid;
            this.userId = row.customerId;
            this.clueDataSUuid = row.clueDataSUuid;
        },
    },
    mounted() {
        
    },
}
</script>

<style lang="less" scoped>
    .index-main{
        height: auto;
        .el-col-6{
            height: auto !important;
        }
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
            margin-bottom: 10px;
            .screen-li{
                width: 94%;
            }
        }
    }
</style>