<template>
    <el-main class="index-main">
        <el-row class="handle-area" :gutter="20">

            <el-col :span="5">
                <el-date-picker
                    size="small"
                    style="width: 97%;"
                    v-model="dataPicker"
                    type="datetimerange"
                    range-separator="至"
                    :default-time="['00:00:00', '23:59:59']"
                    @change="datePickerChange"
                    start-placeholder="入库时间"
                    end-placeholder="入库时间">
                </el-date-picker>
            </el-col>

            <el-col :span="3">

                <el-autocomplete
                    clearable
                    size="small"
                    class="screen-li"
                    v-model="form.examItemText"
                    :fetch-suggestions="querySearch"
                    placeholder="输入考试项目"
                    :trigger-on-focus="true"
                    @select="handleSelect"
                    @clear="autocompleteClear"
                ></el-autocomplete>

            </el-col>

            <el-col :span="3">
                <el-input v-model.trim="form.tel" size="small" placeholder="请输入手机号" class="screen-li"></el-input>
            </el-col>

            <el-col :span="3" class="seatData">
                <area-cascader type="text" placeholder="请选择地区" :class="['screen-li', {'areaSelected': form.city, 'areaDefault': !form.city}]" v-model="form.provinceCity" @change="cityChange" :data="pcaa"></area-cascader>
            </el-col>

            <el-col :span="3">
                
                <el-autocomplete
                    clearable
                    size="small"
                    ref="autocompleteSpread"
                    class="screen-li"
                    v-model="form.spreadText"
                    :fetch-suggestions="querySearchSpread"
                    placeholder="输入推广渠道"
                    :trigger-on-focus="true"
                    @select="handleSelectSpread"
                    @clear="autocompleteClearSpread"
                ></el-autocomplete>

            </el-col>

            <el-col :span="3">

                <el-select v-model="form.ruleNumberName" size="small" placeholder="请选择分配组" class="screen-li" clearable>
                    <el-option
                      v-for="item in ruleNumberNameList"
                      :key="item.name"
                      :label="item.name"
                      :value="item.ruleNumberName">
                    </el-option>
                </el-select>

            </el-col>

            <el-col :span="2">
                <el-button type="primary" size="small" @click="getSpillPoolClueDataClick">查 询</el-button>
            </el-col>

            <el-col :span="2">
                <svg-icon class="border-icon smoke-fr" @click="pushArrClick" icon-title="分配至组" icon-class="togroup" />
                <svg-icon class="border-icon smoke-fr" @click="pushPeopleClick" icon-title="分配至人" icon-class="toperson" />
            </el-col>

        </el-row>

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

        <el-drawer
            :title="drawerTitle2"
            :visible.sync="drawer2"
            :direction="direction2"
            :before-close="handleClose"
        >
            <span class="bullets"></span>

            <div class="tagName">您已选择<span style="color: #409EFF"> {{this.tableSelectList.length}} </span>条数据</div>
 
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
            style="width: 100%;"
            class="mt20"
            :height="tableHeight">
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
            :current-page="form.currentPage"
            :page-sizes="[10, 20, 30, 50, 100]"
            :hide-on-single-page="totalFlag"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
        >
        </el-pagination>

    </el-main>
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
import { MJ_6, zuzhiUuid } from '../../assets/js/data';
export default {
    name: 'overflow',
    props: ['tableHeight','toggleAction', 'hideSearch'],
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
                spreadText: '',
            },
            totalFlag: false, //当只有一页时隐藏分页
            list: [],
            columnList: [
                { 'prop': 'tel', 'label': '手机号码' },
                { 'prop': 'provinceCity', 'label': '所在地区' },
                { 'prop': 'examItem', 'label': '考试项' },
                { 'prop': 'spread', 'label': '推广渠道' },
                { 'prop': 'createTime', 'label': '入库时间' },
                { 'prop': 'ruleNumberName', 'label': '所属分配组' },
                { 'prop': 'orderNumber', 'label': '订单数量' },
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
        const seatDataPageSize = localStorage.getItem('seatDataPageSize');
        if(seatDataPageSize) {
            this.form.pageSize = Number(seatDataPageSize);
        }else{
            this.form.pageSize = 20;
        }
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
                uuid: zuzhiUuid
            }).then(res => {
                if(res.code == 200) {
                    this.treeData = pushPeopleFunc(res.data.list);
                }
            })
        },
        getSpillPoolClueDataClick() {
            this.form.currentPage = 1;
            this.getSpillPoolClueData();
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
                            sll.orderNumber = sll.orderNumber != 0 ? sll.orderNumber : '- -';
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
            this.$smoke_get(getRuleItem, {
                type: ''
            }).then(res => {
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
            this.$confirm('确认要分配给该组吗？')
            .then(_ => {
                this.spillPoolActClueRule(item.ruleNumberName);
            })
            .catch(_ => {});
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
                            message: '提交的线索数量' + res.data.allocationSize + '条' + '，实际获取的线索数量' + res.data.allocatedSize + '条'
                        });
                        this.getSpillPoolClueData();
                    }else{
                        this.$message({
                            type: 'error',
                            message: res.data.msg
                        })
                        this.getSpillPoolClueData();
                    }
                    this.drawer2 = false;
                }else{
                    this.$message({
                        type: 'error',
                        message: res.data.msg
                    })
                    this.drawer2 = false;
                }
            })
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
        querySearchSpread(queryString, cb){
            var restaurants = JSON.parse(JSON.stringify(this.enumList['MJ-6']).replace(/name/g,"value"));
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
        handleSelectSpread(item) {
            this.form.spread = item.number;
            this.form.spreadText = item.value;
        },
        autocompleteClear() {
            this.form.examItemId = '';
        },
        autocompleteClearSpread() {
            this.$nextTick(() => {
                this.$refs.autocompleteSpread.$children
                    .find(c => c.$el.className.includes('el-input'))
                    .blur();
                this.form.spread = '';
                this.$refs.autocompleteSpread.focus();
            })
        },
        cityChange() {
            this.form.province = this.form.provinceCity[0];
            this.form.city = this.form.provinceCity[1];
        },
        handleSizeChange(index) {
            this.form.pageSize = index;
            this.form.currentPage = 1;
            localStorage.setItem('seatDataPageSize', index);
            this.getSpillPoolClueData();
        },
        handleCurrentChange(index) {
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
                                message: '提交的线索数量' + res.data.allocationSize + '条' + '，实际获取的线索数量' + res.data.allocatedSize + '条'
                            });
                            this.getSpillPoolClueData();
                        }else{
                            this.$message({
                                type: 'error',
                                message: res.data.msg
                            })
                            this.getSpillPoolClueData();
                        }
                        this.drawer1 = false;
                    }else{
                        this.$message({
                            type: 'error',
                            message: res.data.msg
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
    .index-main{
        margin-top: 15px;
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
            .smoke-cascader{
                height: 40px !important;
                line-height: 40px !important;
                .area-select{
                    height: 40px !important;
                    line-height: 40px !important;
                }
            }
        }
        .tagName{
            height: 40px;
            background: #FAFAFA;
            text-align: center;
            font-size: 14px;
            line-height: 40px;
            letter-spacing: 2px;
        }
        .tagActive{
            color: red !important;
        }
    }
</style>