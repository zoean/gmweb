<template>
    <el-main class="index-main students">
        
        <el-row style="margin-bottom: 6px;">
            
            <el-col :span="4">
                <el-input v-model="form.tel" size="small" placeholder="请输入手机号" style="width: 90%;"></el-input>
            </el-col>

            <el-col :span="4">
                <el-input v-model="form.name" size="small" placeholder="请输入姓名" style="width: 90%;"></el-input>
            </el-col>
            
            <el-col :span="4">

                <el-cascader
                    class="smoke-cascader"
                    ref="cascader"
                    size="small"
                    style="width: 90%;"
                    placeholder="请选择坐席组织架构"
                    collapse-tags
                    :show-all-levels=false
                    :options="zuzhiOptions"
                    @change='handleZuzhiChange'
                    filterable
                    :props="{ checkStrictly: true, label: 'name', value: 'uuid', children: 'list', multiple: true }"
                    clearable>
                </el-cascader>

            </el-col>

            <el-col :span="4">
                <el-input v-model="form.stuId" size="small" placeholder="请输入用户id" style="width: 90%;"></el-input>
            </el-col>

            <el-col :span="4">
                
                <el-date-picker
                  class="smoke-cascader"
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

            <el-col :span="4">
                <el-select v-model="form.studentStatus" placeholder="请选择学籍状态" style="width: 100%;" size="small" clearable>
                    <el-option
                        v-for="item in enumList['MJ-10']"
                        :key="item.name"
                        v-if="item.enable"
                        :label="item.name"
                        :value="item.number">
                    </el-option>
                </el-select>
            </el-col>

        </el-row>

        <el-row style="margin-top: 16px;">

            <el-col :span="8">
                <el-date-picker
                    size="small"
                    style="width: 95%;"
                    v-model="dataPickerValue"
                    type="datetimerange"
                    :default-time="['00:00:00', '23:59:59']"
                    range-separator="至"
                    @change="datePickerChangeValue"
                    start-placeholder="领取时间"
                    end-placeholder="领取时间">
                </el-date-picker>
            </el-col>

            <el-col :span="8">
                <el-date-picker
                    size="small"
                    style="width: 95%;"
                    v-model="dataPickerValueSignUp"
                    type="datetimerange"
                    :default-time="['00:00:00', '23:59:59']"
                    range-separator="至"
                    @change="datePickerChangeValueSignUp"
                    start-placeholder="报名时间"
                    end-placeholder="报名时间">
                </el-date-picker>
            </el-col>

            <el-col :span="4">
                <el-autocomplete
                    clearable
                    size="small"
                    style="width: 90%;"
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
                <el-select v-model="form.classType" placeholder="请选择班型等级" size="small" clearable>
                    <el-option
                      v-for="item in classTypeList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                </el-select>
            </el-col>

        </el-row>

        <el-row style="margin-top: 16px;">

            <el-col :span="4">
                <el-select v-model="form.examProvince" placeholder="请选择报考省份" style="width: 90%;" size="small" clearable>
                    <el-option
                      v-for="item in provinceList"
                      :key="item.provinceName"
                      :label="item.provinceName"
                      :value="item.provinceName">
                    </el-option>
                </el-select>
            </el-col>

            <el-col :span="4">
                <el-button type="primary" style="float: left;" size="small" @click="getClassTeaStudentClick">查 询</el-button>
                <el-button type="primary" style="float: left; margin-left: 20px;" @click="getSendMsgClassTeaStudentClick" size="small">发 短 信</el-button>
            </el-col>

            <el-col :span="2" style="float: right; text-align: right;"><svg-icon class="border-icon" style="margin-right: 0;" @click="editFieldHandle" icon-title="表头管理" icon-class="field" /></el-col>

        </el-row>

        <el-table
            :data="list"
            :key="Math.random()" 
            ref="tree"
            v-loading="fullscreenLoading"
            style="margin-top: 16px;"
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

                    <el-tooltip effect="dark" v-if="item.props == 'seatName' && scope.row.orgNameListText != '无'" :open-delay="500" :content="scope.row.orgNameListText" placement="top">
                      <span>{{scope.row[item.props] || '- -'}}</span>
                    </el-tooltip>
                    <span v-else>{{scope.row[item.props] || '- -'}}</span>

                    <svg-icon class="copy-tel" v-if="item.props == 'tel'" icon-class="copy" icon-title="复制手机号码" @click="phoneCopy(scope.row)" />
                    
              </template>
            </el-table-column>

            <el-table-column prop="active" label="操作" fixed="right" width="100" class-name="table_active">
              <template slot-scope="scope">

                <el-popconfirm
                    confirmButtonText='确定'
                    cancelButtonText='取消'
                    icon="el-icon-info"
                    placement="top"
                    title="确认拨打该学员电话吗？"
                    :hideIcon='true'
                    v-if="!$route.query.id"
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
                    v-if="!$route.query.id"
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
            :current-page='form.currentPage'
            :page-sizes="[10, 20, 30, 50, 100]"
            :hide-on-single-page="totalFlag"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
        >
        </el-pagination>

        <el-dialog width="40%" title="短信发送" :visible.sync="smsFlag">
          
          <el-table
            :data="smsList"
            ref="smsTable"
            v-if="smsSetFlag"
            >

            <el-table-column
              type="selection"
              width="45">
            </el-table-column>

            <el-table-column
                :prop="item.prop"
                :label="item.label"
                v-for="(item, index) in smsColumnList"
                :key="index">

                <template slot-scope="scope">
                
                    <span>{{scope.row[item.prop] || '- -'}}</span>

                </template>

            </el-table-column>

          </el-table>

          <span slot="footer" class="dialog-footer" v-if="smsSetFlag">

            <el-button @click="smsFlag = false" plain size="small">取 消</el-button>
            <el-button type="primary" @click="smsStuUuidListClick" size="small">确 定</el-button>

          </span>

          <el-form :model="smsForm" :rules="smsFormRules" ref="smsForm" class="demo-ruleForm" v-if="!smsSetFlag">
                
              <el-form-item label="短信名字" prop="smsMsgId">
                
                <el-select @change="smsMsgChange" v-model="smsForm.smsMsgId" placeholder="请选择短信模板" size="small" >
                    <el-option
                      v-for="item in smsMsgList"
                      :key="item.msgId"
                      :label="item.msgName"
                      :value="item.msgId">
                    </el-option>
                </el-select>

              </el-form-item>

              <el-form-item label="" prop="smsMsgText">
                <el-input size="small" type="textarea" v-model="smsForm.smsMsgText" readonly autosize></el-input>
              </el-form-item>

              <el-form-item label="发送方式" prop="type">
                
                <el-select @change="smsTypeChange" v-model="smsForm.type" placeholder="请选择发送方式" size="small" >
                    <el-option
                      v-for="item in smsTypeList"
                      :key="item.msgId"
                      :label="item.msgName"
                      :value="item.msgId">
                    </el-option>
                </el-select>

              </el-form-item>

              <el-form-item label="每日发送时间" prop="timeValue" v-if="smsTypeFlag">

                <el-time-picker
                  v-model="smsForm.timeValue"
                  value-format="HH:mm:ss"
                  placeholder="每日发送时间"
                  size="small"
                  style="width: 100%;"
                >
                </el-time-picker>

              </el-form-item>

              <el-form-item label="每日发送量" prop="number" v-if="smsTypeFlag">
                  <el-input v-model="smsForm.number" placeholder="请输入每日发送量" size="small"></el-input>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" size="small" @click="sendSms('smsForm')">发送短信</el-button>
                <el-button @click="sendSmsFalse" size="small" plain>取消</el-button>
              </el-form-item>

          </el-form>

        </el-dialog>

        <StudentsNotes 
            v-if="drawer"
            @changeDrawer="changeDrawer"
            :drawer.sync='drawer'
            :studentUuid='studentUuid'
            :userId='userId'
            :clueDataSUuid='clueDataSUuid'
            :callLogUuid='callLogUuid'
        >
        </StudentsNotes>

        <PageFieldManage :setPageNum="setPageNum" />

    </el-main>
