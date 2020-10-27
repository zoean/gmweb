<template>
  <el-main class="index-main">
    <el-row class="people-screen" :gutter="20">
      <el-col :span="3">
        <el-input v-model="form.tel" size="small" placeholder="请输入手机号" class="screen-li"></el-input>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" size="small" @click="getUserRPCDList">查 询</el-button>
    </el-col>
    </el-row>
  </el-main>
</template>
<script>
export default {
  data (){
    return {
      form: {

      }
    }
  }
}
</script>
<style lang="less"></style>