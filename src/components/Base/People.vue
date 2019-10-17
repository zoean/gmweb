<template>
    <div style="width: 100%;">
        <el-container>
            
            <el-container class="index-main">

                <el-main>
                    
                    <el-table
                      :data="userList"
                      style="width: calc( 100vw - 3.8rem)">
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
                        layout="prev, pager, next"
                        :total="10"
                        :page-size='5'
                    >
                    </el-pagination>

                </el-main>

            </el-container>

        </el-container>
    </div>
</template>

<script>
import { getUserDetailedList } from '../../request/api';
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
            
        }
    },
    created() {
        this.getUserDetailedList();
    },
    methods: {
        handleClick(row) {
            console.log(row);
            alert('暂未开发');
        },
        
        getUserDetailedList() {
            this.$smoke_post(getUserDetailedList,{}).then(res => {
                console.log(res);
                // 用户列表
                res.data.list.map(data => {
                    data.orgUuidList = getTextByJs(data.orgUuidList);
                    data.roleUuidList = getTextByJs(data.roleUuidList);
                    data.jobStatus = getTextByState(data.jobStatus);
                })
                this.userList = res.data.list;
            })
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
    }
    .el-pagination{
        text-align: right;
        margin-top: .4rem;
    }
</style>