<template>
    <el-main class="index-main">
        <el-row :class="['people-screen', {actionHide: toggleAction, actionShow: !toggleAction, noSearch: hideSearch}]">

            <el-col :span="3">
                <el-input v-model.trim="form.tel" placeholder="请输入手机号" class="screen-li" size="small"></el-input>
            </el-col>

            <el-col :span="3">
                <el-input v-model="form.name" placeholder="请输入姓名" class="screen-li" size="small"></el-input>
            </el-col>

            <el-col :span="3">
                <el-autocomplete
                  clearable
                  size="small"
                  class="screen-li"
                  ref="autocomplete"
                  v-model="form.examItemText"
                  :fetch-suggestions="querySearch"
                  placeholder="输入考试项目"
                  :trigger-on-focus="true"
                  @select="handleSelect"
                  @clear="autocompleteClear"
                ></el-autocomplete>
            </el-col>

            <el-col :span="3">

                <el-autocomplete
                  clearable
                  size="small"
                  ref="autocompleteSpread"
                  class="inline-input screen-li"
                  v-model="form.spreadText"
                  :fetch-suggestions="querySearchSpread"
                  placeholder="输入推广渠道"
                  :trigger-on-focus="true"
                  @select="handleSelectSpread"
                  @clear="autocompleteClearSpread"
                ></el-autocomplete>

            </el-col>

            <el-col :span="3">
                <el-autocomplete
                  clearable
                  size="small"
                  ref="autocompleteAcc"
                  class="inline-input screen-li"
                  v-model="form.accText"
                  :fetch-suggestions="querySearchAcc"
                  placeholder="输入推广账号"
                  :trigger-on-focus="true"
                  @select="handleSelectAcc"
                  @clear="autocompleteClearAcc"
                ></el-autocomplete>
            </el-col>

            <el-col :span="3">
                <el-select v-model="form.dialState" size="small" placeholder="选择是否拨打" class="screen-li" clearable>
                    <el-option
                      v-for="item in dialStateArr"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                </el-select>
            </el-col>

            <el-col :span="3">
                <el-input v-model="form.belongingSeat" size="small" placeholder="请输入坐席" class="screen-li" clearable></el-input>
            </el-col>

            <el-col :span="3">
                <el-select v-model="form.isAllocation" size="small" placeholder="选择是否分配" style="width: 100%;" clearable>
                    <el-option
                      v-for="item in isAllocationArr"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                </el-select>
            </el-col>

        </el-row>

        <el-row class="people-screen handle-area">

            <el-col :span="6">
                <el-date-picker
                    clearable
                    style="width: 97%;"
                    size="small"
                    v-model="dataPickerku"
                    type="datetimerange"
                    range-separator="至"
                    :default-time="['00:00:00', '23:59:59']"
                    @change="datePickerChangeku"
                    :picker-options="pickerOptions"
                    start-placeholder="入库时间"
                    end-placeholder="入库时间">
                </el-date-picker>
            </el-col>

            <el-col :span="6">
                <el-date-picker
                    clearable
                    style="width: 97%;"
                    size="small"
                    v-model="dataPickerpei"
                    type="datetimerange"
                    range-separator="至"
                    :default-time="['00:00:00', '23:59:59']"
                    @change="datePickerChangepei"
                    :picker-options="pickerOptions"
                    start-placeholder="分配时间"
                    end-placeholder="分配时间">
                </el-date-picker>
            </el-col>

            <el-col :span="3">
                <el-select v-model="form.inputMode" size="small" placeholder="请选择属性"  class="screen-li" clearable>
                    <el-option
                      v-for="item in inputModeArr"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                </el-select>
            </el-col>

            <el-col :span="3">
                <el-select v-model="form.intentionLevel" placeholder="请选择意向等级" size="small"  class="screen-li" clearable>
                    <el-option
                      v-for="item in enumList['MJ-5']"
                      :key="item.name"
                      v-if="item.enable"
                      :label="item.name"
                      :value="item.number">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="3">

                <el-select v-model="form.ruleNumberName" size="small" filterable placeholder="请输入分配组" class="screen-li" clearable>
                    <el-option
                      v-for="item in ruleNumberNameList"
                      :key="item.name"
                      :label="item.name"
                      :value="item.ruleNumberName">
                    </el-option>
                </el-select>

            </el-col>
            <el-col :span="3">
                <el-button type="primary" size="small" @click="getExteClueDataClick">查询</el-button>

                <el-button size="small" style="float:right;" plain @click="personalClueExport">导 出</el-button>
            </el-col>

        </el-row>

        <el-table
            :data="tableData"
            v-loading="fullscreenLoading"
            :height="tableHeight"
        >

            <el-table-column
                :prop="item.prop"
                :label="item.label"
                :show-overflow-tooltip="item.prop == 'notes' ? true : item.prop == 'referencePage' ? true : false"
                v-for="(item, index) in columnList"
                :min-width="item.width"
                :key="index"
                :formatter="item.formatter">
            </el-table-column>

            <el-table-column prop="active" label="操作" fixed="right" width="100" class-name="table_active">
              <template slot-scope="scope">
                <svg-icon style="margin-left: 4px;" @click="customerInfo(scope.row)" icon-title="客户信息" icon-class="members" />
                <el-popconfirm
                    confirmButtonText='确定'
                    cancelButtonText='取消'
                    icon="el-icon-info"
                    iconColor="red"
                    placement="top"
                    title="删除后该线索进入线索垃圾站，是否继续？"
                    @onConfirm="delCludes(scope.row)"
                >
                <svg-icon slot="reference" style="margin-left: 4px;" icon-title="删除线索" icon-class="del" />
                </el-popconfirm>
                <svg-icon slot="reference" style="margin-left: 4px;" icon-title="转移线索" icon-class="distribute" @click="transferClude(scope.row)" />
              </template>
            </el-table-column>

        </el-table>

        <el-pagination
            background
            layout="total, sizes, prev, pager, next, jumper"
            :total='form.total'
            :page-size='form.pageSize'
            :current-page='form.currentPage'
            :page-sizes="[10, 20, 30, 50, 100]"
            :hide-on-single-page="totalFlag"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
        >
        </el-pagination>

        <CustomerNotes
            v-if="drawer"
            @changeDrawer="changeDrawer"
            :followFlag='followFlag'
            :drawer.sync='drawer'
            :userUuid='form.userUuid'
            :schoolId='schoolId'
            :userId="userId"
            :examItem='examItem'
            :clueDataSUuid='clueDataSUuid'
            :userCDARUuid='userCDARUuid'
            :comMode='comMode'
            :callLogUuid='callLogUuid'
            @fatherDataList='getExteClueData'
        >
        </CustomerNotes>
        <el-dialog class="transferSeat" :visible="transferSeatVisible" width="300px" title="转移线索" @close="transferSeatVisible=false">
            <el-autocomplete
                ref="autocompleteTag"
                size="small"
                class="screen-li"
                v-model="tagIdText"
                :fetch-suggestions="queryUserList"
                placeholder="请您选择要分配的人员"
                :trigger-on-focus="true"
                clearable
                @clear="autocompleteClearTag"
                @select="handleSelectTag"
            ></el-autocomplete>
            <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="transferSeat" size="small">确 定</el-button>
            <el-button @click="transferSeatVisible=false" size="small" plain>取 消</el-button>
            </div>
        </el-dialog>
        <el-dialog class="transferOverflow" :visible="overflowRecoverVisible" width="300px" title="转移线索" @close="overflowRecoverVisible=false">
            <el-tag
                v-for="(item,index) in checkedData" :key="index"
                style="margin: 0 10px 10px 0;"
                >{{item.orgName}}</span>
            </el-tag>
            <el-input
            placeholder="输入关键字进行过滤"
            v-model="filterText">
            </el-input>

            <el-tree
            class="filter-tree"
            node-key="orgUuid"
            show-checkbox
            :data="orgList"
            :props="defaultProps"
            default-expand-all
            :filter-node-method="filterNode"
            @check="handleCheckChange"
            ref="tree">
            </el-tree>
            <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="transferOverflow" size="small">确 定</el-button>
            <el-button @click="overflowRecoverVisible=false" size="small" plain>取 消</el-button>
            </div>
        </el-dialog>
    </el-main>
