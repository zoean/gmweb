<template>
    <div>
        <el-container>
            
            <el-header class="">
                <el-row>
                    <el-col :span="12">
                        <div class="index-hleft">京华教育--综合后台</div>
                    </el-col>
                    <el-col :span="12">
                        <el-dropdown>
                            <div class="el-dropdown-link index-hright">
                                {{$store.state.name}}<i class="el-icon-arrow-down el-icon--right"></i>
                            </div>
                            <el-dropdown-menu slot="dropdown">
                              <el-dropdown-item @click.native="userInfo">个人资料</el-dropdown-item>
                              <el-dropdown-item @click.native="change_password">修改密码</el-dropdown-item>
                              <el-dropdown-item @click.native="logout">退出账号</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>

                    </el-col>
                </el-row>
            </el-header>

            <el-container class="index-main">

                <el-aside width='3rem'>
                    
                    <el-menu
                        default-active="2"
                        class="el-menu-vertical-demo"
                        @open="handleOpen"
                        @close="handleClose"
                        >
                        <el-submenu index="1">
                          <template slot="title">
                            <i class="el-icon-location"></i>
                            <span>基础模块</span>
                          </template>
                          <el-menu-item-group>
                            <template slot="title">人员管理</template>
                            <el-menu-item index="1-1">人员列表</el-menu-item>
                          </el-menu-item-group>
                          <!-- <el-menu-item-group title="分组2">
                            <el-menu-item index="1-3">选项3</el-menu-item>
                          </el-menu-item-group> -->
                        </el-submenu>
                        <el-menu-item index="2">
                          <i class="el-icon-menu"></i>
                          <span slot="title">导航二</span>
                        </el-menu-item>
                        <el-menu-item index="3">
                          <i class="el-icon-document"></i>
                          <span slot="title">导航三</span>
                        </el-menu-item>
                        <el-menu-item index="4">
                          <i class="el-icon-setting"></i>
                          <span slot="title">导航四</span>
                        </el-menu-item>
                    </el-menu>

                </el-aside>

                <el-main>
                    
                    <el-table
                      :data="tableData"
                      style="width: 100%">
                      <el-table-column
                        prop="date"
                        label="日期"
                        width="180">
                      </el-table-column>
                      <el-table-column
                        prop="name"
                        label="姓名"
                        width="180">
                      </el-table-column>
                      <el-table-column
                        prop="address"
                        label="地址">
                      </el-table-column>
                    </el-table>

                </el-main>

            </el-container>

        </el-container>
    </div>
</template>

<script>
import { getUserByToken, getUserDetailedList } from '../../request/api';
export default {
    name: 'index',
    data() {
        return {
            tableData: [{
                  date: '2016-05-02',
                  name: '王小虎',
                  address: '上海市普陀区金沙江路 1518 弄'
                }, {
                  date: '2016-05-04',
                  name: '王小虎',
                  address: '上海市普陀区金沙江路 1517 弄'
                }, {
                  date: '2016-05-01',
                  name: '王小虎',
                  address: '上海市普陀区金沙江路 1519 弄'
                }, {
                  date: '2016-05-03',
                  name: '王小虎',
                  address: '上海市普陀区金沙江路 1516 弄'
            }]
        }
    },
    created() {
        this.getUserByToken();
        this.getUserDetailedList();
    },
    methods: {
        handleOpen(key, keyPath) {
          console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
          console.log(key, keyPath);
        },
        userInfo() {
            console.log("userInfo");
        },
        change_password(){
            console.log("change_password");
        },
        logout() {
            localStorage.removeItem('jhToken');
            this.$router.push({ path: '/login'});
        },
        getUserByToken() {
            this.$smoke_post(`/api`+`${getUserByToken}`,{}).then(res => {
                console.log(res);
                this.$store.dispatch('actionsSetName', res.data.name);
                this.$store.dispatch('actionsSetJobNumber', res.data.jobNumber);
                this.$store.dispatch('actionsSetUuid', res.data.uuid);
            })
        },
        getUserDetailedList() {
            this.$smoke_post(`/api`+`${getUserDetailedList}`,{}).then(res => {
                console.log(res);
            })
        }
    },
    mounted() {
        
    }
}
</script>

<style lang="less" scoped>
    .el-header{
        background: #545c64;
        color: #fff;
        line-height: 60px;
        padding: 0 .4rem;
    }
    .el-aside{
        .el-menu{
            height: 100%;
        }
    }
    .el-main{
        // background: grey;
    }
    .index-main{
        height: calc( 100vh - 60px);
    }
    .index-hleft{
        font-size: 24px;
        letter-spacing: .04rem;
    }
    .el-dropdown{
        float: right;
    }
    .index-hright{
        font-size: 18px;
        text-align: right;
        cursor: pointer;
        color: #fff;
    }
</style>