<template>
    <div class="main-area">

        <el-container class="index-main">

            <el-main>

                <div class="people-title">{{titleFlag ? titleName : '班主任 - ' + this.$store.state.name + ' - 服务学员'}}</div>

                <el-tabs v-model="classUuidDefault" @tab-click="handleClassTabClick">
                    <el-tab-pane :label="item.text" :name="item.uuid" v-for="(item,index) in tabsList" :key="index"></el-tab-pane>
                </el-tabs>

                <el-table
                    :data="list"
                    ref="tree"
                    v-loading="fullscreenLoading"
                    style="width: calc( 100vw - 3.8rem)">

                    <el-table-column
                      :prop="item.prop"
                      :label="item.label"
                      :width="item.label == '最后联系时间' ? '110px ' : item.label == '拨通 / 拨打' ? '100px' : ''"
                      v-for="(item, index) in columnList"
                      :key="index"
                      >
                      <template slot-scope="scope">
                            <span>{{scope.row[item.prop]}}</span>
                            <el-tooltip effect="dark" v-if="item.prop == 'tel'" content="复制手机号码" placement="top">
                                <el-image
                                    class="copy-icon-style"
                                    @click="phoneCopy(scope.row)"
                                    :src="require('../../assets/images/copy-icon.png')">
                                </el-image>
                            </el-tooltip>
                      </template>
                    </el-table-column>

                    <el-table-column prop="active" label="操作">
                      <template slot-scope="scope">
                          <el-button @click="studentDetails(scope.row)" type="text" >学员详情</el-button>
                      </template>
                    </el-table-column>

                </el-table>

                <el-drawer
                    :title="drawerTitle"
                    :visible.sync="drawer"
                    :direction="direction"
                    size="100%"
                    :before-close="handleClose"
                >

                    <el-tabs v-model="tabs_active" @tab-click="handleTabClick" type="border-card" style="width: 92%; margin: 0 auto; margin-bottom: 30px;">

                        <el-tab-pane label="客户信息" name="first">
                        
                            <el-form :model="customerForm" :rules="rules" ref="customerForm" class="demo-customerForm">

                                <el-row>
                                    <el-col :span="6">
                                        <el-form-item label="客户编号" prop="number">
                                            <el-input v-model="customerForm.number" readonly size="small" class="borderNone"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-form-item label="客户手机" prop="tel">
                                            <el-input v-model="customerForm.tel" readonly size="small" class="borderNone"></el-input>
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

                                    <el-col :span="6">
                                        <el-form-item label="购买状态" prop="buyState">
                                            <el-input v-model="customerForm.buyState" readonly size="small" class="borderNone"></el-input>
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
                                                type="date"
                                                @change="timeChange"
                                                placeholder="请选择日期">
                                            </el-date-picker>

                                        </el-form-item>
                                    </el-col>

                                </el-row>

                                <el-row>

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

                                            <el-select v-model="customerForm.followUp" placeholder="请选择跟进类型" size="small" >
                                                <el-option
                                                  v-for="item in enumList['MJ-12']"
                                                  :key="item.name"
                                                  :label="item.name"
                                                  :value="item.number">
                                                </el-option>
                                            </el-select>

                                        </el-form-item>

                                    </el-col>

                                    <el-col :span="18">
                                        <el-form-item label="跟进内容" prop="followUpContent">
                                            <el-input v-model="customerForm.followUpContent" size="small" ></el-input>
                                        </el-form-item>
                                    </el-col>
                                    
                                </el-row>
                                
                                <el-form-item>
                                  <el-button type="primary" @click="submitForm('customerForm')" size="small" style="width: 80px;">确定</el-button>
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
                                @current-change="handleCurrentChangeCall"
                                @size-change="handleSizeChangeCall"
                                v-if="pageshow"
                            >
                            </el-pagination>

                        </el-tab-pane>

                    </el-tabs>

                </el-drawer>

            </el-main>

        </el-container>

    </div>
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
} from '../../request/api';
import { timestampToTime, classTypeString, orderTypeText, smoke_MJ_4, smoke_MJ_5, copyData } from '../../assets/js/common';
import { MJ_1, MJ_2, MJ_3, MJ_10, MJ_11, MJ_12 } from '../../assets/js/data';
import pcaa from 'area-data/pcaa';
export default {
    name: 'reCoverData',
    data() {
        return {
            form: {
                currentPage: 1,
                pageSize: 10,
                sortSet: [],
                total: 0,
                classTeaUuid: '',
                classUuid: '' //班级的uuid
            },
            list: [],
            columnList: [
                { 'prop': 'tel', 'label': '电话数据' },
                // { 'prop': 'clueUserUuid', 'label': '所属坐席' },
                { 'prop': 'examItemName', 'label': '考试项目' },
                { 'prop': 'classType', 'label': '班型' },
                // { 'prop': 'customerId', 'label': '客户id' },    
                { 'prop': 'orderId', 'label': '订单id' },
                // { 'prop': 'orderNum', 'label': '订单编号' },
                { 'prop': 'orderType', 'label': '订单类型' },
                { 'prop': 'school', 'label': '分校' },
                { 'prop': 'createTime', 'label': '创建时间' },
            ],
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
                  { required: true, message: '请选择跟进类型', trigger: 'blur' }
                ],
                followUpContent: [
                  { required: true, message: '请输入跟进内容', trigger: 'blur' }
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
                { 'prop': 'createTime', 'label': '创建时间' },
                { 'prop': 'entryPerson', 'label': '跟进人' },
                { 'prop': 'followUp', 'label': '跟进类型' },
                { 'prop': 'followUpContent', 'label': '跟进内容' },
            ],
            totalFlag: false, //当只有一页时隐藏分页
            pageshow: true, //分页重新渲染
            schoolList: [],
            fullscreenLoading: false,
        }
    },
    created() {
        this.getClassTeaClass();
        console.log(this.$route.query.id);
        let arr = [MJ_1, MJ_2, MJ_3, MJ_10, MJ_11, MJ_12];
        this.enumByEnumNums(arr);
        this.pcaa = pcaa;
        this.getSchoolList();
    },
    methods: { 
        timeChange() {
            console.log(this.customerForm.examPeriod);
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
        handleCurrentChangeCall(index) {
            console.log(index);
            this.notesForm.currentPage = index;
            this.getClassTeaStuNotes();
        },
        handleSizeChangeCall(index) {
            console.log(index);
            this.notesForm.pageSize = index;
            this.getClassTeaStuNotes();
        }, 
        studentDetails( row ) {
            console.log(row);
            this.drawer = true;
            this.customerForm.studentUuid = this.notesForm.studentUuid = row.uuid;
            this.getStudentDetails(row.uuid);
        },
        cityChange() {
            console.log(this.customerForm.provinceCity);
            this.customerForm.province = this.customerForm.provinceCity[0];
            this.customerForm.city = this.customerForm.provinceCity[1];
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
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
              if (valid) {
                this.addClassTeaStuNotes();
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
                    console.log(this.classUuidDefault);
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
                    this.customerForm.evidencePurpose = res.data.evidencePurpose == 0 ? date.getTime() : String(res.data.evidencePurpose)
                    this.customerForm.examPeriod = res.data.examPeriod == '' ? '' : Number(res.data.examPeriod);
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
                    this.customerForm.workingLife = res.data.workingLife == 0 ? '' : String(res.data.workingLife);
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
                studentUuid: this.customerForm.studentUuid
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
                        res.data.list.map(sll => {
                            sll.createTime  = timestampToTime(Number(sll.createTime));
                            sll.classType = classTypeString(sll.classType);
                            sll.orderType = orderTypeText(sll.orderType);
                        })
                        this.list = res.data.list;
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
        handleClassTabClick(tab, event) {
            console.log(tab);
            this.form.classUuid = tab.name;
            this.getClassTeaStudent();
        },
        handleTabClick(tab, event) {
            console.log(tab.label);
            if(tab.label == '客户信息'){
                console.log('客户信息');
            }else if(tab.label == '跟进记录'){
                console.log('跟进记录');
                this.getClassTeaStuNotes();
                this.notesForm.currentPage = 1;
                this.pageshow = false;//让分页隐藏
                this.$nextTick(() => {//重新渲染分页
                    this.pageshow = true;
                });
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
    }
    .el-pagination{
        text-align: right;
        margin-top: .4rem;
        margin-right: .4rem;
    }
</style>