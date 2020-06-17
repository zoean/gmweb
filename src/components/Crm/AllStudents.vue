<template>
    <el-main class="index-main allStudents">
        <el-row class="people-screen">
            <el-col :span="4">
                <el-input v-model="form.name" placeholder="请输入姓名" class="screen-li" size="small"></el-input>
            </el-col>
            <el-col :span="4">
                <el-input v-model="form.tel" placeholder="请输入手机号" class="screen-li" size="small"></el-input>
            </el-col>
            <el-col :span="4">
                <el-autocomplete
                    clearable
                    size="small"
                    class="screen-li"
                    ref="autocomplete"
                    v-model="form.examItemText"
                    :fetch-suggestions="querySearch"
                    placeholder="请输入考试项目"
                    :trigger-on-focus="true"
                    @select="handleSelect"
                    @clear="autocompleteClear"
                ></el-autocomplete>
            </el-col>
            <el-col :span="4">
                <el-select v-model="form.classType" placeholder="请选择班型等级" class="screen-li" size="small" clearable>
                    <el-option
                      v-for="item in classTypeList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="4">
                <el-input v-model="form.teaName" placeholder="请输入班主任姓名" class="screen-li" size="small"></el-input>
            </el-col>

        </el-row>

        <el-row class="people-screen" type="flex" align="middle">

            <el-col :span="4">
                <el-input v-model="form.stuId" size="small" placeholder="请输入用户id" style="width: 90%;"></el-input>
            </el-col>

            <el-col :span="5">

                <el-cascader
                    class="smoke-cascader1"
                    ref="cascader"
                    size="small"
                    style="width: 90%;"
                    placeholder="请搜索或选择坐席组织架构"
                    collapse-tags
                    :show-all-levels='true'
                    :options="zuzhiOptions"
                    @change='handleZuzhiChange'
                    filterable
                    :props="{ checkStrictly: true, label: 'name', value: 'uuid', children: 'includeSubsetList', multiple: true }"
                    clearable>
                </el-cascader>

            </el-col>

            <el-col :span="5">
                
                <el-date-picker
                  style="width: 90%;"
                  v-model="dataPicker"
                  type="date"
                  align="right"
                  size="small"
                  clearable
                  @change="datePickerChange"
                  placeholder="请选择最后联系时间"
                  :picker-options="pickerOptions">
                </el-date-picker>

            </el-col>

            <el-col :span="2">

                <el-button type="primary" @click="getSupStuListClick" size="small">查 询</el-button>

            </el-col>

            <el-col :span="12">
                <el-row type="flex" justify="end">
                    <svg-icon class="border-icon" @click="moveStudents('all', null)" icon-title="批量转移" icon-class="move" />
                </el-row>
            </el-col>

        </el-row>

        <el-table
            :data="list"
            ref="tableSelect"
            :key="Math.random()"
            v-loading="fullscreenLoading"
            style="width: 100%">
            <el-table-column
              type="selection"
              width="45">
            </el-table-column>
            <el-table-column
              :prop="item.prop"
              :label="item.label"
              :formatter="item.formatter"
              :min-width="item.prop == 'seatName' ? '300px' : item.prop == 'createTime' ? '180px' : item.prop == 'examItemName' ? '150px' : item.prop == 'tel' ? '100px' : '' "
              v-for="(item, index) in columnList"
              :key="index"
              >

              <template slot-scope="scope">
                <el-tooltip effect="dark" v-if="item.prop == 'seatName' && scope.row.orgNameListText != '无'" :open-delay="500" :content="scope.row.orgNameListText" placement="top">
                    <span style="cursor: default">{{scope.row[item.prop] || '- -'}}</span>
                </el-tooltip>
                <span v-else>{{scope.row[item.prop] || '- -'}}</span>
              </template>

            </el-table-column>
            <el-table-column prop="active" label="操作" width="80">
              <template slot-scope="scope">
                <svg-icon @click="studentDetails(scope.row)" icon-title="学员详情" icon-class="detail" />
                <svg-icon @click="moveStudentOne(scope.row)" icon-title="转移学员" icon-class="move" />
              </template>
            </el-table-column>
        </el-table>

        <el-pagination
            background
            layout="total, sizes, prev, pager, next, jumper"
            style="text-align: right; margin-top: 20px;"
            :total='form.total'
            :page-size='form.pageSize'
            :current-page='form.currentPage'
            :page-sizes="[10, 20, 30]"
            :hide-on-single-page="totalFlag"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
        >
        </el-pagination>

        <el-drawer
            title="选择转移接受方"
            :visible.sync="drawerMove"
            :direction="directionMove"
            :before-close="handleClose"
        >
            <span class="bullets"></span>

        <el-tag 
            v-for="(item,index) in teacherMoveList" :key="index"
            style="margin-left: 20px; cursor: pointer; margin-top: 20px;"
            @click="tagClick(item)"
            >{{item.classTeacherName}}
        </el-tag>

        </el-drawer>


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

                            <el-col :span="6">
                                <el-form-item label="第二电话" prop="twoTel">
                                    <el-input v-model="customerForm.twoTel" size="small" ></el-input>
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

                            <el-col :span="6" style="margin-top: 10px;">

                                <label class="el-form-item__label">协议信息</label>

                                <span style="height: 40px; line-height: 40px;">{{agreementList.length}}</span>个

                                <span style="height: 40px; line-height: 40px; cursor: pointer; color: #409EFF;" @click="lookAgreement">查看</span>

                            </el-col>

                        </el-row>

                        <el-row>

                            <el-col :span="12">

                                <el-form-item label="成单坐席" prop="seatName">
                                    <el-tooltip effect="dark" popper-class="smoke_seatName1" v-if="customerForm.orgNameListText != '无'" :open-delay="500" :content="customerForm.orgNameListText" placement="top-start">
                                        <el-input v-model="customerForm.seatName" readonly size="small" class="borderNone"></el-input>
                                    </el-tooltip>
                                </el-form-item>

                            </el-col>
                            
                        </el-row>

                    </el-form>

                </el-tab-pane>
                <el-tab-pane label="订单记录" name="third">
                    <el-table :data="orderList">
                        <af-table-column 
                            v-for="(item, index) in orderListColumn" 
                            :label="item.label" 
                            :prop="item.prop" 
                            :key="index" 
                            :formatter="item.formatter"
                        ></af-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="跟进记录" name="second">

                    <el-table
                        :data="notesList"
                        style="width: 100%; margin-bottom: 30px;"
                        >
                        <el-table-column
                          :prop="item.prop"
                          :width="item.prop == 'createTime' ? '250px' : ''"
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
                        :current-page='notesForm.currentPage'
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
                          :width="item.prop == 'createTime' ? '250px' : ''"
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
                        :current-page='notesCallForm.currentPage'
                        :page-sizes="[10, 20, 30]"
                        :hide-on-single-page="totalFlag"
                        @current-change="handleCurrentChangeCall"
                        @size-change="handleSizeChangeCall"
                        v-if="pageshow"
                    >
                    </el-pagination>

                </el-tab-pane>

                <el-tab-pane label="课程列表" name="five">

                    <div v-if="courseListsFlag">

                        <div :data="courseLists" v-for="(baby, haha) in courseLists" :key="haha">
                            <div style="background: #FAFAFA; height: 40px; font-size: 14px; line-height: 40px; padding-left: 20px;">{{baby.categoryName}}</div>
                            <div v-for="(item, index) in baby.courseList">
                                <div style="padding-left: 50px; border-bottom: 1px solid #F1F1F1; height: 40px; font-size: 14px; line-height: 40px;">{{item.courseName}}</div>
                            </div>
                        </div>

                    </div>

                    <div v-else style="text-align: center; margin-top: 20px; font-size: 14px; color: #909399;">暂无课程</div>

                </el-tab-pane>

            </el-tabs>
        </el-drawer>

        <el-dialog width="40%" title="协议列表" :visible.sync="agreeFlag">
          
          <el-table
            :data="agreementList"
            >
            <el-table-column
                :prop="item.prop"
                :label="item.label"
                v-for="(item, index) in agreeColumnList"
                :key="index">
            </el-table-column>

            <el-table-column prop="limitLimit" label="操作" width="50">
                <template slot-scope="scope">                            
                    <el-button type="text" size="small" @click="lookAgreeLink(scope.row.agrId)">查看</el-button>
                </template>
            </el-table-column>
          </el-table>

        </el-dialog>

    </el-main>
