<template>
    <el-main class="index-main">

        <el-tabs v-model="activeName" @tab-click="tabChange">
            <el-tab-pane :label="item.orgName" :name="item.orgUuid" v-for="(item,index) in orgList" :key="index">
                
            </el-tab-pane>
        </el-tabs>

        <el-radio-group size="small" v-model="radioTime">
            <el-radio-button label="年"></el-radio-button>
            <el-radio-button label="月"></el-radio-button>
            <el-radio-button label="日"></el-radio-button>
        </el-radio-group>

        <el-row style="margin-top: 14px;">
            <el-col :span="4">
                <el-date-picker
                    style="width: 100%;"
                    size="small"
                    v-model="yearTime"
                    value-format="timestamp"
                    type="year"
                    @change="changeTime"
                    placeholder="选择年度">
                </el-date-picker>
            </el-col>

            <el-col :span="4">
                <el-button type="primary" size="small" style="margin-left: 20px;" @click="getYearListClick">查 询</el-button>
            </el-col>
        </el-row>

        
        
    </el-main>
</template>

<script>
import { 
  getManageOrgList,
  getYearList
} from '../../request/api';
import { 
  timestampToTime,
  sendStartText
} from '../../assets/js/common';
export default {
    name: 'ManagerMbo',
    data() {
        return {
            activeName: '',
            orgList: [],
            radioTime: '年',
            yearTime: '',
        }
    },
    created() {
        this.getManageOrgList();
    },
    methods: {
        getYearListClick() {
            let arr = [];
            arr.push(this.yearTime);
            this.$smoke_post(getYearList, {
                orgUuid: this.activeName,
                yearOrMonths: arr
            }).then(res => {
                if(res.code == 200) {
                    
                }else{
                    this.$message({
                        type: 'error',
                        message: res.msg
                    })
                }
            })
        },
        changeTime(val) {
            console.log(val);
        },
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