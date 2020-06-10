<template>
    <el-main class="index-main">
        <el-row class="people-screen">
            <el-col :span="4">
                <el-input v-model="form.name" placeholder="请输入姓名" class="screen-li" size="small"></el-input>
            </el-col>
            <el-col :span="4">
                <el-input v-model="form.tel" placeholder="请输入手机号" class="screen-li" size="small"></el-input>
            </el-col>
            <el-col :span="4">
                <el-autocomplete
                    clearable
                    size="small"
                    class="screen-li"
                    ref="autocomplete"
                    v-model="form.examItemText"
                    :fetch-suggestions="querySearch"
                    placeholder="请输入考试项目"
                    :trigger-on-focus="true"
                    @select="handleSelect"
                    @clear="autocompleteClear"
                ></el-autocomplete>
            </el-col>
            <el-col :span="4">
                <el-select v-model="form.classType" placeholder="请选择班型等级" class="screen-li" size="small">
                    <el-option
                      v-for="item in classTypeList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="4">
                <el-input v-model="form.teaName" placeholder="请输入班主任姓名" class="screen-li" size="small"></el-input>
            </el-col>

            <el-col :span="4">
                <el-button type="primary" @click="getSupStuList" size="small">查 询</el-button>
            </el-col>
            
        </el-row>

        <el-row class="people-screen" type="flex" align="middle">

            <el-col :span="4">

                <!-- <el-select v-model="form.ruleNumberName" size="small" placeholder="请选择分配组" class="screen-li" clearable>
                    <el-option
                      v-for="item in ruleNumberNameList"
                      :key="item.name"
                      :label="item.name"
                      :value="item.ruleNumberName">
                    </el-option>
                </el-select> -->

            </el-col>

            <el-col :span="4">

                

            </el-col>

            <el-col :span="16">
                <el-row type="flex" justify="end">
                    <svg-icon class="border-icon" @click="moveStudents('all', null)" icon-title="批量转移" icon-class="move" />
                </el-row>
            </el-col>

        </el-row>

        <el-table
            :data="list"
            ref="tableSelect"
            v-loading="fullscreenLoading"
            style="width: 100%">
            <el-table-column
              type="selection"
              width="45">
            </el-table-column>
            <el-table-column
              :prop="item.prop"
              :label="item.label"
              :formatter="item.formatter"
              :width="item.prop == 'seatName' ? '320px' : item.prop == 'createTime' ? '180px' : ''"
              v-for="(item, index) in columnList"
              :key="index"
              >

              <template slot-scope="scope">
                <el-tooltip effect="dark" v-if="item.prop == 'seatName'" :open-delay="500" :content="scope.row.orgNameListText" placement="top">
                    <span style="cursor: default">{{scope.row[item.prop] || '- -'}}</span>
                </el-tooltip>
                <span v-else>{{scope.row[item.prop] || '- -'}}</span>
              </template>

            </el-table-column>
            <el-table-column prop="active" label="操作" width="50">
              <template slot-scope="scope">
                <svg-icon @click="moveStudentOne(scope.row)" icon-title="转移学员" icon-class="move" />
              </template>
            </el-table-column>
        </el-table>

        <el-pagination
            background
            layout="total, sizes, prev, pager, next, jumper"
            style="text-align: right; margin-top: 20px;"
            :total='form.total'
            :page-size='form.pageSize'
            :current-page='form.currentPage'
            :page-sizes="[10, 20, 30]"
            :hide-on-single-page="totalFlag"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
        >
        </el-pagination>

        <el-drawer
            title="选择转移接受方"
            :visible.sync="drawer"
            :direction="direction"
            :before-close="handleClose"
        >
            <span class="bullets"></span>

        <el-tag 
            v-for="(item,index) in teacherMoveList" :key="index"
            style="margin-left: 20px; cursor: pointer; margin-top: 20px;"
            @click="tagClick(item)"
            >{{item.classTeacherName}}
        </el-tag>

        </el-drawer>

    </el-main>
</template>

