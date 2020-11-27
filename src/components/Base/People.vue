<template>
  <el-main class="index-main" id="indexMain">
    <el-row :class="[
        'people-screen',
        {
          actionHide: toggleAction,
          actionShow: !toggleAction,
          noSearch: hideSearch,
        },
      ]"
      id="searchArea">
      <el-col :span="3">
        <el-cascader
          size="small"
          ref="cascader"
          class="screen-li"
          placeholder="输入组织架构"
          :show-all-levels="false"
          :options="zuzhiOptions"
          filterable
          @change="handleZuzhiChange"
          :props="{
            checkStrictly: true,
            label: 'name',
            value: 'uuid',
            children: 'includeSubsetList',
          }"
          clearable
        >
        </el-cascader>
      </el-col>
      <el-col :span="3">
        <el-select
          v-model="roleUuidText"
          placeholder="请选择角色"
          size="small"
          @change="handleRoleUuidChange"
          class="screen-li"
          clearable
        >
          <el-option
            v-for="item in roleOptions"
            :key="item.uuid"
            :label="item.name"
            :value="item.uuid"
          >
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-select
          v-model="jobStatusText"
          placeholder="选择员工状态"
          size="small"
          @change="handleJobStatusChange"
          class="screen-li"
          clearable
        >
          <el-option
            v-for="item in jobStatusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="6">
        <el-date-picker
          clearable
          style="width: 97%"
          size="small"
          v-model="dataPicker"
          :default-time="['00:00:00', '23:59:59']"
          type="daterange"
          range-separator="至"
          @change="datePickerChange"
          start-placeholder="入职时间"
          end-placeholder="入职时间"
        >
        </el-date-picker>
      </el-col>

      <el-col :span="3">
        <el-input
          v-model="screenForm.name"
          size="small"
          placeholder="请输入姓名"
          class="screen-li"
        ></el-input>
      </el-col>

      <el-col :span="3">
        <el-input
          v-model.trim="screenForm.accountNumber"
          size="small"
          placeholder="请输入手机号"
          class="screen-li"
        ></el-input>
      </el-col>
    </el-row>
    <el-row class="people-screen handle-area">
      <el-col :span="3">
        <el-input
          v-model.trim="screenForm.jobNum"
          size="small"
          placeholder="请输入员工工号"
          class="screen-li"
          clearable
        ></el-input>
      </el-col>
      <el-col :span="21">
        <el-button type="primary" @click="smoke_search" size="small"
          >查 询</el-button
        >
        <!-- <el-button plain class='smoke-fr' @click="smoke_clear" size="small">清 空 条 件</el-button> -->
        <svg-icon
          v-if="exportPeople"
          class="smoke-fr border-icon"
          style="margin-right: 0"
          @click="export_Staff"
          icon-title="导出员工"
          icon-class="export"
        />
      </el-col>
    </el-row>
    <el-table
      id="tableList"
      :data="userList"
      @sort-change="sortChange"
      v-loading="fullscreenLoading"
      :height="tableHeight"
    >
      <el-table-column
        :prop="item.prop"
        show-overflow-tooltip
        :label="item.label"
        v-for="(item, index) in columnList"
        :min-width="item.width"
        :sortable="
          item.prop == 'name'
            ? 'custom'
            : item.prop == 'hiredDate'
            ? 'custom'
            : item.prop == 'jobStatus'
            ? 'custom'
            : false
        "
        :key="index"
      >
        <template slot-scope="scope">
          <div>
            <p class="job-status" v-if="item.prop == 'jobStatus'">
              <span v-if="scope.row.jobStatus == '在职'" class="on-job"></span>
              <span v-else class="quit"></span>
              <!-- {{userList[index][item.prop]}} -->
              {{ scope.row[item.prop] }}
            </p>

            <p v-else>{{ scope.row[item.prop] }}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="active"
        label="操作"
        v-if="peopleEdit || dataPermiss"
        width="70"
      >
        <template slot-scope="scope">
          <svg-icon
            icon-title="编辑"
            v-if="peopleEdit"
            @click="handleEditClick(scope.row)"
            icon-class="edit"
            class="svg-handle"
          />
          <svg-icon
            icon-title="数据权限"
            v-if="dataPermiss"
            @click="handlePermissClick(scope.row)"
            icon-class="permission"
          />
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      :page-size="screenForm.pageSize"
      :page-sizes="[10, 20, 30, 50, 100]"
      :hide-on-single-page="totalFlag"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    >
    </el-pagination>
  </el-main>
</template>

