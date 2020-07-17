<template>
    
    <div>

        <el-drawer
            :title="drawerTitle"
            :visible.sync="drawer_"
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
                                    <el-input v-model="customerForm.name" :disabled='routePathFlag' placeholder="请输入客户姓名" size="small" ></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="客户年龄" prop="age">
                                    <el-input v-model="customerForm.age" :disabled='routePathFlag' placeholder="请输入客户年龄" size="small" ></el-input>
                                </el-form-item>
                            </el-col>

                            <el-col :span="6">
                                <el-form-item label="第二电话" prop="twoTel">
                                    <el-input v-model="customerForm.twoTel" :disabled='routePathFlag' placeholder="请输入第二电话" size="small" ></el-input>
                                </el-form-item>
                            </el-col>
                            
                        </el-row>

                        <el-row>

                            <el-col :span="6">
                                <el-form-item label="最高学历" prop="education">

                                    <el-select v-model="customerForm.education" :disabled='routePathFlag' placeholder="请选择最高学历" size="small" >
                                        <el-option
                                          v-for="item in enumList['MJ-1']"
                                          :key="item.name"
                                          v-if="item.enable"
                                          :label="item.name"
                                          :value="item.number">
                                        </el-option>
                                    </el-select>

                                </el-form-item>
                            </el-col>

                            <el-col :span="6">
                                <el-form-item label="所在省市" prop="provinceCity">
                                    <area-cascader type="text" v-model="customerForm.provinceCity" :disabled='routePathFlag' @change="cityChange" :data="pcaa"></area-cascader>
                                </el-form-item>
                            </el-col>

                            <el-col :span="6">
                                <el-form-item label="客户工作" prop="work">
                                    <el-input v-model="customerForm.work" placeholder="请输入客户工作" :disabled='routePathFlag' size="small" ></el-input>
                                </el-form-item>
                            </el-col>
                            
                            <el-col :span="6">

                                <el-form-item label="工作年限" prop="workingLife">

                                    <el-select v-model="customerForm.workingLife" placeholder="请选择工作年限" :disabled='routePathFlag' size="small" >
                                        <el-option
                                          v-for="item in enumList['MJ-2']"
                                          :key="item.name"
                                          v-if="item.enable"
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

                                    <el-select v-model="customerForm.evidencePurpose" :disabled='routePathFlag' placeholder="请选择取证目的" size="small" >
                                        <el-option
                                          v-for="item in enumList['MJ-3']"
                                          :key="item.name"
                                          v-if="item.enable"
                                          :label="item.name"
                                          :value="item.number">
                                        </el-option>
                                    </el-select>

                                </el-form-item>
                            </el-col>

                            <el-col :span="6">

                                <el-form-item label="辅助报名" prop="auxiliarySignUp">

                                    <el-select v-model="customerForm.auxiliarySignUp" :disabled='routePathFlag' placeholder="请选择辅助报名" size="small" >
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
                                    <el-input v-model="customerForm.wx" placeholder="请输入客户微信" :disabled='routePathFlag' size="small" ></el-input>
                                </el-form-item>
                            </el-col>

                            <el-col :span="6">

                                <el-form-item label="客户性别" prop="gender">

                                    <el-select v-model="customerForm.gender" placeholder="请选择性别" :disabled='routePathFlag' size="small" >
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
                                <el-form-item label="身份证号" prop="idcardNo">
                                    <el-input v-model="customerForm.idcardNo" placeholder="请输入身份证号码" :disabled='routePathFlag' size="small"></el-input>
                                </el-form-item>
                            </el-col>

                            <el-col :span="6">
                                <el-form-item label="报考省市" prop="provinceCity">
                                    <area-cascader type="text" v-model="customerForm.applyProvinceCity" :disabled='routePathFlag' @change="applyCityChange" :data="pcaa"></area-cascader>
                                </el-form-item>
                            </el-col>

                            <el-col :span="6">

                                <el-form-item label="报考条件" prop="applyExam">

                                    <el-select v-model="customerForm.applyExam" placeholder="请选择报考条件" :disabled='routePathFlag' size="small" >
                                        <el-option
                                          v-for="item in enumList['MJ-15']"
                                          :key="item.name"
                                          v-if="item.enable"
                                          :label="item.name"
                                          :value="Number(item.number)">
                                        </el-option>
                                    </el-select>

                                </el-form-item>

                            </el-col>

                            <el-col :span="6">

                                <el-form-item label="所属民族" prop="nationText">

                                    <el-autocomplete
                                        clearable
                                        style="width: 100%;"
                                        :disabled='routePathFlag' 
                                        size="small"
                                        ref="autocompleteNation"
                                        v-model="customerForm.nationText"
                                        :fetch-suggestions="querySearchNation"
                                        placeholder="请输入所属民族"
                                        :trigger-on-focus="true"
                                        @select="handleSelectNation"
                                        @clear="autocompleteClearNation"
                                    ></el-autocomplete>

                                </el-form-item>

                            </el-col>

                        </el-row>

                        <el-row>

                            <el-col :span="6">
                                <el-form-item label="毕业院校" prop="graduationSchool">
                                    <el-input v-model="customerForm.graduationSchool" :disabled='routePathFlag' placeholder="请输入毕业院校" size="small"></el-input>
                                </el-form-item>
                            </el-col>

                            <el-col :span="6">

                                <el-form-item label="毕业时间" prop="graduationTime">
                                    <el-date-picker
                                      size="small"
                                      style="width: 100%;"
                                      v-model="customerForm.graduationTime"
                                      type="month"
                                      :disabled='routePathFlag' 
                                      @change="graduationTimeChange"
                                      placeholder="请选择毕业时间">
                                    </el-date-picker>
                                </el-form-item>

                            </el-col>
                            
                            <el-col :span="6">

                                <el-form-item label="备案金" prop="filingFee">

                                    <el-select v-model="customerForm.filingFee" :disabled='routePathFlag' placeholder="请选择缴纳备案金" size="small" >
                                        <el-option
                                          v-for="item in filingFeeList"
                                          :key="item.name"
                                          :label="item.name"
                                          :value="item.number">
                                        </el-option>
                                    </el-select>

                                </el-form-item>

                            </el-col>

                            <el-col :span="6">
                                <el-form-item label="学籍状态" prop="studentStatus">

                                    <el-select v-model="customerForm.studentStatus" :disabled='routePathFlag' placeholder="请选择学籍状态" size="small" >
                                        <el-option
                                          v-for="item in enumList['MJ-10']"
                                          :key="item.name"
                                          v-if="item.enable"
                                          :label="item.name"
                                          :value="item.number">
                                        </el-option>
                                    </el-select>

                                </el-form-item>
                            </el-col>

                        </el-row>

                        <el-row>

                            <el-col :span="6">
                                <el-form-item label="毕业专业" prop="graduationMajor">
                                    <el-input v-model="customerForm.graduationMajor" :disabled='routePathFlag' placeholder="请输入毕业专业" size="small" ></el-input>
                                </el-form-item>
                            </el-col>

                            <el-col :span="6">
                                <el-form-item label="注册平台" prop="signUpSchool">
                                    <el-input v-model="customerForm.signUpSchool" :disabled='routePathFlag' readonly size="small" class="borderNone"></el-input>
                                </el-form-item>
                            </el-col>

                            <el-col :span="6">
                                <el-form-item label="报名时间" prop="createTime">
                                    <el-input v-model="customerForm.createTime" readonly size="small" :disabled='routePathFlag' class="borderNone"></el-input>
                                </el-form-item>
                            </el-col>

                            <!-- <el-col :span="6">
                                <el-form-item label="购买状态" prop="buyState">
                                    <el-input v-model="customerForm.buyState" readonly size="small" class="borderNone"></el-input>
                                </el-form-item>
                            </el-col> -->

                            <el-col :span="6">
                                <el-form-item label="学习状况" prop="studySituation">

                                    <el-select v-model="customerForm.studySituation" :disabled='routePathFlag' placeholder="请选择学习状况" size="small" >
                                        <el-option
                                          v-for="item in enumList['MJ-11']"
                                          :key="item.name"
                                          v-if="item.enable"
                                          :label="item.name"
                                          :value="item.number">
                                        </el-option>
                                    </el-select>

                                </el-form-item>
                            </el-col>

                        </el-row>
                        
                        <el-row>

                            <el-col :span="6" v-if="!routePathFlag">
                                <el-form-item label="所属班主任" prop="classTeaName">
                                    <el-input v-model="customerForm.classTeaName" readonly size="small" class="borderNone"></el-input>
                                </el-form-item>
                            </el-col>

                            <el-col :span="6">
                                <el-form-item label="考期" prop="examPeriod">

                                    <el-date-picker
                                        style="width: 100%;"
                                        :disabled='routePathFlag' 
                                        v-model="customerForm.examPeriod"
                                        size="small" 
                                        type="month"
                                        @change="timeChange"
                                        placeholder="请选择日期">
                                    </el-date-picker>

                                </el-form-item>
                            </el-col>

                            <el-col :span="6">
                                <el-form-item label="报考员" prop="examaAsistant">
                                    <el-input v-model="customerForm.examaAsistant" :disabled='routePathFlag' readonly size="small" class="borderNone"></el-input>
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
                                    <el-tooltip effect="dark" v-if="customerForm.orgNameListText != '无'" :open-delay="500" :content="customerForm.orgNameListText" placement="top-start">
                                        <el-input v-model="customerForm.seatName" readonly size="small" class="borderNone"></el-input>
                                    </el-tooltip>
                                </el-form-item>

                            </el-col>
                            
                        </el-row>
    
                        <el-row style="border-top: 1px dashed #ccc; margin-bottom: 10px; margin-top: 20px;" v-if="!routePathFlag"></el-row>

                        <el-row v-if="!routePathFlag">
                            
                            <el-col :span="6">

                                <el-form-item label="跟进类型" prop="followUp">

                                    <el-select v-model="customerForm.followUp" placeholder="请选择跟进类型" size="small">
                                        <el-option
                                          v-for="item in enumList['MJ-12']"
                                          :key="item.name"
                                          v-if="item.enable"
                                          :label="item.name"
                                          :value="item.number">
                                        </el-option>
                                    </el-select>

                                </el-form-item>

                            </el-col>
                        </el-row>

                        <el-row v-if="!routePathFlag">

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
                        
                        <el-form-item style="text-align: center;" v-if="!routePathFlag">
                          <el-button type="primary" @click="submitForm('customerForm')" size="small" style="width: 80px;">确定</el-button>
                          <el-button plain size="small" style="width: 80px;" @click="quxiao">取消</el-button>
                        </el-form-item>

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

                        <el-table-column prop="active" fixed="right" label="操作" width="50">
                            <template slot-scope="scope">                            
                                <svg-icon icon-title="修改地址" @click="handleEditAddressClick(scope.row)" icon-class="edit" class="svg-handle" />     
                            </template>
                        </el-table-column>

                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="跟进记录" name="second">

                    <el-table
                        :data="notesList"
                        style="width: 100%; margin-bottom: 30px;"
                        >
                        <el-table-column
                          :prop="item.prop"
                          :label="item.label"
                          :width="item.prop == 'createTime' ? '250px' : ''"
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
                        :page-sizes="[10, 20, 30, 50, 100]"
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
                        :page-sizes="[10, 20, 30, 50, 100]"
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

                <el-tab-pane label="代报考进度" name="six">

                    <el-table

                        :data="registerList"
                        style="margin: 0 auto; margin-bottom: 30px;"
                        >
                        <el-table-column
                          :prop="item.prop"
                          :label="item.label"
                          v-for="(item, index) in registerColumn"
                          :key="index"
                          >
                        </el-table-column>

                    </el-table>
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

        <el-dialog width="50%" title="设置地址信息" :visible.sync="addressFlag">
          
          <el-form :model="ruleFormAddress" ref="ruleFormAddress" class="demo-ruleForm" :rules="rulesAddress" :key="formAddressKey">
                        
            <el-form-item label="姓名" prop="userName">
              <el-input v-model="ruleFormAddress.userName" size="small"></el-input>
            </el-form-item>

            <el-form-item label="手机号" prop="phone">
              <el-input v-model="ruleFormAddress.phone" size="small"></el-input>
            </el-form-item>

            <el-form-item label="设置省市县" prop="addressArr">
              
                <el-cascader
                    class="smoke-cascader-demo"
                    ref="cascaderDemo"
                    size="small"
                    style="width: 100%;"
                    placeholder="请选择省市县"
                    collapse-tags
                    :show-all-levels='true'
                    :options="citysOptions"
                    @change='cityshandleChange'
                    v-model="ruleFormAddress.addressArr"
                    filterable
                    :props="{ checkStrictly: true, label: 'name', value: 'cityid', children: 'cities' }"
                    clearable>
                </el-cascader>

            </el-form-item>

            <el-form-item label="设置地址" prop="address">
              <el-input v-model="ruleFormAddress.address" size="small"></el-input>
            </el-form-item>

          </el-form>

          <span slot="footer" class="dialog-footer">

              <el-button @click="addressFlag = false" plain size="small">取 消</el-button>
              <el-button type="primary" @click="addressSubmitForm('ruleFormAddress')" size="small">确 定</el-button>

          </span>

        </el-dialog>

    </div>

