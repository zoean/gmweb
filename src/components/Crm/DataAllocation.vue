<template>
    <div class="dataAllocation">

        <el-container class="index-main">

            <el-main>

                <div class="people-title">分配引擎配置</div>

                <el-row style="margin-bottom: 20px;" v-if="addDataAllocation">

                    <el-col style="width: 140px;"><el-button style="width: 90%;" type="primary" @click="addAlloZu">添加分配组</el-button></el-col>

                </el-row>

                <el-table
                    :data="dataAlloList"
                    v-loading="fullscreenLoading"
                    style="width: calc( 100vw - 3.8rem)"
                >
                    <el-table-column
                      :prop="item.prop"
                      :label="item.label"
                      :width="item.label == '分配组' ? '190px' : ''"
                      v-for="(item, index) in columnList1"
                      :key="index"
                      >
                    </el-table-column>

                    <el-table-column prop="active" label="操作" width="400px">
                      <template slot-scope="scope">
                          <el-button v-if="editDataAllocation" @click="handleUpdataClick(scope.row)" type="text" >修改</el-button>
                          <el-popover
                            placement="top"
                            width="200"
                            trigger="click"
                            :ref="`popover-${scope.$index}`"
                            >
                            <p style="margin-bottom: .2rem;">确定要删除此分配组吗？</p>
                            <div style="text-align: right; margin: 0">
                              <el-button size="mini" type="text" @click="scope._self.$refs[`popover-${scope.$index}`].doClose()">取消</el-button>
                              <el-button type="primary" size="mini" @click="handleDeleteClick(scope)">确定</el-button>
                            </div>
                            <el-button v-if="delDataAllocation" slot="reference" type="text"  style="margin-left: .2rem;">删除</el-button>
                          </el-popover>
                          <el-button v-if="addDataAllocationPeople" @click="handleAddClick(scope.row)" type="text"  style="margin-left: .2rem;">配置组员</el-button>
                          <el-button v-if="addDataAllocationLink" @click="createLinksClick(scope.row)" type="text"  style="margin-left: .2rem;">生成推广链接</el-button>
                          <el-button v-if="scope.row.setFlag && oneKeyPush" @click="handleOneKeyClick(scope.row)" type="text"  style="margin-left: .2rem;">一键分配</el-button>
                      </template>
                    </el-table-column>

                </el-table>

                <el-pagination
                    background
                    layout="total, sizes, prev, pager, next, jumper"
                    style="text-align: right; margin-top: 20px;"
                    :total='dataAlloForm.total'
                    :page-size='dataAlloForm.pageSize'
                    :page-sizes="[10, 20, 30]"
                    :hide-on-single-page="totalFlag"
                    @current-change="handleCurrentChange"
                    @size-change="handleSizeChange"
                >
                </el-pagination>

                <el-drawer
                    :title="drawerTitle1"
                    :visible.sync="drawerFlag1"
                    :direction="direction"
                    size="40%"
                    :before-close="handleClose">
                    
                    <div style="border: 1px dashed #ccc; padding: .4rem; margin: .2rem;">

                        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
                        
                            <el-form-item label="分配组名" prop="name">
                                <el-input v-model="ruleForm.name" placeholder="请输入分配组名"></el-input>
                            </el-form-item>

                            <el-form-item label="分配组描述" prop="describe">
                                <el-input v-model="ruleForm.describe" placeholder="请输入分配组描述"></el-input>
                            </el-form-item>

                            <el-form-item label="分校平台" prop="schoolId">

                                <el-select v-model="ruleForm.schoolId" placeholder="请选择分校平台" :disabled="drawerTitle1.indexOf('编辑') != -1 ? true : false">
                                    <el-option
                                      v-for="item in schoolList"
                                      :key="item.id"
                                      :label="item.name"
                                      :value="item.id">
                                    </el-option>
                                </el-select>
                                
                            </el-form-item>

                            <el-form-item label="状态" prop="state">
                              
                                <el-radio v-model="ruleForm.state" :label="1">开启</el-radio>
                                <el-radio v-model="ruleForm.state" :label="0">关闭</el-radio>

                            </el-form-item>

                            <el-form-item label="溢出量再分配" prop="dayList">
                              
                                <el-select v-model="ruleForm.dayList" multiple placeholder="请选择">
                                    <el-option
                                      v-for="item in dateList"
                                      :key="item.value"
                                      :label="item.label"
                                      :value="item.value">
                                    </el-option>
                                </el-select>

                            </el-form-item>

                            <el-form-item>
                                <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
                                <el-button @click="quxiao">取消</el-button>
                            </el-form-item>

                        </el-form>

                    </div>

                </el-drawer>

                <el-drawer
                    :title="drawerTitle2"
                    :visible.sync="drawerFlag2"
                    :direction="direction"
                    size="50%"
                    :before-close="handleClose">
                    
                    <div style="border: 1px dashed #ccc; padding: .4rem; margin: .2rem;">

                        <Tree @childFn="parentFn" :groupId='groupId' :schoolId='schoolId' v-if="sonRefresh" @getDataAllocationRulesList="getDataAllocationRulesList"></Tree>

                    </div>

                </el-drawer>

                <el-drawer
                    :title="drawerTitleLink"
                    :visible.sync="drawerFlagLink"
                    :direction="direction"
                    :before-close="handleClose">
                    
                    <div>

                        <el-form :model="ruleFormLink" :rules="rulesLink" ref="ruleFormLink" class="demo-ruleForm">

                            <el-form-item label="分配规则" prop="ruleid">
                              
                                <el-input v-model="ruleFormLink.ruleName" readonly class="borderNone" size="small"></el-input>

                            </el-form-item>


                            <el-form-item label="考试方向" prop="projectId">
                              
                                <el-autocomplete
                                    class="inline-input"
                                    style="width: 100%;"
                                    v-model="ruleFormLink.projectText"
                                    :fetch-suggestions="querySearch"
                                    placeholder="请输入内容"
                                    :trigger-on-focus="true"
                                    @select="handleSelect"
                                    size="small"
                                ></el-autocomplete>

                            </el-form-item>

                            <el-form-item label="来源渠道" prop="spread">
                              
                                <el-select v-model="ruleFormLink.spread" placeholder="请选择来源渠道" size="small">
                                    <el-option
                                      v-for="item in enumList['MJ-6']"
                                      :key="item.name"
                                      :label="item.name"
                                      :value="item.number">
                                    </el-option>
                                </el-select>

                            </el-form-item>

                            <el-form-item label="渠道账号" prop="acc">
                              
                                <el-select v-model="ruleFormLink.acc" placeholder="请选择渠道账号" size="small">
                                    <el-option
                                      v-for="item in enumList['MJ-7']"
                                      :key="item.name"
                                      :label="item.name"
                                      :value="item.number">
                                    </el-option>
                                </el-select>

                            </el-form-item>

                            <el-form-item label="jq平台账号" prop="jqadmin">
                              
                                <el-select v-model="ruleFormLink.jqadmin" placeholder="请选择jq平台账号" size="small">
                                    <el-option
                                      v-for="item in enumList['MJ-9']"
                                      :key="item.name"
                                      :label="item.name"
                                      :value="item.number">
                                    </el-option>
                                </el-select>

                            </el-form-item>

                            <el-form-item>
                                <el-button @click="quxiaoLink" size="small" style="margin-top: 20px;">取消</el-button>
                                <el-button type="primary" @click="submitFormLink('ruleFormLink')" size="small" style="margin-top: 20px;">生成链接</el-button>
                            </el-form-item>

                            <el-form-item v-if="this.createLinkUrl">
                                <div style="word-wrap: break-word; word-break: normal;">{{this.createLinkUrl}}</div>
                                <el-button type="primary" @click="handleCopy" size="small">复制链接</el-button>
                            </el-form-item>

                        </el-form>

                    </div>

                </el-drawer>

            </el-main>

        </el-container>
        
    </div>
