<template>
  <el-main class="index-main">
    <el-tabs type="border-card" v-model="tabActiveName" tab-position="top" @tab-click="tabClick">
      <el-tab-pane label="年目标" name="year">
        年
      </el-tab-pane>
      <el-tab-pane label="月目标" name="month">月</el-tab-pane>
      <el-tab-pane label="日目标" name="day">
        <el-row type="flex" justify="space-between">
          <el-col :span="4">
            <el-row type="flex" justify="start" :gutter="20">
              <el-col :span="18">                
                <el-date-picker
                v-model="searchForm.yearOrMonths[0]"
                type="month"
                placeholder="选择月"
                value-format="timestamp"
                size="mini">
              </el-date-picker>
              </el-col>
              <el-col :span="4">
                <el-button size="mini" type="primary" @click="getComDailyList">查询</el-button>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="4" class="text-right">
            <el-button size="mini" type="primary" @click="addDialyTarget">新增</el-button>
          </el-col>
        </el-row>
        <el-table class="mt20" :data="dailyTableList" :tree-props="{children: 'list', hasChildren: 'hasChildren'}" row-key="uuid" v-loading="loading" :height="tableHeight">
          <el-table-column v-for="(item, index) in dailyTableColumn" :prop="item.prop" :label="item.label" :key="index" :formatter="item.formatter"></el-table-column>
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
              <svg-icon v-if="scope.row.daily" @click.native.prevent="editDialyTarget()" icon-title="修改" icon-class="edit" />
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <el-dialog class="beautiful-title" :visible.sync="addEditDailyParams.visible" :title="addEditDailyParams.title" width="800px">
      <el-form :model="addEditDailyForm" ref="addEditDailyForm" :rules="addEditDailyRules">
        <el-row type="flex" justify="start" :gutter="20">
          <el-col :span="7">
            月份
            <el-date-picker
              v-model="getMonthForm.time"
              type="month"
              placeholder="选择月"
              :pickerOptions="pickerOptions"
              value-format="timestamp"
              @change="getCurrentMonth">
            </el-date-picker>
          </el-col>
          <el-col :span="10">
            本月目标流水(万元)
            <el-input :value="currentMonthData.monthTarget" disabled></el-input>
          </el-col>
          <el-col :span="7">
            合计
            <el-input :value="total" disabled></el-input>
          </el-col>
        </el-row>  
        <el-row id="dialyTargetTitle" type="flex" justify="start" :gutter="10">
          <el-col><span>日期</span>流水目标(万元)</el-col>
          <el-col><span>日期</span>流水目标(万元)</el-col>
          <el-col><span>日期</span>流水目标(万元)</el-col>
        </el-row>
        <el-row type="flex" id="dialyTarget">
          <el-form-item v-for="(item, index) in addEditDailyForm.dailys" :label="item.label" :key="item.uuid">
            <el-input-number :min="0" v-model="item.target" :value="item.target" :disabled="item.disabled"></el-input-number>
          </el-form-item>
        </el-row>
        <el-row :gutter="20" class="text-center fixiedialog-margin">
          <el-col>
            <el-button @click="addEditDailyParams.visible = false">取消</el-button> 
            <el-button type="primary" @click="submitAddEditDaily">保存</el-button>           
          </el-col>
        </el-row>     
      </el-form>      
    </el-dialog>
  </el-main>
</template>
<script>
import {getCurrentMonth, getComDailyList, getComDailyDetail, addOrEditDailyTarget} from '@/request/api'
import {timestampToTime, formatNumber} from '@/assets/js/common'
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
      currentMonthData: {},
      loading: true
    }
  },    
  computed: {
    total: function (){
      let total = 0
      if(this.addEditDailyForm.dailys.length > 0){
        this.addEditDailyForm.dailys.map((item, index, arr) => {
          total = total + Number(item.target || 0)
        })
      }      
      return total
    }
  },
  created() {  
    this.getComDailyList()
  },
  methods: {    
    numberFormatter: function (row, column, cellValue){
      return cellValue.toFixed(4)
    },
    tabClick(tab, event){
      if(tab.index == 0){
        this.$router.push({name: 'companyyearmbo' })
      }else if(tab.index == 1){
        this.$router.push({name: 'companymonthmbo' })
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
    getComDailyList: function(){
      if(!this.searchForm.yearOrMonths[0]){
        this.$message({
          type: 'error',
          message: '请选择日期'
        })
      }else{
        this.loading = true
        this.$smoke_post(getComDailyList, this.searchForm).then(res => {
          this.loading = false
          if(res.code == 200 && res.data.length > 0){
            this.dailyTableList = res.data[0].list
            this.$emit('setTableHeight', res.data[0].list.length)
          }
        })
      }      
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
      this.addEditDailyForm.time = this.getMonthForm.time
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
              label: currentValue.daily.split('-')[2] + '日',
              disabled: currentValue.disabled
            })
          }) 
        }
      })
    },
    submitAddEditDaily: function (){
      const searchMonth = timestampToTime(Number(this.searchForm.yearOrMonths[0])).slice(0, 7),
      addEditDaily = timestampToTime(Number(this.getMonthForm.time)).slice(0, 7)
      this.$refs['addEditDailyForm'].validate((valid) => {
        if(valid){
          if(this.currentMonthData.monthTarget > this.total){
            this.$message.error('公司日目标合计需大于月目标')
          }else{
            this.$smoke_post(addOrEditDailyTarget, this.addEditDailyForm).then(res => {
              if(res.code == 200){
                this.addEditDailyParams.visible = false
                if(searchMonth == addEditDaily){
                  this.getComDailyList()
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
.index-main{
  margin-top: 15px;
}
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
      width: 238px;
      span{
        padding-right: 10px;
        width: 50px;
        display: inline-block;
        text-align: center;
      }
    }
  }
  #dialyTarget{
    flex-wrap: wrap;
    /deep/.el-form-item{
      width: 32%;
      .el-form-item__label{
        width: 50px !important;
        padding-right: 10px !important;
      }
      .el-form-item__content{
        margin-left: 50px !important;
        .el-input{
          width: 80px;
        }
        .el-input-number{
          .el-input{
            width: 100%;
          }
        }
      }
    }
  }
}
.el-progress{
  margin-top: 10px;
  /deep/.el-progress-bar{
    padding-right: 68px;
    margin-right: -68px;
  }
}
.el-form{
  .el-input{
    width: 140px;
  }
}
.el-date-editor.el-input, .el-date-editor.el-input__inner{
  width: 160px;
}
</style>