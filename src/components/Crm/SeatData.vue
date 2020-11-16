<template>
  <el-main class="index-main seat-data">
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
      <el-col :span="6">
        <el-date-picker
          size="small"
          style="width: 97%"
          v-model="dataPicker"
          type="datetimerange"
          range-separator="至"
          :default-time="['00:00:00', '23:59:59']"
          @change="datePickerChange"
          start-placeholder="拨打时间"
          end-placeholder="拨打时间"
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
          placeholder="输入考试项目"
          :trigger-on-focus="true"
          clearable
          @clear="autocompleteClear"
          @select="handleSelect"
        ></el-autocomplete>
      </el-col>

      <el-col :span="3">
        <el-input
          v-model.trim="form.tel"
          size="small"
          placeholder="请输入手机号"
          class="screen-li"
        ></el-input>
      </el-col>

      <el-col :span="3" class="seatData">
        <area-cascader
          type="text"
          placeholder="请选择地区"
          :class="[
            'screen-li',
            { areaSelected: form.city, areaDefault: !form.city },
          ]"
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

      <el-col :span="3">
        <el-select
          v-model="form.ruleNumberName"
          filterable
          size="small"
          placeholder="选择分配组"
          class="screen-li"
          clearable
        >
          <el-option
            v-for="item in ruleNumberNameList"
            :key="item.name"
            :label="item.name"
            :value="item.ruleNumberName"
          >
          </el-option>
        </el-select>
      </el-col>
    </el-row>

    <el-row
      class="people-screen handle-area"
      type="flex"
      justify="space-between"
    >
      <el-col>
        <el-row type="flex" class="seat-search">
          <el-col class="seat-normal">
            <el-select
              v-model="form.orderState"
              size="small"
              placeholder="选择成单状态"
              class="screen-li"
              clearable
            >
              <el-option
                v-for="item in orderStateList"
                :key="item.name"
                :label="item.name"
                :value="item.number"
              >
              </el-option>
            </el-select>
          </el-col>
          <el-col class="seat-normal">
            <el-cascader
              ref="cascader"
              size="small"
              class="smoke-cascader1 screen-li"
              placeholder="坐席组织架构"
              collapse-tags
              :show-all-levels="true"
              :options="zuzhiOptions"
              @change="handleZuzhiChange"
              filterable
              :props="{
                checkStrictly: true,
                label: 'name',
                value: 'uuid',
                children: 'list',
                multiple: true,
              }"
              clearable
            >
            </el-cascader>
          </el-col>

          <el-col class="seat-normal">
            <el-select
              v-model="form.dialState"
              size="small"
              placeholder="选择是否首咨"
              class="screen-li"
              clearable
            >
              <el-option
                v-for="item in dialStateList"
                :key="item.name"
                :label="item.name"
                :value="item.number"
              >
              </el-option>
            </el-select>
          </el-col>

          <el-col class="seat-normal">
            <el-input
              v-model="form.saleName"
              size="small"
              placeholder="输入坐席"
              class="screen-li"
            ></el-input>
          </el-col>
          <el-col
            v-for="(item, index) in searchList"
            :key="item.id"
            :style="`width: ${item.width}px`"
          >
            <el-tag
              :class="
                tag_id == item.id
                  ? 'tag_class tag_default_class'
                  : 'tag_default_class'
              "
              type="info"
              effect="plain"
              @click="tagClick(item)"
              >{{ item.name }}
            </el-tag>
          </el-col>
          <el-col class="search-btn">
            <el-button
              type="primary"
              size="small"
              style="margin-left: 2px"
              @click="getAllUserClueDataClick"
              >查 询</el-button
            >
          </el-col>
        </el-row>
      </el-col>

      <el-col class="seat-handle" style="width: 150px">
        <svg-icon
          class="border-icon smoke-fr"
          @click="editFieldHandle"
          icon-title="表头管理"
          icon-class="field"
        />
        <svg-icon
          class="border-icon smoke-fr"
          @click="TransferToGoogClick"
          icon-title="释放数据"
          icon-class="release-grey"
        />
        <svg-icon
          class="border-icon smoke-fr"
          @click="pushPeopleClick"
          icon-title="线索转移"
          icon-class="toperson"
        />
      </el-col>
    </el-row>

    <div class="number_search" v-if="tag_flag">
      <svg-icon
        style="font-size: 14px; margin-left: 10px; cursor: default"
        icon-title=""
        icon-class="tanhao"
      />本次查询出【{{ tag_name }}】总人数{{
        SeatWorkObj.clueDataNum
      }}，拨打人数{{ SeatWorkObj.callNum }}，接通人数{{
        SeatWorkObj.callOpenNum
      }}，成交人数{{ SeatWorkObj.orderNum }}
    </div>

    <el-table
      :data="list"
      ref="tableSelect"
      v-loading="fullscreenLoading"
      :height="tableHeight"
    >
      <el-table-column type="selection" width="45"> </el-table-column>
      <el-table-column
        :prop="item.props"
        v-for="(item, index) in columnList"
        :min-width="item.width"
        :key="index"
        show-overflow-tooltip
      >
        <template slot="header">
          {{ item.label }}
          <span class="caret-wrapper" v-if="item.ifSort">
            <i
              class="sort-caret ascending"
              @click="tableSort('ascending', item.props)"
            ></i>
            <i
              class="sort-caret descending"
              @click="tableSort('descending', item.props)"
            ></i>
          </span>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row[item.props] }}</span>
          <!-- <el-tooltip effect="dark" v-if="item.props == 'tel'" content="复制手机号码" placement="top">
                        <el-image
                            class="copy-icon-style"
                            @click="phoneCopy(scope.row)"
                            :src="require('../../assets/images/copy-icon.png')">
                        </el-image>
                    </el-tooltip> -->
        </template>
      </el-table-column>

      <el-table-column
        prop="active"
        label="操作"
        width="60"
        class-name="table_active"
        fixed="right"
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
      :userId="userId"
      :schoolId="schoolId"
      :examItem="examItem"
      :clueDataSUuid="clueDataSUuid"
      :userCDARUuid="userCDARUuid"
      :comMode="comMode"
      :callLogUuid="callLogUuid"
      @fatherDataList="getAllUserClueData"
    >
    </CustomerNotes>

    <PageFieldManage :setPageNum="setPageNum" />

    <el-dialog width="30%" title="线索转移" :visible.sync="drawer1">
      <el-autocomplete
        ref="autocompleteTag"
        size="small"
        class="screen-li"
        v-model="tagIdText"
        :fetch-suggestions="querySearchTag"
        placeholder="请您选择要分配的人员"
        :trigger-on-focus="true"
        clearable
        @clear="autocompleteClearTag"
        @select="handleSelectTag"
      ></el-autocomplete>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="seatActSeat" size="small"
          >确 定</el-button
        >
        <el-button @click="handleCloseTag" size="small" plain>取 消</el-button>
      </div>
    </el-dialog>
  </el-main>
