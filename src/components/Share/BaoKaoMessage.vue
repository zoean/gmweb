<template>
    <div class="baokao" id="baokao">
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

            <ul v-loading="fullscreenLoading">
                <li v-for="(item, index) in imgArr"
                    :key="index">
                    <img :src="item.address" />
                    <span>{{item.name}}</span>
                </li>
            </ul>
            
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="examineYes" size="small">审核通过</el-button>
                <el-popover
                    placement="top-end"
                    width="200"
                    v-model="examineNoFlag">
                    
                    <el-select v-model="checkForm.checkResult" style="margin: 10px 0 14px 0;" placeholder="请选择审核失败原因" class="screen-li" size="small" clearable>
                        <el-option
                          v-for="item in checkResultList"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                    </el-select>
                    
                    <div style="text-align: right; margin: 0">
                      <el-button size="mini" plain @click="examineNoFlag = false">取消</el-button>
                      <el-button type="primary" size="mini" @click="examineNo">确定</el-button>
                    </div>
                    <el-button slot="reference" plain size="small" style="margin-left: 10px;">审核失败</el-button>
                </el-popover>
            </span>
        </el-dialog>



    </div>
</template>

<script>
import Viewer from 'viewerjs';
import 'viewerjs/dist/viewer.css';
import { 
    registerGet,
    registerCheck,
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
            imgArr: [],
            fullscreenLoading: false,
            checkForm: {
                checkResult: '',
                checkStatus: '',
                registerId: this.registerId
            },
            examineNoFlag: false,
            checkResultList: [
                {label: '照片不合格', value: '照片不合格'},
                {label: '工作证明不合格', value: '工作证明不合格'},
                {label: '学历不合格', value: '学历不合格'},
            ]
        }
    },
    created() {
        this.registerGet();
    },
    methods: {
        registerGet() {
            this.fullscreenLoading = true;
            this.$smoke_get(registerGet, {
                registerId: this.registerId
            }).then(res => {
                if(res.code == 200) {
                    setTimeout(() => {
                        this.fullscreenLoading = false;
                        res.data.gender = genderText(res.data.gender);
                        res.data.education = educationText(res.data.education);
                        this.message = res.data;
                        this.imgArr.push({name: '个人图片', address: res.data.personalPictureUrl});
                        this.imgArr.push({name: '学历证书', address: res.data.diplomaUrl});
                        this.imgArr.push({name: '申请表', address: res.data.applicationFormUrl});
                        this.imgArr.push({name: '工作年限证明', address: res.data.workTimeProveUrl});
                        this.$nextTick(() => {
                            this.initImageTools();
                        })
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
        handleClose() {
            this.$emit("changebaokaoFlag", false)
        },
        examineYes() {
            this.checkForm.checkStatus = 1;
            this.checkForm.checkResult = '';
            this.registerCheck();
        },
        examineNo() {
            this.checkForm.checkStatus = 2;
            if(this.checkForm.checkResult) {
                this.registerCheck();
            }else{
                this.$message({
                    type: 'error',
                    message: '请您选择审核失败原因'
                })
            }
        },
        registerCheck() {
            this.$smoke_post(registerCheck, this.checkForm).then(res => {
                if(res.code == 200) {
                    this.$message({
                        type: 'success',
                        message: '审核情况提交成功'
                    })
                    this.$emit("changebaokaoFlag", false)
                }else{
                    this.$message({
                        type: 'error',
                        message: res.msg
                    })
                }
            })
        },
        initImageTools(){
            //初始化 viewerjs
            const ViewerDom = document.getElementById('baokao');
            const viewer = new Viewer(ViewerDom, {
                
            });
        },
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
    .baokao{
        ul {
            li {
                width: 100px;
                height: 100px;
                margin-right: 10px;
                margin-top: 20px;
                cursor: pointer;
                display: inline-block;
                text-align: center;
                img {
                    height: 100%;
                    width: 100%;
                    object-fit: cover;
                }
            }
        }
    }
    .baokao /deep/ div.el-dialog__body{
        height: 55vh;
        overflow: auto;
        padding: 10px 20px;
    }
</style>