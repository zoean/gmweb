<template>
    <el-container class="index-main">
      <el-main>
        <div class="people-title">中奖列表</div>
        <el-row>
          <el-col :span="2">
            <el-select style="width:80%" v-model="pricetype" placeholder="全部奖品" class="screen-li">
              <el-option
                v-for="item in priceTypeoOption"
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
            <el-select v-model="pricestate" style="width:80%" placeholder="领奖状态">
              <el-option
                v-for="item in priceStateOption"
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
        <el-table :data="tableData" border >
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
              <el-button type="text" @click="priceDetail(scope.row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog center title="奖品详情" :visible.sync="dialogVisible">
          <el-form ref="form" :model="form" class="form_style">
            <el-form-item :label="item.label" v-for="(item,index) in detailData" :key="index">
              <div>{{item.value}}</div>
            </el-form-item>
            <el-form-item label="收货人">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="联系方式">
              <el-input v-model="form.tel"></el-input>
            </el-form-item>
            <el-form-item label="收货地区">
              <el-input v-model="form.region"></el-input>
            </el-form-item>
            <el-form-item label="具体地址">
              <el-input v-model="form.address"></el-input>
            </el-form-item>
            <el-form-item label="邮件单号">
              <el-input v-model="form.mail"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
          </div>
        </el-dialog>
      </el-main>
    </el-container>
</template>
<script>
export default {
  name: "partinMember",
  data() {
    return {
      searchInput: "",
      pricetype: "", //奖品类型
      pricestate: "",
      dialogVisible: false,
      priceTypeoOption: [
        {
          value: "选项1",
          label: "用户"
        },
        {
          value: "选项2",
          label: "推荐人"
        }
      ],
      priceStateOption: [
        {
          value: "选项1",
          label: "未领奖"
        },
        {
          value: "选项2",
          label: "已申领"
        },
        {
          value: "选项3",
          label: "已发奖"
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
          label: "奖品名称",
          prop: "priceName"
        },
        {
          label: "中奖编号",
          prop: "priceNumber",
          width: 125
        },
        {
          label: "状态",
          prop: "priceState",
          width: 125
        },
        {
          label: "领取时间",
          prop: "collectionTime"
        }
      ],
      tableData: [
        {
          userId: "yh0001",
          headPortrait: "",
          nickName: "海绵宝宝",
          priceName: "jhwx",
          priceNumber: "渠道一",
          collectionTime: "2020-05-01 18：00：30",
          priceState: "已领取"
        },
        {
          userId: "yh0001",
          headPortrait: "",
          nickName: "派大星",
          priceName: "jhwx",
          priceNumber: "渠道二",
          collectionTime: "2020-05-02 18：00：30",
          priceState: "未领取"
        }
      ],
      form: {
        name: "",
        tel: "",
        region: "",
        address: "",
        mail: ""
      },
      detailData: [
        {
          label: "中奖编码",
          value: "1111"
        },
        {
          label: "用户ID",
          value: "11111"
        },
        {
          label: "用户昵称",
          value: "海绵宝宝"
        },
        {
          label: "验证手机",
          value: "12345678901"
        },
        {
          label: "中奖名称",
          value: "消防教材5册"
        },
        {
          label: "中奖时间",
          value: "2020-05-01 18：00：30"
        }
      ]
    };
  },
  methods: {
    priceDetail() {
      //下级
      this.dialogVisible = true;
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
.form_style /deep/ .el-input {
  width: 50%;
}
</style>