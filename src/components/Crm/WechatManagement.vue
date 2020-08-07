<template>
<el-main class="index-main">
  <el-row :gutter="20" type="flex">
    <el-col :span="7">
      <el-date-picker
        v-model="dateRange"
        size="small"
        type="daterange"
        value-format='timestamp'
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="changeDateRange">
      </el-date-picker>
    </el-col>
    <el-col :span="4">
      <el-cascader
        v-model="searchForm.orgList"
        class="smoke-cascader1"
        ref="cascader"
        size="small"
        placeholder="请选择坐席组织架构"
        collapse-tags
        :show-all-levels='true'
        :options="zuzhiOptions"
        @change='handleZuzhiChange'
        filterable
        :props="{ checkStrictly: true, label: 'name', value: 'uuid', children: 'list', multiple: true }"
        clearable>
      </el-cascader>
    </el-col>
    <el-col :span="4">
      <el-input size="small" v-model="searchForm.saleName" placeholder="请输入坐席名字"></el-input>
    </el-col>
    <el-col :span="4">
      <el-button type="primary" size="small" @click="searchList">查询</el-button>
    </el-col>
    <el-col :span="5">
      <el-button v-if="buttonMap.addWechatNum" type="primary" size="small" @click="addWechatData" style="float: right;">新增</el-button>
    </el-col>
  </el-row>
  <el-table 
  :data="list"  
  >
    <el-table-column
    v-for="(item, index) in tableProps"
    :key="index"
    :prop="item.prop"
    :label="item.label">
      <template slot-scope="scope">
        <span>{{scope.row[item.prop] || '- -'}}</span>
      </template>
    </el-table-column>
    <el-table-column label="操作" v-if="buttonMap.editWechatNum" width="70">
      <template slot-scope="scope">
        <svg-icon @click.native.prevent="editWechatNumHandle(scope.$index, scope.row)" icon-title="修改" icon-class="edit" />
      </template>
    </el-table-column>
  </el-table>
  <el-pagination
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="searchForm.currentPage"
    :page-sizes="[10, 20, 30, 50, 100]"
    :page-size="searchForm.pageSize"
    layout="total, sizes, prev, pager, next, jumper"
    :total="searchForm.total"
    style="text-align: right;">
  </el-pagination>
  <el-dialog :visible.sync="dialogVisible" width="300px" :close-on-click-modal="false">
    <el-form ref="addWechatNumForm" :model="addWechatNumForm" label-position="top" :rules="addNumRule">
      <el-form-item label="今日添加客户微信数" prop="num">
        <el-input v-model="addWechatNumForm.num" type="number" min="0"></el-input>
      </el-form-item>
      <el-button type="primary" @click="submitAddWechatData">保存</el-button>
    </el-form>    
  </el-dialog>
</el-main>
</template>
<script>
import {clTeaOrgFilterBox, wxNumList, upWxNum} from '@/request/api'
export default {
  data() {
    return {
      buttonMap: {},
      searchForm: {
        startTime: '',
        endTime: '',
        orgList: [],
        saleName: '',
        userUuid: '',
        total: 0,
        pageSize: 20,
        currentPage: 1
      },
      addWechatNumForm: {
        num: 0,
        saleUuid: ''
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      list: [],
      tableProps: [{
        label: '坐席',
        prop: 'saleName'
      },{
        label: '新增客户微信数量',
        prop: 'num'
      },{
        label: '累计客户微信数量',
        prop: 'countNum'
      }],
      dateRange: [],
      zuzhiOptions: [],
      dialogVisible: false,
      addNumRule: {
        num: [
          {
            required: true, message: '请输入页面名称', trigger: 'blur'
          },
          {
            min: 0, message: '请输入大于0的数字', trigger: 'blur'
          }
        ]
      }
    }
  },
  created(){
    this.getWxNumList()
    this.clTeaOrgFilterBox()
    this.searchForm.userUuid = localStorage.getItem('userUuid')
    this.buttonMap = JSON.parse(localStorage.getItem("buttonMap"));
  },
  methods: {    
    getWxNumList(){
      this.$smoke_post(wxNumList, this.searchForm).then(res => {
        if(res.code == 200){
          this.list = res.data.list
          this.searchForm.total = res.data.total
        }
      })
    },
    changeDateRange(){
      this.searchForm.startTime = this.dateRange[0]
      this.searchForm.endTime = this.dateRange[1]
    },
    clTeaOrgFilterBox() {
      this.$smoke_get(clTeaOrgFilterBox, {}).then(res => {
        if(res.code == 200) {
          this.zuzhiOptions = res.data;
        }
      })
    },
    handleZuzhiChange(arr) {
      let brr = [];
      arr.map(res => {
        if(res.length == 1){
          brr.push(res[0]);
        }else{
          brr.push(res[res.length-1]);
        }
      })
      this.searchForm.orgList = brr
    },
    searchList(){
      this.getWxNumList()
    },
    submitAddWechatData(){
      this.$refs['addWechatNumForm'].validate((valid) => {
        if(valid){
          this.$smoke_post(upWxNum, this.addWechatNumForm).then(res => {
            if(res.code == 200){
              this.dialogVisible = false
              this.getWxNumList()
              this.$message({
                message: '添加成功',
                type: 'success'
              })
            }else{
              this.dialogVisible = false
              this.$message.error(res.msg)
            }
          })
        }
      })
    },
    addWechatData(){
      this.dialogVisible = true
      this.addWechatNumForm.saleUuid = ''
      this.addWechatNumForm.num = 0
    },
    editWechatNumHandle(index, row){
      this.addWechatNumForm.num = row.num
      this.addWechatNumForm.saleUuid = row.saleUuid
      this.dialogVisible = true
    },
    handleSizeChange(size){
      this.searchForm.pageSize = size
      this.getWxNumList()
    },
    handleCurrentChange(curPage){
      this.searchForm.currentPage = curPage
      this.getWxNumList()
    }
  }
}
</script>
<style lang="less" scoped>
.el-table, .el-pagination{
  margin-top: 20px;
}

/deep/.el-dialog{
  .el-dialog__body{
    height: 240px !important;
  }
  .el-form-item{
    display: flex;
    flex-direction: column;
    /deep/.el-form-item__label{
      width: 100% !important;
      text-align: left !important;
    }
    /deep/.el-form-item__content{
      margin-left: 0 !important;
      .el-form-item__error{
        margin: 10px 0;
      }
    }
  }
  .el-button{
    margin: 20px 0 0 80px;
  }
}

</style>