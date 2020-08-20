<template>
  <el-main class="index-main">
    <el-tabs v-model="tabActiveName" tab-position="top" @tab-click="tabClick">
      <el-tab-pane label="年" name="year">
        年
      </el-tab-pane>
      <el-tab-pane label="月" name="month">月</el-tab-pane>
      <el-tab-pane label="日" name="day">
        <el-row type="flex" justify="space-between">
          <el-col :span="6">
            <el-row type="flex" justify="start" :gutter="20">
              <el-col>                
                <el-date-picker
                v-model="searchForm.yearOrMonths[0]"
                type="month"
                placeholder="选择月"
                :pickerOptions="pickerOptions"
                value-format="timestamp"
                size="mini">
              </el-date-picker>
              </el-col>
              <el-col>
                <el-button size="mini" type="primary" @click="getDailyList">查询</el-button>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="4" class="text-right">
            <el-button size="mini" type="primary" @click="addDialyTarget">新增</el-button>
          </el-col>
        </el-row>
        <el-table :data="dailyTableList" :tree-props="{children: 'list', hasChildren: 'hasChildren'}" row-key="uuid">
          <el-table-column v-for="(item, index) in dailyTableColumn" :prop="item.prop" :label="item.label" :key="index" :formatter="item.formatter"></el-table-column>
          <el-table-column label="完成率">
            <template slot-scope="scope">
              <el-progress :percentage="computedPercentage(scope.row)"></el-progress>
            </template>
          </el-table-column>
          <el-table-column label="未完成">
            <template slot-scope="scope">
              {{scope.row.target - scope.row.complete}}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="70">
            <template slot-scope="scope">
              <svg-icon v-if="scope.row.daily" @click.native.prevent="editDialyTarget()" icon-title="修改" icon-class="edit" />
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <el-dialog :visible.sync="addEditDailyParams.visible" :title="addEditDailyParams.title" width="800px">
      <el-form :model="addEditDailyForm" ref="addEditDailyForm" :rules="addEditDailyRules">
        <el-row type="flex" style="align-items: center;" :gutter="20">
          <el-col :span="8">
            <el-date-picker
              v-model="getMonthForm.time"
              type="month"
              placeholder="选择月"
              :pickerOptions="pickerOptions"
              value-format="timestamp"
              size="mini"
              @change="getCurrentMonth">
            </el-date-picker>
          </el-col>
          <el-col :span="8">
            本月目标流水（万元）
            <span class="target-num">{{currentMonthData.monthTarget}}</span>
          </el-col>
        </el-row>  
        <el-row id="dialyTargetTitle" type="flex" justify="start" :gutter="10">
          <el-col><span>日期</span>流水目标(万元)</el-col>
          <el-col><span>日期</span>流水目标(万元)</el-col>
          <el-col><span>日期</span>流水目标(万元)</el-col>
          <el-col><span>日期</span>流水目标(万元)</el-col>
          <el-col><span>日期</span>流水目标(万元)</el-col>
        </el-row>
        <el-row type="flex" id="dialyTarget">
          <el-form-item v-for="(item, index) in addEditDailyForm.dailys" :label="item.label" :key="item.uuid">
            <el-input size="mini" v-model="item.target" :value="item.target">222</el-input>
          </el-form-item>
        </el-row>
        <el-row :gutter="20" type="flex" justify="end" class="text-right">
          <el-col>
            <el-button size="mini">取消</el-button> 
            <el-button type="primary" size="mini" @click="submitAddEditDaily">保存</el-button>           
          </el-col>
        </el-row>     
      </el-form>      
    </el-dialog>
  </el-main>
</template>
<script>
import {getCurrentMonth, getDailyList, getDailyDetail, addOrEditDailyTarget} from '@/request/api'
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
        yearOrMonths: [sessionStorage.getItem('curTime')]
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
          label: '流水目标（万元）',
          prop: 'target'
        },
        {
          label: '完成流水（万元）',
          prop: 'complete'
        }
      ],
      addEditDailyParams: {
        title: '新增日目标',
        visible: false,
        type: 1, //1-添加 2-编辑
      },
      addEditDailyForm: {
        time: sessionStorage.getItem('curTime'),
        dailys: []
      },
      addEditDailyRules:{
        time: [
          {required: true, message: '请选择要设置的目标年度和月份', trigger: 'blur'}
        ],
        dailys: [
          {required: true, message: '请输入目标额度', trigger: 'blur'}
        ]
      },
      getMonthForm: {
        time: sessionStorage.getItem('curTime')
      },
      addEditDailyYear: '',
      addEditDailyMonth: '',
      currentMonthData: {}
    }
  },
  created() {  
    this.getDailyList()
  },
  methods: {
    tabClick(tab, event){
      if(tab.index == 0){
        this.$router.push({name: 'companyyearmbo' })
      }else if(tab.index == 1){
        this.$router.push({name: 'companymonthmbo' })
      }
    },
    computedPercentage(row){
      if(!row.complete || !row.target) 
        return 0
      else
        return parseInt(row.complete / row.target)
    },
    dailyFormatter(row, column, cellValue){
      if(row.endTime && row.startTime){
        return row.startTime.replace(/-/g, '.').slice(5) + '-' + row.endTime.replace(/-/g, '.').slice(5)
      }else{
        return row.daily.slice(8)
      }
    },
    getDailyList: function(){
      this.$smoke_post(getDailyList, this.searchForm).then(res => {
        if(res.code == 200){
          this.dailyTableList = res.data[0].list
        }
      })
    },
    editDialyTarget: function (row){
      this.addEditDailyParams.visible = true
      this.addEditDailyParams.type = 2
      this.addEditDailyParams.title = '编辑日目标'
      this.getMonthForm.time = this.searchForm.yearOrMonths[0]
      this.getCurrentMonth()
    },
    addDialyTarget: function (){
      this.addEditDailyParams.visible = true
      this.addEditDailyParams.type = 1
      this.addEditDailyParams.title = '新增日目标'
      this.getCurrentMonth()
    },
    getCurrentMonth: function (){
      this.$smoke_post(getCurrentMonth, this.getMonthForm).then(res => {
        if(res.code == 200){
          this.currentMonthData = res.data
          const dailyList = res.data.dailyList
          this.addEditDailyForm.dailys = []
          dailyList.map((currentValue, index, arr)=> {
            this.addEditDailyForm.dailys.push({
              daily: currentValue.daily,
              target: currentValue.target,
              uuid: currentValue.uuid,
              label: currentValue.daily.split('-')[2] + '日'
            })
          })
        }
      })
    },
    changeAddEditDaily: function (){
      this.addEditDailyForm.time = new Date(this.addEditDaily).getTime()
      console.log(this.addEditDailyForm)
    },
    submitAddEditDaily: function (){
      this.$refs['addEditDailyForm'].validate((valid) => {
        if(valid){
          this.$smoke_post(addOrEditDailyTarget, this.addEditDailyForm).then(res => {
            if(res.code == 200){
              this.addEditDailyParams.visible = false
              if(this.addEditDailyParams.type == 2 || this.searchForm.yearOrMonths[0] == this.getMonthForm.time){
                this.getDailyList()
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
    }
  }
  #dialyTargetTitle{
    margin-top: 20px;
    .el-col{
      span{
        padding: 0 8px;
      }
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
}
</style>