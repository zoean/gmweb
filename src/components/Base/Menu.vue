<template>
    <div class="main-area">

        <el-container class="index-main">

            <el-main>

                <div class="people-title">菜单管理</div>

                <el-button type="primary" @click="add_menu" style="margin-bottom: .2rem;">新建菜单</el-button>

                <el-table
                  :data="menuList"
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
                        <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
                    </template>
                  </el-table-column>
                </el-table>

                <el-drawer
                    title="增加菜单"
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
                          <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
                          <el-button @click="resetForm('ruleForm')">重置</el-button>
                        </el-form-item>

                    </el-form>

                </el-drawer>

            </el-main>

        </el-container>

    </div>
</template>

<script>

// default-expand-all 默认table要不要展开

import { getMenuDetailsSubsetByUuid, addMenu } from '../../request/api';
export default {
    name: 'zuzhi',
    data() {
        return {
            menuList: [],
            columnList: [
                { 'prop': 'uuid', 'label': 'id' },
                { 'prop': 'name', 'label': '组织名称' },
            ],
            drawer: false,
            direction: 'rtl',
            ruleForm: {
                icon: '',
                name: '',
                menuComponent: '',
                url: '',
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
            }
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
                this.addMenu();
              } else {
                console.log('error submit!!');
                return false;
              }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        add_menu() {
            this.drawer = true;
        },
        handleClose(done) {
            done();
        },
        handleClick(row) {
            console.log(row);
            alert('暂未开发');
        },
        getMenuDetailsSubsetByUuid() {
            let arr;
            this.$smoke_post(getMenuDetailsSubsetByUuid, {
                uuid: ""
            }).then(res => {
                console.log(res.data);
                
                // this.zuzhiList = arr;
            })
        },
        addMenu() {
            this.$smoke_post(addMenu, this.ruleForm).then(res => {
                console.log(res);
                if(res.code == 200){
                    this.drawer = false;
                    this.getMenuDetailsSubsetByUuid();
                }
            })
        }
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
        font-size: .3rem !important;
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