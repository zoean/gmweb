<template>
    <el-main class="index-main">

        <div class="people-title">VIP管理</div>

        <el-row class="people-screen">
            <el-col :span="5">
                <el-input v-model="form.ruleNumberName" placeholder="请输入规则编号分配组ID" class="screen-li"></el-input>
            </el-col>
            <el-col :span="5">
                <el-input v-model="form.tel" placeholder="请输入要查询的手机号" class="screen-li"></el-input>
            </el-col>
            <el-col :span="5">
                <el-button type="primary" @click="getRecoveryPoolDataList">搜 索</el-button>
            </el-col>
        </el-row>

        <el-table
            :data="list"
            style="width: 100%">
            <el-table-column
              :prop="item.prop"
              :label="item.label"
              :formatter="item.formatter"
              v-for="(item, index) in columnList"
              :key="index"
              >
            </el-table-column>
            <el-table-column prop="active" label="操作">
              <template slot-scope="scope">
                  <el-button @click="customerDetails(scope.row)" type="text" >客户详情</el-button>
              </template>
            </el-table-column>
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

    </el-main>
</template>

<script>
import { getRecoveryPoolDataList, getClueDataDetails } from '../../request/api';
import { timestampToTime, backType, workingLifeText, evidencePurposeText, genderText } from '../../assets/js/common';
export default {
    name: 'reCoverData',
    data() {
        return {
            form: {
                currentPage: 1,
                pageSize: 10,
                ruleNumberName: '', //规则编号分配组ID
                sortSet: [],
                tel: "", //手机号
                total: 0
            },
            list: [],
            columnList: [
                { 'prop': 'tel', 'label': '电话数据' },
                { 'prop': 'ruleNumberName', 'label': '地区归属' },
                { 'prop': 'callLastTime', 'label': '最后联系时间'},
                // { 'prop': 'phone', 'label': '所属坐席' },
                // { 'prop': 'phone', 'label': '通话次数' },
                // { 'prop': 'phone', 'label': '来源渠道' },
                // { 'prop': 'phone', 'label': '入库时间' },
                // { 'prop': 'phone', 'label': '最后联系时间' },
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
        }
    },
    created() {
        this.getRecoveryPoolDataList();
    },
    methods: {
        customerDetails( scope ) {
            this.drawer = true;
            this.getClueDataDetails(scope.clueDataSUuid);
        },
        getRecoveryPoolDataList() {
            this.$smoke_post(getRecoveryPoolDataList, this.form).then(res => {
                if(res.code == 200) {
                    res.data.list.map(sll => {
                        sll.callLastTime = timestampToTime(Number(sll.lastCallTime));
                    })
                    this.list = res.data.list;
                }
            })
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
    },
    mounted() {
        
    }
}
</script>

<style lang="less" scoped>
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
</style>