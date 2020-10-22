<template>
    <el-main class="index-main">
        <el-button type="primary" size="small" @click="add_role" style="margin-bottom: .2rem;">新建角色</el-button>

        <el-table
          :data="roleList"
          v-loading="fullscreenLoading"
          style="width: 100%"
          :height="tableHeight"
          >
          <el-table-column
            :prop="item.prop"
            :label="item.label"
            v-for="(item, index) in columnList"
            :key="index"
          >
          </el-table-column>
          <el-table-column prop="active" label="操作" width="95">
            <template slot-scope="scope">
                <svg-icon @click="handleUpdataClick(scope.row)" icon-title="修改" icon-class="edit" />
                <el-popover
                  placement="top"
                  width="200"
                  trigger="click"
                  :ref="`popover-${scope.$index}`"
                  >
                  <p>确定要删除此角色吗？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="scope._self.$refs[`popover-${scope.$index}`].doClose()">取消</el-button>
                    <el-button type="primary" size="mini" @click="handleDeleteClick(scope)">确定</el-button>
                  </div>
                  <svg-icon slot="reference" icon-title="删除" icon-class="del" />
                </el-popover>
                <svg-icon @click="handleMenuClick(scope.row)" icon-title="配置菜单" icon-class="config" />
                <!-- <el-button @click="handlePeopleClick(scope.row)" type="text" style="margin-left: .2rem;">配置人员</el-button> -->

            </template>
          </el-table-column>
        </el-table>

        <el-drawer
            :title="drawerTitle"
            :visible.sync="drawer"
            :direction="direction"
            :before-close="handleClose">
            <span class="bullets"></span>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
                
                <el-form-item label="角色名称" prop="name">
                  <el-input v-model="ruleForm.name"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="describe">
                  <el-input v-model="ruleForm.describe"></el-input>
                </el-form-item>

                <el-form-item>
                  <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
                  <el-button @click="resetForm()">重置</el-button>
                </el-form-item>

            </el-form>

        </el-drawer>


        <el-drawer
            :title="drawerMenuTitle"
            :visible.sync="drawerMenu"
            :direction="direction"
            :before-close="handleClose">
            <span class="bullets"></span>

            <div style="height: 52px; background: #FAFAFA; border-bottom: 1px dashed #ccc; padding: 10px 0 0 38px; position: fixed; z-index: 99; width: 100%;">

                    <el-button type="primary" size="small" @click="treeYes">保 存</el-button>

                </div>

            <div style="height: 60px; width: 100%;"></div>

            <el-tree
              :data="treeData"
              style="padding-bottom:20px;"
              show-checkbox
              node-key="uuid"
              default-expand-all
              :default-checked-keys="checkedKeys"
              ref="tree"
              :indent='40'
              :props="defaultProps">
            </el-tree>

        </el-drawer>

        <el-drawer
            :title="drawerPeopleTitle"
            :visible.sync="drawerPeople"
            :direction="direction"
            :before-close="handleClose"
            size="40%"
            >
            <span class="bullets"></span>

            <el-row style="margin: .2rem; height: .6rem; background: #aaa; line-height: .6rem; text-align: center; color: #fff;">
                <el-col :span="18"><div>{{ruleForm.name}}现有{{rolePeopleList.length}}人</div></el-col>
                <el-col :span="6"><div style="cursor: pointer;" @click="addRoleUser">添加成员</div></el-col>
            </el-row>

            <el-tag
                style="margin: .2rem;" 
                v-for="tag in rolePeopleList"
                :key="tag.uuid"
                closable
                :disable-transitions="false"
                @close="userDel(tag)"
                >
                {{tag.name}}
            </el-tag>

            <el-drawer
              title="添加成员"
              :append-to-body="true"
              :before-close="handleClose"
              :visible.sync="innerDrawer"
              size="30%"
              >
            <span class="bullets"></span>
              
              <div style="padding: .3rem; padding-top: 0; font-size: 14px;">
                  <div>一、按搜索添加成员</div>
                  <el-row style="width: 100%; margin-top: .2rem;">
                        <el-col :span="9">
                            <el-input v-model="innerForm.accountNumber" placeholder="请输入手机号"></el-input>
                        </el-col>
                        <el-col :span="9" :offset="1">
                            <el-input v-model="innerForm.name" placeholder="请输入姓名"></el-input>
                        </el-col>
                        <el-col :span="5" style="text-align: right;">
                            <el-button type="primary" @click="inner_search">搜索</el-button>
                        </el-col>
                    </el-row>
                    <el-tag
                        style="margin-top: .3rem; margin-right: .2rem; cursor: pointer;" 
                        v-for="tag in searchTags"
                        :key="tag.uuid"
                        @click="tagClick(tag)"
                        >
                        {{tag.name}}
                    </el-tag>

                    <div style="border: 1px dashed #aaa; margin-top: .6rem; min-height: 3rem;">
                        <div>操作框</div>
                        <el-tag
                            style="margin: .2rem; cursor: pointer;" 
                            v-for="tag in searchOkTags"
                            :key="tag.uuid"
                            closable
                            :disable-transitions="false"
                            @close="tagClose(tag)"
                            >
                            {{tag.name}}
                        </el-tag>

                    </div>

                    <el-button type="primary" @click="insertUser" style="margin-top: .3rem; width: 1.4rem;">提交</el-button>

                    <!-- <div style="margin-top: .4rem;">二、按组织框架添加成员</div> -->

              </div>

            </el-drawer>

        </el-drawer>

    </el-main>
