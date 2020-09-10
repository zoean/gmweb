<template>
    <el-main class="index-main">
        <el-row class="people-screen">

            <el-col :span="6">
                <el-date-picker
                    size="small"
                    style="width: 97%;"
                    v-model="dataPicker"
                    type="datetimerange"
                    range-separator="至"
                    :default-time="['00:00:00', '23:59:59']"
                    @change="datePickerChange"
                    start-placeholder="拨打时间"
                    end-placeholder="拨打时间">
                </el-date-picker>
            </el-col>

            <el-col :span="6">
                <el-date-picker
                    size="small"
                    style="width: 97%;"
                    v-model="dataPickerReturn"
                    type="datetimerange"
                    range-separator="至"
                    :default-time="['00:00:00', '23:59:59']"
                    @change="datePickerChangeReturn"
                    start-placeholder="最新回收时间"
                    end-placeholder="最新回收时间">
                </el-date-picker>
            </el-col>

            <el-col :span="3">

                <el-autocomplete
                    clearable
                    size="small"
                    class="screen-li"
                    v-model="form.examItemText"
                    :fetch-suggestions="querySearch"
                    placeholder="请输入考试项目"
                    :trigger-on-focus="true"
                    @select="handleSelect"
                    @clear="autocompleteClear"
                ></el-autocomplete>

            </el-col>

            <el-col :span="3">
                <el-input v-model="form.tel" size="small" placeholder="请输入手机号" class="screen-li"></el-input>
            </el-col>

            <el-col :span="3" class="seatData">
                <area-cascader type="text" placeholder="请选择地区" class="screen-li" v-model="form.provinceCity" @change="cityChange" :data="pcaa"></area-cascader>
            </el-col>

            <el-col :span="3">
                
                <el-select v-model="form.spread" size="small" placeholder="请选择渠道" clearable>
                    <el-option
                      v-for="item in enumList['MJ-6']"
                      :key="item.number"
                      v-if="item.enable"
                      :label="item.name"
                      :value="item.number">
                    </el-option>
                </el-select>

            </el-col>
            
        </el-row>

        <el-row class="people-screen">

            <el-col :span="3">
                <el-select v-model="form.intentionLevel" placeholder="选择意向等级" size="small" class="screen-li" clearable>
                    <el-option
                      v-for="item in enumList['MJ-5']"
                      :key="item.name"
                      v-if="item.enable"
                      :label="item.name"
                      :value="item.number">
                    </el-option>
                </el-select>
            </el-col>

            <el-col :span="3">

                <el-select v-model="form.ruleNumberName" size="small" placeholder="选择分配组" class="screen-li" clearable>
                    <el-option
                      v-for="item in ruleNumberNameList"
                      :key="item.name"
                      :label="item.name"
                      :value="item.ruleNumberName">
                    </el-option>
                </el-select>

            </el-col>

            <el-col :span="3">
                <el-button type="primary" @click="getRecoveryPoolDataListClick" size="small">查 询</el-button>
            </el-col>

            <el-col :span="15">
                <svg-icon class="border-icon smoke-fr" style="margin-right: 0;" @click="editFieldHandle" icon-title="表头管理" icon-class="field" />
                <svg-icon class="border-icon smoke-fr" @click="pushPeopleClick" icon-title="分配至人" icon-class="toperson" />
            </el-col>

        </el-row>

        <el-table
            :data="list"
            ref="tableSelect"
            v-loading="fullscreenLoading"
            style="width: 100%"
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
            </el-table-column>
            <el-table-column prop="active" label="操作" fixed="right" class-name="table_active">
              <template slot-scope="scope">
                <svg-icon @click="customerInfo(scope.row)" icon-title="客户信息" icon-class="info" />
                  <!-- <el-button @click="handleAddClick(scope.row)" type="text" >添加备注</el-button> -->
              </template>
            </el-table-column>
        </el-table>

        <el-pagination
            background
            layout="total, sizes, prev, pager, next, jumper"
            :total='form.total'
            :page-size='form.pageSize'
            :current-page="form.currentPage"
            :page-sizes="[10, 20, 30, 50, 100]"
            :hide-on-single-page="totalFlag"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
        >
        </el-pagination>

        <el-drawer
            :title="drawerTitle1"
            :visible.sync="drawer1"
            :direction="direction1"
            size="40%"
            :before-close="handleClose"
        >
            <span class="bullets"></span>

            <el-row style="border: 1px dashed #ccc; padding: 20px; margin: 20px;">

                <el-tag 
                    v-for="(item,index) in tableData" :key="index"
                    style="margin: 0 10px 10px 0;"
                    >{{item.orgName}}</span> 
                </el-tag>

                <el-col>

                    <el-input
                        placeholder="输入您想查找的人员"
                        style="margin-bottom: 10px;"
                        size="small"
                        v-model="filterText">
                    </el-input>

                    <el-tree
                        ref="tree"
                        :data="treeData"
                        show-checkbox
                        style="margin-left: 0px;"
                        node-key="orgUuid"
                        :filter-node-method="filterNode"
                        @check="handleCheckChange"
                        :props="defaultProps"
                    >
                    </el-tree>

                </el-col>

            </el-row>

            <div style="text-align: center;">

                <el-button type="primary" style="margin-left: 20px;" size="small" @click="addPeople">确定</el-button>
                <el-button plain size="small" @click="quxiao">取消</el-button>

            </div>

        </el-drawer>

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
            @fatherDataList='getRecoveryPoolDataList'
        >
        </CustomerNotes>

        <PageFieldManage :setPageNum="setPageNum" />

    </el-main>
