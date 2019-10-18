<template>
    <div style="">
        <el-container class="index-main">

            <el-main>

                <div class="people-title">公司人员列表</div>

                <el-row class="people-screen">
                    <el-col :span="5">
                        <el-cascader
                            ref="cascader"
                            class="screen-li"
                            placeholder="请选择组织架构"
                            :show-all-levels=false
                            :options="zuzhiOptions"
                            @change='handleZuzhiChange'
                            :props="{ checkStrictly: true, label: 'name', value: 'uuid', children: 'includeSubsetList' }"
                            clearable>
                        </el-cascader>
                    </el-col>
                    <el-col :span="5">
                        <el-select v-model="roleUuidText" placeholder="请选择角色" @change='handleRoleUuidChange' class="screen-li" clearable>
                            <el-option
                              v-for="item in roleOptions"
                              :key="item.uuid"
                              :label="item.name"
                              :value="item.uuid">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="5">
                        <el-select v-model="jobStatusText" placeholder="请选择员工状态" @change='handleJobStatusChange' class="screen-li" clearable>
                            <el-option
                              v-for="item in jobStatusOptions"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-row>

                <el-row class="people-screen">
                    <el-col :span="5">
                        <el-input v-model="screenForm.name" placeholder="请输入要查询的姓名" class="screen-li"></el-input>
                    </el-col>
                    <el-col :span="5">
                        <el-input v-model="screenForm.accountNumber" placeholder="请输入要查询的手机号" class="screen-li"></el-input>                            
                    </el-col>
                    <el-col :span="5">
                        <el-button type="primary" @click="smoke_search">搜 索</el-button>
                    </el-col>
                    <el-col :span="9">
                        <el-button type="primary" class='smoke-fr' @click="smoke_clear">清 空 条 件</el-button>
                    </el-col>
                </el-row>
                
                <el-table
                  :data="userList"
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

                <el-pagination
                    background
                    layout="total, sizes, prev, pager, next, jumper"
                    :total='total'
                    :page-size='screenForm.pageSize'
                    :page-sizes="[2, 3, 5, 8]"
                    :hide-on-single-page="totalFlag"
                    @current-change="handleCurrentChange"
                    @size-change="handleSizeChange"
                >
                </el-pagination>

            </el-main>

        </el-container>
    </div>
</template>

<script>
import { getUserDetailedList, getRoleList, getOrgSubsetByUuid } from '../../request/api';
import { getTextByJs, getTextByState } from '../../assets/js/common'
export default {
    name: 'people',
    data() {
        return {
            userList: [],
            columnList: [
                { 'prop': 'name', 'label': '姓名' },
                { 'prop': 'accountNumber', 'label': '手机号' },
                { 'prop': 'jobStatus', 'label': '状态' },
                { 'prop': 'orgUuidList', 'label': '部门' },
                { 'prop': 'roleUuidList', 'label': '角色' },
            ],
            total: null, //总条目数
            totalFlag: false, //当只有一页时隐藏分页
            jobStatusOptions: [{
              value: 1,
              label: '在职'
            }, {
              value: 0,
              label: '离职'
            }],
            jobStatusText: '', //状态选择文案
            roleUuidText: '', //角色选择文案
            roleOptions: [], //筛选项角色列表
            zuzhiOptions: [], //组织列表
            screenForm: {
                accountNumber: '', //账号（手机号）
                currentPage: 1, //当前页
                jobStatus: 1, // 状态选择value
                name: '', //姓名
                orgUuidList: [], //组织唯一标识集合
                pageSize: 8, //单页请求的数量
                roleUuid: '', //角色唯一标识
                sortSet: [], //排序集合
            }
        }
    },
    created() {
        this.getUserDetailedList();
        this.getRoleList();
        this.getOrgSubsetByUuid();
    },
    methods: {
        handleClick(row) {
            console.log(row);
            alert('暂未开发');
        },
        handleRoleUuidChange(value) {
            console.log(value);
            this.screenForm.roleUuid = value;
            this.getUserDetailedList();
        },
        handleJobStatusChange(value) {
            console.log(value);
            this.screenForm.jobStatus = value;
            this.getUserDetailedList();
        },
        handleSizeChange(index) {
            console.log(index);
            this.screenForm.pageSize = index;
            this.getUserDetailedList();
        },
        handleCurrentChange(index) {
            console.log(index);
            this.screenForm.currentPage = index;
            this.getUserDetailedList();
        },
        handleZuzhiChange(arr) {
            // console.log(arr.slice(-1));
            arr = arr.slice(-1);
            // console.log(arr);
            this.screenForm.orgUuidList = arr;
            this.getUserDetailedList();
        },
        getUserDetailedList() {
            this.$smoke_post(getUserDetailedList,this.screenForm).then(res => {
                console.log(res);
                this.total = res.data.total;
                // 用户列表
                res.data.list.map(data => {
                    data.orgUuidList = getTextByJs(data.orgUuidList);
                    data.roleUuidList = getTextByJs(data.roleUuidList);
                    data.jobStatus = getTextByState(data.jobStatus);
                })
                this.userList = res.data.list;
            })
        },
        getRoleList() {
            this.$smoke_get(getRoleList, {}).then(res => {
                console.log(res);
                this.roleOptions = res.data;
            })
        },
        getOrgSubsetByUuid() {
            this.$smoke_post(getOrgSubsetByUuid, {
                uuid: ""
            }).then(res => {
                console.log(res);
                this.zuzhiOptions = res.data;
            })
        },
        smoke_search() {
            this.getUserDetailedList();
        },
        smoke_clear() {
            this.screenForm.accountNumber = '';
            this.screenForm.jobStatus = 1;
            this.screenForm.name = '';
            this.screenForm.orgUuidList = [];
            this.screenForm.roleUuid = '';
            this.screenForm.sortSet = [];
            this.jobStatusText = '';
            this.roleUuidText = '';
            
            // 主动触发clearable
            let obj = {}
            obj.stopPropagation = () =>{}
            try{
                this.$refs.cascader.clearValue(obj)
            }catch(err){
                this.$refs.cascader.handleClear(obj)
            }
            // this.getUserDetailedList();
        }
    },
    mounted() {
        
    }
}
</script>

<style lang="less" scoped>
    .el-main{
        // background: grey;
    }
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
    .el-pagination{
        text-align: right;
        margin-top: .4rem;
    }
</style>