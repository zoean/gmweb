<template>
  <el-main class="index-main">
    <Start></Start>
    <el-tabs @tab-click="tabChange">
      <el-tab-pane label="学员">
        <el-row class="people-screen">
          <el-col :span="3">
            <el-input
              v-model.trim="form.tel"
              size="small"
              placeholder="请输入手机号"
              class="screen-li"
            ></el-input>
          </el-col>
          <el-col :span="21">
            <el-button
              type="primary"
              size="small"
              @click="orderCallDataListClick"
              >查 询</el-button
            >
          </el-col>
        </el-row>

        <el-table
          :data="list"
          v-loading="fullscreenLoading"
          style="width: 100%"
          :height="tableHeight"
        >
          <el-table-column
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            v-for="(item, index) in columnList"
            :key="index"
          >
            <template slot-scope="scope">
              <span>{{ scope.row[item.prop] }}</span>
              <Copy
                style="display: inline-block; width: auto"
                @mouseenter.native="phoneCopy(scope.row, 'enter')"
                :content="copyCallbackPhone"
                @copyCallback="phoneCopy(scope.row, 'click')"
              >
                <span
                  ><svg-icon
                    class="copy-tel"
                    v-if="item.prop == 'phone'"
                    icon-class="copy"
                    icon-title="复制手机号码"
                /></span>
              </Copy>
            </template>
          </el-table-column>

          <el-table-column
            prop="active"
            label="操作"
            width="120"
            fixed="right"
            class-name="table_active"
          >
            <template slot-scope="scope">
              <svg-icon
                icon-title="手机外拨"
                @click="phoneOut(scope.row)"
                icon-class="takephone"
              />
              <svg-icon
                icon-title="座机外拨"
                @click="seatOut(scope.row)"
                icon-class="landline"
              />
              <!-- <el-button @click="release(scope.row)" type="text" >释放数据</el-button> -->
              <!-- <svg-icon @click="customerInfo(scope.row)" icon-title="客户信息" icon-class="members" /> -->
              <svg-icon
                @click="handleAddClick(scope.row)"
                icon-title="添加备注"
                icon-class="addnotes"
              />
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="form.total"
          :page-size="form.pageSize"
          :current-page="form.currentPage"
          :page-sizes="[10, 20, 30, 50, 100]"
          :hide-on-single-page="totalFlag"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        >
        </el-pagination>
      </el-tab-pane>
      <el-tab-pane label="订单">
        <el-row type="flex" :gutter="10">
          <el-col :span="3">
            <el-select
              v-model="orderForm.classType"
              size="small"
              placeholder="选择商品班型"
              clearable
            >
              <el-option
                v-for="item in classTypeList"
                :key="item.number"
                :label="item.name"
                :value="item.number"
              >
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-select
              v-model="orderForm.orderType"
              size="small"
              placeholder="选择购买状态"
              clearable
            >
              <el-option
                v-for="(item, index) in purchaseOptions"
                :key="index"
                :label="item"
                :value="index"
              >
              </el-option>
            </el-select>
          </el-col>

          <el-col :span="6">
            <el-date-picker
              style="width: 100%"
              size="small"
              v-model="orderForm.time"
              :default-time="['00:00:00', '23:59:59']"
              type="datetimerange"
              unlink-panels
              range-separator="至"
              start-placeholder="下单时间"
              end-placeholder="下单时间"
              @change="changeTime"
            >
            </el-date-picker>
          </el-col>

          <el-col :span="4">
            <el-button type="primary" size="small" @click="getOrderList4Teacher"
              >搜索</el-button
            >
          </el-col>
        </el-row>

        <el-table
          :data="userOrderList"
          style="width: 100%; margin-top: 10px"
          :height="tableHeight"
        >
          <el-table-column
            v-for="(item, index) in userOrderColumn"
            :width="item.width"
            :prop="item.prop"
            :label="item.label"
            :key="index"
          >
            <template slot-scope="scope">
              <span>{{ scope.row[item.prop] }}</span>
              <el-tooltip
                v-if="item.prop == 'tel'"
                effect="dark"
                content="复制手机号码"
                placement="top"
              >
                <el-image
                  class="copy-icon-style"
                  @click="phoneCopy(scope.row)"
                  :src="require('../../assets/images/copy-icon.png')"
                >
                </el-image>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="active" label="操作">
            <template slot-scope="scope">
              <svg-icon
                icon-title="支付记录"
                @click="payDetail(scope.row)"
                icon-class="takephone"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <CustomerNotes
      v-if="drawer"
      @changeDrawer="changeDrawer"
      @phoneOut="phoneOut"
      @seatOut="seatOut"
      @release="release"
      :scopeRow="scopeRow"
      :followFlag="followFlag"
      :drawer.sync="drawer"
      :userUuid="form.userUuid"
      :userId="userId"
      :schoolId="schoolId"
      :examItem="examItem"
      :clueDataSUuid="clueDataSUuid"
      :userCDARUuid="userCDARUuid"
      :comMode="comMode"
      :callLogUuid="callLogUuid"
      @fatherDataList="orderCallDataList"
    >
    </CustomerNotes>
    <el-dialog
      width="50%"
      class="show-pay-detail"
      :visible.sync="payDetailVisible"
      title="支付记录"
    >
      <el-table :data="orderDetail">
        <el-table-column
          v-for="(item, index) in paymentRecordColumn"
          :key="index"
          :label="item.label"
          :prop="item.prop"
          :formatter="item.formatter"
          :min-width="item.width"
        >
        </el-table-column>
      </el-table>
    </el-dialog>
  </el-main>
