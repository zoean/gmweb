<template>
    <el-main class="index-main">
        <el-tabs v-model="activeName" @tab-click="handleTabsClick">

            <el-tab-pane label="手动录入" name="first">

                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">

                <el-row>

                    <el-col :span="6">
                        <el-form-item label="客户手机" prop="tel">
                            <el-input v-model="ruleForm.tel" size="small" placeholder="请输入客户手机"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="6">
                        <el-form-item label="客户姓名" prop="name">
                            <el-input v-model="ruleForm.name" size="small" placeholder="请输入客户姓名"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="6">
                        <el-form-item label="客户年龄" prop="age">
                            <el-input-number v-model="ruleForm.age" :precision="0" :step="1" :min="1" :max="150" size="small" style="width: 100%;"></el-input-number>
                        </el-form-item>
                    </el-col>

                    <el-col :span="6">
                        <el-form-item label="客户性别" prop="gender">

                            <el-select v-model="ruleForm.gender" placeholder="请选择性别" size="small">
                                <el-option
                                  v-for="item in genderList"
                                  :key="item.name"
                                  :label="item.name"
                                  :value="item.number">
                                </el-option>
                            </el-select>

                        </el-form-item>
                    </el-col>

                </el-row>


                <el-row>

                    <el-col :span="6">
                        <el-form-item label="毕业专业" prop="gradMajor">
                            <el-input v-model="ruleForm.gradMajor" size="small" placeholder="请输入毕业专业"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="6">
                        <el-form-item label="最高学历" prop="education">

                            <el-select v-model="ruleForm.education" placeholder="请选择最高学历" size="small">
                                <el-option
                                  v-for="item in enumList['MJ-1']"
                                  :key="item.name"
                                  :label="item.name"
                                  :value="item.number">
                                </el-option>
                            </el-select>

                        </el-form-item>
                    </el-col>

                    <el-col :span="6">
                        <el-form-item label="客户工作" prop="work">
                            <el-input v-model="ruleForm.work" size="small" placeholder="请输入客户工作"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="6">

                        <el-form-item label="工作年限" prop="workingLife">

                            <el-select v-model="ruleForm.workingLife" placeholder="请选择工作年限" size="small">
                                <el-option
                                  v-for="item in enumList['MJ-2']"
                                  :key="item.name"
                                  :label="item.name"
                                  :value="item.number">
                                </el-option>
                            </el-select>

                        </el-form-item>
                        
                    </el-col>

                </el-row>


                <el-row>

                    <el-col :span="6">
                        <el-form-item label="所在省市" prop="provinceCity">
                            <area-cascader type="text" placeholder="请选择所在省市" v-model="ruleForm.provinceCity" @change="cityChange" :data="pcaa"></area-cascader>
                        </el-form-item>
                    </el-col>

                    <el-col :span="6">
                        <el-form-item label="考试项目" prop="examItemText">
                
                            <el-autocomplete
                                class="inline-input"
                                style="width: 100%;"
                                v-model="ruleForm.examItemText"
                                :fetch-suggestions="querySearch"
                                placeholder="请输入考试项目"
                                @select="handleSelect"
                            ></el-autocomplete>

                        </el-form-item>
                    </el-col>

                    <el-col :span="6">
                        <el-form-item label="取证目的" prop="evidencePurpose">

                            <el-select v-model="ruleForm.evidencePurpose" placeholder="请选择取证目的" size="small">
                                <el-option
                                  v-for="item in enumList['MJ-3']"
                                  :key="item.name"
                                  :label="item.name"
                                  :value="item.number">
                                </el-option>
                            </el-select>

                        </el-form-item>
                    </el-col>

                    <el-col :span="6">
                        <el-form-item label="第二电话" prop="twoTel">
                            <el-input v-model="ruleForm.twoTel" size="small" placeholder="请输入第二电话"></el-input>
                        </el-form-item>
                    </el-col>

                </el-row>


                <el-row>

                    <el-col :span="6">
                        <el-form-item label="客户微信" prop="wx">
                            <el-input v-model="ruleForm.wx" size="small" placeholder="请输入客户微信"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="6">

                        <el-form-item label="选择分配组" prop="clueRuleNumber">

                            <el-select v-model="ruleForm.clueRuleNumber" placeholder="请选择分配组" class="screen-li">
                                <el-option
                                  v-for="item in ruleNumberNameList"
                                  :key="item.name"
                                  :label="item.name"
                                  :value="item.ruleNumberName">
                                </el-option>
                            </el-select>

                        </el-form-item>

                    </el-col>

                    <el-col :span="6">

                        <el-form-item label="来源渠道" prop="spread">
                      
                            <el-select v-model="ruleForm.spread" placeholder="请选择来源渠道" size="small">
                                <el-option
                                  v-for="item in enumList['MJ-6']"
                                  :key="item.name"
                                  :label="item.name"
                                  :value="item.number">
                                </el-option>
                            </el-select>

                        </el-form-item>

                    </el-col>

                </el-row>

                <el-row style="text-align: center; margin-top: 20px;">

                    <el-button type="primary" @click="submitForm('ruleForm')" size="small" style="width: 100px;">保存</el-button>

                </el-row>

                </el-form>

            </el-tab-pane>

            <el-tab-pane label="模板录入" name="second">

                <el-upload
                    style="width: 130px; display: inline-block;"
                    action="https://gm.jhwx.com/api/phone/excel/readExcelClueData"
                    :headers="headersObj"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload">
                    <el-button plain size="small" style="width: 120px;">导入线索</el-button>
                </el-upload>

                <el-button plain @click="downloadImport" size="small" style="width: 130px; display: inline-block;">下载导入模板</el-button>

                <el-button plain @click="clearImport" size="small" style="width: 130px; display: inline-block;">清除导入线索</el-button>

                <el-button type="primary" @click="upImport" size="small" style="width: 120px; display: inline-block; float: right;">确定导入</el-button>

                <div style="margin-top: 20px;" v-if="validDataNumFlag">
                    <span>{{validDataNum}}条有效数据，{{inValidDataNum}}条无效数据</span>
                    <span> (</span>
                    <span style="display: inline-block; width:20px; height: 10px;background: #F56C6C;"></span>
                    <span>) </span>
                </div>

                <el-table
                    style="margin-top: 20px;"
                    :data="importDataForm.list"
                    :row-class-name="tableRowClassName"
                    >
                    <el-table-column
                      :prop="item.prop"
                      :label="item.label"
                      v-for="(item, index) in importDataListColumn"
                      :key="index"
                      >
                    </el-table-column>
                    
                </el-table>

                <el-dialog
                    title="请选择考试项和分配组"
                    :visible.sync="dialogVisible"
                    width="30%"
                    >
                  
                    <el-form :model="importDataForm" :rules="importDataRules" ref="importDataForm">

                        <el-form-item label="选择考试项" prop="examItemText">
                        
                            <el-autocomplete
                                class="inline-input"
                                style="width: 100%;"
                                size="small"
                                v-model="importDataForm.examItemText"
                                :fetch-suggestions="querySearch"
                                placeholder="请选择考试项"
                                @select="importDataHandleSelect"
                            ></el-autocomplete>

                        </el-form-item>

                        <el-form-item label="选择分配组" size="small" prop="clueRuleNumber">

                            <el-select v-model="importDataForm.clueRuleNumber" placeholder="请选择分配组">
                                <el-option
                                  v-for="item in ruleNumberNameList"
                                  :key="item.name"
                                  :label="item.name"
                                  :value="item.ruleNumberName">
                                </el-option>
                            </el-select>

                        </el-form-item>

                    </el-form>

                    <span slot="footer" class="dialog-footer">
                      <el-button @click="dialogVisible = false" size="small">取 消</el-button>
                      <el-button type="primary" @click="importDataSubmitForm('importDataForm')" size="small">确 定</el-button>
                    </span>
                </el-dialog>

            </el-tab-pane>
        </el-tabs>

    </el-main>
