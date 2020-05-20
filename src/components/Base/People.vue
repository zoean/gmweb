<template>
    <el-main class="index-main">
        <el-row class="people-screen">
            <el-col :span="4">
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
            <el-col :span="4">
                <el-select v-model="roleUuidText" placeholder="请选择角色" @change='handleRoleUuidChange' class="screen-li" clearable>
                    <el-option
                      v-for="item in roleOptions"
                      :key="item.uuid"
                      :label="item.name"
                      :value="item.uuid">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="4">
                <el-select v-model="jobStatusText" placeholder="请选择员工状态" @change='handleJobStatusChange' class="screen-li" clearable>
                    <el-option
                      v-for="item in jobStatusOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="5">
                <el-date-picker
                    clearable
                    v-model="dataPicker"
                    :default-time="['00:00:00', '23:59:59']"
                    type="daterange"
                    range-separator="至"
                    @change="datePickerChange"
                    start-placeholder="入职开始日期"
                    end-placeholder="入职结束日期">
                </el-date-picker>
            </el-col>
        </el-row>

        <el-row class="people-screen">
            <el-col :span="4">
                <el-input v-model="screenForm.name" placeholder="请输入要查询的姓名" class="screen-li"></el-input>
            </el-col>
            <el-col :span="4">
                <el-input v-model="screenForm.accountNumber" placeholder="请输入要查询的手机号" class="screen-li"></el-input>                            
            </el-col>
            <el-col :span="5">
                <el-button type="primary" @click="smoke_search">搜 索</el-button>
            </el-col>
            <el-col :span="11">
                <el-button type="primary" class='smoke-fr' @click="smoke_clear">清 空 条 件</el-button>
                <el-button v-if="exportPeople" type="primary" class='smoke-fr' style="margin-right: 20px;" @click="export_Staff">导出员工</el-button>
            </el-col>
        </el-row>
        
        <el-table
          :data="userList"
          @sort-change="sortChange"
          v-loading="fullscreenLoading"
          style="width: 99.9%">
          <el-table-column
            :prop="item.prop"
            :label="item.label"
            v-for="(item, index) in columnList"
            :sortable="item.prop == 'jobNumber' ? 'custom' : item.prop == 'name' ? 'custom' : item.prop == 'hiredDate' ? 'custom' : item.prop == 'jobStatus' ? 'custom' : false"
            :key="index"
            >
            <template v-if="item.prop=='jobStatus'">
                <p class="job-status">
                    <span v-if="userList[index][item.prop] == '在职'" class="on-job"></span>
                    <span v-else class="quit"></span>
                    {{userList[index][item.prop]}}
                </p>
            </template>
          </el-table-column>
          <el-table-column prop="active" label="操作" v-if="peopleEdit || dataPermiss">
            <template slot-scope="scope">
                <el-button v-if="peopleEdit" @click="handleEditClick(scope.row)" type="text">编辑</el-button>
                <el-button v-if="dataPermiss" @click="handlePermissClick(scope.row)" type="text">数据权限</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
            background
            layout="total, sizes, prev, pager, next, jumper"
            :total='total'
            :page-size='screenForm.pageSize'
            :page-sizes="[10, 20, 30]"
            :hide-on-single-page="totalFlag"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
        >
        </el-pagination>

    </el-main>
</template>

