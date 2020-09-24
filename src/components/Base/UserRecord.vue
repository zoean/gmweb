<template>
    <el-main class="index-main">

        <el-row :class="['people-screen', {actionHide: toggleAction, actionShow: !toggleAction, noSearch: hideSearch}]">
        
            <el-col :span="8">
                <el-date-picker
                    clearable
                    style="width: 90%;"
                    size="small"
                    v-model="dataPicker"
                    type="datetimerange"
                    range-separator="至"
                    :default-time="['00:00:00', '23:59:59']"
                    @change="datePickerChange"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间">
                </el-date-picker>
            </el-col>

            <el-col :span="4">
                <el-select v-model="form.moduleName" size="small" placeholder="请选择操作对象" style="width: 90%;" clearable>
                    <el-option
                      v-for="item in moduleNameArr"
                      :key="item"
                      :label="item"
                      :value="item">
                    </el-option>
                </el-select>
            </el-col>
    
            <el-col :span="4">
                <el-input v-model="form.userName" size="small" placeholder="请输入管理员姓名" style="width: 90%;" clearable></el-input>
            </el-col>
    
            <el-col :span="8">
                <el-button type="primary" size="small" @click="recordClick">查询</el-button>
            </el-col>
    
        </el-row>
    
        <el-table
            :data="tableData"
            v-loading="fullscreenLoading"
            style="width: 100%;"
            :height="tableHeight">
    
            <af-table-column
                :prop="item.prop"
                :label="item.label"
                v-for="(item, index) in columnList"
                :key="index">

                <template slot-scope="scope">
                  <span>{{scope.row[item.prop] || '- -'}}</span>
                </template>

            </af-table-column>
    
        </el-table>

        <el-pagination
            background
            layout="total, sizes, prev, pager, next, jumper"
            :total='form.total'
            :page-size='form.pageSize'
            :current-page='form.pageNum'
            :page-sizes="[10, 20, 30, 50, 100]"
            :hide-on-single-page="totalFlag"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
        >
        </el-pagination>

    </el-main>
</template>

<script>
import { moduleList, systemLogList } from '../../request/api';
import { timestampToTime } from '../../assets/js/common'
export default {
    name: 'userRecord',
    props: ['tableHeight','toggleAction', 'hideSearch'],
    data() {
        return {
            fullscreenLoading: false,
            form: {
              startDate: '',
              endDate: '',
              moduleName: '', //操作对象
              pageNum: 1,
              pageSize: 20,
              userName: '',
              total: null
            },
            totalFlag: false,
            tableData: [],
            columnList: [
              { 'prop': 'operateTime', 'label': '时间' },
              { 'prop': 'userName', 'label': '管理员' },
              { 'prop': 'moduleName', 'label': '操作对象' },
              { 'prop': 'eventType', 'label': '操作类型' },
              { 'prop': 'data', 'label': '详细数据' },
            ],
            dataPicker: [],
            moduleNameArr: [],
        }
    },
    created() {
        this.systemLogList();
        this.moduleList();
    },
    methods: {
        systemLogList() {
            this.fullscreenLoading = true;
            this.$smoke_post(systemLogList, this.form).then(res => {
                if(res.code == 200){
                    setTimeout(() => {
                        this.fullscreenLoading = false;
                        this.tableData = res.data.list;
                        this.form.total = res.data.total;                        
                        this.$emit('setTableHeight', this.form.total)
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
        moduleList() {
          this.$smoke_post(moduleList, {}).then(res => {
            if(res.code == 200)  {
              this.moduleNameArr = res.data;
            }
          })
        },
        datePickerChange(value) { 
            if (value == null) {
                this.form.startDate = '';
                this.form.endDate = '';
            }else{
                this.form.startDate = value[0].getTime();
                this.form.endDate = value[1].getTime();
            }
        },
        recordClick() {
            this.form.pageNum = 1;
            this.systemLogList();
        },
        handleCurrentChange(index) {
            this.form.pageNum = index;
            this.systemLogList();
        },
        handleSizeChange(index) {
            this.form.pageSize = index;
            this.systemLogList();
        },
    },
    mounted() {
        
    }
}
</script>

<style lang="less" scoped>
    .index-main{
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
    .el-pagination{
        text-align: right;
    }
    .index-main /deep/ .bofang-column{
        padding: 0 !important;
    }
</style>