<template>
    <div class="main-area">

        <el-container class="index-main">

            <el-main>

                <div class="people-title">坐席数据管理</div>

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
                        
                        <el-select v-model="form.dialState" placeholder="请选择是否首咨" class="screen-li">
                            <el-option
                              v-for="item in dialStateList"
                              :key="item.name"
                              :label="item.name"
                              :value="item.number">
                            </el-option>
                        </el-select>

                    </el-col>

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
                        <el-button type="primary" @click="getAllUserClueData" class="screen-li">搜 索</el-button>
                    </el-col>

                    <el-col :span="4">
                        <div style="color: #fff; user-select: none;">1</div>
                    </el-col>

                    <el-col :span="4">
                        <div style="color: #fff; user-select: none;">1</div>
                    </el-col>

                    <el-col :span="4">
                        <el-button type="primary" @click="TransferToGoogClick" class="screen-li">转至公池</el-button>
                    </el-col>

                </el-row>

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
                      prop="phone"
                      label="电话数据"
                      width="100">
                    </el-table-column>

                    <el-table-column prop="phoneIcon" label="" width="50px;">
                        <template slot-scope="scope">
                            <el-tooltip effect="dark" content="复制手机号码" placement="top">
                                <i class="el-icon-document-copy" style="cursor: pointer;" @click="phoneCopy(scope.row)"></i>
                            </el-tooltip>
                      </template>
                    </el-table-column>
                    
                    <el-table-column
                      :prop="item.prop"
                      :label="item.label"
                      :width="item.label == '最后联系时间' ? '110px ' : item.label == '拨通 / 拨打' ? '100px' : ''"
                      v-for="(item, index) in columnList"
                      :key="index"
                      >
                    </el-table-column>
                    <el-table-column prop="active" label="操作" width="200px;">
                      <template slot-scope="scope">
                          <el-button @click="customerInfo(scope.row)" type="text" >客户信息</el-button>
                          <el-button @click="handleAddClick(scope.row)" type="text" >添加备注</el-button>
                      </template>
                    </el-table-column>
                </el-table>

                <el-pagination
                    background
                    layout="total, sizes, prev, pager, next, jumper"
                    style="text-align: right; margin-top: 20px;"
                    :total='form.total'
                    :page-size='form.pageSize'
                    :page-sizes="[10, 20, 30]"
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
                    :comMode='comMode'
                    :callLogUuid='callLogUuid'
                    @fatherDataList='getAllUserClueData'
                >
                </CustomerNotes>

            </el-main>

        </el-container>

    </div>
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
import { timestampToTime, backType, workingLifeText, evidencePurposeText, genderText, copyData } from '../../assets/js/common';
import pcaa from 'area-data/pcaa';
import { MJ_6 } from '../../assets/js/data';
import CustomerNotes from '../Share/CustomerNotes';
export default {
    name: 'seatData',
    data() {
        return {
            form: {
                currentPage: 1,
                pageSize: 10,
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
                userUuid: ''
            },
            totalFlag: false,
            dialStateList: [
                { 'name': '首咨', 'number': 0 },
                { 'name': '非首咨', 'number': 1 },
            ],
            ruleNumberNameList: [], //分配组数组
            list: [],
            columnList: [
                { 'prop': 'provinceCity', 'label': '所在地区' },
                { 'prop': 'examItem', 'label': '所属项目' },
                { 'prop': 'userName', 'label': '所属坐席' },
                { 'prop': 'callDialUp', 'label': '拨通 / 拨打' },
                { 'prop': 'spread', 'label': '来源渠道' },
                { 'prop': 'createTime', 'label': '创建时间' },
                { 'prop': 'lastCallTime', 'label': '最后联系时间' },
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
        }
    },
    components: {
        CustomerNotes
    },
    created() {
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
        getAllUserClueData() {
            this.fullscreenLoading = true;
            this.$smoke_post(getAllUserClueData, this.form).then(res => {
                if(res.code == 200) {
                    setTimeout(() => {
                        this.fullscreenLoading = false;
                        res.data.list.map(sll => {
                            sll.lastCallTime = timestampToTime(Number(sll.lastCallTime));
                            sll.createTime = timestampToTime(Number(sll.createTime));
                            sll.dataType = backType(sll.dataType);
                            sll.provinceCity = sll.province == '' ? '- -' : sll.province + ' / ' + sll.city;
                            sll.callDialUp = sll.dialUpNum + '/' + sll.callNum;
                        })
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
            console.log(row);
            this.drawer = true;
            this.clueDataSUuid = row.clueDataSUuid;
            this.followFlag = false;
        },
        handleAddClick(row) {
            console.log(row);
            this.drawer = true;
            this.clueDataSUuid = row.clueDataSUuid;
            this.followFlag = true;
            this.comMode = '微信沟通';
            this.examItem = row.examItemId;
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
        handleClose(done) {
            done();
        },
        handleCurrentChange(index) {
            console.log(index);
            this.form.currentPage = index;
            this.getAllUserClueData();
        },
        handleSizeChange(index) {
            console.log(index);
            this.form.pageSize = index;
            this.getAllUserClueData();
        },
        changeDrawer(val){
            // console.log(val);
            this.drawer = val;
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
        TransferToGoogClick() {
            let userCDARUuidArr = [];
            this.$refs.tableSelect.selection.map(sll => {
                userCDARUuidArr.push(sll.userCDARUuid);
            });
            if(userCDARUuidArr.length == 0) {
                this.$message({
                    type: 'error',
                    message: '请您先勾选您要转至公池的数据'
                })
            }else{
                this.$smoke_post(clueDataRelease, {
                    list: userCDARUuidArr
                }).then(res => {
                    console.log(res);
                    if(res.code == 200) {
                        this.$message({
                            type: 'success',
                            message: '数据转至公池成功'
                        })
                        this.getAllUserClueData();
                    }
                })
            }
        },
        phoneCopy(row) {
            console.log(row.clueDataSUuid);
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
    .main-area{
        .index-main{
            height: calc( 100vh - 60px);
            .people-title{
                width: calc( 100vw - 3.8rem);
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