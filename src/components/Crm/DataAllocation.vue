<template>
    <el-main class="index-main">
        <el-row style="margin-bottom: 20px;" v-if="addDataAllocation">

            <el-col style="width: 140px;"><el-button style="width: 90%;" size="small" type="primary" @click="addAlloZu">添加分配组</el-button></el-col>

        </el-row>

        <el-table
            :data="dataAlloList"
            v-loading="fullscreenLoading"
            style="width: 100%"
        >
            <el-table-column
              :prop="item.prop"
              :label="item.label"
              :width="item.label == '分配组' ? '190px' : ''"
              v-for="(item, index) in columnList1"
              :key="index"
              >
            </el-table-column>

            <el-table-column prop="active" label="操作" width="140" fixed="right" class-name="table_active">
              <template slot-scope="scope">              
                    <svg-icon v-if="editDataAllocation" @click="handleUpdataClick(scope.row)" icon-title="修改" icon-class="edit" />
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
                    <svg-icon v-if="delDataAllocation" slot="reference" icon-title="删除" icon-class="del" />
                  </el-popover>
                    <svg-icon v-if="addDataAllocationPeople" @click="handleAddClick(scope.row)" icon-title="配置组员" icon-class="members" />
                    <svg-icon v-if="addDataAllocationLink && !scope.row.classType" @click="createLinksClick(scope.row)" icon-title="生成推广链接" icon-class="generatlinks" />
                    
                    <svg-icon v-if="scope.row.setFlag && oneKeyPush" @click="handleOneKeyClick(scope.row)" icon-title="一键分配" icon-class="distribute" />
              </template>
            </el-table-column>

        </el-table>

        <el-pagination
            background
            layout="total, sizes, prev, pager, next, jumper"
            style="text-align: right; margin-top: 20px;"
            :total='dataAlloForm.total'
            :page-size='dataAlloForm.pageSize'
            :page-sizes="[10, 20, 30, 50, 100]"
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
            <span class="bullets"></span>
            
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
                
                <el-form-item label="分配组名" prop="name">
                    <el-input v-model="ruleForm.name" placeholder="请输入分配组名" size="small"></el-input>
                </el-form-item>

                <el-form-item label="分配组描述" prop="describe">
                    <el-input v-model="ruleForm.describe" placeholder="请输入分配组描述" size="small"></el-input>
                </el-form-item>

                <el-form-item label="分校平台" prop="schoolId">

                    <el-select v-model="ruleForm.schoolId" placeholder="请选择分校平台" size="small" :disabled="drawerTitle1.indexOf('编辑') != -1 ? true : false">
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

                <el-form-item label="坐席分类" prop="classType">
                  
                    <el-select @change="classTypeFun" v-model="ruleForm.classType" placeholder="请选择坐席分类" size="small" :disabled="drawerTitle1.indexOf('编辑') != -1 ? true : false">
                        <el-option
                          v-for="item in classTypeList"
                          :key="item.name"
                          :label="item.name"
                          :value="item.number">
                        </el-option>
                    </el-select>

                </el-form-item>

                <el-form-item label="所属考试项" prop="examItemText" v-if="ruleForm.classType">
                  
                    <el-autocomplete
                        style="width: 100%;"
                        size="small"
                        v-model="ruleForm.examItemText"
                        :fetch-suggestions="querySearch"
                        placeholder="请输入考试项目"
                        :trigger-on-focus="true"
                        :disabled="drawerTitle1.indexOf('编辑') != -1 ? true : false"
                        @select="handleSelectExam"
                    ></el-autocomplete>

                </el-form-item >

                <!-- <el-form-item label="溢出量再分配" prop="dayList">
                  
                    <el-select v-model="ruleForm.dayList" multiple placeholder="请选择" size="small">
                        <el-option
                          v-for="item in dateList"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                    </el-select>

                </el-form-item> -->

                <div style="text-align: center; margin-top: 20px;">

                    <el-button type="primary" size="small" @click="submitForm('ruleForm')">确定</el-button>

                    <el-button size="small" @click="quxiao">取消</el-button>

                </div>

            </el-form>

        </el-drawer>

        <el-drawer
            :title="drawerTitle2"
            :visible.sync="drawerFlag2"
            :direction="direction"
            size="60%"
            :before-close="handleClose">
            <span class="bullets"></span>
            
            <div style="border: 1px dashed #ccc; padding: .4rem; margin: .2rem;">

                <Tree @childFn="parentFn" :groupId='groupId' :schoolId='schoolId' v-if="sonRefresh" @getDataAllocationRulesList="getDataAllocationRulesList"></Tree>

            </div>

        </el-drawer>

        <el-drawer
            :title="drawerTitleLink"
            :visible.sync="drawerFlagLink"
            :direction="direction"
            size="35%"
            :before-close="handleClose">
            <span class="bullets"></span>
            
            <div>

                <el-form :model="ruleFormLink" :rules="rulesLink" ref="ruleFormLink" class="demo-ruleForm">

                    <el-form-item label="分配组" prop="ruleid">
                      
                        <el-input :value="creatUrlForm.ruleName" readonly class="borderNone" size="small">{{creatUrlForm.ruleName}}</el-input>

                    </el-form-item>


                    <el-form-item label="考试项目" prop="projectText">
                      
                        <el-autocomplete
                            clearable
                            size="small"
                            ref="autocomplete"
                            class="inline-input"
                            style="width: 100%;"
                            v-model="ruleFormLink.projectText"
                            :fetch-suggestions="querySearch"
                            placeholder="请输入考试项目"
                            :trigger-on-focus="true"
                            @select="handleSelect"
                            @clear="autocompleteClear"
                        ></el-autocomplete>

                    </el-form-item>

                    <el-form-item label="来源渠道" prop="spreadText">

                        <el-autocomplete
                            clearable
                            size="small"
                            ref="autocompleteSpread"
                            class="inline-input"
                            style="width: 100%;"
                            v-model="ruleFormLink.spreadText"
                            :fetch-suggestions="querySearchSpread"
                            placeholder="请输入来源渠道"
                            :trigger-on-focus="true"
                            @select="handleSelectSpread"
                            @clear="autocompleteClearSpread"
                        ></el-autocomplete>
                      
                    </el-form-item>

                    <el-form-item label="推广账号" prop="accText">

                        <el-autocomplete
                            clearable
                            size="small"
                            ref="autocompleteAcc"
                            class="inline-input"
                            style="width: 100%;"
                            v-model="ruleFormLink.accText"
                            :fetch-suggestions="querySearchAcc"
                            placeholder="请输入来源渠道"
                            :trigger-on-focus="true"
                            @select="handleSelectAcc"
                            @clear="autocompleteClearAcc"
                        ></el-autocomplete>

                    </el-form-item>

                    <!-- <el-form-item label="jq平台账号" prop="jqadmin">
                      
                        <el-select v-model="ruleFormLink.jqadmin" placeholder="请选择jq平台账号" size="small">
                            <el-option
                              v-for="item in enumList['MJ-9']"
                              :key="item.name"
                              v-if="item.enable"
                              :label="item.name"
                              :value="item.number">
                            </el-option>
                        </el-select>

                    </el-form-item> -->

                    <el-form-item>
                        <el-button type="primary" @click="submitFormLink('ruleFormLink')" size="small" style="margin-top: 20px;">生成链接</el-button>
                        <el-button @click="quxiaoLink" size="small" style="margin-top: 20px;">取消</el-button>
                    </el-form-item>

                    <el-form-item v-if="this.createLinkUrl">
                        <div style="word-wrap: break-word; word-break: normal;">{{this.createLinkUrl}}</div>
                        <el-button type="primary" @click="handleCopy" size="small">复制链接</el-button>
                    </el-form-item>

                </el-form>

            </div>

        </el-drawer>

    </el-main>
