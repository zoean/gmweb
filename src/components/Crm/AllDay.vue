<template>
    <div class="main-area">

        <Start></Start>

        <el-container class="index-main">

            <el-main>

                <div class="people-title">全部客户</div>

                <el-row class="people-screen">

                    <el-col :span="4">
                        <el-input v-model="form.tel" placeholder="请输入查询的手机号" class="screen-li"></el-input>
                    </el-col>

                    <el-col :span="4">
                        <el-input v-model="form.name" placeholder="请输入查询的客户姓名" class="screen-li"></el-input>
                    </el-col>

                    <el-col :span="4">
                        
                        <el-select v-model="form.dialState" placeholder="请选择是否首咨" class="screen-li">
                            <el-option
                              v-for="item in dialStateList"
                              :key="item.name"
                              :label="item.name"
                              :value="item.number">
                            </el-option>
                        </el-select>

                    </el-col>

                    <el-col :span="4">

                        <el-select v-model="form.education" placeholder="请选择最高学历" class="screen-li">
                            <el-option
                              v-for="item in enumList['MJ-1']"
                              :key="item.name"
                              :label="item.name"
                              :value="item.number">
                            </el-option>
                        </el-select>

                    </el-col>

                    <el-col :span="4">

                        <el-select v-model="form.workingLife" placeholder="请选择工作年限" class="screen-li">
                            <el-option
                              v-for="item in enumList['MJ-2']"
                              :key="item.name"
                              :label="item.name"
                              :value="item.number">
                            </el-option>
                        </el-select>

                    </el-col>

                </el-row>

                <el-row class="people-screen">

                    <el-col :span="4">

                        <el-select @change="selectTimeChange" v-model="form.selectTime" placeholder="请选择未联间隔" class="screen-li" clearable>
                            <el-option
                              v-for="item in selectTimeList"
                              :key="item.name"
                              :label="item.name"
                              :value="item.number">
                            </el-option>
                        </el-select>

                    </el-col>

                    <el-col :span="4">

                        <el-select v-model="form.ruleNumberName" placeholder="请选择分配组" class="screen-li">
                            <el-option
                              v-for="item in ruleNumberNameList"
                              :key="item.name"
                              :label="item.name"
                              :value="item.ruleNumberName">
                            </el-option>
                        </el-select>

                    </el-col>

                    <el-col :span="4">
                        <el-button type="primary" @click="getClueDataAll">搜 索</el-button>
                    </el-col>

                </el-row>

                <el-table
                    :data="list"
                    v-loading="fullscreenLoading"
                    :row-class-name="tableRowClassName"
                    style="width: calc( 100vw - 3.8rem)"
                    :row-key="getRowKey">
                    
                    <el-table-column
                      align="right" width="60px">
                      <template slot="header" slot-scope="scope">
                        <i class="el-icon-edit edit-field-icon" @click="editFieldHandle"></i>
                      </template>
                    </el-table-column>
                    <el-table-column
                      :prop="item.props"
                      :width="item.label == '最后联系时间' ? '110px ': item.label == '电话数据' ? '100px': item.label == '拨通 / 拨打' ? '100px' : ''"
                      :label="item.label"
                      v-for="(item, index) in columnList"
                      :sortable="item.ifSort ? true : false"
                      :key="index"
                      >
                    </el-table-column>

                    <el-table-column prop="active" label="操作" width="400px;">
                      <template slot-scope="scope">
                          <el-button @click="phoneOut(scope.row)" type="text" >手机外拨</el-button>
                          <el-button @click="seatOut(scope.row)" type="text" >座机外拨</el-button>
                          <el-popconfirm
                            confirmButtonText='确定'
                            cancelButtonText='取消'
                            icon="el-icon-info"
                            iconColor="red"
                            title="确认释放该数据吗？"
                            @onConfirm="release(scope.row)"
                          >
                            <el-button type="text" slot="reference">释放数据</el-button>
                          </el-popconfirm>
                          <el-button @click="customerInfo(scope.row)" type="text" >客户信息</el-button>
                          <el-button @click="handleAddClick(scope.row)" type="text" >添加备注</el-button>
                      </template>
                    </el-table-column>
                </el-table>

                <el-pagination
                    background
                    layout="total, sizes, prev, pager, next, jumper"
                    style="text-align: right; margin-top: 20px;"
                    :total='form.total'
                    :page-size='form.pageSize'
                    :page-sizes="[10, 20, 30]"
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
                    :examItem='examItem'
                    :clueDataSUuid='clueDataSUuid'
                    :comMode='comMode'
                    :callLogUuid='callLogUuid'
                    @fatherDataList='getClueDataAll'
                >
                </CustomerNotes>

            </el-main>

        </el-container>
      <el-dialog :visible.sync="editFieldVisible" title="编辑字段" :close-on-click-modal="false">
        <p>拖拽表格数据行即可对字段进行排序</p>
        <el-table ref="curFieldTable" :data="curFieldList" class="field-table" @selection-change="handleSelectionChange"  :row-key="getRowKey">
          <el-table-column
            type="selection"
            width="55" :reserve-selection="true">
          </el-table-column>
          <el-table-column v-for="(item,index) in curFieldColumn" :key="index" :prop="item.prop" :label="item.label" :selectable="item.ifDef"></el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
            <el-button @click="editFieldVisible = false">取 消</el-button>
            <el-button type="primary" @click="editFieldSubmit">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>
