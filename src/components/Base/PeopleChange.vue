<template>
    <el-main class="index-main">
        
        <div class="people-title"><i class="el-icon-back" title="返回" @click="goback"></i>员工信息编辑</div>

        <div class="people-detail">
            <el-form ref="form" :model="formText" label-width="80px" style="width: 470px; margin: 0 auto;">
                    
                <el-form-item label="姓名：">
                    <el-input v-model="formText.name" size="small" disabled></el-input>
                </el-form-item>
        
                <el-form-item label="工号：">
                    <el-input v-model="formText.jobNumber" size="small" disabled></el-input>
                </el-form-item>
        
                <el-form-item label="手机号：">
                    <el-input v-model.trim="formText.accountNumber" size="small" disabled></el-input>
                </el-form-item>
        
                <el-form-item label="在职状态：">
                    <el-input v-model="formText.jobStatus" size="small" disabled></el-input>
                </el-form-item>
        
                <el-form-item label="组织部门：">
                    <el-input v-model="formText.orgUuidList" size="small" disabled></el-input>
                </el-form-item>
        
                <el-form-item label="拥有角色：">
                
                    <el-select v-model="roleArr" multiple placeholder="请选择角色" size="small" @change='handleRoleUuidChange' :disabled="!roleConfig">
                        <el-option
                            v-for="item in roleOptions"
                            :key="item.uuid"
                            :disabled="item.disabled"
                            :label="item.name"
                            :value="item.uuid">
                        </el-option>
                    </el-select>
        
                </el-form-item>
        
                <el-form-item label="关联JQ用户：">
                    <div style="margin-bottom: 20px;">

                        <el-tag 
                            v-for="(item,index) in formText.jqList" :key="index"
                            closable
                            style="margin-right: 10px; cursor: pointer;"
                            :class="item.mainUin ? 'tagActive' : ''"
                            @close="tagClose(item)"
                            @click="tagClick(item)"
                            >{{item.jqName}} <span v-if="item.mainUin">（主账号）</span> 
                        </el-tag>

                    </div>
                    <el-button size="small" plain @click="searchJQ">查找并关联</el-button>
                    <el-button size="small" plain @click="addJQ">创建并关联</el-button>
                </el-form-item>
        
            </el-form>
        </div>
        <el-row type="flex" justify="center" style="margin-left: -36px;">
            <el-button type="primary" size="small" @click="onSubmit" style="width: 92px;" v-loading.fullscreen.lock="fullscreenLoading">保存</el-button>
            <el-button size="small" plain style="width: 92px;" @click="$router.go(-1)">取消</el-button>
        </el-row>
        <el-drawer
            title="查找并关联"
            :visible.sync="drawerSearch"
            :direction="direction"
            size="35%"
            :before-close="handleClose">
            
            <div style="padding:0 .3rem; margin-bottom: 20px;">

                <div style="height: 52px; background: #fff; border-bottom: 1px dashed #ccc; padding-top: 6px; position: fixed; z-index: 99; width: 100%;">

                    <div>当前选择：

                        <el-tag v-for="(item,index) in formText.jqList" 
                            :key="index" closable 
                            style="margin-right: 10px; cursor: pointer;"
                            :class="item.mainUin ? 'tagActive' : ''" 
                            @close="tagClose(item)"
                            @click="tagClick(item)"
                        >
                            {{item.jqName}} <span v-if="item.mainUin">（主账号）</span> 
                        </el-tag>

                    </div>

                </div>

                <div style="height: 70px; width: 100%;"></div>

                <span class="bullets"></span>
            
                <el-row>
                    <el-col :span="6">
                        <el-select v-model="selectValue" size="small" placeholder="请选择JQ账号" @change="changeItem" style="width: 100%;">
                            <el-option
                              v-for="item in selectOptions"
                              :key="item.type"
                              :label="item.name"
                              :value="item.type">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="6" :offset="1">
                        <el-input v-model="searchForm.name" size="small" placeholder="请输入JQ姓名"></el-input>
                    </el-col>
                    <el-col :span="6" :offset="1">
                        <el-input v-model="searchForm.userName" size="small" placeholder="请输入JQ用户名"></el-input>
                    </el-col>
                    <el-col :span="3" :offset="1">
                        <el-button type="primary" size="small" @click="searchBtn">搜索</el-button>
                    </el-col>
                </el-row>
    
                <el-table
                    :data="tableData"
                    style="width: 96%; margin: 0 auto; margin-top: 16px;">
    
                    <el-table-column
                        :prop="item.props"
                        :label="item.label"
                        v-for="(item, index) in columnList"
                        :key="index">
                    </el-table-column>

                    <el-table-column prop="active" label="操作">
                        <template slot-scope="scope">
                            <el-button size="mini" type="text" @click="checkMain(scope.row)">选择jq账号</el-button>
                        </template>
                    </el-table-column>
    
                </el-table>
    
                <el-pagination
                    v-if="tableData.length != 0"
                    background
                    layout="total, prev, pager, next, jumper"
                    :total='total'
                    :page-size='searchForm.pageSize'
                    :hide-on-single-page="totalFlag"
                    @current-change="handleCurrentChange"
                >
                </el-pagination>
    
                <el-row style="margin-top: .5rem;">
                    <el-col :span="11" style="text-align: right;" :offset="1"><el-button type="primary" @click="relationNo">取消</el-button></el-col>
                    <el-col :span="11" style="text-align: left;" :offset="1"><el-button type="primary" @click="relationYes">确定关联</el-button></el-col>
                </el-row>
                
            </div>
    
        </el-drawer>
    
        <el-drawer
            title="创建并关联"
            :visible.sync="drawerCreate"
            :direction="direction"
            size="40%"
            :before-close="handleClose"   
        >
            <span class="bullets"></span>                        
            <el-form :model="createForm" ref="createForm" style="width: 80%; margin: 0 auto;" :rules="rules">
                <!-- <el-form-item label="用户名" prop="strId"> 
                    <el-input v-model="createForm.strId"></el-input>
                </el-form-item> -->
                <el-form-item label="JQ姓名" prop="nickname">
                    <el-input v-model="createForm.nickname"></el-input>
                </el-form-item>
                <el-form-item label="JQ账号类型" prop="type">
                    <el-select v-model="createForm.type" placeholder="请选择JQ账号" @change="createItem">
                        <el-option
                            v-for="item in selectCreate"
                            :key="item.type"
                            :label="item.name"
                            :value="item.type">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="手机号码">
                  <el-input v-model.trim="createForm.mobile"></el-input>
                </el-form-item>
                <el-form-item label="电子邮箱">
                  <el-input v-model="createForm.email"></el-input>
                </el-form-item>
            </el-form>
    
            <el-row style="margin-top: .5rem;">
                <el-col :span="11" style="text-align: right;" :offset="1"><el-button type="primary" @click="createNo">取消</el-button></el-col>
                <el-col :span="11" style="text-align: left;" :offset="1"><el-button type="primary" @click="createYes('createForm')">创建关联</el-button></el-col>
            </el-row>
    
        </el-drawer>

    </el-main>
