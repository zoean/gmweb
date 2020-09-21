<template>
    <el-main class="index-main">
        <Start></Start>
        <el-row class="people-screen">
            <el-col :span="3">
                <el-input v-model="form.tel" size="small" placeholder="请输入手机号" class="screen-li"></el-input>
            </el-col>
            <el-col :span="21">

                <el-tag 
                    v-for="(item,index) in searchList" :key="item.id"
                    :class="tag_id == item.id ? 'tag_class tag_default_class' : 'tag_default_class'"
                    type="info"
                    effect="plain"
                    @click="tagClick(item)"
                    >{{item.name}}
                </el-tag>

                <el-button style="margin-left: 20px;" type="primary" size="small" @click="consumerCallDataListClick">查 询</el-button>
            </el-col>
        </el-row>

        <el-table
            :data="list"
            v-loading="fullscreenLoading"
            style="width: 100%">

            <el-table-column prop="clueConSign" label="标记" fixed="left" width="80" class-name="table_active">
                <template slot-scope="scope">
                
                <select @change="clueConSignChange(scope.row)" v-model="scope.row.clueConSign" class="smoke-select">
                    <option
                      v-for="item in enumList['MJ-16']"
                      :key="item.name"
                      v-if="item.enable"
                      :label="item.name"
                      :value="Number(item.number)">
                    </option>
                </select>

                </template>
            </el-table-column>

            <el-table-column
              :prop="item.prop"
              :label="item.label"
              :width="item.width"
              v-for="(item, index) in columnList"
              :key="index"
              >
              <template slot-scope="scope">
                    <span>{{scope.row[item.prop]}}</span>
                    <svg-icon class="copy-tel" v-if="item.prop == 'phone'" icon-class="copy" icon-title="复制手机号码" @click="phoneCopy(scope.row)" />
              </template>
            </el-table-column>

            <el-table-column prop="active" label="操作" width="120" fixed="right" class-name="table_active">
              <template slot-scope="scope">
                <svg-icon icon-title="手机外拨" @click="phoneOut(scope.row)" icon-class="takephone" />
                <svg-icon icon-title="座机外拨" @click="seatOut(scope.row)" icon-class="landline" />
                  <!-- <el-button @click="release(scope.row)" type="text" >释放数据</el-button> -->
                <svg-icon @click="customerInfo(scope.row)" icon-title="客户信息" icon-class="members" />
                <svg-icon @click="handleAddClick(scope.row)" icon-title="添加备注" icon-class="addnotes" />
              </template>
            </el-table-column>

        </el-table>

        <el-pagination
            background
            layout="total, sizes, prev, pager, next, jumper"
            style="text-align: right; margin-top: 20px;"
            :total='form.total'
            :page-size='form.pageSize'
            :current-page="form.currentPage"
            :page-sizes="[10, 20, 30, 50, 100]"
            :hide-on-single-page="totalFlag"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
        >
        </el-pagination>

        <CustomerNotes 
            v-if="drawer"
            @changeDrawer="changeDrawer"
            :followFlag='followFlag' 
            :drawer.sync='drawer'
            :userUuid='form.userUuid'
            :schoolId='schoolId'
            :examItem='examItem'
            :clueDataSUuid='clueDataSUuid'
            :userCDARUuid='userCDARUuid'
            :comMode='comMode'
            :callLogUuid='callLogUuid'
            @fatherDataList='consumerCallDataList'
        >
        </CustomerNotes>

    </el-main>
</template>