<script>
import { getUserDetailedList, getRoleList, getOrgSubsetByUuid, exportUserDetailedList } from '../../request/api';
import { getTextByJs, getTextByState, sortTextNum } from '../../assets/js/common'
export default {
    name: 'people',
    data() {
        return {
            userList: [],
            columnList: [
                { 'prop': 'jobNumber', 'label': '员工工号' },
                { 'prop': 'name', 'label': '姓名' },
                { 'prop': 'accountNumber', 'label': '手机号' },
                { 'prop': 'jobStatus', 'label': '状态' },
                { 'prop': 'orgUuidList', 'label': '部门' },
                { 'prop': 'roleUuidList', 'label': '角色' },
                { 'prop': 'hiredDate', 'label': '入职时间' },
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
                jobStatus: '', // 状态选择value
                name: '', //姓名
                orgUuidList: [], //组织唯一标识集合
                pageSize: 10, //单页请求的数量
                roleUuid: '', //角色唯一标识
                sortSet: [], //排序集合
                startHiredDate: '',
                endHiredDate: '',
            },
            dataPicker: [],
            sortSetList: [
                {'jobNumber': ''},
                {'name': ''},
                {'hiredDate': ''},
                {'jobStatus': ''},
            ],
            fullscreenLoading: false,
            peopleEdit: null,
            dataPermiss: null,
            exportPeople: null,
        }
    },
    created() {
        this.getUserDetailedList();
        this.getRoleList();
        this.getOrgSubsetByUuid();
        let buttonMap = JSON.parse(localStorage.getItem("buttonMap"));
        console.log(buttonMap);
        this.peopleEdit = buttonMap.peopleEdit;
        this.dataPermiss = buttonMap.dataPermiss;
        this.exportPeople = buttonMap.exportPeople;
    },
    methods: {
        sortChange(data) {
            console.log(data);
            this.screenForm.sortSet = [];
            const id = sortTextNum(data.prop);
            if(data.order == "descending"){
                this.sortSetList[id][data.prop] = 'DESC';
            }else if(data.order == "ascending"){
                this.sortSetList[id][data.prop] = 'ASC';
            }
            this.screenForm.sortSet.push(this.sortSetList[id]);
            this.getUserDetailedList();
        },
        datePickerChange(value) {
            console.log(value);
            if (value == null) {
                this.screenForm.startHiredDate = '';
                this.screenForm.endHiredDate = '';
            }else{
                this.screenForm.startHiredDate = value[0].getTime()/1000;
                this.screenForm.endHiredDate = value[1].getTime()/1000;
            }
        },
        export_Staff() {
            // console.log(this.screenForm.orgUuidList);

            let str = '';

            this.screenForm.sortSet.map(sll => {
                for(var key in sll){
                    str = key + '-' + sll[key]
                }
            })

            if(this.screenForm.orgUuidList[0] == undefined){
                this.screenForm.orgUuidList[0] = '';
            }
            const href = 'https://testgm.jhwx.com' + exportUserDetailedList +
            '?jobStatus=' + this.screenForm.jobStatus +
            '&accountNumber=' + this.screenForm.accountNumber + 
            '&name=' + this.screenForm.name + 
            '&roleUuid=' + this.screenForm.roleUuid + 
            '&startHiredDate=' + this.screenForm.startHiredDate +
            '&endHiredDate=' + this.screenForm.endHiredDate + 
            '&sortSet=' + str + 
            '&orgUuidList=' + this.screenForm.orgUuidList[0];
            console.log(href);

            // this.$smoke_get(exportUserDetailedList, {
            //     jobStatus: this.screenForm.jobStatus,
            //     accountNumber: this.screenForm.accountNumber,
            //     name: this.screenForm.name,
            //     roleUuid: this.screenForm.roleUuid,
            //     startHiredDate: this.screenForm.startHiredDate,
            //     endHiredDate: this.screenForm.endHiredDate,
            //     sortSet: str,
            //     orgUuidList: this.screenForm.orgUuidList[0],
            //     responseType: 'blob'
            // }).then(res => {
            //     const blob = new Blob([res.data], { type: 'application/ms-excel;charset=utf-8' });
            //     let url = window.URL.createObjectURL(blob);
            //     let link = document.createElement('a');
            //     link.style.display = 'none';
            //     link.href = url;
            //     link.download = '员工管理.xlsx'; 
            //     document.body.appendChild(link);
            //     link.click();  //a标签自动触发点击事件
            //     document.body.removeChild(link);
            // })

            window.open(href, '_blank');

        },
        handleEditClick(row) {
            console.log(row);
            this.$router.push({
                path: '/base/people/change',
                query: {
                    uuid: row.uuid
                }
            })
        },
        handlePermissClick(row) {
            this.$router.push({
                path: '/base/people/permiss',
                query: {
                    uuid: row.uuid
                }
            })
        },
        handleRoleUuidChange(value) {
            console.log(value);
            this.screenForm.roleUuid = value;
            this.screenForm.currentPage = 1;
            this.getUserDetailedList();
        },
        handleJobStatusChange(value) {
            console.log(value);
            this.screenForm.jobStatus = value;
            this.screenForm.currentPage = 1;
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
            this.screenForm.currentPage = 1;
            this.getUserDetailedList();
        },
        getUserDetailedList() {
            this.fullscreenLoading = true;
            this.$smoke_post(getUserDetailedList,this.screenForm).then(res => {
                console.log(res);
                if(res.code == 200) {
                    setTimeout(() => {
                        this.fullscreenLoading = false;
                        this.total = res.data.total;
                        // 用户列表
                        res.data.list.map(data => {
                            data.orgUuidList = getTextByJs(data.orgUuidList);
                            data.roleUuidList = getTextByJs(data.roleUuidList);
                            data.jobStatus = getTextByState(data.jobStatus);
                            data.hiredDate = data.hiredDate.split(" ")[0];
                        })
                        this.userList = res.data.list;
                    }, 300);
                }else{
                    setTimeout(() => {
                        this.fullscreenLoading = false;
                        this.$message({
                            type: 'error',
                            message: res.msg
                        })
                    }, 300)
                }
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
            this.screenForm.currentPage = 1;
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
            this.screenForm.currentPage = 1;
            this.getUserDetailedList();
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
            height: 40px;
            line-height: 40px;
            text-align: center;
            font-size: 15px;
            background: #fff;
            margin-bottom: .3rem;
            color: #666666;
            font-weight: bold;
        }
        .people-screen{
            margin-bottom: .3rem;
            .screen-li{
                width: 90%;
            }
        }
        /deep/ .el-table{
            .el-table__body{
                .job-status{
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-start;
                    align-items: center;
                    span{
                        width:5px;
                        height: 5px;
                        display:inline-block; 
                        border-radius: 50%; 
                        margin-right: 10px;
                    }
                    span.on-job{                        
                        background: #35CE8F; 
                    }
                    span.quit{
                        background: #FF4D4F;
                    }
                }
            }
        }
    }
    .el-pagination{
        text-align: right;
        margin-top: .4rem;
    }
/* //element-ui table的去除右侧滚动条的样式 */
::-webkit-scrollbar {
    width: 8px;
    height: 1px;
}
    /* // 滚动条的滑块 */
::-webkit-scrollbar-thumb {
    background-color: #a1a3a9;
    border-radius: 0px;
    border-radius: 8px;
}
</style>