<template>
    <el-main class="index-main">
        <el-row class="people-screen">

            <el-col :span="8">
                <el-date-picker
                    style="width: 95%;"
                    v-model="dataPicker"
                    type="datetimerange"
                    range-separator="至"
                    @change="datePickerChange"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
            </el-col>

            <el-col :span="4">

                <el-select v-model="form.ruleId" placeholder="请选择分配组" class="screen-li" clearable>
                    <el-option
                      v-for="item in ruleNumberNameList"
                      :key="item.name"
                      :label="item.name"
                      :value="item.ruleNumberName">
                    </el-option>
                </el-select>

            </el-col>

            <el-col :span="4">

                <el-autocomplete
                    clearable
                    class="screen-li"
                    style="width: 90%;"
                    v-model="form.examItemText"
                    :fetch-suggestions="querySearch"
                    placeholder="请输入考试方向"
                    :trigger-on-focus="true"
                    @select="handleSelect"
                    @clear="autocompleteClear"
                ></el-autocomplete>

            </el-col>

            <el-col :span="4">
                
                <el-select v-model="form.spreadId" placeholder="请选择渠道" class="screen-li" clearable>
                    <el-option
                      v-for="item in enumList['MJ-6']"
                      :key="item.name"
                      :label="item.name"
                      :value="item.number">
                    </el-option>
                </el-select>

            </el-col>

            <el-col :span="4">

                <el-select v-model="form.accId" placeholder="请选择推广账号" clearable="" class="screen-li">
                    <el-option
                      v-for="item in enumList['MJ-7']"
                      :key="item.name"
                      :label="item.name"
                      :value="item.number">
                    </el-option>
                </el-select>

            </el-col>

        </el-row>

        <el-row class="people-screen">

            <el-col :span="4">

                <el-input v-model="form.userName" placeholder="请输入创建人姓名" class="screen-li"></el-input>

            </el-col>

            <el-col :span="4">
                <el-button type="primary" @click="getPopularizeUrl">查 询</el-button>
            </el-col>

        </el-row>

        <el-table
            :data="list"
            ref="tableSelect"
            v-loading="fullscreenLoading"
            style="width: 100%">

            <el-table-column
              :prop="item.prop"
              :label="item.label"
              :show-overflow-tooltip="item.prop == 'url' ? true : false"
              :width="item.prop == 'copy' ? '60px' : ''"
              v-for="(item, index) in columnList"
              :key="index"
              >

                <template slot-scope="scope">
                    <span>{{scope.row[item.prop]}}</span>
                    <el-tooltip effect="dark" v-if="item.prop == 'copy'" content="复制链接" placement="top">
                        <el-image
                            style="position: relative; left: -10px; top: 2px; cursor: pointer; width: 14px; height: 14px;"
                            @click="copyUrlClick(scope.row)"
                            :src="require('../../assets/images/copy-icon.png')">
                        </el-image>
                    </el-tooltip>
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

    </el-main>
</template>

<script>
import { 
    getPopularizeUrl, 
    getExamBasic, 
    enumByEnumNums, 
    getRuleItem,
    clueDataRelease,
    copyTel,
} from '../../request/api';
import { timestampToTime, backType, workingLifeText, evidencePurposeText, genderText, copyData, removeEvery } from '../../assets/js/common';
import { MJ_6, MJ_7 } from '../../assets/js/data';
export default {
    name: 'seatData',
    data() {
        return {
            form: {
                currentPage: 1,
                pageSize: 10,
                startTime: '',
                endTime: '',
                total: null,
                accId: '', //推广账号
                examItemsId: '', //考试方向
                ruleId: '', //分配组Id
                spreadId: '', //渠道
                userName: '', //创建人
                // userUuid: ''
            },
            totalFlag: false,
            ruleNumberNameList: [], //分配组数组
            list: [],
            columnList: [
                { 'prop': 'url', 'label': '链接' },
                { 'prop': 'copy', 'label': '' },
                { 'prop': 'userName', 'label': '创建人' },
                { 'prop': 'acc', 'label': '推广账号' },
                { 'prop': 'rule', 'label': '分配组' },
                { 'prop': 'examItems', 'label': '考试方向' },
                { 'prop': 'spread', 'label': '来源渠道' },
                { 'prop': 'createTime', 'label': '创建时间' },
            ],
            dataPicker: [],
            
            restaurants: [],
            enumList: {},
            fullscreenLoading: false,
        }
    },
    created() {
        // const uuid = localStorage.getItem('userUuid');
        // this.form.userUuid = uuid;
        this.getPopularizeUrl();
        this.getExamBasic();
        let arr = [MJ_6, MJ_7];
        this.enumByEnumNums(arr);
        this.getRuleItem();
    },
    methods: {
        enumByEnumNums(arr) {
            this.$smoke_post(enumByEnumNums, {
                numberList: arr
            }).then(res => {
                if(res.code == 200){
                    for (var i in res.data) {
                        res.data[i].map(sll => {
                            if(sll.enable == 0) {
                                res.data[i] = removeEvery(sll, res.data[i]);
                            }
                        })
                    }
                    this.enumList = res.data;
                }
            })
        },
        getRuleItem() {
            this.$smoke_get(getRuleItem, {
                type: ''
            }).then(res => {
                if(res.code == 200){
                    this.ruleNumberNameList = res.data;
                }
            })
        },
        getPopularizeUrl() {
            this.fullscreenLoading = true;
            this.$smoke_post(getPopularizeUrl, this.form).then(res => {
                if(res.code == 200) {
                    setTimeout(() => {
                        this.fullscreenLoading = false;
                        res.data.list.map(sll => {
                            sll.createTime = timestampToTime(Number(sll.createTime));
                            sll.url = 'https://test.jhwx.com/zt/jk_jh360/?ruleid='
                            + sll.ruleId + '&project=' + sll.examItemsId
                            + '&spread=' + sll.spreadId + '&acc=' + sll.accId;
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
        lookUrlClick(row) {
            console.log(row);
            this.drawer = true;
            this.clueDataSUuid = row.clueDataSUuid;
            this.followFlag = false;
        },
        copyUrlClick(row) {
            copyData(row.url);
        },
        datePickerChange(value) {
            console.log(value);
            if (value == null) {
                this.form.startTime = '';
                this.form.endTime = '';
            }else{
                this.form.startTime = value[0].getTime();
                this.form.endTime = value[1].getTime();
            }
        },
        handleCurrentChange(index) {
            console.log(index);
            this.form.currentPage = index;
            this.getPopularizeUrl();
        },
        handleSizeChange(index) {
            console.log(index);
            this.form.pageSize = index;
            this.getPopularizeUrl();
        },
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
        createFilter(queryString) {
            return (restaurant) => {
              return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) > -1);
            };
        },
        handleSelect(value) {
            console.log(value);
            this.form.examItemsId = value.id;
        },
        autocompleteClear() {
            this.form.examItemsId = '';
        }
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
    /* //element-ui table的去除右侧滚动条的样式 */
    ::-webkit-scrollbar {
        width: 8px;
        height: 1px;
    }
        /* // 滚动条的滑块 */
    ::-webkit-scrollbar-thumb {
        background-color: #a1a3a9;
        border-radius: 8px;
    }
</style>