<template>
  <el-main class="index-main">
    <el-row class="people-screen" gutter="10" id="searchArea">
      <el-col :span="3">
        <el-input size="small" placeholder="请输入分校名称"></el-input>
      </el-col>
      <el-col :span="3">
        <el-select size="small" placeholder="请选择状态">
          <el-option></el-option>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-button size="small" type="primary">查询</el-button>
      </el-col>
      <el-col :span="15">
        <el-button class="smoke-fr" size="small" type="primary">创建分校</el-button>
      </el-col>
    </el-row>
    <el-table>

    </el-table>
  </el-main>
</template>
<script>
export default{
  name: 'createSchool',
  data(){
    return {
      list: [],
      columnList: [
        { prop: '', label: '分校名称'}
      ]
    }
  }
}
</script>
<style></style>