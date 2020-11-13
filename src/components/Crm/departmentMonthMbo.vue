<template>
  <el-main class="index-main">
    <el-radio-group v-model="orgUuid" @change="changeOrg" class="handle-area">
      <el-radio-button v-for="(item, index) in orgList" :label="item.orgUuid">{{item.orgName}}目标管理</el-radio-button>
    </el-radio-group>
    <el-tabs type="border-card" class="mt20" row-key="id" v-model="tabActiveName" tab-position="top" @tab-click="tabClick">
      <el-tab-pane label="年目标" name="year">年</el-tab-pane>
      <el-tab-pane label="月目标" name="month">
        <el-row type="flex" justify="space-between">
          <el-col :span="4">
            <el-row type="flex" justify="start" :gutter="20">
              <el-col :span="18">
                <el-date-picker
                  v-model="searchForm.yearOrMonths[0]"
                  type="month"
                  placeholder="选择年"
                  value-format="timestamp"
                  size="mini"
                  :clearable="false">
                </el-date-picker>
              </el-col>
              <el-col :span="4">
                <el-button size="mini" type="primary" @click="searchMonthList">查询</el-button>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="4" class="text-right">
            <el-button size="mini" type="primary" @click="addMonthTarget">新增</el-button>
          </el-col>
        </el-row>
        <el-table class="mt20" :data="monthTableList" :tree-props="{children: 'list', hasChildren: 'hasChildren'}" row-key="uuid" v-loading="loading" :height="tableHeight">
          <el-table-column v-for="(item, index) in monthTableColumn" :prop="item.prop" :label="item.label" :key="index" :formatter="item.formatter"></el-table-column>
          <el-table-column label="完成率" align="center">
            <template slot-scope="scope">
              <el-progress :percentage="computedPercentage(scope.row) >= 100 ? 100 : computedPercentage(scope.row)" :format="computedPercentage(scope.row, 1)"></el-progress>
            </template>
          </el-table-column>
          <el-table-column label="未完成（万元）" align="center">
            <template slot-scope="scope">
              <span :class="scope.row.target < scope.row.complete ? 'red' : ''">{{scope.row.target < scope.row.complete ? '超￥' + (scope.row.target - scope.row.complete).toFixed(4).slice(1) : '￥' + (scope.row.target - scope.row.complete).toFixed(4)}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="70">
            <template slot-scope="scope">
              <svg-icon v-if="scope.row.month" @click.native.prevent="editMonthTarget(scope.row)" icon-title="修改" icon-class="edit" />
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="日目标" name="day">日</el-tab-pane>
    </el-tabs>
    <el-dialog class="beautiful-title" :visible.sync="addEditMonthParams.visible" :title="addEditMonthParams.title" width="500px">
      <el-form :model="addEditMonthForm" ref="addEditMonthForm" label-width="160px !important" :rules="addEditMonthRules">
        <el-form-item label="月份" prop="time">
          <el-col :span="16">
            <el-date-picker
              v-model="addEditMonthForm.time"
              type="month"
              placeholder="选择月份"
              :pickerOptions="pickerOptions"
              value-format="timestamp"
              @change="changeMonth"
              >
            </el-date-picker>
          </el-col>
        </el-form-item>  
        <el-form-item class="long-label" label="本年度该组织目标流水（万元）">
          <el-input disabled :value="monthDetailData.target"></el-input>
        </el-form-item>   
        <el-form-item label="总计（万元）">
          <el-input disabled :value="total"></el-input>
        </el-form-item> 
        <el-row id="targetTitle">
          <el-col :span="12">
            下属组织
          </el-col>
          <el-col class="text-left" :span="12">流水目标（万元）</el-col>
        </el-row> 
        <el-row id="targetList">
          <el-form-item v-for="(item, index) in addEditMonthForm.deptList" :label="item.name" :key="item.uuid" prop="target">
            <el-input-number :min="0" v-model="addEditMonthForm.deptList[index].targetMoney" :disabled="addEditMonthForm.deptList[index].disabled"></el-input-number>
          </el-form-item>
        </el-row>         
        <el-row :gutter="20" class="text-center fixiedialog-margin">
          <el-col>
            <el-button @click="addEditMonthParams.visible = false">取消</el-button> 
            <el-button v-if="ifAbled" type="primary" @click="submitAddEditMonth">保存</el-button>           
          </el-col>
        </el-row>     
      </el-form>      
    </el-dialog>
  </el-main>
</template>
<script>
import {getDeptMonthList, getDeptMonthDetail, addOrEditDeptMonth} from '@/request/api'
import {timestampToTime} from '@/assets/js/common'
export default{
  props: ['tableHeight'],
  data() {
    var validateNumber = (rule, value, callback) => {
      if(value < 0){
        this.$message.error('请输入大于0的数字')
      }else{
        callback();
      }
    }
    return {      
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      tabActiveName: 'month',
      curYear: Number(sessionStorage.getItem('curYear')),
      curTime: sessionStorage.getItem('curTime'),
      yearOptions:[],
      selectYear: '',
      searchForm: {
        yearOrMonths: [sessionStorage.getItem('curTime')],
        orgUuid: ''
      },
      monthTableList: [],
      monthTableColumn: [
        {
          label: '季度',
          prop: 'quarter',
          formatter: this.formatterQuarter
        },
        {
          label: '月份',
          prop: 'month'
        },
        {
          label: '下属组织',
          prop: 'name'
        },
        {
          label: '流水目标（万元）',
          prop: 'target',
          formatter: this.numberFormatter
        },
        {
          label: '完成流水（万元）',
          prop: 'complete',
          formatter: this.numberFormatter
        }
      ],
      monthListYear: '',
      addEditMonthParams: {
        title: '新增月目标',
        visible: false,
        type: 1, //1-添加 2-编辑
      },
      addEditMonthForm: {
        time: '',
        orgUuid: '',
        deptList: []
      },
      addEditMonthRules:{
        yearTime: [
          {required: true, message: '请选择要设置的目标年度', trigger: 'blur'}
        ],
        yearTarget: [
          {required: true, message: '请输入目标额度', trigger: 'blur'},
          {validator: validateNumber, trigger: 'change'}
        ]
      },
      addEditMonth: '',
      monthDetailData: {},
      getMonthDetailForm: {
        orgUuid: '',
        time: sessionStorage.getItem('curTime')
      },      
      orgUuid: sessionStorage.getItem('orgUuid'),
      ifAbled: true,
      loading: true
    }
  },   
  computed: {
    total: function (){
      let total = 0
      if(this.addEditMonthForm.deptList.length > 0){
        this.addEditMonthForm.deptList.map((item, index, arr) => {
          total = total + Number(item.targetMoney || 0)
        })
      }      
      return total
    }
  },
  created() {   
    this.orgList = JSON.parse(sessionStorage.getItem('orgList'))
    this.setFormOrgUuid()    
    this.getMonthTargetList()
  },
  methods: {
    changeMonth: function (val){
      this.getMonthDetailForm.time = val
      this.getMonthDetail()
    },
    numberFormatter: function (row, column, cellValue){
      return cellValue.toFixed(4)
    },
    setFormOrgUuid: function (){
      this.searchForm.orgUuid = this.orgUuid
      this.getMonthDetailForm.orgUuid = this.orgUuid
      this.addEditMonthForm.orgUuid = this.orgUuid
    },
    changeOrg: function (){
      this.setFormOrgUuid()
      this.getMonthTargetList()
    },
    formatterQuarter: function (row, column, cellValue){
      if(cellValue == 1){
        return '一季度'
      }else if(cellValue == 2){
        return '二季度'
      }else if(cellValue == 3){
        return '三季度'
      }else if(cellValue == 4){
        return '四季度'
      }
    },
    searchMonthList: function (){
      if(!this.searchForm.yearOrMonths[0]){
        this.$message({
          type: 'error',
          message: '请选择月份'
        })
      }else{
        this.getMonthTargetList()
      }
    },
    tabClick(tab, event){
      if(tab.index == 0){
        this.$router.push({name: 'departmentyearmbo' })
      }else if(tab.index == 2){
        this.$router.push({name: 'departmentdaymbo' })
      }
      sessionStorage.setItem('orgUuid', this.orgUuid)
    },
    computedPercentage(row, format){
      if(!row.complete || !row.target){
        if(format){
          return () => {
            return 0 + '%'
          }
        }else{
          return 0
        }
      }
      else{
        if(format){
          return () =>{
            return Number((row.complete / row.target * 100).toFixed(2)) + '%'
          }
        }else{
          return Number((row.complete / row.target * 100).toFixed(2))
        }
      }
    },
    timeFormatter(row, column, cellValue){
      return timestampToTime(Number(cellValue)).slice(0, 4)
    },
    getMonthTargetList: function(){
      this.loading = true
      this.$smoke_post(getDeptMonthList, this.searchForm).then(res => {
        this.loading = false
        if(res.code == 200 && res.data.length > 0){
          this.monthTableList = res.data[0].list
          this.monthListYear = res.data[0].yearTime
          this.$emit('setTableHeight', res.data[0].list.length)
        }
      })
    },
    getMonthDetail: function (){
      this.$smoke_post(getDeptMonthDetail, this.getMonthDetailForm).then(res => {
        if(res.code == 200){
          this.monthDetailData = res.data
          this.addEditMonthForm.deptList = []
          this.monthDetailData.deptList.map((item, index, arr) => {
            this.addEditMonthForm.deptList.push({
              name: item.name,
              targetMoney: item.target || 0,
              uuid: item.uuid,
              orgUserId: item.orgUserId,
              type: item.type,
              disabled: item.disabled
            })
          })
          this.monthDetailData.userList.map((item, index, arr) => {
            this.addEditMonthForm.deptList.push({
              name: item.name,
              targetMoney: item.target || 0,
              uuid: item.uuid,
              orgUserId: item.orgUserId,
              type: item.type,
              disabled: item.disabled
            })
          })
          
          this.ifAbled = !this.addEditMonthForm.deptList[0].disabled
        }
      })
    },
    editMonthTarget: function (row){      
      const curYear = timestampToTime(this.monthListYear).slice(0, 4)
      const curMonth = row.month ? row.month.slice(0, 2) : ''
      const curEditTime = curYear + '-' + curMonth + '-01'
      this.addEditMonthParams.visible = true
      this.addEditMonthParams.type = 2
      this.addEditMonthParams.title = '编辑月目标'
      this.addEditMonthForm.time = new Date(curEditTime).getTime()
      this.getMonthDetailForm.time = new Date(curEditTime).getTime()
      this.getMonthDetail()
    },
    addMonthTarget: function (){
      this.addEditMonthParams.visible = true
      this.addEditMonthParams.type = 1
      this.addEditMonthParams.title = '添加月目标'
      this.addEditMonthForm.time = this.curTime
      this.getMonthDetailForm.time = this.curTime
      this.getMonthDetail()
    },
    submitAddEditMonth: function (){
      const searchMonth = timestampToTime(Number(this.addEditMonthForm.time)).slice(0, 7),
      addEditMonth = timestampToTime(Number(this.searchForm.yearOrMonths[0])).slice(0, 7)
      this.$refs['addEditMonthForm'].validate((valid) => {
        if(valid){
          if(this.monthDetailData.target > this.total){
            this.$message.error('下属组织目标合计需大于上级组织目标')
          }else{
            this.$smoke_post(addOrEditDeptMonth, this.addEditMonthForm).then(res => {
              if(res.code == 200){
                this.addEditMonthParams.visible = false
                if(searchMonth == addEditMonth){
                  this.getMonthTargetList()
                }              
                this.$message({
                  message: this.addEditMonthParams.type == 1 ? '添加成功' : '修改成功',
                  type: 'success'
                })
              }else{
                this.addEditMonthParams.visible = false
                this.$message.error(res.msg)
              }
            })
          }          
        }
      })
    }
  }
   
}
</script>
<style lang="less" scoped>
  .index-main{
    margin-top: 15px;
  }
.target-num{
 padding: 5px;
 background-color: #999;
 color: #fff;
 margin-left: 16px;
}
#targetTitle{
  margin-top: 10px;
  text-align: center;
}
.el-progress{
  margin-top: 10px;
  /deep/.el-progress-bar{
    padding-right: 68px;
    margin-right: -68px;
  }
}
.el-form{
  .el-form-item{    
    .el-input{
      width: 220px;
    }
    .el-input-number{
      width: 220px;
    }
  }
  /deep/.long-label label{
    line-height: 20px;
  }
}
.el-date-editor.el-input, .el-date-editor.el-input__inner{
  width: 100%;
}
</style>