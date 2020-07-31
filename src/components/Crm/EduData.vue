<template>
  <el-main class="index-main eduData">
    <el-row>
      <!-- <el-col :span="4">
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
      </el-col>-->
      <el-col :span="6">
        <el-date-picker
          value-format="timestamp"
          style="width:90%"
          size="small"
          v-model="form.time"
          type="daterange"
          align="left"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
        ></el-date-picker>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" size="small" @click="query">查询</el-button>
      </el-col>
    </el-row>
    <el-table
     max-height="600"
      :summary-method="getSummaries"
      show-summary
      :data="tableData"
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column prop="classTeaName" label="姓名" fixed="left" width="100" align="center"></el-table-column>
      <el-table-column label="通时情况" align="center">
        <el-table-column label="总通时" prop="talkTimeVOdurationCount" align="center">
          <template slot-scope="scope">{{timeReturn(scope.row.talkTimeVOdurationCount)}}</template>
        </el-table-column>
        <el-table-column label="外拨通话时长" prop="talkTimeVOdurationOutCount" align="center">
          <template slot-scope="scope">{{timeReturn(scope.row.talkTimeVOdurationOutCount)}}</template>
        </el-table-column>
        <el-table-column label="呼入通话时长" prop="talkTimeVOdurationCallCount" align="center">
          <template slot-scope="scope">{{timeReturn(scope.row.talkTimeVOdurationCallCount)}}</template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="学员领取情况" width="180" align="center" class="height_32">
        <el-table-column label="领取总数" prop="receiveStuVOstuNumCount" align="center" width="50"></el-table-column>
        <el-table-column label="系统领取数" prop="receiveStuVOreceiveStuNum" width="60" align="center"></el-table-column>
        <el-table-column label="商城领取数" prop="receiveStuVOsystemAllStuNum" width="60" align="center"></el-table-column>
        <el-table-column label="主管分配内容" prop="receiveStuVOleadAllStuNum" width="60" align="center"></el-table-column>
      </el-table-column>receiveStuVOsystemAllStuNum
      <el-table-column label="添加备注情况" align="center">
        <el-table-column label="学员数量" prop="addNotesVOaddNotesStuNum" align="center" width="50"></el-table-column>
        <el-table-column label="备注条数" prop="addNotesVOaddNotesNum" align="center" width="50"></el-table-column>
      </el-table-column>
      <el-table-column label="外拨电话情况" align="center">
        <el-table-column label="系统" align="center">
          <el-table-column
            label="拨打总数"
            prop="dialVOnewSystemDialVOnewSystemNum"
            align="center"
            width="50"
          ></el-table-column>
          <el-table-column
            label="手机外拨"
            prop="dialVOnewSystemDialVOnewSystemTelNum"
            align="center"
            width="50"
          ></el-table-column>
          <el-table-column
            label="手机外拨接通"
            prop="dialVOnewSystemDialVOnewSystemOpenTelNum"
            width="60"
            align="center"
          ></el-table-column>
          <el-table-column
            label="座机外拨"
            prop="dialVOnewSystemDialVOnewSystemSeatNum"
            align="center"
            width="50"
          ></el-table-column>
          <el-table-column
            label="座机外拨接通"
            prop="dialVOnewSystemDialVOnewSystemOpenSeatNum"
            width="60"
            align="center"
          ></el-table-column>
        </el-table-column>
        <el-table-column label="JQ" align="center">
          <el-table-column label="拨打总数" prop="dialVOjqDialVOjqNum" align="center" width="50"></el-table-column>
          <el-table-column label="手机外拨" prop="dialVOjqDialVOjqTelNum" align="center" width="50"></el-table-column>
          <el-table-column
            label="手机外拨接通"
            prop="dialVOjqDialVOjqOpenTelNum"
            width="60"
            align="center"
          ></el-table-column>
          <el-table-column label="座机外拨" prop="dialVOjqDialVOjqSeatNum" align="center" width="50"></el-table-column>
          <el-table-column
            label="座机外拨接通"
            prop="dialVOjqDialVOjqOpenSeatNum"
            width="60"
            align="center"
          ></el-table-column>
        </el-table-column>
      </el-table-column>
      <el-table-column label="呼入情况" align="center">
        <el-table-column label="呼入数量" prop="callStuVOcallNum" align="center" width="50"></el-table-column>
        <el-table-column label="接听数量" prop="callStuVOcallOpenNum" align="center" width="50"></el-table-column>
        <el-table-column label="呼入人数" prop="callStuVOcallStuNum" align="center" width="50"></el-table-column>
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
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 3600 * 1000 * 24;
        },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "昨天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
              end.setTime(start.getTime());
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近7天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              end.setTime(end.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近14天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 14);
              end.setTime(end.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近30天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              end.setTime(end.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      form: {
        // date: "1",
        name: "",
        time: [],
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
        if (index === 1 || index === 2 || index === 3) {
          sums[index] = this.timeReturn(sums[index]);
        }
      });

      return sums;
    },
    query() {
      //查询
      if (!this.form.time || !this.form.time.length) {
        this.$message({
          message: "请选择查看时间段",
          type: "warning",
        });
        return;
      }
      let endTime = new Date(
        new Date(this.form.time[1]).toLocaleDateString()
      ).getTime();
      let startTime = new Date(
        new Date(this.form.time[0]).toLocaleDateString()
      ).getTime();
      console.log(Date.now() - 24 * 60 * 60 * 1000 < startTime);
      let data = {
        dayState: Date.now() - 24 * 60 * 60 * 1000 < startTime ? 1 : 0,
        classTeaName: this.form.name,
        endTime,
        startTime,
      };

      this.loading = true;
      this.$smoke_post(getTeaWork, data)
        .then((res) => {
          if (res.code == 200) {
            this.tableData = res.data.map((item) => {
              //重新赋值了
              return {
                classTeaName: item.classTeaName,
                talkTimeVOdurationCallCount: item.talkTimeVO.durationCallCount||0,
                talkTimeVOdurationOutCount: item.talkTimeVO.durationOutCount||0,
                talkTimeVOdurationCount: item.talkTimeVO.durationCount||0,
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
// .el-table {
//   overflow-x: auto !important;
// }
// /deep/ .el-table__header-wrapper,
// /deep/ .el-table__body-wrapper,
// /deep/ .el-table__footer-wrapper {
//   overflow: visible !important;
// }
.eduData /deep/ .el-table__body-wrapper::-webkit-scrollbar{
  display: none;
}
.eduData /deep/ .el-table__footer-wrapper {
  overflow-x:auto
}
// .el-table::after {
//   position: relative !important;
// }
// .el-table--scrollable-x .el-table__body-wrapper {
//   overflow: visible !important;
// }
.eduData /deep/ .is-leaf .cell {
  line-height: 20px;
}
</style>