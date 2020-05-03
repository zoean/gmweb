<template>
    <div class="main-area">

        <el-container class="index-main">

            <el-main>

                <div class="people-title">新学员管理</div>

                <el-tabs v-model="classUuidDefault" @tab-click="handleClassTabClick">
                    <el-tab-pane :label="item.text" :name="item.uuid" v-for="(item,index) in tabsList" :key="index"></el-tab-pane>
                </el-tabs>

                <el-table
                    :data="list"
                    ref="tree"
                    v-loading="fullscreenLoading"
                    style="width: calc( 100vw - 3.8rem)">
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
                          <el-button @click="receiveClick(scope.row)" type="text" >领取</el-button>
                      </template>
                    </el-table-column>
                </el-table>

                <el-button type="primary" @click="classTeaGetWaitStudent('all', null)" style="margin-top: 20px;">确认领取</el-button>

            </el-main>

        </el-container>

    </div>
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
                total: 0,
                classUuid: '',
            },
            list: [],
            columnList: [
                { 'prop': 'tel', 'label': '电话数据' },
                // { 'prop': 'clueUserUuid', 'label': '所属坐席' },
                { 'prop': 'examItemName', 'label': '考试项目' },
                { 'prop': 'classType', 'label': '班型' },
                // { 'prop': 'customerId', 'label': '客户id' },    
                { 'prop': 'orderId', 'label': '订单id' },
                // { 'prop': 'orderNum', 'label': '订单编号' },
                { 'prop': 'orderType', 'label': '订单类型' },
                { 'prop': 'school', 'label': '分校' },
                { 'prop': 'createTime', 'label': '创建时间' },
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
            this.$smoke_get(getClassTeaClass,{}).then(res => {
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
                }
            })
        },
        handleClassTabClick(tab, event) {
            console.log(tab);
            this.form.classUuid = tab.name;
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
        }
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
                height: 40px;
                line-height: 40px;
                text-align: center;
                font-size: 15px;
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