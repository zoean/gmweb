<template>
    <div class="callpop" v-if="callpopFlag_">
        <div v-dragable class="callpop_div">
          <div class="dialog_header">
             <span>通话弹框</span>
             <i class="el-icon-close" @click="handleClose"></i> 
          </div>
          <div class="dialog_kuang">
              <div class="dialog_kuang_1">{{caller_number_}}</div>
              <div>
                <el-image
                    style="margin-top: 30px;"
                    :src="call_state_ == '挂 断' ? require('../../assets/images/call_tankuan.png') : require('../../assets/images/rain_tankuan.png')">
                </el-image>
              </div>
              <div class="dialog_kuang_2">{{call_state_}}</div>
          </div>
          <div class="dialog_kuang_3">
              <span ref="id_H">00</span>:
              <span ref="id_M">00</span>:
              <span ref="id_S">00</span>
          </div>
        </div>
    </div>
</template>

<script>
import { 
    
} from '../../request/api';
import dragable from "@/assets/js/directive/dragable"; // 引入指令js文件
import { 
    timestampToTime
} from '../../assets/js/common';
import { 
    
} from '../../assets/js/data';
export default {
    name: 'callpop',
    directives: { dragable }, // 注册指令
    props: {
        callpopFlag: {
            type: Boolean,
            default: false
        },
        caller_number: {
            type: String,
            default: ''
        },
        call_state: {
            type: String,
            default: ''
        },
    },
    data() {
        return {
            time: '',
        }
    },
    created() {
        console.log(this.callpopFlag);
    },
    methods: {
        handleClose() {
            this.$emit("changecallpopFlag", false)
        },
        showNum(num) {
            if (num < 10) {
                return '0' + num
            }
            return num
        }
    },
    mounted() {
        
    },
    computed: {
        callpopFlag_:{
            get(){
                return this.callpopFlag
            },
            set(val){
                this.$emit("changecallpopFlag",val)
            }
        },
        caller_number_:{
            get(){
                return this.caller_number
            },
        },
        call_state_:{
            get(){
                return this.call_state
            },
        },
    },
    watch: {
        'call_state_': function(newVal,oldVal){
            console.log(newVal);
            var that = this;
            var timer = null;
            var count = 0;
            if(newVal == '响 铃'){
                timer = setInterval(function(){
                    count++;
                    that.$refs.id_S.innerHTML = that.showNum(count % 60)
                    that.$refs.id_M.innerHTML = that.showNum(parseInt(count / 60) % 60)
                    that.$refs.id_H.innerHTML = that.showNum(parseInt(count / 60 / 60))
                    if(that.call_state_ == '挂 断'){
                        setTimeout(() => {
                            clearInterval(timer);
                            that.$emit("changecallpopFlag", false)
                        }, 3000);
                    }
                },1000);
            }
        },
    }
}
</script>

<style lang="less" scoped>
    .callpop{
        position: relative;
        left: 50%;
        margin-left: -200px;
        color: #fff;
        .callpop_div{
            width: 360px;
            height: 330px;
            position: fixed;
            background: #000;
            opacity: .75;
            // left: 40% !important;
            z-index: 9999999;
            user-select: none;
            box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
            border-radius: 4px;
            border: 1px solid #ebeef5;
            .dialog_header{
                width: 100%;
                height: 48px;
                line-height: 54px;
                border-bottom: 1px solid #ebeef5;
                font-size: 16px;
                padding-left: 20px;
                i{
                    float: right;
                    margin-top: 16px;
                    font-size: 20px;
                    margin-right: 16px;
                    cursor: pointer;
                }
            }
            .dialog_kuang{
                width: 223px;
                height: 188px;
                background: #FFFFFF;
                border-radius: 20px;
                opacity: 0.8;
                margin: 0 auto;
                margin-top: 30px;
                color: #000;
                text-align: center;
                .dialog_kuang_1{
                    height: 40px;
                    line-height: 70px;
                    font-size: 18px;
                    font-weight: bold;
                }
                .dialog_kuang_2{
                    height: 50px;
                    line-height: 30px;
                    font-size: 18px;
                    font-weight: bold;
                    text-align: center;
                }
            }
            .dialog_kuang_3{
                height: 60px;
                line-height: 60px;
                font-size: 24px;
                font-weight: bold;
                text-align: center;
            }
        }
    }
</style>