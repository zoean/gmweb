<template>
    <el-main class="index-main">
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
          style="width: 100%"          
          :height="tableHeight">
          <el-table-column
            :prop="item.prop"
            :label="item.label"
            v-for="(item, index) in columnList"
            :key="index"
            :width="index == 0 ? '100' : null"
            >
          </el-table-column>
          <el-table-column prop="active" label="操作" width="95">
            <template slot-scope="scope">
                <svg-icon @click="editClick(scope.row)" icon-title="编辑" icon-class="edit" />
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
                  <svg-icon slot="reference" icon-title="删除" icon-class="del" />
                </el-popover>
                <svg-icon @click="detailsClick(scope.row)" icon-title="详情" icon-class="detail" />
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
            background
            layout="total, sizes, prev, pager, next, jumper"
            :total='total'
            :page-size='subjectForm.pageSize'
            :page-sizes="[10, 20, 30, 50, 100]"
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
            <span class="bullets"></span>

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
    props: ['tableHeight'],
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
                pageSize: 20,
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
                this.subjectOption = res.data;
            })
        },
        addSubject() {
            this.$smoke_post(addSubject, this.ruleForm1).then(res => {
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
                    if(this.drawerTitle1 == '添加科目'){
                        this.addSubject();
                    }else{
                        this.updateSubject();
                    }
                } else {
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
            this.$smoke_post(getSubjectByExamUuidAndName, this.subjectForm).then(res => {
                res.data.list.map(sll => {
                    sll.examList = getTextByJs(sll.examList);
                })
                this.subjectList = res.data.list;
                this.total = res.data.total;               
                this.$emit('setTableHeight', this.total, 1)
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
            this.drawer1 = true;
            this.drawerTitle1 = '编辑科目';
            this.getSubjectByUuid(scope);
        },
        getSubjectByUuid(scope) {
            this.$smoke_post(getSubjectByUuid, {
                uuid: scope.uuid
            }).then(res => {
                this.ruleForm1.describe = res.data.describe;
                this.ruleForm1.name = res.data.name;
                this.ruleForm1.soreNumber = res.data.soreNumber;
                this.ruleForm1.uuid = res.data.uuid;
            })
        },
        deleteClick(scope) {
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
                }else{
                    scope._self.$refs[`popover-${scope.$index}`].doClose();
                    this.$message({
                        type: 'error',
                        message: res.msg, 
                    });
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
    }
</style>