</template>

<script>
import { 
    addDataAllocationRules, 
    deleteDataAllocationRules,
    getDataAllocationRulesList,
    getDataAllocationRulesByUuid,
    updateDataAllocationRules,
    oneKeyDistribution,
    enumByEnumNums,
    getExamBasic,
    getSchoolList,
} from '../../request/api';
import { dateList } from '../../assets/js/data';
import { stateText, getTextByJs, quchong } from '../../assets/js/common';
import { MJ_6, MJ_7, MJ_9 } from '../../assets/js/data';
import Tree from '../Share/Tree';
export default {
    name: 'dataAllocation',
    components: {
        Tree
    },
    data() {
        return {
            dataAlloList: [],
            columnList1: [
                { 'prop': 'name', 'label': '分配组' },
                { 'prop': 'id', 'label': '分配组ID' },
                { 'prop': 'numberOfMembers', 'label': '成员数量' },
                { 'prop': 'seatShowUpNum', 'label': '出勤人数' },
                { 'prop': 'totalAllocated', 'label': '今日已分' },
                { 'prop': 'totalOverflowAllocated', 'label': '当前溢出' },
                { 'prop': 'state', 'label': '状态' },
            ],
            dataAlloForm: {
                currentPage: 1, //当前页数
                pageSize: 10, //每页显示条目个数
                total: null, //总条目数
            },
            totalFlag: false,
            drawerTitle1: '添加分配组',
            drawerFlag1: false,
            direction: 'rtl',
            ruleForm: {
                dayList: [], //溢出量再分配
                name: '', //分配组名
                describe: '', //分配组描述
                state: 1, //分配组状态（1：开启 0：关闭）
                schoolId: '', //分校名称
                uuid: '', //分配组的uuid
            },
            rules: {
                name: [
                  { required: true, message: '请输入分配组名', trigger: 'blur' }
                ],
                describe: [
                  { required: true, message: '请输入分配组描述', trigger: 'blur' }
                ],
            },
            dateList: dateList,
            schoolList: [],
            drawerTitle2: '分配组员',
            drawerFlag2: false,
            groupId: '',
            schoolId: '',
            fullscreenLoading: false,

            sonRefresh: false,

            drawerTitleLink: '生成推广链接',
            drawerFlagLink: false,
            ruleFormLink: {
                ruleid: '',  //分配规则Id
                ruleName: '',  //分配规则Name
                acc: '',  //推广账号
                spread: '',  //渠道
                projectId: '',  //考试项 id
                projectText: '',  //考试项 
                jqadmin: '', //jq账号
            },
            rulesLink: {
                projectText: [
                  { required: true, message: '请选择考试方向', trigger: 'blur' }
                ],
                spread: [
                  { required: true, message: '请选择来源渠道', trigger: 'blur' }
                ],
                // acc: [
                //   { required: true, message: '请选择渠道账号', trigger: 'blur' }
                // ],
                jqadmin: [
                  { required: true, message: '请选择jq平台账号', trigger: 'blur' }
                ],
            },
            restaurants: [],
            enumList: {}, //枚举选项数组
            createLinkUrl: '',
            addDataAllocation: null,
            addDataAllocationLink: null,
            addDataAllocationPeople: null,
            delDataAllocation: null,
            editDataAllocation: null,
            oneKeyPush: null,
        }
    },
    created() {
        this.getDataAllocationRulesList();
        let arr = [MJ_6, MJ_7, MJ_9];
        this.enumByEnumNums(arr);
        this.getExamBasic();
        this.getSchoolList();
        let buttonMap = JSON.parse(localStorage.getItem("buttonMap"));
        this.addDataAllocation = buttonMap.addDataAllocation;
        this.addDataAllocationLink = buttonMap.addDataAllocationLink;
        this.addDataAllocationPeople = buttonMap.addDataAllocationPeople;
        this.delDataAllocation = buttonMap.delDataAllocation;
        this.editDataAllocation = buttonMap.editDataAllocation;
        this.oneKeyPush = buttonMap.oneKeyPush;
    },
    methods: {
        handleCopy() {
            this.copyData(this.createLinkUrl);
        },
        getSchoolList() {
            this.$smoke_get(getSchoolList, {}).then(res => {
                if(res.code == 200){
                    this.schoolList = res.data;
                }else{
                    this.$message({
                        type: 'error',
                        message: res.msg, 
                    });
                }
            })
        },
        copyData(data) {
            let url = data;
            let oInput = document.createElement('input');
            oInput.value = url;
            document.body.appendChild(oInput);
            oInput.select(); // 选择对象;
            document.execCommand("Copy"); // 执行浏览器复制命令
            this.$message({
              message: '复制成功',
              type: 'success'
            });
            oInput.remove();
        },
        enumByEnumNums(arr) {
            this.$smoke_post(enumByEnumNums, {
                numberList: arr
            }).then(res => {
                if(res.code == 200){
                    this.enumList = res.data;
                }
            })
        },
        submitFormLink(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    console.log(this.ruleFormLink);
                    this.createLinkUrl = 'https://test.jhwx.com/zt/jk_jh360/?ruleid='
                     + this.ruleFormLink.ruleid + '&project=' + this.ruleFormLink.projectId
                     + '&spread=' + this.ruleFormLink.spread + '&acc=' + this.ruleFormLink.acc
                     + '&jqadmin=' + this.ruleFormLink.jqadmin;
                    console.log(this.createLinkUrl);
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        createLinksClick(row) {
            this.ruleFormLink.ruleid = row.id; //分配组ID
            this.ruleFormLink.ruleName = row.name; //分配组Name
            this.drawerFlagLink = true;
            this.ruleFormLink.acc = '';
            this.ruleFormLink.spread = '';
            this.ruleFormLink.projectId = '';
            this.ruleFormLink.projectText = '';
            this.createLinkUrl = '';
        },
        parentFn(payload) {
            this.drawerFlag2 = payload;
        },
        getDataAllocationRulesList() {
            this.fullscreenLoading = true;
            this.$smoke_post(getDataAllocationRulesList, this.dataAlloForm).then(res => {
                console.log(res);
                if(res.code == 200) {

                    setTimeout(() => {
                        this.fullscreenLoading = false;
                        res.data.list.map(sll => {
                            sll.totalAllocated = sll.totalAlreadyAllocated + '/' + sll.totalAllocatedLeads;
                            if(sll.totalOverflowAllocated == 0) {
                                sll.totalOverflowAllocated = '- -';
                            }
                            sll.state = stateText(sll.state)
                            if((sll.totalAlreadyAllocated < sll.totalAllocatedLeads) && (sll.totalOverflowAllocated > 0)) {
                                sll.setFlag = true;
                            }else{
                                sll.setFlag = false;
                            }
                        })
                        this.dataAlloList = res.data.list;
                        this.dataAlloForm.total = res.data.total;
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
        handleUpdataClick(scope) {
            console.log(scope);
            this.drawerFlag1 = true;
            this.drawerTitle1 = '编辑 ' + scope.name;
            this.ruleForm.schoolId = scope.schoolId;
            this.getDataAllocationRulesByUuid(scope);
        },
        handleOneKeyClick(scope) {
            console.log(scope);
            this.$smoke_post(oneKeyDistribution, {
                ruleNumber: scope.id
            }).then(res => {
                if(res.code == 200) {
                    this.$message({
                        type: 'success',
                        message: '一键分配成功', 
                    });
                    this.getDataAllocationRulesList();
                }
            })
        },
        handleCurrentChange(index) {
            console.log(index);
        },
        handleSizeChange(index) {
            console.log(index);
        },
        handleDeleteClick(scope) {
            // console.log(scope);
            this.$smoke_post(deleteDataAllocationRules, {
                uuid: scope.row.uuid
            }).then(res => {
                scope._self.$refs[`popover-${scope.$index}`].doClose();
                if(res.code == 200) {
                    this.$message({
                        type: 'success',
                        message: '删除成功', 
                    });
                    this.getDataAllocationRulesList();
                }else{
                    this.$message({
                        type: 'error',
                        message: '删除失败', 
                    });
                }
            })
        },
        addAlloZu() {
            this.drawerFlag1 = true;
            this.drawerTitle1 = '添加分配组';
            this.ruleForm.name = '';
            this.ruleForm.describe = '';
            this.ruleForm.state = null;
            this.ruleForm.dayList = [];
            this.ruleForm.uuid = '';
            this.ruleForm.schoolId = '';
        },
        getDataAllocationRulesByUuid(scope) {
            console.log(scope);
            this.$smoke_post(getDataAllocationRulesByUuid, {
                uuid: scope.uuid
            }).then(res => {
                if(res.code == 200) {
                    console.log(res);
                    this.ruleForm.name = res.data.name;
                    this.ruleForm.describe = res.data.describe;
                    this.ruleForm.state = res.data.state;
                    this.ruleForm.dayList = res.data.dayList;
                    this.ruleForm.uuid = res.data.uuid;
                }
            })
        },
        handleClose(done) {
            done();
        },
        quxiao() {
            this.drawerFlag1 = false;
        },
        quxiaoLink() {
            this.drawerFlagLink = false;
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
              if (valid) {
                console.log(this.ruleForm);
                if(this.drawerTitle1 == '添加分配组'){
                    this.addDataAllocationRules();
                }else{
                    this.updateDataAllocationRules();
                }
              } else {
                console.log('error submit!!');
                return false;
              }
            });
        },
        addDataAllocationRules() {
            this.$smoke_post(addDataAllocationRules, this.ruleForm).then(res => {
                if(res.code == 200) {
                    console.log(res);
                    this.drawerFlag1 = false;
                    this.getDataAllocationRulesList();
                }else{
                    this.$message({
                        type: 'error',
                        message: res.msg, 
                    });
                }
            })
        },
        updateDataAllocationRules() {
            this.$smoke_post(updateDataAllocationRules, this.ruleForm).then(res => {
                if(res.code == 200) {
                    console.log(res);
                    this.drawerFlag1 = false;
                    this.getDataAllocationRulesList();
                }else{
                    this.$message({
                        type: 'error',
                        message: res.msg, 
                    });
                }
            })
        },
        handleAddClick(scope) {
            console.log(scope);
            this.sonRefresh = false;
            this.$nextTick(() => {
                this.sonRefresh = true;
                this.groupId = scope.uuid;
                this.schoolId = scope.schoolId;
                this.drawerFlag2 = true;
            });
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
            this.ruleFormLink.projectId = item.id;
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
        .screen-li{
            width: 90%;
            margin-bottom: 1rem;
        }
    }
    .timeData /deep/ .el-table .cell{
        text-align: center !important;
    }
</style>