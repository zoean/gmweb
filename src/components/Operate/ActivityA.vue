<template>
  <el-container class="index-main">
    <el-main>
      <div class="people-title">活动管理</div>
      <el-row>
        <el-col :span="4">
          <el-select class="screen-li" v-model="stateValue" placeholder="不限状态">
            <el-option
              v-for="item in activityState"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select v-model="applicationValue" placeholder="不限公众号" style="width:90%">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-input v-model="activitySearch" placeholder="活动名称" style="width:90%"></el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" style="width: 50%;" @click="searchactivity">搜索</el-button>
        </el-col>
        <el-col :span="4" style="float:right">
          <el-button type="primary" style="width: 50%;float:right" @click="createactivity">创建活动</el-button>
        </el-col>
      </el-row>
      <el-table
        :data="tableData"
        border
        :header-cell-style="{background:'#eef1f6',color:'#606266'}"
      >
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
            <el-button @click="edit(scope.row)" type="text">修改</el-button>
            <el-button @click="partinuser(scope.row)" type="text">参与用户</el-button>
            <el-button @click="prize(scope.row)" type="text">奖品</el-button>
            <el-button @click="prizemanage(scope.row)" type="text">中奖管理</el-button>
            <el-button @click="delate(scope.row)" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" >
        <span>您确定要删除吗</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
    </el-main>
  </el-container>
</template>
<script>
export default {
  name: "activityA",
  data() {
    return {
      activityState: [
        {
          value: "选项1",
          label: "未开始"
        },
        {
          value: "选项2",
          label: "进行中"
        },
        {
          value: "选项3",
          label: "派奖中"
        },
        {
          value: "选项4",
          label: "已结束"
        }
      ],
      options: [],
      columnList: [
        {
          label: "活动ID",
          prop: "activityid",
          width: 100
        },
        {
          label: "应用公众号",
          prop: "application",
          width: 100
        },
        {
          label: "活动名称",
          prop: "activityname"
        },
        {
          label: "关键词",
          prop: "antistop",
          width: 100
        },
        {
          label: "活动时间段",
          prop: "activitytime"
        },
        {
          label: "参与人数",
          prop: "people",
          width: 100
        },
        {
          label: "取关人数",
          prop: "unfollow",
          width: 100
        },
        {
          label: "净增人数",
          prop: "additions",
          width: 100
        },
        {
          label: "活动状态",
          prop: "activitystate",
          width: 100
        }
      ],
      tableData: [
        {
          activityid: "111",
          application: "京华网校",
          activityname: "五一活动大促销",
          antistop: "1",
          activitytime: "2020-05-01--2020-05-01",
          people: 1000,
          unfollow: 10,
          additions: 900,
          activitystate: "开启"
        }
      ],
      activitySearch: "",
      applicationValue: "", //select 公众号
      stateValue: "" ,//select 状态
      dialogVisible:false
    };
  },
  created() {},
  methods: {
    searchactivity() {
      //搜索活动
    },
    createactivity() {
      //创建活动
      this.$router.push("/operate/activityA/createactivity");
    },
    edit(row) {
      //修改
      console.log(row);
      this.$router.push({
        path: "/operate/activityA/ActivityDetail",
        query: { id: row.activityid }
      });
    },
    partinuser(row) {
      //参与用户
      this.$router.push({
        path: "/operate/activityA/partinMember",
        query: { id: row.activityid }
      });
    },
    prize(row) {
      //奖品
      this.$router.push({
        path: "/operate/activityA/winninglist",
        query: { id: row.activityid }
      });
    },
    prizemanage(row) {
      //中奖管理
      this.$router.push({
        path: "/operate/activityA/pricelist",
        query: { id: row.activityid }
      });
    },
    delate() {
      this.dialogVisible=true
      //删除
    }
  },
  mounted() {}
};
</script>

<style lang="less" scoped>
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
  .screen-li {
    width: 90%;
    margin-bottom: 1rem;
  }
}
.index-main /deep/ .el-table .cell {
  text-align: center !important;
}
</style>