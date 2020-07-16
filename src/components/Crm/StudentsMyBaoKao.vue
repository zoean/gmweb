<template>
    <el-main class="index-main">

        <el-row class="people-screen">
            <el-col :span="4">
                <el-input v-model="form.tel" placeholder="请输入手机号" class="screen-li" size="small"></el-input>
            </el-col>
            <el-col :span="4">
                <el-input v-model="form.name" placeholder="请输入姓名" class="screen-li" size="small"></el-input>
            </el-col>
            <el-col :span="4">
                <el-autocomplete
                    clearable
                    size="small"
                    class="screen-li"
                    ref="autocomplete"
                    v-model="form.examLableText"
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
                    class="screen-li"
                    ref="autocomplete"
                    v-model="form.itemNameText"
                    :fetch-suggestions="querySearchBaoKao"
                    placeholder="请输入报考项目"
                    :trigger-on-focus="true"
                    @select="handleSelectItemName"
                    @clear="autocompleteClearItemName"
                ></el-autocomplete>
            </el-col>
            <el-col :span="4">
                <el-select v-model="form.province" placeholder="请选择所在省份" class="screen-li" size="small" clearable>
                    <el-option
                      v-for="item in provinceList"
                      :key="item.provinceName"
                      :label="item.provinceName"
                      :value="item.provinceName">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="4">
                <el-select v-model="form.examProvince" placeholder="请选择报考省份" style="width: 100%" size="small" clearable>
                    <el-option
                      v-for="item in provinceList"
                      :key="item.provinceName"
                      :label="item.provinceName"
                      :value="item.provinceName">
                    </el-option>
                </el-select>
            </el-col>
        </el-row>

        <el-row class="people-screen" type="flex" align="middle">

            <el-col :span="4">
                <el-select v-model="form.basicInfoStatus" placeholder="请选择基本信息情况" class="screen-li" size="small" clearable>
                    <el-option
                      v-for="item in basicInfoStatusList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                </el-select>
            </el-col>

            <el-col :span="4">
                <el-select v-model="form.pictureStatus" placeholder="请选择照片情况" class="screen-li" size="small" clearable>
                    <el-option
                      v-for="item in pictureStatusList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                </el-select>
            </el-col>

            <el-col :span="4">
                <el-select v-model="form.checkStatus" placeholder="请选择审核情况" class="screen-li" size="small" clearable>
                    <el-option
                      v-for="item in checkStatusList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                </el-select>
            </el-col>

            <el-col :span="4">
                <el-select v-model="form.paymentStatus" placeholder="请选择交费情况" class="screen-li" size="small" clearable>
                    <el-option
                      v-for="item in paymentStatusList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                </el-select>
            </el-col>

            <el-col :span="4">

                <el-button type="primary" @click="registerListClick" size="small">查 询</el-button>

            </el-col>

            <el-col :span="4">

                <el-button style="float: right;" @click="exportClick" size="small" plain>导 出</el-button>

            </el-col>

        </el-row>

        <el-table
            :data="list"
            ref="tableSelect"
            v-loading="fullscreenLoading"
            style="width: 100%">

            <el-table-column
              type="selection"
              width="45">
            </el-table-column>
            
            <el-table-column
              :prop="item.prop"
              :label="item.label"
              :min-width="item.width"
              v-for="(item, index) in columnList"
              :key="index"
              >

              <template slot-scope="scope">
                <span>{{scope.row[item.prop] || '- -'}}</span>
              </template>

            </el-table-column>

            <el-table-column prop="active" label="操作" fixed="right" width="80">
              <template slot-scope="scope">
                <svg-icon @click="studentDetails(scope.row)" icon-title="学员详情" icon-class="detail" />
                <svg-icon @click="lookBaoKaoMessage(scope.row)" icon-title="查看报考信息" icon-class="members" />
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

        <StudentsNotes 
            v-if="drawer"
            @changeDrawer="changeDrawer"
            :drawer.sync='drawer'
            :studentUuid='studentUuid'
            :userId='userId'
            :clueDataSUuid='clueDataSUuid'
            :callLogUuid='callLogUuid'
        >
        </StudentsNotes>

    </el-main>
</template>