</template>

<script>
import Vue from 'vue'
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
    popularizeUrl
} from '../../request/api';
import { dateList } from '../../assets/js/data';
import { stateText } from '../../assets/js/common';
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
                pageSize: 20, //每页显示条目个数
                total: null, //总条目数
            },
            totalFlag: false,
            drawerTitle1: '添加分配组',
            drawerFlag1: false,
            direction: 'rtl',
            ruleForm: {
                // dayList: [], //溢出量再分配
                name: '', //分配组名
                describe: '', //分配组描述
                state: 1, //分配组状态（1：开启 0：关闭）
                schoolId: '', //分校名称
                uuid: '', //分配组的uuid
                examItemId: '', //考试项目id
                examItemText: '', //考试项目Text
                classType: '', //班型坐席（0：普通班坐席 1：高端班坐席）
            },
            rules: {
                name: [
                  { required: true, message: '请输入分配组名', trigger: 'blur' }
                ],
                describe: [
                  { required: true, message: '请输入分配组描述', trigger: 'blur' }
                ],
                examItemText: [
                  { required: true, message: '请选择考试项目', trigger: 'change' }
                ],
                classType: [
                  { required: true, message: '请选择坐席分类', trigger: 'change' }
                ],
            },
            classTypeList: [
                { name: '普通班坐席', number: 0},
                { name: '高端班坐席', number: 1},
            ],
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
                ruleid: '',  //分配组Id
                ruleName: '',  //分配组Name
                acc: '',  //推广账号
                accText: '',
                spread: '',  //渠道
                spreadText: '',
                projectId: '',  //考试项 id
                projectText: '',  //考试项 
                // jqadmin: '', //jq账号
            },
            creatUrlForm: {},
            rulesLink: {
                projectText: [
                  { required: true, message: '请选择考试项目', trigger: 'change' }
                ],
                spreadText: [
                  { required: true, message: '请选择来源渠道', trigger: 'change' }
                ],
                // acc: [
                //   { required: true, message: '请选择推广账号', trigger: 'blur' }
                // ],
                // jqadmin: [
                //   { required: true, message: '请选择jq平台账号', trigger: 'blur' }
                // ],
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
            this.$copyText(this.createLinkUrl).then(
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
        enumByEnumNums(arr) {
            this.$smoke_post(enumByEnumNums, {
                numberList: arr
            }).then(res => {
                if(res.code == 200){
                    this.enumList = res.data;
                    for(let i in res.data) {
                        this.enumList[i] = this.enumList[i].filter(item => item.enable != 0);
                    }
                }
            })
        },
        submitFormLink(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.popularizeUrl();
                } else {
                    return false;
                }
            });
        },
        popularizeUrl() {
            this.$smoke_post(popularizeUrl, {
                accId: this.ruleFormLink.acc,
                examItemsId: this.ruleFormLink.projectId,
                ruleId: this.creatUrlForm.ruleid,
                spreadId: this.ruleFormLink.spread,
            }).then(res => {
                if(res.code == 200) {
                    this.createLinkUrl = '?ruleid=' + this.creatUrlForm.ruleid + '&project=' + this.ruleFormLink.projectId
                     + '&spread=' + this.ruleFormLink.spread + '&acc=' + this.ruleFormLink.acc;
                    //  + '&jqadmin=' + this.ruleFormLink.jqadmin;
                }else{
                    this.$message({
                        type: 'error',
                        message: res.msg
                    })
                }
            })
        },
        createLinksClick(row) {
            this.drawerFlagLink = true;
            this.creatUrlForm = {
                ruleid: row.id,//分配组ID
                ruleName: row.name,//分配组Name
                accText: '',
                spreadText: '',
                projectText: ''
            }
            this.createLinkUrl = '';
            this.$nextTick(() => {
                this.$refs['ruleFormLink'].resetFields();
            })
        },
        parentFn(payload) {
            this.drawerFlag2 = payload;
        },
        getDataAllocationRulesList() {
            this.fullscreenLoading = true;
            this.$smoke_post(getDataAllocationRulesList, this.dataAlloForm).then(res => {
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
            this.drawerFlag1 = true;
            this.drawerTitle1 = '编辑 ' + scope.name;
            this.ruleForm.schoolId = scope.schoolId;
            this.getDataAllocationRulesByUuid(scope);
        },
        handleOneKeyClick(scope) {
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
            this.dataAlloForm.currentPage = index;
            this.getDataAllocationRulesList();
        },
        handleSizeChange(index) {
            this.dataAlloForm.currentPage = index;
            this.getDataAllocationRulesList();
        },
        handleDeleteClick(scope) {
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

            //重置表单
            this.$nextTick(() => {
                this.$refs['ruleForm'].resetFields();
            })
        },
        getDataAllocationRulesByUuid(scope) {
            this.$smoke_post(getDataAllocationRulesByUuid, {
                uuid: scope.uuid
            }).then(res => {
                if(res.code == 200) {
                    this.ruleForm.name = res.data.name;
                    this.ruleForm.describe = res.data.describe;
                    this.ruleForm.state = res.data.state;
                    // this.ruleForm.dayList = res.data.dayList;
                    this.ruleForm.uuid = res.data.uuid;
                    this.ruleForm.classType = res.data.classType;
                    this.ruleForm.examItemId = res.data.examItemId;
                    this.ruleForm.examItemText = res.data.examItem;
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
                if(this.drawerTitle1 == '添加分配组'){
                    this.addDataAllocationRules();
                }else{
                    this.updateDataAllocationRules();
                }
              } else {
                return false;
              }
            });
        },
        addDataAllocationRules() {
            this.$smoke_post(addDataAllocationRules, this.ruleForm).then(res => {
                if(res.code == 200) {
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
                arr = JSON.parse(JSON.stringify(res.data).replace(/name/g,"value"));
                this.restaurants = arr;
            })
        },
        querySearch(queryString, cb) {
            var restaurants = this.restaurants;
            var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        querySearchSpread(queryString, cb){
            var restaurants = JSON.parse(JSON.stringify(this.enumList['MJ-6']).replace(/name/g,"value"));
            var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        querySearchAcc(queryString, cb){
            var restaurants = JSON.parse(JSON.stringify(this.enumList['MJ-7']).replace(/name/g,"value"));
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
            this.ruleFormLink.projectId = item.id;
            this.ruleFormLink.projectText = item.value;
        },
        handleSelectSpread(item) {
            this.ruleFormLink.spread = item.number;
            this.ruleFormLink.spreadText = item.value;
        },
        handleSelectAcc(item) {
            this.ruleFormLink.acc = item.number;
            this.ruleFormLink.accText = item.value;
        },
        autocompleteClearAcc() {
            this.$nextTick(() => {
                this.$refs.autocompleteAcc.$children
                    .find(c => c.$el.className.includes('el-input'))
                    .blur();
                this.ruleFormLink.acc = '';
                this.$refs.autocompleteAcc.focus();
            })
        },
        autocompleteClearSpread() {
            this.$nextTick(() => {
                this.$refs.autocompleteSpread.$children
                    .find(c => c.$el.className.includes('el-input'))
                    .blur();
                this.ruleFormLink.spread = '';
                this.$refs.autocompleteSpread.focus();
            })
        },
        autocompleteClear() {
            this.$nextTick(() => {
                this.$refs.autocomplete.$children
                    .find(c => c.$el.className.includes('el-input'))
                    .blur();
                this.ruleFormLink.projectId = '';
                this.$refs.autocomplete.focus();
            })
        },
        handleSelectExam(item) {
            this.ruleForm.examItemId = item.id;
            this.ruleForm.examItemText = item.value;
        },
        classTypeFun(val) {
            this.ruleForm.examItemId = '';
            this.ruleForm.examItemText = '';
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
    }
    /* //element-ui table的去除右侧滚动条的样式 */
    ::-webkit-scrollbar {
        width: 8px;
        height: 1px;
    }
        /* // 滚动条的滑块 */
    ::-webkit-scrollbar-thumb {
        background-color: #a1a3a9;
        border-radius: 8px;
    }
</style>