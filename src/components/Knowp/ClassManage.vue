<template>
    <div style="">
        <el-container class="index-main">

            <el-main>

                <div class="people-title">项目结构管理</div> 

                <el-button type="primary" @click="addclass" style="margin-bottom: .2rem;">创建一级大类</el-button>
         
                <el-table
                  :data="classList"
                  row-key="uuid"
                  default-expand-all
                  :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
                  style="width: calc( 100vw - 3.65rem)">
                  <el-table-column
                    :prop="item.prop"
                    :label="item.label"
                    v-for="(item, index) in columnList"
                    :key="index"
                    >
                  </el-table-column>
                  <el-table-column prop="active" label="操作" min-width="150%">
                    <template slot-scope="scope">
                        <el-button @click="editClick(scope.row)" type="text" size="small">编辑</el-button>
                        <el-popover
                          placement="top"
                          width="200"
                          trigger="click"
                          :ref="`popover-${scope.$index}`"
                          >
                          <p style="margin-bottom: .2rem;">您确定要删除吗？</p>
                          <div style="text-align: right; margin: 0">
                            <el-button size="mini" type="text" @click="scope._self.$refs[`popover-${scope.$index}`].doClose()">取消</el-button>
                            <el-button type="primary" size="mini" @click="deleteAll(scope)">确定</el-button>
                          </div>
                          <el-button slot="reference" type="text" size="small" style="margin-left: .2rem;">删除</el-button>
                        </el-popover>
                        <el-button @click="addClick(scope.row)" type="text" size="small" style="margin-left: .2rem;">{{scope.row.level == '科目' ? '科目章节' : '添加'}}</el-button>
                        <el-button v-if="!scope.row.sortUpFlag" @click="sortNumber(scope.row, 'up')" type="text" size="small">排序向上</el-button>
                        <el-button v-if="!scope.row.sortDownFlag" @click="sortNumber(scope.row, 'down')" type="text" size="small">排序向下</el-button>
                    </template>
                  </el-table-column>
                </el-table>

                <el-pagination
                    background
                    layout="total, sizes, prev, pager, next, jumper"
                    :total='total'
                    :page-size='classForm.pageSize'
                    :page-sizes="[8, 10, 20, 30]"
                    :hide-on-single-page="totalFlag"
                    @current-change="handleCurrentChange"
                    @size-change="handleSizeChange"
                >
                </el-pagination>

                <el-drawer
                    :title="drawerTitle1"
                    :visible.sync="drawer1"
                    :direction="direction"
                    :before-close="handleClose">

                    <el-form :model="ruleForm1" :rules="rules1" ref="ruleForm1" style="border: 1px dashed #ccc; padding: .4rem; margin: .2rem;">
                        
                        <el-form-item label="项目类名" prop="name">
                          <el-input v-model="ruleForm1.name"></el-input>
                        </el-form-item>

                        <el-form-item label="用户开放" prop="switch1">
                            <el-switch
                                :active-value='1'
                                :inactive-value='0'
                                v-model="ruleForm1.userOpenStatus"
                                active-color="#13ce66"
                                inactive-color="#cccccc">
                            </el-switch>
                        </el-form-item>

                        <el-form-item label="标为重点" prop="switch2">
                            <el-switch
                                :active-value='1'
                                :inactive-value='0'
                                v-model="ruleForm1.emphasisStatus"
                                active-color="#13ce66"
                                inactive-color="#cccccc">
                            </el-switch>
                        </el-form-item>

                        <el-form-item>
                          <el-button type="primary" @click="submitForm1('ruleForm1')">确定</el-button>
                          <el-button @click="quxiao">取消</el-button>
                        </el-form-item>

                    </el-form>

                </el-drawer>

                <el-drawer
                :title="drawerTitle2"
                :visible.sync="drawer2"
                :direction="direction"
                :before-close="handleClose"
                >
                    <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" style="border: 1px dashed #ccc; padding: .4rem; margin: .2rem;">
                        
                        <el-form-item label="所属大类" prop="selectuuid">
                            <el-select v-model="ruleForm2.selectuuid" @focus='focusOne' placeholder="请选择一级大类" @change='handleOneChange' class="screen-li" clearable>
                                <el-option
                                    v-for="item in oneOptions"
                                    :key="item.uuid"
                                    :label="item.name"
                                    :value="item.uuid">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="二级分类" prop="classifyUuid">
                            <el-select v-model="ruleForm2.classifyUuid" @focus="focusTwo" placeholder="请选择二级分类" @change='handleTwoChange' class="screen-li" clearable>
                                <el-option
                                    v-for="item in twoOptions"
                                    :key="item.uuid"
                                    :label="item.name"
                                    :value="item.uuid">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="考试项类名" prop="name">
                          <el-input v-model="ruleForm2.name"></el-input>
                        </el-form-item>

                        <el-form-item label="用户开放" prop="switch1">
                            <el-switch
                                :active-value='1'
                                :inactive-value='0'
                                v-model="ruleForm2.userOpenStatus"
                                active-color="#13ce66"
                                inactive-color="#cccccc">
                            </el-switch>
                        </el-form-item>

                        <el-form-item label="标为重点" prop="switch2">
                            <el-switch
                                :active-value='1'
                                :inactive-value='0'
                                v-model="ruleForm2.emphasisStatus"
                                active-color="#13ce66"
                                inactive-color="#cccccc">
                            </el-switch>
                        </el-form-item>

                        <el-form-item>
                          <el-button type="primary" @click="submitForm2('ruleForm2')">确定</el-button>
                          <el-button @click="quxiao">取消</el-button>
                        </el-form-item>

                    </el-form>

                </el-drawer>

                <el-drawer
                :title="drawerTitle3"
                :visible.sync="drawer3"
                :direction="direction"
                :before-close="handleClose"
                >

                    <el-form :model="ruleForm3" :rules="rules3" ref="ruleForm3" style="border: 1px dashed #ccc; padding: .4rem; margin: .2rem;">
                        
                        <el-form-item label="关联科目" prop="subjectUuid">
                        
                            <el-autocomplete
                                class="inline-input"
                                v-model="subjectText"
                                :fetch-suggestions="querySearch"
                                placeholder="请输入内容"
                                :trigger-on-focus="true"
                                @select="handleSelect"
                                :disabled="this.drawerTitle3 == '添加科目' ? false : true"
                            ></el-autocomplete>

                        </el-form-item>

                        <el-form-item label="用户开放" prop="switch1">
                            <el-switch
                                :active-value='1'
                                :inactive-value='0'
                                v-model="ruleForm3.userOpenStatus"
                                active-color="#13ce66"
                                inactive-color="#cccccc">
                            </el-switch>
                        </el-form-item>

                        <el-form-item label="标为重点" prop="switch2">
                            <el-switch
                                :active-value='1'
                                :inactive-value='0'
                                v-model="ruleForm3.emphasisStatus"
                                active-color="#13ce66"
                                inactive-color="#cccccc">
                            </el-switch>
                        </el-form-item>

                        <el-form-item>
                          <el-button type="primary" @click="submitForm3('ruleForm3')">确定</el-button>
                          <el-button @click="quxiao">取消</el-button>
                        </el-form-item>

                    </el-form>

                </el-drawer>

            </el-main>

        </el-container>
    </div>
    
