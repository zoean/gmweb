<template>
    <div style="">
        <el-container class="index-main">

            <el-main>

                <div class="people-title">目录和知识点管理</div> 

                <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
                    <el-menu-item index="1">教材目录结构</el-menu-item>
                    <el-menu-item index="2" >知识点体系</el-menu-item>
                </el-menu>

                <el-table
                  :data="knowsList"
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
                        <el-button v-if="scope.row.level == 3" @click="editClick(scope.row)" type="text" size="small">编辑</el-button>
                        <el-popover
                          placement="top"
                          width="200"
                          trigger="click"
                          v-if="scope.row.level == 3"
                          :ref="`popover-${scope.$index}`"
                          >
                          <p style="margin-bottom: .2rem;">确定要删除吗？</p>
                          <div style="text-align: right; margin: 0">
                            <el-button size="mini" type="text" @click="scope._self.$refs[`popover-${scope.$index}`].doClose()">取消</el-button>
                            <el-button type="primary" size="mini" @click="deleteClick(scope)">确定</el-button>
                          </div>
                          <el-button slot="reference" type="text" size="small" style="margin-left: .2rem;">删除</el-button>
                        </el-popover>
                        <el-button v-if="scope.row.level == 2" @click="addClick(scope.row)" type="text" size="small">添加</el-button>
                    </template>
                  </el-table-column>
                </el-table>

                <el-pagination
                    background
                    layout="total, sizes, prev, pager, next, jumper"
                    :total='total'
                    :page-size='knowsForm.pageSize'
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
                    size="35%"
                    :before-close="handleClose">

                    <el-form :model="ruleForm1" :rules="rules1" ref="ruleForm1" style="border: 1px dashed #ccc; padding: .4rem; margin: .2rem;">
                        
                        <el-form-item label="序号名称" prop="sortNumberName">
                          <el-input v-model="ruleForm1.sortNumberName"></el-input>
                        </el-form-item>

                        <el-form-item label="知识点名称" prop="name">
                          <el-input v-model="ruleForm1.name"></el-input>
                        </el-form-item>

                        <el-form-item label="2015-2018年考试平均分值" prop="averageScore">
                          <el-input v-model="ruleForm1.averageScore"></el-input>
                        </el-form-item>

                        <el-form-item label="重要级别" prop="specialStatus">
                            <el-radio v-model="ruleForm1.emphasisLevel" :label="1">A</el-radio>
                            <el-radio v-model="ruleForm1.emphasisLevel" :label="2">B</el-radio>
                            <el-radio v-model="ruleForm1.emphasisLevel" :label="3">C</el-radio>
                            <el-radio v-model="ruleForm1.emphasisLevel" :label="4">D</el-radio>
                        </el-form-item>

                        <el-form-item label="特殊标记" prop="specialStatus">
                            <el-switch
                                :active-value='1'
                                :inactive-value='0'
                                v-model="ruleForm1.specialStatus"
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

            </el-main>

        </el-container>
    </div>
    
</template>

