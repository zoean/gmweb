<template>
    <el-main class="index-main">
        <el-row class="people-screen">
            <el-col :span="4" style="float: right; text-align: right;">
                <el-button type="primary" size="small" @click="addClassClick">添加考试项-班型</el-button>
            </el-col>

            <el-col :span="4">

                <el-autocomplete
                    clearable
                    size="small"
                    ref="autocomplete"
                    style="width: 100%;"
                    v-model="form.examItemText"
                    :fetch-suggestions="querySearch"
                    placeholder="请输入考试项目"
                    :trigger-on-focus="true"
                    @select="handleSelectExam"
                    @clear="autocompleteClear"
                ></el-autocomplete>

            </el-col>

            <el-col :span="4" style="margin-left: 20px;">
                <el-button type="primary" size="small" @click="getClassList">查 询</el-button>
            </el-col>

        </el-row>

        <el-table
            :data="list"
            v-loading="fullscreenLoading"
            style="width: 100%"
            :height="tableHeight">
            <el-table-column
              :prop="item.prop"
              :label="item.label"
              v-for="(item, index) in columnList1"
              :key="index"
              >
            </el-table-column>
            <el-table-column prop="active" label="操作" width="70">
              <template slot-scope="scope">
              <svg-icon @click="addHeadTeacherClick(scope.row)" icon-title="配置班主任" icon-class="config" />
              <!-- <svg-icon @click="headTeacherListClick(scope.row)" icon-title="班主任列表" icon-class="list" /> -->
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
            :title="drawerTitle1"
            :visible.sync="drawer1"
            :direction="direction1"
            :before-close="handleClose">
            <span class="bullets"></span>

            <el-form :model="ruleForm1" :rules="rules1" ref="ruleForm1" style="border: 1px dashed #ccc; padding: .4rem; margin: .2rem;">
                
                <el-form-item label="考试项目" prop="subjectText">
                
                    <el-autocomplete
                        class="inline-input"
                        style="width: 100%;"
                        v-model="ruleForm1.subjectText"
                        :fetch-suggestions="querySearch"
                        placeholder="请输入内容"
                        size="small"
                        @select="handleSelect"
                    ></el-autocomplete>

                </el-form-item>

                <el-form-item label="班型等级" prop="classType">
                    <el-select v-model="ruleForm1.classType" placeholder="请选择班型等级" size="small">
                        <el-option
                          v-for="item in classTypeList"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item>
                  <el-button type="primary" @click="submitForm1('ruleForm1')" size="small">确定</el-button>
                  <el-button @click="quxiao" size="small">取消</el-button>
                </el-form-item>

            </el-form>
            
        </el-drawer>

        <!-- <el-drawer
            :title="drawerTitle2"
            :visible.sync="drawer2"
            :direction="direction2"
            size="40%"
            :before-close="handleClose">
            <span class="bullets"></span>

            <el-table
                :data="teacherList"
                v-loading="fullscreenLoadingDetails"
                style="width:94%; margin: 0 auto;">
                <el-table-column
                  :prop="item.prop"
                  :label="item.label"
                  v-for="(item, index) in columnList2"
                  :key="index"
                  >
                </el-table-column>
                <el-table-column prop="active" label="操作">
                  <template slot-scope="scope">
                      <el-button @click="studentsListClick(scope.row)" type="text" >学员列表</el-button>
                      <el-button @click="studentsMoveClick(scope.row)" type="text" v-if="scope.row.studentNum != 0 && teacherList.length > 1">学员转移</el-button>
                  </template>
                </el-table-column>
            </el-table>

            <el-pagination
                background
                layout="total, sizes, prev, pager, next, jumper"
                style="text-align: right; margin-top: 20px;"
                :total='teacherForm.total'
                :page-size='teacherForm.pageSize'
                :current-page='teacherForm.currentPage'
                :page-sizes="[10, 20, 30, 50, 100]"
                :hide-on-single-page="totalFlag"
                @current-change="handleCurrentChangeTeacher"
                @size-change="handleSizeChangeTeacher"
            >
            </el-pagination>
            
        </el-drawer> -->

        <!-- <el-drawer
            :title="drawerTitle4"
            :visible.sync="drawer4"
            :direction="direction4"
            :before-close="handleClose"
        >
            <span class="bullets"></span>

        <div class="tagName">{{this.teacherMoveForm.className}}，共有<span style="color: #409EFF;"> {{this.teacherMoveForm.classLength}} </span>名班主任</div>
 
        <el-tag 
            v-for="(item,index) in teacherMoveList" :key="index"
            style="margin-left: 20px; cursor: pointer; margin-top: 20px;"
            :class="item.mainUin ? 'tagActive' : ''"
            @click="tagClick(item)"
            >{{item.userName}}
        </el-tag>

        </el-drawer> -->

        <el-drawer
            :title="drawerTitle3"
            :visible.sync="drawer3"
            :direction="direction3"
            size="50%"
            :before-close="handleClose">
            <span class="bullets"></span>

            <div style="height: 52px; background: #FAFAFA; border-bottom: 1px dashed #ccc; padding: 10px 0 0 40px; position: fixed; z-index: 99; width: 100%;">

                <el-button type="primary" size="small" @click="addClassTeacher">保 存</el-button>

            </div>

            <div style="height: 60px; width: 100%;"></div>

            <el-row style="border: 1px dashed #ccc; padding: 20px; margin: 20px;">

                <el-col :span="10">

                    <el-input
                        placeholder="输入您想查找的班主任姓名"
                        style="margin-bottom: 10px;"
                        size="small"
                        v-model="filterText">
                    </el-input>

                    <el-tree
                        ref="tree"
                        :data="treeData"
                        show-checkbox
                        style="margin-left: 0px;"
                        node-key="orgUuid"
                        :default-expanded-keys="defaultExpandedKeys"
                        :default-checked-keys="defaultCheckedKeys"
                        :filter-node-method="filterNode"
                        @check="handleCheckChange"
                        :props="defaultProps"
                    >
                    </el-tree>

                </el-col>

                <el-col :span="13" :offset="1">
                
                    <el-table
                        :data="tableData"
                    >

                        <el-table-column
                            :prop="item.props"
                            :label="item.label"
                            v-for="(item, index) in columnList3"
                            :key="index">
                        </el-table-column>

                        <el-table-column prop="limitLimit" label="操作">
                            <template slot-scope="scope">
                                <el-button type="text" @click="handleDeleteClick(scope.row)">移除</el-button>
                            </template>
                        </el-table-column>

                    </el-table>

                </el-col>

            </el-row>
            
        </el-drawer>

    </el-main>
