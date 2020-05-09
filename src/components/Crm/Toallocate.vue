<template>
    <div class="main-area">

        <el-container class="index-main">

            <el-main>

                <div class="people-title">可领取公池数据</div>

                <el-row class="people-screen">
                    <el-col :span="5">
                        <el-input v-model="form.tel" placeholder="请输入要查询的手机号" class="screen-li"></el-input>
                    </el-col>
                    <el-col :span="5">
                        <el-button type="primary" @click="getUserRPCDList">搜 索</el-button>
                    </el-col>
                </el-row>

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
                    <!-- <el-table-column prop="active" label="操作">
                      <template slot-scope="scope">
                          <el-button @click="customerDetails(scope.row)" type="text" >客户详情</el-button>
                      </template>
                    </el-table-column> -->
                </el-table>

                <el-drawer
                    :title="drawerTitle"
                    :visible.sync="drawer"
                    :direction="direction"
                    style="line-height: 30px;"
                    :before-close="handleClose">

                    <el-row>

                        <el-col :span="6" :offset="2">姓名：</el-col>
                        <el-col :span="16">{{ruleForm.name}}</el-col>

                    </el-row>

                    <el-row>

                        <el-col :span="6" :offset="2">年龄：</el-col>
                        <el-col :span="16">{{ruleForm.age}}</el-col>

                    </el-row>

                    <el-row>

                        <el-col :span="6" :offset="2">性别：</el-col>
                        <el-col :span="16">{{ruleForm.gender}}</el-col>

                    </el-row>

                    <el-row>

                        <el-col :span="6" :offset="2">所属省份：</el-col>
                        <el-col :span="16">{{ruleForm.province}}</el-col>

                    </el-row>

                    <el-row>

                        <el-col :span="6" :offset="2">所属城市：</el-col>
                        <el-col :span="16">{{ruleForm.city}}</el-col>

                    </el-row>

                    <el-row>

                        <el-col :span="6" :offset="2">电话号码2：</el-col>
                        <el-col :span="16">{{ruleForm.twoTel}}</el-col>

                    </el-row>

                    <el-row>

                        <el-col :span="6" :offset="2">工作：</el-col>
                        <el-col :span="16">{{ruleForm.work}}</el-col>

                    </el-row>

                    <el-row>

                        <el-col :span="6" :offset="2">工作年限：</el-col>
                        <el-col :span="16">{{ruleForm.workingLife}}</el-col>

                    </el-row>

                    <el-row>

                        <el-col :span="6" :offset="2">微信：</el-col>
                        <el-col :span="16">{{ruleForm.wx}}</el-col>

                    </el-row>

                    <el-row>

                        <el-col :span="6" :offset="2">取证目的：</el-col>
                        <el-col :span="16">{{ruleForm.evidencePurpose}}</el-col>

                    </el-row>

                </el-drawer>

                <el-button type="primary" @click="obtainRPCD" style="margin-top: 20px;">确认领取</el-button>

            </el-main>

        </el-container>

    </div>
</template>

<script>
import { getUserRPCDList, obtainRPCD, getClueDataDetails } from '../../request/api';
import { timestampToTime } from '../../assets/js/common';
export default {
    name: 'toAllocate',
    data() {
        return {
            form: {
                tel: "", //手机号
                userUuid: "",
            },
            list: [],
            columnList: [
                { 'prop': 'tel', 'label': '电话数据' },
                { 'prop': 'provinceCity', 'label': '所在地区' },
                { 'prop': 'examItem', 'label': '所属项目' },
                // { 'prop': 'userName', 'label': '所属坐席' },
                { 'prop': 'callDialUp', 'label': '拨通 / 拨打' },
                { 'prop': 'spread', 'label': '来源渠道' },
                { 'prop': 'createTime', 'label': '入库时间' },
                { 'prop': 'lastCallTime', 'label': '最后联系时间' },
            ],
            ruleForm: {
                age: '',
                city: "",
                evidencePurpose: '', //取证目的
                gender: '', //性别(0: 女，1：男)
                name: "",
                province: "",
                twoTel: "", //电话号码2
                work: "",
                workingLife: '', //工作年限
                wx: "",
            },
            drawerTitle: '客户详情',
            drawer: false,
            direction: 'rtl',
            fullscreenLoading: false,
        }
    },
    created() {
        this.getUserRPCDList();
        const userUuid = localStorage.getItem("userUuid");
        this.form.userUuid = userUuid;
    },
    methods: {
        customerDetails( scope ) {
            this.drawer = true;
            this.getClueDataDetails(scope.clueDataSUuid);
        },
        getClueDataDetails(id) {
            this.$smoke_post(getClueDataDetails, {
                uuid: id
            }).then(res => {
                if(res.code == 200){
                    this.ruleForm.age = res.data.age == 0 ? '' : res.data.age;
                    this.ruleForm.city = res.data.city;
                    this.ruleForm.evidencePurpose = res.data.evidencePurpose == 0 ? '' : evidencePurposeText(res.data.evidencePurpose);
                    this.ruleForm.gender = res.data.gender == 2 ? '' : genderText(res.data.gender);
                    this.ruleForm.name = res.data.name;
                    this.ruleForm.province = res.data.province;
                    this.ruleForm.twoTel = res.data.twoTel;
                    this.ruleForm.work = res.data.work;
                    this.ruleForm.workingLife = res.data.workingLife == 0 ? '' : workingLifeText(res.data.workingLife);
                    this.ruleForm.wx = res.data.wx;
                }
            })
        },
        handleClose(done) {
            done();
        },
        getUserRPCDList() {
            this.fullscreenLoading = true;
            this.$smoke_post(getUserRPCDList, this.form).then(res => {
                if(res.code == 200) {
                    setTimeout(() => {
                        this.fullscreenLoading = false;
                        res.data.list.map(sll => {
                            sll.lastCallTime = timestampToTime(Number(sll.lastCallTime));
                            sll.createTime = timestampToTime(Number(sll.createTime));
                            sll.provinceCity = sll.province == '' ? '- -' : sll.province + ' / ' + sll.city;
                            sll.callDialUp = sll.dialUpNum + '/' + sll.callNum;
                        })
                        this.list = res.data.list;
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
        obtainRPCD() {
            console.log(this.$refs.tree.selection);
            let arr = [];
            this.$refs.tree.selection.map(sll => {
                arr.push(sll.uuid);
            })

            

            this.$smoke_post(obtainRPCD, {
                uuidList: arr,
            }).then(res => {
                if(res.code == 200) {
                    if(res.data.result){
                        this.$message({
                            type: 'success',
                            message: res.data.msg + '，提交的线索数量' + res.data.allocationSize + '条' + '，实际获取的线索数量' + res.data.allocatedSize + '条'
                        });
                        this.getUserRPCDList();
                    }else{
                        this.$message({
                            type: 'error',
                            message: res.data.msg
                        });
                        this.getUserRPCDList();
                    }
                }else{
                    this.$message({
                        type: 'error',
                        message: res.msg
                    });
                }
            })
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