<script>
import {
  getUserDetailedList,
  getRoleList,
  getOrgSubsetByUuid,
  exportUserDetailedList,
} from "../../request/api";
import {
  getTextByJs,
  getTextByState,
  sortTextNum,
} from "../../assets/js/common";
import { add } from "lodash/fp";
export default {
  name: "people",
  props: ['tableHeight','toggleAction', 'hideSearch'],
  data() {
    return {
      userList: [],
      columnList: [
        { prop: "jobNumber", label: "员工工号" },
        { prop: "name", label: "姓名" },
        { prop: "accountNumber", label: "手机号" },
        { prop: "jobStatus", label: "状态" },
        { prop: "schoolList", label: "分校", width: 180 },
        { prop: "orgUuidList", label: "部门", width: 180 },
        { prop: "roleUuidList", label: "角色", width: 180 },
        { prop: "hiredDate", label: "入职时间", width: 120 },
      ],
      total: null, //总条目数
      totalFlag: false, //当只有一页时隐藏分页
      jobStatusOptions: [
        {
          value: 1,
          label: "在职",
        },
        {
          value: 0,
          label: "离职",
        },
      ],
      jobStatusText: "在职", //状态选择文案
      roleUuidText: "", //角色选择文案
      roleOptions: [], //筛选项角色列表
      zuzhiOptions: [], //组织列表
      screenForm: {
        accountNumber: "", //账号（手机号）
        currentPage: 1, //当前页
        jobStatus: 1, // 状态选择value
        jobNum: "",
        name: "", //姓名
        orgUuidList: [], //组织唯一标识集合
        pageSize: 20, //单页请求的数量
        roleUuid: "", //角色唯一标识
        sortSet: [{ hiredDate: "DESC" }], //排序集合
        startHiredDate: "",
        endHiredDate: "",
      },
      dataPicker: [],
      sortSetList: [
        { jobNumber: "" },
        { name: "" },
        { hiredDate: "" },
        { jobStatus: "" },
      ],
      fullscreenLoading: false,
      peopleEdit: null,
      dataPermiss: null,
      exportPeople: null,
    };
  },
  created() {
    this.getRoleList();
    this.getOrgSubsetByUuid();
    let buttonMap = JSON.parse(localStorage.getItem("buttonMap"));
    this.peopleEdit = buttonMap.peopleEdit;
    this.dataPermiss = buttonMap.dataPermiss;
    this.exportPeople = buttonMap.exportPeople;

    // this.screenForm.accountNumber = this.$route.params.accountNumber
    // this.screenForm.jobStatus = this.$route.params.jobStatus
    // this.screenForm.name = this.$route.params.name
    // this.screenForm.orgUuidList = this.$route.params.orgUuidList
    // this.screenForm.roleUuid = this.$route.params.roleUuid
    // this.screenForm.sortSet = this.$route.params.sortSet
    // this.screenForm.startHiredDate = this.$route.params.startHiredDate
    // this.screenForm.endHiredDate = this.$route.params.endHiredDate
    this.getUserDetailedList();
  },
  methods: {
    sortChange(data) {
      this.screenForm.sortSet = [];
      const id = sortTextNum(data.prop);
      if (data.order == "descending") {
        this.sortSetList[id][data.prop] = "DESC";
      } else if (data.order == "ascending") {
        this.sortSetList[id][data.prop] = "ASC";
      }
      this.screenForm.sortSet.push(this.sortSetList[id]);
      this.getUserDetailedList();
    },
    datePickerChange(value) {
      if (value == null) {
        this.screenForm.startHiredDate = "";
        this.screenForm.endHiredDate = "";
      } else {
        this.screenForm.startHiredDate = value[0].getTime() / 1000;
        this.screenForm.endHiredDate = value[1].getTime() / 1000;
      }
    },
    export_Staff() {
      // let str = '';

      // this.screenForm.sortSet.map(sll => {
      //     for(var key in sll){
      //         str = key + '-' + sll[key]
      //     }
      // })

      // if(this.screenForm.orgUuidList[0] == undefined){
      //     this.screenForm.orgUuidList[0] = '';
      // }
      let href =
        exportUserDetailedList +
        "?jobStatus=" +
        this.screenForm.jobStatus +
        "&accountNumber=" +
        this.screenForm.accountNumber +
        "&name=" +
        this.screenForm.name +
        "&roleUuid=" +
        this.screenForm.roleUuid +
        "&startHiredDate=" +
        this.screenForm.startHiredDate +
        "&endHiredDate=" +
        this.screenForm.endHiredDate;
      // + '&sortSet=' + str +
      // '&orgUuidList=' + this.screenForm.orgUuidList[0];
      window.open(href, "_blank");
    },
    handleEditClick(row) {
      // sessionStorage.setItem('screenForm', JSON.stringify(this.screenForm))
      this.$router.push({
        path: "/base/people/change",
        query: {
          uuid: row.uuid,
          accountNumber: this.screenForm.accountNumber, //账号（手机号）
          jobStatus: this.screenForm.jobStatus, // 状态选择value
          name: this.screenForm.name, //姓名
          orgUuidList: this.screenForm.orgUuidList, //组织唯一标识集合
          roleUuid: this.screenForm.roleUuid, //角色唯一标识
          sortSet: this.screenForm.sortSet, //排序集合
          startHiredDate: this.screenForm.startHiredDate,
          endHiredDate: this.screenForm.endHiredDate,
        },
      });
    },
    handlePermissClick(row) {
      // sessionStorage.setItem('screenForm', JSON.stringify(this.screenForm))
      this.$router.push({
        path: "/base/people/permiss",
        query: {
          uuid: row.uuid,
          accountNumber: this.screenForm.accountNumber, //账号（手机号）
          jobStatus: this.screenForm.jobStatus, // 状态选择value
          name: this.screenForm.name, //姓名
          orgUuidList: this.screenForm.orgUuidList, //组织唯一标识集合
          roleUuid: this.screenForm.roleUuid, //角色唯一标识
          sortSet: this.screenForm.sortSet, //排序集合
          startHiredDate: this.screenForm.startHiredDate,
          endHiredDate: this.screenForm.endHiredDate,
        },
      });
    },
    handleRoleUuidChange(value) {
      this.screenForm.roleUuid = value;
      this.screenForm.currentPage = 1;
      this.getUserDetailedList();
    },
    handleJobStatusChange(value) {
      this.screenForm.jobStatus = value;
      this.screenForm.currentPage = 1;
      this.getUserDetailedList();
    },
    handleSizeChange(index) {
      this.screenForm.pageSize = index;
      this.getUserDetailedList();
    },
    handleCurrentChange(index) {
      this.screenForm.currentPage = index;
      this.getUserDetailedList();
    },
    handleZuzhiChange(arr) {
      arr = arr.slice(-1);
      this.screenForm.orgUuidList = arr;
      this.screenForm.currentPage = 1;
      this.getUserDetailedList();
    },
    getUserDetailedList() {
      this.fullscreenLoading = true;
      this.$smoke_post(getUserDetailedList, this.screenForm).then((res) => {
        if (res.code == 200) {
          setTimeout(() => {
            this.fullscreenLoading = false;
            this.total = res.data.total;
            this.$emit("setTableHeight", this.total, 1);
            // 用户列表
            res.data.list.map((data) => {
              data.orgUuidList = getTextByJs(data.orgUuidList);
              data.schoolList = getTextByJs(data.schoolList,'schoolName');
              data.roleUuidList = getTextByJs(data.roleUuidList);
              data.jobStatus = getTextByState(data.jobStatus);
              data.hiredDate = data.hiredDate.split(" ")[0];
            });
            this.userList = res.data.list;
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
    getRoleList() {
      this.$smoke_get(getRoleList, {}).then((res) => {
        this.roleOptions = res.data;
      });
    },
    getOrgSubsetByUuid() {
      this.$smoke_post(getOrgSubsetByUuid, {
        uuid: "",
      }).then((res) => {
        this.zuzhiOptions = res.data;
      });
    },
    smoke_search() {
      this.screenForm.currentPage = 1;
      this.getUserDetailedList();
    },
    smoke_clear() {
      this.screenForm.accountNumber = "";
      this.screenForm.jobStatus = 1;
      this.screenForm.name = "";
      this.screenForm.orgUuidList = [];
      this.screenForm.roleUuid = "";
      this.screenForm.sortSet = [];
      this.jobStatusText = "";
      this.roleUuidText = "";

      // 主动触发clearable
      let obj = {};
      obj.stopPropagation = () => {};
      try {
        this.$refs.cascader.clearValue(obj);
      } catch (err) {
        this.$refs.cascader.handleClear(obj);
      }
      this.screenForm.currentPage = 1;
      this.getUserDetailedList();
    },
  },
};
</script>

<style lang="less" scoped>
.index-main {
  #toggleSearch {
    position: absolute;
    top: -10px;
    left: 100px;
  }
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
    font-weight: 700;
  }
  .people-screen {
    margin-bottom: 10px;
    .screen-li {
      width: 94%;
    }
  }
  /deep/ .el-table {
    .el-table__body {
      .job-status {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        span {
          width: 5px;
          height: 5px;
          display: inline-block;
          border-radius: 50%;
          margin-right: 10px;
        }
        span.on-job {
          background: #35ce8f;
        }
        span.quit {
          background: #ff4d4f;
        }
      }
    }
  }
}
</style>