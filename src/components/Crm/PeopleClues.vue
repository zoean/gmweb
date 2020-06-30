<template>
    <el-main class="index-main">
        <el-row style="margin-bottom: 20px;" class="people-screen">

            <el-col :span="4">
                <el-autocomplete
                  clearable
                  size="small"
                  class="screen-li"
                  ref="autocomplete"
                  v-model="form.examItemText"
                  :fetch-suggestions="querySearch"
                  placeholder="请输入考试项目"
                  :trigger-on-focus="true"
                  @select="handleSelect"
                  @clear="autocompleteClear"
                ></el-autocomplete>
            </el-col>
    
            <el-col :span="4">
                
                <el-autocomplete
                  clearable
                  size="small"
                  ref="autocompleteSpread"
                  class="inline-input"
                  style="width: 90%;"
                  v-model="form.spreadText"
                  :fetch-suggestions="querySearchSpread"
                  placeholder="请输入来源渠道"
                  :trigger-on-focus="true"
                  @select="handleSelectSpread"
                  @clear="autocompleteClearSpread"
                ></el-autocomplete>

            </el-col>
    
            <el-col :span="4">
                <el-autocomplete
                  clearable
                  size="small"
                  ref="autocompleteAcc"
                  class="inline-input"
                  style="width: 90%;"
                  v-model="form.accText"
                  :fetch-suggestions="querySearchAcc"
                  placeholder="请输入推广账号"
                  :trigger-on-focus="true"
                  @select="handleSelectAcc"
                  @clear="autocompleteClearAcc"
                ></el-autocomplete>
            </el-col>
    
            <el-col :span="4">
                <el-select v-model="form.isAllocation" size="small" placeholder="请选择是否分配" style="width: 90%;" clearable>
                    <el-option
                      v-for="item in isAllocationArr"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                </el-select>
            </el-col>
    
            <el-col :span="4">
                <el-select v-model="form.dialState" size="small" placeholder="请选择是否拨打" style="width: 90%;" clearable>
                    <el-option
                      v-for="item in dialStateArr"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                </el-select>
            </el-col>
    
        </el-row>
    
        <el-row>
        
            <el-col :span="8">
                <el-date-picker
                    clearable
                    style="width: 95%;"
                    size="small"
                    v-model="dataPicker"
                    type="datetimerange"
                    range-separator="至"
                    @change="datePickerChange"
                    start-placeholder="入库开始时间"
                    end-placeholder="入库结束时间">
                </el-date-picker>
            </el-col>
    
            <el-col :span="4">
                <el-input v-model="form.belongingSeat" size="small" placeholder="请输入坐席" style="width: 90%;" clearable></el-input>
            </el-col>

            <el-col :span="4">
                <el-select v-model="form.inputMode" size="small" placeholder="请选择属性" style="width: 90%;" clearable>
                    <el-option
                      v-for="item in inputModeArr"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                </el-select>
            </el-col>
    
            <el-col :span="8">
                <el-button type="primary" size="small" @click="getExteClueDataClick">查询</el-button>
            </el-col>
    
        </el-row>
    
        <el-table
            :data="tableData"
            v-loading="fullscreenLoading"
            style="width: 100%; margin-top: 22px;">
    
            <af-table-column
                :prop="item.prop"
                :label="item.label"
                v-for="(item, index) in columnList"
                :width="item.prop == 'examItemName' ? '150px' : ''"
                :key="index">

                <template slot-scope="scope">
                  <span>{{scope.row[item.prop] || '- -'}}</span>
                </template>

            </af-table-column>
    
        </el-table>
    
        <el-pagination
            background
            style="margin-top: 30px; text-align:right; margin-right: 1.2%; margin-bottom: 50px;"
            layout="total, sizes, prev, pager, next, jumper"
            :total='form.total'
            :page-size='form.pageSize'
            :current-page='form.currentPage'
            :page-sizes="[10, 20, 30, 50]"
            :hide-on-single-page="totalFlag"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
        >
        </el-pagination>

    </el-main>
</template>

