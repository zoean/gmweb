<template>
    <el-main class="index-main">

        <el-row class="people-screen">

            <el-col :span="4">
                
                <el-date-picker
                    style="width: 90%;"
                    size="small"
                    v-model="timeDate"
                    type="date"
                    value-format='timestamp'
                    :picker-options="pickerOptions"
                    @change="timeChange"
                    placeholder="请选择日期">
                </el-date-picker>

            </el-col>

            <el-col :span="4">

                <el-button type="primary" @click="returnVisitClick" size="small">查 询</el-button>

            </el-col>

        </el-row>

        <el-table
            :data="list"
            ref="tableSelect"
            v-loading="fullscreenLoading"
            :key="Math.random()"
            style="width: 100%">
            
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

        </el-table>

    </el-main>
</template>

<script>
import { 
    returnVisit,
} from '../../request/api';
import { 
    timestampToTime, 
    genderText,
    classTypeString,
    getTextByJs,
    sortTextNum,
    schoolType,
} from '../../assets/js/common';
import { 
    
} from '../../assets/js/data';
export default {
    name: 'studentsNewBaoKao',
    data() {
        return {
            form: {
                time: ''
            },
            list: [],
            totalFlag: false,
            columnList: [
                { 'prop': 'singlePlatform', 'label': '成单平台', width: 120},
                { 'prop': 'classTeaOrg', 'label': '班主任组别' },
                { 'prop': 'tel', 'label': '手机号码' },
                { 'prop': 'name', 'label': '姓名', width: 120 },
                { 'prop': 'returnVisit', 'label': '是否回访', width: 120 },
                { 'prop': 'followUp', 'label': '是否跟进', width: 120},
            ],
            fullscreenLoading: false,
            timeDate: '',
            pickerOptions: {
                disabledDate(time) {
                  return time.getTime() > Date.now();
                },
                shortcuts: [{
                  text: '昨天',
                  onClick(picker) {
                    const date = new Date(new Date(new Date().toLocaleDateString()).getTime());
                    date.setTime(date.getTime() - 3600 * 1000 * 24);
                    picker.$emit('pick', date);
                  }
                }, {
                  text: '前天',
                  onClick(picker) {
                    const date = new Date(new Date(new Date().toLocaleDateString()).getTime());
                    date.setTime(date.getTime() - 3600 * 1000 * 24 * 2);
                    picker.$emit('pick', date);
                  }
                }, {
                  text: '2天前',
                  onClick(picker) {
                    const date = new Date(new Date(new Date().toLocaleDateString()).getTime());
                    date.setTime(date.getTime() - 3600 * 1000 * 24 * 3);
                    picker.$emit('pick', date);
                  }
                }, {
                  text: '3天前',
                  onClick(picker) {
                    const date = new Date(new Date(new Date().toLocaleDateString()).getTime());
                    date.setTime(date.getTime() - 3600 * 1000 * 24 * 4);
                    picker.$emit('pick', date);
                  }
                }]
                
            },
        }
    },
    created() {
        
    },
    methods: {
        timeChange() {
            this.form.time = this.timeDate;
        },
        returnVisitClick() {
            if(this.form.time){
                this.returnVisit();
            }else{
                this.$message({
                    type: 'error',
                    message: '请您先选择查询日期'
                })
            }
        },
        returnVisit() {
            this.fullscreenLoading = true;
            this.$smoke_post(returnVisit, this.form).then(res => {
                if(res.code == 200) {
                    setTimeout(() => {
                        this.fullscreenLoading = false;
                        res.data.map(sll => {
                            sll.singlePlatform = schoolType(sll.singlePlatform);
                            sll.followUp = sll.followUp == 1 ? '是' : sll.followUp == 2 ? '否' : '- -';
                            sll.returnVisit = sll.returnVisit == 1 ? '是' : sll.returnVisit == 0 ? '否' : '- -';
                        })
                        this.list = res.data;
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