</template>

<script>
import { 
    getRoleDetailedList,
    addRole, 
    updateRole, 
    deleteRole, 
    getRoleMenuList, 
    addRoleMenuRelation, 
    getUserByRoleUuid,
    getUserByNameAndAccountNumber,
    insertRoleAndUserRelation,
    deleteRoleAndUserRelation
} from '../../request/api';
import { deteleObject, removeObject } from '../../assets/js/common'
export default {
    name: 'role',
    props: ['tableHeight'],
    data() {
        return {
            roleList: [],
            columnList: [
                { 'prop': 'name', 'label': '角色名称' },
                { 'prop': 'describe', 'label': '角色描述' },
            ],
            drawer: false,
            drawerTitle: '新增角色',
            direction: 'rtl',

            drawerMenu: false,
            drawerMenuTitle: '配置菜单',

            treeData: [],
            defaultProps: {label: 'name', children: 'includeSubsetList'},
            checkedKeys: [],

            drawerPeopleTitle: '配置人员',
            drawerPeople: false,
            rolePeopleList: [],
            innerDrawer: false,
            innerForm: {
                accountNumber: '',
                name: '',
                roleUuid: '',
            },
            searchTags: [],
            searchOkTags: [],

            ruleForm: {
                name: '',
                describe: '',
                uuid: '',
            },
            rules: {
                name: [
                  { required: true, message: '请输入角色名称', trigger: 'blur' },
                ],
                describe: [
                  { required: true, message: '请输入角色描述', trigger: 'blur' }
                ],
            },
            fullscreenLoading: false,
        }
    },
    created() {
        this.getRoleDetailedList();
    },
    methods: {
        addRoleUser() {
            this.innerDrawer = true;
            this.innerForm.accountNumber = '';
            this.innerForm.name = '';
            this.innerForm.roleUuid = '';
            this.searchTags = [];
            this.searchOkTags = [];
        },
        handleUpdataClick(row) {
            this.drawer = true;
            this.drawerTitle = '修改角色';
            this.ruleForm.name = row.name;
            this.ruleForm.describe = row.describe;
            this.ruleForm.uuid = row.uuid;
        },
        handleDeleteClick(scope) {
            this.$smoke_post(deleteRole, {
                uuid: scope.row.uuid
            }).then(res => {
                if(res.code == 200){
                    scope._self.$refs[`popover-${scope.$index}`].doClose();
                    this.$message({
                        type: 'success',
                        message: '删除成功', 
                    });
                    this.getRoleDetailedList();
                }
            })
        },
        getRoleDetailedList() {
            this.fullscreenLoading = true;
            this.$smoke_post(getRoleDetailedList, {}).then(res => {
                if(res.code == 200) {
                    setTimeout(() => {
                        this.fullscreenLoading = false;
                        res.data.map((res,index) => {
                            res['visible'] = false;
                        })
                        this.roleList = res.data;                        
                        this.$emit('setTableHeight', this.roleList.length, 1, 1)
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
        add_role() {
            this.drawer = true;
            this.drawerTitle = '新增角色';
            this.resetForm();
        },
        handleClose(done) {
            done();
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
              if (valid) {
                if(this.drawerTitle == '新增角色'){
                    this.addRole();
                }else{
                    this.updateRole();
                }
              } else {
                return false;
              }
            });
        },
        resetForm(formName) {
            this.ruleForm.name = '';
            this.ruleForm.describe = '';
            this.ruleForm.uuid = '';
        },
        addRole() {
            this.$smoke_post(addRole, this.ruleForm).then(res => {
                if(res.code == 200){
                    this.drawer = false;
                    this.getRoleDetailedList();
                }
            })
        },
        updateRole() {
            this.$smoke_post(updateRole, this.ruleForm).then(res => {
                if(res.code == 200){
                    this.drawer = false;
                    this.getRoleDetailedList();
                }
            })
        },
        handleMenuClick(row) {
            this.drawerMenu = true;
            this.getRoleMenuList(row.uuid);
            this.ruleForm.uuid = row.uuid;
        },
        handlePeopleClick(row) {
            this.drawerPeople = true;
            this.getUserByRoleUuid(row.uuid);
            this.ruleForm.uuid = row.uuid;
            this.ruleForm.name = row.name;
        },
        getUserByRoleUuid(id) {
            var this_ = this;
            this.$smoke_post(getUserByRoleUuid, {
                roleUuid: id
            }).then(res => {
                this_.rolePeopleList = res.data;
            })
        },
        inner_search() {
            this.innerForm.roleUuid = this.ruleForm.uuid;
            // this.innerForm.roleUuid = "ef4f619613b848bd81eb744d8790827a";
            this.getUserByNameAndAccountNumber();
        },
        getUserByNameAndAccountNumber() {
            this.$smoke_post(getUserByNameAndAccountNumber, this.innerForm).then(res => {
                this.searchTags = res.data;
            })
        },
        tagClick(tag) {
            this.searchOkTags.push(tag);
            this.searchOkTags = deteleObject(this.searchOkTags);
        },
        tagClose(tag) {
            let arr;
            arr = removeObject(this.searchOkTags, tag);
            this.searchOkTags = arr;
        },
        userDel(tag){
            this.$confirm('确定要删除该成员吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deleteRoleAndUserRelation(tag.uuid);
            }).catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消删除'
                });          
            });
        },
        deleteRoleAndUserRelation(id) {
            this.$smoke_post(deleteRoleAndUserRelation, {
                roleUuid: this.ruleForm.uuid,
                userUuidList: [id]
            }).then(res => {
                if(res.code == 200){
                    this.getUserByRoleUuid(this.ruleForm.uuid);
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                }
            })
        },
        insertUser() {
            let arr = [];
            this.searchOkTags.map(res => {
                arr.push(res.uuid);
            });
            this.$smoke_post(insertRoleAndUserRelation, {
                roleUuid: this.ruleForm.uuid,
                userUuidList: arr
            }).then(res => {
                if(res.code == 200){
                    this.innerDrawer = false;
                    this.getUserByRoleUuid(this.ruleForm.uuid);
                }
            })
        },
        getRoleMenuList(id) {
            let arr;
            this.checkedKeys = [];
            this.$smoke_post(getRoleMenuList, {
                uuid: id
            }).then(res => {
                arr = JSON.parse(JSON.stringify(res.data).replace(/disabled/g,"flag"));
                arr.forEach(element => {
                    if((element.flag) && (element.includeSubsetList.length == 0)){
                        this.checkedKeys.push(element.uuid);
                    }else if(element.includeSubsetList.length != 0){
                        element.includeSubsetList.forEach(tag => {
                            if(tag.flag && (element.includeSubsetList.length == 0)){
                                this.checkedKeys.push(tag.uuid);
                            }else if(tag.includeSubsetList.length != 0){
                                tag.includeSubsetList.forEach(sll => {
                                    if(sll.flag && sll.includeSubsetList.length == 0){
                                        this.checkedKeys.push(sll.uuid);
                                    }else if(sll.includeSubsetList.length != 0){
                                        sll.includeSubsetList.forEach(wwq => {
                                            if(wwq.flag && wwq.includeSubsetList.length == 0){
                                                this.checkedKeys.push(wwq.uuid);
                                            }else{
                                                return;
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                });
                this.treeData = arr;
            })
        },
        treeYes() {
            this.$smoke_post(addRoleMenuRelation, {
                menuUuidList: this.$refs.tree.getCheckedKeys(),
                roleUuid: this.ruleForm.uuid
            }).then(res => {
                if(res.code == 200) {
                    this.drawerMenu = false;
                    this.$message({
                        type: 'success',
                        message: '配置成功'
                    })
                }else{
                    this.$message({
                        type: 'error',
                        message: res.msg
                    })
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
        margin-top: 15px;
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
            font-weight: 700;
        }
        .people-screen{
            margin-bottom: 10px;
            .screen-li{
                width: 94%;
            }
        }
    }
    .el-pagination{
        text-align: right;
        margin-top: .4rem;
    }

</style>