</template>

<script>
import {
  getAllUserClueData,
  getExamBasic,
  enumByEnumNums,
  getRuleItem,
  clueDataRelease,
  copyTel,
  geSeatWork,
  seatActSeat,
  dataViewPermissionUserList,
  clTeaOrgFilterBox,
} from "../../request/api";
import PageFieldManage from "@/components/Base/PageFieldManage";
import { receiveTimeFun } from "../../assets/js/common";
import pcaa from "area-data/pcaa";
import { MJ_6, MJ_5 } from "../../assets/js/data";
import CustomerNotes from "../Share/CustomerNotes";
export default {
  name: "seatData",
  props: ["tableHeight", "toggleAction", "hideSearch"],
  components: {
    CustomerNotes,
    PageFieldManage,
  },
  data() {
    return {
      fieldNum: [],
      form: {
        currentPage: 1,
        pageSize: 20,
        startTime: "",
        endTime: "",
        ruleNumberName: "",
        tel: "",
        total: null,
        dialState: "",
        examItemId: "",
        examItemText: "",
        province: "",
        city: "",
        provinceCity: [], //所在省市
        spread: "",
        spreadText: "",
        userUuid: "",
        num: "",
        sortSet: [],
        intentionLevel: "",
        saleName: "",
        seatOrgList: [],
        receiveStartTime: "",
        receiveEndTime: "",
        orderState: 0, //成单状态
      },
      totalFlag: false,
      dialStateList: [
        { name: "首咨", number: 0 },
        { name: "非首咨", number: 1 },
      ],
      orderStateList: [
        { name: "未成单", number: 0 },
        { name: "已成单", number: 1 },
      ],
      ruleNumberNameList: [], //分配组数组
      list: [],
      columnList: [{ label: "" }],
      dataPicker: [],

      restaurants: [],
      enumList: {},
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
      searchList: [
        { name: "今日首咨", id: 1, width: 80 },
        { name: "2-3天数据", id: 2, width: 86 },
        { name: "4-7天数据", id: 3, width: 86 },
        { name: "8-14天数据", id: 4, width: 92 },
        { name: "14天以上数据", id: 5, width: 100 },
        { name: "公海领取数据", id: 6, width: 110 },
      ],
      tag_id: "",
      tag_name: "",
      tag_flag: false,
      SeatWorkObj: {},

      drawerTitle1: "线索转移",
      drawer1: false,
      direction1: "rtl",
      tagList: [],
      tableSelectList: [],
      tagId: "",
      tagIdText: "",
      zuzhiOptions: [],
      copyCallbackPhone: '',
    };
  },
  // watch:{
  //     '$store.state.editFieldVisible'(val){
  //         if(!val && this.$store.state.pageNum == 'YM_3'){
  //             this.getAllUserClueData()
  //         }
  //     }
  // },
  created() {
    const seatDataPageSize = localStorage.getItem("seatDataPageSize");
    if (seatDataPageSize) {
      this.form.pageSize = Number(seatDataPageSize);
    } else {
      this.form.pageSize = 20;
    }
    const uuid = localStorage.getItem("userUuid");
    this.form.userUuid = uuid;
    this.getAllUserClueData();
    this.getExamBasic();
    let arr = [MJ_6, MJ_5];
    this.enumByEnumNums(arr);
    this.pcaa = pcaa;
    this.getRuleItem();
    this.clTeaOrgFilterBox();
  },
  methods: {
    clTeaOrgFilterBox() {
      this.$smoke_get(clTeaOrgFilterBox, {}).then((res) => {
        if (res.code == 200) {
          this.zuzhiOptions = res.data;
        }
      });
    },
    handleZuzhiChange(arr) {
      let brr = [];
      arr.map((res) => {
        if (res.length == 1) {
          brr.push(res[0]);
        } else {
          brr.push(res[res.length - 1]);
        }
      });
      this.form.seatOrgList = brr;
    },
    seatActSeat() {
      if (this.tagId == "") {
        this.$message({
          type: "error",
          message: "请您先选择要分配的人员",
        });
      } else {
        this.$smoke_post(seatActSeat, {
          seatUuid: this.tagId,
          userCDARUuid: this.tableSelectList,
        }).then((res) => {
          if (res.code == 200) {
            if (res.data.result) {
              this.$message({
                type: "success",
                message:
                  res.data.msg +
                  "，提交分配的线索数量" +
                  res.data.submitSize +
                  "条" +
                  "，实际分配的线索数量" +
                  res.data.transferSize +
                  "条",
              });
              this.getAllUserClueData();
            } else {
              this.$message({
                type: "error",
                message: res.data.msg,
              });
              this.getAllUserClueData();
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
    pushPeopleClick() {
      let clueDataSUuidArr = [];
      this.$refs.tableSelect.selection.map((sll) => {
        clueDataSUuidArr.push(sll.userCDARUuid);
      });
      if (clueDataSUuidArr.length == 0) {
        this.$message({
          type: "error",
          message: "请您先勾选您要分配的数据",
        });
      } else {
        this.drawer1 = true;
        this.tagId = "";
        this.dataViewPermissionUserList();
        this.tableSelectList = clueDataSUuidArr;
      }
    },
    dataViewPermissionUserList() {
      this.$smoke_get(dataViewPermissionUserList + `/1`, {}).then((res) => {
        if (res.code == 200) {
          res.data.map((sll) => {
            sll.value = sll.userName;
          });
          this.tagList = res.data;
        } else {
          this.$message({
            type: "error",
            message: res.msg,
          });
        }
      });
    },
    tagClick(item) {
      this.tag_flag = false;
      if (this.tag_id == item.id) {
        this.tag_id = "";
        this.tag_name = "";
      } else {
        this.tag_id = item.id;
        this.tag_name = item.name;
      }
    },
    setPageNum(pageNum) {
      this.form.num = pageNum;
    },
    editFieldHandle() {
      this.$store.commit(
        "setEditFieldVisible",
        true,
        this.getAllUserClueData()
      );
    },
    tableSort(type, props) {
      this.form.sortSet = [];
      this.form.sortSet.push({
        [props]: type === "ascending" ? "ASC" : "DESC",
      });
      this.getAllUserClueData();
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
    getRuleItem() {
      this.$smoke_get(getRuleItem, {
        type: "",
      }).then((res) => {
        if (res.code == 200) {
          this.ruleNumberNameList = res.data;
        }
      });
    },
    getAllUserClueDataClick() {
      this.form.currentPage = 1;
      const obj = receiveTimeFun(this.tag_id);
      this.form.receiveStartTime = obj.receiveStartTime;
      this.form.receiveEndTime = obj.receiveEndTime;
      if (this.tag_id == 6) {
        this.form.dataType = 2;
        this.geSeatWork();
      } else if (this.tag_id == "") {
        this.form.dataType = "";
      } else {
        this.form.dataType = 1;
        this.geSeatWork();
      }
      this.getAllUserClueData();
    },
    geSeatWork() {
      this.$smoke_post(geSeatWork, {
        dataType: this.form.dataType,
        receiveStartTime: this.form.receiveStartTime,
        receiveEndTime: this.form.receiveEndTime,
      }).then((res) => {
        if (res.code == 200) {
          // this.tag_flag = true;
          this.tag_flag = false;
          this.SeatWorkObj = res.data;
        } else {
          this.tag_flag = false;
          this.$message({
            type: "error",
            message: res.msg,
          });
        }
      });
    },
    getAllUserClueData() {
      this.fullscreenLoading = true;
      this.drawer1 = false;
      this.$smoke_post(getAllUserClueData, this.form).then((res) => {
        if (res.code == 200) {
          setTimeout(() => {
            this.fullscreenLoading = false;
            // res.data.list.map(sll => {
            //     sll.lastCallTime = timestampToTime(Number(sll.lastCallTime));
            //     sll.createTime = timestampToTime(Number(sll.createTime));
            //     sll.dataType = backType(sll.dataType);
            //     sll.provinceCity = sll.province == '' ? '- -' : sll.province + ' / ' + sll.city;
            //     sll.callDialUp = sll.dialUpNum + '/' + sll.callNum;
            // })
            this.columnList = res.data.filedList;
            this.list = res.data.list;
            this.schoolId = res.data.schoolId;
            this.form.total = res.data.total;
            this.$emit("setTableHeight", this.form.total, 2);
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
    customerInfo(row) {
      this.drawer = true;
      this.clueDataSUuid = row.clueDataSUuid;
      this.userCDARUuid = row.userCDARUuid;
      this.userId = row.customerId;
      this.followFlag = false;
    },
    handleAddClick(row) {
      this.drawer = true;
      this.clueDataSUuid = row.clueDataSUuid;
      this.followFlag = true;
      this.comMode = "微信沟通";
      this.userCDARUuid = row.userCDARUuid;
      this.examItem = row.examItemId;
    },
    datePickerChange(value) {
      if (value == null) {
        this.form.startTime = "";
        this.form.endTime = "";
      } else {
        this.form.startTime = value[0].getTime();
        this.form.endTime = value[1].getTime();
      }
    },
    handleClose(done) {
      done();
    },
    handleCloseTag() {
      this.drawer1 = false;
      this.tagId = "";
    },
    handleCurrentChange(index) {
      this.form.currentPage = index;
      this.getAllUserClueData();
    },
    handleSizeChange(index) {
      this.form.pageSize = index;
      this.form.currentPage = 1;
      localStorage.setItem("seatDataPageSize", index);
      this.getAllUserClueData();
    },
    changeDrawer(val) {
      this.drawer = val;
    },
    getExamBasic() {
      let arr;
      this.$smoke_get(getExamBasic, {}).then((res) => {
        arr = JSON.parse(JSON.stringify(res.data).replace(/name/g, "value"));
        this.restaurants = arr;
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
    querySearchSpread(queryString, cb) {
      var restaurants = JSON.parse(
        JSON.stringify(this.enumList["MJ-6"]).replace(/name/g, "value")
      );
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    querySearchTag(queryString, cb) {
      var restaurants = this.tagList;
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
    handleSelect(item) {
      this.form.examItemId = item.id;
      this.form.examItemText = item.value;
    },
    handleSelectTag(item) {
      this.tagId = item.userUuid;
      this.tagIdText = item.userName;
    },
    handleSelectSpread(item) {
      this.form.spread = item.number;
      this.form.spreadText = item.value;
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
    autocompleteClearTag() {
      this.$nextTick(() => {
        this.$refs.autocompleteTag.$children
          .find((c) => c.$el.className.includes("el-input"))
          .blur();
        this.tagId = "";
        this.$refs.autocomplete.focus();
      });
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
    TransferToGoogClick() {
      let userCDARUuidArr = [];
      this.$refs.tableSelect.selection.map((sll) => {
        userCDARUuidArr.push(sll.userCDARUuid);
      });
      if (userCDARUuidArr.length == 0) {
        this.$message({
          type: "error",
          message: "请您先勾选您要释放的数据",
        });
      } else {
        this.$confirm("确认要释放数据吗？")
          .then((_) => {
            this.$smoke_post(clueDataRelease, {
              list: userCDARUuidArr,
            }).then((res) => {
              if (res.code == 200) {
                this.$message({
                  type: "success",
                  message: "数据释放成功",
                });
                this.getAllUserClueData();
              } else {
                this.$message({
                  type: "error",
                  message: res.msg,
                });
              }
            });
          })
          .catch((_) => {});
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
};
</script>

<style lang="less" scoped>
.el-table::before {
  height: 0;
}

.index-main {
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
    .seat-search {
      flex-shrink: 0;
      flex-wrap: wrap;
      .seat-normal {
        width: 14%;
      }
      .search-btn {
        width: 80px;
      }
    }
    .seat-handle {
      width: 150px;
    }
  }
}
.mt-10 {
  margin-top: 10px;
}
.seat-data /deep/.el-cascader__search-input {
  display: none;
}
</style>