<script>
import { 
    registerList,
    getExamBasic,
    queryProvinceAll,
    queryItemList,
    registerExportExcel,
    registerExportZip
} from '../../request/api';
import StudentsNotes from '@/components/Share/StudentsNotes';
import { 
    timestampToTime, 
    genderText,
    classTypeString,
    getTextByJs,
    sortTextNum,
    citiesFun,
    filepostDown
} from '../../assets/js/common';
import { 

} from '../../assets/js/data';
import pcaa from 'area-data/pcaa';
export default {
    name: 'studentsNewBaoKao',
    components: {
        StudentsNotes
    },
    data() {
        return {
            form: {
                basicInfoStatus: '', //基本信息是否完整（0-否，1-是）
                checkStatus: '', //审核状态（0-待审核，1-审核通过，2-审核失败）
                currentPage: 1,
                examLable: '', //考试项目
                examLableText: '',
                examProvince: '', //报考省份	
                itemName: '', //报考项目
                itemNameText: '',
                name: '',
                pageSize: 20,
                pageType: 3, //页面类型（1-报考学员管理，2-报考员管理，3-报考管理）
                paymentStatus: '', //交费状态（0-未交费，1-已交费）
                pictureStatus: '', //报考材料图片状态（0-不完整，1-完整）
                province: '', //所在省份
                sortSet: [],
                telephone: '', // 手机号
                total: null,
                registerIds: [],
            },
            list: [],
            totalFlag: false,
            columnList: [
                { 'prop': 'telephone', 'label': '手机号码', width: 120},
                { 'prop': 'name', 'label': '姓名' },
                { 'prop': 'examLable', 'label': '考试项目' },
                { 'prop': 'itemName', 'label': '报考项目', width: 120 },
                { 'prop': 'itemGradeName', 'label': '报考等级/专业', width: 120 },
                { 'prop': 'province', 'label': '所在省份', width: 120},
                { 'prop': 'examProvince', 'label': '报考省份', width: 120},
                { 'prop': 'basicInfoStatus', 'label': '基本信息情况', width: 110},
                { 'prop': 'pictureStatus', 'label': '照片情况' },
                { 'prop': 'checkStatus', 'label': '审核情况' },
                { 'prop': 'paymentStatus', 'label': '交费情况' },
            ],
            provinceList: [],
            fullscreenLoading: false,

            drawer: false,
            studentUuid: '',
            userId: '',
            clueDataSUuid: '',
            callLogUuid: '',

            basicInfoStatusList: [
                { value: 0, label: '不完整' },
                { value: 1, label: '完整' },
            ],
            pictureStatusList: [
                { value: 0, label: '不完整' },
                { value: 1, label: '完整' },
            ],
            paymentStatusList: [
                { value: 0, label: '未交费' },
                { value: 1, label: '已交费' },
            ],
            checkStatusList: [
                { value: 0, label: '待审核' },
                { value: 1, label: '审核通过' },
                { value: 2, label: '审核失败' },
            ],
            restaurants: [],
            ItemBaoKaoList: [],
        }
    },
    created() {
        const studentsPageSize = localStorage.getItem('studentsPageSize');
        if(studentsPageSize) {
            this.form.pageSize = Number(studentsPageSize);
        }else{
            this.form.pageSize = 20;
        }
        this.queryProvinceAll();
        this.registerList();
        this.queryItemList();
        this.getExamBasic();
    },
    methods: {
        exportClick() {
            let arr = [];

            this.$refs.tableSelect.selection.map(sll => {
                arr.push(sll.registerId);
            })
            if(arr.length == 0) {
                this.$message({
                    type: 'error',
                    message: '请您先勾选您要导出的学员'
                });
            }else{
                this.form.registerIds = arr;
                this.registerExportExcel();
            }
        },
        registerExportExcel() {
            filepostDown(registerExportExcel, this.form, '报考数据.xlsx');
            filepostDown(registerExportZip, this.form, '报考数据.zip');
        },
        lookBaoKaoMessage() {
            alert('暂未开发')
        },
        queryItemList() {
            let arr;
            this.$smoke_get(queryItemList, {}).then(res => {
                if(res.code == 200) {
                    arr = JSON.parse(JSON.stringify(res.data).replace(/itemName/g,"value"));
                    this.ItemBaoKaoList = arr;
                }
            })
        },
        changeDrawer(val){
            this.drawer = val;
        },
        registerListClick() {
            this.form.currentPage = 1;
            this.registerList();
        },
        registerList() {
            this.fullscreenLoading = true;
            this.$smoke_post(registerList, this.form).then(res => {
                if(res.code == 200) {
                    setTimeout(() => {
                        this.fullscreenLoading = false;

                        res.data.list.map(sll => {
                            sll.basicInfoStatus = sll.basicInfoStatus == '1' ? '完整' : '不完整';
                            sll.pictureStatus = sll.pictureStatus == '1' ? '完整' : '不完整';
                            sll.paymentStatus = sll.paymentStatus == '1' ? '已交费' : '未交费';
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
        queryProvinceAll() {
          this.$smoke_get(queryProvinceAll, {}).then(res => {
            if(res.code == 200) {
                this.provinceList = res.data;
            }
          })
        },
        handleCurrentChange(index) {
            this.form.currentPage = index;
            this.form.pageSize = Number(localStorage.getItem('studentsPageSize')) ? Number(localStorage.getItem('studentsPageSize')) : 20;
            this.getSupStuList();
        },
        handleSizeChange(index) {
            this.form.pageSize = index;
            this.form.currentPage = 1;
            localStorage.setItem('studentsPageSize', index);
            this.getSupStuList();
        }, 
        getExamBasic() {
            let arr;
            this.$smoke_get(getExamBasic, {}).then(res => {
                if(res.code == 200) {
                    arr = JSON.parse(JSON.stringify(res.data).replace(/name/g,"value"));
                    this.restaurants = arr;
                }
            })
        },
        querySearch(queryString, cb) {
            var restaurants = this.restaurants;
            var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        querySearchBaoKao(queryString, cb) {
            var restaurants = this.ItemBaoKaoList;
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
            this.form.examLable = item.id;
            this.form.examLableText = item.value;
        },
        autocompleteClear() {
            this.$nextTick(() => {
                this.$refs.autocomplete.$children
                    .find(c => c.$el.className.includes('el-input'))
                    .blur();
                this.form.examLable = '';
                this.$refs.autocomplete.focus();
            })
        },
        handleSelectItemName(item) {
            this.form.itemName = item.itemId;
            this.form.itemNameText = item.value;
        },
        autocompleteClearItemName() {
            this.$nextTick(() => {
                this.$refs.autocomplete.$children
                    .find(c => c.$el.className.includes('el-input'))
                    .blur();
                this.form.itemName = '';
                this.$refs.autocomplete.focus();
            })
        },
        getSupStuListClick() {
            this.form.currentPage = 1;
            this.getSupStuList();
        },
        studentDetails( row ) {
            this.drawer = true;
            this.studentUuid = row.studentUuid;
            this.userId = row.customerId;
            this.clueDataSUuid = row.clueDataSUuid;
        },
    },
    mounted() {
        
    },
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
        .el-pagination{
            text-align: right;
            margin-top: .4rem;
        }
    }
</style>