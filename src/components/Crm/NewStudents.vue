<template>
    <el-main class="index-main">

        <el-row style="margin-bottom: 10px;">

            <el-col :span="4" style="float: right; text-align: right;"><el-button type="primary" size="small" @click="classTeaGetWaitStudent('all', null)">确认领取</el-button></el-col>
            
            <el-col :span="4">
                <el-input v-model="form.tel" size="small" placeholder="请输入手机号" class="screen-li"></el-input>
            </el-col>

            <el-col :span="4" style="margin-left: 20px;">
                <el-button type="primary" size="small" @click="getWaitStudentList">查 询</el-button>
            </el-col>

        </el-row>

        <el-tabs v-model="classUuidDefault" @tab-click="handleClassTabClick">
            <el-tab-pane :label="item.text" :name="item.uuid" v-for="(item,index) in tabsList" :key="index"></el-tab-pane>
        </el-tabs>

        <el-table
            :data="list"
            ref="tree"
            :key="Math.random()"
            v-loading="fullscreenLoading"
            @sort-change="sortChange"
            style="width: 100%">
            <el-table-column
              type="selection"
              width="45">
            </el-table-column>
            <el-table-column
              :prop="item.prop"
              :label="item.label"
              :width="item.prop == 'seatName' ? '250px' : item.prop == 'createTime' ? '180px' : ''"
              v-for="(item, index) in columnList"
              :sortable="item.prop == 'createTime' ? 'custom' : item.prop == 'school' ? 'custom' : false"
              :key="index"
              >
            </el-table-column>
            <el-table-column prop="active" label="操作" width="50">
              <template slot-scope="scope">
                  
                <el-popconfirm
                    confirmButtonText='确定'
                    cancelButtonText='取消'
                    icon="el-icon-info"
                    placement="top"
                    title="确认领取此学员吗？"
                    :hideIcon='true'
                    @onConfirm="receiveClick(scope.row)"
                  >
                    <svg-icon slot="reference" icon-title="领取" icon-class="collect" />
                </el-popconfirm>
                
              </template>
            </el-table-column>
        </el-table>

        <el-pagination
            background
            layout="total, sizes, prev, pager, next, jumper"
            :total='form.total'
            :page-size='form.pageSize'
            :current-page='form.currentPage'
            :page-sizes="[10, 20, 30]"
            :hide-on-single-page="totalFlag"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
        >
        </el-pagination>

    </el-main>
</template>

<script>
import { getWaitStudentList, classTeaGetWaitStudent, getClassTeaClassWait } from '../../request/api';
import { timestampToTime, classTypeString, orderTypeText, sortTextNum } from '../../assets/js/common';
export default {
    name: 'newStudents',
    data() {
        return {
            form: {
                currentPage: 1,
                pageSize: 10,
                sortSet: [{'createTime': 'DESC'},],
                total: null,
                classUuid: '',
                tel: ''
            },
            totalFlag: false,
            list: [],
            columnList: [
                { 'prop': 'name', 'label': '姓名' },
                { 'prop': 'tel', 'label': '手机号码' },
                // { 'prop': 'clueUserUuid', 'label': '所属坐席' },
                { 'prop': 'examItemName', 'label': '考试项目' },
                { 'prop': 'classType', 'label': '班型' },
                // { 'prop': 'customerId', 'label': '客户id' },    
                // { 'prop': 'orderId', 'label': '订单id' },
                // { 'prop': 'orderNum', 'label': '订单编号' },
                // { 'prop': 'orderType', 'label': '订单类型' },
                { 'prop': 'school', 'label': '分校' },
                { 'prop': 'seatName', 'label': '成单坐席' },
                { 'prop': 'createTime', 'label': '报名时间' },
            ],
            tabsList: [],
            classUuidDefault: '',
            fullscreenLoading: false,
            sortSetList: [
                {'createTime': ''},
                {'school': ''},
            ],
            handleCurrentUuid: ''
        }
    },
    created() {
        this.getClassTeaClassWait();
    },
    methods: {
        sortChange(data) {
            this.form.sortSet = [];
            const id = sortTextNum(data.prop);
            if(data.order == "descending"){
                this.sortSetList[id][data.prop] = 'DESC';
            }else if(data.order == "ascending"){
                this.sortSetList[id][data.prop] = 'ASC';
            }
            this.form.sortSet.push(this.sortSetList[id]);
            this.classUuidDefault = this.handleCurrentUuid;
            this.getWaitStudentList();
        },
        receiveClick( scope ) {
            console.log(scope);
            this.classTeaGetWaitStudent('click', scope.uuid)
        },
        getClassTeaClassWait() {
            this.fullscreenLoading = true;
            this.$smoke_get(getClassTeaClassWait,{
                classTeaUuid: ''
            }).then(res => {
                if(res.code == 200) {

                    setTimeout(() => {
                        this.fullscreenLoading = false;
                        if(res.data.length != 0) {
                            res.data.map(sll => {
                                sll.text = sll.examItem + ' - ' + classTypeString(sll.classType) + ' (' + sll.num + ') ';
                            })
                            this.tabsList = res.data;
                            this.form.classUuid = res.data[0].uuid;
                            this.classUuidDefault = res.data[0].uuid;
                            this.getWaitStudentList();
                        }
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
        getWaitStudentList() {
            this.$smoke_post(getWaitStudentList, this.form).then(res => {
                if(res.code == 200) {
                    res.data.list.map(sll => {
                        sll.createTime  = timestampToTime(Number(sll.createTime));
                        sll.classType = classTypeString(sll.classType);
                        sll.orderType = orderTypeText(sll.orderType);
                        sll.seatName = sll.seatPOrgName + ' ' + sll.seatOrgName + ' ' + sll.seatName;
                    })
                    this.list = res.data.list;
                    this.form.total = res.data.total;
                }
            })
        },
        handleClassTabClick(tab, event) {
            console.log(tab);
            this.handleCurrentUuid = this.form.classUuid = tab.name;
            this.form.currentPage = 1;
            this.form.pageSize = 10;
            this.getWaitStudentList();
        },
        classTeaGetWaitStudent(type, id) {
            console.log(this.$refs.tree.selection);
            let arr = [];

            if(type == 'all') {
                this.$refs.tree.selection.map(sll => {
                    arr.push(sll.uuid);
                })
                if(arr.length == 0) {
                    this.$message({
                        type: 'error',
                        message: '请您先勾选您要领取的学员'
                    });
                }else{
                    this.$confirm('确认领取？')
                    .then(_ => {
                      this.requestClassTeaGetWaitStudent(arr);
                    })
                    .catch(_ => {});
                }
            }else{
                arr.push(id);
                this.requestClassTeaGetWaitStudent(arr);
            }
        },
        requestClassTeaGetWaitStudent(arr) {
            this.$smoke_post(classTeaGetWaitStudent, {
                uuidList: arr,
            }).then(res => {
                if(res.code == 200) {
                    this.$message({
                        type: 'success',
                        message: '成功领取' + res.data.length + '条'
                    });
                    this.getWaitStudentList();
                }else{
                    this.$message({
                        type: 'error',
                        message: res.msg
                    });
                }
            })
        },
        handleCurrentChange(index) {
            this.form.currentPage = index;
            this.getWaitStudentList();
        },
        handleSizeChange(index) {
            this.form.pageSize = index;
            this.getWaitStudentList();
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
        .people-screen{
            margin-bottom: 16px;
            .screen-li{
                width: 90%;
            }
        }
        .el-pagination{
            text-align: right;
            margin-top: .4rem;
        }
    }
</style>