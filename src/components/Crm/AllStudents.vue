<template>
    <el-main class="index-main allStudents">

        <el-row  :class="['people-screen', {actionHide: toggleAction, actionShow: !toggleAction, noSearch: hideSearch}]">
            <el-col :span="6">
                <el-date-picker
                    size="small"
                    style="width: 97%;"
                    v-model="dataPickerValue"
                    type="datetimerange"
                    range-separator="至"
                    :default-time="['00:00:00', '23:59:59']"
                    @change="datePickerChangeValue"
                    start-placeholder="领取时间"
                    end-placeholder="领取时间">
                </el-date-picker>
            </el-col>
            <el-col :span="3">
                <el-input v-model="form.tel" placeholder="请输入手机号" class="screen-li" size="small"></el-input>
            </el-col>
            <el-col :span="3">
                <el-input v-model="form.name" placeholder="请输入姓名" class="screen-li" size="small"></el-input>
            </el-col>
            <el-col :span="3">
                <el-autocomplete
                    v-scroll-lock="scrollLockFlag"
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
                    @focus="scrollLockFlag = true"
                    @blur="scrollLockFlag = false"
                ></el-autocomplete>
            </el-col>
            <el-col :span="3">
                <el-select v-model="form.classType" placeholder="选择班型等级" class="screen-li" size="small" clearable>
                    <el-option
                      v-for="item in classTypeList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="3">
                <el-input v-model="form.teaName" placeholder="请输入班主任姓名" class="screen-li" size="small"></el-input>
            </el-col>

            <el-col :span="3">
                <el-input v-model="form.stuId" size="small" placeholder="请输入用户id" style="width: 100%;"></el-input>
            </el-col>
        </el-row>

        <el-row class="people-screen">

            <el-col :span="6">
                <el-date-picker
                    size="small"
                    style="width: 97%;"
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
                
                <el-date-picker
                  class="screen-li"
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

            <el-col :span="3">

                <el-cascader
                    ref="cascader"
                    size="small"
                    class="smoke-cascader1 screen-li"
                    placeholder="坐席组织架构"
                    collapse-tags
                    :show-all-levels='true'
                    :options="zuzhiOptions"
                    @change='handleZuzhiChange'
                    filterable
                    :props="{ checkStrictly: true, label: 'name', value: 'uuid', children: 'list', multiple: true }"
                    clearable>
                </el-cascader>

            </el-col>

            <el-col :span="3">
                <el-select v-model="form.examProvince" placeholder="选择报考省份" class="screen-li" size="small" clearable>
                    <el-option
                      v-for="item in provinceList"
                      :key="item.provinceName"
                      :label="item.provinceName"
                      :value="item.provinceName">
                    </el-option>
                </el-select>
            </el-col>

            <el-col :span="4">

                <el-button type="primary" @click="getSupStuListClick" size="small">查 询</el-button>

                <el-button type="primary" @click="getSendMsgClassTeaStudentClick" size="small">发 短 信</el-button>

            </el-col>

            <el-col :span="4">
                <svg-icon style="margin-right: 0;" class="border-icon smoke-fr" @click="moveStudents('all', null)" icon-title="批量转移" icon-class="move" />
            </el-col>

        </el-row>

        <el-table
            :data="list"
            ref="tableSelect"
            @sort-change="sortChange"
            :key="this.tableKey"
            v-loading="fullscreenLoading"
            style="width: 100%"
            :height="tableHeight">
            <el-table-column
              type="selection"
              width="45">
            </el-table-column>
            <el-table-column
              :prop="item.prop"
              :label="item.label"
              :formatter="item.formatter"
              :sortable="item.prop == 'createTime' ? 'custom' : item.prop == 'receiveTime' ? 'custom' : false"
              :min-width="item.prop == 'seatName' ? '300px' : item.prop == 'createTime' ? '180px' : item.prop == 'examItemName' ? '150px' : item.prop == 'tel' ? '100px' : item.prop == 'receiveTime' ? '180px' : item.prop == 'goodsName' ? '220px' : item.prop == 'applyExamName' ? '80px' :  item.prop == 'filingFee' ? '120px' : ''"
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
            <el-table-column prop="active" label="操作" fixed="right" width="80" class-name="table_active">
              <template slot-scope="scope">
                <svg-icon @click="studentDetails(scope.row)" icon-title="学员详情" icon-class="detail" />
                <svg-icon @click="moveStudentOne(scope.row)" icon-title="转移学员" icon-class="move" />
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

        <StudentsSMS 
            v-if="studentsSMSFlag"
            @changeStudentsSMSFlag="changeStudentsSMSFlag"
            :studentsSMSFlag.sync='studentsSMSFlag'
            :studentsSMSForm='form'
        >
        </StudentsSMS>

    </el-main>
</template>

