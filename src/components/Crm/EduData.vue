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
        <el-button type="primary" size="small" @click="query">查询</el-button>
      </el-col>
    </el-row>
    <el-table
      :summary-method="getSummaries"
      show-summary
      :data="tableData"
      style="width: 100%;margin-top:40px"
      v-loading="loading"
    >
      <el-table-column prop="classTeaName" label="姓名" width="180"></el-table-column>
      <el-table-column label="学员领取情况" width="180">
        <el-table-column label="领取总数" prop="receiveStuVOstuNumCount"></el-table-column>
        <el-table-column label="系统领取数" prop="receiveStuVOsystemAllStuNum" width="120"></el-table-column>
        <el-table-column label="商城领取数" prop="receiveStuVOreceiveStuNum" width="120"></el-table-column>
        <el-table-column label="主管分配内容" prop="receiveStuVOleadAllStuNum" width="120"></el-table-column>
      </el-table-column>
      <el-table-column label="添加备注情况">
        <el-table-column label="学员数量" prop="addNotesVOaddNotesNum"></el-table-column>
        <el-table-column label="备注条数" prop="addNotesVOaddNotesStuNum"></el-table-column>
      </el-table-column>
      <el-table-column label="外拨电话情况">
        <el-table-column label="系统">
          <el-table-column label="拨打总数" prop="dialVOnewSystemDialVOnewSystemNum"></el-table-column>
          <el-table-column label="手机外拨" prop="dialVOnewSystemDialVOnewSystemTelNum"></el-table-column>
          <el-table-column
            label="手机外拨接通"
            prop="dialVOnewSystemDialVOnewSystemOpenTelNum"
            width="120"
          ></el-table-column>
          <el-table-column label="座机外拨" prop="dialVOnewSystemDialVOnewSystemSeatNum"></el-table-column>
          <el-table-column
            label="座机外拨接通"
            prop="dialVOnewSystemDialVOnewSystemOpenSeatNum"
            width="120"
          ></el-table-column>
        </el-table-column>
        <el-table-column label="JQ">
          <el-table-column label="拨打总数" prop="dialVOjqDialVOjqNum"></el-table-column>
          <el-table-column label="手机外拨" prop="dialVOjqDialVOjqTelNum"></el-table-column>
          <el-table-column label="手机外拨接通" prop="dialVOjqDialVOjqOpenTelNum" width="120"></el-table-column>
          <el-table-column label="座机外拨" prop="dialVOjqDialVOjqSeatNum"></el-table-column>
          <el-table-column label="座机外拨接通" prop="dialVOjqDialVOjqOpenSeatNum" width="120"></el-table-column>
        </el-table-column>
      </el-table-column>
      <el-table-column label="呼入情况">
        <el-table-column label="呼入数量" prop="callStuVOcallNum"></el-table-column>
        <el-table-column label="接听数量" prop="callStuVOcallOpenNum"></el-table-column>
        <el-table-column label="呼入人数" prop="callStuVOcallStuNum"></el-table-column>
      </el-table-column>
      <el-table-column label="通时情况">
        <el-table-column label="总通时" prop="talkTimeVOdurationCount">
          <template slot-scope="scope">{{timeReturn(scope.row.talkTimeVOdurationCount)}}</template>
        </el-table-column>
        <el-table-column label="外拨通话时长" prop="talkTimeVOdurationOutCount" width="120">
          <template slot-scope="scope">{{timeReturn(scope.row.talkTimeVOdurationOutCount)}}</template>
        </el-table-column>
        <el-table-column label="呼入通话时长" prop="talkTimeVOdurationCallCount" width="120">
          <template slot-scope="scope">{{timeReturn(scope.row.talkTimeVOdurationCallCount)}}</template>
        </el-table-column>
      </el-table-column>
    </el-table>
  </el-main>
</template>

<script>
import { getTeaWork } from "../../request/api";
import { timeReturn } from "../../assets/js/common"; //公用方法
export default {
  name: "EduData",
  data() {
    return {
      form: {
        date: "1",
        name: "",
      },
      tableData: [],
      loading: false,
    };
  },
  created() {
    this.timeReturn = timeReturn;
  },
  methods: {
    getSummaries(param) {
      //合计
      const { columns, data } = param;
      // console.log(columns, data);
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        const values = data.map((item) => {
          // console.log(item, item[column.property], column, column.property);
          return Number(item[column.property]); //如果直接取值a[a.b]取不到
        });
        // console.log(values);
        if (!values.every((value) => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
        }
        // console.log(index);
        if (index === 20 || index === 21 || index === 22) {
          sums[index] = this.timeReturn(sums[index]);
        }
      });

      return sums;
    },
    query() {
      if (!this.form.date) {
        this.$message({
          message: "请选择查看时间段",
          type: "warning",
        });
        return;
      }
      let dateNow = new Date(new Date().toLocaleDateString()).getTime();
      let startTime = dateNow - this.form.date * 86400000 + "";
      let data = {
        name: this.form.name,
        endTime: dateNow + "",
        startTime,
      };

      this.loading = true;
      this.$smoke_post(getTeaWork, data)
        .then((res) => {
          if (res.code == 200) {
            this.tableData = res.data.map((item) => {//重新赋值了
              return {
                classTeaName: item.classTeaName,
                talkTimeVOdurationCallCount: item.talkTimeVO.durationCallCount,
                talkTimeVOdurationOutCount: item.talkTimeVO.durationOutCount,
                talkTimeVOdurationCount: item.talkTimeVO.durationCount,
                receiveStuVOstuNumCount: item.receiveStuVO.stuNumCount,
                receiveStuVOsystemAllStuNum: item.receiveStuVO.systemAllStuNum,
                receiveStuVOreceiveStuNum: item.receiveStuVO.receiveStuNum,
                receiveStuVOleadAllStuNum: item.receiveStuVO.leadAllStuNum,
                addNotesVOaddNotesNum: item.addNotesVO.addNotesNum,
                addNotesVOaddNotesStuNum: item.addNotesVO.addNotesStuNum,
                dialVOnewSystemDialVOnewSystemNum:
                  item.dialVO.newSystemDialVO.newSystemNum,
                dialVOnewSystemDialVOnewSystemTelNum:
                  item.dialVO.newSystemDialVO.newSystemTelNum,
                dialVOnewSystemDialVOnewSystemOpenTelNum:
                  item.dialVO.newSystemDialVO.newSystemOpenTelNum,
                dialVOnewSystemDialVOnewSystemSeatNum:
                  item.dialVO.newSystemDialVO.newSystemSeatNum,
                dialVOnewSystemDialVOnewSystemOpenSeatNum:
                  item.dialVO.newSystemDialVO.newSystemOpenSeatNum,
                dialVOjqDialVOjqNum: item.dialVO.jqDialVO.jqNum,
                dialVOjqDialVOjqTelNum: item.dialVO.jqDialVO.jqTelNum,
                dialVOjqDialVOjqOpenTelNum: item.dialVO.jqDialVO.jqOpenTelNum,
                dialVOjqDialVOjqSeatNum: item.dialVO.jqDialVO.jqSeatNum,
                dialVOjqDialVOjqOpenSeatNum: item.dialVO.jqDialVO.jqOpenSeatNum,
                callStuVOcallNum: item.callStuVO.callNum,
                callStuVOcallOpenNum: item.callStuVO.callOpenNum,
                callStuVOcallStuNum: item.callStuVO.callStuNum,
              };
            });
          }

          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
  },
  mounted() {},
};
</script>

<style lang="less" scoped>
</style>