</template>

<script>
import { 
    getClassTeaStudent, 
    getSchoolList,
    copyTel,
    phoneOutTea,
    seatOutTea,
    clTeaOrgFilterBox,
    getSendMsgClassTeaStudent,
    groupSMS,
    getSMSMsgBaseList,
    classTeaExamItem,
    enumByEnumNums,
    queryProvinceAll
} from '../../request/api';
import StudentsNotes from '@/components/Share/StudentsNotes';
import PageFieldManage from '@/components/Base/PageFieldManage';
import { 
    timestampToTime, classTypeString, orderTypeText, getTextByJs,
    countDown
} from '../../assets/js/common';
import { MJ_1, MJ_2, MJ_3, MJ_10, MJ_11, MJ_12, MJ_15, nationAll } from '../../assets/js/data';
import pcaa from 'area-data/pcaa';
export default {
    name: 'students',
    components: {
        PageFieldManage,
        StudentsNotes
    },
    data() {
        return {
            form: {
                currentPage: 1,
                pageSize: 20,
                classType: '',
                examItemId: '',
                examItemText: '',
                studentStatus: '',
                sortSet: [
                    {'receiveTime': 'DESC'},
                ],
                total: null,
                classTeaUuid: '',
                seatOrgList: [],
                classUuid: '', //班级的uuid
                num: '',
                tel: '',
                name: '',
                startTime: '',
                endTime: '',
                receiveStartTime: '',
                receiveEndTime: '',
                signUpStartTime: '',
                signUpEndTime: '',
            },
            list: [],
            dataPickerValue: [],
            dataPickerValueSignUp: [],
            columnList: [{
                label: '班型'
            }],
            classTypeList: [
                { label: '普通班', value: 0 },
                { label: '高端班', value: 1 },
            ],
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
            totalFlag: false, //当只有一页时隐藏分页
            schoolList: [],
            fullscreenLoading: false,
            initOptions: {},
            studentsPageSize: null,

            smsFlag: false,
            smsList: [],
            smsColumnList: [
                { 'prop': 'name', 'label': '姓名' },
                { 'prop': 'tel', 'label': '手机号码' },
            ],

            smsForm: {
                number: '', //每日发送数量
                smsMsgId: '', //短信模板id	
                smsMsgText: '',
                stuList: [], //手机号码集合	(uuid)
                time: '', //发送时间(示例：10：13：12 将其换算为毫秒)
                timeValue: '',
                type: '', //发送方式：1 定时发送 2 一次性发送
            },
            smsFormRules: {
                number: [
                  { required: true, message: '请输入每日发送量', trigger: 'blur' }
                ],
                smsMsgId: [
                  { required: true, message: '请选择短信模板', trigger: 'change' }
                ],
                timeValue: [
                  { required: true, message: '请选择每日发送时间', trigger: 'change' }
                ],
                type: [
                  { required: true, message: '请选择发送方式', trigger: 'change' }
                ],
            },
            smsMsgList: [],
            smsSetFlag: true,
            smsTypeList: [
                { msgName: '定时发送', msgId: 1},
                { msgName: '一次性发送', msgId: 2},
            ],
            smsTypeFlag: false,

            drawer: false,
            studentUuid: '',
            userId: '',
            clueDataSUuid: '',
            callLogUuid: '',

            restaurants: [],
            enumList: {},
            provinceList: [],
        }
    },
    created() {
        this.studentsPageSize = localStorage.getItem('studentsPageSize');
        if(this.studentsPageSize) {
            this.form.pageSize = Number(this.studentsPageSize);
        }else{
            this.form.pageSize = 20;
        }
        this.getClassTeaStudent();
        this.getSchoolList();
        const initOptions = localStorage.getItem('initOptions');
        this.initOptions = JSON.parse(initOptions);
        this.clTeaOrgFilterBox();
        this.classTeaExamItem();
        let arr = [MJ_10];
        this.enumByEnumNums(arr);
        this.queryProvinceAll();
    },
    methods: {
        queryProvinceAll() {
          this.$smoke_get(queryProvinceAll, {}).then(res => {
            if(res.code == 200) {
                this.provinceList = res.data;
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
        classTeaExamItem() {
            let arr;
            this.$smoke_get(classTeaExamItem, {}).then(res => {
                arr = JSON.parse(JSON.stringify(res.data).replace(/examItemName/g,"value"));
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
            this.form.examItemId = item.examItemId;
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
        changeDrawer(val){
            this.drawer = val;
        },
        sendSmsFalse() {
            this.smsSetFlag = true;
            
            this.$nextTick(() => {
                this.smsList.map(sll => {
                    this.$refs.smsTable.toggleRowSelection(sll, true);
                })
            })
        },
        sendSms(formName) {
            this.$refs[formName].validate((valid) => {
              if (valid) {
                if(this.smsTypeFlag) {
                    this.smsForm.time = countDown(this.smsForm.timeValue);
                }
                // console.log(this.smsForm);
                this.groupSMS();
              } else {
                return false;
              }
            });
        },
        groupSMS() {
            this.$smoke_post(groupSMS, this.smsForm).then(res => {
                if(res.code == 200) {
                    this.$message({
                        type: 'success',
                        message: '发送成功'
                    });
                    this.smsFlag = false;
                }else{
                    this.$message({
                        type: 'error',
                        message: res.msg
                    });
                }
            })
        },
        smsMsgChange(value) {
            this.smsMsgList.map(sll => {
                if(sll.msgId == value){
                    this.smsForm.smsMsgText = sll.msg;
                }
            })
        },
        smsTypeChange(value) {
            if(value == 1) {
                this.smsTypeFlag = true;
            }else{
                this.smsTypeFlag = false;
            }
        },
        getSMSMsgBaseList() {
            this.$smoke_get(getSMSMsgBaseList, {}).then(res => {
                if(res.code == 200) {
                    this.smsMsgList = res.data;
                }
            })
        },
        getSendMsgClassTeaStudentClick() {
            this.smsFlag = true;
            this.smsSetFlag = true;
            this.$smoke_post(getSendMsgClassTeaStudent, this.form).then(res => {
                if(res.code == 200) {
                    this.smsList = res.data;
                    this.$nextTick(() => {
                        res.data.map(sll => {
                            this.$refs.smsTable.toggleRowSelection(sll, true);
                        })
                    })
                }
            })
        },
        smsStuUuidListClick() {
            let stuUuidArr = [];
            this.$refs.smsTable.selection.map(sll => {
                stuUuidArr.push(sll.stuUuid);
            });
            if(stuUuidArr.length != 0) {
                this.smsForm.stuList = stuUuidArr;
                this.smsForm.timeValue = '';
                this.smsSetFlag = false;
                this.getSMSMsgBaseList();
            }else{
                this.$message({
                    type: 'error',
                    message: '暂无学员可发送短信'
                });
            }
        },
        datePickerChange(value) {
            if(Array.isArray(value)){
                this.form.endTime = value[1].getTime();
                this.dataPicker = value[1];
            }else if(value != null) {
                this.form.endTime = value.getTime();
            }else{
                this.form.endTime = '';
            }
        },
        datePickerChangeValue(value) {
            if (value == null) {
                this.form.receiveStartTime = '';
                this.form.receiveEndTime = '';
            }else{
                this.form.receiveStartTime = value[0].getTime();
                this.form.receiveEndTime = value[1].getTime();
            }
        },
        datePickerChangeValueSignUp(value) {
            if (value == null) {
                this.form.signUpStartTime = '';
                this.form.signUpEndTime = '';
            }else{
                this.form.signUpStartTime = value[0].getTime();
                this.form.signUpEndTime = value[1].getTime();
            }
        },
        handleZuzhiChange(arr) {
            let brr = [];
            arr.map(res => {
                if(res.length == 1){
                    brr.push(res[0]);
                }else{
                    brr.push(res[res.length-1]);
                }
            })
            this.form.seatOrgList = brr;
        },
        clTeaOrgFilterBox() {
            this.$smoke_get(clTeaOrgFilterBox, {}).then(res => {
                if(res.code == 200) {
                    this.zuzhiOptions = res.data;
                }
            })
        },
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
        studentDetails( row ) {
            this.drawer = true;
            this.studentUuid = row.uuid;
            this.userId = row.customerId;
            this.clueDataSUuid = row.clueDataSUuid;
        },
        getClassTeaStudentClick() {
            this.form.currentPage = 1;
            this.getClassTeaStudent();
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
                            if(sll.seatOrgName && sll.seatName) {
                                sll.seatName = sll.seatPOrgName? sll.seatPOrgName + ' ' + sll.seatOrgName + ' ' + sll.seatName : sll.seatOrgName + ' ' + sll.seatName;
                            }else{
                                sll.seatName = '';
                            }

                            sll.orgNameListText = getTextByJs(sll.orgNameList.reverse()); //reverse()倒序排列
                        })
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
        phoneCopy(row) {
            this.copyTel(row.clueDataSUuid);
        },
        copyTel(id) {
            this.$smoke_post(copyTel, {
                uuid: id
            }).then(res => {
                if(res.code == 200) {
                    this.$copyText(res.data).then(
		                res => {
		                    this.$message({
                                type: 'success',
                                message: '复制成功',
                            })
		                },
		                err => {
		                    this.$message({
                                type: 'error',
                                message: '复制失败',
                            })
		                }
		            )
                }else{
                    this.$message({
                        type: 'error',
                        message: res.msg
                    })
                }
            })
        },
        handleCurrentChange(index) {
            this.form.currentPage = index;
            this.form.pageSize = Number(localStorage.getItem('studentsPageSize')) ? Number(localStorage.getItem('studentsPageSize')) : 20;
            this.getClassTeaStudent();
        },
        handleSizeChange(index) {
            this.form.pageSize = index;
            this.form.currentPage = 1;
            localStorage.setItem('studentsPageSize', index);
            this.getClassTeaStudent();
        },
    },
    mounted() {

    },
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
            background: #F1F1F1;
            margin-bottom: 20px;
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
