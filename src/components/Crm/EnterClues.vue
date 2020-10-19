<template>
    <el-main class="index-main enterClues">
        <el-tabs v-model="activeName" @tab-click="handleTabsClick">

            <el-tab-pane label="手动录入" name="first">

                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">

                <el-row>

                    <el-col :span="6">
                        <el-form-item label="客户手机" prop="mobile">
                            <el-input v-model="ruleForm.mobile" size="small" placeholder="请输入客户手机"></el-input>
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
                                  v-if="item.enable"
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

                        <el-form-item label="工作年限" prop="workinglife">

                            <el-select v-model="ruleForm.workinglife" placeholder="请选择工作年限" size="small">
                                <el-option
                                  v-for="item in enumList['MJ-2']"
                                  :key="item.name"
                                  v-if="item.enable"
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

                    <!-- <el-col :span="6">
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
                    </el-col> -->

                    <el-col :span="6">
                        <el-form-item label="取证目的" prop="evidencePurpose">

                            <el-select v-model="ruleForm.evidencePurpose" placeholder="请选择取证目的" size="small">
                                <el-option
                                  v-for="item in enumList['MJ-3']"
                                  :key="item.name"
                                  v-if="item.enable"
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

                    <el-col :span="6">
                        <el-form-item label="客户微信" prop="wx">
                            <el-input v-model="ruleForm.wx" size="small" placeholder="请输入客户微信"></el-input>
                        </el-form-item>
                    </el-col>

                </el-row>


                <el-row>

                    <!-- <el-col :span="6">

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

                    </el-col> -->

                    <!-- <el-col :span="6">

                        <el-form-item label="推广渠道" prop="spread">
                      
                            <el-select v-model="ruleForm.spread" placeholder="请选择推广渠道" size="small">
                                <el-option
                                  v-for="item in enumList['MJ-6']"
                                  :key="item.name"
                                  v-if="item.enable"
                                  :label="item.name"
                                  :value="item.number">
                                </el-option>
                            </el-select>

                        </el-form-item>

                    </el-col> -->

                    <el-col :span="12">

                        <el-form-item label="推广链接" prop="url">
                      
                            <el-input v-model="ruleForm.url" size="small" placeholder="请输入推广链接"></el-input>

                        </el-form-item>

                    </el-col>

                </el-row>

                <el-row style="text-align: center; margin-top: 20px;">

                    <el-button type="primary" @click="submitForm('ruleForm')" size="small" style="width: 100px;">保存</el-button>

                </el-row>

                </el-form>

            </el-tab-pane>

            <!-- <el-tab-pane label="模板录入" name="second" v-loading="loading" element-loading-text="线索导入中...">

                <el-upload
                    style="width: 130px; display: inline-block;"
                    :action="readExcelClueData"
                    :headers="headersObj"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload">
                    <el-button plain size="small" style="width: 120px;">导入线索</el-button>
                </el-upload>

                <el-button plain @click="downloadImport" size="small" style="width: 130px; display: inline-block;">下载导入模板</el-button>

                <el-button plain @click="clearImport" size="small" style="width: 130px; display: inline-block;">清除导入线索</el-button>

                <el-button type="primary" @click="upImport" size="small" style="width: 120px; display: inline-block; float: right;">确定导入</el-button>

                <div style="margin-top: 12px;" v-if="validDataNumFlag">
                    <span>{{validDataNum}}条有效数据，{{inValidDataNum}}条无效数据</span>
                    <span style="color: #F56C6C">（红色字体为无效数据）</span>
                </div>

                <el-table
                    style="margin-top: 12px;"
                    :data="importDataForm.list"
                    :row-class-name="tableRowClassName"
                    v-loading="fullscreenLoadingTable"
                    >
                    <el-table-column
                      :prop="item.prop"
                      :show-overflow-tooltip="true"
                      :width="item.prop == 'tel'? '110px' : ''"
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

                        <el-form-item label="选择推广账号" size="small" prop="accText">

                            <el-autocomplete
                              clearable
                              size="small"
                              ref="autocompleteAcc"
                              style="width: 100%;"
                              v-model="importDataForm.accText"
                              :fetch-suggestions="querySearchAcc"
                              placeholder="请输入推广账号"
                              :trigger-on-focus="true"
                              @select="handleSelectAcc"
                              @clear="autocompleteClearAcc"
                            ></el-autocomplete>

                        </el-form-item>

                        <el-form-item label="推广人" prop="jobnum">
                      
                            <el-input :value="importDataForm.jobNameNum" readonly class="borderNone" size="small"></el-input>

                        </el-form-item>

                    </el-form>

                    <span slot="footer" class="dialog-footer">
                      <el-button @click="dialogVisible = false" size="small">取 消</el-button>
                      <el-button type="primary" @click="importDataSubmitForm('importDataForm')" size="small">确 定</el-button>
                    </span>
                </el-dialog>

            </el-tab-pane> -->
            <el-tab-pane label="批量导入" name="third">
              <div class="batch-import">
                <el-upload
                  class="upload-demo"
                  :action="uploadFile"
                  :data="uploadData"
                  multiple
                  :limit="1"
                  :on-exceed="exceedBatchImport"
                  :show-file-list="false"
                  :before-upload="verifyUpload" 
                  :on-success="successBatchImport"
                  :on-error="errorBatchImport"
                  :file-list="batchFileList"
                  >
                  <el-button size="small" type="primary">添加导入表格</el-button>
                  <!-- <div slot="tip" class="el-upload__tip">
                    <p>只能上传jpg/png文件，且不超过500kb</p>                    
                  </div>                   -->
                </el-upload>
                <p class="down-temp ml16">
                  <span>点击范例下载可<a href="https://file.jhwx.com/default/img/20201016/fd9c9d207c5d43d896a139fe04f91049.xlsx">下载导入表格</a></span>
                </p>
              </div>
              
                <el-table :data="taskList" 
                :height="tableHeight">
                    <el-table-column v-for="(item, index) in taskColumnList"
                    :prop="item.prop"
                    :label="item.label"
                    :key="index"
                    :formatter="item.formatter"
                    >

                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-popconfirm
                            confirmButtonText='确定'
                            cancelButtonText='取消'
                            icon="el-icon-info"
                            iconColor="red"
                            placement="top"
                            title="确认取消该任务吗？"
                            @onConfirm="delTask(scope.row)" v-if="scope.row.state != 4"
                        >
                            <svg-icon slot="reference" icon-title="取消任务" icon-class="del" />
                        </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                background
                layout="total, sizes, prev, pager, next, jumper"
                :total='getTaskForm.total'
                :page-size='getTaskForm.pageSize'
                :current-page="getTaskForm.currentPage"
                :page-sizes="[10, 20, 30, 50, 100]"
                @current-change="handleCurrentTaskChange"
                @size-change="handleSizeTaskChange"
            >
        </el-pagination>
            </el-tab-pane>
        </el-tabs>

    </el-main>
