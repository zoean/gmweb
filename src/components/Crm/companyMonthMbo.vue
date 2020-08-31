<template>
  <el-main class="index-main">
    <el-tabs type="border-card" row-key="id" v-model="tabActiveName" tab-position="top" @tab-click="tabClick">
      <el-tab-pane label="年目标" name="year">年</el-tab-pane>
      <el-tab-pane label="月目标" name="month">
        <el-row type="flex" justify="space-between">
          <el-col :span="8">
            <el-row type="flex" justify="start" :gutter="20">
              <el-col :span="17">
                <el-date-picker
                  v-model="searchForm.yearOrMonths[0]"
                  type="year"
                  placeholder="选择年"
                  value-format="timestamp"
                  size="mini"
                  :clearable="false">
                </el-date-picker>
              </el-col>
              <el-col :span="5">
                <el-button size="mini" type="primary" @click="searchMonthList">查询</el-button>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="4" class="text-right">
            <el-button size="mini" type="primary" @click="addMonthTarget">新增</el-button>
          </el-col>
        </el-row>
        <el-table class="mt20" :data="monthTableList" :tree-props="{children: 'list', hasChildren: 'hasChildren'}" row-key="uuid">
          <!-- <el-table-column v-for="(item, index) in monthTableColumn" :prop="item.prop" :label="item.label" :key="index" :formatter="item.formatter"></el-table-column> -->
          <el-table-column v-for="(item, index) in monthTableColumn" :prop="item.prop" :label="item.label" :key="index" :formatter="item.formatter"></el-table-column>
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
              <svg-icon v-if="scope.row.month" @click.native.prevent="editMonthTarget" icon-title="修改" icon-class="edit" />
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="日目标" name="day">日</el-tab-pane>
    </el-tabs>
    <el-dialog class="beautiful-title" :visible.sync="addEditMonthParams.visible" :title="addEditMonthParams.title" width="500px">
      <el-form :model="addEditMonthForm" ref="addEditMonthForm" label-width="160px !important" :rules="addEditMonthRules">
        <el-form-item label="年度" prop="yearTime">
          <el-col :span="16">
            <el-date-picker
              v-model="getCurrentYearForm.yearTime"
              type="year"
              placeholder="选择年"
              :pickerOptions="pickerOptions"
              value-format="timestamp"
              @change="getCurrentYear">
            </el-date-picker>
          </el-col>
        </el-form-item>  
        <el-form-item label="本年度目标流水(万元)">
          <el-input disabled :value="currentYearMonthData.yearTarget"></el-input>
        </el-form-item>  
        <el-form-item label="总计(万元)">
          <el-input disabled :value="total"></el-input>
        </el-form-item> 
        <el-row id="targetTitle">
          <el-col :span="12">
            月份
          </el-col>
          <el-col :span="12" class="text-left">流水目标（万元）</el-col>
        </el-row> 
        <el-row id="targetList">
          <el-form-item v-for="(item, index) in currentYearMonthData.monthList" :label="item.month" :key="item.uuid" prop="target">
            <el-input-number :min="0" :disabled="item.disabled" :value="item.target" v-model="addEditMonthForm.months[index].target"></el-input-number>
          </el-form-item>
        </el-row>         
        <el-row :gutter="20" class="text-center fixiedialog-margin">
            <el-button @click="addEditMonthParams.visible = false">取消</el-button> 
            <el-button type="primary" @click="submitAddEditMonth">保存</el-button> 
        </el-row>    
      </el-form>      
    </el-dialog>
  </el-main>
</template>
<script>
import {getCurrentYear, getComMonthList, getComMonthDetail, addOrEditMonthTarget} from '@/request/api'
import {timestampToTime} from '@/assets/js/common'
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
      tabActiveName: 'month',
      curYear: Number(sessionStorage.getItem('curYear')),
      curTime: sessionStorage.getItem('curTime'),
      yearOptions:[],
      selectYear: '',
      searchForm: {
        yearOrMonths: [sessionStorage.getItem('curTime')]
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
      addEditMonthParams: {
        title: '新增月目标',
        visible: false,
        type: 1, //1-添加 2-编辑
      },
      addEditMonthForm: {
        yearTime: sessionStorage.getItem('curTime'),
        months: [],
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
      getCurrentYearForm: {
        yearTime: sessionStorage.getItem('curTime')
      },
      currentYearMonthData: {}
    }
  },   
  computed: {
    total: function (){
      let total = 0
      if(this.addEditMonthForm.months.length > 0){
        this.addEditMonthForm.months.map((item, index, arr) => {
          total = total + Number(item.target || 0)
        })
      }      
      return total.toFixed(4)
    }
  },
  
  created() {   
    this.getMonthTargetList()
  },
  methods: {
    numberFormatter: function (row, column, cellValue){
      return cellValue.toFixed(4)
    },
    getCurrentYear: function (){
      this.addEditMonthForm.yearTime = this.getCurrentYearForm.yearTime
      this.$smoke_post(getCurrentYear, this.getCurrentYearForm).then(res => {
        if(res.code == 200){
          const monthList = res.data.monthList
          this.currentYearMonthData = res.data
          this.addEditMonthForm.months = []
          monthList.map((currentValue, index, arr)=>{
            this.addEditMonthForm.months.push({
              uuid: currentValue.uuid,
              month: currentValue.month,
              target: currentValue.target
            })
          })
          
        }
      })
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
      this.getMonthTargetList()
    },
    tabClick(tab, event){
      if(tab.index == 0){
        this.$router.push({name: 'companyyearmbo' })
      }else if(tab.index == 2){
        this.$router.push({name: 'companydaymbo' })
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
    timeFormatter(row, column, cellValue){
      return timestampToTime(Number(cellValue)).slice(0, 4)
    },
    getMonthTargetList: function(){
      this.$smoke_post(getComMonthList, this.searchForm).then(res => {
        if(res.code == 200){
          this.monthTableList = res.data[0].list
        }
      })
    },
    editMonthTarget: function (row){
      this.addEditMonthParams.visible = true
      this.addEditMonthParams.type = 2
      this.addEditMonthParams.title = '编辑月目标'
      this.getCurrentYearForm.yearTime = this.searchForm.yearOrMonths[0]
      this.getCurrentYear()
    },
    addMonthTarget: function (){
      this.addEditMonthParams.visible = true
      this.addEditMonthParams.type = 1
      this.addEditMonthParams.title = '添加月目标'
      this.addEditMonthForm.yearTime = this.curTime
      this.getCurrentYearForm.yearTime = this.curTime
      this.getCurrentYear()
    },
    submitAddEditMonth: function (){
      const searchYear = timestampToTime(Number(this.addEditMonthForm.yearTime)).slice(0, 4),
      addEditMonth = timestampToTime(Number(this.searchForm.yearOrMonths[0])).slice(0, 4)
      this.$refs['addEditMonthForm'].validate((valid) => {
        if(valid){
          if(this.currentYearMonthData.yearTarget > this.total){
            this.$message.error('公司月目标合计需大于日目标')
          }else{
            this.$smoke_post(addOrEditMonthTarget, this.addEditMonthForm).then(res => {
              if(res.code == 200){
                this.addEditMonthParams.visible = false
                if(searchYear == addEditMonth){
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
.target-num{
 padding: 5px;
 background-color: #999;
 color: #fff;
 margin-left: 16px;
}
#targetTitle{
  margin-top: 20px;
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
}
</style>