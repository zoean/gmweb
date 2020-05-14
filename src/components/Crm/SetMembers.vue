<template>
    <el-main class="index-main">

        <div class="people-title">

            <i class="el-icon-arrow-left smoke-left-icon" @click="$router.push('/crm/dataAllocation')"></i>
            <span>当前分配组员</span>

        </div>

        <el-row style="margin-bottom: 20px;">

            <el-col :span="5">
                
                <el-cascader
                    ref="cascader"
                    class="screen-li"
                    placeholder="请选择组织架构"
                    :show-all-levels=false
                    :options="zuzhiOptions"
                    @change='handleZuzhiChange'
                    :props="{ checkStrictly: true, label: 'name', value: 'uuid', children: 'includeSubsetList', multiple: true}"
                    clearable>
                </el-cascader>

            </el-col>

            <el-col :span="4"><el-input v-model="upperForm.name" placeholder="请输入成员姓名" class="screen-li"></el-input></el-col>

            <el-col :span="4"><el-input v-model="upperForm.jqNumber" placeholder="请输入成员JQ账号" class="screen-li"></el-input></el-col>

            <el-col :span="3"><el-button type="primary" @click="upperFormClick">搜索</el-button></el-col>

            <el-col :span="3"><el-button type="primary" @click="addUpperForm">添加组员</el-button></el-col>

        </el-row>

        <el-table
            ref="multipleTable"
            :data="upperData"
            style="width: 100%"
            @selection-change="handleSelectionChange">
            <el-table-column
              type="selection"
              width="45">
            </el-table-column>
            <el-table-column
                :prop="item.prop"
                :label="item.label"
                v-for="(item, index) in columnList"
                :key="index"
                >
            </el-table-column>
            <el-table-column prop="active" label="操作">
                <template slot-scope="scope">
                    <el-popover
                        placement="top"
                        width="200"
                        trigger="click"
                        :ref="`popover-${scope.$index}`"
                        >
                        <p style="margin-bottom: .2rem;">确定要移除此人员吗？</p>
                        <div style="text-align: right; margin: 0">
                          <el-button size="mini" type="text" @click="scope._self.$refs[`popover-${scope.$index}`].doClose()">取消</el-button>
                          <el-button type="primary" size="mini" @click="handleDeleteClick(scope)">确定</el-button>
                        </div>
                        <el-button slot="reference" type="text" >移除</el-button>
                    </el-popover>
                </template>
            </el-table-column>
        </el-table>

    </el-main>
</template>

<script>
import { 
    getDataAllocationStaffList,
    getOrgSubsetByUuid,
    deleteDataAllocationStaff,
} from '../../request/api';
import {  } from '../../assets/js/data';
import { getTextByJs } from '../../assets/js/common';
export default {
    name: 'setMembers',
    data() {
        return {
            zuzhiOptions: [], //组织列表
            upperData: [],
            upperForm: {
                dataAllocationRulesUuid: this.$route.query.uuid,
                jqNumber: '',
                name: '',
                orgUuidList: [],
                type: 1,
            },
            columnList: [
                { 'prop': 'userName', 'label': '姓名' },
                { 'prop': 'staffOrgListText', 'label': '隶属部门' },
                { 'prop': 'managerText', 'label': 'JQ账号' },
            ],
            deletePeople: {
                dataAllocationRulesUuid: this.$route.query.uuid, //数据分配组的唯一标识
                userUuidList: [], //员工唯一标识集合
            },
            toggleArr: [], //选中数组
        }
    },
    created() {
        this.getDataAllocationStaffList();
        this.getOrgSubsetByUuid();
    },
    methods: {
        handleSelectionChange(val) {
            // console.log(val);
        },
        getDataAllocationStaffList() {
            this.$smoke_post(getDataAllocationStaffList, this.upperForm).then(res => {
                if(res.code == 200) {
                    this.upperData = res.data.list;
                    res.data.list.map(sll => {
                        sll.staffOrgListText = getTextByJs(sll.staffOrgList);
                        if(sll.disabled){
                            this.toggleArr.push(sll);
                        }
                    })
                    this.toggleSelection(this.toggleArr, true);
                }
            })
        },
        //默认选中
        toggleSelection(rowArr, selected) {
            let that = this;
            that.$nextTick(function() {
                rowArr.map(sll => {
                    that.$refs.multipleTable.toggleRowSelection(sll, selected);
                })
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
        handleZuzhiChange(arr) {
            let brr = [];
            // console.log(arr);
            arr.map(res => {
                if(res.length == 1){
                    brr.push(res[0]);
                }else{
                    brr.push(res[res.length-1]);
                }
            })
            this.upperForm.orgUuidList = brr;
        },
        handleDeleteClick(scope) {
            console.log(scope.row.userUuid);
            this.deletePeople.userUuidList.push(scope.row.userUuid);
            this.$smoke_post(deleteDataAllocationStaff, this.deletePeople).then(res => {
                if(res.code == 200) {
                    scope._self.$refs[`popover-${scope.$index}`].doClose();
                    this.$message({
                        type: 'success',
                        message: '删除成功'
                    })
                    this.getDataAllocationStaffList();
                }else{
                    this.$message({
                        type: 'error',
                        message: '删除失败'
                    })
                }
            })
        },
        upperFormClick() {
            this.getDataAllocationStaffList();
        },
        addUpperForm() {
            this.$router.push({
                path: '/crm/addMembers',
                query: {
                    uuid: this.$route.query.uuid
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
        height: calc( 100vh - 60px );
        .people-title{
            width: 100%;
            height: 40px;
            line-height: 40px;
            text-align: center;
            font-size: 15px;
            background: #aaa;
            margin-bottom: .3rem;
            color: #fff;
            position: relative;
        }
        .screen-li{
            width: 90%;
        }
    }
    .timeData /deep/ .el-table .cell{
        text-align: center !important;
    }
</style>