</template>

<script>
import { 
    entryClueData,
    bulkImportClueData,
    enumByEnumNums,
    getExamBasic,
    getRuleItem,
    clueDataTem,
} from '../../request/api';
import pcaa from 'area-data/pcaa';
import { timestampToTime, backType, smoke_MJ_4, smoke_MJ_5, pathWayText, classTypeText, quchong, removeEvery } from '../../assets/js/common';
import { MJ_1, MJ_2, MJ_3, MJ_4, MJ_5, MJ_6 } from '../../assets/js/data';
export default {
    name: 'enterClues',
    data() {
        return {
            activeName: 'first',
            ruleForm: {
                age: "",
                city: "",
                clueRuleNumber: "",
                education: "",
                evidencePurpose: "",
                examItemId: "",
                examItemText: "",
                gender: "",
                gradMajor: "",
                name: "",
                province: "",
                provinceCity: "",
                spread: "",
                tel: "",
                twoTel: "",
                work: "",
                workingLife: "",
                wx: ""
            },
            rules: {
                tel: [
                  { required: true, message: '请输入客户手机', trigger: 'blur' },
                ],
                name: [
                  { required: true, message: '请输入客户姓名', trigger: 'blur' }
                ],
                examItemText: [
                  { required: true, message: '请选择考试项目', trigger: 'change' }
                ],
                clueRuleNumber: [
                  { required: true, message: '请选择分配组', trigger: 'change' }
                ],
                spread: [
                  { required: true, message: '请选择来源渠道', trigger: 'change' }
                ],
            },
            importDataRules: {
                examItemText: [
                  { required: true, message: '请选择考试项', trigger: 'change' }
                ],
                clueRuleNumber: [
                  { required: true, message: '请选择分配组', trigger: 'change' }
                ],
            },
            genderList: [
                { 'name': '女', 'number': 0 },
                { 'name': '男', 'number': 1 },
            ],
            enumList: {},
            pcaa: null, //省市数据
            restaurants: [],
            ruleNumberNameList: [], //分配组数组
            headersObj: {
                Authorization: ''
            },
            importDataListColumn: [
                { 'prop': 'tel', 'label': '客户手机' },
                { 'prop': 'name', 'label': '客户姓名' },
                { 'prop': 'age', 'label': '客户年龄' },
                { 'prop': 'gender', 'label': '客户性别' },
                { 'prop': 'gradMajor', 'label': '毕业专业' },
                { 'prop': 'education', 'label': '最高学历' },
                { 'prop': 'work', 'label': '客户工作' },
                { 'prop': 'workingLife', 'label': '工作年限' },
                { 'prop': 'province', 'label': '所在省' },
                { 'prop': 'city', 'label': '所在市' },
                { 'prop': 'evidencePurpose', 'label': '取证目的' },
                { 'prop': 'twoTel', 'label': '第二电话' },
                { 'prop': 'wx', 'label': '客户微信' },
                { 'prop': 'spread', 'label': '推广渠道' },
            ],
            dialogVisible: false,
            importDataForm: {
                clueRuleNumber: '',
                examItemId: '',
                examItemText: '',
                list: []
            },
            validDataNum: '',
            inValidDataNum: '',
            validDataNumFlag: false,
        }
    },
    created() {
        let arr = [MJ_1, MJ_2, MJ_3, MJ_4, MJ_5, MJ_6];
        this.enumByEnumNums(arr);
        this.pcaa = pcaa;
        this.getExamBasic();
        this.getRuleItem();
        const jhToken = localStorage.getItem('jhToken');
        this.headersObj.Authorization = jhToken;
    },
    methods: {
        tableRowClassName({row, rowIndex}) {
            console.log(row);
            if (row.type == 2) {
                return 'error-row';
            }else{
                return '';
            }
        },
        handleAvatarSuccess(res, file) {
            let num1 = 0;
            let num2 = 0;
            console.log(res);
            console.log(file);
            let str = '';
            if(res.code == 200) {
                this.$message({
                    type: 'success',
                    message: '导入线索成功'
                })
                res.data.list.map(sll => {
                    if(sll.type == 1) {
                        num1 = num1 + 1;
                    }else{
                        num2 = num2 + 1;
                    }
                })
                this.validDataNumFlag = true;
                console.log(num1)
                console.log(num2)
                this.importDataForm.list = res.data.list;
                this.validDataNum = num1;
                this.inValidDataNum = num2;
            }else{
                this.$message({
                    type: 'error',
                    message: '导入线索失败'
                })
            }
        },
        getRuleItem() {
            this.$smoke_get(getRuleItem, {
                type: 0
            }).then(res => {
                if(res.code == 200){
                    this.ruleNumberNameList = res.data;
                }
            })
        },
        handleTabsClick(tab, event) {
            console.log(tab, event);
        },
        enumByEnumNums(arr) {
            this.$smoke_post(enumByEnumNums, {
                numberList: arr
            }).then(res => {
                if(res.code == 200){
                    for (var i in res.data) {
                        res.data[i].map(sll => {
                            if(sll.enable == 0) {
                                res.data[i] = removeEvery(sll, res.data[i]);
                            }
                        })
                    }
                    this.enumList = res.data;
                }
            })
        },
        cityChange() {
            console.log(this.ruleForm.provinceCity);
            this.ruleForm.province = this.ruleForm.provinceCity[0];
            this.ruleForm.city = this.ruleForm.provinceCity[1];
        },
        handleSelect(item) {
            console.log(item);
            this.ruleForm.examItemId = item.id;
            this.ruleForm.examItemText = item.value;
        },
        importDataHandleSelect(item) {
            console.log(item);
            this.importDataForm.examItemId = item.id;
            this.importDataForm.examItemText = item.value;
        },
        getExamBasic() {
            let arr;
            this.$smoke_get(getExamBasic, {}).then(res => {
                if(res.code == 200) {
                    console.log(res);
                    arr = JSON.parse(JSON.stringify(res.data).replace(/name/g,"value"));
                    this.restaurants = arr;
                }
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
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
              if (valid) {
                console.log(this.ruleForm);
                this.entryClueData();
              } else {
                console.log('error submit!!');
                return false;
              }
            });
        },
        importDataSubmitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    console.log(this.importDataForm);
                    this.bulkImportClueData();
                } else {
                  console.log('error submit!!');
                  return false;
                }
            });
        },
        upImport() {
            if(this.importDataForm.list.length == 0) {
                this.$message({
                    type: 'error',
                    message: '亲，请您先导入线索数据'
                })
            }else{
                this.dialogVisible = true;
            }
        },
        bulkImportClueData() {
            this.$smoke_post(bulkImportClueData, this.importDataForm).then(res => {
                if(res.code == 200) {
                    this.$message({
                        type: 'success',
                        message: '导入线索成功'
                    })
                    this.dialogVisible = false;
                    this.importDataForm.list = [];
                    this.validDataNumFlag = false;
                }
            })
        },
        entryClueData() {
            this.$smoke_post(entryClueData, this.ruleForm).then(res => {
                if(res.code == 200) {
                    this.$message({
                        type: 'success',
                        message: '手动录入线索成功'
                    })
                    this.$nextTick(() => {
                        this.$refs['ruleForm'].resetFields();
                    }) 
                    this.ruleForm.provinceCity = ["", ""];
                    this.ruleForm.city = "";
                    this.ruleForm.province = "";
                }
            })
        },
        downloadImport() {
            const href = 'https://gm.jhwx.com' + clueDataTem
            // console.log(href);
            window.open(href, '_blank');
        },
        clearImport() {
            if(this.importDataForm.list.length == 0) {
                this.$message({
                    type: 'error',
                    message: '亲，请您先导入线索数据'
                })
            }else{
                this.importDataForm.list = [];
                this.validDataNumFlag = false;
            }
        },
        beforeAvatarUpload(file) {
            console.log(file);
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
        border-radius: 8px;
    }
</style>