</template>

<script>
import { 
    getSupStuList,
    getExamBasic,
    getTransferStuCTList,
    transferStu,
    getStudentDetails,
    enumByEnumNums,
    getOrderList,
    getClassTeaStuNotes,
    getClueCallLog,
    getSchoolList,
    getOrgSubsetByUuid,
    GetAgreementList,
    GetCourseList4Teacher
} from '../../request/api';
import { 
    timestampToTime, 
    genderText,
    classTypeString,
    getTextByJs,
} from '../../assets/js/common';
import { MJ_1, MJ_2, MJ_3, MJ_10, MJ_11, MJ_12, showid } from '../../assets/js/data';
import pcaa from 'area-data/pcaa';
export default {
    name: 'allStudents',
    data() {
        return {
            form: {
                currentPage: 1,
                pageSize: 10,
                classType: '',
                examItemId: '',
                examItemText: '',
                name: '',
                teaName: '',
                seatOrgList: [],
                sortSet: [],
                tel: "", //手机号
                total: null,
                stuId: '',
                startTime: '',
                endTime: '',
            },
            list: [],
            totalFlag: false,
            columnList: [
                { 'prop': 'name', 'label': '姓名' },
                { 'prop': 'tel', 'label': '手机号码' },
                { 'prop': 'examItemName', 'label': '考试项目' },
                { 'prop': 'classType', 'label': '班型' },
                { 'prop': 'school', 'label': '分校' },
                { 'prop': 'classTea', 'label': '班主任' },
                { 'prop': 'seatName', 'label': '成单坐席' },
            ],
            drawerMove: false,
            directionMove: 'rtl',
            restaurants: [],
            classTypeList: [
                { value: 0, label: '普通班' },
                { value: 1, label: '高端班' },
            ],
            fullscreenLoading: false,
            teacherMoveList: [],
            teaStuList: [],

            zuzhiOptions: [],
            dataPicker: '',
            pickerOptions: {
              disabledDate(time) {
                return time.getTime() > Date.now();
              },
              shortcuts: [{
                text: '3日未联',
                onClick(picker) {
                  const end = new Date();
                  const start = new Date();
                  end.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
                  picker.$emit('pick', [start, end]);
                }
              }, {
                text: '7日未联',
                onClick(picker) {
                  const end = new Date();
                  const start = new Date();
                  end.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                  picker.$emit('pick', [start, end]);
                }
              }, {
                text: '15日未联',
                onClick(picker) {
                  const end = new Date();
                  const start = new Date();
                  end.setTime(start.getTime() - 3600 * 1000 * 24 * 15);
                  picker.$emit('pick', [start, end]);
                }
              }, {
                text: '30日未联',
                onClick(picker) {
                  const end = new Date();
                  const start = new Date();
                  end.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                  picker.$emit('pick', [start, end]);
                }
              }]
            },

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
                signUpSchool: '', //注册平台
                signUpTime: '', //报名时间(13位时间戳)
                studentStatus: '', //学籍状态
                studySituation: '', //学习状况
                tel: '', //手机号码
                twoTel: "", //电话号码2
                work: "",
                workingLife: '', //工作年限
                wx: "",
                seatName: '',
                orgNameListText: ''
            },

            rules: {
                
            },
            getOrderForm: {},
            drawerTitle: '学员详情',
            drawer: false,
            direction: 'btt',
            tabs_active: 'first',
            
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
            notesList: [],
            notesColumnList: [
                { 'prop': 'createTime', 'label': '创建时间'},
                { 'prop': 'entryPerson', 'label': '跟进人' },
                { 'prop': 'followUp', 'label': '跟进类型' },
                { 'prop': 'followUpContent', 'label': '跟进内容' },
            ],
            notesCallList: [],
            notesColumnListCall: [
                { 'prop': 'createTime', 'label': '创建时间'},
                { 'prop': 'seatName', 'label': '跟进人' },
                { 'prop': 'isCalledPhone', 'label': '是否接通' },
                { 'prop': 'callStyle', 'label': '呼叫方式' },
                { 'prop': 'duration', 'label': '通话时长(秒)' },
                { 'prop': 'ringTime', 'label': '响铃时长(秒)' },
                // { 'prop': 'recordUrl', 'label': '录音地址' },
            ],
            notesCallForm: {
                clueDataSUuid: '',
                currentPage: 1,
                pageSize: 10,
                userUuid: "",
                total: null, //总条目数
            },
            pcaa: null, //省市数据
            notesForm: {
                currentPage: 1,
                pageSize: 10,
                studentUuid: '',
                total: null,
            },
            columnWidth: 90,
            columnFlag: false,
            pageshow: true, //分页重新渲染
            schoolList: [],
            copyClueDataSUuid: '', //学员详情copy手机号时用的clueDataSUuid
            orderList: [],
            orderListColumn: [{
                prop: 'goodsName', label:"商品名称"
            },{
                prop: 'orderNo', label:"订单号"
            },{
                prop: 'payMoney', label:"支付金额"
            },{
                prop: 'refer', label:"订单来源"
            },{
                prop: 'orderType', label:"订单类型"
            },{
                prop: 'addTime', label:"下单时间", formatter: (row, column, cellValue) =>{
                    return cellValue ? timestampToTime(Number(cellValue) * 1000) : '--'
                }
            },{
                prop: 'payTime', label:"支付时间", formatter: (row, column, cellValue) =>{
                    return cellValue ? timestampToTime(Number(cellValue) * 1000) : '--'
                }
            },{
                prop: 'userInfo', label:"收货地址"
            },{
                prop: 'hasDelivery', label:"是否发货", formatter: (row, column, cellValue) =>{
                    return cellValue ? '是' : '否'
                }
            },{
                prop: 'shippingId', label:"快递号", formatter: (row, column, cellValue) => {
                    return cellValue ? cellValue : '--'
                }
            }],
            agreementList: [],
            agreeColumnList: [
                { 'prop': 'agrName', 'label': '协议名称' },  
            ],
            agreeFlag: false,

            courseLists: [],
            courseListsFlag: null
        }
    },
    created() {
        this.getSupStuList();
        this.getExamBasic();
        let arr = [MJ_1, MJ_2, MJ_3, MJ_10, MJ_11, MJ_12];
        this.enumByEnumNums(arr);
        this.pcaa = pcaa;
        this.getSchoolList();
        this.getOrgSubsetByUuid();
    },
    methods: {
        datePickerChange(value) {
            // console.log(Array.isArray(value));
            console.log(value);
            if(Array.isArray(value)){ //选择时间段回来的是数组 (判断数组)
                this.form.endTime = value[1].getTime();
                this.dataPicker = value[1];
            }else if(value != null) { //选择时间回来的是对象obj
                this.form.endTime = value.getTime();
            }else{
                this.form.endTime = '';
            }
        },
        handleZuzhiChange(arr) {
            let brr = [];
            // console.log(arr);
            arr.map(res => {
                if(res.length == 1){
                    brr.push(res[0]);
                }else{
                    brr.push(res[res.length-1]);
                }
            })
            // console.log(brr);
            this.form.seatOrgList = brr;
            console.log(this.form.seatOrgList);
        },
        getOrgSubsetByUuid() {
            this.$smoke_post(getOrgSubsetByUuid, {
                uuid: showid
            }).then(res => {
                console.log(res);
                this.zuzhiOptions = res.data;
            })
        },
        GetAgreementList(id) {

            this.$smoke_get(GetAgreementList, {
                param: {userId: id}
            }).then(res => {
                this.agreementList = res.data.agreementList;
            })
            
        },
        GetCourseList4Teacher(id) {

            this.$smoke_post(GetCourseList4Teacher, {
                userId: id
            }).then (res => {
                if(res.status == 0 && res.data) {
                    this.courseLists = res.data.courseList;
                    this.courseListsFlag = true;
                }else{
                    this.courseListsFlag = false;
                }
            })
            
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
        handleCurrentChange(index) {
            this.form.currentPage = index;
            this.getSupStuList();
        },
        handleSizeChange(index) {
            this.form.pageSize = index;
            this.form.currentPage = 1;
            this.getSupStuList();
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
            this.form.examItemText = item.value;
        },
        autocompleteClear() {
            this.$nextTick(() => {
                this.$refs.autocomplete.$children
                    .find(c => c.$el.className.includes('el-input'))
                    .blur();
                this.form.examItemId = '';
                this.$refs.autocomplete.focus();
            })
        },
        getSupStuListClick() {
            this.form.currentPage = 1;
            this.getSupStuList();
        },
        getSupStuList() {
            this.fullscreenLoading = true;
            this.$smoke_post(getSupStuList, this.form).then(res => {
                if(res.code == 200) {
                    setTimeout(() => {
                        this.fullscreenLoading = false;
                        res.data.list.map(sll => {
                            sll.classType = classTypeString(sll.classType);
                            if(sll.seatOrgName && sll.seatName) {
                                sll.seatName = sll.seatPOrgName? sll.seatPOrgName + ' ' + sll.seatOrgName + ' ' + sll.seatName : sll.seatOrgName + ' ' + sll.seatName;
                            }else{
                                sll.seatName = '';
                            }
                            sll.orgNameListText = getTextByJs(sll.orgNameList.reverse()); //reverse()倒序排列
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
        handleClose(done) {
            this.teaStuList = [];
            done();
        },
        moveStudents(type, id) {
            let arr = [];
            let brr = [];
            let rowClassType;

            this.$refs.tableSelect.selection.map(sll => {
                if(sll.classType == '高端班') {
                    rowClassType = 1;
                }else{
                    rowClassType = 0;
                }
                arr.push({classType: rowClassType, examItemId: sll.examItemId});
                brr.push({teaUuid: sll.classTeaUuid, uuid: sll.uuid});
            })
            if(arr.length == 0) {
                this.$message({
                    type: 'error',
                    message: '请您先勾选您要转移的学员'
                });
            }else{
                this.drawerMove = true;
                console.log(arr);
                this.getTransferStuCTList(arr);
                this.teaStuList = brr;
            }
        },
        moveStudentOne(row) {
            let arr = [];
            let brr = [];
            let rowClassType;
            if(row.classType == '高端班') {
                rowClassType = 1;
            }else{
                rowClassType = 0;
            }
            arr.push({classType: rowClassType, examItemId: row.examItemId});
            brr.push({teaUuid: row.classTeaUuid, uuid: row.uuid});
            this.teaStuList = brr;
            this.drawerMove = true;
            this.getTransferStuCTList(arr);
        },
        getTransferStuCTList(arr) {
            this.$smoke_post(getTransferStuCTList, {
                list: arr
            }).then(res => {
                if(res.code == 200) {
                    this.teacherMoveList = res.data;
                }
            })
        },
        tagClick(item) {
            this.$confirm('确认转移学员吗？')
            .then(_ => {
              this.transferStu(item.classTeacherUuid);
            })
            .catch(_ => {});
        },
        transferStu(classTeacherUuid) {
            this.$smoke_post(transferStu, {
                teaStuList: this.teaStuList,
                teaUuid: classTeacherUuid
            }).then(res => {
                if(res.code == 200) {
                    this.$message({
                        type: 'success',
                        message: '转移成功'
                    });
                    setTimeout(() => {
                        this.drawerMove = false;
                        this.getSupStuList();
                    },300)
                }else{
                    this.$message({
                        type: 'error',
                        message: res.msg
                    });
                    setTimeout(() => {
                        this.drawerMove = false;
                        this.getSupStuList();
                    },300)
                }
            })
        },


        studentDetails( row ) {
            this.drawer = true;
            this.customerForm.studentUuid = this.notesForm.studentUuid = row.stuUuid;
            this.copyClueDataSUuid = row.clueDataSUuid;
            this.notesCallForm.clueDataSUuid = row.clueDataSUuid;
            this.tabs_active = 'first';
            this.customerForm.followUp = '';
            this.customerForm.followUpContent = '';
            this.customerForm.seatName = row.seatName;
            this.getStudentDetails(row.stuUuid);
            this.GetAgreementList(row.customerId);
            console.log(row);
            this.getOrderForm.userId = row.customerId;
            this.getOrderForm.itemId = '';
            this.getOrderForm.classType = '';
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
                    this.customerForm.orgNameListText = getTextByJs(res.data.orgNameList.reverse()); //reverse()倒序排列
                }
            })
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
            }else if(tab.label == '课程列表') {
                this.GetCourseList4Teacher(this.getOrderForm.userId);
            }
        },
        geOrderRecord(){
            this.$smoke_post(getOrderList, this.getOrderForm).then(res => {
                if(res.data){
                    res.data.map(sll => {
                        sll.userInfo = sll.userName + ' / '  + sll.phone + ' / ' +  sll.location + sll.address ;
                    })
                    this.orderList = res.data;
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
                        if(sll.callStyle == 3) {
                            sll.callStyle = '外呼电话';
                        }else if(sll.callStyle == 4) {
                            sll.callStyle = '直线呼入';
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
        handleCurrentChangeFollow(index) {
            this.notesForm.currentPage = index;
            this.getClassTeaStuNotes();
        },
        handleSizeChangeFollow(index) {
            this.notesForm.pageSize = index;
            this.notesForm.currentPage = 1;
            this.getClassTeaStuNotes();
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
        cityChange() {
            this.customerForm.province = this.customerForm.provinceCity[0];
            this.customerForm.city = this.customerForm.provinceCity[1];
        },
        timeChange() {
            this.customerForm.examPeriod = this.customerForm.examPeriod.getTime();
        },
        lookAgreement() {
            this.agreeFlag = true;
        },
        lookAgreeLink(id) {
            const { href } = this.$router.resolve({
                name: "agreeMentDetails",
                query: {
                    id: id
                }
            })
            window.open(href, '_blank');
        }
    },
    mounted() {
        
    },
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
        .el-pagination{
            text-align: right;
            margin-top: .4rem;
        }
    }

    .allStudents /deep/ div.el-dialog__body{
        height: 50vh;
        overflow: auto;
    }
</style>