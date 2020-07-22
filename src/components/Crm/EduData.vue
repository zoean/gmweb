<template>
  <el-main class="index-main">
    <el-row>
      <el-col :span="4">
        <el-select
          v-model="form.date"
          placeholder="请选择查看时间段"
          size="small"
          clearable
          style="width:90%"
        >
          <el-option label="昨天" value="1"></el-option>
          <el-option label="近7天" value="7"></el-option>
          <el-option label="近14天" value="14"></el-option>
          <el-option label="近30天" value="30"></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-input v-model="form.name" placeholder="请输入班主任姓名" size="small" style="width:90%"></el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" size="small" @click="query">查询</el-button>
      </el-col>
    </el-row>
    <el-table :data="tableData" style="width: 100%;margin-top:40px" v-loading="loading">
      <el-table-column prop="classTeaName" label="姓名" width="180"></el-table-column>
      <el-table-column label="学员领取情况" width="180">
        <el-table-column label="领取总数" prop="receiveStuVO.stuNumCount"></el-table-column>
        <el-table-column label="系统领取数" prop="receiveStuVO.systemAllStuNum" width="150"></el-table-column>
        <el-table-column label="商城领取数" prop="receiveStuVO.receiveStuNum" width="150"></el-table-column>
        <el-table-column label="主管分配内容" prop="receiveStuVO.leadAllStuNum" width="150"></el-table-column>
      </el-table-column>
      <el-table-column label="添加备注情况">
        <el-table-column label="学员数量" prop="addNotesVO.addNotesNum"></el-table-column>
        <el-table-column label="备注条数" prop="addNotesVO.addNotesStuNum"></el-table-column>
      </el-table-column>
      <el-table-column label="外拨电话情况">
        <el-table-column label="系统">
          <el-table-column label="拨打总数" prop="newSystemDialVO.newSystemNum"></el-table-column>
          <el-table-column label="手机外拨" prop="newSystemDialVO.newSystemTelNum"></el-table-column>
          <el-table-column label="手机外拨接通" prop="newSystemDialVO.newSystemOpenTelNum" width="150"></el-table-column>
          <el-table-column label="座机外拨" prop="newSystemDialVO.newSystemSeatNum"></el-table-column>
          <el-table-column label="座机外拨接通" prop="newSystemDialVO.newSystemOpenSeatNum" width="150"></el-table-column>
        </el-table-column>
        <el-table-column label="JQ">
          <el-table-column label="拨打总数" prop="dialVO.jqDialVO.jqNum"></el-table-column>
          <el-table-column label="手机外拨" prop="dialVO.jqDialVO.jqTelNum"></el-table-column>
          <el-table-column label="手机外拨接通" prop="dialVO.jqDialVO.jqOpenTelNum" width="150"></el-table-column>
          <el-table-column label="座机外拨" prop="dialVO.jqDialVO.jqSeatNum"></el-table-column>
          <el-table-column label="座机外拨接通" prop="dialVO.jqDialVO.jqOpenSeatNum" width="150"></el-table-column>
        </el-table-column>
      </el-table-column>
      <el-table-column label="呼入情况">
        <el-table-column label="呼入数量" prop="callStuVO.callNum"></el-table-column>
        <el-table-column label="接听数量" prop="callStuVO.callOpenNum"></el-table-column>
        <el-table-column label="呼入人数" prop="callStuVO.callStuNum"></el-table-column>
      </el-table-column>
      <el-table-column label="通时情况">
        <el-table-column label="总通时" prop="talkTimeVO.durationCount"></el-table-column>
        <el-table-column label="外拨通话时长" prop="talkTimeVO.durationOutCount" width="150"></el-table-column>
        <el-table-column label="呼入通话时长" prop="talkTimeVO.durationCallCount" width="150"></el-table-column>
      </el-table-column>
    </el-table>
  </el-main>
</template>

<script>
import { getTeaWork } from "../../request/api";
import {} from "../../assets/js/common"; //公用方法
export default {
  name: "EduData",
  data() {
    return {
      form: {
        date: "",
        name: ""
      },
      tableData: [],
      loading: false
    };
  },
  created() {},
  methods: {
    query() {
      let dateNow = new Date(new Date().toLocaleDateString()).getTime();
      let startTime = dateNow - this.form.date * 86400000 + "";
      let data = {
        name: this.form.name,
        endTime: dateNow + "",
        startTime
      };

      this.loading = true;
      this.$smoke_post(getTeaWork, data).then(res => {
        console.log(res);
        if (res.code == 200) {
          this.tableData = res.data;
        }
      });
      this.loading = false;
    }
  },
  mounted() {}
};
</script>

<style lang="less" scoped>
.el-form-item__content {
  margin-left: 0 !important;
}
</style>