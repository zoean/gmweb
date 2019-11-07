<template>
    <div style="">
        <el-container class="index-main">

            <el-main>

                <div class="people-title">科目管理</div> 

                <el-button type="primary" @click="addSubjectClick" style="margin-bottom: .2rem;">添加科目</el-button>
         
                <el-row style="margin-bottom: 20px;">

                    <el-col :span="4">
                        <el-select v-model="subjectForm.uuid" @change="subjectChange" clearable placeholder="请选择考试项目" style="width: 90%">
                            <el-option
                              v-for="item in subjectOption"
                              :key="item.uuid"
                              :label="item.name"
                              :value="item.uuid">
                            </el-option>
                        </el-select>
                    </el-col>

                    <el-col :span="6">
                        <el-input v-model="subjectForm.name" placeholder="请输入科目名称" style="width: 90%"></el-input>
                    </el-col>
                    <el-col :span="2">
                        <el-button type="primary" @click="subjectSearch" style="width: 90%">搜索</el-button>
                    </el-col>

                </el-row>

                <el-table
                  :data="subjectList"
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
                          <p style="margin-bottom: .2rem;">确定要删除吗？</p>
                          <div style="text-align: right; margin: 0">
                            <el-button size="mini" type="text" @click="scope._self.$refs[`popover-${scope.$index}`].doClose()">取消</el-button>
                            <el-button type="primary" size="mini" @click="deleteClick(scope)">确定</el-button>
                          </div>
                          <el-button slot="reference" type="text" size="small" style="margin-left: .2rem;">删除</el-button>
                        </el-popover>
                        <el-button @click="detailsClick(scope.row)" type="text" size="small" style="margin-left: .2rem;">详情</el-button>
                    </template>
                  </el-table-column>
                </el-table>

                <el-pagination
                    background
                    layout="total, sizes, prev, pager, next, jumper"
                    :total='total'
                    :page-size='subjectForm.pageSize'
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
                        
                        <el-form-item label="科目名称" prop="name">
                          <el-input v-model="ruleForm1.name"></el-input>
                        </el-form-item>

                        <el-form-item label="科目ID" prop="soreNumber">
                          <el-input v-model="ruleForm1.soreNumber"></el-input>
                        </el-form-item>

                        <el-form-item label="科目描述" prop="describe">
                          <el-input v-model="ruleForm1.describe"></el-input>
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
    addSubject,
    updateSubject,
    getExamBasic,
    getSubjectByExamUuidAndName,
    deleteSubject,
    getSubjectByUuid
} from '../../request/api';
import { getTextByJs } from '../../assets/js/common';
export default {
    name: 'subject',
    data() {
        return {
            subjectList: [],
            columnList: [
                { 'prop': 'soreNumber', 'label': '科目ID' },
                { 'prop': 'name', 'label': '科目名称' },
                { 'prop': 'examList', 'label': '关联考试项' },
            ],
            drawerTitle1: '添加科目',
            drawer1: false,
            direction: 'rtl',
            ruleForm1: {
                describe: '', //科目描述
                name: '', //科目名称
                soreNumber: '', //科目ID
            },
            rules1: {

            },
            subjectForm: {
                currentPage: 1,
                name: '',
                pageSize: 8,
                uuid: ''
            },
            totalFlag: false,
            subjectOption: [],
            total: null
        }
    },
    created() {
        this.getExamBasic();
        this.getSubjectByExamUuidAndName();
    },
    methods: {
        addSubjectClick() {
            this.drawer1 = true;
        },
        subjectChange() {
            this.getSubjectByExamUuidAndName();
        },
        getExamBasic() {
            this.$smoke_get(getExamBasic, {}).then(res => {
                console.log(res);
                this.subjectOption = res.data;
            })
        },
        addSubject() {
            this.$smoke_post(addSubject, this.ruleForm1).then(res => {
                console.log(res);
                if(res.code == 200) {
                    this.drawer1 = false;
                    this.getSubjectByExamUuidAndName();
                }else{
                    this.$message({
                        type: 'error',
                        message: res.msg
                    })
                }
            })
        },
        updateSubject() {
            this.$smoke_post(updateSubject, this.ruleForm1).then(res => {
                console.log(res);
                if(res.code == 200) {
                    this.drawer1 = false;
                    this.getSubjectByExamUuidAndName();
                }else{
                    this.$message({
                        type: 'error',
                        message: res.msg
                    })
                }
            })
        },
        handleClose(done) {
            done();
        },
        submitForm1(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    console.log(this.ruleForm1);
                    if(this.drawerTitle1 == '添加科目'){
                        this.addSubject();
                    }else{
                        this.updateSubject();
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
        subjectSearch() {
            this.getSubjectByExamUuidAndName();
        },
        getSubjectByExamUuidAndName() {
            let arr;
            // console.log(this.subjectForm);
            this.$smoke_post(getSubjectByExamUuidAndName, this.subjectForm).then(res => {
                res.data.list.map(sll => {
                    sll.examList = getTextByJs(sll.examList);
                })
                this.subjectList = res.data.list;
                this.total = res.data.total;
            })
        },
        handleCurrentChange(index) {
            this.subjectForm.currentPage = index;
            this.getSubjectByExamUuidAndName();
        },
        handleSizeChange(index) {
            this.subjectForm.currentPage = index;
            this.getSubjectByExamUuidAndName();
        },
        editClick(scope) {
            console.log(scope);
            this.drawer1 = true;
            this.drawerTitle1 = '编辑科目';
            this.getSubjectByUuid(scope);
        },
        getSubjectByUuid(scope) {
            this.$smoke_post(getSubjectByUuid, {
                uuid: scope.uuid
            }).then(res => {
                // console.log(res);
                this.ruleForm1.describe = res.data.describe;
                this.ruleForm1.name = res.data.name;
                this.ruleForm1.soreNumber = res.data.soreNumber;
                this.ruleForm1.uuid = res.data.uuid;
            })
        },
        deleteClick(scope) {
            console.log(scope);
            this.$smoke_post(deleteSubject, {
                uuid: scope.row.uuid
            }).then(res => {
                if(res.code == 200) {
                    scope._self.$refs[`popover-${scope.$index}`].doClose();
                    this.$message({
                        type: 'success',
                        message: '删除成功', 
                    });
                    this.getSubjectByExamUuidAndName();
                }
            })
        },
        detailsClick(row) {
            this.$router.push({
                path: '/knowp/contents',
                query: {
                    id: row.uuid
                }
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