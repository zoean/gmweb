<template>
    <el-main class="index-main">
        
        <el-button type="primary" @click="addSMS" size="small">添加短信内容</el-button>

        <el-table
            :data="tableData"
            ref="tableSelect"
            v-loading="fullscreenLoading"
            style="width: 100%; margin-top: 10px;"            
            :height="tableHeight">
            <el-table-column
              :prop="item.prop"
              :label="item.label"
              v-for="(item, index) in columnList"
              :min-width="item.prop == 'msg' ? '300px' :  item.prop == 'createTime' ? '110px' : ''"
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
            :total='form.total'
            :page-size='form.pageSize'
            :current-page='form.currentPage'
            :page-sizes="[10, 20, 30, 50, 100]"
            :hide-on-single-page="totalFlag"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
        >
        </el-pagination>

        <el-drawer
          title="添加短信内容"
          :visible.sync="drawer"
          :direction="direction"
          :before-close="handleClose"
        >

          <el-select v-model="createForm.smsTemId" @change="smsTemChange" placeholder="请选择短信模板" style="width: 80%; margin-left: 20px;" size="small" clearable>
            <el-option
              v-for="item in smsTemList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>

          <el-input 
            placeholder="请输入短信名字" 
            v-model="createForm.name" 
            size="small" 
            v-if="createForm.smsTemId"
            style="width: 80%; margin-left: 20px; margin-top: 20px;" 
          ></el-input>

          <div v-for="(item, index) in createForm.list" :key="index">

            <el-autocomplete
              clearable
              size="small"
              style="width: 80%; margin-left: 20px; margin-top: 20px;"
              ref="autocomplete"
              v-if="item.type == 1"
              v-model="item.variableValue"
              :fetch-suggestions="querySearch"
              placeholder="请输入考试项目"
              :trigger-on-focus="true"
              @select="handleSelect"
              @clear="autocompleteClear"
            ></el-autocomplete>

            <el-select 
              v-if="item.type == 2"
              v-model="item.variableId" 
              @change='schoolChange(item)'
              placeholder="请选择分校" 
              style="width: 80%; margin-left: 20px; margin-top: 20px;" 
              size="small" 
              clearable
            >
              <el-option
                v-for="sll in enumList['MJ-8']"
                :key="sll.name"
                v-if="sll.enable"
                :label="sll.name"
                :value="sll.number">
              </el-option>
            </el-select>

            <el-input 
              v-if="item.type == 3" 
              :placeholder="'请输入' + item.name" 
              v-model="item.variableValue" 
              size="small" 
              style="width: 80%; margin-left: 20px; margin-top: 20px;" 
            ></el-input>

          </div>

          <div style="width: 80%; margin-left: 20px; margin-top: 20px;">

            <el-button type="primary" @click="create_sms_details" size="small">生成短信内容</el-button>

          </div>

          <div>

            <el-card v-if="sms_content" style="width: 80%; margin-left: 20px; margin-top: 20px; padding: 20px; line-height: 30px;">
              
              {{sms_content}}

            </el-card>

          </div>

          <div style="width: 80%; margin-left: 20px; margin-top: 20px;">

            <el-button v-if="sms_content_flag" type="primary" @click="createSMSMsg" style="width: 104px;" size="small">保存</el-button>

          </div>

        </el-drawer>

    </el-main>
</template>

