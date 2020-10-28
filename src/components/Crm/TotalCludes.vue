<template>
  <el-main class="index-main">
    <el-row class="people-screen" :gutter="20">
      <el-col :span="3">
        <el-input v-model="form.tel" size="small" placeholder="请输入手机号" class="screen-li"></el-input>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" size="small" @click="getList">查 询</el-button>
      </el-col>
    </el-row>
    <el-table :data="list" class="mt20">
      <el-table-column v-for="(item, index) in columnList" :prop="item.prop" :label="item.label" :key="index" :formatter="item.formatter"></el-table-column>
    </el-table>
  </el-main>
</template>
<script>
import { telInquire } from '@/request/api'
import { timestampToTime } from '@/assets/js/common'
export default {
  data (){
    return {
      form: {
        tel: ''
      },
      list: [],
      columnList: [
        {'prop': 'tel', 'label': '手机号码'},
        {'prop': 'examItem', 'label': '考试项目'},
        {'prop': 'schoolName', 'label': '分校'},
        {'prop': 'spreadName', 'label': '渠道'},
        {'prop': 'attribution', 'label': '归属'},
        {'prop': 'accSaleName', 'label': '推广人'},
        {'prop': 'accName', 'label': '推广账号'},
        {'prop': 'createTime', 'label': '入库时间', 'formatter': this.parseTime},
        {'prop': 'orderState', 'label': '成单状态', 'formatter': this.parseOrderState}
      ]
    }
  },
  methods: {
    getList(){
      this.$smoke_post(telInquire, this.form).then(res => {
        if(res.code == 200){
          if(res.data.status){
            var arr = []
            arr[0] = res.data
            this.list = arr 
          }else{
            this.list = []
          }
        }else{
          this.list = []
          this.$message({
            type: 'error',
            message: res.msg
          })
        }
      })
    },
    parseTime(row, column, cellValue){
      return timestampToTime(Number(cellValue))
    },
    parseOrderState(row, column, cellValue){
      if(cellValue == 0){
        return '未成单'
      }else{
        return '已成单'
      }
    }
  }
}
</script>
<style lang="less"></style>