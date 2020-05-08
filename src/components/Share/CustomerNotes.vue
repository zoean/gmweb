<template>
    
    <div>

        <el-drawer
            :title="drawerTitle"
            :visible.sync="drawer_"
            :direction="direction"
            size="100%"
            :before-close="handleCloseDrawer">

            <el-tabs v-model="tabs_active" @tab-click="handleTabClick" type="border-card" style="width: 92%; margin: 0 auto; margin-bottom: 30px;">

                <el-tab-pane label="客户信息" name="first">

                    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">

                        <el-row style="font-size: 14px; font-weight: bold; margin-bottom: 20px;">客户信息：</el-row>
                
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="客户编号" prop="number">
                                    <el-input v-model="ruleForm.number" readonly size="small" class="borderNone"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="客户手机" prop="tel">
                                    <el-input v-model="ruleForm.tel" readonly size="small" class="borderNone"></el-input>
                                </el-form-item>
                            </el-col>

                            <el-col :span="6">
                                <el-form-item label="入库时间" prop="createTime">
                                    <el-input v-model="ruleForm.createTime" readonly size="small" class="borderNone"></el-input>
                                </el-form-item>
                            </el-col>

                            <el-col :span="6">
                                <el-form-item label="最近联系" prop="callLastTime">
                                    <el-input v-model="ruleForm.callLastTime" readonly size="small" class="borderNone"></el-input>
                                </el-form-item>
                            </el-col>
                            
                        </el-row>

                        <el-row>

                            <el-col :span="6">
                                <el-form-item label="客户姓名" prop="name">
                                    <el-input v-model="ruleForm.name" size="small"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="客户年龄" prop="age">
                                    <el-input-number v-model="ruleForm.age" :precision="0" :step="1" :min="1" :max="150" size="small" style="width: 100%;"></el-input-number>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="最高学历" prop="education">

                                    <el-select v-model="ruleForm.education" placeholder="请选择最高学历" size="small">
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
                                <el-form-item label="所在省市" prop="provinceCity">
                                    <area-cascader type="text" placeholder="请选择地区" v-model="ruleForm.provinceCity" @change="cityChange" :data="pcaa"></area-cascader>
                                </el-form-item>
                            </el-col>
  
                        </el-row>
                        
                        <el-row>

                            <el-col :span="6">
                                <el-form-item label="客户工作" prop="work">
                                    <el-input v-model="ruleForm.work" size="small"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="取证目的" prop="evidencePurpose">

                                    <el-select v-model="ruleForm.evidencePurpose" placeholder="请选择取证目的" size="small">
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

                                <el-form-item label="工作年限" prop="workingLife">

                                    <el-select v-model="ruleForm.workingLife" placeholder="请选择工作年限" size="small">
                                        <el-option
                                          v-for="item in enumList['MJ-2']"
                                          :key="item.name"
                                          :label="item.name"
                                          :value="item.number">
                                        </el-option>
                                    </el-select>

                                </el-form-item>
                                
                            </el-col>

                            <el-col :span="6">
                                <el-form-item label="第二电话" prop="twoTel">
                                    <el-input v-model="ruleForm.twoTel" size="small"></el-input>
                                </el-form-item>
                            </el-col>

                        </el-row>

                        <el-row>

                            <el-col :span="6">
                                <el-form-item label="客户微信" prop="wx">
                                    <el-input v-model="ruleForm.wx" size="small"></el-input>
                                </el-form-item>
                            </el-col>

                            <el-col :span="6">

                                <el-form-item label="客户性别" prop="gender">

                                    <el-select v-model="ruleForm.gender" placeholder="请选择性别" size="small">
                                        <el-option
                                          v-for="item in genderList"
                                          :key="item.name"
                                          :label="item.name"
                                          :value="item.number">
                                        </el-option>
                                    </el-select>

                                </el-form-item>

                            </el-col>

                            <el-col :span="6">
                                <el-form-item label="注册平台" prop="school">
                                    <el-input v-model="ruleForm.school" readonly size="small" class="borderNone"></el-input>
                                </el-form-item>
                            </el-col>

                        </el-row>
        
                        <el-row style="border-top: 1px dashed #ccc; margin-bottom: 20px; margin-top: 20px;"></el-row>

                        <el-row style="font-size: 14px; font-weight: bold; margin-bottom: 20px;" v-if="followFlag">跟进信息：</el-row>

                        <el-row v-if="followFlag">
                            <el-col :span="6">
                                <el-form-item label="主推班型" prop="classType">

                                    <el-select v-model="ruleForm.classType" placeholder="请选择主推班型" size="small">
                                        <el-option
                                          v-for="item in classTypeList"
                                          :key="item.name"
                                          :label="item.name"
                                          :value="item.id">
                                        </el-option>
                                    </el-select>

                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="班型报价" prop="classOffer">
                                    <el-input-number v-model="ruleForm.classOffer" :precision="2" :step="1" :min="0" size="small" style="width: 100%;"></el-input-number>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">

                                <el-form-item label="沟通方式" prop="comModeName">

                                    <el-input v-model="ruleForm.comModeName" readonly size="small" class="borderNone"></el-input>

                                </el-form-item>

                            </el-col>
                            <el-col :span="6">

                                <el-form-item label="意向等级" prop="intentionLevel">

                                    <el-select v-model="ruleForm.intentionLevel" placeholder="请选择意向等级" size="small">
                                        <el-option
                                          v-for="item in enumList['MJ-5']"
                                          :key="item.name"
                                          :label="item.name"
                                          :value="item.number">
                                        </el-option>
                                    </el-select>

                                </el-form-item>

                            </el-col>
                        </el-row>
                        <el-row v-if="followFlag">           
                            
                            <el-col :span="6">
                                <el-form-item label="下次联系时间" prop="nextContactTime">

                                    <el-date-picker
                                      v-model="ruleForm.nextContactTime"
                                      style="width: 100%;"
                                      type="datetime"
                                      size="small"
                                      @change="pickerTimeChange"
                                      placeholder="请选择下次联系时间">
                                    </el-date-picker>

                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="其他备注" prop="remarks">
                                    <el-input v-model="ruleForm.remarks" size="small"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="截杀承诺" prop="runOutPromise">
                                    <el-input v-model="ruleForm.runOutPromise" size="small"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        
                        <el-form-item>
                          <el-button type="primary" @click="submitForm('ruleForm')" size="small" style="width: 100px;">确定</el-button>
                        </el-form-item>

                    </el-form>

                </el-tab-pane>

                <el-tab-pane label="跟进记录" name="second">
                    
                    <el-table
                        :data="notesList"
                        style="width: 94%; margin: 0 auto; margin-bottom: 30px;"
                        border
                        >
                        <el-table-column
                          :prop="item.prop"
                          :label="item.label"
                          v-for="(item, index) in notesColumnListFollow"
                          :key="index"
                          >
                        </el-table-column>
                        <el-table-column prop="active" label="操作">
                          <template slot-scope="scope">
                              <el-button @click="notesDetails(scope.row)" type="text" >备注详情</el-button>
                          </template>
                        </el-table-column>
                    </el-table>

                    <el-pagination
                        background
                        layout="total, sizes, prev, pager, next, jumper"
                        :total='notesForm.total'
                        :page-size='notesForm.pageSize'
                        :page-sizes="[10, 20, 30]"
                        :hide-on-single-page="totalFlag"
                        @current-change="handleCurrentChange"
                        @size-change="handleSizeChange"
                        v-if="pageshow"
                    >
                    </el-pagination>

                </el-tab-pane>

                <el-tab-pane label="通话记录" name="third">
                    
                    <el-table
                        :data="notesCallList"
                        style="width: 94%; margin: 0 auto; margin-bottom: 30px;"
                        border
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
                                <el-button v-if="scope.row.recordUrl" @click="bofangClick(scope.row)" type="text" >
                                    <audio 
                                        :src="scope.row.recordUrl"
                                        controls="controls"
                                        style="height: 30px;"
                                    ></audio>
                                </el-button>
                            </template>
                        </el-table-column>

                        <!-- <el-table-column prop="active" label="操作">
                          <template slot-scope="scope">
                              <el-button @click="notesDetails(scope.row)" type="text" >备注详情</el-button>
                          </template>
                        </el-table-column> -->

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

            <el-drawer
                title="跟进记录备注详情"
                :append-to-body="true"
                :before-close="handleCloseDrawerDetails"
                style="line-height: 30px;"
                :visible.sync="drawerDetails">

                <el-row>

                    <el-col :span="5" :offset="2">姓名：</el-col>
                    <el-col :span="5">{{notesDetailsForm.form.name}}</el-col>

                    <el-col 
                        :span="5" 
                        v-if="notesDetailsForm.form.name == notesDetailsForm.form.nameOld" 
                        style="text-decoration:line-through;"
                    >( {{notesDetailsForm.form.nameOld}} )</el-col>

                </el-row>

                <el-row>

                    <el-col :span="5" :offset="2">微信：</el-col>
                    <el-col :span="5">{{notesDetailsForm.form.wx}}</el-col>

                    <el-col 
                        :span="5" 
                        v-if="notesDetailsForm.form.wx == notesDetailsForm.form.wxOld" 
                        style="text-decoration:line-through;"
                    >( {{notesDetailsForm.form.wxOld}} )</el-col>

                </el-row>

                <el-row style="border-top: 1px dashed #ccc; margin-bottom: 20px; margin-top: 20px;"></el-row>

                <el-row>

                    <el-col :span="5" :offset="2">所属坐席：</el-col>
                    <el-col :span="15">{{notesDetailsForm.notCustomerForm.belongingSeat}}</el-col>

                </el-row>

                <el-row>

                    <el-col :span="5" :offset="2">创建时间：</el-col>
                    <el-col :span="15">{{notesDetailsForm.notCustomerForm.createTime}}</el-col>

                </el-row>

                <el-row>

                    <el-col :span="5" :offset="2">线索编号：</el-col>
                    <el-col :span="15">{{notesDetailsForm.notCustomerForm.number}}</el-col>

                </el-row>

                <el-row>

                    <el-col :span="5" :offset="2">手机号码：</el-col>
                    <el-col :span="15">{{notesDetailsForm.notCustomerForm.tel}}</el-col>

                </el-row>

                <el-row style="border-top: 1px dashed #ccc; margin-bottom: 20px; margin-top: 20px;"></el-row>

                <el-row>

                    <el-col :span="5" :offset="2">班型报价：</el-col>
                    <el-col :span="15">{{notesDetailsForm.notes.classOffer}}</el-col>

                </el-row>
                
                <!-- <el-row>

                    <el-col :span="5" :offset="2">主推班型：</el-col>
                    <el-col :span="15">{{notesDetailsForm.notes.classType}}</el-col>

                </el-row> -->

                <el-row>

                    <el-col :span="5" :offset="2">沟通方式：</el-col>
                    <el-col :span="15">{{notesDetailsForm.notes.comMode}}</el-col>

                </el-row>

                <el-row>

                    <el-col :span="5" :offset="2">录入人：</el-col>
                    <el-col :span="15">{{notesDetailsForm.notes.entryPerson}}</el-col>

                </el-row>

                <el-row>

                    <el-col :span="5" :offset="2">意向等级：</el-col>
                    <el-col :span="15">{{notesDetailsForm.notes.intentionLevel}}</el-col>

                </el-row>

                <el-row>

                    <el-col :span="5" :offset="2">下次联系：</el-col>
                    <el-col :span="15">{{notesDetailsForm.notes.nextContactTime}}</el-col>

                </el-row>

                <el-row>

                    <el-col :span="5" :offset="2">其他备注：</el-col>
                    <el-col :span="15">{{notesDetailsForm.notes.remarks}}</el-col>

                </el-row>

                <el-row>

                    <el-col :span="5" :offset="2">截杀承诺：</el-col>
                    <el-col :span="15">{{notesDetailsForm.notes.runOutPromise}}</el-col>

                </el-row>

            </el-drawer>

        </el-drawer>

    </div>

