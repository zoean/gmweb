<template>
  <el-container class="index-main">
    <el-main>
      <div class="people-title">奖品列表</div>
      <el-row>
        <el-col :span="4">
          <el-input v-model="awardName" placeholder="奖品名称" style="width:90%;marginBottom:.2rem"></el-input>
        </el-col>
        <el-col :span="4">
          <el-select v-model="awardType" placeholder="全部类型" style="width:80%">
            <el-option
              v-for="item in pricrListOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" style="width:80%" @click="searchbtn">搜索</el-button>
        </el-col>
        <el-col :span="2" style="float:right;">
          <el-button type="primary" style="width:90%;float:right;" @click="addActivity">添加奖品</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="21">
          <el-input
            placeholder="输入领奖说明;中奖者领奖时看到的文案说明"
            type="textarea"
            v-model="awardInstruction"
            style="marginBottom:.5rem"
          ></el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" style="width:100%;height:.5rem" @click='submitAwardCon'>提交中奖文案</el-button>
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
            <el-button type="text" @click="priceEdit(scope.row)">修改</el-button>
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
    </el-main>
  </el-container>
</template>
<script>
import { wechatActivityAwardLlist,wechatActivityAwardExplain } from "@/request/operateApi.js";
export default {
  name: "PriceList",
  data() {
    return {
      awardName: "",
      awardType: "",
      awardInstruction: "",//中奖文案
      columnList: [
        {
          label: "奖品ID",
          prop: "awardId",
          width: 125
        },
        {
          label: "奖品名称",
          prop: "awardName"
        },
        {
          label: "奖品类型",	
          prop: "pricrType",
          width: 125
        },
        {
          label: "市场价格",
          prop: "valuationPrice",
          width: 125
        },
        {
          label: "更新时间",
          prop: "updateTime"
        },
        {
          label: "状态",
          prop: "awardStatus"
        },
        {
          label: "任务人数",
          prop: "taskPeople"
        }
      ],
      tableData: [],
      pricrListOption: [
        {
          label: "平台优惠券",
          value: 1
        },
        {
          label: "实物邮寄",
          value: 2
        },
        {
          label: "自定义链接",
          value: 3
        }
      ],
      total: 0, //总数
      pageSize: 10, //一页显示几条
      currentPage: 1, //当前页数
      totalFlag: false //当只有一页时隐藏分页
    };
  },
  created(){
    this.getlistData();
  },
  methods: {
    priceEdit(row) {
      console.log(row)
      this.$router.push({
        path: "/operate/activityA/pricedetail",
        query: { activityId: row.activityId, priceType: row.awardType,awardId:row.awardId }
      });
    },
    addActivity() {
      //添加奖品
      this.$router.push({
        path:"/operate/activityA/pricedetail",
        query:{activityId:this.$route.query.activityId}
      });
    },
    getlistData(awardName='',awardType='') {//获取数据
      this.$smoke_get(wechatActivityAwardLlist, {
        activityId: this.$route.query.activityId,
        pageSize: this.pageSize,
        currentPage: this.currentPage,
        awardName,
        awardType
      }).then(res => {
        console.log(res)

        if (res.code === 200) {
         this.awardInstruction = res.data.awardExplain&&res.data.awardExplain.awardInstruction
         this.total = res.data.total
         this.pageSize = res.data.pageSize;
         this.ProcessingData(res.data)
        }
 
      });
    },
    submitAwardCon(){//提交文案按钮
      this.$smoke_post(wechatActivityAwardExplain,{activityId:this.$route.query.activityId,awardInstruction:this.awardInstruction})
      .then(res=>{
         if(res.code === 200){
            this.$message('提交' + res.msg);
         }
      })
    },
    handleCurrentChange(currentPage) {//改变当前页码
      this.currentPage = currentPage;
      this.getListData();
    },
    handleSizeChange(pageSiz) {//改变一页显示数量
      this.pageSiz = pageSiz;
    },
    ProcessingData(data){//处理一下返回的数据
        this.tableData =  data.list.map(item=>{
            if(item.membersMax){//奖品类型（1-优惠券，2-实物邮寄，3-自定义链接）
                item.taskPeople = item.membersMin + '-' + item.membersMax
            }else{
                item.taskPeople = item.membersMin
            }
            //奖励开启状态(0-关闭，1-开启)
            item.awardStatus = item.awardStatus === '0' ? '关闭' : '开启'
            switch(item.awardType){
              case '1' :
                 item.pricrType = '优惠券'
                 break
              case '2':
                item.pricrType = '实物邮寄'
                break 
              case '3' :
                item.pricrType = '自定义链接' 
                break 
            }
            return item
          })
    },
    searchbtn(){//搜索
       this.getlistData(this.awardName,this.awardType)
    }
  }
};
</script>
<style scoped lang='less'>
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
}
.index-main/deep/ .el-textarea__inner {
  max-height: 0.5rem !important;
}
.index-main /deep/ .el-table .cell {
  text-align: center !important;
}
/deep/ .el-pagination{
  float:right;
  margin-top: .2rem;
}
</style>