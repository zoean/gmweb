<template>
    <el-main class="index-main">
        <div class="people-title">{{titleFlag ? titleName : '班主任 - ' + this.$store.state.name + ' - 服务学员'}}</div>
        <el-row type="flex" justify="end">
            <svg-icon class="border-icon" @click="editFieldHandle" icon-title="表头管理" icon-class="field" />
        </el-row>
        <el-tabs v-model="classUuidDefault" @tab-click="handleClassTabClick">
            <el-tab-pane :label="item.text" :name="item.uuid" v-for="(item,index) in tabsList" :key="index"></el-tab-pane>
        </el-tabs>
        <el-table
            :data="list"
            :key="Math.random()" 
            ref="tree"
            v-loading="fullscreenLoading"
            style="width: calc( 100vw - 3.8rem)"
            :row-key="getRowKey">
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
                    <span>{{scope.row[item.props] || '--'}}</span>
                    <!-- <svg-icon class="copy-tel" v-if="item.props == 'tel'" icon-class="copy" icon-title="复制手机号码" @click="phoneCopy(scope.row)" /> -->
                    
              </template>
            </el-table-column>

            <el-table-column prop="active" label="操作" fixed="right" width="100">
              <template slot-scope="scope">

                <el-popconfirm
                    confirmButtonText='确定'
                    cancelButtonText='取消'
                    icon="el-icon-info"
                    placement="top"
                    title="确认拨打该学员电话吗？"
                    :hideIcon='true'
                    @onConfirm="phoneOutTea(scope.row)"
                  >
                    <svg-icon slot="reference" icon-title="手机外拨" icon-class="takephone" />
                </el-popconfirm>

                <el-popconfirm
                    confirmButtonText='确定'
                    cancelButtonText='取消'
                    icon="el-icon-info"
                    placement="top"
                    title="确认拨打该学员电话吗？"
                    :hideIcon='true'
                    @onConfirm="seatOutTea(scope.row)"
                  >
                    <svg-icon slot="reference" icon-title="座机外拨" icon-class="landline" />
                </el-popconfirm>

                <svg-icon @click="studentDetails(scope.row)" icon-title="学员详情" icon-class="detail" />
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
            :title="drawerTitle"
            :visible.sync="drawer"
            :direction="direction"
            size="100%"
            :before-close="handleClose"
        >
            <span class="bullets"></span>

            <el-tabs v-model="tabs_active" @tab-click="handleTabClick" style="width: 94%; margin: 0 auto; margin-bottom: 30px; padding: 20px 30px; border: 1px dashed #ccc;">

                <el-tab-pane label="客户信息" name="first">
                
                    <el-form :model="customerForm" :rules="rules" ref="customerForm">

                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="客户编号" prop="number">
                                    <el-input v-model="customerForm.number" readonly size="small" class="borderNone"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="客户手机" prop="tel">
                                    <el-input v-model="customerForm.tel" readonly size="small" class="borderNone"></el-input>
                                    <!-- <el-tooltip effect="dark" content="复制手机号码" placement="top">
                                        <el-image
                                            style="position: relative; width: 14px;height: 14px; left: 104px; top: -38px; cursor: pointer;"
                                            @click="phoneCopyFun"
                                            :src="require('../../assets/images/copy-icon.png')">
                                        </el-image>
                                    </el-tooltip> -->
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="客户姓名" prop="name">
                                    <el-input v-model="customerForm.name" size="small" ></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="客户年龄" prop="age">
                                    <el-input v-model="customerForm.age" size="small" ></el-input>
                                </el-form-item>
                            </el-col>
                            
                        </el-row>

                        <el-row>

                            <el-col :span="6">
                                <el-form-item label="最高学历" prop="education">

                                    <el-select v-model="customerForm.education" placeholder="请选择最高学历" size="small" >
                                        <el-option
                                          v-for="item in enumList['MJ-1']"
                                          :key="item.name"
                                          :label="item.name"
                                          :value="item.number">
                                        </el-option>
                                    </el-select>

                                </el-form-item>
                            </el-col>

                            <el-col :span="6">
                                <el-form-item label="毕业专业" prop="graduationMajor">
                                    <el-input v-model="customerForm.graduationMajor" size="small" ></el-input>
                                </el-form-item>
                            </el-col>

                            <el-col :span="6">
                                <el-form-item label="客户工作" prop="work">
                                    <el-input v-model="customerForm.work" size="small" ></el-input>
                                </el-form-item>
                            </el-col>
                            
                            <el-col :span="6">

                                <el-form-item label="工作年限" prop="workingLife">

                                    <el-select v-model="customerForm.workingLife" placeholder="请选择工作年限" size="small" >
                                        <el-option
                                          v-for="item in enumList['MJ-2']"
                                          :key="item.name"
                                          :label="item.name"
                                          :value="item.number">
                                        </el-option>
                                    </el-select>

                                </el-form-item>
                                
                            </el-col>

                        </el-row>

                        <el-row>

                            <el-col :span="6">
                                <el-form-item label="取证目的" prop="evidencePurpose">

                                    <el-select v-model="customerForm.evidencePurpose" placeholder="请选择取证目的" size="small" >
                                        <el-option
                                          v-for="item in enumList['MJ-3']"
                                          :key="item.name"
                                          :label="item.name"
                                          :value="item.number">
                                        </el-option>
                                    </el-select>

                                </el-form-item>
                            </el-col>

                            <el-col :span="6">
                                <el-form-item label="第二电话" prop="twoTel">
                                    <el-input v-model="customerForm.twoTel" size="small" ></el-input>
                                </el-form-item>
                            </el-col>

                            <el-col :span="6">
                                <el-form-item label="客户微信" prop="wx">
                                    <el-input v-model="customerForm.wx" size="small" ></el-input>
                                </el-form-item>
                            </el-col>

                            <el-col :span="6">

                                <el-form-item label="客户性别" prop="gender">

                                    <el-select v-model="customerForm.gender" placeholder="请选择性别" size="small" >
                                        <el-option
                                          v-for="item in genderList"
                                          :key="item.name"
                                          :label="item.name"
                                          :value="item.number">
                                        </el-option>
                                    </el-select>

                                </el-form-item>

                            </el-col>

                        </el-row>


                        <el-row>

                            <el-col :span="6">
                                <el-form-item label="所在省市" prop="provinceCity">
                                    <area-cascader type="text" v-model="customerForm.provinceCity" @change="cityChange" :data="pcaa"></area-cascader>
                                </el-form-item>
                            </el-col>

                            <el-col :span="6">
                                <el-form-item label="注册平台" prop="signUpSchool">
                                    <el-input v-model="customerForm.signUpSchool" readonly size="small" class="borderNone"></el-input>
                                </el-form-item>
                            </el-col>

                            <el-col :span="6">
                                <el-form-item label="报名时间" prop="createTime">
                                    <el-input v-model="customerForm.createTime" readonly size="small" class="borderNone"></el-input>
                                </el-form-item>
                            </el-col>

                            <!-- <el-col :span="6">
                                <el-form-item label="购买状态" prop="buyState">
                                    <el-input v-model="customerForm.buyState" readonly size="small" class="borderNone"></el-input>
                                </el-form-item>
                            </el-col> -->

                            <el-col :span="6">
                                <el-form-item label="学习状况" prop="studySituation">

                                    <el-select v-model="customerForm.studySituation" placeholder="请选择学习状况" size="small" >
                                        <el-option
                                          v-for="item in enumList['MJ-11']"
                                          :key="item.name"
                                          :label="item.name"
                                          :value="item.number">
                                        </el-option>
                                    </el-select>

                                </el-form-item>
                            </el-col>

                        </el-row>
                        
                        <el-row>

                            <el-col :span="6">
                                <el-form-item label="所属班主任" prop="classTeaName">
                                    <el-input v-model="customerForm.classTeaName" readonly size="small" class="borderNone"></el-input>
                                </el-form-item>
                            </el-col>

                            <el-col :span="6">
                                <el-form-item label="报名班型" prop="signUpClassType">
                                    <el-input v-model="customerForm.signUpClassType" readonly size="small" class="borderNone"></el-input>
                                </el-form-item>
                            </el-col>
                            
                            <el-col :span="6">
                                <el-form-item label="学籍状态" prop="studentStatus">

                                    <el-select v-model="customerForm.studentStatus" placeholder="请选择学籍状态" size="small" >
                                        <el-option
                                          v-for="item in enumList['MJ-10']"
                                          :key="item.name"
                                          :label="item.name"
                                          :value="item.number">
                                        </el-option>
                                    </el-select>

                                </el-form-item>
                            </el-col>

                            <el-col :span="6">
                                <el-form-item label="考期" prop="examPeriod">

                                    <el-date-picker
                                        style="width: 100%;"
                                        v-model="customerForm.examPeriod"
                                        size="small" 
                                        type="month"
                                        @change="timeChange"
                                        placeholder="请选择日期">
                                    </el-date-picker>

                                </el-form-item>
                            </el-col>

                        </el-row>

                        <el-row>

                            <el-col :span="6">

                                <el-form-item label="辅助报名" prop="auxiliarySignUp">

                                    <el-select v-model="customerForm.auxiliarySignUp" placeholder="请选择辅助报名" size="small" >
                                        <el-option
                                          v-for="item in auxiliarySignUpList"
                                          :key="item.name"
                                          :label="item.name"
                                          :value="item.number">
                                        </el-option>
                                    </el-select>

                                </el-form-item>

                            </el-col>

                        </el-row>
    
                        <el-row style="border-top: 1px dashed #ccc; margin-bottom: 10px; margin-top: 20px;"></el-row>

                        <el-row >
                            
                            <el-col :span="6">

                                <el-form-item label="跟进类型" prop="followUp">

                                    <el-select v-model="customerForm.followUp" placeholder="请选择跟进类型" size="small">
                                        <el-option
                                          v-for="item in enumList['MJ-12']"
                                          :key="item.name"
                                          :label="item.name"
                                          :value="item.number">
                                        </el-option>
                                    </el-select>

                                </el-form-item>

                            </el-col>
                        </el-row>

                        <el-row>

                            <el-col :span="18">
                                <el-form-item label="跟进内容" prop="followUpContent">

                                    <el-input 
                                        type="textarea" 
                                        v-model="customerForm.followUpContent" 
                                        size="small" 
                                        show-word-limit
                                        maxlength='100'
                                        placeholder="请输入跟进内容"

                                    ></el-input>

                                </el-form-item>
                            </el-col>

                        </el-row>
                        
                        <el-form-item style="text-align: center;">
                          <el-button type="primary" @click="submitForm('customerForm')" size="small" style="width: 80px;">确定</el-button>
                          <el-button plain size="small" style="width: 80px;" @click="quxiao">取消</el-button>
                        </el-form-item>

                    </el-form>

                </el-tab-pane>
                <el-tab-pane label="订单记录" name="third">
                    <el-table :data="orderList">
                        <el-table-column v-for="(item, index) in orderListColumn" :label="item.label" :prop="item.prop" :key="index" 
              :show-overflow-tooltip="true" :width="item.width" :formatter="item.formatter"></el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="跟进记录" name="second">

                    <el-table
                        :data="notesList"
                        style="width: 100%; margin-top: 10px; margin-bottom: 30px;"
                        >
                        <el-table-column
                          :prop="item.prop"
                          :label="item.label"
                          v-for="(item, index) in notesColumnList"
                          :key="index"
                          >
                        </el-table-column>
                    </el-table>

                    <el-pagination
                        background
                        layout="total, sizes, prev, pager, next, jumper"
                        :total='notesForm.total'
                        :page-size='notesForm.pageSize'
                        :page-sizes="[10, 20, 30]"
                        :hide-on-single-page="totalFlag"
                        @current-change="handleCurrentChangeFollow"
                        @size-change="handleSizeChangeFollow"
                        v-if="pageshow"
                    >
                    </el-pagination>
                </el-tab-pane>

                <el-tab-pane label="通话记录" name="four">

                    <el-table
                        :data="notesCallList"
                        style="margin: 0 auto; margin-bottom: 30px;"
                        >
                        <el-table-column
                          :prop="item.prop"
                          :label="item.label"
                          v-for="(item, index) in notesColumnListCall"
                          :key="index"
                          >
                        </el-table-column>

                        <el-table-column
                            prop="recordUrl" label="录音播放"
                            :width="columnWidth"
                            v-if="columnFlag"
                        >
                            <template slot-scope="scope">
                                <el-button v-if="scope.row.recordUrl" type="text" >
                                    <audio 
                                        :src="scope.row.recordUrl"
                                        controls="controls"
                                        style="height: 30px;"
                                    ></audio>
                                </el-button>
                            </template>
                        </el-table-column>

                    </el-table>

                    <el-pagination
                        background
                        layout="total, sizes, prev, pager, next, jumper"
                        :total='notesCallForm.total'
                        :page-size='notesCallForm.pageSize'
                        :page-sizes="[10, 20, 30]"
                        :hide-on-single-page="totalFlag"
                        @current-change="handleCurrentChangeCall"
                        @size-change="handleSizeChangeCall"
                        v-if="pageshow"
                    >
                    </el-pagination>

                </el-tab-pane>

            </el-tabs>
        </el-drawer>

        <PageFieldManage :setPageNum="setPageNum" />

    </el-main>
