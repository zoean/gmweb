<template>
  <el-main class="index-main">
    <el-row :class="['people-screen', {actionHide: toggleAction, actionShow: !toggleAction, noSearch: hideSearch}]" :gutter="20">
      <el-col :span="3">
          <el-input v-model="form.telephone" placeholder="请输入手机号" class="screen-li" size="small"></el-input>
      </el-col>
      <el-col :span="6">
        <el-button type="primary" size="small" @click="getClueDatasStashList">查询</el-button>
    </el-col>
  </el-row>
    <el-table :data="listData" 
    :height="tableHeight">
      <el-table-column v-for="(item, index) in columnList" :prop="item.prop" :min-width="item.width" :label="item.label">
      </el-table-column>
      <!-- <el-table-column prop="active" label="操作" fixed="right" width="60" class-name="table_active">
        <template slot-scope="scope">   
          <el-popconfirm
                    confirmButtonText='确定'
                    cancelButtonText='取消'
                    icon="el-icon-info"
                    iconColor="red"                    
                    placement="top"
                    title="确认还原该线索？"
                    @onConfirm="getBackClude(scope.row)"
                >       
          <svg-icon slot="reference" style="margin-left: 4px;" icon-title="还原线索" icon-class="release-grey" />
          </el-popconfirm>
        </template>
      </el-table-column> -->
    </el-table>
    <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total='form.total'
        :page-size='form.pageSize'
        :current-page='form.currentPage'
        :page-sizes="[10, 20, 30, 50, 100]"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
    >
    </el-pagination>
  </el-main>
</template>
<script>
import {getClueDatasStashList, rollbackClueDatas} from '@/request/api'
export default{
  name: 'refuseCludes',
  props: ['tableHeight','toggleAction', 'hideSearch'],
  data(){
    return {
      form: {
        currentPage: 1,
        pageSize: 20,
        total: 0,
        name: '',
        telephone: '',
        operateTime: ''
      },
      columnList: [
        { 'prop': 'telephone', 'label': '手机号码', 'width': 90 },
        { 'prop': 'name', 'label': '客户姓名' },
        { 'prop': 'operateTime', 'label': '删除时间', 'width': 180},
      ],
      listData: [],
      loadding: true,
    }
  },
  created(){
    this.getClueDatasStashList()
  },
  methods: {
    getClueDatasStashList(){
      this.$smoke_post(getClueDatasStashList, this.form).then(res => {
        if(res.code == 200){
          this.listData = res.data.list
          this.form.total = res.data.total
          this.$emit('setTableHeight', this.form.total, 0, 1)
          this.loadding = false
        }
      })
    },
    getBackClude(row){
      this.$smoke_post(rollbackClueDatas + row.datasUuid, {}).then(res => {
        if(res.code == 200){
          this.getClueDatasStashList()
          this.$message({
            type: 'success',
            message: '线索还原成功'
          })
        }
      })
    },
    
    handleCurrentChange(page) {
        this.form.currentPage = page;
        this.getClueDatasStashList();
    },
    handleSizeChange(size) {
        this.form.pageSize = size;
        this.form.currentPage = 1;
        this.getClueDatasStashList();
    },
  }
}
</script>
<style lang="less" scoped></style>