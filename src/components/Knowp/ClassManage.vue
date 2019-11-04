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
                  <el-table-column prop="active" label="操作">
                    <template slot-scope="scope">
                        <el-button @click="editClick(scope.row)" type="text" size="small">编辑</el-button>
                        <el-popover
                          placement="top"
                          width="200"
                          trigger="click"
                          :ref="`popover-${scope.$index}`"
                          >
                          <p style="margin-bottom: .2rem;">确定要删除此大类吗？</p>
                          <div style="text-align: right; margin: 0">
                            <el-button size="mini" type="text" @click="scope._self.$refs[`popover-${scope.$index}`].doClose()">取消</el-button>
                            <el-button type="primary" size="mini" @click="handleDeleteClick(scope)">确定</el-button>
                          </div>
                          <el-button slot="reference" type="text" size="small" style="margin-left: .2rem;">删除</el-button>
                        </el-popover>
                        <el-button @click="addClick(scope.row)" type="text" size="small" style="margin-left: .2rem;">添加</el-button>
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
                            <el-select v-model="ruleForm2.selectuuid" placeholder="请选择一级大类" @change='handleOneChange' class="screen-li" clearable>
                                <el-option
                                    v-for="item in oneOptions"
                                    :key="item.uuid"
                                    :label="item.name"
                                    :value="item.uuid">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="二级分类" prop="classifyUuid">
                            <el-select v-model="ruleForm2.classifyUuid" placeholder="请选择二级分类" @change='handleTwoChange' class="screen-li" clearable>
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

                <div style="border: 1px dashed #ccc; padding: .4rem; margin: .2rem;">添加科目</div>

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
    addExamDirection // 新增考试项接口
} from '../../request/api';
import { classTextById } from '../../assets/js/common';
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
            twoParentUuid: '',
        }
    },
    created() {
        this.getKnowledgeStructure();
    },
    methods: {
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
                    sll.level = classTextById(sll.level);
                    if(sll.children.length != 0) {
                        sll.children.map(qqs => {
                            qqs.level = classTextById(qqs.level);
                            if(qqs.children.length != 0) {
                                qqs.children.map(aas => {
                                    aas.level = classTextById(aas.level);
                                })
                            }
                        })
                    }
                })
                this.total = res.data.total;
                this.classForm.pageSize = res.data.pageSize;
            })
        },
        editClick(row) {
            console.log(row);
            if(row.level == '一级分类' || row.level == '二级分类') {
                this.drawer1 = true;
                this.drawerTitle1 = '编辑' + row.name;
                this.getClassifyByUuid(row.uuid);
            }else if(row.level == '考试项目'){
                this.drawer2 = true;
                this.drawerTitle2 = '编辑' + row.name;
                this.ruleForm2.name = row.name;
                this.ruleForm2.uuid = row.uuid;
                this.getExamDirectionByUuid();
            }
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
            })
        },
        addclass() {
            this.drawer1 = true;
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
        },
        handleDeleteClick(scope) {
            this.$smoke_post(deleteClassifyByUuid, {
                uuid: scope.row.uuid
            }).then(res => {
                console.log(res);
                if(res.code == 200){
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
            }
        },
        addExamDirection() {
            this.$smoke_post(addExamDirection, this.ruleForm2).then(res => {
                console.log(res);
                if(res.code == 200) {
                    this.drawer2 = false;
                }else{
                    this.$message({
                        type: 'error',
                        message: res.msg,
                    });
                }
            })
        },
        updateExamDirection() {
            this.$smoke_post(updateExamDirection, this.ruleForm2).then(res => {
                console.log(res);
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