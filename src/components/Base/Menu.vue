<template>
    <el-main class="index-main">
        <el-button type="primary" @click="add_menu" size="small" style="margin-bottom: .2rem;">新建菜单</el-button>

        <el-table
          :data="menuList"
          style="width: 100%"
          v-loading="fullscreenLoading"
          row-key="uuid"
          default-expand-all
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"  
        >
          <el-table-column
            :prop="item.prop"
            :label="item.label"
            :width="item.label == '菜单名称' ? '250px' : ''"
            v-for="(item, index) in columnList"
            :key="index"
            >
          </el-table-column>
          <el-table-column prop="active" label="操作" width="95">
            <template slot-scope="scope">
                <svg-icon @click="handleUpdataClick(scope.row)" icon-title="修改" icon-class="edit" />
                <el-popover
                  placement="top"
                  width="200"
                  trigger="click"
                  :ref="`popover-${scope.$index}`"
                  >
                  <p>确定要删除此菜单吗？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="scope._self.$refs[`popover-${scope.$index}`].doClose()">取消</el-button>
                    <el-button type="primary" size="mini" @click="handleDeleteClick(scope)">确定</el-button>
                  </div>
                  <svg-icon slot="reference" icon-title="删除" icon-class="del"></svg-icon>
                </el-popover>
                <svg-icon @click="handleAddClick(scope.row)" icon-title="添加" icon-class="add"></svg-icon>
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
                
                <el-form-item label="菜单名称" prop="name">
                  <el-input v-model="ruleForm.name" placeholder="菜单名称"></el-input>
                </el-form-item>
                <el-form-item label="菜单路由组成" prop="menuComponent">
                  <el-input v-model="ruleForm.menuComponent" placeholder="菜单路由组成"></el-input>
                </el-form-item>
                <el-form-item label="菜单路由地址" prop="url">
                  <el-input v-model="ruleForm.url" placeholder="菜单路由地址"></el-input>
                </el-form-item>
                <el-form-item label="菜单icon" prop="icon">
                  <el-input v-model="ruleForm.icon" placeholder="菜单icon"></el-input>
                </el-form-item>
                <el-form-item label="菜单类型" prop="level">
                    <el-select v-model="ruleForm.level" placeholder="请选择菜单类型">
                        <el-option
                          v-for="item in levelList"
                          :key="item.name"
                          :label="item.name"
                          :value="item.number">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="页面字段编号" prop="pageNum">
                    <el-select v-model="ruleForm.pageNum" clearable placeholder="请选择页面字段编号">
                        <el-option
                          v-for="item in pageNumList"
                          :key="item.name"
                          :label="item.name"
                          :value="item.number">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item>
                  <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
                  <el-button @click="resetForm()">重置</el-button>
                </el-form-item>

            </el-form>

        </el-drawer>

    </el-main>
</template>

<script>

// default-expand-all 默认table要不要展开

import { getMenuDetailsSubsetByUuid, addMenu, deleteMenu, updateMenu, itemList } from '../../request/api';
import { levelFunc } from '../../assets/js/common';
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
                { 'prop': 'level', 'label': '菜单类型' },
                { 'prop': 'pageNum', 'label': '页面字段编号' },
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
                level: '',
                pageNum: '',
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
                level: [
                  { required: true, message: '请选择菜单类型', trigger: 'blur' }
                ],
            },
            drawerTitle: '新建菜单',
            fullscreenLoading: false,
            levelList: [
                { 'name': '目录', 'number': 1 },
                { 'name': '页面', 'number': 2 },
                { 'name': '按钮', 'number': 3 },
            ],
            pageNumList: [],
        }
    },
    created() {
        this.getMenuDetailsSubsetByUuid();
        this.itemList();
    },
    methods: {
        itemList() {
            this.$smoke_get(itemList, {}).then(res => {
                if(res.code == 200) {
                    this.pageNumList = res.data;
                }else{
                    this.$message({
                        type: 'error',
                        message: res.msg
                    })
                }
            })
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
              if (valid) {
                if(this.drawerTitle == '新建菜单'){
                    this.addMenu();
                }else{
                    this.updateMenu();
                }
              } else {
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
            this.ruleForm.level = '';
        },
        handleDeleteClick(scope) {
            this.$smoke_post(deleteMenu, {
                uuid: scope.row.uuid
            }).then(res => {
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
            this.drawer = true;
            this.drawerTitle = '新建菜单';
            this.resetForm();
            this.ruleForm.parentUuid = row.uuid;
        },
        handleClose(done) {
            done();
        },
        handleUpdataClick(row) {
            this.drawer = true;
            this.drawerTitle = '修改菜单';
            this.ruleForm.name = row.name;
            this.ruleForm.icon = row.icon;
            this.ruleForm.menuComponent = row.menuComponent;
            this.ruleForm.url = row.url;
            this.ruleForm.pageNum = row.pageNum;
            this.ruleForm.uuid = row.uuid;
            this.ruleForm.parentUuid = row.parentUuid;
            if(row.level == '目录') {
                this.ruleForm.level = 1;
            }else if(row.level == '页面') {
                this.ruleForm.level = 2;
            }else if(row.level == '按钮') {
                this.ruleForm.level = 3;
            }
        },
        getMenuDetailsSubsetByUuid() {
            let arr;
            this.fullscreenLoading = true;
            this.$smoke_post(getMenuDetailsSubsetByUuid, {
                uuid: ""
            }).then(res => {
                if(res.code == 200) {
                    setTimeout(() => {
                        this.fullscreenLoading = false;
                        arr = JSON.parse(JSON.stringify(res.data).replace(/includeSubsetList/g,"children"));
                        this.menuList = levelFunc(arr);
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
        addMenu() {
            this.$smoke_post(addMenu, this.ruleForm).then(res => {
                if(res.code == 200){
                    this.drawer = false;
                    this.getMenuDetailsSubsetByUuid();
                    location.reload();
                }
            })
        },
        updateMenu() {
            this.$smoke_post(updateMenu, this.ruleForm).then(res => {
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
            font-weight: 700;
        }
        .people-screen{
            margin-bottom: 16px;
            .screen-li{
                width: 90%;
            }
        }
    }
/* //element-ui table的去除右侧滚动条的样式 */
::-webkit-scrollbar {
    width: 8px;
    height: 1px;
}
    /* // 滚动条的滑块 */
::-webkit-scrollbar-thumb {
    background-color: #a1a3a9;
    border-radius: 0px;
    border-radius: 8px;
}
</style>