</template>

<script>
import PageFieldManage from '@/components/Base/PageFieldManage';
import { 
    getRecoveryPoolDataList, 
    getExamBasic,
    enumByEnumNums,
    getRuleItem,
    getRuleUserStructureLimit,
    recPoolActSeat,
} from '../../request/api';
import {  
    pushPeopleFunc,
    removeEvery
} from '../../assets/js/common';
import pcaa from 'area-data/pcaa';
import { MJ_6, zuzhiUuid, MJ_5 } from '../../assets/js/data';
import CustomerNotes from '../Share/CustomerNotes';
export default {
    name: 'reCoverData',
    data() {
        return {
            form: {
                currentPage: 1,
                pageSize: 20,
                ruleNumberName: '', //规则编号分配组ID
                startTime: '',
                endTime: '',
                tel: "", //手机号
                total: null,
                sortSet: [],
                examItemId: '',
                examItemText: '',
                city: '',
                province: '',
                provinceCity: [], //所在省市
                spread: '',
                userUuid: '',
                num: '',
                dataStartTime: '',
                dataEndTime: '',
                intentionLevel: '',
            },
            list: [],
            columnList: [
                // { 'label': '' }
            ],
            ruleNumberNameList: [], //分配组数组
            restaurants: [],
            pcaa: null, //省市数据
            enumList: {},
            dataPicker: [],
            fullscreenLoading: false,
            drawerTitle1: '分配至人',
            drawer1: false,
            direction1: 'rtl',
            filterText: '',
            treeData: [],
            defaultProps: {
                children: 'list',
                label: 'orgName',
            },
            columnListTree: [
                { props: 'orgName', label: '姓名' },
            ],
            tableData: [],
            tableSelectList: [], //选中table数据集合
            totalFlag: false, //当只有一页时隐藏分页

            followFlag: false,
            drawer: false,
            clueDataSUuid: '',
            callLogUuid: '',
            comMode: '',
            schoolId: '',
            examItem: '',
            userCDARUuid: '',

            dataPickerReturn: [],

        }
    },
    components: {
        CustomerNotes,
        PageFieldManage
    },
    created() {
        const seatDataPageSize = localStorage.getItem('seatDataPageSize');
        if(seatDataPageSize) {
            this.form.pageSize = Number(seatDataPageSize);
        }else{
            this.form.pageSize = 20;
        }
        const uuid = localStorage.getItem('userUuid');
        this.form.userUuid = uuid;
        this.form.num = this.$store.state.pageNum
        this.getRecoveryPoolDataList();
        this.getExamBasic();
        let arr = [MJ_6, MJ_5];
        this.enumByEnumNums(arr);
        this.pcaa = pcaa;
        this.getRuleItem();
    },
    methods: {
        setPageNum(pageNum){
            this.form.num = pageNum
        },
        tableSort(type, props){
             this.form.sortSet = []
            this.form.sortSet.push({[props]: type === 'ascending' ? 'ASC' : 'DESC'})
            this.getRecoveryPoolDataList()
        },
        editFieldHandle(){
            this.$store.commit('setEditFieldVisible', true)
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
        datePickerChangeReturn(value) {
            if (value == null) {
                this.form.dataStartTime = '';
                this.form.dataEndTime = '';
            }else{
                this.form.dataStartTime = value[0].getTime();
                this.form.dataEndTime = value[1].getTime();
            }
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
        changeDrawer(val){
            this.drawer = val;
        },
        getRecoveryPoolDataListClick() {
            this.form.currentPage = 1;
            this.getRecoveryPoolDataList();
        },
        getRecoveryPoolDataList() {
            this.fullscreenLoading = true;
            this.$smoke_post(getRecoveryPoolDataList, this.form).then(res => {
                if(res.code == 200) {
                    setTimeout(() => {
                        this.fullscreenLoading = false;
                        // res.data.list.map(sll => {
                        //     sll.lastCallTime = sll.lastCallTime ? timestampToTime(Number(sll.lastCallTime)) : '---'
                        //     sll.createTime = sll.createTime ? timestampToTime(Number(sll.createTime)) : '---'
                        //     sll.provinceCity = sll.province == '' ? '- -' : sll.province + ' / ' + sll.city;
                        //     sll.callDialUp = sll.dialUpNum + '/' + sll.callNum;
                        // })
                        this.list = res.data.list;
                        this.columnList = res.data.filedList
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
        handleClose(done) {
            done();
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
        pushPeopleClick() {
            let clueDataSUuidArr = [];
            this.$refs.tableSelect.selection.map(sll => {
                clueDataSUuidArr.push(sll.uuid);
            });
            if(clueDataSUuidArr.length == 0) {
                this.$message({
                    type: 'error',
                    message: '请您先勾选您要分配的数据'
                })
            }else{
                this.drawer1 = true;
                this.getRuleUserStructureLimit();
                this.tableSelectList = clueDataSUuidArr;
            }
        },
        getRuleUserStructureLimit() {
            this.$smoke_post(getRuleUserStructureLimit, {
                uuid: zuzhiUuid
            }).then(res => {
                if(res.code == 200) {
                    this.treeData = pushPeopleFunc(res.data.list);
                }
            })
        },
        handleSizeChange(index) {
            
            this.form.pageSize = index;
            this.form.currentPage = 1;
            localStorage.setItem('seatDataPageSize', index);
            this.getRecoveryPoolDataList();
        },
        handleCurrentChange(index) {
            
            this.form.currentPage = index;
            this.getRecoveryPoolDataList();
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.orgName.indexOf(value) !== -1;
        },
        handleCheckChange(){
            this.getCheckedNodes();
        },
        getCheckedNodes() {
            let arr = [];
            this.$nextTick(() => {
                
                this.$refs.tree.getCheckedNodes().map(sll => {
                    if(sll.hasOwnProperty('userUin')){ // hasOwnProperty 判断对象是否含有某个属性
                        arr.push(sll);
                    }
                })
                this.tableData = arr;
                
            })
        },
        addPeople() {
            let seatUuidArr = [];
            this.tableData.map(sll => {
                seatUuidArr.push(sll.userUuid);
            })
            if(seatUuidArr.length == 0){
                this.$message({
                    type: 'error',
                    message: '请您先勾选您要分配的人员'
                })
            }else{
                this.$smoke_post(recPoolActSeat, {
                    clueDataSUuid: this.tableSelectList,
                    seatUuid: seatUuidArr
                }).then(res => {
                    if(res.code == 200){
                        if(res.data.result) {
                            res.data.allocationSize = res.data.allocationSize == null ? 0 : res.data.allocationSize;
                            res.data.allocatedSize = res.data.allocatedSize == null ? 0 : res.data.allocatedSize;
                            this.$message({
                                type: 'success',
                                message: res.data.msg + '，提交的线索数量' + res.data.allocationSize + '条' + '，实际获取的线索数量' + res.data.allocatedSize + '条'
                            });
                            this.getRecoveryPoolDataList();
                        }else{
                            this.$message({
                                type: 'error',
                                message: '目前服务线路忙，请稍后重试'
                            })
                            this.getRecoveryPoolDataList();
                        }
                        this.drawer1 = false;
                    }else{
                        this.$message({
                            type: 'error',
                            message: '目前服务线路忙，请稍后重试'
                        })
                        this.drawer1 = false;
                    }
                })
            }
        },
        quxiao() {
            this.drawer1 = false;
        }
    },
    watch: {
        filterText(val) {
            this.$refs.tree.filter(val);
        },
        // '$store.state.editFieldVisible'(val){
        //     if(!val && this.$store.state.pageNum == 'YM_2'){
        //         this.getRecoveryPoolDataList()
        //     }
        // }
    },
}
</script>

<style lang="less" scoped>
    .index-main{
        .el-col-6{
            height: auto !important;
        }
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
            margin-bottom: 10px;
            .screen-li{
                width: 94%;
            }
        }
    }
    .el-pagination{
        text-align: right;
        margin-top: .4rem;
    }
</style>