<script>
import { 
    getCatalogueAndKnowBySubjectUuid,
    addKnowledgePoints,
    deleteKnowledgePoints,
    updateSubjectCatalogue,
    getKnowledgePointsByUuid
} from '../../request/api';
import {
    emphasisLevelByText
} from '../../assets/js/common';
export default {
    name: 'index',
    data() {
        return {
            total: null,
            totalFlag: false,
            ruleForm1: {
                averageScore: '', //2015-2018年考试平均分值
                catalogueUuid: '', //科目目录的uuid
                emphasisLevel: 0, //重点级别（0：未选 1：A 2：B 3：C 4：D）
                name: '', //知识点名称
                sortNumberName: '', //序号名称
                specialStatus: 0, //标记特殊（1：标记 0：未标记）
                uuid: '', //当前知识点的uuid
            },
            rules1: {
                
            },
            knowsList: [],
            columnList: [
                { 'prop': 'sortNumberName', 'label': '知识点序号' },
                { 'prop': 'name', 'label': '知识点名称' },
                { 'prop': 'averageScore', 'label': '2015--2018年考试平均分值' },
                { 'prop': 'emphasisLevel', 'label': '重要级别' },
            ],
            knowsForm: {
                currentPage: 1, //当前页数
                pageSize: 8, //每页显示条目个数	
                uuid: '', //科目的uuid
            },
            drawerTitle1: '添加知识点',
            drawer1: false,
            direction: 'rtl',
            activeIndex: '2',
        }
    },
    created() {
        this.knowsForm.uuid = this.$route.query.id;
        this.getCatalogueAndKnowBySubjectUuid();
    },
    methods: {
        handleSelect(value) {
            if(value == '1') {
                this.$router.push({
                    path: '/knowp/contents',
                    query: {
                        id: this.$route.query.id
                    }
                })
            }else{
                this.$router.push({
                    path: '/knowp/know',
                    query: {
                        id: this.$route.query.id
                    }
                })
            }
        },
        editClick(scope) {
            console.log(scope);
            this.drawer1 = true;
            this.drawerTitle1 = '编辑知识点';
            this.getKnowledgePointsByUuid(scope);
        },
        getKnowledgePointsByUuid(scope) {
            this.$smoke_post(getKnowledgePointsByUuid, {
                uuid: scope.uuid
            }).then(res => {
                console.log(res);
                this.ruleForm1.averageScore = res.data.averageScore;
                this.ruleForm1.catalogueUuid = res.data.catalogueUuid;
                this.ruleForm1.emphasisLevel = res.data.emphasisLevel;
                this.ruleForm1.name = res.data.name;
                this.ruleForm1.sortNumberName = res.data.sortNumber;
                this.ruleForm1.specialStatus = res.data.specialStatus;
                this.ruleForm1.uuid = res.data.uuid;
            })
        },
        deleteClick(scope) {
            this.deleteKnowledgePoints(scope);
        },
        addClick(scope) {
            console.log(scope);
            this.drawer1 = true;
            this.drawerTitle1 = '添加知识点';
            this.ruleForm1.catalogueUuid = scope.uuid;
        },
        addKnowledgePoints() {
            this.$smoke_post(addKnowledgePoints, this.ruleForm1).then(res => {
                console.log(res);
                if(res.code == 200) {
                    this.drawer1 = false;
                    this.getCatalogueAndKnowBySubjectUuid();
                }else{
                    this.$message({
                        type: 'error',
                        message: res.msg
                    })
                }
            })
        },
        getCatalogueAndKnowBySubjectUuid() {
            let arr;
            this.$smoke_post(getCatalogueAndKnowBySubjectUuid, this.knowsForm).then(res => {
                console.log(res);
                res.data.list.map(sll => {
                    if(sll.list.length != 0) {
                        sll.list.map(oop => {
                            oop.list = oop.knowList;
                            if(oop.list.length != 0) {
                                oop.list.map(qqs => {
                                    qqs.emphasisLevel = emphasisLevelByText(qqs.emphasisLevel);
                                })
                            }
                        })
                    }
                });
                arr = JSON.parse(JSON.stringify(res.data.list).replace(/list/g,"children"));
                this.knowsList = arr;
                this.total = res.data.total;
            })
        },
        deleteKnowledgePoints(scope) {
            this.$smoke_post(deleteKnowledgePoints, {
                catalogueUuid: scope.row.catalogueUuid,
                uuid: scope.row.uuid
            }).then(res => {
                if(res.code == 200) {
                    scope._self.$refs[`popover-${scope.$index}`].doClose();
                    this.$message({
                        type: 'success',
                        message: '删除成功', 
                    });
                    this.getCatalogueAndKnowBySubjectUuid();
                }
            })
        },
        handleCurrentChange(index) {
            this.knowsForm.currentPage = index;
            this.getCatalogueAndKnowBySubjectUuid();
        },
        handleSizeChange(index) {
            this.knowsForm.pageSize = index;
            this.getCatalogueAndKnowBySubjectUuid();
        },
        handleClose(done) {
            done();
        },
        updateSubjectCatalogue() {
            this.$smoke_post(updateSubjectCatalogue, this.ruleForm1).then(res => {
                if(res.code == 200) {
                    this.drawer1 = false;
                    this.$message({
                        type: 'success',
                        message: '编辑成功'
                    })
                    this.getCatalogueAndKnowBySubjectUuid();
                }else{
                    this.$message({
                        type: 'error',
                        message: res.msg
                    })
                }
            })
        },
        submitForm1(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if(this.drawerTitle1 == '添加知识点'){
                        this.addKnowledgePoints();
                    }else{
                        this.updateSubjectCatalogue();
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        quxiao() {
            this.drawer1 = false;
        },
    },
    mounted() {
        
    }
}
</script>

<style lang="less" scoped>
    .el-main{
        // background: grey;
        .el-menu--horizontal>.el-menu-item{
            height: 44px;
            line-height: 44px;
            font-size: 16px;
        }
        .el-menu-demo{
            width: 256px;
            margin-bottom: 20px;
        }
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
        margin-top: 30px;
        margin-bottom: 30px;
    }
</style>