</template>

<script>
import { getUserDetailed, getJqAccountNumberList, phoneUserList, updateUser, addUserJqUser, getRoleList } from '../../request/api';
import { getTextByState, getTextByJs, quchong } from '../../assets/js/common';
import { superManageUuid } from '../../assets/js/data';
export default {
    name: 'peopleChange',
    data() {
        return {
            uuid: this.$route.query.uuid,
            parentForm: {},
            form: {},
            formText: {},
            drawerCreate: false,
            drawerSearch: false,
            direction: 'rtl',
            selectValue: '',
            selectOptions: [],
            selectCreate: [],
            searchForm: {
                accountType: 0, //账号类型
                currentPage: 1, //当前页数
                name: '', //jq的姓名
                pageSize: 20, //每页显示条目个数
                userName: '', //jq的用户名	
            },
            total: null, //总条目数
            totalFlag: false, //当只有一页时隐藏分页
            tableData: [],
            columnList: [
                { props: 'jqName', label: 'jq的姓名'},
                // { props: 'uin', label: 'jq的唯一标识'},
                { props: 'jqUserName', label: 'jq的用户名'},
            ],
            fullscreenLoading: false,
            createForm: {
                email: '',
                mobile: '',
                nickname: '', //姓名
                // strId: '', //用户名 字母开头,由字母、数字、下划线组成,总长度为3~20;不可重复，不可修改
                type: null,
                userUuid: ''
            },
            rules: {
                nickname: [
                    { required: true, message: '请输入JQ姓名', trigger: 'blur' },
                ],
                // strId: [
                //     { required: true, message: '请输入用户名', trigger: 'blur' },
                //     { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
                // ],
                type: [
                    { required: true, message: '请选择JQ账号类型', trigger: 'blur' },
                ]
            },
            roleOptions: [],
            roleArr: [],
            accountType: '',
            roleConfig: null,
        }
    },
    created() {
        this.parentForm.accountNumber = this.$route.query.accountNumber
        this.parentForm.jobStatus = this.$route.query.jobStatus
        this.parentForm.name = this.$route.query.name
        this.parentForm.orgUuidList = this.$route.query.orgUuidList
        this.parentForm.roleUuid = this.$route.query.roleUuid
        this.parentForm.sortSet = this.$route.query.sortSet
        this.parentForm.startHiredDate = this.$route.query.startHiredDate
        this.parentForm.endHiredDate = this.$route.query.endHiredDate

        if((this.$route.query.uuid == '') || (this.$route.query.uuid == undefined)){
            this.$router.push({ path: '/' });
        }else{
            this.getUserDetailed();
        }
        this.getRoleList();
        let buttonMap = JSON.parse(localStorage.getItem("buttonMap"));
        this.roleConfig = buttonMap.roleConfig;
    },
    methods: {
        tagClose(item) {
            this.formText.jqList.map((res,index) => {
                if(res.uin == item.uin){
                    this.formText.jqList.splice(index,1);
                }
            })
        },
        tagClick(item) {
            this.formText.jqList.map((res,index) => {
                if(res.uin == item.uin){
                    res.mainUin = true;
                    this.$forceUpdate();
                }else{
                    res.mainUin = false;
                }
            })
        },
        handleRoleUuidChange(value) {
        },
        getRoleList() {
            this.$smoke_get(getRoleList, {}).then(res => {
                var roleArrFlag = this.roleArr.some(item => {
                    if(item == superManageUuid){
                        return true
                    }else {
                        return false
                    }
                })
                var resDataFlag = res.data.some(item => {
                    if(item.name == '超级管理员'){
                        return true
                    }else {
                        return false
                    }
                })
                if(roleArrFlag && resDataFlag) {
                    res.data.push({name: '超级管理员', uuid: superManageUuid});
                }else {
                    res.data.push({name: '超级管理员', uuid: superManageUuid, disabled: true});
                }
                this.roleOptions = quchong(res.data, 'uuid');
            })
        },
        handleCurrentChange(index) {
            this.searchForm.currentPage = index;
            this.phoneUserList();
        },
        handleClose(done) {
            done();
        },
        getUserDetailed() {
            this.$smoke_post(getUserDetailed, {
                uuid: this.uuid
            }).then(res => {
                this.form = res.data;
                this.formText = res.data;
                this.formText.jobStatus = getTextByState(res.data.jobStatus);
                this.formText.orgUuidList = getTextByJs(res.data.orgUuidList);
                this.formText.roleUuidList.map(sll => {
                    this.roleArr.push(sll.uuid);
                })
                this.formText.jqList = res.data.jqList;
            })
        },
        checkMain(row) {

            this.$nextTick(() => {

                let smoke_obj = {};

                let smoke_jqList = this.formText.jqList;

                let flag = false;

                smoke_obj.jqName = row.jqName;
                smoke_obj.jqUserName = row.jqUserName;
                smoke_obj.uin = row.uin;
                smoke_obj.platformNumber = this.accountType;

                if(smoke_jqList.length == 0){
                    smoke_obj.mainUin = true;
                    smoke_jqList.push(smoke_obj);
                }else{
                    smoke_obj.mainUin = false;
                    smoke_jqList.map(sll => {
                        if(smoke_obj.platformNumber == sll.platformNumber){
                            sll.jqName = smoke_obj.jqName;
                            sll.jqUserName = smoke_obj.jqUserName;
                            sll.uin = smoke_obj.uin;
                            flag = true;
                        }
                    })
                    if(!flag){
                        smoke_jqList.push(smoke_obj);
                    }
                }

                this.formText.jqList = [...new Set(smoke_jqList)];

                this.$message({
                    type: 'success',
                    message: '选择jq账号成功'
                })
                
            })
        },
        onSubmit() {
            this.fullscreenLoading = true;
            this.$smoke_post(updateUser, {
                roleUuidList: this.roleArr,
                userUuid: this.uuid,
                jqList: this.formText.jqList
            }).then(res => {
                if(res.code == 200) {
                    setTimeout(() => {
                        this.fullscreenLoading = false;
                        this.getUserDetailed();
                        this.$router.push({ path: '/base/people'});
                    }, 1000);
                }else{
                    setTimeout(() => {
                        this.fullscreenLoading = false;
                        this.$message({
                            type: 'error',
                            message: res.msg
                        })
                    }, 1000);
                }
            })
        },
        searchJQ() {
            this.drawerSearch = true;
            this.selectValue = '';
            this.searchForm.name = '';
            this.searchForm.userName = '';
            this.searchForm.accountType = 0;
            this.tableData = [];
            this.getJqAccountNumberList();
        },
        addJQ() {
            this.drawerCreate = true;
            this.getJqAccountNumberList();
        },
        getJqAccountNumberList() {
            this.$smoke_get(getJqAccountNumberList,{}).then(res => {
                this.selectOptions = res.data;
                this.selectCreate = res.data;
            })
        },
        changeItem(value) {
            this.searchForm.accountType = value;
        },
        createItem(value) {
            this.createForm.type = value;
        },
        phoneUserList() {
            this.$smoke_post(phoneUserList, this.searchForm).then(res => {
                if(res.code == 200){
                    this.tableData = res.data.list;
                    this.total = res.data.total;
                }else{
                    this.$message({
                        type: 'error',
                        message: res.msg
                    })
                }
            })
        },
        searchBtn() {
            this.accountType = this.searchForm.accountType;
            this.phoneUserList();
        },
        relationNo() {
            this.drawerSearch = false;
        },
        relationYes() {
            if(this.formText.jqList.length == 0){
                this.$message({
                    type: 'error',
                    message: '请您查找并选择您要关联的JQ信息'
                })
            }else{
                this.drawerSearch = false;
                this.formText.jqList = this.formText.jqList;
            }
        },
        createNo() {
            this.drawerCreate = false;
        },
        createYes(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.createForm.userUuid = this.uuid;
                    this.$smoke_post(addUserJqUser, this.createForm).then(res => {
                        if(res.code == 200) {
                            this.$router.go(0);
                        }else{
                            this.$message({
                                type: 'error',
                                message: res.msg
                            })
                        }
                    })

                } else {
                  return false;
                }
            });
            
        },
        goback(){
            this.$router.push({
                name: 'people',
                params: this.parentForm
            });
            
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
            background: #F1F1F1;
            margin-bottom: .3rem;
            color: #666666;
            position: relative;
            i{
                position: absolute;
                left: 10px;
                top: 13px;
                cursor: pointer;
            }
        }
        .people-detail{
            background: #fff;
            margin-bottom: 40px;
        }
        .people-screen{
            margin-bottom: 10px;
            .screen-li{
                width: 94%;
            }
        }
    }
    .el-col-6{
        height: auto !important;
    }
    .el-pagination{
        text-align: right;
        margin-top: .4rem;
    }
    .tagActive{
        // color: red !important;
    }
</style>