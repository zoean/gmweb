<template>
    <el-main class="index-main">

        <el-tabs v-model="activeName" @tab-click="tabChange">
            <el-tab-pane :label="item.orgName" :name="item.orgUuid" v-for="(item,index) in orgList" :key="index">
                
            </el-tab-pane>
        </el-tabs>
        
    </el-main>
</template>

<script>
import { 
  getManageOrgList
} from '../../request/api';
import { 
  timestampToTime,
  sendStartText
} from '../../assets/js/common';
export default {
    name: 'ManagerMbo',
    data() {
        return {
            activeName: 'first',
            orgList: [],
        }
    },
    created() {
        this.getManageOrgList();
    },
    methods: {
        getManageOrgList() {
            this.$smoke_post(getManageOrgList, {
                userId: localStorage.getItem('userUuid')
            }).then(res => {
                if(res.code == 200) {
                    this.orgList = res.data;
                    if(res.data.length != 0) {
                        this.activeName = res.data[0].orgUuid;
                    }
                }else{
                    this.$message({
                        type: 'error',
                        message: res.msg
                    })
                }
            })
        },
        tabChange(tab){
            if(tab.index == '1'){
                
            }else{
                
            }
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
            background: #fff;
            margin-bottom: .3rem;
            color: #666666;
        }
        .screen-li{
            width: 90%;
        }
    }
    // .index-main /deep/ .el-table .cell{
    //     text-align: center !important;
    // }
</style>