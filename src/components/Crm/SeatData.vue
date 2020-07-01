<template>
    <el-main class="index-main">
        <el-row class="people-screen">

            <el-col :span="8">
                <el-date-picker
                    size="small"
                    style="width: 95%;"
                    v-model="dataPicker"
                    type="datetimerange"
                    range-separator="至"
                    :default-time="['00:00:00', '23:59:59']"
                    @change="datePickerChange"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
            </el-col>

            <el-col :span="4">

                <el-autocomplete
                    size="small"
                    style="width: 90%;"
                    v-model="form.examItemText"
                    :fetch-suggestions="querySearch"
                    placeholder="请输入考试项目"
                    :trigger-on-focus="true"
                    clearable
                    @clear="autocompleteClear"
                    @select="handleSelect"
                ></el-autocomplete>

            </el-col>

            <el-col :span="4">
                <el-input v-model="form.tel" size="small" placeholder="请输入要查询的手机号" class="screen-li"></el-input>
            </el-col>

            <el-col :span="4" class="seatData">
                <area-cascader type="text" placeholder="请选择地区" class="screen-li" v-model="form.provinceCity" @change="cityChange" :data="pcaa"></area-cascader>
            </el-col>

            <el-col :span="4">
                
                <el-select v-model="form.spread" size="small" placeholder="请选择渠道" clearable>
                    <el-option
                      v-for="item in enumList['MJ-6']"
                      :key="item.name"
                      v-if="item.enable"
                      :label="item.name"
                      :value="item.number">
                    </el-option>
                </el-select>

            </el-col>
            
        </el-row>

        <el-row class="people-screen" type="flex" align="middle">

            <el-col :span="4">
                
                <el-select v-model="form.dialState" size="small" placeholder="请选择是否首咨" class="screen-li" clearable>
                    <el-option
                      v-for="item in dialStateList"
                      :key="item.name"
                      :label="item.name"
                      :value="item.number">
                    </el-option>
                </el-select>

            </el-col>

            <el-col :span="4">

                <el-select v-model="form.ruleNumberName" size="small" placeholder="请选择分配组" class="screen-li" clearable>
                    <el-option
                      v-for="item in ruleNumberNameList"
                      :key="item.name"
                      :label="item.name"
                      :value="item.ruleNumberName">
                    </el-option>
                </el-select>

            </el-col>

            <el-col :span="4">
                <el-button type="primary" size="small" @click="getAllUserClueDataClick">查 询</el-button>
            </el-col>
            <el-col :span="12">
                <el-row type="flex" justify="end">
                    <svg-icon class="border-icon" @click="TransferToGoogClick" icon-title="释放数据" icon-class="release-grey" />
                    <svg-icon class="border-icon" @click="editFieldHandle" icon-title="表头管理" icon-class="field" />
                </el-row>
            </el-col>

        </el-row>

        <el-table
            :data="list"
            ref="tableSelect"
            v-loading="fullscreenLoading"
            style="width: 100%"
            :row-key="getRowKey"
            >

            <el-table-column
              type="selection"
              width="45">
            </el-table-column>
            <el-table-column
              :prop="item.props"
              v-for="(item, index) in columnList"
              :min-width="item.width"
              :key="index"
              >
              <template slot="header">
                {{item.label}}
                <span class="caret-wrapper" v-if="item.ifSort">
                    <i class="sort-caret ascending" @click="tableSort('ascending', item.props)"></i>
                    <i class="sort-caret descending" @click="tableSort('descending', item.props)"></i>
                </span>
              </template>
              <template slot-scope="scope">
                    <span>{{scope.row[item.props]}}</span>
                    <!-- <el-tooltip effect="dark" v-if="item.props == 'tel'" content="复制手机号码" placement="top">
                        <el-image
                            class="copy-icon-style"
                            @click="phoneCopy(scope.row)"
                            :src="require('../../assets/images/copy-icon.png')">
                        </el-image>
                    </el-tooltip> -->
              </template>
            </el-table-column>

            <el-table-column prop="active" label="操作" fixed="right" width="50">
              <template slot-scope="scope">
                <svg-icon @click="customerInfo(scope.row)" icon-title="客户信息" icon-class="info" />
              </template>
            </el-table-column>
        </el-table>

        <el-pagination
            background
            layout="total, sizes, prev, pager, next, jumper"
            style="text-align: right; margin-top: 20px;"
            :total='form.total'
            :page-size='form.pageSize'
            :current-page="form.currentPage"
            :page-sizes="[10, 20, 30, 50]"
            :hide-on-single-page="totalFlag"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
        >
        </el-pagination>

        <CustomerNotes 
            v-if="drawer"
            @changeDrawer="changeDrawer"
            :followFlag='followFlag' 
            :drawer.sync='drawer'
            :userUuid='form.userUuid'
            :schoolId='schoolId'
            :examItem='examItem'
            :clueDataSUuid='clueDataSUuid'
            :userCDARUuid='userCDARUuid'
            :comMode='comMode'
            :callLogUuid='callLogUuid'
            @fatherDataList='getAllUserClueData'
        >
        </CustomerNotes>

        <PageFieldManage :setPageNum="setPageNum" />

    </el-main>
