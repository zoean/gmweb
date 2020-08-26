<template>
  <el-main class="index-main">
    <el-radio-group v-model="orgUuid" @change="changeOrg">
      <el-radio-button v-for="(item, index) in orgList" :label="item.orgUuid">{{item.orgName}}目标管理</el-radio-button>
    </el-radio-group>
    <el-tabs class="mt20" type="border-card" v-model="tabActiveName" tab-position="top" @tab-click="tabClick">
      <el-tab-pane label="年目标" name="year">
        年
      </el-tab-pane>
      <el-tab-pane label="月目标" name="month">月</el-tab-pane>
      <el-tab-pane label="日目标" name="day">
        <el-row type="flex" justify="space-between">
          <el-col :span="6">
            <el-row type="flex" justify="start" :gutter="20">
              <el-col :span="17">                
                <el-date-picker
                v-model="searchForm.yearOrMonths[0]"
                type="month"
                placeholder="选择月"
                value-format="timestamp"
                size="mini">
              </el-date-picker>
              </el-col>
              <el-col :span="5">
                <el-button size="mini" type="primary" @click="getDeptDailyList">查询</el-button>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="4" class="text-right">
            <el-button size="mini" type="primary" @click="addDialyTarget">新增</el-button>
          </el-col>
        </el-row>
        <el-table :data="dailyTableList" :tree-props="{children: 'list', hasChildren: 'hasChildren'}" row-key="uuid">
          <el-table-column v-for="(item, index) in dailyTableColumn" :prop="item.prop" :label="item.label" :key="index" :formatter="item.formatter"></el-table-column>
          <el-table-column label="完成率" align="center">
            <template slot-scope="scope">
              <el-progress :percentage="computedPercentage(scope.row) >= 100 ? 100 : computedPercentage(scope.row)" :format="computedPercentage(scope.row, 1)"></el-progress>
            </template>
          </el-table-column>
          <el-table-column label="未完成" align="center">
            <template slot-scope="scope">
              <span :class="scope.row.target < scope.row.complete ? 'red' : ''">{{scope.row.target < scope.row.complete ? '超￥' + (scope.row.target - scope.row.complete).toFixed(4).slice(1) : '￥' + (scope.row.target - scope.row.complete).toFixed(4)}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="70">
            <template slot-scope="scope">
              <svg-icon v-if="scope.row.daily" @click.native.prevent="editDialyTarget(scope.row)" icon-title="修改" icon-class="edit" />
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <el-dialog :visible.sync="addEditDailyParams.visible" :title="addEditDailyParams.title" width="400px">
      <el-form :model="addEditDailyForm" ref="addEditDailyForm" :rules="addEditDailyRules">
        <el-row type="flex" style="align-items: center;" :gutter="20">
          <el-col>
            <el-date-picker
              v-model="addEditDailyForm.time"
              type="date"
              placeholder="选择日期"
              :pickerOptions="pickerOptions"
              value-format="timestamp"
              size="mini"
              @change="changeDaily">
            </el-date-picker>
          </el-col>
        </el-row> 
        <el-row class="mt10">
          <el-col class="text-right" :span="12">本日该组织总目标（万元）</el-col>
          <el-col :span="8"><span class="target-num">{{currentDailyData.target || 0}}</span></el-col>
        </el-row>  
        <el-row class="mt20" :gutter="10">
          <el-col class="text-right" :span="5">下属组织</el-col>
          <el-col :span="8">流水目标(万元)</el-col>
        </el-row>
        <el-row class="mt10" type="flex" justify="start" :gutter="10">
          <el-col class="text-right" :span="5">总计</el-col>
          <el-col :span="8"><span class="target-num">{{total}}</span></el-col>
        </el-row>
        <el-form-item v-for="(item, index) in addEditDailyForm.deptList" :label="item.name" :key="item.uuid">
          <el-input-number :min="0" size="mini" v-model="addEditDailyForm.deptList[index].targetMoney" :disabled="item.disabled"></el-input-number>
        </el-form-item>
        <el-row :gutter="20" type="flex" justify="end" class="text-right">
          <el-col>
            <el-button size="mini" @click="addEditDailyParams.visible = false">取消</el-button> 
            <el-button type="primary" size="mini" @click="submitAddEditDaily">保存</el-button>           
          </el-col>
        </el-row>     
      </el-form>      
    </el-dialog>
  </el-main>
</template>
<script>
import {getDeptDailyList, getDeptDailyDetail, addOrEditDeptDaily} from '@/request/api'
import {timestampToTime, formatNumber} from '@/assets/js/common'
export default{
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
          return time.getTime() < Date.now();
        }
      },
      selectMonth: '',
      tabActiveName: 'day',
      curTime: Number(sessionStorage.getItem('curTime')),
      yearOptions:[],
      monthOptions: [],
      selectYear: '',
      selectMonth: '',
      searchForm: {
        yearOrMonths: [sessionStorage.getItem('curTime')],
        orgUuid: ''
      },
      dailyTableList: [],
      dailyTableColumn: [
        {
          label: '周',
          prop: 'week'
        },
        {
          label: '日',
          prop: 'daily',
          formatter: this.dailyFormatter
        },
        {
          label: '分校',
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
      addEditDailyParams: {
        title: '新增日目标',
        visible: false,
        type: 1, //1-添加 2-编辑
      },
      addEditDailyForm: {
        time: sessionStorage.getItem('curTime'),
        deptList: [],
        orgUuid: ''
      },
      addEditDailyRules:{
        time: [
          {required: true, message: '请选择要设置的目标年度和月份', trigger: 'blur'}
        ],
        dailys: [
          {required: true, message: '请输入目标额度', trigger: 'blur'}
        ]
      },
      getDailyDetailForm: {
        time: sessionStorage.getItem('curTime'),
        orgUuid: ''
      },
      addEditDailyYear: '',
      addEditDailyMonth: '',
      currentDailyData: {},
      orgUuid: sessionStorage.getItem('orgUuid')
    }
  },
  computed: {
    total: function (){
      let total = 0
      if(this.addEditDailyForm.deptList.length > 0){
        this.addEditDailyForm.deptList.map((item, index, arr) => {
          total = total + Number(item.targetMoney || 0)
        })
      }      
      return total
    }
  },
  created() {  
    this.orgList = JSON.parse(sessionStorage.getItem('orgList'))
    this.setFormOrgUuid()
    this.getDeptDailyList()
  },
  methods: {
    numberFormatter: function (row, column, cellValue){
      return cellValue.toFixed(4)
    },
    setFormOrgUuid: function (){
      this.searchForm.orgUuid = this.orgUuid
      this.getDailyDetailForm.orgUuid = this.orgUuid
      this.addEditDailyForm.orgUuid = this.orgUuid
    },
    changeOrg: function (){
      this.setFormOrgUuid()
      this.getDeptDailyList()
    },
    tabClick(tab, event){
      if(tab.index == 0){
        this.$router.push({name: 'departmentyearmbo' })
      }else if(tab.index == 1){
        this.$router.push({name: 'departmentmonthmbo' })
      }
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
    dailyFormatter(row, column, cellValue){
      if(row.endTime && row.startTime){
        return row.startTime.replace(/-/g, '.').slice(5) + '-' + row.endTime.replace(/-/g, '.').slice(5)
      }else{
        return row.daily.slice(8)
      }
    },
    getDeptDailyList: function(){
      this.$smoke_post(getDeptDailyList, this.searchForm).then(res => {
        if(res.code == 200){
          this.dailyTableList = res.data[0].list
        }
      })
    },
    editDialyTarget: function (row){
      this.addEditDailyParams.visible = true
      this.addEditDailyParams.type = 2
      this.addEditDailyParams.title = '编辑日目标'      
      this.addEditDailyForm.time = new Date(row.daily).getTime()
      this.getDailyDetailForm.time = new Date(row.daily).getTime()
      this.getDailyDetail()
    },
    addDialyTarget: function (){
      this.addEditDailyParams.visible = true
      this.addEditDailyParams.type = 1
      this.addEditDailyParams.title = '新增日目标'
      this.addEditDailyForm.time = this.curTime
      this.getDailyDetailForm.time = this.curTime
      this.getDailyDetail()
    },
    getDailyDetail: function (){
      this.$smoke_post(getDeptDailyDetail, this.getDailyDetailForm).then(res => {
        if(res.code == 200){
          this.currentDailyData = res.data
          this.addEditDailyForm.deptList = []
          this.currentDailyData.deptList.map((item, index, arr)=> {
            this.addEditDailyForm.deptList.push({
              name: item.name,
              targetMoney: item.target || 0,
              uuid: item.uuid,
              disable: item.disable
            })
          })
          this.currentDailyData.userList.map((item, index, arr)=> {
            this.addEditDailyForm.deptList.push({
              name: item.name,
              type: item.type,
              targetMoney: item.target || 0,
              uuid: item.uuid,
              orgUserId: item.orgUserId
              // label: item.daily.split('-')[2] + '日'
            })
          })
        }
      })
    },
    changeDaily(){
      this.getDailyDetailForm.time = this.addEditDailyForm.time
      this.getDailyDetail()
    },
    submitAddEditDaily: function (){
      this.$refs['addEditDailyForm'].validate((valid) => {
        if(valid){
          if(this.currentDailyData.target > this.total){
            this.$message.error('下属组织目标合计需大于上级组织目标')
          }else{
            this.$smoke_post(addOrEditDeptDaily, this.addEditDailyForm).then(res => {
              if(res.code == 200){
                this.addEditDailyParams.visible = false
                if(this.searchForm.yearOrMonths[0] == this.addEditDailyForm.time){
                  this.getDeptDailyList()
                }
                this.$message({
                  message: '添加成功',
                  type: 'success'
                })
              }else{
                this.addEditDailyParams.visible = false
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
.target-num{
 padding: 5px;
 background-color: #999;
 color: #fff;
 margin-left: 16px;
}
.el-form{
  /deep/.el-form-item{
    .el-form-item__label{
      width: 80px !important;
    }
    .el-form-item__content{
      margin-left: 80px !important;
      .el-input{
        width: 50%;
      }
      .el-input-number{
        .el-input{
          width: 100%;
        }
      }
    }
    
      .el-date-editor.el-input, .el-date-editor.el-input__inner{
        width: 140px;
      }
  }
  #dialyTarget{
    flex-wrap: wrap;
    /deep/.el-form-item{
      width: 20%;
      .el-form-item__label{
        width: 50px !important;
        padding-right: 10px !important;
      }
      .el-form-item__content{
        margin-left: 50px !important;
      }
    }
  }
}

.el-progress{
  margin-top: 10px;
  /deep/.el-progress-bar{
    padding-right: 66px;
    margin-right: -66px;
  }
}
</style>