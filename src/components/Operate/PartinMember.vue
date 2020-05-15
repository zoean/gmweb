<template>
    <el-container class="index-main">
      <el-main>
        <div class="people-title">活动参与成员</div>
        <el-row>
          <el-col :span="2">
            <el-select style="width:80%" v-model="peopletype" placeholder='用户' class="screen-li">
              <el-option
                v-for="item in peopleoTypeOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-input v-model="searchInput" placeholder="昵称, 用户ID" style="width:90%"></el-input>
          </el-col>
          <el-col :span="2">
            <el-select v-model="channeltype" placeholder='全部渠道' style="width:80%">
              <el-option
                v-for="item in peopleoFromOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="2">
            <el-button type="primary" style="width:80%">搜索</el-button>
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
              <el-button @click="sub(scope.row)" type="text">下级</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
</template>
<script>
export default {
  name:'partinMember',
  data() {
    return {
      searchInput: "",
      peopletype: "", //人群类型
      channeltype: "",
      peopleoTypeOption: [
        {
          value: "选项1",
          label: "用户"
        },
        {
          value: "选项2",
          label: "推荐人"
        }
      ],
      peopleoFromOption: [
        {
          value: "选项1",
          label: "全部渠道"
        },
        {
          value: "选项2",
          label: "渠道一"
        },
        {
          value: "选项3",
          label: "渠道二"
        }
      ],
      columnList: [
        {
          label: "用户ID",
          prop: "userId",
          width: 125
        },
        {
          label: "头像",
          prop: "headPortrait",
          width: 125
        },
        {
          label: "昵称",
          prop: "nickName",
          width: 125
        },
        {
          label: "推荐人",
          prop: "Recommended",
          width: 125
        },
        {
          label: "渠道",
          prop: "Channel",
          width: 125
        },
        {
          label: "关注时间",
          prop: "followTime"
        },
        {
          label: "关注状态",
          prop: "followState",
          width: 125
        },
        {
          label: "推荐关注数",
          prop: "followPeople",
          width: 125
        },
        {
          label: "净增关注数",
          prop: "growthFollow",
          width: 125
        }
      ],
      tableData: [
        {
          userId: "yh0001",
          headPortrait: "11",
          nickName: "海绵宝宝",
          Recommended: "jhwx",
          Channel: "渠道一",
          followTime: "2020-05-01 18：00：30",
          followState: "已关注",
          followPeople: 1000,
          growthFollow: 900
        }
      ]
    };
  },
  methods: {
    sub() {
      //下级
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