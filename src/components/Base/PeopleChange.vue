<template>
    <div class="main-area">
        <el-form ref="form" :model="formText" label-width="80px">

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

                <el-select v-model="roleArr" multiple placeholder="请选择角色" @change='handleRoleUuidChange'>
                  <el-option
                    v-for="item in roleOptions"
                    :key="item.uuid"
                    :label="item.name"
                    :value="item.uuid">
                  </el-option>
                </el-select>

            </el-form-item>

            <el-form-item label="关联JQ用户：">
                <div>{{formText.uin}}</div>
                <el-button type="primary" plain style="margin-top: .2rem" @click="searchJQ">查找并关联</el-button>
                <el-button type="primary" plain style="margin-top: .2rem" @click="addJQ">创建并关联</el-button>
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
                        <el-select v-model="selectValue" placeholder="请选择JQ账号" @change="changeItem">
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

                <div style="margin-top: .2rem; height: .3rem; line-height: .3rem; font-size: 16px;" v-if="currentRow">当前选择：<span>{{currentRow.name}}</span></div>

                <div style="margin-top: .2rem; height: .3rem; line-height: .3rem; font-size: 16px;">搜索结果：</div>

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
                <el-form-item label="用户名" prop="strId"> 
                    <el-input v-model="createForm.strId"></el-input>
                </el-form-item>
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

        <el-button type="primary" @click="onSubmit" style="margin-left: 6.8rem; width: 1rem;" v-loading.fullscreen.lock="fullscreenLoading">保存</el-button>
        <el-button type="primary" style="width: 1rem;" @click="$router.go(-1)">取消</el-button>
    </div>
</template>

<script>
import { getUserDetailed, getJqAccountNumberList, phoneUserList, updateUser, addUserJqUser, getRoleList } from '../../request/api';
import { getTextByState, getTextByJs } from '../../assets/js/common'
export default {
    name: 'index',
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
                pageSize: 8, //每页显示条目个数
                userName: '', //jq的用户名	
            },
            total: 0, //总条目数
            totalFlag: false, //当只有一页时隐藏分页
            tableData: [],
            columnList: [
                { props: 'name', label: 'jq的姓名'},
                { props: 'uin', label: 'jq的唯一标识'},
                { props: 'userName', label: 'jq的用户名'},
            ],
            currentRow: {
                name: '',
                uin: '',
                userName: '',
            },
            fullscreenLoading: false,
            createForm: {
                email: '',
                mobile: '',
                nickname: '', //姓名
                strId: '', //用户名 字母开头,由字母、数字、下划线组成,总长度为3~20;不可重复，不可修改
                type: null,
                userUuid: ''
            },
            rules: {
                nickname: [
                    { required: true, message: '请输入JQ姓名', trigger: 'blur' },
                ],
                strId: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
                ],
                type: [
                    { required: true, message: '请选择JQ账号类型', trigger: 'blur' },
                ]
            },
            roleOptions: [],
            roleArr: []
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
    },
    methods: {
        handleRoleUuidChange(value) {
            console.log(value);
        },
        getRoleList() {
            this.$smoke_get(getRoleList, {}).then(res => {
                console.log(res);
                this.roleOptions = res.data;
            })
        },
        handleHighLightChange(val) {
            this.currentRow = val;
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
            })
        },
        onSubmit() {
            console.log(this.currentRow);
            this.fullscreenLoading = true;
            this.$smoke_post(updateUser, {
                jqName: this.currentRow.name,
                jqUserName: this.currentRow.userName,
                roleUuidList: this.roleArr,
                uin: this.formText.uin,
                userUuid: this.uuid
            }).then(res => {
                console.log(res);
                if(res.code == 200) {
                    setTimeout(() => {
                        this.fullscreenLoading = false;
                        this.getUserDetailed();
                        this.$router.push({ path: '/base/people'});
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
            this.currentRow.name = '';
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
            this.phoneUserList();
        },
        relationNo() {
            this.drawerSearch = false;
        },
        relationYes() {
            if(this.currentRow.uin == ''){
                this.$message({
                    type: 'error',
                    message: '请您查找并选择您要关联的JQ信息'
                })
            }else{
                this.drawerSearch = false;
                this.formText.uin = this.currentRow.uin;
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
                        console.log(res);
                        if(res.code == 200) {
                            this.drawerCreate = false;
                            this.currentRow.name = this.createForm.nickname;
                            this.currentRow.userName = this.createForm.strId;
                            this.formText.uin = res.data;
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
    .main-area{
        width: calc( 100vw - 3.65rem );
        .el-form{
            width: 6rem;
            margin: .4rem auto;
            border: 1px dashed #aaa;
            padding: .4rem;
        }
    }
    .el-pagination{
        text-align: right;
        margin-top: .4rem;
    }
    .el-select{
        width: 100%;
    }
</style>