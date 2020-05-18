<template>
  <el-container class="index-main">
    <el-main>
      <div class="people-title">奖品列表</div>
      <el-row>
        <el-col :span="4">
          <el-input v-model="searchInput" placeholder="奖品名称" style="width:90%;marginBottom:.2rem"></el-input>
        </el-col>
        <el-col :span="4">
          <el-select v-model="pricetype" placeholder="全部类型" style="width:80%">
            <el-option
              v-for="item in pricrListOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" style="width:80%">搜索</el-button>
        </el-col>
        <el-col :span="2" style="float:right;">
          <el-button type="primary" style="width:80%;float:right;" @click="addActivity">添加奖品</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="22">
          <el-input
            placeholder="输入领奖说明;中奖者领奖时看到的文案说明"
            type="textarea"
            v-model="instructions"
            style="marginBottom:.5rem"
          ></el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" style="width:100%;height:.5rem">提交中奖文案</el-button>
        </el-col>
      </el-row>
      <el-table :data="tableData" border>
        >
        <el-table-column
          :prop="item.prop"
          :label="item.label"
          v-for="(item, index) in columnList"
          :width="item.width"
          :key="index"
        ></el-table-column>
        <el-table-column label="操作" prop>
          <template slot-scope="scope">
            <el-button type="text" @click="priceEdit(scope.row)">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>
<script>
export default {
  name: "PriceList",
  data() {
    return {
      searchInput: "",
      pricetype: "",
      instructions: "",
      columnList: [
        {
          label: "奖品ID",
          prop: "priceId",
          width: 125
        },
        {
          label: "奖品名称",
          prop: "priceName"
        },
        {
          label: "奖品类型",
          prop: "priceType",
          width: 125
        },
        {
          label: "市场价格",
          prop: "currPrice",
          width: 125
        },
        {
          label: "更新时间",
          prop: "collectionTime"
        },
        {
          label: "状态",
          prop: "pricrState"
        },
        {
          label: "任务人数",
          prop: "taskPeople"
        }
      ],
      tableData: [
        {
          priceId: "yh001",
          priceName: "大礼包",
          priceType: "平台优惠券",
          currPrice: "200",
          collectionTime: "2020-05-01 18：00：30",
          pricrState: "开启",
          taskPeople: 5
        }
      ],
      pricrListOption: [
        {
          label: "全部类型",
          value: 0
        },
        {
          label: "平台优惠券",
          value: 1
        },
        {
          label: "实物邮寄",
          value: 2
        },
        {
          label: "自定义链接",
          value: 3
        }
      ]
    };
  },
  methods: {
    priceEdit(row) {
      this.$router.push({
        path: "/operate/activityA/pricedetail",
        query: { id: row.priceId,priceType:"实物邮寄" }
      });
    },
    addActivity() {
      //添加奖品
      this.$router.push("/operate/activityA/pricedetail");
    }
  }
};
</script>
<style scoped lang='less'>
.index-main {
  height: calc(100vh - 60px);
  .people-title {
    width: 100%;
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-size: 15px;
    background: #aaa;
    margin-bottom: 0.3rem;
    color: #fff;
  }
}
.index-main/deep/ .el-textarea__inner {
  min-height: 0.5rem !important;
}
.index-main /deep/ .el-table .cell {
  text-align: center !important;
}
</style>