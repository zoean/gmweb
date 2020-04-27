<template>
    <div></div>
</template>
    
<script>
// import jsmc from '../../assets/js/jsmc.min.js';
import json2 from '../../assets/js/json2';
export default {
    name: 'start',
    data() {
        return {
            form: {
                accessToken: "", //主账号的token信息	
                adminUin: "", //主管理员账号	
                appId: "", //appId
                serverUrl: "", //初始化地址
                uin: "" //坐席号
            }
        }
    },
    created() {
        const initOptions = localStorage.getItem('initOptions');
        this.form = JSON.parse(initOptions);
        console.log(this.form);
        if(this.form != undefined) {
            this.smoke_init();
        }
    },
    methods: {
        smoke_init() {
            var demo = browserfly.noConflict();
            var initOptions = {
		        debug: true, // 日志是否输出 default false
  		        strid: '',
  		        uin: this.form.uin , // tq号 / 用户名 必填
  		        admin_uin: this.form.adminUin , // 主管理员TQ号
  		        appid: this.form.appId, // 唯一凭证
  		        access_token: this.form.accessToken, // 密文
  		        server_url: this.form.serverUrl
            };
            demo.init(initOptions);
        }
    },
    mounted() {
        
    }
}
</script>

<style lang="less" scoped>
    
</style>