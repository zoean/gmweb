<template>
    <el-main class="index-main">
        <el-row class="people-screen">
            <el-col :span="3">
                <el-input v-model="form.tel" placeholder="请输入手机号" class="screen-li" size="small"></el-input>
            </el-col>
            <el-col :span="3">
                <el-input v-model="form.sendName" placeholder="请输入发送人" class="screen-li" size="small"></el-input>
            </el-col>
            <el-col :span="2">
                <el-button type="primary" @click="getSMSRecordListClick" size="small">查 询</el-button>
            </el-col>
        </el-row>
        
        <el-table
            :data="list"
            ref="tableSelect"
            v-loading="fullscreenLoading"
        >
            <el-table-column
              :prop="item.prop"
              :label="item.label"
              v-for="(item, index) in columnList"
              :min-width="item.prop == 'msg' ? '500px' :  item.prop == 'sendTime' ? '120px' : ''"
              :key="index"
              >

              <template slot-scope="scope">
                <span>{{scope.row[item.prop] || '- -'}}</span>
              </template>

            </el-table-column>
        </el-table>

        <el-pagination
            background
            layout="total, sizes, prev, pager, next, jumper"
            style="text-align: right; margin-top: 20px;"
            :total='form.total'
            :page-size='form.pageSize'
            :current-page='form.currentPage'
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
  getSMSRecordList
} from '../../request/api';
import { 
  timestampToTime,
  sendStartText
} from '../../assets/js/common';
export default {
    name: 'timeData',
    data() {
      return {
        fullscreenLoading: false,
        form: {
            currentPage: 1,
            pageSize: 20,
            sendName: '',
            sortSet: [
                {'sendTime': 'DESC'},
            ],
            tel: '',
            total: null,
        },
        totalFlag: false,
        list: [],
        columnList: [
          { 'prop': 'tel', 'label': '手机号码' },
          { 'prop': 'sendTime', 'label': '发送时间' },
          { 'prop': 'sendUser', 'label': '发送人' },
          { 'prop': 'sendStart', 'label': '发送状态' },
          { 'prop': 'msg', 'label': '短信内容' },
        ]
      }
    },
    created() {
      const studentsPageSize = localStorage.getItem('studentsPageSize');
      if(studentsPageSize) {
        this.form.pageSize = Number(studentsPageSize);
      }else{
        this.form.pageSize = 20;
      }
      this.getSMSRecordList();
    },
    methods: {
      getSMSRecordListClick() {
          this.form.currentPage = 1;
          this.getSMSRecordList();
      },
      getSMSRecordList() {
        this.fullscreenLoading = true;
        this.$smoke_post(getSMSRecordList, this.form).then(res => {
            if(res.code == 200) {
              setTimeout(() => {
                this.fullscreenLoading = false;

                res.data.list.map(sll => {
                    sll.sendTime = timestampToTime(Number(sll.sendTime));
                    sll.sendStart = sendStartText(sll.sendStart);
                })

                this.list = res.data.list;
                this.form.total = res.data.total;
              }, 300);
            }else{
              setTimeout(() => {
                this.fullscreenLoading = false;
                this.$message({
                    type: 'error',
                    message: res.msg
                })
              }, 300)
            }
        })
      },
      handleCurrentChange(index) {
        this.form.currentPage = index;
        this.form.pageSize = Number(localStorage.getItem('studentsPageSize')) ? Number(localStorage.getItem('studentsPageSize')) : 20;
        this.getSMSRecordList();
      },
      handleSizeChange(index) {
        this.form.pageSize = index;
        this.form.currentPage = 1;
        localStorage.setItem('studentsPageSize', index);
        this.getSMSRecordList();
      }, 
    },
    mounted() {
        
    }
}
</script>

<style lang="less" scoped>
    .index-main{
        height: auto;
        .people-title{
            width: 100%;
            height: 40px;
            line-height: 40px;
            text-align: center;
            font-size: 15px;
            background: #fff;
            margin-bottom: .3rem;
            color: #666666;
        }
        .people-screen{
            margin-bottom: 10px;
            .screen-li{
                width: 94%;
            }
        }
    }
    // .index-main /deep/ .el-table .cell{
    //     text-align: center !important;
    // }
</style>