</template>

<script>
import { 
    enumByEnumNums,
    addClueDataNotes,
    getClueCallLog,
    getClueDataNotes, 
    getClueDataDetails,
    getClueDataNotesDetails, 
    getGoodsList,
} from '../../request/api';
import pcaa from 'area-data/pcaa';
import { timestampToTime, backType, smoke_MJ_4, smoke_MJ_5, pathWayText, classTypeText } from '../../assets/js/common';
import { MJ_1, MJ_2, MJ_3, MJ_4, MJ_5 } from '../../assets/js/data';
export default {
    name: 'customerNotes',
    props: {
        followFlag: {
            type: Boolean,
            default: false
        },
        drawer: {
            type: Boolean,
            default: false
        },
        userUuid: {
            type: String,
            default: ''
        },
        clueDataSUuid: {
            type: String,
            default: ''
        },
        callLogUuid: {
            type: String,
            default: ''
        },
        comMode: {
            type: String,
            default: ''
        },
        schoolId: {
            type: String,
            default: ''
        },
        examItem: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            drawerTitle: '',
            direction: 'btt',
            tabs_active: 'first',
            ruleForm: {
                callLogUuid: this.callLogUuid, //拨打记录唯一标识
                clueDataSUuid: this.clueDataSUuid, //线索数据的唯一标识

                age: '',
                city: "",
                education: "",
                evidencePurpose: '', //取证目的
                gender: '', //性别(0: 女，1：男)
                name: "",
                province: "",
                provinceCity: [], //所在省市
                twoTel: "", //电话号码2
                work: "",
                workingLife: '', //工作年限
                wx: "",
                school: '', //注册平台
                callLastTime: '', //最近联系
                createTime: '', //入库时间

                classOffer: '', //班型报价
                classType: '', //主推班型
                comMode: '', //沟通方式
                comModeName: '', //沟通方式Name
                entryPerson: '', //录入人
                intentionLevel: '', //意向等级
                nextContactTime: '', //下次联系时间  时间戳（13位）
                remarks: '', //其他备注
                runOutPromise: '', //截杀承诺
            },
            rules: {
                classOffer: [
                  { required: true, message: '请输入班型报价', trigger: 'blur' },
                ],
                classType: [
                  { required: true, message: '请选择主推班型', trigger: 'blur' }
                ],
                nextContactTime: [
                  { required: true, message: '请选择下次联系时间', trigger: 'blur' }
                ],
                runOutPromise: [
                  { required: true, message: '请输入截杀承诺', trigger: 'blur' }
                ],
                intentionLevel: [
                  { required: true, message: '请选择意向等级', trigger: 'blur' }
                ],
            },
            notesForm: {
                clueDataSUuid: this.clueDataSUuid,
                currentPage: 1,
                pageSize: 10,
                userUuid: "",
                total: null, //总条目数
            },
            notesCallForm: {
                clueDataSUuid: this.clueDataSUuid,
                currentPage: 1,
                pageSize: 10,
                userUuid: "",
                total: null, //总条目数
            },
            pageshow: true, //分页重新渲染
            totalFlag: false, //当只有一页时隐藏分页
            notesList: [],
            notesCallList: [],
            notesColumnListFollow: [
                { 'prop': 'createTime', 'label': '创建时间' },
                { 'prop': 'entryPerson', 'label': '录入人' },
                { 'prop': 'comMode', 'label': '沟通方式' },
                // { 'prop': 'classType', 'label': '主推班型' },
                { 'prop': 'classOffer', 'label': '班型报价（元）' },
                { 'prop': 'intentionLevel', 'label': '意向等级' },
                { 'prop': 'nextContactTime', 'label': '下次联系时间' },
                { 'prop': 'runOutPromise', 'label': '截杀承诺' },
                { 'prop': 'remarks', 'label': '其他备注' },
            ],
            notesColumnListCall: [
                { 'prop': 'createTime', 'label': '创建时间' },
                { 'prop': 'seatName', 'label': '所属坐席' },
                { 'prop': 'isCalledPhone', 'label': '是否接通' },
                { 'prop': 'callStyle', 'label': '呼叫方式' },
                { 'prop': 'duration', 'label': '通话时长(秒)' },
                { 'prop': 'ringTime', 'label': '响铃时长(秒)' },
                { 'prop': 'recordUrl', 'label': '录音地址' },
            ],
            columnWidth: 90,
            columnFlag: false,
            drawerDetails: false,
            notesDetailsForm: {
                form: {
                    age: 0,
                    ageOld: 0,
                    city: "",
                    cityOld: "",
                    evidencePurpose: 0,  //取证目的
                    evidencePurposeOld: 0,
                    gender: 0,  //性别
                    genderOld: 0,
                    name: "",
                    nameOld: "",
                    province: "",
                    provinceOld: "",
                    twoTel: "",
                    twoTelOld: "",
                    work: "",
                    workOld: "",
                    workingLife: 0,  //工作年限
                    workingLifeOld: 0,
                    wx: "",
                    wxOld: ""
                },
                notCustomerForm: {      //不可修改的线索内容
                    belongingSeat: "",  //所属坐席
                    callLastTime: "",  //最后联系时间
                    createTime: "",  //创建时间
                    number: "",  //线索编号
                    tel: ""  //手机号码
                },
                notes: {
                    classOffer: 0,  //班型报价
                    classType: "",  //主推班型
                    comMode: 0,  //沟通方式
                    entryPerson: "",  //录入人
                    intentionLevel: 0,  //意向等级
                    nextContactTime: "",  //下次联系时间
                    remarks: "",  //其他备注
                    runOutPromise: ""  //截杀承诺
                },
            },
            enumList: {},
            genderList: [
                { 'name': '女', 'number': 0 },
                { 'name': '男', 'number': 1 },
            ],
            tabs_active: 'first',
            classTypeList: [],
            pcaa: null, //省市数据
        }
    },
    created() {
        if(this.followFlag) {
            this.drawerTitle = '添加备注';
        }else{
            this.drawerTitle = '客户信息';
        }
        this.notesForm.userUuid = this.userUuid;
        this.notesCallForm.userUuid = this.userUuid;
        let arr = [MJ_1, MJ_2, MJ_3, MJ_4, MJ_5];
        this.enumByEnumNums(arr);
        this.pcaa = pcaa;
        this.ruleForm.classOffer = '';
        this.ruleForm.classType = '';
        
        this.ruleForm.comModeName = this.comMode;

        if(this.comMode == '座机外呼') {
            this.ruleForm.comMode = 1;
        }else if(this.comMode == '微信沟通') {
            this.ruleForm.comMode = 2;
        }else if(this.comMode == '手机外呼') {
            this.ruleForm.comMode = 3;
        }

        this.ruleForm.entryPerson = this.$store.state.name;
        this.ruleForm.intentionLevel = '';
        this.ruleForm.nextContactTime = '';
        this.ruleForm.remarks = '';
        this.ruleForm.runOutPromise = '';
        this.getClueDataDetails(this.clueDataSUuid);
        this.getGoodsList();
    },
    methods: {
        getGoodsList() {
            this.$smoke_post(getGoodsList, {
                itemId: Number(this.examItem),
                schoolName: this.schoolId
            }).then(res => {
                if(res.code == 200) {
                    this.classTypeList = res.data;
                }
            })
        },
        handleCloseDrawer(done) {
            done();
            this.$emit('fatherDataList');
        },
        handleCloseDrawerDetails(done) {
            this.notesForm.currentPage = 1;
            this.notesCallForm.currentPage = 1;
            this.pageshow = false;//让分页隐藏
            this.$nextTick(() => {//重新渲染分页
                this.pageshow = true;
            });
            done();
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
        handleTabClick(tab, event) {
            console.log(tab.label);
            if(tab.label == '跟进记录'){
                this.getClueDataNotes();
                this.notesForm.currentPage = 1;
                this.pageshow = false;//让分页隐藏
                this.$nextTick(() => {//重新渲染分页
                    this.pageshow = true;
                });
            }else if(tab.label == '通话记录'){
                this.getClueCallLog();
                this.notesCallForm.currentPage = 1;
                this.pageshow = false;//让分页隐藏
                this.$nextTick(() => {//重新渲染分页
                    this.pageshow = true;
                });
            }
        },
        getClueDataNotes() {
            this.$smoke_post(getClueDataNotes, this.notesForm).then(res => {
                console.log(res);
                if(res.code == 200) {
                    res.data.list.map(sll => {
                        sll.comMode = smoke_MJ_4(sll.comMode);
                        sll.intentionLevel = smoke_MJ_5(sll.intentionLevel);
                        sll.createTime = timestampToTime(Number(sll.createTime));
                        sll.nextContactTime = timestampToTime(Number(sll.nextContactTime));
                        // sll.classType = classTypeText(Number(sll.classType));
                    })
                    this.notesList = res.data.list;
                    this.notesForm.total = res.data.total;
                }
            }) 
        },
        cityChange() {
            console.log(this.ruleForm.provinceCity);
            this.ruleForm.province = this.ruleForm.provinceCity[0];
            this.ruleForm.city = this.ruleForm.provinceCity[1];
        },
        pickerTimeChange(value) {
            console.log(value.getTime());
            this.ruleForm.nextContactTime = value.getTime();
        },
        handleCurrentChange(index) {
            console.log(index);
            this.notesForm.currentPage = index;
            this.getClueDataNotes();
        },
        handleSizeChange(index) {
            console.log(index);
            this.notesForm.pageSize = index;
            this.getClueDataNotes();
        },
        handleCurrentChangeCall(index) {
            console.log(index);
            this.notesCallForm.currentPage = index;
            this.getClueCallLog();
        },
        handleSizeChangeCall(index) {
            console.log(index);
            this.notesCallForm.pageSize = index;
            this.getClueCallLog();
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
              if (valid) {
                console.log(this.ruleForm);
                this.addClueDataNotes();
              } else {
                console.log('error submit!!');
                return false;
              }
            });
        },
        addClueDataNotes() {
            this.$smoke_post(addClueDataNotes, {
                callLogUuid: this.ruleForm.callLogUuid,
                clueDataSUuid: this.ruleForm.clueDataSUuid,
                customerForm: {
                    age: this.ruleForm.age,
                    city: this.ruleForm.city,
                    evidencePurpose: this.ruleForm.evidencePurpose,
                    gender: this.ruleForm.gender,
                    name: this.ruleForm.name,
                    province: this.ruleForm.province,
                    twoTel: this.ruleForm.twoTel,
                    work: this.ruleForm.work,
                    workingLife: this.ruleForm.workingLife,
                    wx: this.ruleForm.wx,
                    education: this.ruleForm.education,
                },
                notes: {
                    classOffer: this.ruleForm.classOffer,
                    classType: this.ruleForm.classType,
                    comMode: this.ruleForm.comMode,
                    entryPerson: this.ruleForm.entryPerson,
                    intentionLevel: this.ruleForm.intentionLevel,
                    nextContactTime: this.ruleForm.nextContactTime,
                    remarks: this.ruleForm.remarks,
                    runOutPromise: this.ruleForm.runOutPromise,
                },
                operateType: 1
            }).then(res => {
                console.log(res);
                if(res.code == 200) {
                    this.$message({
                        type: 'success',
                        message: '添加备注成功',
                    })
                    this.tabs_active = 'second';
                    this.getClueDataNotes();
                }else{
                    this.$message({
                        type: 'error',
                        message: res.msg,
                    })
                }
            })
        },
        getClueCallLog() {
            this.$smoke_post(getClueCallLog, this.notesCallForm).then(res => {
                console.log(res);
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
        getClueDataNotesDetails(id) {
            this.$smoke_post(getClueDataNotesDetails, {
                uuid: id
            }).then(res => {
                console.log(res);
                if(res.code == 200) {
                    this.notesDetailsForm.form.age = res.data.form.age;
                    this.notesDetailsForm.form.ageOld = res.data.form.ageOld;
                    this.notesDetailsForm.form.city = res.data.form.city;
                    this.notesDetailsForm.form.cityOld = res.data.form.cityOld;
                    this.notesDetailsForm.form.evidencePurpose = res.data.form.evidencePurpose;
                    this.notesDetailsForm.form.evidencePurposeOld = res.data.form.evidencePurposeOld;
                    this.notesDetailsForm.form.gender = res.data.form.gender;
                    this.notesDetailsForm.form.genderOld = res.data.form.genderOld;
                    this.notesDetailsForm.form.name = res.data.form.name;
                    this.notesDetailsForm.form.nameOld = res.data.form.nameOld;
                    this.notesDetailsForm.form.province = res.data.form.province;
                    this.notesDetailsForm.form.provinceOld = res.data.form.provinceOld;
                    this.notesDetailsForm.form.twoTel = res.data.form.twoTel;
                    this.notesDetailsForm.form.twoTelOld = res.data.form.twoTelOld;
                    this.notesDetailsForm.form.work = res.data.form.work;
                    this.notesDetailsForm.form.workOld = res.data.form.workOld;
                    this.notesDetailsForm.form.workingLife = res.data.form.workingLife;
                    this.notesDetailsForm.form.workingLifeOld = res.data.form.workingLifeOld;
                    this.notesDetailsForm.form.wx = res.data.form.wx;
                    this.notesDetailsForm.form.wxOld = res.data.form.wxOld;

                    this.notesDetailsForm.notCustomerForm.belongingSeat = res.data.notCustomerForm.belongingSeat;
                    this.notesDetailsForm.notCustomerForm.createTime = timestampToTime(Number(res.data.notCustomerForm.createTime));
                    this.notesDetailsForm.notCustomerForm.number = res.data.notCustomerForm.number;
                    this.notesDetailsForm.notCustomerForm.tel = res.data.notCustomerForm.tel;

                    this.notesDetailsForm.notes.classOffer = res.data.notes.classOffer;

                    if(this.classTypeList) {
                        this.classTypeList.map(sll => {
                            if(res.data.notes.classType = sll.number) {
                                this.notesDetailsForm.notes.classType = sll.name;       
                            }
                        })
                    }

                    this.notesDetailsForm.notes.comMode = smoke_MJ_4(res.data.notes.comMode);              
                    this.notesDetailsForm.notes.entryPerson = res.data.notes.entryPerson;              
                    this.notesDetailsForm.notes.intentionLevel = smoke_MJ_5(res.data.notes.intentionLevel);              
                    this.notesDetailsForm.notes.nextContactTime = timestampToTime(Number(res.data.notes.nextContactTime));              
                    this.notesDetailsForm.notes.remarks = res.data.notes.remarks;              
                    this.notesDetailsForm.notes.runOutPromise = res.data.notes.runOutPromise;              
                }
            })
        },
        notesDetails(row) {
            console.log(row);
            this.drawerDetails = true;
            this.getClueDataNotesDetails(row.uuid);
        },
        bofangClick(row) {
            console.log(row);
        },
        getClueDataDetails(id) {
            this.$smoke_post(getClueDataDetails, {
                uuid: id
            }).then(res => {
                if(res.code == 200){
                    this.ruleForm.age = res.data.age == 0 ? '' : res.data.age;
                    this.ruleForm.city = res.data.city;
                    this.ruleForm.tel = res.data.tel;
                    this.ruleForm.number = res.data.number;
                    this.ruleForm.evidencePurpose = res.data.evidencePurpose == 0 ? '' : String(res.data.evidencePurpose);
                    this.ruleForm.gender = res.data.gender == 2 ? '' : res.data.gender;
                    this.ruleForm.name = res.data.name;
                    this.ruleForm.education = res.data.education == 0 || res.data.education == null ? '' : String(res.data.education);
                    this.ruleForm.province = res.data.province;
                    this.ruleForm.provinceCity = (res.data.province == "" && res.data.city == "") ? [] : [res.data.province, res.data.city];
                    this.ruleForm.twoTel = res.data.twoTel;
                    this.ruleForm.work = res.data.work;
                    this.ruleForm.workingLife = res.data.workingLife == 0 ? '' : String(res.data.workingLife);
                    this.ruleForm.wx = res.data.wx;
                    this.ruleForm.school = res.data.school;
                    this.ruleForm.callLastTime = timestampToTime(Number(res.data.callLastTime));
                    this.ruleForm.createTime = timestampToTime(Number(res.data.createTime));
                }
            })
        },
    },
    mounted() {
        
    },
    computed: {
        drawer_:{
            get(){
                return this.drawer
            },
            set(val){
                this.$emit("changeDrawer",val)
            }
        }
    },
}
</script>

<style lang="less" scoped>
    .el-pagination{
        text-align: right;
        margin-top: .4rem;
        margin-right: .4rem;
    }
</style>