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
          <el-input v-model.trim="activitySearch" placeholder="活动名称" style="width:90%"></el-input>
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
            <el-button @click="prizemanage(scope.row)" type="text">奖品</el-button>
            <el-button @click="prize(scope.row)" type="text">中奖管理</el-button>
            <el-button @click="delate(scope.row)" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
      :total="total"
      background
      :page-size="pageSize"
      layout="total,prev, pager, next, jumper"
      :hide-on-single-page="totalFlag"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      ></el-pagination>
      <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
        <span>您确定要删除吗</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="readlyTrue">确 定</el-button>
        </span>
      </el-dialog>
    </el-main>
  </el-container>
</template>
<script>
import { wechatActivity, wechatActivityDelete } from "@/request/operateApi.js";
export default {
  name: "activityA",
  data() {
    return {
      activityState: [
        {
          value: 1,
          label: "未开始"
        },
        {
          value: 2,
          label: "进行中"
        },
        {
          value: 3,
          label: "派奖中"
        },
        {
          value: 4,
          label: "已结束"
        }
      ],
      options: [
        {
          label: "测试号",
          value: "wx5684c1cd32a4fe6a"
        }
      ],
      columnList: [
        {
          label: "活动ID",
          prop: "activityId",
          width: 100
        },
        {
          label: "应用公众号",
          prop: "wxName",
          width: 100
        },
        {
          label: "活动名称",
          prop: "activityName"
        },
        {
          label: "关键词",
          prop: "triggerWord",
          width: 100
        },
        {
          label: "活动时间段",
          prop: "activityTime"
        },
        {
          label: "参与人数",
          prop: "userCount",
          width: 100
        },
        {
          label: "取关人数",
          prop: "unSubCount",
          width: 100
        },
        {
          label: "净增人数",
          prop: "subCount",
          width: 100
        },
        {
          label: "活动状态",
          prop: "activityStatus",
          width: 100
        }
      ],
      tableData: [],
      activitySearch: "", //活动名称
      applicationValue: "", //select 公众号
      stateValue: "", //select 状态1-未开始，2-进行中，3-派奖中，4-已结束
      dialogVisible: false,
      currentDelactivityId: "",
      total:0,//总数
      pageSize:10,//一页显示几条
      currentPage:1,//当前页数
      totalFlag: false, //当只有一页时隐藏分页
    };
  },
  created() {
    this.getListData()
  },
  methods: {
    getListData() {
      this.$smoke_get(wechatActivity,{pageSize:this.pageSize,currentPage:this.currentPage}).then(res => {
        //获取活动列表
        if (res.code === 200) {
          this.tableData = this.settabelList(res.data.list);
          this.total = res.data.total
          console.log(res.data.total)
        }
      });
    },
    searchactivity() {
      //搜索活动
      this.$smoke_get(wechatActivity, {
        processStatus: this.stateValue,
        appId: this.applicationValue,
        activityName: this.activitySearch
      }).then(res => {
        if (res.code === 200) {
          if (res.data.list.length) {
            this.tableData = this.settabelList(res.data.list);
          }
        }
      });
    },
    createactivity() {
      //创建活动
      this.$router.push("/operate/activityA/createactivity");
    },
    edit(row) {
      //修改
      this.$router.push({
        path: "/operate/activityA/ActivityDetail",
        query: { activityId: row.activityId }
      });
    },
    partinuser(row) {
      //参与用户
      this.$router.push({
        path: "/operate/activityA/partinMember",
        query: { activityId: row.activityId }
      });
    },
    prize(row) {
      //奖品
      this.$router.push({
        path: "/operate/activityA/winninglist",
        query: { activityId: row.activityId }
      });
    },
    prizemanage(row) {
      //中奖管理
      this.$router.push({
        path: "/operate/activityA/pricelist",
        query: { activityId: row.activityId }
      });
    },
    delate(row) {
      this.dialogVisible = true;
      this.currentDelactivityId = row.activityId;
      //删除
    },
    settabelList(arr) {
      //处理表格
      return arr.map(item => {
        if (item.activityStatus == 0) {
          item.activityStatus = "关闭";
        } else if (item.activityStatus == 1) {
          item.activityStatus = "开启";
        }
        item.activityTime = item.activityStartTime + "-" + item.activityEndTime;
        return item;
      });
    },
    readlyTrue() {
      //是否要删除
      this.$smoke_get(wechatActivityDelete, {
        activityId: this.currentDelactivityId
      }).then(res => {
        if(res.code === 200){
            this.dialogVisible = false;
            this.getListData()
        }

      });
    },
    handleCurrentChange(currentPage){
        this.currentPage = currentPage
        this.getListData()
    },
    handleSizeChange(pageSiz){
      this.pageSiz = pageSiz

    },
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
/deep/ .el-pagination{
  float:right;
  margin-top: .2rem;
}
</style>