</template>

<script>
import { 
    getAllUserClueData, 
    getExamBasic, 
    enumByEnumNums, 
    getRuleItem,
    clueDataRelease,
    copyTel,
} from '../../request/api';
import PageFieldManage from '@/components/Base/PageFieldManage';
import { copyData, removeEvery } from '../../assets/js/common';
import pcaa from 'area-data/pcaa';
import { MJ_6 } from '../../assets/js/data';
import CustomerNotes from '../Share/CustomerNotes';
export default {
    name: 'seatData',
    components: {
        CustomerNotes,
        PageFieldManage
    },
    data() {
        return {
            fieldNum: [],
            form: {
                currentPage: 1,
                pageSize: 20,
                startTime: '',
                endTime: '',
                ruleNumberName: '',
                tel: '',
                total: null,
                dialState: '',
                examItemId: '',
                examItemText: '',
                province: '',
                city: '',
                provinceCity: [], //所在省市
                spread: '',
                userUuid: '',
                num: '',
                sortSet: []
            },
            totalFlag: false,
            dialStateList: [
                { 'name': '首咨', 'number': 0 },
                { 'name': '非首咨', 'number': 1 },
            ],
            ruleNumberNameList: [], //分配组数组
            list: [],
            columnList: [
                { 'label': '' }
            ],
            dataPicker: [],
            
            restaurants: [],
            enumList: {},
            fullscreenLoading: false,

            followFlag: false,
            drawer: false,
            clueDataSUuid: '',
            callLogUuid: '',
            comMode: '',
            schoolId: '',
            examItem: '',
            userCDARUuid: '',
        }
    },
    // watch:{
    //     '$store.state.editFieldVisible'(val){
    //         if(!val && this.$store.state.pageNum == 'YM_3'){
    //             this.getAllUserClueData()
    //         }
    //     }
    // },
    created() {
        const seatDataPageSize = localStorage.getItem('seatDataPageSize');
        if(seatDataPageSize) {
            this.form.pageSize = Number(seatDataPageSize);
        }else{
            this.form.pageSize = 20;
        }
        const uuid = localStorage.getItem('userUuid');
        this.form.userUuid = uuid;
        this.getAllUserClueData();
        this.getExamBasic();
        let arr = [MJ_6];
        this.enumByEnumNums(arr);
        this.pcaa = pcaa;
        this.getRuleItem();
    },
    methods: {
        setPageNum(pageNum){
            this.form.num = pageNum
        },
        getRowKey(row){
        return row.num
        },
        editFieldHandle(){
            this.$store.commit('setEditFieldVisible', true)
        },
        tableSort(type, props){
            this.form.sortSet = []
            this.form.sortSet.push({[props]: type === 'ascending' ? 'ASC' : 'DESC'})
            this.getAllUserClueData()
        },
        enumByEnumNums(arr) {
            this.$smoke_post(enumByEnumNums, {
                numberList: arr
            }).then(res => {
                if(res.code == 200){
                    this.enumList = res.data;
                }
            })
        },
        getRuleItem() {
            this.$smoke_get(getRuleItem, {
                type: ''
            }).then(res => {
                if(res.code == 200){
                    this.ruleNumberNameList = res.data;
                }
            })
        },
        getAllUserClueDataClick() {
            this.form.currentPage = 1;
            this.getAllUserClueData();
        },
        getAllUserClueData() {
            this.fullscreenLoading = true;
            this.$smoke_post(getAllUserClueData, this.form).then(res => {
                if(res.code == 200) {
                    setTimeout(() => {
                        this.fullscreenLoading = false;
                        // res.data.list.map(sll => {
                        //     sll.lastCallTime = timestampToTime(Number(sll.lastCallTime));
                        //     sll.createTime = timestampToTime(Number(sll.createTime));
                        //     sll.dataType = backType(sll.dataType);
                        //     sll.provinceCity = sll.province == '' ? '- -' : sll.province + ' / ' + sll.city;
                        //     sll.callDialUp = sll.dialUpNum + '/' + sll.callNum;
                        // })
                        this.columnList = res.data.filedList;
                        this.list = res.data.list;
                        this.schoolId = res.data.schoolId;
                        this.form.total = res.data.total;
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
        customerInfo(row) {
            this.drawer = true;
            this.clueDataSUuid = row.clueDataSUuid;
            this.userCDARUuid = row.userCDARUuid;
            this.followFlag = false;
        },
        handleAddClick(row) {
            this.drawer = true;
            this.clueDataSUuid = row.clueDataSUuid;
            this.followFlag = true;
            this.comMode = '微信沟通';
            this.userCDARUuid = row.userCDARUuid;
            this.examItem = row.examItemId;
        },
        datePickerChange(value) {
            if (value == null) {
                this.form.startTime = '';
                this.form.endTime = '';
            }else{
                this.form.startTime = value[0].getTime();
                this.form.endTime = value[1].getTime();
            }
        },
        handleClose(done) {
            done();
        },
        handleCurrentChange(index) {
            this.form.currentPage = index;
            this.getAllUserClueData();
        },
        handleSizeChange(index) {
            this.form.pageSize = index;
            this.form.currentPage = 1;
            localStorage.setItem('seatDataPageSize', index);
            this.getAllUserClueData();
        },
        changeDrawer(val){
            this.drawer = val;
        },
        getExamBasic() {
            let arr;
            this.$smoke_get(getExamBasic, {}).then(res => {
                arr = JSON.parse(JSON.stringify(res.data).replace(/name/g,"value"));
                this.restaurants = arr;
            })
        },
        querySearch(queryString, cb) {
            var restaurants = this.restaurants;
            var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        createFilter(queryString) {
            return (restaurant) => {
              return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) > -1);
            };
        },
        handleSelect(item) {
            this.form.examItemId = item.id;
        },
        autocompleteClear() {
            this.form.examItemId = '';
        },
        cityChange() {
            this.form.province = this.form.provinceCity[0];
            this.form.city = this.form.provinceCity[1];
        },
        TransferToGoogClick() {
            let userCDARUuidArr = [];
            this.$refs.tableSelect.selection.map(sll => {
                userCDARUuidArr.push(sll.userCDARUuid);
            });
            if(userCDARUuidArr.length == 0) {
                this.$message({
                    type: 'error',
                    message: '请您先勾选您要释放的数据'
                })
            }else{
                this.$confirm('确认要释放数据吗？')
                .then(_ => {
                    this.$smoke_post(clueDataRelease, {
                        list: userCDARUuidArr
                    }).then(res => {
                        if(res.code == 200) {
                            this.$message({
                                type: 'success',
                                message: '数据释放成功'
                            })
                            this.getAllUserClueData();
                        }
                    })
                })
                .catch(_ => {});
            }
        },
        phoneCopy(row) {
            this.copyTel(row.clueDataSUuid);
        },
        copyTel(id) {
            this.$smoke_post(copyTel, {
                uuid: id
            }).then(res => {
                if(res.code == 200) {
                    copyData(res.data);
                    this.$message({
                        type: 'success',
                        message: '复制成功',
                    });
                }else{
                    this.$message({
                        type: 'error',
                        message: res.msg
                    })
                }
            })
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
    /* //element-ui table的去除右侧滚动条的样式 */
    ::-webkit-scrollbar {
        width: 8px;
        height: 1px;
    }
        /* // 滚动条的滑块 */
    ::-webkit-scrollbar-thumb {
        background-color: #a1a3a9;
        border-radius: 8px;
    }
</style>