<template>
  <el-main class="index-main">
    <el-row
      :class="[
        'people-screen',
        {
          actionHide: toggleAction,
          actionShow: !toggleAction,
          noSearch: hideSearch,
        },
      ]"
    >
      <el-col :span="3">
        <el-input
          v-model.trim="form.tel"
          size="small"
          placeholder="请输入手机号"
          class="screen-li"
        ></el-input>
      </el-col>
      <el-col :span="5">
        <el-date-picker
          v-model="datePicker"
          size="small"
          style="width: 97%"
          type="datetimerange"
          range-separator="至"
          :default-time="['00:00:00', '23:59:59']"
          @change="datePickerChange($event, 1)"
          start-placeholder="最新回收时间"
          end-placeholder="最新回收时间"
        >
        </el-date-picker>
      </el-col>
      <el-col :span="5">
        <el-date-picker
          v-model="dateCreatePicker"
          size="small"
          style="width: 97%"
          type="datetimerange"
          range-separator="至"
          :default-time="['00:00:00', '23:59:59']"
          @change="datePickerChange($event, 2)"
          start-placeholder="入库时间"
          end-placeholder="入库时间"
        >
        </el-date-picker>
      </el-col>
      <el-col :span="5">
        <el-date-picker
          v-model="dateCallPicker"
          size="small"
          style="width: 97%"
          type="datetimerange"
          range-separator="至"
          :default-time="['00:00:00', '23:59:59']"
          @change="datePickerChange($event, 3)"
          start-placeholder="最近联系时间"
          end-placeholder="最近联系时间"
        >
        </el-date-picker>
      </el-col>
      <el-col :span="3">
        <el-autocomplete
          ref="autocomplete"
          size="small"
          class="screen-li"
          v-model="form.examItemText"
          :fetch-suggestions="querySearch"
          placeholder="请输入考试项目"
          :trigger-on-focus="true"
          clearable
          @clear="autocompleteClear"
          @select="handleSelect"
        ></el-autocomplete>
      </el-col>
      <el-col :span="3">
        <el-select
          v-model="form.intentionLevel"
          placeholder="选择意向等级"
          size="small"
          class="screen-li"
          clearable
        >
          <el-option
            v-for="item in enumList['MJ-5']"
            :key="item.name"
            v-if="item.enable"
            :label="item.name"
            :value="item.number"
          >
          </el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-row class="people-screen handle-area">
      <el-col :span="3" class="seatData">
        <area-cascader
          :class="[
            'screen-li',
            { areaSelected: form.city, areaDefault: !form.city },
          ]"
          type="text"
          placeholder="请选择地区"
          v-model="form.provinceCity"
          @change="cityChange"
          :data="pcaa"
        ></area-cascader>
      </el-col>

      <el-col :span="3">
        <el-autocomplete
          clearable
          size="small"
          ref="autocompleteSpread"
          class="screen-li"
          v-model="form.spreadText"
          :fetch-suggestions="querySearchSpread"
          placeholder="输入推广渠道"
          :trigger-on-focus="true"
          @select="handleSelectSpread"
          @clear="autocompleteClearSpread"
        ></el-autocomplete>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" size="small" @click="getUserRPCDList"
          >查 询</el-button
        >
      </el-col>
      <el-col :span="16">
        <el-button size="small" @click="obtainRPCD" style="float: right" plain
          >确认领取</el-button
        >
      </el-col>
    </el-row>
    <el-table
      :data="list"
      class="mt10"
      ref="tree"
      v-loading="fullscreenLoading"
      style="width: 100%"
      :height="tableHeight"
    >
      <el-table-column type="selection" width="45"> </el-table-column>
      <el-table-column
        :prop="item.prop"
        :label="item.label"
        v-for="(item, index) in columnList"
        :key="index"
        :show-overflow-tooltip="item.prop == 'clueDataNotes' ? true : false"
        :min-width="item.width"
        :sortable="item.sortable"
      >
      </el-table-column>

      <el-table-column
        prop="active"
        label="操作"
        fixed="right"
        width="60"
        class-name="table_active"
      >
        <template slot-scope="scope">
          <svg-icon
            @click="customerInfo(scope.row)"
            icon-title="客户信息"
            icon-class="info"
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

    <CustomerNotes
      v-if="drawer"
      @changeDrawer="changeDrawer"
      :followFlag="followFlag"
      :drawer.sync="drawer"
      :userUuid="form.userUuid"
      :schoolId="schoolId"
      :userId="userId"
      :examItem="examItem"
      :clueDataSUuid="clueDataSUuid"
      :userCDARUuid="userCDARUuid"
      :comMode="comMode"
      :callLogUuid="callLogUuid"
      @fatherDataList="getUserRPCDList"
    >
    </CustomerNotes>
  </el-main>
