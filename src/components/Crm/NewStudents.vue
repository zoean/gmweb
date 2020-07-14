<template>
    <el-main class="index-main newStudents">

        <el-row style="margin-bottom: 10px;">

            <el-col :span="4" style="float: right; text-align: right;"><el-button type="primary" size="small" @click="classTeaGetWaitStudent('all', null)">确认领取</el-button></el-col>
            
            <el-col :span="4">
                <el-input v-model="form.tel" size="small" placeholder="请输入手机号" style="width: 90%;"></el-input>
            </el-col>

            <el-col :span="4">
                <el-input v-model="form.name" size="small" placeholder="请输入姓名" style="width: 90%;"></el-input>
            </el-col>

            <el-col :span="5" class="">

                <el-cascader
                    class="smoke-cascader"
                    ref="cascader"
                    size="small"
                    style="width: 95%;"
                    placeholder="请搜索或者选择坐席组织架构"
                    collapse-tags
                    :show-all-levels=false
                    :options="zuzhiOptions"
                    @change='handleZuzhiChange'
                    filterable
                    :props="{ checkStrictly: true, label: 'name', value: 'uuid', children: 'includeSubsetList', multiple: true }"
                    clearable>
                </el-cascader>

            </el-col>

            <el-col :span="4">
                <el-input v-model="form.stuId" size="small" placeholder="请输入用户id" style="width: 90%;"></el-input>
            </el-col>

            <el-col :span="3">
                <el-button type="primary" size="small" @click="getWaitStudentListClick">查 询</el-button>
            </el-col>

        </el-row>

        <el-tabs v-model="classUuidDefault" @tab-click="handleClassTabClick">
            <el-tab-pane :label="item.text" :name="item.uuid" v-for="(item,index) in tabsList" :key="index"></el-tab-pane>
        </el-tabs>

        <el-table
            :data="list"
            ref="tree"
            :key="Math.random()"
            v-loading="fullscreenLoading"
            @sort-change="sortChange"
            style="width: 100%">
            <el-table-column
              type="selection"
              width="45">
            </el-table-column>
            <el-table-column
              :prop="item.prop"
              :label="item.label"
              :min-width="item.prop == 'seatName' ? '300px' : item.prop == 'createTime' ? '180px' : item.prop == 'examItemName' ? '150px' : item.prop == 'tel' ? '100px' : item.prop == 'goodsName' ? '220px' : '' "
              v-for="(item, index) in columnList"
              :sortable="item.prop == 'createTime' ? 'custom' : item.prop == 'school' ? 'custom' : false"
              :key="index"
              >

              <template slot-scope="scope">
                <el-tooltip effect="dark" v-if="item.prop == 'seatName' && scope.row.orgNameListText != '无'" :open-delay="500" :content="scope.row.orgNameListText" placement="top">
                    <span>{{scope.row[item.prop] || '- -'}}</span>
                </el-tooltip>
                <span v-else>{{scope.row[item.prop] || '- -'}}</span>
              </template>

            </el-table-column>
            <el-table-column prop="active" label="操作" fixed="right" width="80">
              <template slot-scope="scope">

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
    getClassTeaClassWait,
    getSchoolList,
    getOrgSubsetByUuid,
} from '../../request/api';
import StudentsNotes from '@/components/Share/StudentsNotes';
import PageFieldManage from '@/components/Base/PageFieldManage';
import { 
    timestampToTime, classTypeString, orderTypeText, copyData, getTextByJs,
    citiesFun, countDown 
} from '../../assets/js/common';
import { MJ_1, MJ_2, MJ_3, MJ_10, MJ_11, MJ_12, MJ_15, showid, nationAll } from '../../assets/js/data';
import pcaa from 'area-data/pcaa';
export default {
    name: 'newStudents',
    components: {
        StudentsNotes
    },
    data() {
        return {
            form: {
                currentPage: 1,
                pageSize: 20,
                sortSet: [],
                total: null,
                classUuid: '',
                seatOrgList: [],
                tel: '',
                name: '',
                stuId: '',
            },
            totalFlag: false,
            list: [],
            columnList: [
                { 'prop': 'name', 'label': '姓名' },
                { 'prop': 'tel', 'label': '手机号码' },
                { 'prop': 'examItemName', 'label': '考试项目' },
                { 'prop': 'classType', 'label': '班型' },
                { 'prop': 'school', 'label': '分校' },
                { 'prop': 'createTime', 'label': '报名时间' },
                { 'prop': 'seatName', 'label': '成单坐席' },
                { 'prop': 'goodsName', 'label': '购买商品' },
            ],
            tabsList: [],
            classUuidDefault: '',
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
        }
    },
    created() {
        this.studentsPageSize = localStorage.getItem('studentsPageSize');
        if(this.studentsPageSize) {
            this.form.pageSize = Number(this.studentsPageSize);
        }else{
            this.form.pageSize = 20;
        }
        this.getClassTeaClassWait();
        this.getSchoolList();
        this.getOrgSubsetByUuid();
    },
    methods: {
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
        getOrgSubsetByUuid() {
            this.$smoke_post(getOrgSubsetByUuid, {
                uuid: showid
            }).then(res => {
                this.zuzhiOptions = res.data;
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
            this.classUuidDefault = this.handleCurrentUuid;
            this.getWaitStudentList();
        },
        receiveClick( scope ) {
            this.classTeaGetWaitStudent('click', scope.uuid)
        },
        getClassTeaClassWait() {
            this.$smoke_post(getClassTeaClassWait, this.form).then(res => {
                if(res.code == 200) {

                    if(res.data.length != 0) {
                        res.data.map(sll => {
                            sll.text = sll.examItem + ' - ' + classTypeString(sll.classType) + ' (' + sll.num + ') ';
                        })
                        this.form.classUuid = res.data[0].uuid;
                        this.classUuidDefault = res.data[0].uuid;
                    }

                    this.tabsList = res.data;
                    this.getWaitStudentList();

                }else{

                    this.$message({
                        type: 'error',
                        message: res.msg
                    })

                }
            })
        },
        getWaitStudentListClick() {
            this.form.currentPage = 1;
            this.getClassTeaClassWait();
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
        handleClassTabClick(tab, event) {
            this.handleCurrentUuid = this.form.classUuid = tab.name;
            this.form.currentPage = 1;
            this.form.pageSize = Number(localStorage.getItem('studentsPageSize')) ? Number(localStorage.getItem('studentsPageSize')) : 20;
            this.getWaitStudentList();
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
                    this.getClassTeaClassWait();
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

    .newStudents /deep/ div.el-dialog__body{
        height: 55vh;
        overflow: auto;
    }
</style>