<template>
    <el-main class="index-main">

        <div class="people-title">

            <i class="el-icon-arrow-left smoke-left-icon" @click="$router.push('/knowp/subject')"></i>
            <span>{{uploadData.subjectName}}目录管理</span>

        </div>

        <div style="overflow: hidden;">

            <div style="float: left;">

                <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
                    <el-menu-item index="1">教材目录结构</el-menu-item>
                    <el-menu-item index="2" >知识点体系</el-menu-item>
                </el-menu>

            </div>

            <div style="float: right; width:220px;">

                <el-upload
                    class="avatar-uploader"
                    :data='uploadData'
                    action="https://gm.jhwx.com/api/knowledgeSystem/knowExcel/readExcelSubject"
                    :headers="headersObj"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload">
                    <el-button type="primary">导入目录</el-button>
                </el-upload>

                <el-button type="primary" @click="outExcelSubject" style="position: relative; left: 120px; top: -40px;">导出目录</el-button>

            </div>

        </div>

        <el-button type="primary" @click="addContentsClick" style="margin-bottom: .2rem;">添加目录</el-button>

        <el-table
          :data="contentsList"
          row-key="uuid"
          default-expand-all
          v-loading.fullscreen.lock="fullscreenLoading"
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
          :row-class-name="tableRowClassName"
          style="width: 100%">
          <af-table-column
            :prop="item.prop"
            :label="item.label"
            v-for="(item, index) in columnList"
            :key="index"
            >
          </af-table-column>
          <el-table-column prop="active" label="操作">
            <template slot-scope="scope">
                <el-button @click="editClick(scope.row)" type="text" >编辑</el-button>
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
                  <el-button slot="reference" type="text"  style="margin-left: .2rem;">删除</el-button>
                </el-popover>
                <el-button v-if="scope.row.level != 3" @click="addClick(scope.row)" type="text"  style="margin-left: .2rem;">添加</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
            background
            layout="total, sizes, prev, pager, next, jumper"
            :total='total'
            :page-size='contentsForm.pageSize'
            :page-sizes="[10, 20, 30]"
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
    
</template>

<script>
import { 
    addSubjectCatalogue,
    getSubjectCatalogueBySubjectUuid,
    deleteSubjectCatalogueByUuid,
    updateSubjectCatalogue,
    getSubjectCatalogueByParentUuid,
    getSubjectCatalogueByUuid,

    outExcelKnow,
    outExcelSubject,
    readExcelSubject
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
                uuid: '', //科目目录的uuid
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
                pageSize: 10, //每页显示条目个数	
                uuid: '', //科目的uuid
            },
            drawerTitle1: '添加目录',
            drawer1: false,
            direction: 'rtl',
            activeIndex: '1',
            uploadData: {
                subjectUuid: '',
                subjectName: ''
            },
            headersObj: {
                Authorization: ''
            },
            fullscreenLoading: false,
        }
    },
    created() {
        this.contentsForm.uuid = this.$route.query.id;
        this.ruleForm1.subjectUuid = this.$route.query.id;
        this.uploadData.subjectUuid = this.$route.query.id;
        this.getSubjectCatalogueBySubjectUuid();
        const jhToken = localStorage.getItem('jhToken');
        this.headersObj.Authorization = jhToken;
    },
    methods: {
        outExcelSubject() {
            const href = 'https://gm.jhwx.com' + outExcelSubject + '?subjectUuid=' + this.$route.query.id;
            window.open(href, '_blank');
        },
        handleAvatarSuccess(res, file) {
            console.log(res);
            console.log(file);
            let str = '';
            if(res.code == 200) {
                if(res.data.length == 0){
                    this.$notify({
                        title: '成功',
                        message: '上传成功',
                        type: 'success'
                    });
                }else{
                    res.data.map(sll => {
                        str = str + sll + '\n';
                    })
                    console.log(str);
                    this.$notify.error({
                        title: '失败',
                        message: str,
                        duration: 0
                    });
                }
            }else{
                this.$notify.error({
                    title: '失败',
                    message: '上传失败',
                });
            }
        },
        beforeAvatarUpload(file) {
            console.log(file);
        },
        tableRowClassName({row, rowIndex}) {
            if (row.level == 1) {
                return 'one-row';
            } else if (row.level == 2) {
                return 'two-row';
            } else if (row.level == 3) {
                return 'three-row';
            }
            return '';
        },
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
        addContentsClick() {
            this.drawer1 = true;
            this.drawerTitle1 = '添加目录';
            this.ruleForm1.parentUuid = '';
            this.ruleForm1.subjectUuid = this.$route.query.id;
            this.ruleForm1.uuid = '';
        },
        editClick(scope) {
            console.log(scope);
            this.drawer1 = true;
            this.drawerTitle1 = '编辑目录';
            if(scope.level == 1){
                this.ruleForm1.parentUuid = '';
            }else{
                this.ruleForm1.subjectUuid = '';
            }
            this.getSubjectCatalogueByUuid(scope);
        },
        getSubjectCatalogueByUuid(scope) {
            this.$smoke_post(getSubjectCatalogueByUuid, {
                uuid: scope.uuid
            }).then(res => {
                console.log(res);
                this.ruleForm1.name = res.data.name;
                this.ruleForm1.sortNumberName = res.data.sortNumberName;
                this.ruleForm1.specialStatus = res.data.specialStatus;
                this.ruleForm1.parentUuid = res.data.parentUuid;
                this.ruleForm1.uuid = res.data.uuid;
            })
        },
        deleteClick(scope) {
            this.deleteSubjectCatalogueByUuid(scope);
        },
        addClick(scope) {
            console.log(scope);
            this.drawer1 = true;
            this.drawerTitle1 = '添加目录';
            this.ruleForm1.parentUuid = scope.uuid;
            this.ruleForm1.subjectUuid = '';
            this.ruleForm1.uuid = '';
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
            let arr;
            this.fullscreenLoading = true;
            this.$smoke_post(getSubjectCatalogueBySubjectUuid, this.contentsForm).then(res => {
                console.log(res);
                if(res.code == 200) {

                    setTimeout(() => {
                        this.fullscreenLoading = false;
                        arr = JSON.parse(JSON.stringify(res.data.list).replace(/list/g,"children"));
                        this.contentsList = arr;
                        this.total = res.data.total;
                        this.uploadData.subjectName = res.data.name;
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
        deleteSubjectCatalogueByUuid(scope) {
            console.log(scope.row);
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
                }else{
                    scope._self.$refs[`popover-${scope.$index}`].doClose();
                    this.$message({
                        type: 'error',
                        message: res.msg, 
                    });
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
        updateSubjectCatalogue() {
            this.$smoke_post(updateSubjectCatalogue, this.ruleForm1).then(res => {
                if(res.code == 200) {
                    this.drawer1 = false;
                    this.$message({
                        type: 'success',
                        message: '编辑成功'
                    })
                    this.getSubjectCatalogueBySubjectUuid();
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
                    if(this.drawerTitle1 == '添加目录'){
                        this.addSubjectCatalogue();
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
            position: relative;
        }
        .people-screen{
            margin-bottom: 16px;
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

/* //element-ui table的去除右侧滚动条的样式 */
::-webkit-scrollbar {
    width: 8px;
    height: 1px;
}
    /* // 滚动条的滑块 */
::-webkit-scrollbar-thumb {
    background-color: #a1a3a9;
    border-radius: 8px;
}
</style>