</template>

<script>
import {
  getExteClueData,
  getExamBasic,
  enumByEnumNums,
  personalClueExport,
  deleteClueDatas,
  dataViewPermissionUserList,
  seatActSeat,
  getRuleUserStructureLimit,
  spillPoolActSeat,
  getRuleItem,
  recPoolActSeat,
} from "../../request/api";
import { MJ_5, MJ_6, MJ_7, MJ_9, zuzhiUuid } from "../../assets/js/data";
import {
  timestampToTime,
  input_mode_Text,
  isAllocationText,
  dialStateText,
  filepostDown,
  pushPeopleFunc,
} from "../../assets/js/common";
import CustomerNotes from "../Share/CustomerNotes";
export default {
  name: "peopleClues",
  props: ["tableHeight", "toggleAction", "hideSearch"],
  components: {
    CustomerNotes,
  },
  data() {
    return {
      form: {
        accId: "",
        accText: "",
        belongingSeat: "",
        currentPage: 1,
        dialState: "",
        endCreateTime: "",
        examItemId: "",
        examItemText: "",
        isAllocation: "",
        pageSize: 20,
        sortSet: [{}],
        spreadId: "",
        spreadText: "",
        inputMode: "",
        startCreateTime: "",
        total: null,
        ruleNumberName: "", //分配组组名
      },
      ruleNumberNameList: [], //分配组数组
      isAllocationArr: [
        { label: "未分配", value: 0 },
        { label: "已分配", value: 1 },
      ],
      dialStateArr: [
        { label: "已拨打", value: 1 },
        { label: "未拨打", value: 0 },
      ],
      inputModeArr: [
        { label: "线上", value: 0 },
        { label: "录入", value: 1 },
      ],
      enumList: {},
      dataPickerku: [
        new Date(new Date(new Date().toLocaleDateString()).getTime()),
        new Date(
          new Date(new Date().toLocaleDateString()).getTime() +
            3600 * 1000 * 24 -
            1
        ),
      ],
      dataPickerpei: [],
      pickerOptions: {
        disabledDate(time) {
          return (
            time.getTime() >
            new Date(new Date().toLocaleDateString()).getTime() +
              3600 * 1000 * 24 -
              1
          );
        },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              const start = new Date(
                new Date(new Date().toLocaleDateString()).getTime()
              );
              const end = new Date(
                new Date(new Date().toLocaleDateString()).getTime() +
                  3600 * 1000 * 24 -
                  1
              );
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "近7天",
            onClick(picker) {
              const start = new Date(
                new Date(new Date().toLocaleDateString()).getTime() -
                  3600 * 1000 * 24 * 6
              );
              const end = new Date(
                new Date(new Date().toLocaleDateString()).getTime() +
                  3600 * 1000 * 24 -
                  1
              );
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "本月",
            onClick(picker) {
              let start = new Date();
              start.setDate(1);
              start.setHours(0);
              start.setSeconds(0);
              start.setMinutes(0);
              const end = new Date(
                new Date(new Date().toLocaleDateString()).getTime() +
                  3600 * 1000 * 24 -
                  1
              );
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "近30天",
            onClick(picker) {
              const start = new Date(
                new Date(new Date().toLocaleDateString()).getTime() -
                  3600 * 1000 * 24 * 29
              );
              const end = new Date(
                new Date(new Date().toLocaleDateString()).getTime() +
                  3600 * 1000 * 24 -
                  1
              );
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      tableData: [],
      columnList: [
        { prop: "tel", label: "手机号码", width: 90 },
        { prop: "name", label: "客户姓名", formatter: this.parseNull },
        { prop: "examItemName", label: "考试项目", width: 120 },
        {
          prop: "spread",
          label: "推广渠道",
          width: 120,
          formatter: this.parseNull,
        },
        { prop: "acc", label: "推广账号", width: 120 },
        //   { 'prop': 'exteName', 'label': '推广人' },
        {
          prop: "referencePage",
          label: "推广落地页",
          width: 200,
          formatter: this.parseNull,
        },
        { prop: "isAllocation", label: "是否分配" },
        { prop: "dialState", label: "是否拨打" },
        {
          prop: "callDialUp",
          label: "拨通 / 拨打",
          formatter: this.parseCallNumber,
        },
        { prop: "createTime", label: "入库时间", width: 140 },
        { prop: "allocationTime", label: "分配时间", width: 140 },
        { prop: "belongingSeat", label: "所属坐席", formatter: this.parseNull },
        {
          prop: "intentionLevel",
          label: "意向等级",
          width: 150,
          formatter: this.parseNull,
        },
        { prop: "inputMode", label: "属性" },
        { prop: "notes", label: "备注", width: 180, formatter: this.parseNull },
      ],
      totalFlag: false, //当只有一页时隐藏分页
      restaurants: [],
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
      checkedData: [],
      transferSeatVisible: false,
      overflowRecoverVisible: false,
      seatList: [],
      transferSeatForm: {
        seatUuid: "",
        userCDARUuid: [],
      },
      overflowRecoverForm: {
        clueDataSUuid: [],
        seatUuid: [],
      },
      filterText: "",
      defaultProps: {
        children: "list",
        label: "orgName",
      },
      orgList: [],
      clueDataType: 0,
      tagId: "",
      tagIdText: "",
      tagList: [],
    };
  },
  created() {
    this.form.startCreateTime = new Date(
      new Date(new Date().toLocaleDateString()).getTime()
    ).getTime();
    this.form.endCreateTime =
      new Date(new Date(new Date().toLocaleDateString()).getTime()).getTime() +
      3600 * 1000 * 24 -
      1;
    this.getExteClueData();
    this.getExamBasic();
    let arr = [MJ_5, MJ_6, MJ_7, MJ_9];
    this.enumByEnumNums(arr);
    this.getRuleItem();
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  methods: {
    getRuleItem() {
      this.$smoke_get(getRuleItem, {
        type: "",
      }).then((res) => {
        if (res.code == 200) {
          this.ruleNumberNameList = res.data;
        }
      });
    },
    parseNull(row, column, cellValue) {
      return cellValue || "- -";
    },
    parseCallNumber(row) {
      return row.dialUpNum + "/" + row.callNum;
    },
    getUserList(obj) {
      let userList = [];
      function getLeaf(obj) {
        obj.forEach((item) => {
          if (item.userList) {
            item.userList.forEach((leafItem) => {
              userList.push({
                userName: leafItem.userName,
                userUuid: leafItem.userUuid,
              });
            });
            // console.log(userList)
          }
          if (item.list) {
            getLeaf(item.list);
          }
        });
      }
      getLeaf(obj);
      return this.uniqArray(userList);
    },
    uniqArray(arr) {
      var obj = {};
      var result = arr.reduce(function (a, b) {
        obj[b.userName] ? "" : (obj[b.userName] = true && a.push(b));
        return a;
      }, []);
      return result;
    },
    queryUserList(queryString, cb) {
      var restaurants = JSON.parse(
        JSON.stringify(this.getUserList(this.orgList)).replace(
          /userName/g,
          "value"
        )
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
    getCheckedNodes() {
      let arr = [];
      this.$nextTick(() => {
        this.$refs.tree.getCheckedNodes().map((sll) => {
          if (sll.hasOwnProperty("userUin")) {
            // hasOwnProperty 判断对象是否含有某个属性
            arr.push(sll);
          }
        });
        this.checkedData = arr;
      });
    },
    handleCheckChange(data, value) {
      this.getCheckedNodes();
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.orgName.indexOf(value) !== -1;
    },
    autocompleteClearTag() {
      this.$nextTick(() => {
        this.$refs.autocompleteTag.$children
          .find((c) => c.$el.className.includes("el-input"))
          .blur();
        this.tagId = "";
        this.$refs.autocompleteTag.focus();
      });
    },
    handleSelectTag(item) {
      this.tagId = item.userUuid;
      this.tagIdText = item.value;
    },
    transferClude(row) {
      this.clueDataType = row.clueDataType;
      if (row.clueDataType == 1 || row.clueDataType == 2) {
        //1-溢出池 2-公海
        this.filterText = "";
        this.checkedData = [];
        this.overflowRecoverVisible = true;
        this.overflowRecoverForm.clueDataSUuid[0] = row.clueDataUuid;
      } else if (row.clueDataType == 3) {
        //坐席名下
        this.transferSeatForm.seatUuid = "";
        this.tagIdText = "";
        this.transferSeatVisible = true;
        this.transferSeatForm.userCDARUuid[0] = row.userCDARUuid;
      }
      this.$smoke_post(getRuleUserStructureLimit, {
        uuid: zuzhiUuid,
      }).then((res) => {
        if (res.code == 200) {
          this.orgList = pushPeopleFunc(res.data.list);
          this.getUserList(this.orgList);
        }
      });
    },
    transferSeat() {
      if (this.tagId == "") {
        this.$message({
          type: "error",
          message: "请您先选择要分配的人员",
        });
      } else {
        this.$smoke_post(seatActSeat, {
          seatUuid: this.tagId,
          userCDARUuid: this.transferSeatForm.userCDARUuid,
        }).then((res) => {
          if (res.code == 200) {
            if (res.data.result) {
              this.$message({
                type: "success",
                message: res.data.msg,
              });
              this.getExteClueData();
              this.transferSeatVisible = false;
            } else {
              this.$message({
                type: "error",
                message: res.msg,
              });
            }
          } else {
            this.$message({
              type: "error",
              message: "线索转移失败",
            });
          }
        });
      }
    },
    getSeatList() {
      this.$smoke_get(dataViewPermissionUserList + "/1", {}).then((res) => {
        if (res.code == 200) {
          res.data.map((sll) => {
            sll.value = sll.userName;
          });
          this.tagList = res.data;
        }
      });
    },
    transferOverflow() {
      let seatUuidArr = [];
      this.checkedData.map((sll) => {
        seatUuidArr.push(sll.userUuid);
      });
      this.overflowRecoverForm.seatUuid[0] = seatUuidArr;
      if (seatUuidArr.length == 0) {
        this.$message({
          type: "error",
          message: "请您先勾选您要转移的目标人员",
        });
      } else {
        if (this.clueDataType == 1) {
          this.$smoke_post(spillPoolActSeat, this.overflowRecoverForm).then(
            (res) => {
              if (res.code == 200) {
                if (res.data.result) {
                  this.$message({
                    type: "success",
                    message: res.data.msg,
                  });
                  this.getExteClueData();
                  this.overflowRecoverVisible = false;
                } else {
                  this.$message({
                    type: "error",
                    message: res.msg,
                  });
                }
              } else {
                this.$message({
                  type: "error",
                  message: "线索转移失败",
                });
              }
            }
          );
        } else {
          this.$smoke_post(recPoolActSeat, this.overflowRecoverForm).then(
            (res) => {
              if (res.code == 200) {
                if (res.data.result) {
                  this.$message({
                    type: "success",
                    message: res.data.msg,
                  });
                  this.getExteClueData();
                  this.overflowRecoverVisible = false;
                } else {
                  this.$message({
                    type: "error",
                    message: res.msg,
                  });
                }
              } else {
                this.$message({
                  type: "error",
                  message: "线索转移失败",
                });
              }
            }
          );
        }
      }
    },
    delCludes(row) {
      this.$smoke_post(deleteClueDatas + row.clueDataSUuid, {}).then((res) => {
        if (res.code == 200) {
          this.$message({
            type: "success",
            message: "线索删除成功，可在线索垃圾站回收该线索。",
          });
          this.getExteClueData();
        } else {
          this.$message({
            type: "error",
            message: res.msg,
          });
        }
      });
    },
    personalClueExport() {
      let tmp = new Date().getTime();
      let exportTime =
        new Date(
          new Date(new Date().toLocaleDateString()).getTime()
        ).getTime() -
        3600 * 1000 * 24 * 31;
      if (this.form.startCreateTime == "" || this.form.endCreateTime == "") {
        this.$message({
          type: "error",
          message: "入库时间不能为空",
        });
      } else if (this.form.startCreateTime < exportTime) {
        this.$message({
          type: "error",
          message: "入库时间不能为空，且时间间隔不能超过31天",
        });
      } else {
        tmp = timestampToTime(tmp);
        filepostDown(personalClueExport, this.form, "线索-" + tmp + ".xlsx");
      }
    },
    changeDrawer(val) {
      this.drawer = val;
    },
    //客户信息
    customerInfo(row) {
      this.drawer = true;
      this.clueDataSUuid = row.clueDataSUuid;
      this.userId = row.customerId;
      this.followFlag = false;
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
    querySearchAcc(queryString, cb) {
      var restaurants = JSON.parse(
        JSON.stringify(this.enumList["MJ-7"]).replace(/name/g, "value")
      );
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
    handleSelectSpread(item) {
      this.form.spreadId = item.number;
      this.form.spreadText = item.value;
    },
    handleSelectAcc(item) {
      this.form.accId = item.number;
      this.form.accText = item.value;
    },
    autocompleteClearAcc() {
      this.$nextTick(() => {
        this.$refs.autocompleteAcc.$children
          .find((c) => c.$el.className.includes("el-input"))
          .blur();
        this.form.accId = "";
        this.$refs.autocompleteAcc.focus();
      });
    },
    autocompleteClearSpread() {
      this.$nextTick(() => {
        this.$refs.autocompleteSpread.$children
          .find((c) => c.$el.className.includes("el-input"))
          .blur();
        this.form.spreadId = "";
        this.$refs.autocompleteSpread.focus();
      });
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
    enumByEnumNums(arr) {
      this.$smoke_post(enumByEnumNums, {
        numberList: arr,
      }).then((res) => {
        if (res.code == 200) {
          this.enumList = res.data;
          // for(let i in res.data) {
          //     this.enumList[i] = this.enumList[i].filter(item => item.enable != 0);
          // }
          // console.log(this.enumList);
        }
      });
    },
    getExteClueDataClick() {
      this.form.currentPage = 1;
      this.getExteClueData();
    },
    getExteClueData() {
      this.fullscreenLoading = true;
      this.$smoke_post(getExteClueData, this.form).then((res) => {
        if (res.code == 200) {
          setTimeout(() => {
            this.fullscreenLoading = false;

            res.data.list.map((sll, index) => {
              sll.createTime = timestampToTime(Number(sll.createTime));
              sll.allocationTime = timestampToTime(Number(sll.allocationTime));
              sll.inputMode = input_mode_Text(sll.inputMode);
              sll.isAllocation = isAllocationText(sll.isAllocation);
              sll.dialState = dialStateText(sll.dialState);
            });

            this.tableData = res.data.list;
            this.form.total = res.data.total;
            this.$emit("setTableHeight", this.form.total);
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
    datePickerChangeku(value) {
      if (value == null) {
        this.form.startCreateTime = "";
        this.form.endCreateTime = "";
      } else {
        this.form.startCreateTime = value[0].getTime();
        this.form.endCreateTime = value[1].getTime();
      }
    },
    datePickerChangepei(value) {
      if (value == null) {
        this.form.receiveStartTime = "";
        this.form.receiveEndTime = "";
      } else {
        this.form.receiveStartTime = value[0].getTime();
        this.form.receiveEndTime = value[1].getTime();
      }
    },
    handleCurrentChange(index) {
      this.form.currentPage = index;
      this.getExteClueData();
    },
    handleSizeChange(index) {
      this.form.pageSize = index;
      this.form.currentPage = 1;
      this.getExteClueData();
    },
  },
  mounted() {},
};
</script>

<style lang="less" scoped>
.index-main {
  height: auto;
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
}
.index-main /deep/ .bofang-column {
  padding: 0 !important;
}
</style>
