<template>
    <div class="baokao">
        <el-dialog width="40%" title="报考信息" :visible.sync="baokaoFlag_" :before-close="handleClose">
          
            <div><span>姓名：</span><span>{{message.name}}</span></div>
            <div><span>身份证号：</span><span>{{message.idCardNo}}</span></div>
            <div><span>性别：</span><span>{{message.gender}}</span></div>
            <div><span>学历：</span><span>{{message.education}}</span></div>
            <div><span>毕业院校：</span><span>{{message.graduationSchool}}</span></div>
            <div><span>所学专业：</span><span>{{message.graduationMajor}}</span></div>
            <div><span>工作单位：</span><span>{{message.work}}</span></div>
            <div><span>职务：</span><span>{{message.workPost}}</span></div>
            <div><span>常用邮箱：</span><span>{{message.email}}</span></div>
            
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="examineYes" size="small">审核通过</el-button>
                <el-button @click="examineNo" plain size="small">审核未通过</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { 
    registerGet
} from '../../request/api';
import { 
    timestampToTime, getTextByJs, genderText, educationText
} from '../../assets/js/common';
import { 
    MJ_1, MJ_2, MJ_3, MJ_10, MJ_11, MJ_12, showid, nationAll, MJ_15
} from '../../assets/js/data';
export default {
    name: 'baokaoMessage',
    props: {
        baokaoFlag: {
          type: Boolean,
          default: false
        },
        registerId: {
          type: String,
          default: ''
        }
    },
    data() {
        return {
            message: {},
        }
    },
    created() {
        this.registerGet();
    },
    methods: {
        registerGet() {
            this.$smoke_get(registerGet, {
                registerId: this.registerId
            }).then(res => {
                if(res.code == 200) {
                    res.data.gender = genderText(res.data.gender);
                    res.data.education = educationText(res.data.education);
                    this.message = res.data;
                }
            })
        },
        handleClose() {
            this.$emit("changebaokaoFlag", false)
        },
        examineYes() {

        },
        examineNo() {

        }
    },
    mounted() {
        
    },
    computed: {
        baokaoFlag_:{
            get(){
                return this.baokaoFlag
            },
            set(val){
                this.$emit("changebaokaoFlag",val)
            }
        }
    },
}
</script>

<style lang="less" scoped>
    .baokao /deep/ div.el-dialog__body{
        height: 55vh;
        overflow: auto;
        padding: 10px 20px;
    }
</style>