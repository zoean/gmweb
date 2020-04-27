<template>
    <div class="setMembers">

        <el-container class="index-main">

            <el-main>

                <div class="people-title">

                    <i class="el-icon-arrow-left smoke-left-icon" @click="$router.push('/crm/setMembers?uuid='+$route.query.uuid)"></i>
                    <span>添加分配组员</span>

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

                    <el-col :span="3"><el-button type="primary" @click="dataSave">确认</el-button></el-col>

                </el-row>

                <el-table
                    ref="multipleTable"
                    :data="upperData"
                    style="width: calc(100vw - 3.65rem)"
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
                </el-table>

            </el-main>

        </el-container>
        
    </div>
</template>

<script>
import { 
    getDataAllocationStaffList,
    updateDataAllocationStaff,
    getOrgSubsetByUuid,
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
                type: 2,
            },
            columnList: [
                { 'prop': 'userName', 'label': '姓名' },
                { 'prop': 'staffOrgListText', 'label': '隶属部门' },
                { 'prop': 'managerText', 'label': 'JQ账号' },
            ],
            updataPeople: {
                alreadyAllocatedUserList: [], //已分配的员工信息集合
                dataAllocationRulesUuid: this.$route.query.uuid, //数据分配组的唯一标识
                userUuidList: [], //新增员工唯一标识集合
            },
            toggleArr: [], //默认选中数组
            toggleArring: [], //动态选中数组
        }
    },
    created() {
        this.getDataAllocationStaffList();
        this.getOrgSubsetByUuid();
    },
    // watch: {
    //     'updataPeople':{
    //         handler:function(val,oldval){
    //            console.log('修改后',val,'修改前',oldval);
    //         }
    //     }
    // },
    methods: {
        handleSelectionChange(val) {
            console.log(val);
            this.toggleArring = val;
        },
        dataSave() {
            this.toggleArring.map(sll => {
                this.updataPeople.alreadyAllocatedUserList.map(wwq => {
                    if(sll.userUuid == wwq.uuid){
                        wwq.type = 1;
                    }else{
                        this.updataPeople.userUuidList.push(sll.userUuid);
                        this.updataPeople.userUuidList = Array.from(new Set(this.updataPeople.userUuidList));
                    }
                })
            })
            this.updataPeople.alreadyAllocatedUserList = Array.from(new Set(this.updataPeople.alreadyAllocatedUserList));
            this.$smoke_post(updateDataAllocationStaff, this.updataPeople).then(res => {
                if(res.code == 200) {
                    this.$message({
                        type: 'success',
                        message: '添加成功'
                    })
                    setTimeout(() => {
                        this.$router.push({
                            path: '/crm/setMembers',
                            query: {
                                uuid: this.$route.query.uuid
                            }
                        });
                    }, 1000)
                }
            })
        },
        getDataAllocationStaffList() {
            this.$smoke_post(getDataAllocationStaffList, this.upperForm).then(res => {
                if(res.code == 200) {
                    res.data.list.map(sll => {
                        sll.staffOrgListText = getTextByJs(sll.staffOrgList);
                        if(sll.disabled){
                            this.toggleArr.push(sll);
                        }
                    })
                    this.upperData = res.data.list;
                    this.updataPeople.alreadyAllocatedUserList = res.data.disabledList;
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
        upperFormClick() {
            this.getDataAllocationStaffList();
        },
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
        .upperFormText{
            position: relative;
            top: 10px;
            font-size: 14px;
        }
    }
    .timeData /deep/ .el-table .cell{
        text-align: center !important;
    }

/* //element-ui table的去除右侧滚动条的样式 */
::-webkit-scrollbar {
    width: 6px;
    height: 1px;
}
    /* // 滚动条的滑块 */
::-webkit-scrollbar-thumb {
    background-color: #a1a3a9;
    border-radius: 0px;
}
</style>