<template>
    <div class="main-area">

        <el-container class="index-main">

            <el-main>

                <div class="people-title">后台角色管理</div>

                <el-button type="primary" @click="add_role" style="margin-bottom: .2rem;">新建角色</el-button>

                

                <el-table
                  :data="roleList"
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
                        <el-button @click="handleClick(scope.row)" type="text" size="small">修改</el-button>
                    </template>
                  </el-table-column>
                </el-table>

            </el-main>

        </el-container>

    </div>
</template>

<script>
import { getRoleDetailedList } from '../../request/api';
export default {
    name: 'role',
    data() {
        return {
            roleList: [],
            columnList: [
                { 'prop': 'roleGroupUuid', 'label': 'id' },
                { 'prop': 'roleGroupName', 'label': '角色名' },
            ],

        }
    },
    created() {
        this.getRoleDetailedList();
    },
    methods: {
        handleClick(row) {
            console.log(row);
            alert('暂未开发');
        },
        getRoleDetailedList() {
            this.$smoke_post(getRoleDetailedList, {}).then(res => {
                console.log(res);
                this.roleList = res.data;
            })
        },
        add_role() {

        },
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