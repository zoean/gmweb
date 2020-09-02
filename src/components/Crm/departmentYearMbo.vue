<template>
  <el-main class="index-main">
    <el-radio-group v-model="orgUuid" @change="changeOrg">
      <el-radio-button v-for="(item, index) in orgList" :label="item.orgUuid">{{item.orgName}}目标管理</el-radio-button>
    </el-radio-group>
    <el-tabs class="mt20" type="border-card" v-model="tabActiveName" tab-position="top" @tab-click="tabClick">
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
        <el-table class="mt20" :data="yearTableList" :tree-props="{children: 'list', hasChildren: 'hasChildren'}" row-key="uuid" v-loading="loading">
          <el-table-column v-for="(item, index) in yearTableColumn" :prop="item.prop" :label="item.label" :key="index" :formatter="item.formatter"></el-table-column>
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
              <svg-icon v-if="scope.row.name" @click.native.prevent="editYearTarget(scope.row)" icon-title="修改" icon-class="edit" />
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="月目标" name="month">月</el-tab-pane>
      <el-tab-pane label="日目标" name="day">日</el-tab-pane>
    </el-tabs>
    <el-dialog class="beautiful-title" :visible.sync="addEditYearParams.visible" :title="addEditYearParams.title" width="500px">
      <el-form :model="addEditYearForm" ref="addEditYearForm" label-width="160px !important" :rules="addEditYearRules">
        <el-form-item label="年度" prop="time">
          <el-col :span="16">
            <el-date-picker
              v-model="addEditYearForm.time"
              type="year"
              placeholder="选择年"
              :pickerOptions="pickerOptions"
              value-format="timestamp"
              @change="changeYear">
            </el-date-picker>
          </el-col>
        </el-form-item>      
        <el-form-item class="long-label" label="本年度该组织总目标（万元）">
          <el-input disabled :value="deptDetailData.target"></el-input>
        </el-form-item>  
        <el-form-item label="总计(万元)">
          <el-input disabled :value="total"></el-input>
        </el-form-item> 
        <el-row type="flex" class="mt10">
          <el-col class="text-right" :span="12">下属组织</el-col>
          <el-col class="ml16">流水目标（万元）</el-col>
        </el-row>
        <el-form-item v-for="(item, index) in addEditYearForm.deptList" :label="item.name" prop="targetMoney">
          <el-input-number :min="0" v-model="addEditYearForm.deptList[index].targetMoney"></el-input-number>
        </el-form-item>
        <el-row :gutter="20" class="text-center fixiedialog-margin">
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
import {getManageOrgList, getLastDeptYear, addOrEditDeptYear, getDeptYearDetail, getDeptYearList} from '@/request/api'
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
      yearDetailForm:{
        orgUuid: '',
        time: sessionStorage.getItem('curTime')
      },
      tabActiveName: 'year',
      curYear: Number(sessionStorage.getItem('curYear')),
      curTime: sessionStorage.getItem('curTime'),
      yearOptions:[],
      selectYear: '',
      searchForm: {
        yearOrMonths: [sessionStorage.getItem('curTime')],
        orgUuid: ''
      },
      yearTableList: [],
      yearTableColumn: [
        {
          label: '年',
          prop: 'time'
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
      addEditYearParams: {
        title: '新增年目标',
        visible: false,
        type: 1, //1-添加 2-编辑
      },
      addEditYearForm: {
        orgUuid: '',
        time: '',
        deptList: []
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
      orgList: [],
      orgUuid: sessionStorage.getItem('orgUuid'),
      deptDetailData: {},
      loading: true
    }
  },
  created() { 
    if(!sessionStorage.getItem('orgList')){
      this.getOrgInfo()
    }else{
      this.orgList = JSON.parse(sessionStorage.getItem('orgList'))
      sessionStorage.setItem('orgUuid', this.orgUuid)
      this.setFormOrgUuid()
    }    
  },  
  computed: {
    total: function (){
      let total = 0
      if(this.addEditYearForm.deptList.length > 0){
        this.addEditYearForm.deptList.map((item, index, arr) => {
          total = total + Number(item.targetMoney || 0)
        })
      }      
      return total
    }
  },
  methods: {
    numberFormatter: function (row, column, cellValue){
      return cellValue.toFixed(4)
    },
    setFormOrgUuid: function (){
      this.searchForm.orgUuid = this.orgUuid
      this.yearDetailForm.orgUuid = this.orgUuid
      this.addEditYearForm.orgUuid = this.orgUuid      
      this.getYearTargetList()
    },
    changeOrg: function (){
      this.setFormOrgUuid()
    },
    getOrgInfo: function (){
      this.$smoke_post(getManageOrgList).then(res => {
        if(res.code == 200){
          this.orgList = res.data
          this.orgUuid = this.orgList[0].orgUuid
          this.setFormOrgUuid()
          sessionStorage.setItem('orgList', JSON.stringify(this.orgList))          
          sessionStorage.setItem('orgUuid', this.orgUuid)
        }
      })
    },
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
        this.$router.push({name: 'departmentmonthmbo' })
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
    getYearTargetList: function(){
      this.loading = true
      this.$smoke_post(getDeptYearList, this.searchForm).then(res => {
        if(res.code == 200){
          this.loading = false
          this.yearTableList = res.data
        }
      })
    },
    changeYear(val){
      this.yearDetailForm.time = val
      this.getDeptYearDetail()
    },
    getDeptYearDetail: function (){
      this.$smoke_post(getLastDeptYear, this.yearDetailForm).then(res => {
        if(res.code == 200){
          this.deptDetailData = res.data
          this.addEditYearForm.time = this.yearDetailForm.time
          this.addEditYearForm.orgUuid = this.yearDetailForm.orgUuid
          this.addEditYearForm.deptList = []
          this.deptDetailData.deptList.map((item, index, arr) => {
            this.addEditYearForm.deptList.push({
              uuid: item.uuid,
              orgUserId: item.orgUserId,
              type: item.type,
              targetMoney: item.target || 0,
              name: item.name
            })
          })
          this.deptDetailData.userList.map((item, index, arr) => {
            this.addEditYearForm.deptList.push({
              uuid: item.uuid,
              orgUserId: item.orgUserId,
              type: item.type,
              targetMoney: item.target || 0,
              name: item.name
            })
          })
        }
      })
    },
    editYearTarget: function (row){
      this.addEditYearParams.visible = true
      this.addEditYearParams.type = 2
      this.addEditYearParams.title = '编辑年目标'
      this.getDeptYearDetail()
    },
    addYearTarget: function (){
      this.addEditYearParams.visible = true
      this.addEditYearParams.type = 1
      this.addEditYearParams.title = '添加年目标'
      this.getDeptYearDetail()
    },
    submitAddEditYear: function (){
      const searchYear = timestampToTime(Number(this.addEditYearForm.time)).slice(0, 4),
      addEditYear = timestampToTime(Number(this.searchForm.yearOrMonths[0])).slice(0, 4)
      this.$refs['addEditYearForm'].validate((valid) => {
        if(valid){
          if(this.deptDetailData.target > this.total){
            this.$message.error('下属组织目标合计需大于上级组织目标')
          }else{
            this.$smoke_post(addOrEditDeptYear, this.addEditYearForm).then(res => {
              if(res.code == 200){
                this.addEditYearParams.visible = false
                this.$message({
                  message: '添加成功',
                  type: 'success'
                })
                if(searchYear == addEditYear){
                  this.getYearTargetList()
                }
              }else{
                this.addEditYearParams.visible = false
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