</template>

<script>
import {
  orderCallDataList,
  phoneOut,
  seatOut,
  clueDataRelease,
  copyTel,
  getOrderList4Teacher,
  getOrderPayRecord,
  getOrderCustomer,
} from "../../request/api";
import { timestampToTime, schoolType } from "../../assets/js/common";
import Start from "../../components/Share/Start";
import CustomerNotes from "../Share/CustomerNotes";
export default {
  name: "completed",
  props: ["tableHeight"],
  data() {
    return {
      form: {
        currentPage: 1,
        pageSize: 20,
        userUuid: "",
        total: null,
        tel: "",
      },
      totalFlag: false,
      list: [],
      columnList: [
        { prop: "phone", label: "手机号码", width: 150 },
        { prop: "name", label: "姓名" },
        { prop: "education", label: "学历" },
        { prop: "workingLife", label: "工作年限" },
        { prop: "lastCallTime", label: "最近一次联系时间", width: 230 },
        // { 'prop': 'dataType', 'label': '下次联系时间' },
        { prop: "callDialUp", label: "拨通 / 拨打" },
        { prop: "school", label: "注册平台" },
      ],
      initOptions: {},

      followFlag: false,
      drawer: false,
      clueDataSUuid: "",
      userCDARUuid: "",
      callLogUuid: "",
      comMode: "",
      schoolId: "",
      userId: "",
      examItem: "",
      scopeRow: {},
      fullscreenLoading: false,
      orderForm: {
        userIds: [],
        orderType: "",
        classType: "",
        startTime: "",
        endTime: "",
        // currentPage: 1,
        // pageSize: 20,
        // total: 0
      },
      classTypeList: [
        { name: "普通班", number: 0 },
        { name: "高端班", number: 1 },
      ],
      purchaseOptions: ["已交全款", "已交定金", "已交尾款"],
      userOrderList: [],
      userOrderTotal: null,
      userOrderColumn: [
        {
          label: "商品名称",
          prop: "goodsName",
          width: 300,
        },
        {
          label: "姓名",
          prop: "userName",
        },
        {
          label: "手机号码",
          prop: "phone",
          width: 130,
        },
        {
          label: "下单平台",
          prop: "schoolName",
        },
        {
          label: "累付金额",
          prop: "moneyPaidTotal",
        },
        {
          label: "下单时间",
          prop: "addTime",
          width: 180,
        },
      ],
      payDetailVisible: false,
      orderDetail: {},
      paymentRecordColumn: [
        {
          label: "支付时间",
          prop: "payTime",
          width: 120,
          formatter: (row) => {
            return row.payTime
              ? timestampToTime(Number(row.payTime) * 1000)
              : "--";
          },
        },
        {
          label: "订单类型",
          prop: "orderType",
        },
        {
          label: "支付方式",
          prop: "payTypeName",
        },
        {
          label: "支付金额",
          prop: "moneyPaid",
          formatter: (row) => {
            return `￥${row.moneyPaid}`;
          },
        },
        {
          label: "订单号",
          prop: "orderNo",
          width: 150,
        },
      ],
      copyCallbackPhone: "",
    };
  },
  components: {
    CustomerNotes,
    Start,
  },
  created() {
    const seatDataPageSize = localStorage.getItem("seatDataPageSize");
    if (seatDataPageSize) {
      this.form.pageSize = Number(seatDataPageSize);
    } else {
      this.form.pageSize = 20;
    }
    const uuid = localStorage.getItem("userUuid");
    this.form.userUuid = uuid;
    this.orderCallDataList();
    const initOptions = localStorage.getItem("initOptions");
    this.initOptions = JSON.parse(initOptions);
    this.getOrderCustomer();
  },
  methods: {
    getOrderCustomer() {
      this.$smoke_get(getOrderCustomer, {}).then((res) => {
        if (res.code == 200) {
          this.orderForm.userIds = res.data;
        }
      });
    },
    parsePurchase(row) {
      return this.purchaseOptions[row.orderType];
    },
    tabChange(tab) {
      if (tab.index == "1") {
        this.getOrderList4Teacher();
      } else {
        this.orderCallDataList();
      }
    },
    changeTime(value) {
      if (value == null) {
        this.orderForm.startTime = "";
        this.orderForm.endTime = "";
      } else {
        this.orderForm.startTime = value[0] / 1000;
        this.orderForm.endTime = value[1] / 1000;
      }
    },
    getOrderList4Teacher() {
      this.$smoke_post(getOrderList4Teacher, this.orderForm).then((res) => {
        if (res.code == 200) {
          res.data.orderList.map((sll) => {
            sll.addTime = timestampToTime(Number(sll.addTime * 1000));
            sll.schoolName = schoolType(sll.schoolName);
          });
          this.userOrderList = res.data.orderList;
          this.$emit("setTableHeight", this.userOrderList.length);
        }
      });
    },
    payDetail(row) {
      this.payDetailVisible = true;
      this.$smoke_post(getOrderPayRecord, {
        orderId: row.orderId,
        schoolName: row.schoolName,
      }).then((res) => {
        if (res.code == 200) {
          this.orderDetail = res.data;
        }
      });
    },
    // handleOrderSizeChange(size){
    //     this.orderForm.pageSize = size
    // },
    // handleOrderCurrentChange(page){
    //     this.orderForm.currentPage = page
    // },
    handleCurrentChange(index) {
      this.form.currentPage = index;
      this.orderCallDataList();
    },
    handleSizeChange(index) {
      this.form.pageSize = index;
      this.form.currentPage = 1;
      localStorage.setItem("seatDataPageSize", index);
      this.orderCallDataList();
    },
    //客户信息
    customerInfo(row) {
      this.drawer = true;
      this.clueDataSUuid = row.clueDataSUuid;
      this.userCDARUuid = row.userCDARUuid;
      this.followFlag = false;
    },
    handleAddClick(row) {
      console.log(row, "row detail");
      this.drawer = true;
      this.clueDataSUuid = row.clueDataSUuid;
      this.followFlag = true;
      this.comMode = "微信沟通";
      this.userCDARUuid = row.userCDARUuid;
      this.userId = row.customerId;
      this.examItem = row.examItemId;
      this.scopeRow = row;
    },
    changeDrawer(val) {
      this.drawer = val;
    },
    orderCallDataListClick() {
      this.form.currentPage = 1;
      this.orderCallDataList();
    },
    orderCallDataList() {
      this.fullscreenLoading = true;
      this.drawer = false;
      this.$smoke_post(orderCallDataList, this.form).then((res) => {
        if (res.code == 200) {
          setTimeout(() => {
            this.fullscreenLoading = false;
            res.data.list.map((sll) => {
              sll.lastCallTime = timestampToTime(Number(sll.lastCallTime));
              sll.callDialUp = sll.dialUpNum + "/" + sll.callNum;
            });
            this.list = res.data.list;
            this.form.total = res.data.total;
            this.schoolId = res.data.schoolId;
            this.$emit("setTableHeight", this.form.total, 1);
          }, 300);
        } else {
          setTimeout(() => {
            this.fullscreenLoading = false;
            this.$message({
              type: "error",
              message: res.msg,
            });
          }, 300);
        }
      });
    },
    release(scope) {
      let arr = [];
      arr.push(scope.userCDARUuid);
      this.$smoke_post(clueDataRelease, {
        list: arr,
      }).then((res) => {
        if (res.code == 200) {
          if (res.data.result) {
            this.$message({
              type: "success",
              message:
                "提交的线索数量" +
                res.data.submitSize +
                "条" +
                "，实际释放的线索数量" +
                res.data.releaseSize +
                "条",
            });
            this.orderCallDataList();
          } else {
            this.$message({
              type: "error",
              message: res.data.msg,
            });
            this.orderCallDataList();
          }
        } else {
          this.$message({
            type: "error",
            message: res.msg,
          });
        }
      });
    },
    phoneOut(scope) {
      if (this.initOptions != undefined) {
        this.$smoke_post(phoneOut, {
          adminUin: this.initOptions.adminUin,
          uin: this.initOptions.uin,
          uuid: scope.userCDARUuid,
        }).then((res) => {
          if (res.code == 200) {
            if (res.data.result) {
              this.callLogUuid = res.data.callLogUuid;
              this.clueDataSUuid = scope.clueDataSUuid;
              this.userCDARUuid = scope.userCDARUuid;
              this.drawer = true;
              this.followFlag = true;
              this.comMode = "手机外呼";
              this.examItem = scope.examItemId;
              this.scopeRow = scope;
            } else {
              this.$message({
                type: "error",
                message: "目前服务线路忙，请稍后重试",
              });
            }
          } else {
            this.$message({
              type: "error",
              message: res.msg,
            });
          }
        });
      } else {
        this.$message({
          type: "error",
          message: "请联系主管配置jq账号",
        });
      }
    },
    seatOut(scope) {
      if (this.initOptions != undefined) {
        this.$smoke_post(seatOut, {
          adminUin: this.initOptions.adminUin,
          uin: this.initOptions.uin,
          uuid: scope.userCDARUuid,
        }).then((res) => {
          if (res.code == 200) {
            if (res.data.result) {
              this.callLogUuid = res.data.callLogUuid;
              this.clueDataSUuid = scope.clueDataSUuid;
              this.userCDARUuid = scope.userCDARUuid;
              this.drawer = true;
              this.followFlag = true;
              this.comMode = "座机外呼";
              this.examItem = scope.examItemId;
              this.scopeRow = scope;
            } else {
              this.$message({
                type: "error",
                message: "目前服务线路忙，请稍后重试",
              });
            }
          } else {
            this.$message({
              type: "error",
              message: res.msg,
            });
          }
        });
      } else {
        this.$message({
          type: "error",
          message: "请联系主管配置jq账号",
        });
      }
    },
    phoneCopy(row, text) {
      this.copyTel(row.clueDataSUuid, text);
    },
    copyTel(id, text) {
      this.$smoke_post(copyTel, {
        uuid: id,
      }).then((res) => {
        if (res.code == 200) {
          if (text == "click") {
            this.$message({
              type: "success",
              message: "复制成功",
            });
          }
          this.copyCallbackPhone = res.data;
        } else {
          this.$message({
            type: "error",
            message: res.msg,
          });
        }
      });
    },
  },
  mounted() {},
};
</script>

<style lang="less" scoped>
.index-main {
  margin-top: 5px;
  .el-col-6 {
    height: auto !important;
  }
  .people-title {
    width: 100%;
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-size: 15px;
    background: #fff;
    margin-bottom: 0.3rem;
    color: #666666;
  }
  .people-screen {
    margin-bottom: 10px;
    .screen-li {
      width: 94%;
    }
  }
  .show-pay-detail {
    .el-row {
      margin-bottom: 20px;
      .col-label {
        width: 120px;
        text-align: right;
      }
    }
    .line {
      border-bottom: 1px solid #ccc;
      width: 100%;
      display: block;
      height: 1px;
    }
  }
}
</style>