</template>

<script>
import { 
    addClass, 
    addClassTeacher, 
    getClassList, 
    getOrgStrAndClassTch, 
    getClassTeacherList, 
    getExamBasic,
    delVerClassTeacher,
    getClassTeaOptionByClassUuid,
    transferOfficer
} from '../../request/api';
import { timestampToTime, classTypeString, teacherTreeFunc, teacherArrExp, removeEvery } from '../../assets/js/common';

export default {
    name: 'reCoverData',
    props: ['tableHeight'],
    data() {
        return {
            form: {
                currentPage: 1,
                pageSize: 20,
                sortSet: [],
                total: null,
                examItem: '',
                examItemText: '',
            },
            totalFlag: false,
            list: [],
            columnList1: [
                { 'prop': 'examItem', 'label': '考试项目' },
                { 'prop': 'classType', 'label': '班型等级' },
                { 'prop': 'classTeacherNum', 'label': '班主任数量' },
                { 'prop': 'studentNum', 'label': '学员数量' },
            ],
            ruleForm1: {
                classType: '',
                examItemUuid: '',
                subjectText: '',
            },
            rules1: {
                classType: [
                    { required: true, message: '请选择班型等级', trigger: 'change'}
                ],
                subjectText: [
                    { required: true, message: '请选择考试项目', trigger: 'change'}
                ],
            },
            classTypeList: [
                { value: 0, label: '普通班' },
                { value: 1, label: '高端班' },
            ],
            drawerTitle1: '添加考试项-班型',
            drawer1: false,
            direction1: 'rtl',
            restaurants: [],
            
            drawerTitle2: '',
            drawer2: false,
            direction2: 'rtl',
            teacherForm: {
                currentPage: 1,
                pageSize: 20,
                sortSet: [],
                total: null,
                uuid: '', //班级的唯一标识
            },
            teacherList: [],
            columnList2: [
                { 'prop': 'classTeacherName', 'label': '班主任姓名' },
                // { 'prop': 'classTeacherUuid', 'label': '班主任的唯一标识' },
                { 'prop': 'studentNum', 'label': '学员数量' },
            ],

            drawerTitle3: '',
            drawer3: false,
            direction3: 'rtl',
            name_input: '',
            treeData: [],
            json: null,
            defaultExpandedKeys: [],
            defaultCheckedKeys: [],
            tableData: [],
            defaultProps: {
              children: 'list',
              label: 'orgName',
            },
            columnList3: [
                { props: 'userName', label: '姓名'},
                // { props: 'phone', label: '手机号码'},
                { props: 'studentNum', label: '服务学员'},
            ],
            tableTreeData: [],
            toggleRowList: [],
            addTeacherForm: {
                classUuid: '', //班级的uuid
                list: []
            },
            filterText: '',
            drawerTitle4: '选择转移接受方',
            drawer4: false,
            direction4: 'rtl',
            teacherMoveForm: {
                className: '',
                classLength: '',
                classUserUuid: '',
            },
            teacherMoveList: [],
            fullscreenLoading: false,
            fullscreenLoadingDetails: false
        }
    },
    created() {
        const studentsPageSize = localStorage.getItem('studentsPageSize');
        if(studentsPageSize) {
            this.form.pageSize = Number(studentsPageSize);
        }else{
            this.form.pageSize = 20;
        }
        this.getClassList();
        this.getExamBasic();
    },
    methods: {
        handleCurrentChange(index) {
            this.form.currentPage = index;
            this.getClassList();
        },
        handleSizeChange(index) {
            this.form.pageSize = index;
            this.form.currentPage = 1;
            localStorage.setItem('studentsPageSize', index);
            this.getClassList();
        }, 
        handleCurrentChangeTeacher(index) {
            this.teacherForm.currentPage = index;
            this.getClassTeacherList();
        },
        handleSizeChangeTeacher(index) {
            this.teacherForm.pageSize = index;
            this.teacherForm.currentPage = 1;
            this.getClassTeacherList();
        }, 
        addClassClick() {
            this.drawer1 = true;
            this.ruleForm1.classType = '';
            this.ruleForm1.subjectText = '';
            this.ruleForm1.examItemUuid = '';
            this.$nextTick(() => {
                this.$refs['ruleForm1'].resetFields();
            })
        },
        addClass() {
            this.$smoke_post(addClass, this.ruleForm1).then(res => {
                if(res.code == 200) {
                    this.$message({
                        type: 'success',
                        message: '添加考试项-班型成功'
                    })
                    this.drawer1 = false;
                    this.getClassList();
                }else{
                    this.$message({
                        type: 'error',
                        message: res.msg
                    })
                }
            });
        },
        submitForm1(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.addClass();
                } else {
                    return false;
                }
            });
        },
        quxiao() {
            this.drawer1 = false;
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
            this.ruleForm1.examItemUuid = item.id;
            this.ruleForm1.subjectText = item.value;
        },
        handleSelectExam(item) {
            this.form.examItem = item.id;
            this.form.examItemText = item.value;
        },
        autocompleteClear() {
            this.$nextTick(() => {
                this.$refs.autocomplete.$children
                    .find(c => c.$el.className.includes('el-input'))
                    .blur();
                this.form.examItem = '';
                this.$refs.autocomplete.focus();
            })
        },
        getClassList() {
            this.fullscreenLoading = true;
            this.$smoke_post(getClassList, this.form).then(res => {
                if(res.code == 200) {

                    setTimeout(() => {
                        this.fullscreenLoading = false;
                        res.data.list.map(sll => {
                            sll.classType = classTypeString(sll.classType);
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
        handleClose(done) {
            if(this.drawer3) {

                this.json = null;
                this.filterText = '';
                this.treeData = [];
                this.tableData = [];
                done();
                
            }else{
                done();
            }
        },
        addHeadTeacherClick(scope) {
            this.drawer3 = true;
            this.addTeacherForm.classUuid = scope.uuid;
            this.drawerTitle3 = scope.examItem + ' - ' + scope.classType + ' - 配置班主任'; //一级消防工程师 - 普通班 - 配置班主任
            this.getOrgStrAndClassTch(scope.uuid);
        },
        getOrgStrAndClassTch(id) {
            this.$smoke_post(getOrgStrAndClassTch, {
                uuid: id
            }).then(res => {
                if(res.code == 200) {
                    this.json = teacherTreeFunc(res.data.list);
                    this.treeData = this.json.arr;
                    this.toggleRowList = this.defaultExpandedKeys = this.defaultCheckedKeys = this.json.flagArr;
                    this.getCheckedNodes();
                }
            })
        },
        getCheckedNodes() {
            let arr = [];
            this.$nextTick(() => {
                this.$refs.tree.getCheckedNodes().map(sll => {
                    if(sll.hasOwnProperty('studentNum')){ // hasOwnProperty 判断对象是否含有某个属性
                        arr.push(sll);
                    }
                })
                this.tableData = arr;
                teacherArrExp.length = 0; //将common.js里的teacherArrExp数组重新重置为空
            })
        },
        handleCheckChange(data, value) {
            this.getCheckedNodes();
        },
        addClassTeacher() {
            let arr = [];
            this.tableData.map(sll => {
                arr.push({ userUuid : sll.userUuid });
            })
            this.addTeacherForm.list = arr;
            this.$smoke_post(addClassTeacher, this.addTeacherForm).then(res => {
                if(res.code == 200) {
                    this.$message({
                        type: 'success',
                        message: '配置成功'
                    })
                    this.json = null;
                    this.filterText = '';
                    this.treeData = [];
                    this.tableData = [];
                    this.drawer3 = false;
                    this.getClassList();
                }else{
                    this.$message({
                        type: 'error',
                        message: res.msg
                    })
                }
            })
        },
        handleDeleteClick(scope) {
            this.delVerClassTeacher(scope);
        },
        delVerClassTeacher(scope) {
            let arrKey = []; //当前班主任key的集合
            let arr = []; //当前班主任Nodes的集合
            this.$smoke_post(delVerClassTeacher, {
                classTeaUuid: scope.userUuid,
                classUuid: this.addTeacherForm.classUuid
            }).then(res => {
                if(res.code == 200) {
                    this.$message({
                        type: 'success',
                        message: '删除成功'
                    })
                    this.$refs.tree.getCheckedNodes().map(sll => {
                        if(sll.hasOwnProperty('studentNum')){ // hasOwnProperty 判断对象是否含有某个属性
                            arrKey.push(sll.userUuid);
                            arr.push(sll);
                        }
                    })
                    //将点击移除的班主任的userUuid从当前班主任key的集合中移除，来渲染Tree
                    arrKey = removeEvery(scope.userUuid, arrKey);
                    arr = removeEvery(scope, arr);
                    this.$nextTick(() => {
                        this.$refs.tree.setCheckedKeys(arrKey, true);
                        this.tableData = arr;
                    })
                }else{
                    this.$message({
                        type: 'error',
                        message: res.msg
                    })
                }
            })
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.orgName.indexOf(value) !== -1;
        },
    },
    mounted() {
        
    },
    watch: {
        filterText(val) {
            this.$refs.tree.filter(val);
        }
    },
}
</script>

<style lang="less" scoped>
    .index-main{
        height: auto;
        margin-top: 15px;
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
        .tagActive{
            // color: red !important;
        }
        .tagName{
            height: 40px;
            background: #FAFAFA;
            text-align: center;
            font-size: 14px;
            line-height: 40px;
            letter-spacing: 2px;
        }
    }
</style>