<template>
    <el-main class="index-main">

        <div class="people-title">回收池数据管理</div>

        <el-row class="people-screen">

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

                <el-autocomplete
                    class="screen-li"
                    style="width: 90%;"
                    v-model="form.examItemText"
                    :fetch-suggestions="querySearch"
                    placeholder="请输入考试项目"
                    :trigger-on-focus="true"
                    @select="handleSelect"
                ></el-autocomplete>

            </el-col>

            <el-col :span="4">
                <el-input v-model="form.tel" placeholder="请输入要查询的手机号" class="screen-li"></el-input>
            </el-col>

            <el-col :span="4" class="seatData">
                <area-cascader type="text" class="screen-li" v-model="form.provinceCity" @change="cityChange" :data="pcaa"></area-cascader>
            </el-col>

            <el-col :span="4">
                
                <el-select v-model="form.spread" placeholder="请选择渠道" class="screen-li">
                    <el-option
                      v-for="item in enumList['MJ-6']"
                      :key="item.name"
                      :label="item.name"
                      :value="item.number">
                    </el-option>
                </el-select>

            </el-col>
            
        </el-row>

        <el-row class="people-screen">

            <el-col :span="4">

                <el-select v-model="form.ruleNumberName" placeholder="请选择分配组" class="screen-li">
                    <el-option
                      v-for="item in ruleNumberNameList"
                      :key="item.name"
                      :label="item.name"
                      :value="item.ruleNumberName">
                    </el-option>
                </el-select>

            </el-col>

            <el-col :span="4">
                <el-button type="primary" @click="getRecoveryPoolDataList" class="screen-li">搜 索</el-button>
            </el-col>

            <el-col :span="4">
                <div style="color: #fff; user-select: none;">1</div>
            </el-col>

            <el-col :span="4">
                <div style="color: #fff; user-select: none;">1</div>
            </el-col>

            <el-col :span="4">
                <div style="color: #fff; user-select: none;">1</div>
            </el-col>

            <el-col :span="4">
                <el-button type="primary" @click="pushPeopleClick" class="screen-li">分配至人</el-button>
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
            </el-table-column>
            <el-table-column prop="active" label="操作" width="200px;" fixed="right">
              <template slot-scope="scope">
                  <el-button @click="customerInfo(scope.row)" type="text" >客户信息</el-button>
                  <el-button @click="handleAddClick(scope.row)" type="text" >添加备注</el-button>
              </template>
            </el-table-column>
            <el-table-column
              align="right" width="60px" fixed="right">
              <template slot="header">
                <i class="el-icon-edit edit-field-icon" @click="editFieldHandle"></i>
              </template>
            </el-table-column>
        </el-table>

        <el-pagination
            background
            layout="total, sizes, prev, pager, next, jumper"
            :total='form.total'
            :page-size='form.pageSize'
            :page-sizes="[10, 20, 30]"
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

            <el-row style="border: 1px dashed #ccc; padding: 20px; margin: 20px;">

                <el-col :span="10">

                    <el-input
                        placeholder="输入您想查找的人员"
                        style="margin-bottom: 10px;"
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

                <el-col :span="13" :offset="1">
                
                    <el-table
                        border
                        :data="tableData"
                    >

                        <el-table-column
                            :prop="item.props"
                            :label="item.label"
                            v-for="(item, index) in columnListTree"
                            :key="index">
                        </el-table-column>

                    </el-table>

                </el-col>

            </el-row>

            <el-button type="primary" style="margin: 0 20px;" @click="addPeople">确定</el-button>

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
    pushPeopleFunc
} from '../../assets/js/common';
import pcaa from 'area-data/pcaa';
import { MJ_6, zuzhiUuid } from '../../assets/js/data';
import CustomerNotes from '../Share/CustomerNotes';
export default {
    name: 'reCoverData',
    data() {
        return {
            form: {
                currentPage: 1,
                pageSize: 10,
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
            },
            list: [],
            columnList: [
                { 'prop': 'tel', 'label': '电话数据' },
                { 'prop': 'provinceCity', 'label': '所在地区' },
                { 'prop': 'examItem', 'label': '所属项目' },
                // { 'prop': 'userName', 'label': '所属坐席' },
                { 'prop': 'callDialUp', 'label': '拨通 / 拨打' },
                { 'prop': 'spread', 'label': '来源渠道' },
                { 'prop': 'createTime', 'label': '入库时间' },
                { 'prop': 'lastCallTime', 'label': '最后联系时间' },
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
        }
    },
    components: {
        CustomerNotes,
        PageFieldManage
    },
    created() {
        const uuid = localStorage.getItem('userUuid');
        this.form.userUuid = uuid;
        this.form.num = this.$store.state.pageNum
        this.getRecoveryPoolDataList();
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
            this.$smoke_get(getRuleItem, {}).then(res => {
                if(res.code == 200){
                    this.ruleNumberNameList = res.data;
                }
            })
        },
        customerInfo(row) {
            this.drawer = true;
            this.clueDataSUuid = row.clueDataSUuid;
            this.followFlag = false;
        },
        handleAddClick(row) {
            this.drawer = true;
            this.clueDataSUuid = row.clueDataSUuid;
            this.followFlag = true;
            this.comMode = '微信沟通';
            this.examItem = row.examItemId;
        },
        changeDrawer(val){
            // console.log(val);
            this.drawer = val;
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
        .people-screen{
            margin-bottom: .3rem;
            .screen-li{
                width: 90%;
            }
        }
    }
    .el-pagination{
        text-align: right;
        margin-top: .4rem;
    }
</style>