</template>

<script>
import { 
    getClassTeaStudent, 
    getStudentDetails, 
    addClassTeaStuNotes, 
    getClassTeaStuNotes, 
    getClassTeaClass,
    enumByEnumNums,
    getSchoolList,
    copyTel,
    getOrderList,
    phoneOutTea,
    seatOutTea,
    getClueCallLog
} from '../../request/api';
import PageFieldManage from '@/components/Base/PageFieldManage';
import { timestampToTime, classTypeString, orderTypeText, smoke_MJ_4, smoke_MJ_5, copyData, removeEvery } from '../../assets/js/common';
import { MJ_1, MJ_2, MJ_3, MJ_10, MJ_11, MJ_12 } from '../../assets/js/data';
import pcaa from 'area-data/pcaa';
export default {
    name: 'reCoverData',
    components: {
        PageFieldManage
    },
    data() {
        return {
            getOrderForm: {},
            form: {
                currentPage: 1,
                pageSize: 10,
                sortSet: [],
                total: null,
                classTeaUuid: '',
                classUuid: '', //班级的uuid
                num: '',
                sortSet: []
            },
            list: [],
            columnList: [{
                label: '班型'
            }],
            titleName: '',
            titleFlag: false,
            drawerTitle: '学员详情',
            drawer: false,
            direction: 'btt',
            tabs_active: 'first',
            customerForm: {
                studentUuid: '', //学员的唯一标识
                age: '',
                auxiliarySignUp: '', //辅助报名
                buyState: '', //购买状态
                city: "",
                classTeaName: '', //所属班主任
                createTime: '', //创建时间
                education: '', //学历
                evidencePurpose: '', //取证目的
                examPeriod: '', //考期
                gender: '', //性别(0: 女，1：男)
                graduationMajor: '', //毕业专业
                name: "",
                number: '', //客户编号
                province: "",
                provinceCity: [], //所在省市
                signUpClassType: '', //报名班型
                signUpSchool: '', //注册平台
                signUpTime: '', //报名时间(13位时间戳)
                studentStatus: '', //学籍状态
                studySituation: '', //学习状况
                tel: '', //手机号码
                twoTel: "", //电话号码2
                work: "",
                workingLife: '', //工作年限
                wx: "",
                
                followUp: '', //跟进类型
                followUpContent: '' //跟进内容
            },
            rules: {
                followUp: [
                  { required: true, message: '请选择跟进类型', trigger: 'change' }
                ],
                followUpContent: [
                  { required: true, message: '请输入跟进内容', trigger: ['blur', 'change'] }
                ],
            },
            tabsList: [],
            classUuidDefault: '',
            genderList: [
                { 'name': '女', 'number': 0 },
                { 'name': '男', 'number': 1 },
            ],
            auxiliarySignUpList: [
                { 'name': '是', 'number': 1 },
                { 'name': '否', 'number': 0 },
            ],
            enumList: {},
            pcaa: null, //省市数据
            notesForm: {
                currentPage: 1,
                pageSize: 10,
                studentUuid: '',
                total: null,
            },
            notesList: [],
            notesColumnList: [
                { 'prop': 'createTime', 'label': '创建时间', width: 250 },
                { 'prop': 'entryPerson', 'label': '跟进人' },
                { 'prop': 'followUp', 'label': '跟进类型' },
                { 'prop': 'followUpContent', 'label': '跟进内容' },
            ],
            notesCallList: [],
            notesColumnListCall: [
                { 'prop': 'createTime', 'label': '创建时间' },
                { 'prop': 'seatName', 'label': '跟进人' },
                { 'prop': 'isCalledPhone', 'label': '是否接通' },
                { 'prop': 'callStyle', 'label': '呼叫方式' },
                { 'prop': 'duration', 'label': '通话时长(秒)' },
                { 'prop': 'ringTime', 'label': '响铃时长(秒)' },
                { 'prop': 'recordUrl', 'label': '录音地址' },
            ],
            notesCallForm: {
                clueDataSUuid: '',
                currentPage: 1,
                pageSize: 10,
                userUuid: "",
                total: null, //总条目数
            },
            columnWidth: 90,
            columnFlag: false,
            totalFlag: false, //当只有一页时隐藏分页
            pageshow: true, //分页重新渲染
            schoolList: [],
            fullscreenLoading: false,
            copyClueDataSUuid: '', //学员详情copy手机号时用的clueDataSUuid
            orderList: [],
            orderListColumn: [{
                prop: 'goodsName', label:"商品名称", width: 150
            },{
                prop: 'orderNo', label:"订单号"
            },{
                prop: 'refer', label:"订单来源"
            },{
                prop: 'orderType', label:"订单类型"
            },{
                prop: 'addTime', label:"下单时间", formatter: (row, column, cellValue) =>{
                    return cellValue ? timestampToTime(Number(cellValue) * 1000) : '--'
                }
            },{
                prop: 'hasDelivery', label:"是否发货", formatter: (row, column, cellValue) =>{
                    return cellValue ? '是' : '否'
                }
            },{
                prop: 'shippingId', label:"快递号", formatter: (row, column, cellValue) => {
                    return cellValue ? cellValue : '--'
                }
            }],
            initOptions: {},
            callLogUuid: ''
        }
    },
    created() {
        this.getClassTeaClass();
        let arr = [MJ_1, MJ_2, MJ_3, MJ_10, MJ_11, MJ_12];
        this.enumByEnumNums(arr);
        this.pcaa = pcaa;
        this.getSchoolList();
        const initOptions = localStorage.getItem('initOptions');
        this.initOptions = JSON.parse(initOptions);
    },
    methods: { 
        phoneOutTea( scope ) {
            if(this.initOptions != undefined){
                this.$smoke_post(phoneOutTea, {
                    adminUin: this.initOptions.adminUin,
                    uin: this.initOptions.uin,
                    uuid: scope.uuid,
                }).then(res => {
                    if(res.code == 200){
                        if(res.data.result){
                            this.drawer = true;
                            this.studentDetails(scope);
                            this.callLogUuid = res.data.callLogUuid;
                            this.notesCallForm.clueDataSUuid = scope.clueDataSUuid;
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
        seatOutTea( scope ) {
            if(this.initOptions != undefined){
                this.$smoke_post(seatOutTea, {
                    adminUin: this.initOptions.adminUin,
                    uin: this.initOptions.uin,
                    uuid: scope.uuid,
                }).then(res => {
                    if(res.code == 200){
                        if(res.data.result){
                            this.drawer = true;
                            this.studentDetails(scope);
                            this.callLogUuid = res.data.callLogUuid;
                            this.notesCallForm.clueDataSUuid = scope.clueDataSUuid;
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
        geOrderRecord(){
            this.$smoke_post(getOrderList, this.getOrderForm).then(res => {
                if(res.data){
                    this.orderList = res.data
                }
            })
        },
        tableSort(type, props){
            this.form.sortSet = []
            this.form.sortSet.push({[props]: type === 'ascending' ? 'ASC' : 'DESC'})
            this.getClassTeaStudent()
        },
        setPageNum(pageNum){
            this.form.num = pageNum
        },
        getRowKey(row){
            return row.num
        },
        editFieldHandle(){
            this.$store.commit('setEditFieldVisible', true)
        },
        timeChange() {
            this.customerForm.examPeriod = this.customerForm.examPeriod.getTime();
        },
        getSchoolList() {
            this.$smoke_get(getSchoolList, {}).then(res => {
                if(res.code == 200){
                    this.schoolList = res.data;
                }else{
                    this.$message({
                        type: 'error',
                        message: res.msg, 
                    });
                }
            })
        },
        handleCurrentChangeFollow(index) {
            this.notesForm.currentPage = index;
            this.getClassTeaStuNotes();
        },
        handleSizeChangeFollow(index) {
            this.notesForm.pageSize = index;
            this.notesForm.currentPage = 1;
            this.getClassTeaStuNotes();
        }, 
        getClueCallLog() {
            this.$smoke_post(getClueCallLog, this.notesCallForm).then(res => {
                this.columnFlag = false;
                if(res.code == 200) {
                    res.data.list.map(sll => {
                        sll.createTime = timestampToTime(Number(sll.createTime));
                        if(sll.isCalledPhone == null) {
                            sll.isCalledPhone = '';
                        }else if(sll.isCalledPhone == 1) {
                            sll.isCalledPhone = '接通';
                        }else{
                            sll.isCalledPhone = '未接通';
                        }
                        if(sll.callStyle == 1) {
                            sll.callStyle = '呼叫中心';
                        }else if(sll.callStyle == 2) {
                            sll.callStyle = '工作手机';
                        }
                        if(sll.recordUrl){
                            this.columnWidth = 314;
                            this.columnFlag = true;
                        }
                    })
                    this.notesCallList = res.data.list;
                    this.notesCallForm.total = res.data.total;
                }
            }) 
        },
        handleCurrentChangeCall(index) {
            this.notesCallForm.currentPage = index;
            this.getClueCallLog();
        },
        handleSizeChangeCall(index) {
            this.notesCallForm.pageSize = index;
            this.notesCallForm.currentPage = 1;
            this.getClueCallLog();
        }, 
        studentDetails( row ) {
            this.drawer = true;
            this.customerForm.studentUuid = this.notesForm.studentUuid = row.uuid;
            this.copyClueDataSUuid = row.clueDataSUuid;
            this.notesCallForm.clueDataSUuid = row.clueDataSUuid;
            this.tabs_active = 'first';
            this.customerForm.followUp = '';
            this.customerForm.followUpContent = '';
            this.getStudentDetails(row.uuid);
            this.getOrderForm.userId = row.customerId
            this.getOrderForm.itemId = row.examItemId
            this.getOrderForm.classType = row.classType
        },
        cityChange() {
            this.customerForm.province = this.customerForm.provinceCity[0];
            this.customerForm.city = this.customerForm.provinceCity[1];
        },
        enumByEnumNums(arr) {
            this.$smoke_post(enumByEnumNums, {
                numberList: arr
            }).then(res => {
                if(res.code == 200){
                    for (var i in res.data) {
                        res.data[i].map(sll => {
                            if(sll.enable == 0) {
                                res.data[i] = removeEvery(sll, res.data[i]);
                            }
                        })
                    }
                    this.enumList = res.data;
                }
            })
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
              if (valid) {
                this.$confirm('确认保存修改内容吗？')
                .then(_ => {
                  this.addClassTeaStuNotes();
                })
                .catch(_ => {});
              } else {
                console.log('error submit!!');
                return false;
              }
            });
        },
        getClassTeaClass() {
            this.$smoke_get(getClassTeaClass,{
                classTeaUuid: this.$route.query.id || ''
            }).then(res => {
                if(res.code == 200) {
                    if(this.$route.query.id == undefined){
                        this.titleFlag = false;
                        if(res.data.length) {
                            this.form.classUuid = res.data[0].uuid;
                            this.classUuidDefault = res.data[0].uuid;
                        }
                    }else{
                        this.titleFlag = true;
                        this.form.classTeaUuid = this.$route.query.id;
                        this.titleName = '班主任 - ' + this.$route.query.name + ' - 服务学员'
                        this.form.classUuid = this.$route.query.classUuid;
                        this.classUuidDefault = this.$route.query.classUuid;
                    }
                    res.data.map(sll => {
                        sll.text = sll.examItem + ' - ' + classTypeString(sll.classType);
                    })
                    this.tabsList = res.data;
                    this.getClassTeaStudent();
                }else{
                    this.$message({
                        type: 'error',
                        message: res.msg
                    })
                }
            })
        },
        getStudentDetails(id) {
            const date = new Date;
            this.$smoke_post(getStudentDetails, {
                studentUuid: id
            }).then(res => {
                if(res.code == 200) {
                    this.customerForm.age = res.data.age == 0 ? '' : res.data.age;
                    this.customerForm.auxiliarySignUp = res.data.auxiliarySignUp;
                    if(res.data.buyState == 0) {
                        this.customerForm.buyState = '已交全款';
                    }else if(res.data.buyState == 1) {
                        this.customerForm.buyState = '已交定金';
                    }else{
                        this.customerForm.buyState = '已交尾款';
                    }
                    this.customerForm.city = res.data.city;
                    this.customerForm.classTeaName = res.data.classTeaName;
                    this.customerForm.createTime = timestampToTime(Number(res.data.createTime));
                    this.customerForm.education = res.data.education == 0 || res.data.education == null ? '' : String(res.data.education);
                    this.customerForm.evidencePurpose = res.data.evidencePurpose == 0 || res.data.evidencePurpose == null ? '' : String(res.data.evidencePurpose)
                    this.customerForm.examPeriod = res.data.examPeriod == "" ? date.getTime() : Number(res.data.examPeriod);
                    this.customerForm.gender = res.data.gender == 2 ? '' : res.data.gender;
                    this.customerForm.graduationMajor = res.data.graduationMajor;
                    this.customerForm.name = res.data.name;
                    this.customerForm.number = res.data.number;
                    this.customerForm.provinceCity = (res.data.province == "" && res.data.city == "") ? [] : [res.data.province, res.data.city];
                    this.customerForm.signUpClassType = res.data.signUpClassType;
                    this.schoolList.map(bbs => {
                        if(bbs.id == res.data.signUpSchool) {
                            this.customerForm.signUpSchool = bbs.name;
                        }
                    })
                    this.customerForm.signUpTime = (res.data.signUpTime != '' ? timestampToTime(Number(res.data.signUpTime)) : '');
                    this.customerForm.studentStatus = res.data.studentStatus == 0 || res.data.studentStatus == null ? '' : String(res.data.studentStatus);
                    this.customerForm.studySituation = res.data.studySituation == 0 || res.data.studySituation == null ? '' : String(res.data.studySituation);
                    this.customerForm.tel = res.data.tel;
                    this.customerForm.twoTel = res.data.twoTel;
                    this.customerForm.work = res.data.work;
                    this.customerForm.workingLife = res.data.workingLife == 0 || res.data.workingLife == null ? '' : String(res.data.workingLife);
                    this.customerForm.wx = res.data.wx;
                }
            })
        },
        addClassTeaStuNotes() {
            this.$smoke_post(addClassTeaStuNotes, {
                customerForm: {
                    age: this.customerForm.age,
                    auxiliarySignUp: this.customerForm.auxiliarySignUp,
                    city: this.customerForm.city,
                    education: this.customerForm.education,
                    evidencePurpose: this.customerForm.evidencePurpose,
                    examPeriod: this.customerForm.examPeriod,
                    gender: this.customerForm.gender,
                    graduationMajor: this.customerForm.graduationMajor,
                    name: this.customerForm.name,
                    province: this.customerForm.province,
                    studentStatus: this.customerForm.studentStatus,
                    studySituation: this.customerForm.studySituation,
                    twoTel: this.customerForm.twoTel,
                    work: this.customerForm.work,
                    workingLife: this.customerForm.workingLife,
                    wx: this.customerForm.wx
                },
                notes: {
                    followUp: this.customerForm.followUp,
                    followUpContent: this.customerForm.followUpContent
                },
                studentUuid: this.customerForm.studentUuid,
                callLogUuid: this.callLogUuid,
            }).then(res => {
                if(res.code == 200) {
                    this.$message({
                        type: 'success',
                        message: '添加备注成功',
                    })
                    this.tabs_active = 'second';
                    this.getClassTeaStuNotes();
                }else{
                    this.$message({
                        type: 'error',
                        message: '添加备注失败',
                    })
                }
            })
        },
        getClassTeaStuNotes() {
            this.$smoke_post(getClassTeaStuNotes, this.notesForm).then(res => {
                if(res.code == 200) {
                    res.data.list.map(sll => {
                        sll.createTime  = timestampToTime(Number(sll.createTime));
                    })
                    this.notesList = res.data.list;
                    this.notesForm.total = res.data.total;
                }
            })
        },
        getClassTeaStudent() {
            this.fullscreenLoading = true;
            this.$smoke_post(getClassTeaStudent, this.form).then(res => {
                if(res.code == 200) {
                    setTimeout(() => {
                        this.fullscreenLoading = false;
                        this.list = res.data.list;
                        this.columnList = res.data.filedList;
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
            if(this.callLogUuid) {
                this.$confirm('确认关闭？')
                .then(_ => {
                    done();
                    this.getClassTeaStudent();
                })
                .catch(_ => {});
            }else {
                done();
                this.getClassTeaStudent();
            }
        },
        handleClassTabClick(tab, event) {
            this.form.classUuid = tab.name;
            this.form.currentPage = 1;
            this.form.pageSize = 10;
            this.getClassTeaStudent();
        },
        handleTabClick(tab) {
            if(tab.label == '订单记录'){
                this.geOrderRecord()
            }else if(tab.label == '跟进记录'){
                this.getClassTeaStuNotes();
                this.notesForm.currentPage = 1;
                this.pageshow = false;//让分页隐藏
                this.$nextTick(() => {//重新渲染分页
                    this.pageshow = true;
                });
            }else if(tab.label == '通话记录'){
                console.log(222);
                this.getClueCallLog();
                this.notesCallForm.currentPage = 1;
                this.pageshow = false;//让分页隐藏
                this.$nextTick(() => {//重新渲染分页
                    this.pageshow = true;
                });
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
        phoneCopyFun() {
            this.copyTel(this.copyClueDataSUuid);
        },
        quxiao() {
            this.drawer = false;
        },
        handleCurrentChange(index) {
            this.form.currentPage = index;
            this.getClassTeaStudent();
        },
        handleSizeChange(index) {
            this.form.pageSize = index;
            this.form.currentPage = 1;
            this.getClassTeaStudent();
        },
    },
    mounted() {
        
    }
}
</script>

<style lang="less" scoped>
    .index-main{
        flex: 1;
        .people-title{
            width: 100%;
            height: 40px;
            line-height: 40px;
            text-align: center;
            font-size: 15px;
            background: #F2F3F7;
            margin-bottom: 10px;
            color: #666666;
        }
        .people-screen{
            margin-bottom: 16px;
            .screen-li{
                width: 90%;
            }
        }
        .el-pagination{
            text-align: right;
            margin-top: .4rem;
            margin-right: .4rem;
        }
    }
</style>
