<template>
    <div class="">

        <el-container class="index-main">

            <el-main>

                <div class="people-title">公司人员详情</div>

                <el-form ref="form" :model="formText" label-width="80px" style="width: 400px; margin: 0 auto;">
                        
                    <el-form-item label="姓名：">
                        <el-input v-model="formText.name" disabled></el-input>
                    </el-form-item>
        
                    <el-form-item label="工号：">
                        <el-input v-model="formText.jobNumber" disabled></el-input>
                    </el-form-item>
        
                    <el-form-item label="手机号：">
                        <el-input v-model="formText.accountNumber" disabled></el-input>
                    </el-form-item>
        
                    <el-form-item label="在职状态：">
                        <el-input v-model="formText.jobStatus" disabled></el-input>
                    </el-form-item>
        
                    <el-form-item label="组织部门：">
                        <el-input v-model="formText.orgUuidList" disabled></el-input>
                    </el-form-item>
        
                    <el-form-item label="拥有角色：">
                    
                        <el-select v-model="roleArr" multiple placeholder="请选择角色" @change='handleRoleUuidChange' :disabled="!roleConfig">
                          <el-option
                            v-for="item in roleOptions"
                            :key="item.uuid"
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
                        <el-button type="primary" plain @click="searchJQ">查找并关联</el-button>
                        <el-button type="primary" plain @click="addJQ">创建并关联</el-button>
                    </el-form-item>

                    <el-form-item style="margin-top: 60px;">
                        <el-button type="primary" @click="onSubmit" style="width: 100px;" v-loading.fullscreen.lock="fullscreenLoading">保存</el-button>
                        <el-button type="primary" style="width: 100px;" @click="$router.go(-1)">取消</el-button>
                    </el-form-item>
        
                </el-form>
        
                <el-drawer
                    title="查找并关联"
                    :visible.sync="drawerSearch"
                    :direction="direction"
                    size="55%"
                    :before-close="handleClose">
                    
                    <div style="padding: .3rem;">
                    
                        <el-row>
                            <el-col :span="6">
                                <el-select v-model="selectValue" placeholder="请选择JQ账号" @change="changeItem" style="width: 100%;">
                                    <el-option
                                      v-for="item in selectOptions"
                                      :key="item.type"
                                      :label="item.name"
                                      :value="item.type">
                                    </el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="6" :offset="1">
                                <el-input v-model="searchForm.name" placeholder="请输入JQ姓名"></el-input>
                            </el-col>
                            <el-col :span="6" :offset="1">
                                <el-input v-model="searchForm.userName" placeholder="请输入JQ用户名"></el-input>
                            </el-col>
                            <el-col :span="3" :offset="1">
                                <el-button type="primary" @click="searchBtn">搜索</el-button>
                            </el-col>
                        </el-row>
        
                        <div style="margin-top: 20px; height: 40px; line-height: 30px; font-size: 15px;">当前选择：

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
        
                        <el-table
                            :data="tableData"
                            border
                            highlight-current-row
                            @current-change="handleHighLightChange"
                            style="margin-top: .2rem;">
        
                            <el-table-column
                                :prop="item.props"
                                :label="item.label"
                                v-for="(item, index) in columnList"
                                :key="index">
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
                          <el-input v-model="createForm.mobile"></el-input>
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

        </el-container>
        
    </div>
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
                pageSize: 10, //每页显示条目个数
                userName: '', //jq的用户名	
            },
            total: 0, //总条目数
            totalFlag: false, //当只有一页时隐藏分页
            tableData: [],
            columnList: [
                { props: 'jqName', label: 'jq的姓名'},
                { props: 'uin', label: 'jq的唯一标识'},
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
        console.log(this.$route.query.uuid);
        if((this.$route.query.uuid == '') || (this.$route.query.uuid == undefined)){
            this.$router.push({ path: '/' });
        }else{
            this.getUserDetailed();
        }
        this.getRoleList();
        let buttonMap = JSON.parse(localStorage.getItem("buttonMap"));
        this.roleConfig = buttonMap.roleConfig;
        console.log(this.roleConfig);
    },
    methods: {
        tagClose(item) {
            console.log(this.formText.jqList);
            console.log(item);
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
            console.log(value);
        },
        getRoleList() {
            this.$smoke_get(getRoleList, {}).then(res => {
                console.log(res);
                res.data.push({name: '超级管理员', uuid: superManageUuid});
                this.roleOptions = quchong(res.data, 'uuid');
            })
        },
        handleHighLightChange(val) {
            console.log(this.accountType);
            let flag = false;
            val.platformNumber = this.accountType;
            if(this.formText.jqList.length == 0){
                val.mainUin = true;
                this.formText.jqList.push(val);
            }else{
                val.mainUin = false;
                this.formText.jqList.map(sll => {
                    if(val.platformNumber == sll.platformNumber){
                        sll.jqName = val.jqName;
                        sll.jqUserName = val.jqUserName;
                        sll.uin = val.uin;
                        flag = true;
                    }
                })
                if(!flag){
                    this.formText.jqList.push(val);
                }
            }
            this.formText.jqList = [...new Set(this.formText.jqList)];
            console.log(this.formText.jqList);
        },
        handleCurrentChange(index) {
            console.log(index);
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
                console.log(res);
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
        onSubmit() {
            console.log(this.formText.jqList);
            this.fullscreenLoading = true;
            this.$smoke_post(updateUser, {
                roleUuidList: this.roleArr,
                userUuid: this.uuid,
                jqList: this.formText.jqList
            }).then(res => {
                console.log(res);
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
                console.log(res);
                this.selectOptions = res.data;
                this.selectCreate = res.data;
            })
        },
        changeItem(value) {
            console.log(value);
            this.searchForm.accountType = value;
        },
        createItem(value) {
            console.log(value);
            this.createForm.type = value;
        },
        phoneUserList() {
            this.$smoke_post(phoneUserList, this.searchForm).then(res => {
                console.log(res);
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
            // console.log(this.formText.jqList);
        },
        createNo() {
            this.drawerCreate = false;
        },
        createYes(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.createForm.userUuid = this.uuid;
                    this.$smoke_post(addUserJqUser, this.createForm).then(res => {
                        console.log(res);
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
                  console.log('error submit!!');
                  return false;
                }
            });
            
        }
    },
    mounted() {
        
    }
}
</script>

<style lang="less" scoped>
    .index-main{
        height: calc( 100vh - 60px);
        .people-title{
            width: calc( 100vw - 3.8rem);
            height: 40px;
            line-height: 40px;
            text-align: center;
            font-size: 15px;
            background: #fff;
            margin-bottom: .3rem;
            color: #666666;
            font-weight: bold;
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

    .index-main /deep/ .el-select{
        width: 300px;
    }
    .tagActive{
        color: red !important;
    }
</style>