</template>

<script>
import { 
    entryClueData,
    jqEntryClueData,
    bulkImportClueData,
    enumByEnumNums,
    getExamBasic,
    getRuleItem,
    clueDataTem,
    readExcelClueData,    
    uploadFile,
    addTask,
    upTask,
    getTaskList
} from '../../request/api';
import pcaa from 'area-data/pcaa';
import { timestampToTime, backType, smoke_MJ_4, smoke_MJ_5, pathWayText, classTypeText, quchong, removeEvery, getQueryObject } from '../../assets/js/common';
import { MJ_1, MJ_2, MJ_3, MJ_4, MJ_5, MJ_6, MJ_7 } from '../../assets/js/data';
export default {
    name: 'enterClues',
    props: ['tableHeight','toggleAction', 'hideSearch'],
    data() {
        return {
            activeName: 'first',
            ruleForm: {
                age: "",
                // city: "",
                adress: "",
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
                mobile: "",
                twoTel: "",
                work: "",
                workinglife: "",
                acc: "",
                wx: "",
                intype: 1
            },
            rules: {
                mobile: [
                  { pattern:/^1\d{10}$/, required: true, message: '请输入客户手机', trigger: 'blur' },
                ],
                // name: [
                //   { required: true, message: '请输入客户姓名', trigger: 'blur' }
                // ],
                // examItemText: [
                //   { required: true, message: '请选择考试项目', trigger: 'change' }
                // ],
                // clueRuleNumber: [
                //   { required: true, message: '请选择分配组', trigger: 'change' }
                // ],
                // spread: [
                //   { required: true, message: '请选择推广渠道', trigger: 'change' }
                // ],
                url: [
                  { required: true, message: '请输入推广链接', trigger: 'blur' }
                ],
            },
            importDataRules: {
                examItemText: [
                  { required: true, message: '请选择考试项', trigger: 'change' }
                ],
                // clueRuleNumber: [
                //   { required: true, message: '请选择分配组', trigger: 'change' }
                // ],
                accText: [
                  { required: true, message: '请选择推广账号', trigger: 'change' }
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
                { 'prop': 'workinglife', 'label': '工作年限' },
                { 'prop': 'province', 'label': '所在省' },
                { 'prop': 'adress', 'label': '所在市' },
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
                acc: '',
                accText: '',
                list: [],
                jobnum: '',
                jobNameNum: '',
            },
            validDataNum: '',
            inValidDataNum: '',
            validDataNumFlag: false,
            fullscreenLoading: false,
            fullscreenLoadingTable: false,
            readExcelClueData: readExcelClueData,
            loading: false,
            batchFileList: [],            
            uploadFile: uploadFile,                    
            uploadData: { fileType: 'xls'},
            getTaskForm: {
              currentPage: 1,
              pageSize: 20,
              total: 0,
              sortSet: [{createTime: "DESC"}]
            },
            taskList: [],
            taskColumnList: [
              {
                'prop': 'url', 'label': '文件名', formatter: this.getFileName
              },
              {
                'prop': 'createTime', 'label': '任务创建时间', 'formatter': this.timeFormatter
              },
              {  'prop': 'state', 'label': '状态', formatter: this.statusFormatter}
            ]
        }
    },
    created() {
        let arr = [MJ_1, MJ_2, MJ_3, MJ_4, MJ_5, MJ_6, MJ_7];
        this.enumByEnumNums(arr);
        this.pcaa = pcaa;
        this.getExamBasic();
        this.getRuleItem();
        const jhToken = localStorage.getItem('jhToken');
        this.headersObj.Authorization = jhToken;
        this.getTaskList()
    },
    methods: {
        timeFormatter(row, column, cellValue){
          return timestampToTime(Number(cellValue))
        },
        statusFormatter(row, column, cellValue){
          if(cellValue == 1){
            return '导入中'
          }else if(cellValue == 2){
            return '导入成功'
          }else if(cellValue == 3){
            return '导入失败'
          }else if(cellValue == 4){
            return '取消'
          }
        },
        errorBatchImport(err, file, fileList){
          console.log(err)
        },
        verifyUpload(file){
          const isXls = file.name.includes('xlsx') || file.name.includes('xls')
          const isLt1M = file.size / 1024 / 1024 < 1;
          if (!isXls) {
            this.$message.error('请上传Excle文件');
          }
          if (!isLt1M) {
            this.$message.error('文件大小不能超过 1MB');
          }
          return isXls && isLt1M;
        },
        exceedBatchImport(files, fileList){
          this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        successBatchImport(response, file, fileList){
          if(response.code == 0){
            this.$smoke_post(addTask, {fileUrl: process.env.VUE_APP_FILE_JHWX + '/' + response.data.fileUrl}).then(res => {
              if(res.code == 200){
                this.$message({
                  type: 'success',
                  message: '导入成功'
                })
                this.batchFileList = []
                this.getTaskList()
              }else{
                this.$message({
                  type: 'error',
                  message: res.msg
                })
              }
            })
          }else{
            this.$message({
              type:'error',
              message: response.msg
            })
          }
        },
        getTaskList(){
          this.$smoke_post(getTaskList, this.getTaskForm).then(res => {
            if(res.code == 200){
              this.taskList = res.data.list
              this.getTaskForm.total = res.data.total              
              this.$emit('setTableHeight', res.data.total, 1, 1)
            }
          })
        },
        getFileName(row){
          return row.url.substring(row.url.lastIndexOf('/') + 1)
        },
        handleCurrentTaskChange(page){
          this.getTaskForm.currentPage = page
          this.getTaskList()
        },
        handleSizeTaskChange(size){
          this.getTaskForm.pageSize = size
          this.getTaskList()
        },
        delTask(row){
            this.$smoke_post(upTask, {id: row.id, state: 4}).then(res => {
              if(res.code == 200){
                this.$message({
                  type: 'success',
                  message: '该任务已取消'
                })
                this.getTaskList()
              }else{
                this.$message({
                  type: 'error',
                  message: res.msg
                })
              }
            })
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
        handleSelectAcc(item) {
            this.importDataForm.acc = item.number;
            this.importDataForm.accText = item.value;
        },
        autocompleteClearAcc() {
            this.$nextTick(() => {
                this.$refs.autocompleteAcc.$children
                    .find(c => c.$el.className.includes('el-input'))
                    .blur();
                this.importDataForm.acc = '';
                this.$refs.autocompleteAcc.focus();
            })
        },
        tableRowClassName({row, rowIndex}) {
            if (row.type == 2) {
                return 'error-row';
            }else{
                return '';
            }
        },
        handleAvatarSuccess(res, file) {
            this.loading = false
            let num1 = 0;
            let num2 = 0;
            let str = '';
            this.fullscreenLoadingTable = true;
            if(res.code == 200) {
                setTimeout(() => {
                    this.fullscreenLoadingTable = false;
                    res.data.list.map(sll => {
                        if(sll.type == 1) {
                            num1 = num1 + 1;
                        }else{
                            num2 = num2 + 1;
                        }
                    })
                    this.validDataNumFlag = true;
                    this.importDataForm.list = res.data.list;

                    this.validDataNum = num1;
                    this.inValidDataNum = num2;
                }, 300);
            }else{
                setTimeout(() => {
                    this.fullscreenLoadingTable = false;
                    this.$message({
                        type: 'error',
                        message: '导入线索失败，请重新导入'
                    })
                }, 300)
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
          if(tab.name == 'third'){
            this.getTaskList()
          }
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
        cityChange() {
            this.ruleForm.province = this.ruleForm.provinceCity[0];
            // this.ruleForm.city = this.ruleForm.provinceCity[1];
            this.ruleForm.adress = this.ruleForm.provinceCity[1];
        },
        handleSelect(item) {
            this.ruleForm.examItemId = item.id;
            this.ruleForm.examItemText = item.value;
        },
        importDataHandleSelect(item) {
            this.importDataForm.examItemId = item.id;
            this.importDataForm.examItemText = item.value;
        },
        getExamBasic() {
            let arr;
            this.$smoke_get(getExamBasic, {}).then(res => {
                if(res.code == 200) {
                    arr = JSON.parse(JSON.stringify(res.data).replace(/name/g,"value"));
                    this.restaurants = arr;
                }
            })
        },
        querySearch(queryString, cb) {
            var restaurants = this.restaurants;
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
                // let obj = urlFun(this.ruleForm.url);
                let obj = getQueryObject(this.ruleForm.url)
                this.ruleForm.project = obj.project;
                this.ruleForm.ruleid = obj.ruleid;
                this.ruleForm.spread = obj.spread;
                this.ruleForm.acc = obj.acc;
                this.ruleForm.jobnum = obj.jobnum;
                this.entryClueData();
              } else {
                return false;
              }
            });
        },
        importDataSubmitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.bulkImportClueData();
                } else {
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
                this.importDataForm.jobNameNum = this.$store.state.name + '（' + this.$store.state.jobNumber + '）';
                this.importDataForm.jobnum = this.$store.state.jobNumber;
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
            this.fullscreenLoading = true;
            let concatUrl = `?project=${this.ruleForm.project}&ruleid=${this.ruleForm.ruleid}&spread=${this.ruleForm.spread}&acc=${this.ruleForm.acc}&jobnum=${this.ruleForm.jobnum}`
            this.$smoke_post(jqEntryClueData + concatUrl, {data: this.ruleForm}).then(res => {
                if(res.code == 0) {
                    setTimeout(() => {
                        this.fullscreenLoading = false;
                            this.$message({
                            type: 'success',
                            message: '手动录入线索成功'
                        })
                        this.$nextTick(() => {
                            this.$refs['ruleForm'].resetFields();
                        }) 
                        this.ruleForm.provinceCity = ["", ""];
                        this.ruleForm.adress = "";
                        this.ruleForm.province = "";
                    }, 300);
                }else{
                    setTimeout(() => {
                        this.fullscreenLoading = false;
                        this.$message({
                            type: 'error',
                            message: '录入失败，电话号码错误或已经存在。'
                        })
                    }, 300)
                }
            })
        },
        downloadImport() {
            const href = clueDataTem;
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
            this.loading = true
            // console.log(file);
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
    .enterClues{
        margin-top: 5px;
    }
    .enterClues /deep/ div.el-dialog__body{
        height: auto;
    }
    .batch-import{
      display: flex;
      align-items: center;
      .upload-demo{
        display: flex;
        /deep/.el-upload-list__item:first-child{
          margin-top: 5px;
        }
      }
      .el-upload__tip{
        /* flex: 1; */
        display: flex;
        justify-content: space-between;
        p{
          margin-right: 10px;
          a{
            color: #409EFF;
          }
        }
      }
      .down-temp{
        align-items: center;
        a{
          color: #409EFF;
        }
      }
    }
    
</style>