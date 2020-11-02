<template>
    <el-main class="index-main newStudents">

        <el-row :class="['people-screen', {actionHide: toggleAction, actionShow: !toggleAction, noSearch: hideSearch}]">

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

            <el-col :span="3">
                <el-input v-model="form.tel" size="small" placeholder="请输入手机号" class="screen-li"></el-input>
            </el-col>

            <el-col :span="3">
                <el-input v-model="form.name" size="small" placeholder="请输入姓名" class="screen-li"></el-input>
            </el-col>

            <el-col :span="3">
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
                <el-input v-model="form.stuId" size="small" placeholder="请输入用户id" class="screen-li"></el-input>
            </el-col>

        </el-row>

        <el-row class="people-screen handle-area">

            <el-col :span="4">

                <el-cascader
                    class="smoke-cascader screen-li"
                    ref="cascader"
                    size="small"
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

            <el-col :span="2">
                <el-button type="primary" size="small" @click="getWaitStudentListClick">查 询</el-button>
            </el-col>

            <el-col :span="4" style="float: right; text-align: right;"><el-button plain size="small" @click="classTeaGetWaitStudent('all', null)">确认领取</el-button></el-col>

        </el-row>

        <el-table
            :data="list"
            ref="tree"
            v-loading="fullscreenLoading"
            @sort-change="sortChange"
            style="width: 100%"
            :height="tableHeight">
            <el-table-column
              type="selection"
              width="45">
            </el-table-column>
            <el-table-column
              :prop="item.prop"
              :label="item.label"
              v-for="(item, index) in columnList"
              :sortable="item.prop == 'createTime' ? 'custom' : item.prop == 'school' ? 'custom' : false"
              :key="index"
              :min-width="item.width"
              >

              <template slot-scope="scope">
                <el-tooltip effect="dark" v-if="item.prop == 'seatName' && scope.row.orgNameListText != '无'" :open-delay="500" :content="scope.row.orgNameListText" placement="top">
                    <span>{{scope.row[item.prop] || '- -'}}</span>
                </el-tooltip>
                <span v-else>{{scope.row[item.prop] || '- -'}}</span>
              </template>

            </el-table-column>
            <el-table-column prop="active" label="操作" fixed="right" width="110" class-name="table_active">
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
                  
                <el-popconfirm
                    confirmButtonText='确定'
                    cancelButtonText='取消'
                    icon="el-icon-info"
                    placement="top"
                    title="确认领取此学员吗？"
                    :hideIcon='true'
                    @onConfirm="receiveClick(scope.row)"
                  >
                    <svg-icon slot="reference" icon-title="领取" icon-class="collect" />
                </el-popconfirm>

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

    </el-main>
</template>

