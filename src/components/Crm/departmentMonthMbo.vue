<template>
  <el-main class="index-main">
    <el-tabs row-key="id" v-model="tabActiveName" tab-position="top" @tab-click="tabClick">
      <el-tab-pane label="年" name="year">年</el-tab-pane>
      <el-tab-pane label="月" name="month">
        <el-row type="flex" justify="space-between">
          <el-col :span="6">
            <el-row type="flex" justify="start" :gutter="20">
              <el-col>
                <el-date-picker
                  v-model="searchForm.yearOrMonths[0]"
                  type="month"
                  placeholder="选择年"
                  value-format="timestamp"
                  size="mini"
                  :clearable="false">
                </el-date-picker>
              </el-col>
              <el-col>
                <el-button size="mini" type="primary" @click="searchMonthList">查询</el-button>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="4" class="text-right">
            <el-button size="mini" type="primary" @click="addMonthTarget">新增</el-button>
          </el-col>
        </el-row>
        <el-table :data="monthTableList" :tree-props="{children: 'list', hasChildren: 'hasChildren'}" row-key="uuid">
          <!-- <el-table-column v-for="(item, index) in monthTableColumn" :prop="item.prop" :label="item.label" :key="index" :formatter="item.formatter"></el-table-column> -->
          <el-table-column v-for="(item, index) in monthTableColumn" :prop="item.prop" :label="item.label" :key="index" :formatter="item.formatter"></el-table-column>
          <el-table-column label="完成率">
            <template slot-scope="scope">
              <el-progress :percentage="computedPercentage(scope.row)"></el-progress>
            </template>
          </el-table-column>
          <el-table-column label="未完成">
            <template slot-scope="scope">
              {{scope.row.target < scope.row.complete ? 100 : scope.row.target - scope.row.complete}}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="70">
            <template slot-scope="scope">
              <svg-icon v-if="scope.row.month" @click.native.prevent="editMonthTarget(scope.row)" icon-title="修改" icon-class="edit" />
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="日" name="day">日</el-tab-pane>
    </el-tabs>
    <el-dialog :visible.sync="addEditMonthParams.visible" :title="addEditMonthParams.title" width="500px">
      <el-form :model="addEditMonthForm" ref="addEditMonthForm" label-width="160px !important" :rules="addEditMonthRules">
        <el-form-item label="月份" prop="time">
          <el-col :span="16">
            <el-date-picker
              v-model="addEditMonthForm.time"
              type="month"
              placeholder="选择月份"
              :pickerOptions="pickerOptions"
              value-format="timestamp"
              size="mini"
              >
            </el-date-picker>
          </el-col>
        </el-form-item>           
        <el-row>
          <el-col>
            本年度目标流水（万元）
            <span class="target-num">{{monthDetailData.target || 0}}</span>
          </el-col>
        </el-row>        
        <el-row id="targetTitle">
          <el-col :span="12">
            分校
          </el-col>
          <el-col :span="12">流水目标（万元）</el-col>
        </el-row> 
        <el-row id="targetList">
          <el-form-item v-for="(item, index) in addEditMonthForm.deptList" :label="item.name" :key="item.uuid" prop="target">
            <el-input v-model="addEditMonthForm.deptList[index].targetMoney" size="mini"></el-input>
          </el-form-item>
        </el-row>         
        <el-row :gutter="20" type="flex" justify="end" class="text-right">
          <el-col>
            <el-button size="mini">取消</el-button> 
            <el-button type="primary" size="mini" @click="submitAddEditMonth">保存</el-button>           
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
        yearOrMonths: [sessionStorage.getItem('curTime')],
        orgUuid: sessionStorage.getItem('orgUuid')
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
          label: '军团',
          prop: 'name'
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
      monthListYear: '',
      addEditMonthParams: {
        title: '新增月目标',
        visible: false,
        type: 1, //1-添加 2-编辑
      },
      addEditMonthForm: {
        time: '',
        orgUuid: sessionStorage.getItem('orgUuid'),
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
        orgUuid: sessionStorage.getItem('orgUuid'),
        time: sessionStorage.getItem('curTime')
      }
    }
  },
  created() {   
    this.getMonthTargetList()
  },
  methods: {
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
        this.$router.push({name: 'departmentyearmbo' })
      }else if(tab.index == 2){
        this.$router.push({name: 'departmentdaymbo' })
      }
    },
    computedPercentage(row){
      if(row.complete == 0 || row.target == 0){
        return 0
      }else{
        return (row.complete / row.target * 100).toFixed(2)
      }
    },
    timeFormatter(row, column, cellValue){
      return timestampToTime(Number(cellValue)).slice(0, 4)
    },
    getMonthTargetList: function(){
      this.$smoke_post(getDeptMonthList, this.searchForm).then(res => {
        if(res.code == 200){
          this.monthTableList = res.data[0].list
          this.monthListYear = res.data[0].yearTime
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
              type: item.type
            })
          })
          this.monthDetailData.userList.map((item, index, arr) => {
            this.addEditMonthForm.deptList.push({
              name: item.name,
              targetMoney: item.target || 0,
              uuid: item.uuid,
              orgUserId: item.orgUserId,
              type: item.type
            })
          })
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
      this.getMonthDetailForm.time = this.curTime()
      this.getMonthDetail()
    },
    submitAddEditMonth: function (){
      this.$refs['addEditMonthForm'].validate((valid) => {
        if(valid){
          this.$smoke_post(addOrEditDeptMonth, this.addEditMonthForm).then(res => {
            console.log(res)
            if(res.code == 200){
              this.addEditMonthParams.visible = false
              this.getMonthTargetList()
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
    padding-right: 66px;
    margin-right: -66px;
  }
}
</style>