</template>

<script>
import {
  getUserRPCDList,
  obtainRPCD,
  enumByEnumNums,
  getExamBasic,
} from "../../request/api";
import { timestampToTime } from "../../assets/js/common";
import { MJ_5 } from "../../assets/js/data";
import pcaa from "area-data/pcaa";
import CustomerNotes from "../Share/CustomerNotes";
export default {
  name: "toAllocate",
  props: ["tableHeight", "toggleAction", "hideSearch"],
  components: {
    CustomerNotes,
  },
  data() {
    return {
      datePicker: [],
      dateCreatePicker: [],
      dateCallPicker: [],
      form: {
        tel: "", //手机号
        userUuid: "",
        currentPage: 1,
        pageSize: 20,
        total: null,
        examItemId: "",
        examItemText: "",
        intentionLevel: "",
        dataStartTime: "",
        dataEndTime: "",
        createStartTime: "",
        createEndTime: "",
        lastCallStartTime: "",
        lastCallEndTime: "",
        province: "",
        spread: "",
        spreadId: "",
        city: "",
        provinceCity: [],
      },
      list: [],
      totalFlag: false,
      columnList: [
        { prop: "tel", label: "手机号码", width: 100 },
        { prop: "name", label: "姓名", width: 90 },
        { prop: "clueDataNotes", label: "备注", width: 120 },
        { prop: "releaseSeat", label: "释放人", width: 90 },
        { prop: "provinceCity", label: "所在地区", width: 120 },
        { prop: "examItem", label: "所属项目", width: 130 },
        { prop: "callDialUp", label: "拨通 / 拨打", width: 100 },
        { prop: "spread", label: "推广渠道" },
        { prop: "createTime", label: "入库时间", sortable: true, width: 140 },
        {
          prop: "lastCallTime",
          label: "最近联系时间",
          sortable: true,
          width: 140,
        },
        {
          prop: "dataCreateTime",
          label: "最新回收时间",
          sortable: true,
          width: 140,
        },
        { prop: "intentionLevel", label: "意向等级", width: 150 },
      ],
      ruleForm: {
        age: "",
        city: "",
        evidencePurpose: "", //取证目的
        gender: "", //性别(0: 女，1：男)
        name: "",
        province: "",
        twoTel: "", //电话号码2
        work: "",
        workingLife: "", //工作年限
        wx: "",
      },
      drawerTitle: "客户详情",
      drawer: false,
      direction: "rtl",
      fullscreenLoading: false,

      followFlag: false,
      drawer: false,
      clueDataSUuid: "",
      callLogUuid: "",
      comMode: "",
      schoolId: "",
      userId: "",
      examItem: "",
      userCDARUuid: "",
      dataPicker: [],
      enumList: {},
      restaurants: [],
      pcaa: null, //省市数据
      MJ7List: [],
    };
  },
  created() {
    const seatDataPageSize = localStorage.getItem("seatDataPageSize");
    if (seatDataPageSize) {
      this.form.pageSize = Number(seatDataPageSize);
    } else {
      this.form.pageSize = 20;
    }
    const userUuid = localStorage.getItem("userUuid");
    this.form.userUuid = userUuid;
    this.getUserRPCDList();
    let arr = [MJ_5];
    this.enumByEnumNums(arr);
    this.getMJ7List();
    this.getExamBasic();
    this.pcaa = pcaa;
  },
  methods: {
    getMJ7List() {
      this.$smoke_post(enumByEnumNums, {
        numberList: ["MJ-6"],
      }).then((res) => {
        if (res.code == 200) {
          this.MJ7List = res.data;
        }
      });
    },
    querySearchSpread(queryString, cb) {
      var restaurants = JSON.parse(
        JSON.stringify(this.MJ7List["MJ-6"]).replace(/name/g, "value")
      );
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },

    handleSelectSpread(item) {
      this.form.spread = item.number;
      this.form.spreadText = item.value;
    },

    autocompleteClearSpread() {
      this.$nextTick(() => {
        this.$refs.autocompleteSpread.$children
          .find((c) => c.$el.className.includes("el-input"))
          .blur();
        this.form.spread = "";
        this.$refs.autocompleteSpread.focus();
      });
    },
    cityChange() {
      this.form.province = this.form.provinceCity[0];
      this.form.city = this.form.provinceCity[1];
    },
    handleSelect(item) {
      this.form.examItemId = item.id;
      this.form.examItemText = item.value;
    },
    autocompleteClear() {
      this.$nextTick(() => {
        this.$refs.autocomplete.$children
          .find((c) => c.$el.className.includes("el-input"))
          .blur();
        this.form.examItemId = "";
        this.$refs.autocomplete.focus();
      });
    },
    getExamBasic() {
      let arr;
      this.$smoke_get(getExamBasic, {}).then((res) => {
        if (res.code == 200) {
          arr = JSON.parse(JSON.stringify(res.data).replace(/name/g, "value"));
          this.restaurants = arr;
        }
      });
    },
    querySearch(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) > -1
        );
      };
    },
    enumByEnumNums(arr) {
      this.$smoke_post(enumByEnumNums, {
        numberList: arr,
      }).then((res) => {
        if (res.code == 200) {
          this.enumList = res.data;
        }
      });
    },
    datePickerChange(e, dateType) {
      if (dateType == 1) {
        this.form.dataStartTime = e ? e[0].getTime() : "";
        this.form.dataEndTime = e ? e[1].getTime() : "";
      } else if (dateType == 2) {
        this.form.createStartTime = e ? e[0].getTime() : "";
        this.form.createEndTime = e ? e[1].getTime() : "";
      } else {
        this.form.lastCallStartTime = e ? e[0].getTime() : "";
        this.form.lastCallEndTime = e ? e[1].getTime() : "";
      }
    },
    changeDrawer(val) {
      this.drawer = val;
    },
    handleCurrentChange(index) {
      this.form.currentPage = index;
      this.getUserRPCDList();
    },
    handleSizeChange(index) {
      this.form.pageSize = index;
      this.form.currentPage = 1;
      localStorage.setItem("seatDataPageSize", index);
      this.getUserRPCDList();
    },
    customerInfo(row) {
      this.drawer = true;
      this.clueDataSUuid = row.clueDataSUuid;
      this.userCDARUuid = row.userCDARUuid;
      this.userId = row.customerId;
      this.followFlag = false;
    },
    handleClose(done) {
      done();
    },
    getUserRPCDList() {
      this.fullscreenLoading = true;
      this.$smoke_post_big(getUserRPCDList, this.form, 20000)
        .then((res) => {
          if (res.code == 200) {
            setTimeout(() => {
              this.fullscreenLoading = false;
              res.data.list.map((sll) => {
                sll.lastCallTime = timestampToTime(Number(sll.lastCallTime));
                sll.dataCreateTime = timestampToTime(
                  Number(sll.dataCreateTime)
                );
                sll.createTime = timestampToTime(Number(sll.createTime));
                sll.provinceCity =
                  sll.province == "" ? "- -" : sll.province + " / " + sll.city;
                sll.callDialUp = sll.dialUpNum + "/" + sll.callNum;
              });
              this.list = res.data.list;
              this.form.total = res.data.total;
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
        })
        .catch((err) => {
          this.fullscreenLoading = false;
        });
    },
    obtainRPCD() {
      let arr = [];
      this.$refs.tree.selection.map((sll) => {
        arr.push(sll.uuid);
      });

      if (this.list.length == 0 || arr.length == 0) {
        if (this.list.length == 0) {
          this.$message({
            type: "error",
            message: "当前暂无可领取数据",
          });
        } else {
          this.$message({
            type: "error",
            message: "请您先勾选您要领取的数据",
          });
        }
      } else {
        this.$smoke_post(obtainRPCD, {
          uuidList: arr,
        }).then((res) => {
          if (res.code == 200) {
            if (res.data.result) {
              this.$message({
                type: "success",
                message:
                  "提交的线索数量" +
                  res.data.allocationSize +
                  "条" +
                  "，实际获取的线索数量" +
                  res.data.allocatedSize +
                  "条",
              });
              this.getUserRPCDList();
            } else {
              this.$message({
                type: "error",
                message: res.data.msg,
              });
              this.getUserRPCDList();
            }
          } else {
            this.$message({
              type: "error",
              message: res.msg,
            });
          }
        });
      }
    },
  },
  mounted() {},
};
</script>

<style lang="less" scoped>
.index-main {
  margin-top: 15px;
  .el-col-6 {
    height: auto !important;
  }
  height: auto;
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
}
</style>
