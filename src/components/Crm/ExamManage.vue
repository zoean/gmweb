<template>
    <el-main class="index-main">
        <el-row class="people-screen">

            <el-col :span="3">
                <el-select v-model="form.status" placeholder="前端开启状态" class="screen-li" size="small" clearable>
                    <el-option
                      v-for="item in statusList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                </el-select>
            </el-col>

            <el-col :span="3">
                <el-select v-model="form.switches" placeholder="后端开启状态" class="screen-li" size="small" clearable>
                    <el-option
                      v-for="item in switchesList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                </el-select>
            </el-col>

            <el-col :span="3">
                <el-button type="primary" size="small" @click="examPeriodListPage">查 询</el-button>
            </el-col>

            <el-col :span="15">
                <el-button type="primary" @click="addExamClick" size="small" style="float: right;">新增考期</el-button>
            </el-col>

        </el-row>

        <el-table
            :data="list"
            ref="tree"
            v-loading="fullscreenLoading"
            style="width: 100%"
            :height="tableHeight">
            <el-table-column
              :prop="item.prop"
              :label="item.label"
              :formatter="item.formatter"
              :min-width="item.width"
              v-for="(item, index) in columnList"
              :key="index"
              >
            </el-table-column>
            <el-table-column prop="active" label="操作" width="70">
              <template slot-scope="scope">
                <svg-icon @click="editEnumClick(scope.row)" icon-title="修改考期" icon-class="edit" />
              </template>
            </el-table-column>
        </el-table>

        <el-pagination
            background
            layout="total, sizes, prev, pager, next, jumper"
            :total='total'
            :page-size='form.pageSize'
            :page-sizes="[10, 20, 30, 50, 100]"
            :hide-on-single-page="totalFlag"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
        >
        </el-pagination>

        <el-drawer
            :title="drawerTitle"
            :visible.sync="drawerFlag"
            :direction="direction"
            :before-close="handleClose"
        >
            <span class="bullets"></span>

            <el-input v-model="input" placeholder="请输入考期名称"></el-input>

            <el-input v-model="input" placeholder="请输入考期描述"></el-input>

        </el-drawer>

    </el-main>
</template>

<script>
import { 
    examPeriodList,
    examPeriodListPage,
    examPeriodAdd,
    examPeriodUpdate,
    examPeriodFindById
 } from '../../request/api';
import { getTextByJs } from '../../assets/js/common';
export default {
    name: 'examManage',
    props: ['tableHeight'],
    data() {
        return {
            form: {
                currentPage: 1,
                pageSize: 20,
                status: '', //状态（1-显示，0-不显示）
                switches: '',
            },
            statusList: [
                { value: 0, label: '不显示' },
                { value: 1, label: '显示' },
            ],
            switchesList: [
                { value: 2, label: '不显示' },
                { value: 1, label: '显示' },
            ],
            list: [],
            total: null,
            columnList: [
                { 'prop': 'id', 'label': '考期编号' },
                { 'prop': 'name', 'label': '考期名称' },
                { 'prop': 'description', 'label': '考期描述' },
                { 'prop': 'status', 'label': '前端开启状态', formatter: this.statusFormatter },
                { 'prop': 'switches', 'label': '后端开启状态', formatter: this.statusFormatter },
                { 'prop': 'itemsName', 'label': '关联考试项目', width: 300},
            ],
            totalFlag: false, //当只有一页时隐藏分页
            fullscreenLoading: false,

            drawerTitle: '新增考期',
            drawerFlag: false,
            direction: 'rtl',

            examForm: {
                description: '',
                name: '',
                examItemIds: [],
                status: '',
                switches: '',
            }
        }
    },
    created() {
        this.examPeriodListPage();
    },
    methods: {
        handleClose(done) {
            done();
        },
        statusFormatter(row, column, cellValue){
            return cellValue == 1 ? '显示' : '不显示'
        },
        addExamClick() {
            
        },
        editEnumClick(row) {
            
        },
        examPeriodListPage() {
            this.fullscreenLoading = true;
            this.$smoke_post(examPeriodListPage, this.form).then(res => {
                if(res.code == 200) {

                    setTimeout(() => {
                        this.fullscreenLoading = false;
                        res.data.list.map(sll => {
                            sll.itemsName = getTextByJs(sll.items);
                        })
                        this.list = res.data.list;
                        this.total = res.data.total;     
                        this.$emit('setTableHeight', this.total, 0, 1)                   
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
            this.examPeriodListPage();
        },
        handleSizeChange(index) {
            this.form.pageSize = index;
            this.examPeriodListPage();
        },
    },
    mounted() {
        
    }
}
</script>

<style lang="less" scoped>
    .index-main{
        margin-top: 15px;
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

</style>