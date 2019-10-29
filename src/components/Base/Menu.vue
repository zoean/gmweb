<template>
    <div class="main-area">

        <el-container class="index-main">

            <el-main>

                <div class="people-title">菜单管理</div>

                <el-button type="primary" @click="add_menu" style="margin-bottom: .2rem;">新建菜单</el-button>

                <el-table
                  :data="menuList"
                  style="width: calc( 100vw - 3.65rem)"
                  row-key="uuid"
                  default-expand-all
                  :tree-props="{children: 'children', hasChildren: 'hasChildren'}"  
                >
                  <el-table-column
                    :prop="item.prop"
                    :label="item.label"
                    v-for="(item, index) in columnList"
                    :key="index"
                    >
                  </el-table-column>
                  <el-table-column prop="active" label="操作">
                    <template slot-scope="scope">
                        <el-button @click="handleUpdataClick(scope.row)" type="text" size="small">修改</el-button>
                        <el-popover
                          placement="top"
                          width="200"
                          trigger="click"
                          :ref="`popover-${scope.$index}`"
                          >
                          <p style="margin-bottom: .2rem;">确定要删除此菜单吗？</p>
                          <div style="text-align: right; margin: 0">
                            <el-button size="mini" type="text" @click="scope._self.$refs[`popover-${scope.$index}`].doClose()">取消</el-button>
                            <el-button type="primary" size="mini" @click="handleDeleteClick(scope)">确定</el-button>
                          </div>
                          <el-button slot="reference" type="text" size="small" style="margin-left: .2rem;">删除</el-button>
                        </el-popover>
                        <el-button @click="handleAddClick(scope.row)" type="text" size="small" style="margin-left: .2rem;">添加</el-button>
                    </template>
                  </el-table-column>
                </el-table>

                <el-drawer
                    :title="drawerTitle"
                    :visible.sync="drawer"
                    :direction="direction"
                    :before-close="handleClose">

                    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
                        
                        <el-form-item label="菜单名称" prop="name">
                          <el-input v-model="ruleForm.name"></el-input>
                        </el-form-item>
                        <el-form-item label="菜单路由组成" prop="menuComponent">
                          <el-input v-model="ruleForm.menuComponent"></el-input>
                        </el-form-item>
                        <el-form-item label="菜单路由地址" prop="url">
                          <el-input v-model="ruleForm.url"></el-input>
                        </el-form-item>
                        <el-form-item label="菜单icon" prop="icon">
                          <el-input v-model="ruleForm.icon"></el-input>
                        </el-form-item>

                        <el-form-item>
                          <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
                          <el-button @click="resetForm()">重置</el-button>
                        </el-form-item>

                    </el-form>

                </el-drawer>

            </el-main>

        </el-container>

    </div>
</template>

<script>

// default-expand-all 默认table要不要展开

import { getMenuDetailsSubsetByUuid, addMenu, deleteMenu, updateMenu } from '../../request/api';
export default {
    name: 'menua',
    data() {
        return {
            menuList: [],
            columnList: [
                { 'prop': 'name', 'label': '菜单名称' },
                { 'prop': 'icon', 'label': '菜单icon' },
                { 'prop': 'menuComponent', 'label': '菜单路由组成' },
                { 'prop': 'url', 'label': '菜单路由地址' },
            ],
            drawer: false,
            direction: 'rtl',
            ruleForm: {
                icon: '',
                name: '',
                menuComponent: '',
                url: '',
                uuid: '',
                parentUuid: '',
            },
            rules: {
                name: [
                  { required: true, message: '请输入菜单名称', trigger: 'blur' },
                ],
                menuComponent: [
                  { required: true, message: '请输入菜单路由组成', trigger: 'blur' }
                ],
                url: [
                  { required: true, message: '请输入菜单路由跳转地址', trigger: 'blur' }
                ],
            },
            drawerTitle: '新建菜单',

        }
    },
    created() {
        this.getMenuDetailsSubsetByUuid();
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
              if (valid) {
                console.log(this.ruleForm);
                if(this.drawerTitle == '新建菜单'){
                    this.addMenu();
                }else{
                    this.updateMenu();
                }
              } else {
                console.log('error submit!!');
                return false;
              }
            });
        },
        resetForm() {
            this.ruleForm.icon = '';
            this.ruleForm.name = '';
            this.ruleForm.menuComponent = '';
            this.ruleForm.url = '';
            this.ruleForm.uuid = '';
            this.ruleForm.parentUuid = '';
        },
        handleDeleteClick(scope) {
            // console.log(scope.row.uuid);
            this.$smoke_post(deleteMenu, {
                uuid: scope.row.uuid
            }).then(res => {
                console.log(res);
                if(res.code == 200){
                    scope._self.$refs[`popover-${scope.$index}`].doClose();
                    this.$message({
                        type: 'success',
                        message: '删除成功', 
                    });
                    this.getMenuDetailsSubsetByUuid();
                    location.reload();
                }
            })
        },
        add_menu() {
            this.drawer = true;
            this.drawerTitle = '新建菜单';
            this.resetForm();
        },
        handleAddClick(row) {
            console.log(row);
            this.drawer = true;
            this.drawerTitle = '新建菜单';
            this.resetForm();
            this.ruleForm.parentUuid = row.uuid;
        },
        handleClose(done) {
            done();
        },
        handleUpdataClick(row) {
            console.log(row);
            this.drawer = true;
            this.drawerTitle = '修改菜单';
            this.ruleForm.name = row.name;
            this.ruleForm.icon = row.icon;
            this.ruleForm.menuComponent = row.menuComponent;
            this.ruleForm.url = row.url;
            this.ruleForm.uuid = row.uuid;
            this.ruleForm.parentUuid = row.parentUuid;
        },
        getMenuDetailsSubsetByUuid() {
            let arr;
            this.$smoke_post(getMenuDetailsSubsetByUuid, {
                uuid: ""
            }).then(res => {
                console.log(res.data);
                arr = JSON.parse(JSON.stringify(res.data).replace(/includeSubsetList/g,"children"));
                this.menuList = arr;
            })
        },
        addMenu() {
            this.$smoke_post(addMenu, this.ruleForm).then(res => {
                console.log(res);
                if(res.code == 200){
                    this.drawer = false;
                    this.getMenuDetailsSubsetByUuid();
                    location.reload();
                }
            })
        },
        updateMenu() {
            this.$smoke_post(updateMenu, this.ruleForm).then(res => {
                console.log(res);
                if(res.code == 200){
                    this.drawer = false;
                    this.getMenuDetailsSubsetByUuid();
                    location.reload();
                }
            })
        },
    },
    mounted() {
        
    }
}
</script>

<style lang="less" scoped>
    .main-area{
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
    }
</style>
<style>
    .el-drawer__header{
        font-size: 18px !important;
    }
    .demo-ruleForm{
        border: 1px dashed #ccc;
        padding: .4rem;
        margin: .2rem;
    }
    .el-form-item__label{
        width: 1.6rem !important;
    }
    .el-form-item__content{
        margin-left: 1.6rem !important;
    }
</style>