<template>
    <div class="main-area">

        <el-container class="index-main">

            <el-main>

                <div class="people-title">溢出池数据管理</div>

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
                        <area-cascader type="text" class="screen-li smoke-cascader" v-model="form.provinceCity" @change="cityChange" :data="pcaa"></area-cascader>
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
                        <el-button type="primary" @click="getSpillPoolClueData" class="screen-li">搜 索</el-button>
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

                    <el-col :span="4">
                        <el-button type="primary" @click="pushArrClick" class="screen-li">分配至组</el-button>
                    </el-col>

                </el-row>

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

                <el-drawer
                    :title="drawerTitle2"
                    :visible.sync="drawer2"
                    :direction="direction2"
                    :before-close="handleClose"
                >

                    <div class="tagName">您已选择 {{this.tableSelectList.length}} 条数据</div>
 
                    <el-tag 
                        v-for="(item,index) in ruleNumberNameListAll" :key="index"
                        style="margin-left: 20px; cursor: pointer; margin-top: 20px;"
                        :class="item.mainUin ? 'tagActive' : ''"
                        @click="tagClick(item)"
                        >{{item.name}}
                    </el-tag>

                </el-drawer>

                <el-table
                    :data="list"
                    ref="tableSelect"
                    v-loading="fullscreenLoading"
                    style="width: calc( 100vw - 3.8rem)">
                    <el-table-column
                      type="selection"
                      width="45">
                    </el-table-column>
                    <el-table-column
                      :prop="item.prop"
                      :label="item.label"
                      v-for="(item, index) in columnList"
                      :key="index"
                      >
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

            </el-main>

        </el-container>

    </div>
</template>

