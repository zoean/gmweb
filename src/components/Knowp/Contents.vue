<template>
    <div style="">
        <el-container class="index-main">

            <el-main>

                <div class="people-title">目录和知识点管理</div> 

                <el-button type="primary" @click="addContentsClick" style="margin-bottom: .2rem;">添加目录</el-button>

                <el-table
                  :data="contentsList"
                  row-key="uuid"
                  default-expand-all
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
                            <el-button type="primary" size="mini" @click="deleteClick(scope)">确定</el-button>
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
                    :page-size='contentsForm.pageSize'
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
                        
                        <el-form-item label="目录序名" prop="sortNumberName">
                          <el-input v-model="ruleForm1.sortNumberName"></el-input>
                        </el-form-item>

                        <el-form-item label="章节名称" prop="name">
                          <el-input v-model="ruleForm1.name"></el-input>
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
    addSubjectCatalogue,
    getSubjectCatalogueBySubjectUuid,
    deleteSubjectCatalogueByUuid,
    updateSubjectCatalogue,
    getSubjectCatalogueByParentUuid,
    getSubjectCatalogueByUuid
} from '../../request/api';
export default {
    name: 'index',
    data() {
        return {
            total: null,
            totalFlag: false,
            ruleForm1: {
                name: '', //科目目录名称
                parentUuid: '', //科目目录的父uuid
                sortNumberName: '', //科目目录序名
                specialStatus: 0, //标记特殊（1：标记 0：未标记）
                subjectUuid: '', //科目的uuid
            },
            rules1: {
                
            },
            contentsList: [],
            columnList: [
                { 'prop': 'sortNumberName', 'label': '目录序名' },
                { 'prop': 'name', 'label': '章节名称' },
                { 'prop': 'sortNumber', 'label': '同级排序' },
            ],
            contentsForm: {
                currentPage: 1, //当前页数
                pageSize: 8, //每页显示条目个数	
                uuid: '', //科目的uuid
            },
            drawerTitle1: '添加目录',
            drawer1: false,
            direction: 'rtl',

        }
    },
    created() {
        this.contentsForm.uuid = this.$route.query.id;
        this.ruleForm1.subjectUuid = this.$route.query.id;
        this.getSubjectCatalogueBySubjectUuid();
    },
    methods: {
        addContentsClick() {
            this.drawer1 = true;
        },
        editClick(scope) {

        },
        deleteClick(scope) {
            this.deleteSubjectCatalogueByUuid(scope);
        },
        addClick(scope) {

        },
        addSubjectCatalogue() {
            this.$smoke_post(addSubjectCatalogue, this.ruleForm1).then(res => {
                console.log(res);
                if(res.code == 200) {
                    this.drawer1 = false;
                    this.getSubjectCatalogueBySubjectUuid();
                }else{
                    this.$message({
                        type: 'error',
                        message: res.msg
                    })
                }
            })
        },
        getSubjectCatalogueBySubjectUuid() {
            this.$smoke_post(getSubjectCatalogueBySubjectUuid, this.contentsForm).then(res => {
                console.log(res);
                this.contentsList = res.data.list;
                this.total = res.data.total;
            })
        },
        deleteSubjectCatalogueByUuid(scope) {
            console.log(scope.row.level);
            this.$smoke_post(deleteSubjectCatalogueByUuid, {
                parentUuid: scope.row.level == 1 ? '' : scope.row.parentUuid,
                subjectUuid: scope.row.level == 1 ? this.contentsForm.uuid : '',
                uuid: scope.row.uuid
            }).then(res => {
                if(res.code == 200) {
                    scope._self.$refs[`popover-${scope.$index}`].doClose();
                    this.$message({
                        type: 'success',
                        message: '删除成功', 
                    });
                    this.getSubjectCatalogueBySubjectUuid();
                }
            })
        },
        handleCurrentChange(index) {
            this.contentsForm.currentPage = index;
            this.getSubjectCatalogueBySubjectUuid();
        },
        handleSizeChange(index) {
            this.contentsForm.pageSize = index;
            this.getSubjectCatalogueBySubjectUuid();
        },
        handleClose(done) {
            done();
        },
        submitForm1(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // console.log(this.ruleForm1);
                    if(this.drawerTitle1 == '添加目录'){
                        this.addSubjectCatalogue();
                    }else{
                        // this.updateSubject();
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