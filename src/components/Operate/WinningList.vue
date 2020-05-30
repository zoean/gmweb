<template>
  <el-container class="index-main">
    <el-main>
      <div class="people-title">中奖列表</div>
      <el-row>
        <el-col :span="3">
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
          <el-input v-model="nickName" placeholder="昵称, 用户ID" style="width:90%"></el-input>
        </el-col>
        <el-col :span="3">
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
          <el-button @click="searchBtn" type="primary" style="width:80%">搜索</el-button>
        </el-col>
      </el-row>
      <el-table :data="tableData" border>
        >
        <el-table-column label="用户ID" prop="openId" width="120"></el-table-column>
        <el-table-column label="用户头像" prop="headimgUrl" width="120">
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
        <el-table-column label="操作" prop>
          <template slot-scope="scope">
            <el-button type="text" @click="priceDetail(scope.row)">详情</el-button>
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
      <el-dialog center title="奖品详情" :visible.sync="dialogVisible">
        <el-form ref="form" :model="form" class="form_style" :rules="rules">
          <el-form-item label="中奖编码">
            <div>{{form.awardNo}}</div>
          </el-form-item>
          <el-form-item label="用户ID">
            <div>{{form.openId}}</div>
          </el-form-item>
          <el-form-item label="用户昵称">
            <div>{{form.nickName}}</div>
          </el-form-item>
          <el-form-item label="验证手机">
            <div>{{form.mobile}}</div>
          </el-form-item>
          <el-form-item label="中奖名称">
            <div>{{form.awardName}}</div>
          </el-form-item>
          <el-form-item label="中奖时间">
            <div>{{form.awardTime}}</div>
          </el-form-item>
          <el-form-item label="收货人"  prop="receiveUserName">
            <el-input v-model="form.receiveUserName"></el-input>
          </el-form-item>
          <el-form-item label="联系方式"  prop="receiveUserMobile">
            <el-input v-model="form.receiveUserMobile"></el-input>
          </el-form-item>
          <el-form-item label="收货地区" prop="receiveUserAddress">
            <el-input v-model="form.receiveUserAddress"></el-input>
          </el-form-item>
          <el-form-item label="具体地址" prop="receiveUserAddressDetail">
            <el-input v-model="form.receiveUserAddressDetail"></el-input>
          </el-form-item>
          <el-form-item label="快递公司" prop="postCompany">
            <el-input v-model="form.postCompany"></el-input>
          </el-form-item>
          <el-form-item label="邮件单号" prop="trackNumber">
            <el-input v-model="form.trackNumber"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="awardUpdate">确 定</el-button>
          <el-button type="primary" @click="awardPost" v-if="this.form.sendStatus === '0' ">立即派发</el-button>
          <el-button type="primary" disabled v-if="this.form.sendStatus === '1' ">已派发</el-button>
        </div>
      </el-dialog>
    </el-main>
  </el-container>
</template>
<script>
import {
  wechatActivityAwardUserList,
  wechatActivityAwardSelectAward,
  wechatActivityAwardUserDetail,
  wechatActivityAwardUpdateUser,
  wechatActivityAwardPost
} from "@/request/operateApi.js";
export default {
  name: "partinMember",
  data() {
    return {
      nickName: "", //搜索
      pricetype: "", //奖品类型
      pricestate: "", //奖品状态
      dialogVisible: false,
      priceTypeoOption: [{ label: "", value: "" }],
      priceStateOption: [
        {
          value: "0",
          label: "未领奖"
        },
        {
          value: "1",
          label: "已申领"
        },
        {
          value: "2",
          label: "已领取"
        }
      ],
      columnList: [
        {
          label: "昵称",
          prop: "nickName",
          width: 125
        },
        {
          label: "奖品名称",
          prop: "awardName"
        },
        {
          label: "中奖编号",
          prop: "awardNo",
          width: 125
        },
        {
          label: "状态",
          prop: "receiveStatus",
          width: 125
        },
        {
          label: "领取时间",
          prop: "receiveTime"
        }
      ],
      tableData: [],
      form: {
        awardName: "", //奖品名称
        awardNo: "", //中奖编号
        awardTime: "", //获奖时间
        awardUserId: "", //中奖用户信息ID
        mobile: "", //	验证手机号
        nickName: "", //用户昵称
        openId: "", //中奖用户ID
        postCompany: "", //快递公司
        receiveUserAddress: "", //收货人地址
        receiveUserAddressDetail: "", //收货人详细地址
        receiveUserMobile: "", //	收货人手机号
        receiveUserName: "", //收货人姓名
        sendStatus: "0", //派发状态（0-未派发，1-已派发）
        trackNumber: "" //	邮件单号
      },
      total: 0, //总数
      pageSize: 10, //一页显示几条
      currentPage: 1, //当前页数
      totalFlag: false, //当只有一页时隐藏分页
      rules:{
        receiveUserName:[{ required: true, message: '请输入收货人', trigger: 'blur' },],
        receiveUserMobile:[{ required: true, message: '请输入收货人手机号', trigger: 'blur' },],
        receiveUserAddressDetail:[{ required: true, message: '请输入地址', trigger: 'blur' },],
        trackNumber:[{ required: true, message: '请输入快递单号', trigger: 'blur' },],
      }
    };
  },
  created() {
    this.$smoke_get(wechatActivityAwardSelectAward, {
      //奖品类型
      activityId: this.$route.query.activityId
    }).then(res => {
      if (res.code === 200) {
        let arr = [];
        res.data.list.forEach((item, index) => {
          arr.push({ value: item.awardId, label: item.awardName });
        });
        this.priceTypeoOption = arr;
      }
    });

    this.getlistData();
  },
  methods: {
    priceDetail(row) {
      this.getAwardUserDetail(row.awardUserId);
      this.dialogVisible = true;
    },
    getlistData(awardId = "", receiveStatus = "", nickName = "") {
      this.$smoke_get(wechatActivityAwardUserList, {
        activityId: this.$route.query.activityId,
        pageSize: this.pageSize,
        currentPage: this.currentPage,
        awardId,
        receiveStatus,
        nickName
      }).then(res => {
        if (res.code === 200) {
          this.total = res.data.total;
          this.pageSize = res.data.pageSize;
          this.currentPage = res.data.currentPage;
          this.tableData = res.data.list;
        }
      });
    },
    getAwardUserDetail(awardUserId) {
      //奖品详情
      this.$smoke_get(wechatActivityAwardUserDetail, {
        activityId: this.$route.query.activityId,
        awardUserId
      }).then(res => {
        if (res.code === 200) {
          this.form = res.data.userDetail;
        }
  
      });
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.getListData();
    },
    handleSizeChange(pageSiz) {
      this.pageSiz = pageSiz;
    },
    searchBtn() {
      this.getlistData(this.pricetype, this.pricestate, this.nickName);
    },
    awardUpdate(){
      this.$smoke_post(wechatActivityAwardUpdateUser,this.form).then(
        res=>{
          if(res.code === 200){
             this.dialogVisible = false
          }
        }
      )
      
    },
    awardPost(){//立即派发
       this.$smoke_post(wechatActivityAwardPost,this.form).then(res=>{
         if(res.code === 200){
             this.form.sendStatus = '1'
         }
         
       })
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
/deep/ .el-pagination {
  float: right;
  margin-top: 0.2rem;
}
</style>