<script>
import { 
  getExteClueData,
  getExamBasic,
  enumByEnumNums,
} from '../../request/api';
import { MJ_6, MJ_7, MJ_9 } from '../../assets/js/data';
import { timestampToTime, input_mode_Text, isAllocationText, dialStateText } from '../../assets/js/common'
import CustomerNotes from '../Share/CustomerNotes';
export default {
    name: 'peopleClues',
    components: {
        CustomerNotes
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
                sortSet: [
                    {}
                ],
                spreadId: "",
                spreadText: "",
                inputMode: "",
                startCreateTime: "",
                total: null
            },
            isAllocationArr: [
                { label: '未分配', value: 0 },
                { label: '已分配', value: 1 },
            ],
            dialStateArr: [
                { label: '处理', value: 1 },
                { label: '未处理', value: 0 },
            ],
            inputModeArr: [
                { label: '线上', value: 0 },
                { label: '录入', value: 1 },
            ],
            dataPicker: [],
            tableData: [],
            columnList: [
              { 'prop': 'tel', 'label': '手机号码' },
              { 'prop': 'name', 'label': '客户姓名' },
              { 'prop': 'examItemName', 'label': '考试项目' },
              { 'prop': 'spread', 'label': '来源渠道' },
              { 'prop': 'acc', 'label': '推广账号' },
              { 'prop': 'isAllocation', 'label': '是否分配' },
              { 'prop': 'dialState', 'label': '是否拨打' },
              { 'prop': 'createTime', 'label': '入库时间' },
              { 'prop': 'allocationTime', 'label': '分配时间' },
              { 'prop': 'belongingSeat', 'label': '所属坐席' },
              { 'prop': 'intentionLevel', 'label': '意向等级' },
              { 'prop': 'inputMode', 'label': '属性' },
            ],
            totalFlag: false, //当只有一页时隐藏分页
            restaurants: [],
            fullscreenLoading: false,
        }
    },
    created() {
        this.getExteClueData();
        this.getExamBasic();
        let arr = [MJ_6, MJ_7, MJ_9];
        this.enumByEnumNums(arr);
    },
    methods: {
        getExamBasic() {
            let arr;
            this.$smoke_get(getExamBasic, {}).then(res => {
                console.log(res);
                arr = JSON.parse(JSON.stringify(res.data).replace(/name/g,"value"));
                this.restaurants = arr;
            })
        },
        querySearch(queryString, cb) {
            var restaurants = this.restaurants;
            console.log(restaurants);
            var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        querySearchSpread(queryString, cb){
            var restaurants = JSON.parse(JSON.stringify(this.enumList['MJ-6']).replace(/name/g,"value"));
            var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        querySearchAcc(queryString, cb){
            var restaurants = JSON.parse(JSON.stringify(this.enumList['MJ-7']).replace(/name/g,"value"));
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
            console.log(item);
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
                    .find(c => c.$el.className.includes('el-input'))
                    .blur();
                this.form.accId = '';
                this.$refs.autocompleteAcc.focus();
            })
        },
        autocompleteClearSpread() {
            this.$nextTick(() => {
                this.$refs.autocompleteSpread.$children
                    .find(c => c.$el.className.includes('el-input'))
                    .blur();
                this.form.spreadId = '';
                this.$refs.autocompleteSpread.focus();
            })
        },
        autocompleteClear() {
            this.$nextTick(() => {
                this.$refs.autocomplete.$children
                    .find(c => c.$el.className.includes('el-input'))
                    .blur();
                this.form.examItemId = '';
                this.$refs.autocomplete.focus();
            })
        },
        enumByEnumNums(arr) {
            this.$smoke_post(enumByEnumNums, {
                numberList: arr
            }).then(res => {
                if(res.code == 200){
                    this.enumList = res.data;
                    // for(let i in res.data) {
                    //     this.enumList[i] = this.enumList[i].filter(item => item.enable != 0);
                    // }
                    // console.log(this.enumList);
                }
            })
        },
        getExteClueDataClick() {
          this.form.currentPage = 1;
          this.getExteClueData();
        },
        getExteClueData() {
            this.fullscreenLoading = true;
            this.$smoke_post(getExteClueData, this.form).then(res => {
                if(res.code == 200){
                    // console.log(res);
                    setTimeout(() => {
                        this.fullscreenLoading = false;

                        res.data.list.map((sll,index) => {
                          sll.createTime = timestampToTime(Number(sll.createTime));
                          sll.allocationTime = timestampToTime(Number(sll.allocationTime));
                          sll.inputMode = input_mode_Text(sll.inputMode);
                          sll.isAllocation = isAllocationText(sll.isAllocation);
                          sll.dialState = dialStateText(sll.dialState);
                        })

                        this.tableData = res.data.list;
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
        datePickerChange(value) { 
            console.log(value);
            if (value == null) {
                this.form.startCreateTime = '';
                this.form.endCreateTime = '';
            }else{
                this.form.startCreateTime = value[0].getTime();
                this.form.endCreateTime = value[1].getTime();
            }
        },
        handleCurrentChange(index) {
            this.form.currentPage = index;
            this.getExteClueData();
        },
        handleSizeChange(index) {
            console.log(index);
            this.form.pageSize = index;
            this.form.currentPage = 1;
            this.getExteClueData();
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
            margin-bottom: 16px;
            .screen-li{
                width: 90%;
            }
        }
    }
    .el-pagination{
        text-align: right;
        margin-top: .4rem;
    }
    .index-main /deep/ .bofang-column{
        padding: 0 !important;
    }
</style>