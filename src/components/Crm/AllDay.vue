<template>
    <el-main class="index-main">

        <Start></Start>
        <el-row  :class="['people-screen', {actionHide: toggleAction, actionShow: !toggleAction, noSearch: hideSearch}]" id="searchArea">

            <el-col :span="3">
                <el-input v-model="form.tel" size="small" placeholder="请输入手机号" class="screen-li"></el-input>
            </el-col>

            <el-col :span="3">
                <el-input v-model="form.name" size="small" placeholder="请输入姓名" class="screen-li"></el-input>
            </el-col>

            <el-col :span="3">

                <el-select v-model="form.dialState" size="small" placeholder="选择是否首咨" class="screen-li" clearable>
                    <el-option
                      v-for="item in dialStateList"
                      :key="item.name"
                      :label="item.name"
                      :value="item.number">
                    </el-option>
                </el-select>

            </el-col>

            <el-col :span="3">

                <el-select v-model="form.education" size="small" placeholder="选择最高学历" class="screen-li" clearable>
                    <el-option
                      v-for="item in enumList['MJ-1']"
                      :key="item.name"
                      v-if="item.enable"
                      :label="item.name"
                      :value="item.number">
                    </el-option>
                </el-select>

            </el-col>

            <el-col :span="3">

                <el-select v-model="form.workingLife" size="small" placeholder="选择工作年限" class="screen-li" clearable>
                    <el-option
                      v-for="item in enumList['MJ-2']"
                      :key="item.name"
                      v-if="item.enable"
                      :label="item.name"
                      :value="item.number">
                    </el-option>
                </el-select>

            </el-col>

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

                <el-select v-model="form.ruleNumberName" size="small" filterable placeholder="选择分配组" class="screen-li" clearable>
                    <el-option
                      v-for="item in ruleNumberNameList"
                      :key="item.name"
                      :label="item.name"
                      :value="item.ruleNumberName">
                    </el-option>
                </el-select>

            </el-col>

            <el-col :span="3">

                <el-select @change="selectTimeChange" size="small" v-model="form.selectTime" placeholder="选择未联间隔" class="screen-li" clearable>
                    <el-option
                      v-for="item in selectTimeList"
                      :key="item.name"
                      :label="item.name"
                      :value="item.number">
                    </el-option>
                </el-select>

            </el-col>

        </el-row>

        <el-row class="people-screen">

            <el-col :span="3">

                <el-select v-model="form.orderState" size="small" class="screen-li"  placeholder="选择成单状态" clearable >
                    <el-option
                      v-for="item in orderStateList"
                      :key="item.name"
                      :label="item.name"
                      :value="item.number">
                    </el-option>
                </el-select>

            </el-col>

            <el-col :span="16">

                <el-tag
                    v-for="(item,index) in searchList" :key="item.id"
                    :class="tag_id == item.id ? 'tag_class tag_default_class' : 'tag_default_class'"
                    type="info"
                    effect="plain"
                    @click="tagClick(item)"
                    >{{item.name}}
                </el-tag>

                <el-button type="primary" style="margin-left: 10px;" size="small" @click="getClueDataAllClick">查 询</el-button>

            </el-col>

            <el-col :span="5">
                <svg-icon class="border-icon smoke-fr" @click="editFieldHandle" icon-title="表头管理" icon-class="field" />
                <svg-icon class="border-icon smoke-fr" @click="clueDataReleaseAllClick" icon-title="释放数据" icon-class="release-grey" />
            </el-col>

        </el-row>

        <div class="full_msg" v-if="fullLib">您的客户数量已达{{libStandard}}，请释放，否则不能接收新数据。</div>

        <div class="number_search" v-if="tag_flag"><svg-icon style="font-size: 14px; margin-left: 10px; cursor: default;" icon-title="" icon-class="tanhao" />本次查询出【{{tag_name}}】总人数{{SeatWorkObj.clueDataNum}}，拨打人数{{SeatWorkObj.callNum}}，接通人数{{SeatWorkObj.callOpenNum}}，成交人数{{SeatWorkObj.orderNum}}</div>

        <el-table
            :data="list"
            v-loading="fullscreenLoading"
            :row-class-name="tableRowClassName"
            style="width: 100%"
            ref="tableSelect"
            :height="tableHeight"
            >

            <el-table-column
              type="selection"
              width="45">
            </el-table-column>

            <el-table-column prop="clueConSign" label="标记" fixed="left" width="70" class-name="table_active">
                <template slot-scope="scope">

                <select @change="clueConSignChange(scope.row)" v-model="scope.row.clueConSign" class="smoke-select">
                    <option
                      v-for="item in enumList['MJ-16']"
                      :key="item.name"
                      v-if="item.enable"
                      :label="item.name"
                      :value="Number(item.number)">
                    </option>
                </select>

                </template>
            </el-table-column>

            <el-table-column
              :prop="item.props"
              v-for="(item, index) in columnList"
              :min-width="item.width"
              :show-overflow-tooltip="item.props == 'notes' ? true : false"
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
                    <span><svg-icon class="copy-tel" v-if="item.props == 'tel'" icon-class="copy" icon-title="复制手机号码" @click="phoneCopy(scope.row)" /></span>

              </template>
            </el-table-column>

            <el-table-column prop="active" label="操作" fixed="right" width="110" class-name="table_active">
                <template slot-scope="scope">
                <svg-icon icon-title="手机外拨" @click="phoneOut(scope.row)" icon-class="takephone" />
                <svg-icon icon-title="座机外拨" @click="seatOut(scope.row)" icon-class="landline" />
                  <el-popconfirm
                    confirmButtonText='确定'
                    cancelButtonText='取消'
                    icon="el-icon-info"
                    iconColor="red"
                    placement="top"
                    title="确认释放该数据吗？"
                    @onConfirm="release(scope.row)"
                  >
                <svg-icon slot="reference" icon-title="释放数据" icon-class="release" />
                  </el-popconfirm>
                    <!-- <svg-icon @click="customerInfo(scope.row)" icon-title="客户信息" icon-class="members" /> -->
                    <svg-icon @click="handleAddClick(scope.row)" icon-title="添加备注" icon-class="addnotes" />
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

        <CustomerNotes
            v-if="drawer"
            @changeDrawer="changeDrawer"
            @phoneCopy="phoneCopy"
            @phoneOut='phoneOut'
            @seatOut='seatOut'
            @release='release'
            :scopeRow='scopeRow'
            :followFlag='followFlag'
            :drawer.sync='drawer'
            :userUuid='form.userUuid'
            :userId="userId"
            :schoolId='schoolId'
            :examItem='examItem'
            :clueDataSUuid='clueDataSUuid'
            :userCDARUuid='userCDARUuid'
            :comMode='comMode'
            :callLogUuid='callLogUuid'
            @fatherDataList='getClueDataAll'
        >
        </CustomerNotes>

        <PageFieldManage :setPageNum="setPageNum" />

    </el-main>