<script>
import { 
    getSupStuList,
    getExamBasic,
    getTransferStuCTList,
    transferStu,
    getSchoolList,
    clTeaOrgFilterBox,
    getSendMsgClassTeaStudent,
    queryProvinceAll
} from '../../request/api';
import StudentsNotes from '@/components/Share/StudentsNotes';
import StudentsSMS from '@/components/Share/StudentsSMS';
import { 
    timestampToTime, 
    genderText,
    classTypeString,
    getTextByJs,
    sortTextNum,
    citiesFun,
    schoolType
} from '../../assets/js/common';
import { MJ_1, MJ_2, MJ_3, MJ_10, MJ_11, MJ_12, MJ_15, nationAll } from '../../assets/js/data';
import pcaa from 'area-data/pcaa';
export default {
    name: 'allStudents',
    props: ['tableHeight','toggleAction', 'hideSearch'],
    components: {
        StudentsNotes,
        StudentsSMS
    },
    data() {
        return {
            form: {
                currentPage: 1,
                pageSize: 20,
                classType: '',
                examItemId: '',
                examItemText: '',
                name: '',
                teaName: '',
                seatOrgList: [],
                sortSet: [
                    {'receiveTime': 'DESC'},
                ],
                tel: "", //手机号
                total: null,
                stuId: '',
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
            totalFlag: false,
            columnList: [
                { 'prop': 'name', 'label': '姓名' },
                { 'prop': 'tel', 'label': '手机号码' },
                { 'prop': 'examItemName', 'label': '考试项目' },
                { 'prop': 'classType', 'label': '班型' },
                { 'prop': 'classTea', 'label': '班主任' },
                { 'prop': 'seatName', 'label': '成单坐席' },
                { 'prop': 'singlePlatform', 'label': '成单平台' },
                { 'prop': 'createTime', 'label': '报名时间' },
                { 'prop': 'receiveTime', 'label': '领取时间' },
                { 'prop': 'goodsName', 'label': '购买商品' },
                { 'prop': 'applyExamName', 'label': '报考条件' },
                { 'prop': 'examProvince', 'label': '报考省份' },
                { 'prop': 'filingFee', 'label': '是否缴纳备案金' },
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
            columnWidth: 90,
            columnFlag: false,
            schoolList: [],
            tableKey: '',
            sortSetList: [
                {'createTime': ''},
                {'receiveTime': ''},
            ],

            drawer: false,
            studentUuid: '',
            userId: '',
            clueDataSUuid: '',
            callLogUuid: '',

            studentsSMSFlag: false,

            scrollLockFlag: false,
            provinceList: [],
        }
    },
    created() {
        const studentsPageSize = localStorage.getItem('studentsPageSize');
        if(studentsPageSize) {
            this.form.pageSize = Number(studentsPageSize);
        }else{
            this.form.pageSize = 20;
        }
        this.getSupStuList();
        this.getExamBasic();
        this.getSchoolList();
        this.clTeaOrgFilterBox();
        this.queryProvinceAll();
    },
    methods: {
        getSendMsgClassTeaStudentClick() {
            this.studentsSMSFlag = true;
        },
        changeStudentsSMSFlag(val){
            this.studentsSMSFlag = val;
        },
        queryProvinceAll() {
          this.$smoke_get(queryProvinceAll, {}).then(res => {
            if(res.code == 200) {
                this.provinceList = res.data;
            }
          })
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
        changeDrawer(val){
            this.drawer = val;
        },
        sortChange(data) {
            this.form.sortSet = [];
            const id = sortTextNum(data.prop);
            if(data.order == "descending"){
                this.sortSetList[id][data.prop] = 'DESC';
            }else if(data.order == "ascending"){
                this.sortSetList[id][data.prop] = 'ASC';
            }
            this.form.sortSet.push(this.sortSetList[id]);
            this.getSupStuList();
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
        datePickerChange(value) {
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
            arr.map(res => {
                if(res.length == 1){
                    brr.push(res[0]);
                }else{
                    brr.push(res[res.length-1]);
                }
            })
            this.form.seatOrgList = brr;
        },
        cityshandleChange(arr) {
            this.ruleFormAddress.provinceId = arr[0];
            this.ruleFormAddress.cityId = arr[1];
            this.ruleFormAddress.districtId = arr[2];
        },
        clTeaOrgFilterBox() {
            this.$smoke_get(clTeaOrgFilterBox, {}).then(res => {
                if(res.code == 200) {
                    this.zuzhiOptions = res.data;
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
            this.form.pageSize = Number(localStorage.getItem('studentsPageSize')) ? Number(localStorage.getItem('studentsPageSize')) : 20;
            this.getSupStuList();
        },
        handleSizeChange(index) {
            this.form.pageSize = index;
            this.form.currentPage = 1;
            localStorage.setItem('studentsPageSize', index);
            this.getSupStuList();
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
        createFilter(queryString) {
            return (restaurant) => {
              return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) > -1);
            };
        },
        handleSelect(item) {
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
                            sll.createTime = timestampToTime(Number(sll.createTime));
                            sll.receiveTime = timestampToTime(Number(sll.receiveTime));
                            sll.classType = classTypeString(sll.classType);
                            if(sll.seatOrgName && sll.seatName) {
                                sll.seatName = sll.seatPOrgName? sll.seatPOrgName + ' ' + sll.seatOrgName + ' ' + sll.seatName : sll.seatOrgName + ' ' + sll.seatName;
                            }else{
                                sll.seatName = '';
                            }
                            sll.singlePlatform = schoolType(sll.singlePlatform);
                            sll.orgNameListText = getTextByJs(sll.orgNameList.reverse()); //reverse()倒序排列
                            sll.filingFee = sll.filingFee ? '是' : '否';
                        })
                        this.list = res.data.list;
                        this.form.total = res.data.total;
                        this.$emit('setTableHeight', this.form.total, 1, 2)
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
            // this.tableKey = Math.random();
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
            this.studentUuid = row.stuUuid;
            this.userId = row.customerId;
            this.clueDataSUuid = row.clueDataSUuid;
        },
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
            margin-bottom: 10px;
            .screen-li{
                width: 94%;
            }
        }
        .el-col-6{
            height: auto !important;
        }
    }

</style>