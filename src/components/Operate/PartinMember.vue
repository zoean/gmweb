<template>
  <el-container class="index-main">
    <el-main>
      <div class="people-title">活动参与成员<i class="el-icon-back" title="返回" @click="$router.go(-1)">点击返回</i></div>
      <el-row>
        <el-col :span="4">
          <el-input
            class="screen-li"
            v-model="searchInput"
            placeholder="昵称, 用户ID"
            style="width:90%"
          ></el-input>
        </el-col>
        <el-col :span="2">
          <el-button @click="searchbtn" type="primary" style="width:80%">搜索</el-button>
        </el-col>
      </el-row>
      <el-table :data="tableData" border>
        >
        <el-table-column prop="openId" label="用户ID"></el-table-column>
        <el-table-column prop="headimgUrl" label="头像">
          <template slot-scope="scope">
            <img style="width:50px;height:50px" :src="scope.row.headimgUrl" />
          </template>
        </el-table-column>
        <el-table-column
          :prop="item.prop"
          :label="item.label"
          v-for="(item, index) in columnList"
          :width="item.width"
          :key="index"
        ></el-table-column>
      </el-table>
      <el-pagination
        :total="total"
        background
        :page-size="pageSize"
        layout="total,prev, pager, next, jumper"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      ></el-pagination>
    </el-main>
  </el-container>
</template>
<script>
import { wechatActivityUserList } from "@/request/operateApi.js";
export default {
  name: "partinMember",
  data() {
    return {
      searchInput: "",
      columnList: [
        {
          label: "昵称",
          prop: "nickName",
          width: 125
        },
        {
          label: "推荐人",
          prop: "recNickName",
          width: 125
        },
        {
          label: "关注时间",
          prop: "subscribeTime"
        },
        {
          label: "关注状态",
          prop: "subscribe",
          width: 125
        },
        {
          label: "推荐关注数",
          prop: "recNum",
          width: 125
        },
        {
          label: "净增关注数",
          prop: "incNum",
          width: 125
        }
      ],
      tableData: [],
      total: 0, //总数
      pageSize: 20, //一页显示几条
      currentPage: 1, //当前页数
    };
  },
  created() {
    this.getDatalist();
  },
  methods: {
    getDatalist(nickName = "") {
      this.$smoke_post(wechatActivityUserList, {
        activityId: this.$route.query.activityId,
        nickName,
        pageSize: this.pageSize,
        currentPage: this.currentPage
      }).then(res => {

        if (res.code === 200) {
          this.total = res.data.total
          //0-未关注，1-已关注，2-已取关
          let arr = ["未关注", "已关注", "已取关"];
          this.tableData = res.data.list.map(item => {
            item.subscribe = arr[item.subscribe];
            return item;
          });
        }
      });
    },
    searchbtn() {
      this.getDatalist(this.searchInput);
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.getDatalist()
    },
    handleSizeChange(pageSiz) {
      this.pageSiz = pageSiz;
    }
  }
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
    position: relative;
    i{
        position: absolute;
        left: 10px;
        top: 13px;
        cursor: pointer;
    }
  }
  .screen-li {
    width: 90%;
    margin-bottom: 1rem;
  }
}
.index-main /deep/ .el-table .cell {
  text-align: center !important;
}
/deep/ .el-pagination {
  float: right;
  margin-top: 0.2rem;
}
</style>