<script>
import { 
  getSMSTemList,
  getSMSTem,
  createSMSMsg,
  getExamBasic,
  enumByEnumNums,
  getSMSMsgList
} from '../../request/api';
import { timestampToTime } from '../../assets/js/common';
import { MJ_8 } from '../../assets/js/data';
export default {
    name: 'timeData',
    props: ['tableHeight'],
    data() {
      return {
        fullscreenLoading: false,
        drawer: false,
        direction: 'rtl',
        smsTemList: [],
        sms_content: '', //模板内容
        sms_default_content: '', //默认模板内容
        createForm: {
          name: '',
          smsTemId: '',
          id: '',
          list: []
        },
        restaurants: [],
        enumList: {},
        sms_content_flag: false,
        form: {
          currentPage: 1,
          pageSize: 20,
          sortSet: [
            {'createTime': 'DESC'},
          ],
          total: null
        },
        tableData: [],
        columnList: [
          { 'prop': 'temName', 'label': '短信模板名称' },
          { 'prop': 'msgName', 'label': '短信内容名称' },
          { 'prop': 'createTime', 'label': '创建时间' },
          { 'prop': 'userName', 'label': '创建人' },
          { 'prop': 'msg', 'label': '短信内容' },
        ],
        totalFlag: false,
      }
    },
    created() {
      const studentsPageSize = localStorage.getItem('studentsPageSize');
      if(studentsPageSize) {
        this.form.pageSize = Number(studentsPageSize);
      }else{
        this.form.pageSize = 20;
      }
      this.getSMSTemList();
      this.getExamBasic();
      let arr = [MJ_8];
      this.enumByEnumNums(arr);
      this.getSMSMsgList();
    },
    methods: {
      getSMSMsgList() {
        this.fullscreenLoading = true;
        this.$smoke_post(getSMSMsgList, this.form).then(res => {
          if(res.code == 200) {
            setTimeout(() => {
              this.fullscreenLoading = false;

              res.data.list.map(sll => {
                sll.createTime = timestampToTime(Number(sll.createTime));
              })

              this.tableData = res.data.list;
              this.form.total = res.data.total;              
              this.$emit('setTableHeight', this.form.total, 1)
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
      getSMSTemList() {
        this.$smoke_get(getSMSTemList, {}).then(res => {
          if(res.code == 200) {
            this.smsTemList = res.data;
          }
        })
      },
      enumByEnumNums(arr) {
        this.$smoke_post(enumByEnumNums, {
            numberList: arr
        }).then(res => {
            if(res.code == 200){
                this.enumList = res.data;
            }
        })
      },
      handleClose(done) {
        done();
      },
      addSMS() {
        this.drawer = true;
        this.createForm.name = '';
        this.createForm.smsTemId = '';
        this.createForm.id = '';
        this.createForm.list = [];
        this.sms_content_flag = false;
        this.sms_default_content = this.sms_content = '';
      },
      smsTemChange(id) {
        this.$smoke_post(getSMSTem, {
          id: id
        }).then(res => {
          if(res.code == 200) {
            res.data.variableList.map(sll => {
              sll.variableId = '';
              sll.variableValue = '';
            })
            this.createForm.list = res.data.variableList;
            this.sms_default_content = this.sms_content = res.data.content;
          }
        })
      },
      getExamBasic() {
        let arr;
        this.$smoke_get(getExamBasic, {}).then(res => {
            arr = JSON.parse(JSON.stringify(res.data).replace(/name/g,"value"));
            this.restaurants = arr;
        })
      },
      querySearch(queryString, cb) {
        var restaurants = this.restaurants;
        var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) > -1);
        };
      },
      handleSelect(item) {
        this.createForm.list.map(sll => {
          if(sll.type == 1) {
            sll.variableId = item.id;
            sll.variableValue = item.value;
          }
        })
      },
      autocompleteClear() {
        this.$nextTick(() => {
          this.$refs.autocomplete.$children
              .find(c => c.$el.className.includes('el-input'))
              .blur();
          this.createForm.list.map(sll => {
            if(sll.type == 1) {
              sll.variableId = '';
            }
          })
          this.$refs.autocomplete.focus();
        })
      },
      schoolChange(item) {
        this.createForm.list.map(sll => {
          if(sll.type == 2) {
            sll.variableValue = item.variableId == 1 ? '京华' : item.variableId == 2 ? '胜学' : item.variableId == 3 ? '集团' : '';
          }
        })
      },
      create_sms_details() {
        let flag = true;
        let arr = [];
        let arrValue = [];
        if(this.createForm.smsTemId) {
          this.createForm.list.map(sll => {
            if(sll.variableValue == ''){
              flag = false;
            }
            arr.push('{{' + sll.variable + '}}');
            arrValue.push(sll.variableValue);
          })
          if(flag && this.createForm.name) {
            this.sms_content = this.sms_default_content;

            arr.map((sll,index) => {
              this.sms_content = this.sms_content.replace(sll, arrValue[index]);
            })

            this.sms_content_flag = true;
          }else{
            this.$message({
              type: 'error',
              message: '请将内容填写完整'
            })
            this.sms_content_flag = false;
            this.sms_content = this.sms_default_content;
          }
        }else{
          this.$message({
            type: 'error',
            message: '请先选择短信模板'
          })
        }
      },
      createSMSMsg() {
        let flag = true;
        if(this.createForm.smsTemId) {
          this.createForm.list.map(sll => {
            if(sll.variableValue == ''){
              flag = false;
            }
          })
          if(flag && this.createForm.name) {
            this.$smoke_post(createSMSMsg, this.createForm).then(res => {
              if(res.code == 200) {
                this.$message({
                  type: 'success',
                  message: '短信模板保存成功'
                })
                this.drawer = false;
                this.getSMSMsgList();
              }else{
                this.$message({
                  type: 'error',
                  message: res.msg
                })
              }
            })
          }else{
            this.$message({
              type: 'error',
              message: '请将内容填写完整'
            })
          }
        }else{
          this.$message({
            type: 'error',
            message: '请先选择短信模板'
          })
        }
      },
      handleCurrentChange(index) {
        this.form.currentPage = index;
        this.form.pageSize = Number(localStorage.getItem('studentsPageSize')) ? Number(localStorage.getItem('studentsPageSize')) : 20;
        this.getSMSMsgList();
      },
      handleSizeChange(index) {
        this.form.pageSize = index;
        this.form.currentPage = 1;
        localStorage.setItem('studentsPageSize', index);
        this.getSMSMsgList();
      }, 
    },
    mounted() {
        
    }
}
</script>

<style lang="less" scoped>
    .index-main{
      margin-top: 15px;
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
        .screen-li{
            width: 90%;
        }
    }
    // .index-main /deep/ .el-table .cell{
    //     text-align: center !important;
    // }
</style>