<script>
import { 
    getWaitStudentList, 
    classTeaGetWaitStudent, 
    getSchoolList,
    clTeaOrgFilterBox,
    classTeaExamItem,
    phoneOutTea,
    seatOutTea,
} from '../../request/api';
import StudentsNotes from '@/components/Share/StudentsNotes';
import PageFieldManage from '@/components/Base/PageFieldManage';
import { 
    timestampToTime, classTypeString, orderTypeText, getTextByJs,
    schoolType, sortTextNum
} from '../../assets/js/common';
import { MJ_1, MJ_2, MJ_3, MJ_10, MJ_11, MJ_12, MJ_15, nationAll } from '../../assets/js/data';
import pcaa from 'area-data/pcaa';
export default {
    name: 'newStudents',
    props: ['tableHeight','toggleAction', 'hideSearch'],
    components: {
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
                sortSet: [],
                total: null,
                classUuid: '',
                seatOrgList: [],
                tel: '',
                name: '',
                stuId: '',
                signUpStartTime: '',
                signUpEndTime: '',
            },
            totalFlag: false,
            list: [],
            columnList: [
                { 'prop': 'name', 'label': '姓名' },
                { 'prop': 'tel', 'label': '手机号码', 'width': 100 },
                { 'prop': 'examItemName', 'label': '考试项目', 'width': 150 },
                { 'prop': 'classType', 'label': '班型' },
                { 'prop': 'singlePlatform', 'label': '成单平台' },
                { 'prop': 'createTime', 'label': '报名时间', 'width': 180},
                { 'prop': 'seatName', 'label': '成单坐席', 'width': 300},
                { 'prop': 'goodsName', 'label': '购买商品', 'width': 250 },
            ],
            fullscreenLoading: false,
            sortSetList: [
                {'createTime': ''},
                {'school': ''},
            ],
            handleCurrentUuid: '',
            zuzhiOptions: [],
            columnWidth: 90,
            columnFlag: false,
            schoolList: [],
            studentsPageSize: null,

            drawer: false,
            studentUuid: '',
            userId: '',
            clueDataSUuid: '',
            callLogUuid: '',

            restaurants: [],
            classTypeList: [
                { label: '普通班', value: 0 },
                { label: '高端班', value: 1 },
            ],
            dataPickerValueSignUp: [],
            initOptions: {},
        }
    },
    created() {
        this.studentsPageSize = localStorage.getItem('studentsPageSize');
        if(this.studentsPageSize) {
            this.form.pageSize = Number(this.studentsPageSize);
        }else{
            this.form.pageSize = 20;
        }
        const initOptions = localStorage.getItem('initOptions');
        this.initOptions = JSON.parse(initOptions);
        this.getWaitStudentList();
        this.getSchoolList();
        this.clTeaOrgFilterBox();
        this.classTeaExamItem();
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
        datePickerChangeValueSignUp(value) {
            if (value == null) {
                this.form.signUpStartTime = '';
                this.form.signUpEndTime = '';
            }else{
                this.form.signUpStartTime = value[0].getTime();
                this.form.signUpEndTime = value[1].getTime();
            }
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
        sortChange(data) {
            this.form.sortSet = [];
            const id = sortTextNum(data.prop);
            if(data.order == "descending"){
                this.sortSetList[id][data.prop] = 'DESC';
            }else if(data.order == "ascending"){
                this.sortSetList[id][data.prop] = 'ASC';
            }
            this.form.sortSet.push(this.sortSetList[id]);
            // this.classUuidDefault = this.handleCurrentUuid;
            this.getWaitStudentList();
        },
        receiveClick( scope ) {
            this.classTeaGetWaitStudent('click', scope.uuid)
        },
        getWaitStudentListClick() {
            this.form.currentPage = 1;
            this.getWaitStudentList();
        },
        getWaitStudentList() {
            this.fullscreenLoading = true;
            this.$smoke_post(getWaitStudentList, this.form).then(res => {
                if(res.code == 200) {

                    setTimeout(() => {
                        this.fullscreenLoading = false;
                        res.data.list.map(sll => {
                            sll.createTime  = timestampToTime(Number(sll.createTime));
                            sll.classType = classTypeString(sll.classType);
                            sll.orderType = orderTypeText(sll.orderType);
                            sll.singlePlatform = schoolType(sll.singlePlatform);
                            if(sll.seatOrgName && sll.seatName) {
                                sll.seatName = sll.seatPOrgName? sll.seatPOrgName + ' ' + sll.seatOrgName + ' ' + sll.seatName : sll.seatOrgName + ' ' + sll.seatName;
                            }else{
                                sll.seatName = '';
                            }

                            sll.orgNameListText = getTextByJs(sll.orgNameList.reverse()); //reverse()倒序排列
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
        classTeaGetWaitStudent(type, id) {
            let arr = [];

            if(type == 'all') {
                this.$refs.tree.selection.map(sll => {
                    arr.push(sll.uuid);
                })
                if(arr.length == 0) {
                    this.$message({
                        type: 'error',
                        message: '请您先勾选您要领取的学员'
                    });
                }else{
                    this.$confirm('确认领取？')
                    .then(_ => {
                      this.requestClassTeaGetWaitStudent(arr);
                    })
                    .catch(_ => {});
                }
            }else{
                arr.push(id);
                this.requestClassTeaGetWaitStudent(arr);
            }
        },
        requestClassTeaGetWaitStudent(arr) {
            this.$smoke_post(classTeaGetWaitStudent, {
                uuidList: arr,
            }).then(res => {
                if(res.code == 200) {
                    this.$message({
                        type: 'success',
                        message: '成功领取' + res.data.length + '条'
                    });
                    this.getWaitStudentList();
                }else{
                    this.$message({
                        type: 'error',
                        message: res.msg
                    });
                }
            })
        },
        handleCurrentChange(index) {
            this.form.currentPage = index;
            this.form.pageSize = Number(localStorage.getItem('studentsPageSize')) ? Number(localStorage.getItem('studentsPageSize')) : 20;
            this.getWaitStudentList();
        },
        handleSizeChange(index) {
            this.form.pageSize = index;
            this.form.currentPage = 1;
            localStorage.setItem('studentsPageSize', index);
            this.getWaitStudentList();
        },

        studentDetails( row ) {
            this.drawer = true;
            this.studentUuid = row.uuid;
            this.userId = row.customerId;
            this.clueDataSUuid = row.clueDataSUuid;
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
    },
    mounted() {
        
    }
}
</script>

<style lang="less" scoped>
    .index-main{
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
        }
    }

</style>