<script>
import { 
    getSupStuList,
    getExamBasic,
    getTransferStuCTList,
    transferStu
} from '../../request/api';
import { 
    timestampToTime, 
    genderText,
    classTypeString,
    getTextByJs,
} from '../../assets/js/common';
export default {
    name: 'allStudents',
    data() {
        return {
            form: {
                currentPage: 1,
                pageSize: 10,
                classType: '',
                examItemId: '',
                examItemText: '',
                name: '',
                teaName: '',
                sortSet: [],
                tel: "", //手机号
                total: null
            },
            list: [],
            totalFlag: false,
            columnList: [
                { 'prop': 'name', 'label': '姓名' },
                { 'prop': 'tel', 'label': '手机号码' },
                { 'prop': 'examItemName', 'label': '考试项目' },
                { 'prop': 'classType', 'label': '班型' },
                { 'prop': 'school', 'label': '分校' },
                { 'prop': 'classTea', 'label': '班主任' },
                { 'prop': 'seatName', 'label': '成单坐席' },
            ],
            drawer: false,
            direction: 'rtl',
            restaurants: [],
            classTypeList: [
                { value: 0, label: '普通班' },
                { value: 1, label: '高端班' },
            ],
            fullscreenLoading: false,
            teacherMoveList: [],
            teaStuList: [],
        }
    },
    created() {
        this.getSupStuList();
        this.getExamBasic();
    },
    methods: {
        handleCurrentChange(index) {
            this.form.currentPage = index;
            this.getSupStuList();
        },
        handleSizeChange(index) {
            this.form.pageSize = index;
            this.form.currentPage = 1;
            this.getSupStuList();
        }, 
        getExamBasic() {
            let arr;
            this.$smoke_get(getExamBasic, {}).then(res => {
                console.log(res);
                arr = JSON.parse(JSON.stringify(res.data).replace(/name/g,"value"));
                this.restaurants = arr;
            })
        },
        querySearch(queryString, cb) {
            var restaurants = this.restaurants;
            console.log(restaurants);
            var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        createFilter(queryString) {
            return (restaurant) => {
              return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) > -1);
            };
        },
        handleSelect(item) {
            console.log(item);
            this.form.examItemId = item.id;
            this.form.examItemText = item.value;
        },
        autocompleteClear() {
            this.$nextTick(() => {
                this.$refs.autocomplete.$children
                    .find(c => c.$el.className.includes('el-input'))
                    .blur();
                this.form.examItem = '';
                this.$refs.autocomplete.focus();
            })
        },
        getSupStuList() {
            this.fullscreenLoading = true;
            this.$smoke_post(getSupStuList, this.form).then(res => {
                if(res.code == 200) {
                    setTimeout(() => {
                        this.fullscreenLoading = false;
                        res.data.list.map(sll => {
                            sll.classType = classTypeString(sll.classType);
                            if(sll.seatOrgName && sll.seatName) {
                                sll.seatName = sll.seatPOrgName? sll.seatPOrgName + ' ' + sll.seatOrgName + ' ' + sll.seatName : sll.seatOrgName + ' ' + sll.seatName;
                            }else{
                                sll.seatName = '';
                            }
                            sll.orgNameListText = getTextByJs(sll.orgNameList.reverse()); //reverse()倒序排列
                        })
                        this.list = res.data.list;
                        this.form.total = res.data.total;
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
        handleClose(done) {
            this.teaStuList = [];
            done();
        },
        moveStudents(type, id) {
            let arr = [];
            let brr = [];

            this.$refs.tableSelect.selection.map(sll => {
                if(sll.classType == '高端班') {
                    sll.classType = 1;
                }else{
                    sll.classType = 0;
                }
                arr.push({classType: sll.classType, examItemId: sll.examItemId});
                brr.push({teaUuid: sll.classTeaUuid, uuid: sll.uuid});
            })
            if(arr.length == 0) {
                this.$message({
                    type: 'error',
                    message: '请您先勾选您要转移的学员'
                });
            }else{
                this.drawer = true;
                console.log(arr);
                this.getTransferStuCTList(arr);
                this.teaStuList = brr;
            }
        },
        moveStudentOne(row) {
            let arr = [];
            let brr = [];
            arr.push({classType: row.classType, examItemId: row.examItemId});
            brr.push({teaUuid: row.classTeaUuid, uuid: row.uuid});
            this.teaStuList = brr;
            this.drawer = true;
            this.getTransferStuCTList(arr);
        },
        getTransferStuCTList(arr) {
            this.$smoke_post(getTransferStuCTList, {
                list: arr
            }).then(res => {
                if(res.code == 200) {
                    this.teacherMoveList = res.data;
                }
            })
        },
        tagClick(item) {
            this.$confirm('确认转移学员吗？')
            .then(_ => {
              this.transferStu(item.classTeacherUuid);
            })
            .catch(_ => {});
        },
        transferStu(classTeacherUuid) {
            this.$smoke_post(transferStu, {
                teaStuList: this.teaStuList,
                teaUuid: classTeacherUuid
            }).then(res => {
                if(res.code == 200) {
                    this.$message({
                        type: 'success',
                        message: '转移成功'
                    });
                    setTimeout(() => {
                        this.drawer = false;
                    },300)
                }else{
                    this.$message({
                        type: 'error',
                        message: res.msg
                    });
                    setTimeout(() => {
                        this.drawer = false;
                    },300)
                }
            })
        }
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
    }
</style>