<script>
import { 
    consumerCallDataList,
    phoneOut,
    seatOut,
    clueDataRelease,  
    copyTel,
    clueContactSign,
    enumByEnumNums
} from '../../request/api';
import { 
    timestampToTime, receiveTimeFun 
} from '../../assets/js/common';
import Start from '../../components/Share/Start';
import { MJ_16 } from '../../assets/js/data';
import CustomerNotes from '../Share/CustomerNotes';
export default {
    name: 'registered',
    data() {
        return {
            form: {
                currentPage: 1,
                pageSize: 20,
                userUuid: '',
                total: null,
                tel: '',
                dataType: '', //数据类型（1：首咨 2：回收池）
                receiveStartTime: '', //领取时间的查询开始时间（13位）
                receiveEndTime: '', //领取时间的查询结束时间（13位）
            },
            totalFlag: false,
            list: [],
            columnList: [
                { 'prop': 'phone', 'label': '手机号码', width: 150 },
                { 'prop': 'name', 'label': '姓名' },
                { 'prop': 'education', 'label': '学历' },
                { 'prop': 'workingLife', 'label': '工作年限' },
                { 'prop': 'lastCallTime', 'label': '最近一次联系时间', width: 230 },
                // { 'prop': 'dataType', 'label': '下次联系时间' },
                { 'prop': 'callDialUp', 'label': '拨通 / 拨打' },
                { 'prop': 'school', 'label': '注册平台' },
            ],
            initOptions: {},

            followFlag: false,
            drawer: false,
            clueDataSUuid: '',
            callLogUuid: '',
            comMode: '',
            schoolId: '',
            examItem: '',
            userCDARUuid: '',

            fullscreenLoading: false,

            searchList: [
                { name: '今日首咨', id: 1 },
                { name: '2~3天数据', id: 2 },
                { name: '4~7天数据', id: 3 },
                { name: '8~14天数据', id: 4 },
                { name: '14天以上数据', id: 5 },
                { name: '公海领取数据', id: 6 },
            ],
            tag_id: '',

            enumList: {}
        }
    },
    components: {
        CustomerNotes,
        Start,
    },
    created() {
        const seatDataPageSize = localStorage.getItem('seatDataPageSize');
        if(seatDataPageSize) {
            this.form.pageSize = Number(seatDataPageSize);
        }else{
            this.form.pageSize = 20;
        }
        const uuid = localStorage.getItem('userUuid');
        this.form.userUuid = uuid;
        this.consumerCallDataList();
        const initOptions = localStorage.getItem('initOptions');
        this.initOptions = JSON.parse(initOptions);
        let arr = [MJ_16];
        this.enumByEnumNums(arr);
    },
    methods: {
        enumByEnumNums(arr) {
            this.$smoke_post(enumByEnumNums, {
                numberList: arr
            }).then(res => {
                if(res.code == 200){
                    this.enumList = res.data;
                }
            })
        },
        clueConSignChange(row) {
            this.clueContactSign(row.clueConSign, row.userCDARUuid);
        },
        clueContactSign(clueConSign, userCDARUuid) {
            this.$smoke_post(clueContactSign, {
                start: clueConSign,
                userCDARUuid: userCDARUuid
            }).then(res => {
                if(res.code == 200) {
                    this.$message({
                        type: 'success',
                        message: '标记成功'
                    })
                }else{
                    this.$message({
                        type: 'error',
                        message: res.msg
                    })
                }
            })
        },
        tagClick(item){
            if(this.tag_id == item.id) {
                this.tag_id = '';
            }else{
                this.tag_id = item.id;
            }
        },
        handleCurrentChange(index) {
            this.form.currentPage = index;
            this.consumerCallDataList();
        },
        handleSizeChange(index) {
            this.form.pageSize = index;
            this.form.currentPage = 1;
            localStorage.setItem('seatDataPageSize', index);
            this.consumerCallDataList();
        },
        //客户信息
        customerInfo(row) {
            this.drawer = true;
            this.clueDataSUuid = row.clueDataSUuid;
            this.userCDARUuid = row.userCDARUuid;
            this.followFlag = false;
        },
        handleAddClick(row) {
            this.drawer = true;
            this.clueDataSUuid = row.clueDataSUuid;
            this.followFlag = true;
            this.comMode = '微信沟通';
            this.userCDARUuid = row.userCDARUuid;
            this.examItem = row.examItemId;
        },
        changeDrawer(val){
            this.drawer = val;
        },
        consumerCallDataListClick() {
            this.form.currentPage = 1;
            const obj = receiveTimeFun(this.tag_id);
            this.form.receiveStartTime = obj.receiveStartTime;
            this.form.receiveEndTime = obj.receiveEndTime;
            if(this.tag_id == 6) {
                this.form.dataType = 2;
            }else if(this.tag_id == ''){
                this.form.dataType = '';
            }else{
                this.form.dataType = 1;
            }
            this.consumerCallDataList();
        },
        consumerCallDataList() {
            this.fullscreenLoading = true;
            this.drawer = false;
            this.$smoke_post(consumerCallDataList, this.form).then(res => {
                if(res.code == 200) {
                    setTimeout(() => {
                        this.fullscreenLoading = false;
                        res.data.list.map(sll => {
                            sll.lastCallTime = timestampToTime(Number(sll.lastCallTime));
                            sll.callDialUp = sll.dialUpNum + '/' + sll.callNum;
                        })
                        this.list = res.data.list;
                        this.form.total = res.data.total;
                        this.schoolId = res.data.schoolId;
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
        release(scope) {
            let arr = [];
            arr.push(scope.userCDARUuid);
            this.$smoke_post(clueDataRelease, {
                list: arr
            }).then(res => {
                if(res.code == 200) {
                    if(res.data.result){
                        this.$message({
                            type: 'success',
                            message: '释放成功，提交的线索数量' + res.data.submitSize + '条' + '，实际释放的线索数量' + res.data.releaseSize + '条'
                        });
                        this.consumerCallDataList();
                    }else{
                        this.$message({
                            type: 'error',
                            message: res.data.msg
                        });
                        this.consumerCallDataList();
                    }
                }else{
                    this.$message({
                        type: 'error',
                        message: res.msg
                    })
                }
            })
        },
        phoneOut( scope ) {
            if(this.initOptions != undefined){
                this.$smoke_post(phoneOut, {
                    adminUin: this.initOptions.adminUin,
                    uin: this.initOptions.uin,
                    uuid: scope.userCDARUuid,
                }).then(res => {
                    if(res.code == 200){
                        if(res.data.result){
                            this.callLogUuid = res.data.callLogUuid;
                            this.clueDataSUuid = scope.clueDataSUuid;
                            this.userCDARUuid = scope.userCDARUuid;
                            this.drawer = true;
                            this.followFlag = true;
                            this.comMode = '手机外呼';
                            this.examItem = scope.examItemId;
                        }else{
                            this.$message({
                                type: 'error',
                                message: '目前服务线路忙，请稍后重试'
                            })
                        }
                    }else{
                        this.$message({
                            type: 'error',
                            message: res.msg
                        })
                    }
                })
            }else{
                this.$message({
                    type: 'error',
                    message: '请联系主管配置jq账号'
                })
            }
        },
        seatOut( scope ) {
            if(this.initOptions != undefined){
                this.$smoke_post(seatOut, {
                    adminUin: this.initOptions.adminUin,
                    uin: this.initOptions.uin,
                    uuid: scope.userCDARUuid,
                }).then(res => {
                    if(res.code == 200){
                        if(res.data.result){
                            this.callLogUuid = res.data.callLogUuid;
                            this.clueDataSUuid = scope.clueDataSUuid;
                            this.userCDARUuid = scope.userCDARUuid;
                            this.drawer = true;
                            this.followFlag = true;
                            this.comMode = '座机外呼';
                            this.examItem = scope.examItemId;
                        }else{
                            this.$message({
                                type: 'error',
                                message: '目前服务线路忙，请稍后重试'
                            })
                        }
                    }else{
                        this.$message({
                            type: 'error',
                            message: res.msg
                        })
                    }
                })
            }else{
                this.$message({
                    type: 'error',
                    message: '请联系主管配置jq账号'
                })
            }
        },
        phoneCopy(row) {
            console.log(row.clueDataSUuid);
            this.copyTel(row.clueDataSUuid);
        },
        copyTel(id) {
            this.$smoke_post(copyTel, {
                uuid: id
            }).then(res => {
                if(res.code == 200) {
                    this.$copyText(res.data).then(
		                res => {
		                    this.$message({
                                type: 'success',
                                message: '复制成功',
                            })
		                },
		                err => {
		                    this.$message({
                                type: 'error',
                                message: '复制失败',
                            })
		                }
		            )
                }else{
                    this.$message({
                        type: 'error',
                        message: res.msg
                    })
                }
            })
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
            margin-bottom: 10px;
            .screen-li{
                width: 94%;
            }
        }
    }
</style>