import Sortable from 'sortablejs'
import { 
    getClueDataAll,
    phoneOut,
    seatOut,
    clueDataRelease,  
    enumByEnumNums,
    getRuleItem,
    getClueDataNumber,
    getListField,
    updateListField
} from '../../request/api';
import Start from '../../components/Share/Start';
import { timestampToTime, backType, smoke_MJ_4, smoke_MJ_5, pathWayText, classTypeText, menuNumberFunc } from '../../assets/js/common';
import { MJ_1, MJ_2, MJ_3, MJ_4, MJ_5 } from '../../assets/js/data';
import CustomerNotes from '../Share/CustomerNotes';
export default {
    name: 'sevenDay',
    data() {
        return {
            editFieldVisible: false,
            curFieldList: [],
            curFieldColumn: [
              {
                label: '字段编号',prop: 'num'
              },
              {
                label:'字段名称', prop: 'label',
              }
              // {
              //   label: '字段排序', prop: 'sortNum'
              // }
            ],
            fieldNum: [],
            form: {
                currentPage: 1,
                pageSize: 10,
                total: null,
                userUuid: '',
                tel: '',
                endTime: '', //筛选条件结束条件
                startTime: '', //筛选条件开始条件
                name: '', 
                dialState: '', //是否首咨（0：首咨 1：非首咨）
                education: '', //最高学历
                workingLife: '', //工作年限
                selectTime: '', //未联间隔
                ruleNumberName: '', //分配组组名
                num: ''
            },
            totalFlag: false,
            ruleNumberNameList: [], //分配组数组
            selectTimeList: [
                { 'name': '今日已联', 'number': 0 },
                { 'name': '1-3日未联', 'number': 1 },
                { 'name': '4-6日未联', 'number': 2 },
                { 'name': '7-10日未联', 'number': 3 },
            ],
            dialStateList: [
                { 'name': '首咨', 'number': 0 },
                { 'name': '非首咨', 'number': 1 },
            ],
            list: [],
            columnList: [
                { 'prop': 'phone', 'label': '电话数据' },
                { 'prop': 'name', 'label': '姓名' },
                { 'prop': 'education', 'label': '学历' },
                { 'prop': 'workingLife', 'label': '工作年限' },
                { 'prop': 'lastCallTime', 'label': '最后联系时间' },
                // { 'prop': 'dataType', 'label': '下次联系时间' },
                { 'prop': 'callDialUp', 'label': '拨通 / 拨打' },
                { 'prop': 'school', 'label': '注册平台' },
            ],
            initOptions: {},
            jqStart: null,

            followFlag: false,
            drawer: false,
            clueDataSUuid: '',
            callLogUuid: '',
            comMode: '',
            schoolId: '',
            examItem: '',

            enumList: {},
            fullscreenLoading: false,
            clueDataNumberList: []
        }
    },
    components: {
        Start, CustomerNotes
    },
    created() {
        const uuid = localStorage.getItem('userUuid');
        this.form.userUuid = uuid;
        this.getClueDataNumber();
        const initOptions = localStorage.getItem('initOptions');
        this.initOptions = JSON.parse(initOptions);
        this.jqStart = browserfly.noConflict();
        let arr = [MJ_1, MJ_2, MJ_3, MJ_4, MJ_5];
        this.enumByEnumNums(arr);
        this.getRuleItem();
    },
    methods: {
      filterPageNum(obj){
        if(obj && obj.length > 0){
          obj.map(subObj => {
            if(subObj.url == this.$route.path){
              this.$store.commit('setPageNum', subObj.pageNum)
              this.form.num = subObj.pageNum
            }else if(subObj && subObj.includeSubsetList){
              this.filterPageNum(subObj.includeSubsetList)
            }
          })
        }
      },
      rowDrop(){
          const el = document.querySelectorAll('.field-table>.el-table__body-wrapper > table > tbody')[0]
          Sortable.create(el, {
              disabled: false,
              onEnd: (evt) => {
                  const tempItem = this.curFieldList.splice(evt.oldIndex, 1)[0]
                  this.curFieldList.splice(evt.newIndex, 0, tempItem)
                  var newArray = this.curFieldList.slice(0)
                  this.curFieldList = [];
                  this.$nextTick(() => {
                      this.curFieldList = newArray;
                  });
              }
          })
      },
      getRowKey(row){
        return row.num
      },
      handleSelectionChange(row) {//监听selection选择事件
        this.fieldNum = []
        for(let i in row){//去重以免发生意外的push
          if(!this.fieldNum.includes(row[i].num)){
            this.fieldNum.push(row[i].num)
          }  		
        }
      },
      editFieldHandle(){
        this.editFieldVisible = true
        this.getListField()
      },
      getListField(){
        this.$smoke_post(getListField, {num: this.$store.state.pageNum}).then( res => {
          if(res.code == 200){
            this.curFieldList = res.data
            if(this.curFieldList){
              this.curFieldList.forEach(item => {
                if(item.flag){
                  this.$refs['curFieldTable'].toggleRowSelection(this.curFieldList[item.sortNum - 1], true)
                  if(!this.fieldNum.includes(item.num)){
                    this.fieldNum.push(item.num)                    
                  } 
                }
              }) 
            }
            this.rowDrop()
          }
        })
      },
      editFieldSubmit(){
        let updateFieldArray = []
        this.curFieldList.forEach( item => {
            if(this.fieldNum.includes(item.num)){
                updateFieldArray.push(item.num)
            }
        })
        this.$smoke_post(updateListField, {num: this.$store.state.pageNum, fieldList: updateFieldArray}).then(res => {
            if(res.code == 200){
                this.$message({
                    type: 'success',
                    message: '字段配置成功'
                })
                this.editFieldVisible = false
                this.getClueDataAll()
            }
        })
      },
        handleCurrentChange(index) {
            this.form.currentPage = index;
            this.getClueDataAll();
        },
        handleSizeChange(index) {
            this.form.pageSize = index;
            this.getClueDataAll();
        }, 
        selectTimeChange(value) {
            const time = new Date(new Date().toLocaleDateString()).getTime();
            const oneTime = time - ( 3600 * 1000 * 24 * 1 );
            const threeTime = time - ( 3600 * 1000 * 24 * 3 );
            const fourTime = time - ( 3600 * 1000 * 24 * 4 );
            const sixTime = time - ( 3600 * 1000 * 24 * 6 );
            const sevenTime = time - ( 3600 * 1000 * 24 * 7 );
            const tenTime = time - ( 3600 * 1000 * 24 * 10 );
            if(value == 0) {
                this.form.startTime = time;
                this.form.endTime = '';
            }
            if(value == 1) {
                this.form.startTime = threeTime;
                this.form.endTime = oneTime;
            }
            if(value == 2) {
                this.form.startTime = sixTime;
                this.form.endTime = fourTime;
            }
            if(value == 3) {
                this.form.startTime = tenTime;
                this.form.endTime = sevenTime;
            }
            if(value.length == 0) {
                this.form.startTime = '';
                this.form.endTime = '';
            }
        },
        getRuleItem() {
            this.$smoke_get(getRuleItem, {}).then(res => {
                if(res.code == 200){
                    this.ruleNumberNameList = res.data;
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
        //客户信息
        customerInfo(row) {
            this.drawer = true;
            this.clueDataSUuid = row.clueDataSUuid;
            this.followFlag = false;
        },
        handleAddClick(row) {
            this.drawer = true;
            this.clueDataSUuid = row.clueDataSUuid;
            this.followFlag = true;
            this.comMode = '微信沟通';
            this.examItem = row.examItem;
        },
        changeDrawer(val){
            // console.log(val);
            this.drawer = val;
        },
        getClueDataNumber() {
            let arr = [];
            this.$smoke_get(getClueDataNumber, {}).then(res => {
                if(res.code == 200) {
                    for(let i in res.data) {
                        arr.push(res.data[i]);
                    }
                    this.clueDataNumberList = arr;
                    this.getClueDataAll();
                }else{
                    this.getClueDataAll();
                }
            })
        },
        getClueDataAll() {
            this.fullscreenLoading = true;
            this.drawer = false;
            let userMenuList = JSON.parse(localStorage.getItem('userMenuList'))
            this.filterPageNum(userMenuList)
            this.$smoke_post(getClueDataAll, this.form).then(res => {
                if(res.code == 200) {
                    setTimeout(() => {
                        this.fullscreenLoading = false;
                        res.data.list.map(sll => {
                            sll.lastCallTime = timestampToTime(Number(sll.lastCallTime));
                            sll.callDialUp = sll.dialUpNum + '/' + sll.callNum;
                        })
                        this.columnList = res.data.filedList
                        this.schoolId = res.data.schoolId;
                        this.list = res.data.list;
                        this.form.total = this.clueDataNumberList[0] = res.data.total;
                        localStorage.setItem("userMenuList", JSON.stringify(menuNumberFunc(this.$store.state.userMenuList, this.clueDataNumberList)));
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
        release(scope) {
            let arr = [];
            arr.push(scope.userCDARUuid);
            this.$smoke_post(clueDataRelease, {
                list: arr
            }).then(res => {
                if(res.code == 200) {
                    this.$message({
                        type: 'success',
                        message: '释放数据成功'
                    })
                    this.getClueDataAll();
                }
            })
        },
        phoneOut( scope ) {
            if(this.initOptions != undefined){
                this.$smoke_post(phoneOut, {
                    adminUin: this.initOptions.adminUin,
                    uin: this.initOptions.uin,
                    uuid: scope.userCDARUuid,
                }).then(res => {
                    if(res.code == 200){
                        if(res.data.result){
                            this.callLogUuid = res.data.callLogUuid;
                            this.clueDataSUuid = scope.clueDataSUuid;
                            this.drawer = true;
                            this.followFlag = true;
                            this.comMode = '手机外呼';
                            this.examItem = scope.examItem;
                        }else{
                            this.$message({
                                type: 'error',
                                message: '目前服务线路忙，请稍后重试'
                            })
                        }
                    }else{
                        this.$message({
                            type: 'error',
                            message: res.msg
                        })
                    }
	                this.jqStart.monitorEvent("callTip", function(message, jsonObject) {
                        console.log(message);
                        console.log(jsonObject);
                    });
                })
            }else{
                this.$message({
                    type: 'error',
                    message: '请联系主管配置jq账号'
                })
            }
        },
        seatOut( scope ) {
            if(this.initOptions != undefined){
                this.$smoke_post(seatOut, {
                    adminUin: this.initOptions.adminUin,
                    uin: this.initOptions.uin,
                    uuid: scope.userCDARUuid,
                }).then(res => {
                    if(res.code == 200){
                        if(res.data.result){
                            this.callLogUuid = res.data.callLogUuid;
                            this.clueDataSUuid = scope.clueDataSUuid;
                            this.drawer = true;
                            this.followFlag = true;
                            this.comMode = '座机外呼';
                            this.examItem = scope.examItem;
                        }else{
                            this.$message({
                                type: 'error',
                                message: '目前服务线路忙，请稍后重试'
                            })
                        }
                    }else{
                        this.$message({
                            type: 'error',
                            message: res.msg
                        })
                    }
	                this.jqStart.monitorEvent("seatState", function(message, jsonObject) {
                        console.log('监听成功-seatState');
                        console.log(message);
                        console.log(jsonObject);
                    }); 
                    this.jqStart.monitorEvent("callEvent", function(message, jsonObject) {
                        console.log('监听成功-callEvent');
                        console.log(message);
                        console.log(jsonObject);
                    });
                    this.jqStart.monitorEvent("callTip",function(message, jsonObject){
                        console.log('监听成功-callTip');
                        console.log(message);
                        console.log(jsonObject);
                    })
                })
            }else{
                this.$message({
                    type: 'error',
                    message: '请联系主管配置jq账号'
                })
            }
        },
        tableRowClassName({row, rowIndex}) {
            if (row.dialState == 0) {
                return 'dialState';
            }
            return '';
        },
        phoneCopy(row) {
            
        }
    },
    mounted() {
      let userMenuList = JSON.parse(localStorage.getItem('userMenuList'))
      this.filterPageNum(userMenuList)
    }
}
</script>

<style lang="less" scoped>
    .main-area{
        .index-main{
            height: calc( 100vh - 60px);
            .people-title{
                width: 100%;
                height: 40px;
                line-height: 40px;
                text-align: center;
                font-size: 15px;
                background: #aaa;
                margin-bottom: .3rem;
                color: #fff;
            }
            .people-screen{
                margin-bottom: .3rem;
                .screen-li{
                    width: 90%;
                }
            }
            .el-button{
              margin-left: 10px;
            }
            .edit-field-icon{
              color: #5cb6ff;
              font-size: 20px;
              cursor: pointer;
            }
        }
    }
</style>