<template>
  <el-main class="index-main">
    <el-tabs v-model="tabActiveName" tab-position="top" @tab-click="tabClick">
      <el-tab-pane label="年" name="year">
        <el-row type="flex" justify="space-between">
          <el-col :span="6">
            <el-row type="flex" justify="start" :gutter="20">
              <el-col>
                <el-date-picker
                  v-model="searchForm.yearOrMonths[0]"
                  type="year"
                  placeholder="选择年"
                  :pickerOptions="pickerOptions"
                  value-format="timestamp"
                  size="mini">
                </el-date-picker>
              </el-col>
              <el-col>
                <el-button size="mini" type="primary" @click="searchYearList">查询</el-button>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="4" class="text-right">
            <el-button size="mini" type="primary" @click="addYearTarget">新增</el-button>
          </el-col>
        </el-row>
        <el-table :data="monthTableList">
          <el-table-column v-for="(item, index) in monthTableColumn" :prop="item.prop" :label="item.label" :key="index" :formatter="item.formatter"></el-table-column>
          <el-table-column label="完成率">
            <template slot-scope="scope">
              <el-progress :percentage="computedPercentage(scope.row)"></el-progress>
            </template>
          </el-table-column>
          <el-table-column label="未完成">
            <template slot-scope="scope">
              {{scope.row.yearTarget - scope.row.yearComplete}}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="70">
            <template slot-scope="scope">
              <svg-icon @click.native.prevent="editYearTarget(scope.row)" icon-title="修改" icon-class="edit" />
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="月" name="month">月</el-tab-pane>
      <el-tab-pane label="日" name="day">日</el-tab-pane>
    </el-tabs>
    <el-dialog :visible.sync="addEditYearParams.visible" :title="addEditYearParams.title" width="500px">
      <el-form :model="addEditYearForm" ref="addEditYearForm" label-width="160px !important" :rules="addEditYearRules">
        <el-form-item label="年度" prop="yearTime">
          <el-col :span="16">
            <el-date-picker
              v-model="addEditYearForm.yearTime"
              type="year"
              placeholder="选择年"
              :pickerOptions="pickerOptions"
              value-format="timestamp"
              size="mini">
            </el-date-picker>
          </el-col>
        </el-form-item>           
        <el-row>
          <el-col>
            上一年总流水（万元）
            <span class="target-num">{{lastYearComplete || 0}}</span>
          </el-col>
        </el-row>
        <el-form-item label="流水目标（万元）" prop="yearTarget">
          <el-col :span="162">
            <el-input type="number" v-model="addEditYearForm.yearTarget"></el-input>
          </el-col>          
        </el-form-item>     
        <el-row :gutter="20" type="flex" justify="end" class="text-right">
          <el-col>
            <el-button size="mini">取消</el-button> 
            <el-button type="primary" size="mini" @click="submitAddEditYear">保存</el-button>           
          </el-col>
        </el-row>     
      </el-form>      
    </el-dialog>
  </el-main>
</template>
<script>
import {getYearTargetList, getLastYear, getComYearDetail, addOrEditYearTarget} from '@/request/api'
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
          prop: 'yearTarget'
        },
        {
          label: '完成流水（万元）',
          prop: 'yearComplete'
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
      lastYearComplete: ''
    }
  },
  created() {   
    for(var i = this.curYear; i < (this.curYear + 3); i++){
      this.yearOptions.push({label: i, value: i + '-01-01'})
    }
    this.getYearTargetList()
  },
  methods: {
    getLastYear: function (){
      this.$smoke_post(getLastYear, this.lastYearCompleteForm).then((res) => {
        if(res.data == 200){
          this.lastYearComplete = res.data.lastYearComplete
        }
      })
    },
    searchYearList: function (){
      this.getYearTargetList()
    },
    tabClick(tab, event){
      if(tab.index == 1){
        this.$router.push({name: 'companymonthmbo' })
      }else if(tab.index == 2){
        this.$router.push({name: 'companydaymbo' })
      }
    },
    computedPercentage(row){
      return parseInt(row.yearComplete / row.yearTarget)
    },
    timeFormatter(row, column, cellValue){
      return timestampToTime(Number(cellValue)).slice(0, 4)
    },
    getYearTargetList: function(){
      this.$smoke_post(getYearTargetList, this.searchForm).then(res => {
        if(res.code == 200){
          this.monthTableList = res.data
        }
      })
    },
    changeYear: function (){
      this.searchForm.yearOrMonths[0] = new Date(this.selectYear).getTime()
      this.getYearTargetList()
    },
    editYearTarget: function (row){
      this.addEditYearParams.visible = true
      this.addEditYearParams.type = 2
      this.addEditYearParams.title = '编辑年目标'
      this.addEditYearForm.yearTime = row.yearTime
      this.lastYearCompleteForm.yearTime = row.yearTime
      this.addEditYearForm.yearTarget = row.yearTarget
      this.addEditYearForm.uuid = row.uuid
      console.log(this.lastYearCompleteForm.yearTime, timestampToTime(this.lastYearCompleteForm.yearTime))
      this.getLastYear()
    },
    addYearTarget: function (){
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
      this.$refs['addEditYearForm'].validate((valid) => {
        if(valid){
          this.$smoke_post(addOrEditYearTarget, this.addEditYearForm).then(res => {
            if(res.code == 200){
              this.addEditYearParams.visible = false
              // this.getWxNumList()
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
.target-num{
 padding: 5px;
 background-color: #999;
 color: #fff;
 margin-left: 16px;
}
.el-progress{
  margin-top: 10px;
}
</style>