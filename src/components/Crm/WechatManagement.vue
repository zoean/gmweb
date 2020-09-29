<template>
<el-main class="index-main">
  <el-row class="people-screen">
    <el-col :span="6">
      <el-date-picker
        v-model="dateRange"
        size="small"
        type="daterange"
        value-format='timestamp'
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        style="width: 97%"
        @change="changeDateRange">
      </el-date-picker>
    </el-col>
    <el-col :span="4">
      <el-cascader
        size="small"
        placeholder="请选择坐席组织架构"
        :options="orgOptions"
        :props="props"
        class="screen-li"
        collapse-tags
        :show-all-levels=false
        @change="orgChange"
        ref="cascaderOrg">
      </el-cascader>
    </el-col>
    <el-col :span="3">
      <el-input size="small" v-model="searchForm.saleName" class="screen-li" placeholder="请输入坐席名字"></el-input>
    </el-col>
    <el-col :span="3">
      <el-button type="primary" size="small" @click="searchList">查询</el-button>
    </el-col>
    <el-col :span="8">
      <el-button v-if="buttonMap.addWechatNum" type="primary" size="small" @click="addWechatData" style="float: right;">新增</el-button>
    </el-col>
  </el-row>

  <div class="number_search" style="margin-top: 10px;"><svg-icon style="font-size: 14px; margin-left: 10px; cursor: default;" icon-title="" icon-class="tanhao" />
本次查询【新增客户微信数量】合计：{{countVO.num || 0}}，【累计客户微信数量】合计：{{countVO.countNum || 0}}</div>

  <el-table 
  :data="list"  
  @sort-change="sortChange"
  v-loading="loading"
  :height="tableHeight"
  >
    <el-table-column
    v-for="(item, index) in tableProps"
    :key="index"
    :prop="item.prop"
    :sortable="item.prop == 'num' ? 'custom' : item.prop == 'countNum' ? 'custom' : false"
    :label="item.label">
      <!-- <template slot-scope="scope">
        <span>{{scope.row[item.prop] || '- -'}}</span>
      </template> -->
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
  <el-dialog class="beautiful-title" title="新增/编辑微信数量" :visible.sync="dialogVisible" width="400px" :close-on-click-modal="false">
    <el-form ref="addWechatNumForm" :model="addWechatNumForm" label-width="160px !important" :rules="addNumRule">
      <el-form-item label="今日添加客户微信数" prop="num">
        <el-input-number v-model="addWechatNumForm.num" :min=0></el-input-number>
      </el-form-item>
      <el-row class="text-center mt20">
        <el-col>
          <el-button type="primary" @click="submitAddWechatData">保存</el-button>
        </el-col>
      </el-row>
      
    </el-form>    
  </el-dialog>
</el-main>
</template>
<script>
import {getOrgSubsetByUuid, wxNumList, upWxNum} from '@/request/api';
import {sortTextNum} from '@/assets/js/common';
import {wechatOrgUuidProd, wechatOrgUuidTest} from '@/assets/js/data'
export default {
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
      buttonMap: {},
      searchForm: {
        startTime: '',
        endTime: '',
        orgList: [],
        saleName: '',
        userUuid: '',
        total: 0,
        pageSize: 20,
        currentPage: 1,
        sortSet: [], //排序集合
      },
      sortSetList: [
        {'num': ''},
        {'countNum': ''},
      ],
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
      orgOptions: [],
      props: {
        value: 'uuid',
        label: 'name',
        children: 'includeSubsetList',
        multiple: true,
        checkStrictly: true
      },
      dialogVisible: false,
      addNumRule: {
        num: [
          {
            required: true, message: '请输入今日添加微信数', trigger: 'blur'
          },{
            validator: validateNumber, trigger: 'change'
          }
        ]
      },
      countVO: {},
      loading: true
    }
  },
  created(){
    this.getWxNumList()
    this.getOrgSubsetByUuid()
    this.searchForm.userUuid = localStorage.getItem('userUuid')
    this.buttonMap = JSON.parse(localStorage.getItem("buttonMap"));
  },
  methods: {
    sortChange(data) {
      this.searchForm.sortSet = [];
      const id = sortTextNum(data.prop);
      if(data.order == "descending"){
          this.sortSetList[id][data.prop] = 'DESC';
      }else if(data.order == "ascending"){
          this.sortSetList[id][data.prop] = 'ASC';
      }
      this.searchForm.sortSet.push(this.sortSetList[id]);
      this.getWxNumList();
    },
    inputExcludeE(value){
      if(value.match(/[^\d]/)){
        return Number(value.replace(/[^\d]/g, ''))
      }
    }, 
    getWxNumList(){
      this.loading = true
      this.$smoke_post(wxNumList, this.searchForm).then(res => {
        if(res.code == 200){
          this.loading = false
          this.list = res.data.list
          this.countVO = res.data.countVO || 0;
          this.searchForm.total = res.data.total
          this.$emit('setTableHeight', this.searchForm.total, 1)
        }
      })
    },
    changeDateRange(){
      this.searchForm.startTime = this.dateRange ? this.dateRange[0] : ''
      this.searchForm.endTime =this.dateRange ? this.dateRange[1] : ''
    },
    getOrgSubsetByUuid() {
      console.log(process.env.VUE_APP_GM_JHWX);
      let uuid = '';
      if(process.env.VUE_APP_GM_JHWX == 'https://testgm.jhwx.com'){
        uuid = wechatOrgUuidTest;
      }else{
        uuid = wechatOrgUuidProd;
      }
      this.$smoke_post(getOrgSubsetByUuid, {
        uuid: uuid
      }).then(res => {
        if(res.code == 200) {
          this.orgOptions = res.data;
        }
      })
    },
    orgChange(){
      this.searchForm.orgList = []
      let checkedArray = this.$refs['cascaderOrg'].checkedValue
      checkedArray.forEach((item, index, array) => {
        this.searchForm.orgList.push(item[item.length - 1])
      })
    },
    searchList(){
      this.searchForm.currentPage = 1
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
.index-main{
  margin-top: 15px;
  .el-col-6{
    height: auto !important;
  }
  .people-screen{
    margin-bottom: 10px;
    .screen-li{
        width: 94%;
    }
  }
}

/deep/.el-dialog{
  .el-dialog__body{
    height: 240px !important;
  }
  .el-form-item{
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
}

</style>