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
                <el-input v-model="formText.roleUuidList" disabled></el-input>
            </el-form-item>

            <el-form-item label="关联JQ用户：">
                <el-input v-model="formText.uin" disabled></el-input>
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

                <div style="margin-top: .2rem; height: .3rem; line-height: .3rem; font-size: 16px;">当前选择：{{currentRow.name}}</div>

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

        <el-button type="primary" @click="onSubmit" style="margin-left: 6.8rem; width: 2rem;">保存</el-button>
    </div>
</template>

<script>
import { getUserDetailed, getJqAccountNumberList, phoneUserList } from '../../request/api';
import { getTextByState, getTextByJs } from '../../assets/js/common'
export default {
    name: 'index',
    data() {
        return {
            uuid: this.$route.query.uuid,
            form: {},
            formText: {},
            drawerSearch: false,
            direction: 'rtl',
            selectValue: '',
            selectOptions: [],
            searchForm: {
                accountType: 0, //账号类型
                currentPage: 1, //当前页数
                name: '', //jq的姓名
                pageSize: 8, //每页显示条目个数
                userName: '', //jq的用户名	
            },
            total: null, //总条目数
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
            }
        }
    },
    created() {
        console.log(this.$route.query.uuid);
        if((this.$route.query.uuid == '') || (this.$route.query.uuid == undefined)){
            this.$router.push({ path: '/' });
        }else{
            this.getUserDetailed();           
        }
    },
    methods: {
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
                this.formText.roleUuidList = getTextByJs(res.data.roleUuidList);
            })
        },
        onSubmit() {
            console.log('222');
            alert('暂未开发');
        },
        searchJQ() {
            this.drawerSearch = true;
            this.getJqAccountNumberList();
        },
        addJQ() {
            alert('正在开发中');
        },
        getJqAccountNumberList() {
            this.$smoke_get(getJqAccountNumberList,{}).then(res => {
                console.log(res);
                this.selectOptions = res.data;
            })
        },
        changeItem(value) {
            console.log(value);
            this.searchForm.accountType = value;
        },
        phoneUserList() {
            this.$smoke_post(phoneUserList, this.searchForm).then(res => {
                console.log(res);
                this.tableData = res.data.list;
                this.total = res.data.total;
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
            }
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