<script>
import { 
    getSpillPoolClueData, 
    getClueDataDetails,
    getExamBasic,
    enumByEnumNums,
    getRuleItem,
    getRuleItemAuth,
    getRuleUserStructureLimit,
    spillPoolActSeat,
    spillPoolActClueRule,
} from '../../request/api';
import { 
    timestampToTime, 
    backType, 
    workingLifeText, 
    evidencePurposeText, 
    genderText,
    pushPeopleFunc,
    removeEvery
} from '../../assets/js/common';
import pcaa from 'area-data/pcaa';
import { MJ_6 } from '../../assets/js/data';
export default {
    name: 'overflow',
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
            },
            totalFlag: false, //当只有一页时隐藏分页
            list: [],
            columnList: [
                { 'prop': 'tel', 'label': '电话数据' },
                { 'prop': 'provinceCity', 'label': '所在地区' },
                { 'prop': 'examItem', 'label': '考试项' },
                { 'prop': 'spread', 'label': '来源渠道' },
                { 'prop': 'createTime', 'label': '入库时间' },
                { 'prop': 'ruleNumberName', 'label': '所属分配组' },
            ],
            dataPicker: [],
            ruleNumberNameList: [], //分配组数组
            ruleNumberNameListAll: [], //分配组数组（带权限）
            restaurants: [],
            pcaa: null, //省市数据
            enumList: {},
            dataPicker: [],
            fullscreenLoading: false,
            drawerTitle1: '分配至人',
            drawer1: false,
            direction1: 'rtl',
            drawerTitle2: '分配至组',
            drawer2: false,
            direction2: 'rtl',
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
        }
    },
    created() {
        this.getSpillPoolClueData();
        this.getExamBasic();
        let arr = [MJ_6];
        this.enumByEnumNums(arr);
        this.pcaa = pcaa;
        this.getRuleItem();
        this.getRuleItemAuth();
    },
    methods: {
        getRuleUserStructureLimit() {
            this.$smoke_post(getRuleUserStructureLimit, {
                uuid: '2a39b4c564494c58a0b15512a62e7014'
            }).then(res => {
                if(res.code == 200) {
                    this.treeData = pushPeopleFunc(res.data.list);
                }
            })
        },
        getSpillPoolClueData() {
            this.fullscreenLoading = true;
            this.$smoke_post(getSpillPoolClueData, this.form).then(res => {
                if(res.code == 200) {
                    setTimeout(() => {
                        this.fullscreenLoading = false;
                        res.data.list.map(sll => {
                            sll.createTime = timestampToTime(Number(sll.createTime));
                            sll.provinceCity = sll.province == '' ? '- -' : sll.province + ' / ' + sll.city;
                        })
                        this.list = res.data.list;
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
        datePickerChange(value) {
            console.log(value);
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
        getRuleItemAuth() {
            this.$smoke_get(getRuleItemAuth, {}).then(res => {
                if(res.code == 200){
                    this.ruleNumberNameListAll = res.data;
                }
            })
        },
        tagClick(item) {
            this.ruleNumberNameListAll.map((res,index) => {
                if(res.ruleNumberName == item.ruleNumberName){
                    res.mainUin = true;
                    this.$forceUpdate();
                }else{
                    res.mainUin = false;
                }
            })
            this.spillPoolActClueRule(item.ruleNumberName);
        },
        spillPoolActClueRule(name) {
            this.$smoke_post(spillPoolActClueRule, {
                clueDataSUuid: this.tableSelectList, //班主任唯一标识
                clueRuleNumber: name, //接收的班主任唯一标识
            }).then(res => {
                if(res.code == 200){
                    if(res.data.result) {
                        res.data.allocationSize = res.data.allocationSize == null ? 0 : res.data.allocationSize;
                        res.data.allocatedSize = res.data.allocatedSize == null ? 0 : res.data.allocatedSize;
                        this.$message({
                            type: 'success',
                            message: res.data.msg + '，提交的线索数量' + res.data.allocationSize + '条' + '，实际获取的线索数量' + res.data.allocatedSize + '条'
                        });
                        this.getSpillPoolClueData();
                    }else{
                        this.$message({
                            type: 'error',
                            message: '目前服务线路忙，请稍后重试'
                        })
                        this.getSpillPoolClueData();
                    }
                    this.drawer2 = false;
                }else{
                    this.$message({
                        type: 'error',
                        message: '目前服务线路忙，请稍后重试'
                    })
                    this.drawer2 = false;
                }
            })
        },
        getExamBasic() {
            let arr;
            this.$smoke_get(getExamBasic, {}).then(res => {
                console.log(res);
                arr = JSON.parse(JSON.stringify(res.data).replace(/name/g,"value"));
                this.restaurants = arr;
            })
        },
        querySearch(queryString, cb) {
            var restaurants = this.restaurants;
            console.log(restaurants);
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
            console.log(item);
            this.form.examItemId = item.id;
        },
        cityChange() {
            console.log(this.form.provinceCity);
            this.form.province = this.form.provinceCity[0];
            this.form.city = this.form.provinceCity[1];
        },
        handleSizeChange(index) {
            console.log(index);
            this.form.pageSize = index;
            this.getSpillPoolClueData();
        },
        handleCurrentChange(index) {
            console.log(index);
            this.form.currentPage = index;
            this.getSpillPoolClueData();
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
        pushArrClick() {
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
                this.drawer2 = true;
                this.tableSelectList = clueDataSUuidArr;
            }
        },
        handleClose(done) {
            done();
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.orgName.indexOf(value) !== -1;
        },
        handleCheckChange(data, value){
            this.getCheckedNodes();
        },
        getCheckedNodes() {
            let arr = [];
            this.$nextTick(() => {
                console.log(this.$refs.tree.getCheckedNodes());
                this.$refs.tree.getCheckedNodes().map(sll => {
                    if(sll.hasOwnProperty('userUin')){ // hasOwnProperty 判断对象是否含有某个属性
                        arr.push(sll);
                    }
                })
                this.tableData = arr;
                console.log(this.tableData);
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
                this.$smoke_post(spillPoolActSeat, {
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
                            this.getSpillPoolClueData();
                        }else{
                            this.$message({
                                type: 'error',
                                message: '目前服务线路忙，请稍后重试'
                            })
                            this.getSpillPoolClueData();
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
    mounted() {
        
    },
    watch: {
        filterText(val) {
            this.$refs.tree.filter(val);
        },
    },
}
</script>

<style lang="less" scoped>
    .main-area{
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
                .smoke-cascader{
                    height: 40px !important;
                    line-height: 40px !important;
                    .area-select{
                        height: 40px !important;
                        line-height: 40px !important;
                    }
                }
            }
        }
    }
    .tagName{
        height: 40px;
        background: #eeeeee;
        text-align: center;
        font-size: 14px;
        line-height: 40px;
        letter-spacing: 2px;
    }
    .tagActive{
        color: red !important;
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
    border-radius: 0px;
    border-radius: 8px;
}
</style>