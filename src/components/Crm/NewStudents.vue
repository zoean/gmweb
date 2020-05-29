<template>
    <el-main class="index-main">

        <el-row>
            <el-button type="primary" size="small" @click="classTeaGetWaitStudent('all', null)" style="float: right;">确认领取</el-button>
        </el-row>

        <el-tabs v-model="classUuidDefault" @tab-click="handleClassTabClick">
            <el-tab-pane :label="item.text" :name="item.uuid" v-for="(item,index) in tabsList" :key="index"></el-tab-pane>
        </el-tabs>

        <el-table
            :data="list"
            ref="tree"
            v-loading="fullscreenLoading"
            style="width: 100%">
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
            <el-table-column prop="active" label="操作" width="50">
              <template slot-scope="scope">
                <svg-icon @click="receiveClick(scope.row)" icon-title="领取" icon-class="collect" />
              </template>
            </el-table-column>
        </el-table>

        <el-pagination
            background
            layout="total, sizes, prev, pager, next, jumper"
            :total='form.total'
            :page-size='form.pageSize'
            :page-sizes="[10, 20, 30]"
            :hide-on-single-page="totalFlag"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
        >
        </el-pagination>

    </el-main>
</template>

<script>
import { getWaitStudentList, classTeaGetWaitStudent, getClassTeaClass } from '../../request/api';
import { timestampToTime, classTypeString, orderTypeText } from '../../assets/js/common';
export default {
    name: 'newStudents',
    data() {
        return {
            form: {
                currentPage: 1,
                pageSize: 10,
                sortSet: [],
                total: null,
                classUuid: '',
            },
            totalFlag: false,
            list: [],
            columnList: [
                // { 'prop': 'tel', 'label': '姓名' },
                { 'prop': 'tel', 'label': '手机号码' },
                // { 'prop': 'clueUserUuid', 'label': '所属坐席' },
                { 'prop': 'examItemName', 'label': '考试项目' },
                { 'prop': 'classType', 'label': '班型' },
                // { 'prop': 'customerId', 'label': '客户id' },    
                // { 'prop': 'orderId', 'label': '订单id' },
                // { 'prop': 'orderNum', 'label': '订单编号' },
                // { 'prop': 'orderType', 'label': '订单类型' },
                // { 'prop': 'school', 'label': '分校' },
                { 'prop': 'createTime', 'label': '报名时间' },
            ],
            tabsList: [],
            classUuidDefault: '',
            fullscreenLoading: false,
        }
    },
    created() {
        this.getClassTeaClass();
    },
    methods: {
        receiveClick( scope ) {
            console.log(scope);
            this.classTeaGetWaitStudent('click', scope.uuid)
        },
        getClassTeaClass() {
            this.fullscreenLoading = true;
            this.$smoke_get(getClassTeaClass,{
                classTeaUuid: ''
            }).then(res => {
                if(res.code == 200) {

                    setTimeout(() => {
                        this.fullscreenLoading = false;
                        if(res.data.length != 0) {
                            res.data.map(sll => {
                            sll.text = sll.examItem + ' - ' + classTypeString(sll.classType);
                            })
                            this.tabsList = res.data;
                            this.getWaitStudentList();
                            this.form.classUuid = res.data[0].uuid;
                            this.classUuidDefault = res.data[0].uuid;
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
                    })
                    this.list = res.data.list;
                    this.form.total = res.data.total;
                }
            })
        },
        handleClassTabClick(tab, event) {
            console.log(tab);
            this.form.classUuid = tab.name;
            this.form.currentPage = 1;
            this.form.pageSize = 10;
            this.getWaitStudentList();
        },
        classTeaGetWaitStudent(type, id) {
            console.log(this.$refs.tree.selection);
            let arr = [];
            if(type == 'click') {
                arr.push(id);
            }else{
                this.$refs.tree.selection.map(sll => {
                    arr.push(sll.uuid);
                })
            }
            if(arr.length == 0) {
                this.$message({
                    type: 'error',
                    message: '请您先勾选您要领取的学员'
                });
            }else{
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
            }
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