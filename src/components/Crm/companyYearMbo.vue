<template>
  <el-main class="index-main">
    <el-tabs type="border-card" v-model="tabActiveName" tab-position="top" @tab-click="tabClick">
      <el-tab-pane label="年目标" name="year">
        <el-row type="flex" justify="space-between">
          <el-col :span="4">
            <el-row type="flex" justify="start" :gutter="20">
              <el-col :span="18">
                <el-date-picker
                  v-model="searchForm.yearOrMonths[0]"
                  type="year"
                  placeholder="选择年"
                  value-format="timestamp"
                  size="mini">
                </el-date-picker>
              </el-col>
              <el-col :span="4">
                <el-button size="mini" type="primary" @click="searchYearList">查询</el-button>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="4" class="text-right">
            <el-button size="mini" type="primary" @click="addYearTarget">新增</el-button>
          </el-col>
        </el-row>
        <el-table class="mt20" :data="monthTableList" v-loading="loading" :height="tableHeight">
          <el-table-column v-for="(item, index) in monthTableColumn" :prop="item.prop" :label="item.label" :key="index" :formatter="item.formatter"></el-table-column>
          <el-table-column label="完成率" align="center">
            <template slot-scope="scope">
              <el-progress :percentage="computedPercentage(scope.row) >= 100 ? 100 : computedPercentage(scope.row)" :format="computedPercentage(scope.row, 1)"></el-progress>
            </template>
          </el-table-column>
          <el-table-column label="未完成（万元）" align="center">
            <template slot-scope="scope">
              <span :class="scope.row.yearTarget < scope.row.yearComplete ? 'red' : ''">{{scope.row.yearTarget < scope.row.yearComplete ? '超￥' + (scope.row.yearTarget - scope.row.yearComplete).toFixed(4).slice(1) : '￥' + (scope.row.yearTarget - scope.row.yearComplete).toFixed(4)}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="70" align="center">
            <template slot-scope="scope">
              <svg-icon @click.native.prevent="editYearTarget(scope.row)" icon-title="修改" icon-class="edit" />
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="月目标" name="month">月</el-tab-pane>
      <el-tab-pane label="日目标" name="day">日</el-tab-pane>
    </el-tabs>
    <el-dialog class="beautiful-title" :visible.sync="addEditYearParams.visible" :title="addEditYearParams.title" width="500px">
      <el-form :model="addEditYearForm" ref="addEditYearForm" label-width="160px !important" :rules="addEditYearRules">
        <el-form-item label="年度" prop="yearTime">
          <el-col :span="16">
            <el-date-picker
              v-model="addEditYearForm.yearTime"
              type="year"
              placeholder="选择年"
              :pickerOptions="pickerOptions"
              value-format="timestamp"
              @change="changeYear">
            </el-date-picker>
          </el-col>
        </el-form-item>  
        <el-form-item label="上一年总流水(万元)">
          <el-input disabled :value="lastYearComplete"></el-input>
        </el-form-item> 
        <el-form-item label="流水目标（万元）" prop="yearTarget">
          <el-col :span="162">
            <el-input-number :min="0" v-model="addEditYearForm.yearTarget"></el-input-number>
          </el-col>          
        </el-form-item>     
        <el-row :gutter="20" class="text-center">
          <el-col>
            <el-button @click="addEditYearParams.visible = false">取消</el-button> 
            <el-button type="primary" @click="submitAddEditYear">保存</el-button>           
          </el-col>
        </el-row>     
      </el-form>      
    </el-dialog>
  </el-main>
</template>
<script>
import {getYearTargetList, getLastYear, getComYearDetail, addOrEditYearTarget} from '@/request/api'
import {timestampToTime, formatComputed} from '@/assets/js/common'
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
          return time.getTime() < Date.now();
        }
      },
      lastYearCompleteForm: {
        yearTime: ''
      },
      tabActiveName: 'year',
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
          label: '年',
          prop: 'yearTime',
          formatter: this.timeFormatter
        },
        {
          label: '流水目标（万元）',
          prop: 'yearTarget',
          formatter: this.numberFormatter
        },
        {
          label: '完成流水（万元）',
          prop: 'yearComplete',
          formatter: this.numberFormatter
        }
      ],
      addEditYearParams: {
        title: '新增年目标',
        visible: false,
        type: 1, //1-添加 2-编辑
      },
      addEditYearForm: {
        yearTime: '',
        yearTarget: '',
        uuid: ''
      },
      addEditYearRules:{
        yearTime: [
          {required: true, message: '请选择要设置的目标年度', trigger: 'blur'}
        ],
        yearTarget: [
          {required: true, message: '请输入目标额度', trigger: 'blur'},
          {validator: validateNumber, trigger: 'change'}
        ]
      },
      addEditYear: '',
      lastYearComplete: '',
      loading: true
    }
  },
  created() {  
    this.getYearTargetList()
  },
  methods: {
    numberFormatter: function (row, column, cellValue){
      return cellValue.toFixed(4)
    },
    getLastYear: function (){
      this.$smoke_post(getLastYear, this.lastYearCompleteForm).then((res) => {
        if(res.code == 200){
          this.lastYearComplete = res.data.lastComplete
          this.addEditYearForm.yearTarget = res.data.currentTarget
        }
      })
    },
    getComYearDetail: function (){
      this.$smoke_post(getComYearDetail, {yearTime: this.addEditYearForm.yearTarget}).then(res => {
        if(res.data == 200){
          this.addEditYearForm.yearTarget = res.data.yearTarget
        }
      })
    },
    searchYearList: function (){  
      if(!this.searchForm.yearOrMonths[0]){
        this.$message({
          type: 'error',
          message: '请选择年份'
        })
      }else{
        this.getYearTargetList()
      }
      
    },
    tabClick(tab, event){
      if(tab.index == 1){
        this.$router.push({name: 'companymonthmbo' })
      }else if(tab.index == 2){
        this.$router.push({name: 'companydaymbo' })
      }
    },
    computedPercentage(row, format){
      if(!row.yearComplete || !row.yearTarget){
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
            return Number((row.yearComplete / row.yearTarget * 100).toFixed(2)) + '%'
          }
        }else{
          return Number((row.yearComplete / row.yearTarget * 100).toFixed(2))
        }
      }
    },
    timeFormatter(row, column, cellValue){
      return timestampToTime(Number(cellValue)).slice(0, 4)
    },
    getYearTargetList: function(){
      this.loading = true
      this.$smoke_post(getYearTargetList, this.searchForm).then(res => {
        if(res.code == 200){
          this.monthTableList = res.data
          this.$emit('setTableHeight', res.data.length)

        }
        this.loading = false
      })
    },
    changeYear: function (){
      this.lastYearCompleteForm.yearTime = this.addEditYearForm.yearTime
      this.getLastYear()
      // this.getComYearDetail()
    },
    editYearTarget: function (row){
      this.addEditYearParams.visible = true
      this.addEditYearParams.type = 2
      this.addEditYearParams.title = '编辑年目标'
      this.addEditYearForm.yearTime = row.yearTime
      this.lastYearCompleteForm.yearTime = row.yearTime
      this.addEditYearForm.yearTarget = row.yearTarget
      this.addEditYearForm.uuid = row.uuid
      this.getLastYear()
    },
    addYearTarget: function (){
      const resetTime = timestampToTime(this.curTime).slice(0, 4)
      this.addEditYearParams.visible = true
      this.addEditYearParams.type = 1
      this.addEditYearParams.title = '添加年目标'
      // 重置表单
      this.addEditYear = ''
      this.addEditYearForm.yearTime = this.curTime
      this.lastYearCompleteForm.yearTime = this.curTime
      this.addEditYearForm.yearTarget = ''
      this.addEditYearForm.uuid = ''
      this.getLastYear()
    },
    submitAddEditYear: function (){
      const searchYear = timestampToTime(Number(this.addEditYearForm.yearTime)).slice(0, 4),
      addEditYear = timestampToTime(Number(this.searchForm.yearOrMonths[0])).slice(0, 4)
      this.$refs['addEditYearForm'].validate((valid) => {
        if(valid){
          this.$smoke_post(addOrEditYearTarget, this.addEditYearForm).then(res => {
            if(res.code == 200){
              this.addEditYearParams.visible = false
              if(searchYear == addEditYear){
                this.getYearTargetList()  
              }
              this.$message({
                message: '添加成功',
                type: 'success'
              })
            }else{
              this.addEditYearParams.visible = false
              this.$message.error(res.msg)
            }
          })
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
.el-date-editor.el-input, .el-date-editor.el-input__inner{
  width: 100%;
}
</style>