</template>

<script>
import { 
  getStudentDetails, 
  addClassTeaStuNotes, 
  getClassTeaStuNotes, 
  enumByEnumNums,
  copyTel,
  getOrderList,
  getClueCallLog,
  GetAgreementList,
  GetCourseList4Teacher,
  GetCityList,
  updateAddress,
  queryRegisterProcess
} from '../../request/api';
import pcaa from 'area-data/pcaa';
import { 
  timestampToTime, getTextByJs, citiesFun
} from '../../assets/js/common';
import { 
  MJ_1, MJ_2, MJ_3, MJ_10, MJ_11, MJ_12, showid, nationAll, MJ_15
} from '../../assets/js/data';
export default {
    name: 'customerNotes',
    props: {
        drawer: {
          type: Boolean,
          default: false
        },
        studentUuid: {
          type: String,
          default: ''
        },
        userId: {
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
    },
    data() {
        return {
          drawerTitle: '学员详情',
          direction: 'btt',
          getOrderForm: {
            userId: this.userId,
            itemId: '',
            classType: '',
          },
          customerForm: {
            studentUuid: this.studentUuid, //学员的唯一标识
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
            orgNameListText: '',

            idcardNo: '',
            nation: '',
            nationText: '',
            graduationSchool: '',
            graduationTime: '',
            applyExam: '',
            applyProvince: '',
            applyCity: '',
            applyProvinceCity: [],
            filingFee: '',
            examaAsistant: '',
            
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
            idcardNo: [
              { pattern:/(^\d{15}$)|bai(^\d{18}$)|(^\d{17}(\d|X|x)$)/, required: false, message: "请输入正确的身份证号", trigger: "blur" }
            ],
          },
          tabs_active: 'first',
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
          notesForm: {
            currentPage: 1,
            pageSize: 20,
            studentUuid: this.studentUuid,
            total: null,
          },
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
          ],
          enumList: {},
          pcaa: null, //省市数据
          citysOptions: [],
          notesCallForm: {
            clueDataSUuid: this.clueDataSUuid,
            currentPage: 1,
            pageSize: 20,
            total: null, //总条目数
          },
          columnWidth: 90,
          columnFlag: false,
          totalFlag: false,
          pageshow: true, //分页重新渲染
          agreementList: [],
          agreeColumnList: [
            { 'prop': 'agrName', 'label': '协议名称' },  
          ],
          agreeFlag: false,
          courseLists: [],
          courseListsFlag: null,

          addressFlag: false,
          ruleFormAddress: {
            orderId: "",
            userName: "",
            address: "",
            phone: "",
            provinceId: "",
            cityId: "",
            addressArr: [],
            districtId: "",
            schoolName: ""
          },
          rulesAddress: {
            userName: [
              { required: true, message: '请输入姓名', trigger: 'blur' }
            ],
            phone: [
              { required: true, message: '请输入手机号', trigger: 'blur' }
            ],
            addressArr: [
              { required: true, message: '请选择省市县', trigger: 'change' }
            ],
            address: [
              { required: true, message: '请输入地址', trigger: 'blur' }
            ],
          },
          formAddressKey: '',
          auxiliarySignUpList: [
            { 'name': '是', 'number': 1 },
            { 'name': '否', 'number': 0 },
          ],
          genderList: [
            { 'name': '女', 'number': 0 },
            { 'name': '男', 'number': 1 },
          ],
          filingFeeList: [
            { 'name': '否', 'number': 0 },
            { 'name': '是', 'number': 1 },
          ],
          routePathFlag: false,
          datasId: '', //代报考
          registerList: [],
          registerColumn: [
            { 'prop': 'itemName', 'label': '报考项目名称' },
            { 'prop': 'basicInfoStatus', 'label': '基本信息情况' },
            { 'prop': 'pictureStatus', 'label': '报考材料情况' },
            { 'prop': 'checkStatus', 'label': '审核情况' },
            { 'prop': 'checkResult', 'label': '审核结果' },
          ]
        }
    },
    created() {
        let arr = [MJ_1, MJ_2, MJ_3, MJ_10, MJ_11, MJ_12, MJ_15];
        this.enumByEnumNums(arr);
        this.pcaa = pcaa;
        this.GetCityList();
        this.GetAgreementList(this.getOrderForm.userId);
        this.getStudentDetails(this.studentUuid);
        console.log(this.$route.path);
        if(this.$route.path.indexOf("newStudents") != -1 || this.$route.path.indexOf("allStudents") != -1 || this.$route.path.indexOf("baokao") != -1){
            this.routePathFlag = true;
        }
    },
    methods: {
      addressSubmitForm(formName) {
        this.$refs[formName].validate((valid) => {
            if (valid) {
                this.updateAddress();
            } else {
              return false;
            }
        });
      },
      updateAddress() {
        this.$smoke_post(updateAddress, this.ruleFormAddress).then(res => {
            if(res.code == 200) {
                this.addressFlag = false;
                this.$message({
                    type: 'success',
                    message: '地址设置成功'
                });
                this.geOrderRecord();
            }
        })
      },
      cityshandleChange(arr) {
        this.ruleFormAddress.provinceId = arr[0];
        this.ruleFormAddress.cityId = arr[1];
        this.ruleFormAddress.districtId = arr[2];
      },
      handleEditAddressClick(row) {
        this.addressFlag = true;
        this.ruleFormAddress.userName = row.userName;
        this.ruleFormAddress.phone = row.phone;
        this.ruleFormAddress.addressArr = [];
        this.ruleFormAddress.addressArr.push(row.provinceId);
        this.ruleFormAddress.addressArr.push(row.cityId);
        this.ruleFormAddress.addressArr.push(row.districtId);
        this.ruleFormAddress.provinceId = row.provinceId;
        this.ruleFormAddress.cityId = row.cityId;
        this.ruleFormAddress.districtId = row.districtId;
        this.ruleFormAddress.address = row.address;
        this.ruleFormAddress.orderId = row.orderId;
        this.formAddressKey = Math.random();
        this.$nextTick(() => {
            this.$refs['ruleFormAddress'].resetFields();
        })
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
          this.copyTel(this.clueDataSUuid);
      },
      quxiao() {
        this.$emit("changeDrawer", false)
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
      },
      handleSelectNation(item) {
        this.customerForm.nation = item.value;
        this.customerForm.nationText = item.value;
      },
      autocompleteClearNation() {
        this.$nextTick(() => {
            this.$refs.autocompleteNation.$children
                .find(c => c.$el.className.includes('el-input'))
                .blur();
            this.customerForm.nation = '';
            this.$refs.autocompleteNation.focus();
        })
      },
      timeChange() {
        this.customerForm.examPeriod = this.customerForm.examPeriod.getTime();
      },
      graduationTimeChange() {
        this.customerForm.graduationTime = this.customerForm.graduationTime.getTime();
      },
      applyCityChange() {
        this.customerForm.applyProvince = this.customerForm.applyProvinceCity[0];
        this.customerForm.applyCity = this.customerForm.applyProvinceCity[1];
      },
      cityChange() {
        this.customerForm.province = this.customerForm.provinceCity[0];
        this.customerForm.city = this.customerForm.provinceCity[1];
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
      GetCityList() {
        this.$smoke_get(GetCityList, {}).then(res => {
            if(res.status == 0) {
                this.citysOptions = citiesFun(res.data.cityList);
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
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$confirm('确认保存修改内容吗？')
            .then(_ => {
              this.addClassTeaStuNotes();
            })
            .catch(_ => {});
          } else {
            return false;
          }
        });
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
            wx: this.customerForm.wx,

            idcardNo: this.customerForm.idcardNo,
            nation: this.customerForm.nation,
            graduationSchool: this.customerForm.graduationSchool,
            graduationTime: this.customerForm.graduationTime,
            applyExam: this.customerForm.applyExam,
            applyProvince: this.customerForm.applyProvince,
            applyCity: this.customerForm.applyCity,
            filingFee: this.customerForm.filingFee,
            examaAsistant: this.customerForm.examaAsistant,
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
      querySearchNation(queryString, cb) {
        var restaurants = nationAll;
        var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) > -1);
        };
      },
      handleClose(done) {
        if(this.callLogUuid) {
            this.$confirm('确认关闭？')
            .then(_ => {
                done();
            })
            .catch(_ => {});
        }else {
            done();
        }
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
          this.getClueCallLog();
          this.notesCallForm.currentPage = 1;
          this.pageshow = false;//让分页隐藏
          this.$nextTick(() => {//重新渲染分页
              this.pageshow = true;
          });
        }else if(tab.label == '课程列表') {
          this.courseLists = [];
          this.GetCourseList4Teacher(this.getOrderForm.userId);
        }else if(tab.label == '代报考进度') {
          this.queryRegisterProcess();
        }
      },
      queryRegisterProcess() {
        this.$smoke_get(queryRegisterProcess, {
          datasId: this.datasId
        }).then(res => {
          if(res.code == 200) {
            res.data.list.map(sll => {
              sll.basicInfoStatus = sll.basicInfoStatus == '1' ? '完整' : '不完整';
              sll.pictureStatus = sll.pictureStatus == '1' ? '完整' : '不完整';
              sll.checkStatus = sll.checkStatus == '1' ? '审核通过' : sll.checkStatus == '2' ? '审核失败' : '待审核';
            })
            this.registerList = res.data.list;
          }
        })
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
      GetAgreementList(id) {

        this.$smoke_get(GetAgreementList, {
          param: {userId: id}
        }).then(res => {
          if(res.status == 0) {
            this.agreementList = res.data.agreementList;
          }
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
            this.customerForm.signUpSchool = res.data.signUpSchool;
            this.customerForm.signUpTime = (res.data.signUpTime != '' ? timestampToTime(Number(res.data.signUpTime)) : '');
            this.customerForm.studentStatus = res.data.studentStatus == 0 || res.data.studentStatus == null ? '' : String(res.data.studentStatus);
            this.customerForm.studySituation = res.data.studySituation == 0 || res.data.studySituation == null ? '' : String(res.data.studySituation);
            this.customerForm.tel = res.data.tel;
            this.customerForm.twoTel = res.data.twoTel;
            this.customerForm.work = res.data.work;
            this.customerForm.workingLife = res.data.workingLife == 0 || res.data.workingLife == null ? '' : String(res.data.workingLife);
            this.customerForm.wx = res.data.wx;
            if(res.data.seatOrgName && res.data.seatName) {
                this.customerForm.seatName = res.data.seatPOrgName? res.data.seatPOrgName + ' ' + res.data.seatOrgName + ' ' + res.data.seatName : res.data.seatOrgName + ' ' + res.data.seatName;
            }else{
                this.customerForm.seatName = '';
            }
            this.customerForm.orgNameListText = getTextByJs(res.data.orgNameList.reverse()); //reverse()倒序排列
            
            this.customerForm.idcardNo = res.data.iDCardNo;
            this.customerForm.nation = res.data.nation;
            this.customerForm.nationText = res.data.nation;
            this.customerForm.graduationSchool = res.data.graduationSchool;
            this.customerForm.graduationTime = timestampToTime(Number(res.data.graduationTime));
            this.customerForm.applyExam = res.data.applyExam;
            this.customerForm.applyProvinceCity = (res.data.applyProvince == "" && res.data.applyCity == "") ? [] : [res.data.applyProvince, res.data.applyCity];
            this.customerForm.filingFee = res.data.filingFee;
            this.customerForm.examaAsistant = res.data.examaAsistant;

            this.ruleFormAddress.schoolName = res.data.signUpSchool;
            this.datasId = res.data.datasId;
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
<style lang="less">
.el-autocomplete-suggestion{
    width: auto !important;
}
</style>
<style lang="less" scoped>
.el-pagination{
    text-align: right;
    margin-top: .4rem;
    margin-right: .4rem;
}
/deep/ .el-autocomplete{
    width: 200px;
}
</style>