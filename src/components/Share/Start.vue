<template>
    <div class="callpop" v-if="callpopFlag">
        <div v-dragable class="callpop_div">
          <div class="dialog_kuang dialog_header">
              <div>{{caller_number}}</div>
              <div style="font-size: 12px;">{{call_location}}</div>
              <div>
                <el-image
                    style="width: 134px; height: 60px;"
                    :src="call_state == '响 铃 中' ? require('../../assets/images/rain_icon.gif') : call_state == '通 话 中' ? require('../../assets/images/call_icon.png') : require('../../assets/images/up_icon.png')">
                </el-image>
              </div>
              <div>{{call_state}}</div>
          </div>
          <div class="dialog_kuang_li">
              <span ref="id_H">00</span>:
              <span ref="id_M">00</span>:
              <span ref="id_S">00</span>
          </div>
        </div>
    </div>
</template>
    
<script>
import dragable from "@/assets/js/directive/dragable"; // 引入指令js文件
import { 
    timestampToTime
} from '../../assets/js/common';
export default {
    name: 'start',
    directives: { dragable }, // 注册指令
    data() {
        return {
            callpopFlag: false,
            call_state: '',
            caller_number: '',
            call_location: '',
            time: '',
        }
    },
    created() {
        this.smoke_init();
    },
    methods: {
        smoke_init() {
            var that = this;

            var demo = browserfly.noConflict();

            // demo.monitorEvent("callTip", function(message, jsonObject) {
            //     console.log(message);
            //     console.log(jsonObject);
            // });

            demo.monitorEvent("callEvent", function(message, jsonObject) {
                // console.log('监听成功-callEvent');
                // console.log(message);
                // console.log(jsonObject);
                if(message.call_event.call_state == 'caller_ring') {
                    that.callpopFlag = true;
                    that.caller_number = message.call_event.caller_number;
                    that.call_state = '响 铃 中';
                    var timer = null;
                    var count = 0;
                    timer = setInterval(function(){
                        count++;
                        that.$refs.id_S.innerHTML = that.showNum(count % 60)
                        that.$refs.id_M.innerHTML = that.showNum(parseInt(count / 60) % 60)
                        that.$refs.id_H.innerHTML = that.showNum(parseInt(count / 60 / 60))
                        if(that.call_state == '挂 断'){
                            setTimeout(() => {
                                clearInterval(timer);
                                that.callpopFlag = false;
                            }, 3000);
                        }
                    },1000);
                }else if(message.call_event.call_state == 'caller_answer') {
                    that.call_state = '通 话 中';
                }else if(message.call_event.call_state == 'agent_hangup') {
                    that.call_state = '挂 断';
                }
            });

            // demo.monitorEvent("seatState", function(message, jsonObject) {
            //     console.log('监听成功-seatState');
            //     console.log(message);
            //     console.log(jsonObject);
            // }); 
            
            demo.monitorEvent("callTip",function(message, jsonObject){
                // console.log('监听成功-callTip');
                // console.log(message);
                that.call_location = decodeURIComponent(message.call_tip.location);
                console.log(that.call_location);
                // console.log(jsonObject);
            })
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
}
</script>

<style lang="less" scoped>
    .callpop{
        position: relative;
        left: 50%;
        margin-left: -200px;
        .callpop_div{
            width: 223px;
            height: 196px;
            position: fixed;
            box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
            background: #fff;
            // left: 40% !important;
            z-index: 999999;
            user-select: none;
            border-radius: 20px;
            border: 1px solid #ebeef5;
            .dialog_kuang{
                width: 223px;
                height: 150px;
                background: #FFFFFF;
                border-radius: 20px;
                margin: 0 auto;
                margin-top: 10px;
                font-size: 16px;
                color: #333;
                text-align: center;
                display: flex;
                flex-direction: column;
                justify-content: space-around;
                // font-weight: bold;
            }
            .dialog_kuang_li{
                font-size: 16px;
                color: #333;
                text-align: center;
                // font-weight: bold;
            }
        }
    }
</style>