</template>

<script>
import { 
    getKnowledgeStructure,
    addClassify, 
    deleteClassifyByUuid, 
    getClassifyByParentUuid,
    updateClassify,
    getExamDirectionByUuid,
    updateExamDirection,
    getClassifyByUuid,
    deleteExamDirectionByUuid,
    getSubjectByName,
    addExamAndSubjectRelation,
    getExamAndSubjectRelation,
    deleteExamAndSubjectRelation,
    updateExamAndSubjectRelation,
    sortNumber1,
    sortNumber2,
    sortNumberSubjectRelation,
    addExamDirection // 新增考试项接口
} from '../../request/api';
import { classTextById, sortNumberMove } from '../../assets/js/common';
export default {
    name: 'index',
    data() {
        return {
            classForm: {
                currentPage: 1,
                pageSize: 10,
                sortSet: []
            },
            classList: [],
            totalFlag: false, //当只有一页时隐藏分页
            total: null,
            drawer1: false,
            drawerTitle1: '创建一级大类',
            direction: 'rtl',
            drawerTitle2: '创建考试项目',
            drawer2: false,
            drawerTitle3: '添加科目',
            drawer3: false,
            columnList: [
                { 'prop': 'name', 'label': '项目类名' },
                { 'prop': 'level', 'label': '项目层级' },
                { 'prop': 'sortNumber', 'label': '同级排序' },
            ],
            ruleForm1: {
                emphasisStatus: 0, //重点的状态（1：勾选 0：未勾选）
                name: '', //分类名称
                parentUuid: '', //分类的父uuid
                userOpenStatus: 0, //用户开放的状态（1：开放 0：未开放）,
                uuid: '', //分类的uuid
            },
            rules1: {
                name: [
                    { required: true, message: '请输入角色名称', trigger: 'blur'}
                ],
            },
            ruleForm2: {
                selectuuid: '', //选择一级大类
                classifyUuid: '', //考试分类的uuid
                emphasisStatus: 0, //重点的状态（1：勾选 0：未勾选）
                name: '', //考试方向名称
                uuid: '',
                userOpenStatus: 0, //用户开放的状态（1：开放 0：未开放）
            },
            rules2: {

            },
            oneOptions: [],
            twoOptions: [],
            oneParentUuid: '',
            twoParentUuid: '',
            editTwoUuid: '', //选择二级大类时的uuid
            ruleForm3: {
                emphasisStatus: 0,
                examDirectionUuid: '',
                subjectUuid: '',
                userOpenStatus: 0
            },
            rules3: {

            },
            restaurants: [],
            subjectText: '',
        }
    },
    created() {
        this.getKnowledgeStructure();
        this.handleFocus();
    },
    methods: {
        sortNumber(scope, move) {
            let json = sortNumberMove(this.classList, scope, move);

            if(scope.level == '一级分类' || scope.level == '二级分类'){
                this.$smoke_post(sortNumber1, json).then(res => {
                    console.log(res);
                    this.getKnowledgeStructure();
                })
            }else if(scope.level == '考试项目') {
                this.$smoke_post(sortNumber2, json).then(res => {
                    console.log(res);
                    this.getKnowledgeStructure();
                })
            }else if(scope.level == '科目') {
                this.$smoke_post(sortNumberSubjectRelation, json).then(res => {
                    console.log(res);
                    this.getKnowledgeStructure();
                })
            }
        },
        handleFocus() {
            let arr;
            this.$smoke_post(getSubjectByName, {
                name: ''
            }).then(res => {
                console.log(res.data);
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
            this.ruleForm3.subjectUuid = item.uuid;
        },
        focusOne() {
            this.twoParentUuid = '';
            this.getClassifyByParentUuid();
        },
        focusTwo() {
            this.twoParentUuid = this.oneParentUuid;
            this.getClassifyByParentUuid();
        },
        handleOneChange(value) {
            console.log(value);
            this.twoParentUuid = value;
            this.getClassifyByParentUuid();
            this.ruleForm2.classifyUuid = '';
        },
        handleTwoChange(value) {
            console.log(value);
        },
        getClassifyByParentUuid() {
            this.$smoke_post(getClassifyByParentUuid, {
                parentUuid: this.twoParentUuid
            }).then(res => {
                console.log(res);
                if(res.code == 200) {
                    if(res.data[0].parentUuid == '' ) {
                        this.oneOptions = res.data;
                    }else{
                        this.twoOptions = res.data;
                    }
                }else{
                    this.$message({
                        type: 'error',
                        message: res.msg
                    })
                }
            })
        },
        getKnowledgeStructure() {
            let arr;
            this.$smoke_post(getKnowledgeStructure, this.classForm).then(res => {
                console.log(res);
                arr = JSON.parse(JSON.stringify(res.data.list).replace(/list/g,"children"));
                this.classList = arr;
                this.classList.map(sll => {
                    if(sll.sortNumber == 1) {
                        sll.sortUpFlag = true;
                    }else if(sll.sortNumber == res.data.list.length){
                        sll.sortDownFlag = true;
                    }
                    sll.level = classTextById(sll.level);
                    if(sll.children.length != 0) {
                        sll.children.map(qqs => {
                            if(qqs.sortNumber == 1) {
                                qqs.sortUpFlag = true;
                            }else if(qqs.sortNumber == sll.children.length){
                                qqs.sortDownFlag = true;
                            }
                            qqs.level = classTextById(qqs.level);
                            if(qqs.children.length != 0) {
                                qqs.children.map(aas => {
                                    if(aas.sortNumber == 1) {
                                        aas.sortUpFlag = true;
                                    }else if(aas.sortNumber == qqs.children.length){
                                        aas.sortDownFlag = true;
                                    }
                                    aas.level = classTextById(aas.level);
                                    if(aas.children.length != 0) {
                                        aas.children.map(wwd => {
                                            if(wwd.sortNumber == 1) {
                                                wwd.sortUpFlag = true;
                                            }else if(wwd.sortNumber == aas.children.length){
                                                wwd.sortDownFlag = true;
                                            }
                                            wwd.level = classTextById(wwd.level);
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
                this.total = res.data.total;
                this.classForm.pageSize = res.data.pageSize;
            })
        },
        getClassifyByUuid(uuid) {
            this.$smoke_post(getClassifyByUuid, {
                uuid: uuid
            }).then(res => {
                console.log(res);
                this.ruleForm1.name = res.data.name;
                this.ruleForm1.emphasisStatus = res.data.emphasisStatus;
                this.ruleForm1.userOpenStatus = res.data.userOpenStatus;
                this.ruleForm1.uuid = res.data.uuid;
                this.ruleForm1.parentUuid = res.data.parentUuid;
            })
        },
        getExamDirectionByUuid() {
            this.$smoke_post(getExamDirectionByUuid, {
                uuid: this.ruleForm2.uuid
            }).then(res => {
                console.log(res);
                this.ruleForm2.selectuuid = res.data.classifyOneName;
                this.ruleForm2.classifyUuid = res.data.classifyTwoName;
                this.oneParentUuid = res.data.classifyOneUuid;
                this.twoParentUuid = res.data.classifyTwoUuid;
                this.editTwoUuid = res.data.classifyTwoUuid;
            })
        },
        addclass() {
            this.drawer1 = true;
            this.drawerTitle1 = '创建一级大类',
            this.ruleForm1.uuid = '',
            this.ruleForm1.parentUuid = '',
            this.ruleForm1.name = '',
            this.ruleForm1.emphasisStatus = 0;
            this.ruleForm1.userOpenStatus = 0;
        },
        handleClose(done) {
            done();
        },
        submitForm1(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    console.log(this.ruleForm1);
                    if(this.drawerTitle1 == '创建一级大类' || this.drawerTitle1 == '创建二级大类'){
                        this.addClassify();
                    }else{
                        this.updateClassify();
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        submitForm2(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    console.log(this.ruleForm2);
                    if(this.drawerTitle2 == '创建考试项目'){
                        this.addExamDirection();
                    }else{
                        this.updateExamDirection();
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        submitForm3(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    console.log(this.ruleForm3);
                    if(this.drawerTitle3 == '添加科目'){
                        this.addExamAndSubjectRelation();
                    }else{
                        this.updateExamAndSubjectRelation();
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        updateExamAndSubjectRelation() {
            this.$smoke_post(updateExamAndSubjectRelation, this.ruleForm3).then(res => {
                if(res.code == 200) {
                    this.drawer3 = false;
                    this.getKnowledgeStructure();
                }else{
                    this.$message({
                        type: 'error',
                        message: res.msg
                    })
                }
            })
        },
        addExamAndSubjectRelation() {
            this.$smoke_post(addExamAndSubjectRelation, this.ruleForm3).then(res => {
                console.log(res);
                if(res.code == 200) {
                    this.drawer3 = false;
                    this.getKnowledgeStructure();
                }
            });
        },
        addClassify() {
            this.$smoke_post(addClassify, this.ruleForm1).then(res => {
                console.log(res);
                if(res.code == 200){
                    this.drawer1 = false;
                    this.getKnowledgeStructure();
                }else{
                    this.$message({
                        type: 'error',
                        message: res.msg
                    })
                    this.drawer1 = false;
                }
            });
        },
        handleSizeChange(index) {
            console.log(index);
            this.screenForm.pageSize = index;
            this.getKnowledgeStructure();
        },
        handleCurrentChange(index) {
            console.log(index);
            this.screenForm.currentPage = index;
            this.getKnowledgeStructure();
        },
        quxiao() {
            this.drawer1 = false;
            this.drawer2 = false;
            this.drawer3 = false;
        },
        deleteAll(scope) {
            if(scope.row.level == '一级分类' || scope.row.level == '二级分类') {
                this.handleDeleteClick(scope);
            }else if(scope.row.level == '考试项目') {
                this.deleteExamDirectionByUuid(scope);
            }else if(scope.row.level == '科目') {
                this.deleteExamAndSubjectRelation(scope);
            }
        },
        deleteExamAndSubjectRelation(scope) {
            this.$smoke_post(deleteExamAndSubjectRelation, {
                examDirectionUuid: scope.row.examItemUuid,
                subjectUuid: scope.row.uuid
            }).then(res => {
                if(res.code == 200) {
                    scope._self.$refs[`popover-${scope.$index}`].doClose();
                    this.$message({
                        type: 'success',
                        message: '删除成功', 
                    });
                    this.getKnowledgeStructure();
                }
            })
        },
        handleDeleteClick(scope) {
            this.$smoke_post(deleteClassifyByUuid, {
                uuid: scope.row.uuid
            }).then(res => {
                console.log(res);
                if(res.code == 200) {
                    scope._self.$refs[`popover-${scope.$index}`].doClose();
                    this.$message({
                        type: 'success',
                        message: '删除成功', 
                    });
                    this.getKnowledgeStructure();
                }
            })
        },
        deleteExamDirectionByUuid(scope) {
            this.$smoke_post(deleteExamDirectionByUuid, {
                classifyUuid: scope.row.classifyUuid,
                uuid: scope.row.uuid
            }).then(res => {
                console.log(res);
                if(res.code == 200) {
                    scope._self.$refs[`popover-${scope.$index}`].doClose();
                    this.$message({
                        type: 'success',
                        message: '删除成功', 
                    });
                    this.getKnowledgeStructure();
                }
            })
        },
        updateClassify() {
            this.$smoke_post(updateClassify, this.ruleForm1).then(res => {
                console.log(res);
                if(res.code == 200) {
                    this.drawer1 = false;
                    this.getKnowledgeStructure();
                }
            })
        },
        addClick(row) {
            console.log(row);
            if (row.level == '一级分类') {
                this.drawer1 = true;
                this.drawerTitle1 = '创建二级大类';
                this.ruleForm1.parentUuid = row.uuid;
            }else if(row.level == '二级分类') {
                this.drawer2 = true;
                this.drawerTitle2 = '创建考试项目';
                this.getClassifyByParentUuid();
            }else if(row.level == '考试项目') {
                this.drawer3 = true;
                this.drawerTitle3 = '添加科目';
                this.ruleForm3.examDirectionUuid = row.uuid;
            }else if(row.level == '科目') {
                this.$router.push({
                    path: '/knowp/contents',
                    query: {
                        id: row.uuid
                    }
                })
            }
        },
        editClick(row) {
            console.log(row);
            if(row.level == '一级分类' || row.level == '二级分类') {
                this.drawer1 = true;
                this.drawerTitle1 = '编辑' + row.name;
                this.getClassifyByUuid(row.uuid);
            }else if(row.level == '考试项目') {
                this.drawer2 = true;
                this.drawerTitle2 = '编辑' + row.name;
                this.ruleForm2.name = row.name;
                this.ruleForm2.uuid = row.uuid;
                this.getExamDirectionByUuid();
            }else if(row.level == '科目') {
                this.drawer3 = true;
                this.drawerTitle3 = '编辑' + row.name;
                this.getExamAndSubjectRelation(row.examItemUuid, row.uuid);
            }
        },
        getExamAndSubjectRelation(examDirectionUuid, subjectUuid) {
            this.$smoke_post(getExamAndSubjectRelation, {
                examDirectionUuid: examDirectionUuid,
                subjectUuid: subjectUuid
            }).then(res => {
                console.log(res);
                this.ruleForm3.emphasisStatus = res.data.emphasisStatus;
                this.ruleForm3.examDirectionUuid = res.data.examDirectionUuid;
                this.subjectText = res.data.subjectName;
                this.ruleForm3.subjectUuid = res.data.subjectUuid;
                this.ruleForm3.userOpenStatus = res.data.userOpenStatus;
            })
        },
        addExamDirection() {
            this.$smoke_post(addExamDirection, this.ruleForm2).then(res => {
                console.log(res);
                if(res.code == 200) {
                    this.drawer2 = false;
                    this.getKnowledgeStructure();
                }else{
                    this.$message({
                        type: 'error',
                        message: res.msg,
                    });
                }
            })
        },
        updateExamDirection() {
            this.ruleForm2.classifyUuid = this.editTwoUuid;
            this.$smoke_post(updateExamDirection, this.ruleForm2).then(res => {
                console.log(res);
                this.drawer2 = false;
                this.getKnowledgeStructure();
            })
        }
    },
    mounted() {
        
    }
}
</script>

<style lang="less" scoped>
    .el-main{
        // background: grey;
    }
    .index-main{
        height: calc( 100vh - 60px);
        .people-title{
            width: 100%;
            height: .6rem;
            line-height: .6rem;
            text-align: center;
            font-size: .2rem;
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
    .el-pagination{
        text-align: right;
        margin-top: .4rem;
    }
</style>