</template>

<script>
import {
    getClueDataAll,
    phoneOut,
    seatOut,
    clueDataRelease,
    enumByEnumNums,
    getRuleItem,
    getClueDataNumber,
    copyTel,
    geSeatWork,
    clueContactSign
} from '../../request/api';
import PageFieldManage from '@/components/Base/PageFieldManage';
import Start from '../../components/Share/Start';
import {
    receiveTimeFun
} from '../../assets/js/common';
import { MJ_1, MJ_2, MJ_16, MJ_5 } from '../../assets/js/data';
import CustomerNotes from '../Share/CustomerNotes';
import Copy from 'copy-util';
export default {
    name: 'AllDay',
    props: ['tableHeight','toggleAction', 'hideSearch'],
    components: {
        Start,
        CustomerNotes,
        PageFieldManage,
    },
    // watch:{
    //     '$store.state.editFieldVisible'(val){
    //         if(!val && this.$store.state.pageNum == 'YM_1'){
    //             this.getClueDataAll()
    //         }
    //     }
    // },
    data() {
        return {
            fieldNum: [],
            form: {
                currentPage: 1,
                pageSize: 20,
                total: null,
                userUuid: '',
                tel: '',
                endTime: '', //筛选条件结束条件
                startTime: '', //筛选条件开始条件
                name: '',
                dialState: '', //是否首咨（0：首咨 1：非首咨）
                education: '', //最高学历
                workingLife: '', //工作年限
                selectTime: '', //未联间隔
                ruleNumberName: '', //分配组组名
                num: '',
                sortSet: [],
                dataType: '', //数据类型（1：首咨 2：回收池）
                receiveStartTime: '', //领取时间的查询开始时间（13位）
                receiveEndTime: '', //领取时间的查询结束时间（13位）
                intentionLevel: '', //意向等级
                orderState: 0,//成单状态
            },
            totalFlag: false,
            ruleNumberNameList: [], //分配组数组
            selectTimeList: [
                { 'name': '今日已联', 'number': 0 },
                { 'name': '1-3日未联', 'number': 1 },
                { 'name': '4-6日未联', 'number': 2 },
                { 'name': '7-10日未联', 'number': 3 },
            ],
            dialStateList: [
                { 'name': '首咨', 'number': 0 },
                { 'name': '非首咨', 'number': 1 },
            ],
            orderStateList: [
                { 'name': '未成单', 'number': 0 },
                { 'name': '已成单', 'number': 1 },
            ],
            list: [],
            columnList: [
                {'label': '' }
            ],
            initOptions: {},

            followFlag: false,
            drawer: false,
            clueDataSUuid: '',
            callLogUuid: '',
            comMode: '',
            schoolId: '',
            userId: '',
            examItem: '',
            userCDARUuid: '',
            scopeRow: {},

            enumList: {},
            fullscreenLoading: false,
            clueDataNumberList: [],
            searchList: [
                { name: '今日首咨', id: 1 },
                { name: '2~3天数据', id: 2 },
                { name: '4~7天数据', id: 3 },
                { name: '8~14天数据', id: 4 },
                { name: '14天以上数据', id: 5 },
                { name: '公海领取数据', id: 6 },
            ],
            tag_id: '',
            tag_name: '',
            tag_flag: false,
            tag_gonghai_flag: false,
            SeatWorkObj: {},
            fullLib: false,
            libStandard: 0
        }
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
        // this.getClueDataNumber();
        this.getClueDataAll();
        const initOptions = localStorage.getItem('initOptions');
        this.initOptions = JSON.parse(initOptions);
        let arr = [MJ_1, MJ_2, MJ_16, MJ_5];
        this.enumByEnumNums(arr);
        this.getRuleItem();
    },
    mounted() {

    },
    methods: {
        clueConSignChange(row) {
            this.clueContactSign(row.clueConSign, row.userCDARUuid);
        },
        clueContactSign(clueConSign, userCDARUuid) {
            this.$smoke_post(clueContactSign, {
                start: clueConSign,
                userCDARUuid: userCDARUuid
            }).then(res => {
                if(res.code == 200) {
                    this.$message({
                        type: 'success',
                        message: '标记成功'
                    })
                }else{
                    this.$message({
                        type: 'error',
                        message: res.msg
                    })
                }
            })
        },
        tagClick(item){
            this.tag_flag = false;
            this.tag_gonghai_flag = false;
            if(this.tag_id == item.id) {
                this.tag_id = '';
                this.tag_name = '';
            }else{
                this.tag_id = item.id;
                this.tag_name = item.name;
            }
        },
        setPageNum(pageNum){
            this.form.num = pageNum
        },
        editFieldHandle(){
            this.$store.commit('setEditFieldVisible', true)
        },
        handleCurrentChange(index) {
            this.form.currentPage = index;
            this.getClueDataAll();
        },
        handleSizeChange(index) {
            this.form.pageSize = index;
            this.form.currentPage = 1;
            localStorage.setItem('seatDataPageSize', index);
            this.getClueDataAll();
        },
        selectTimeChange(value) {
            const time = new Date(new Date().toLocaleDateString()).getTime();
            const oneTime = time - ( 3600 * 1000 * 24 * 1 );
            const threeTime = time - ( 3600 * 1000 * 24 * 3 );
            const fourTime = time - ( 3600 * 1000 * 24 * 4 );
            const sixTime = time - ( 3600 * 1000 * 24 * 6 );
            const sevenTime = time - ( 3600 * 1000 * 24 * 7 );
            const tenTime = time - ( 3600 * 1000 * 24 * 10 );
            if(value == 0) {
                this.form.startTime = time;
                this.form.endTime = '';
            }
            if(value == 1) {
                this.form.startTime = threeTime;
                this.form.endTime = oneTime;
            }
            if(value == 2) {
                this.form.startTime = sixTime;
                this.form.endTime = fourTime;
            }
            if(value == 3) {
                this.form.startTime = tenTime;
                this.form.endTime = sevenTime;
            }
            if(value.length == 0) {
                this.form.startTime = '';
                this.form.endTime = '';
            }
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
        enumByEnumNums(arr) {
            this.$smoke_post(enumByEnumNums, {
                numberList: arr
            }).then(res => {
                if(res.code == 200){
                    this.enumList = res.data;
                }
            })
        },
        //客户信息
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
            this.userId = row.customerId;
            this.examItem = row.examItemId;
            this.scopeRow = row;
        },
        changeDrawer(val){
            this.drawer = val;
            this.getClueDataAll();
        },
        getClueDataNumber() {
            let arr = [];
            this.$smoke_get(getClueDataNumber, {}).then(res => {
                if(res.code == 200) {
                    for(let i in res.data) {
                        arr.push(res.data[i]);
                    }
                    this.clueDataNumberList = arr;
                    this.getClueDataAll();
                }else{
                    this.getClueDataAll();
                }
            })
        },
        getClueDataAllClick() {
            this.form.currentPage = 1;
            const obj = receiveTimeFun(this.tag_id);
            this.form.receiveStartTime = obj.receiveStartTime;
            this.form.receiveEndTime = obj.receiveEndTime;
            if(this.tag_id == 6) {
                this.form.dataType = 2;
                this.tag_gonghai_flag = true;
                this.geSeatWork();
            }else if(this.tag_id == ''){
                this.form.dataType = '';
            }else{
                this.form.dataType = 1;
                this.geSeatWork();
            }
            this.getClueDataAll();
        },
        geSeatWork() {
            this.$smoke_post(geSeatWork, {
                dataType: this.form.dataType,
                receiveStartTime: this.form.receiveStartTime,
                receiveEndTime: this.form.receiveEndTime,
            }).then(res => {
                if(res.code == 200) {
                    this.tag_flag = true;
                    this.SeatWorkObj = res.data;
                }else{
                    this.tag_flag = false;
                    this.$message({
                        type: 'error',
                        message: res.msg
                    })
                }
            })
        },
        getClueDataAll() {
            this.fullscreenLoading = true;
            this.drawer = false;
            this.$smoke_post(getClueDataAll, this.form).then(res => {
                if(res.code == 200) {
                    setTimeout(() => {
                        this.fullscreenLoading = false;
                        this.columnList = res.data.filedList;
                        this.schoolId = res.data.schoolId;
                        res.data.list.map(sll => {
                            sll.clueConSign = sll.clueConSign == 0 ? '' : sll.clueConSign
                        })
                        this.list = res.data.list;
                        this.form.total = res.data.total;
                        if(this.tag_flag && this.fullLib){
                            this.$emit('setTableHeight', res.data.total, 3.2, 1)
                        }else if(this.tag_flag || this.fullLib){
                            this.$emit('setTableHeight', res.data.total, 2.2, 1)
                        }else{
                            this.$emit('setTableHeight', res.data.total, 1, 1)
                        }
                    }, 300);
                    // 提示
                    if(res.data.userDataCount >= res.data.userDataStandard) {
                        this.libStandard = res.data.userDataStandard
                        this.fullLib = true
                    }else{
                        this.fullLib = false
                    }

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
        tableSort(type, props){
            this.form.sortSet = []
            this.form.sortSet.push({[props]: type === 'ascending' ? 'ASC' : 'DESC'})
            this.getClueDataAll()
        },
        release(scope) {
            let arr = [];
            arr.push(scope.userCDARUuid);
            this.clueDataRelease(arr);
        },
        clueDataReleaseAllClick() {
            let arr = [];
            if(this.tag_gonghai_flag) {
                this.$refs.tableSelect.selection.map(sll => {
                    arr.push(sll.userCDARUuid);
                });
                if(arr.length == 0) {
                    this.$message({
                        type: 'error',
                        message: '请您先勾选您要释放的数据'
                    })
                }else{
                    this.clueDataRelease(arr);
                }
            }else{
                this.$message({
                    type: 'error',
                    message: '请您先查询公海领取的数据'
                })
            }
        },
        clueDataRelease(arr) {
            this.$smoke_post(clueDataRelease, {
                list: arr
            }).then(res => {
                if(res.code == 200) {
                    if(res.data.result){
                        this.$message({
                            type: 'success',
                            message: '释放成功，提交的线索数量' + res.data.submitSize + '条' + '，实际释放的线索数量' + res.data.releaseSize + '条'
                        });
                        this.getClueDataAll();
                    }else{
                        this.$message({
                            type: 'error',
                            message: res.data.msg
                        });
                        this.getClueDataAll();
                    }
                }else{
                    this.$message({
                        type: 'error',
                        message: res.msg
                    })
                }
            })
        },
        phoneOut( scope ) {
            if(this.initOptions != undefined){
                this.$smoke_post(phoneOut, {
                    adminUin: this.initOptions.adminUin,
                    uin: this.initOptions.uin,
                    uuid: scope.userCDARUuid,
                }).then(res => {
                    if(res.code == 200){
                        if(res.data.result){
                            this.callLogUuid = res.data.callLogUuid;
                            this.clueDataSUuid = scope.clueDataSUuid;
                            this.userCDARUuid = scope.userCDARUuid;
                            this.drawer = true;
                            this.followFlag = true;
                            this.comMode = '手机外呼';
                            this.examItem = scope.examItem;
                            this.scopeRow = scope;
                        }else{
                            this.$message({
                                type: 'error',
                                message: '目前服务线路忙，请稍后重试'
                            })
                        }
                    }else{
                        this.$message({
                            type: 'error',
                            message: res.msg
                        })
                    }
                })
            }else{
                this.$message({
                    type: 'error',
                    message: '请联系主管配置jq账号'
                })
            }
        },
        seatOut( scope ) {
            if(this.initOptions != undefined){
                this.$smoke_post(seatOut, {
                    adminUin: this.initOptions.adminUin,
                    uin: this.initOptions.uin,
                    uuid: scope.userCDARUuid,
                }).then(res => {
                    if(res.code == 200){
                        if(res.data.result){
                            this.callLogUuid = res.data.callLogUuid;
                            this.clueDataSUuid = scope.clueDataSUuid;
                            this.userCDARUuid = scope.userCDARUuid;
                            this.drawer = true;
                            this.followFlag = true;
                            this.comMode = '座机外呼';
                            this.examItem = scope.examItem;
                            this.scopeRow = scope;
                        }else{
                            this.$message({
                                type: 'error',
                                message: '目前服务线路忙，请稍后重试'
                            })
                        }
                    }else{
                        this.$message({
                            type: 'error',
                            message: res.msg
                        })
                    }
                })
            }else{
                this.$message({
                    type: 'error',
                    message: '请联系主管配置jq账号'
                })
            }
        },
        tableRowClassName({row}) {
            if (row.dialState == 0 && row.orderState == 0) {
                return 'dialState';
            }
            return '';
        },
        phoneCopy(row) {
            this.copyTel(row.clueDataSUuid);
        },
        copyTel(id) {
            this.$smoke_post(copyTel, {
                uuid: id
            }).then(res => {
                if(res.code == 200) {
                    Copy(res.data);
                    if(Copy(res.data)) {
                        this.$message({
                            type: 'success',
                            message: '复制成功'
                        })
                    }else{
                        this.$message({
                            type: 'error',
                            message: '复制失败'
                        })
                    }
                }else{
                    this.$message({
                        type: 'error',
                        message: res.msg
                    })
                }
            })
        },
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
            margin-bottom: 10px;
            .screen-li{
                width: 94%;
            }
        }
        .el-button{
          margin-left: 5px;
        }
        .edit-field-icon{
          color: #5cb6ff;
          font-size: 20px;
          cursor: pointer;
        }
        .full_msg{
            color: #f56c6c;
            padding: 5px;
            margin-bottom: 10px;
            border: 1px solid #f56c6c;
            background-color: #fef0f0;
        }
    }
</style>
