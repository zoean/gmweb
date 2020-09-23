<template>
    <div class="main-area">
        <el-carousel trigger="click" height="300px">
            <el-carousel-item v-for="item in bannerList" :key="item.url" style="background: #F1F1F1;">
                <img :src="item.url" alt="">
            </el-carousel-item>
        </el-carousel>
        <el-row class="user-info" type="flex" justify="center">
            <el-col class="user-info-content">
                <el-row type="flex" justify="space-between">
                    <el-col :span="14" type="flex" justify="space-between" class="user-info-left">
                        <el-row type="flex" style="width: 100%;">
                            <el-col :span="4">
                                <img class="avator" :src="$store.state.avatar ? $store.state.avatar : require('../../assets/images/header_img.png')" alt="">
                            </el-col>
                            <el-col :span="20" :xs="0">
                                <section>
                                    <h2>早安，{{$store.state.name}}，祝你开心每一天！</h2>
                                    <p>{{$store.state.userRole}}&nbsp;&nbsp;|&nbsp;&nbsp;{{$store.state.userDepartment}}&nbsp;&nbsp;|&nbsp;&nbsp;{{$store.state.curDate}}</p>
                                </section>
                            </el-col>
                        </el-row>
                    </el-col>
                    <el-col :span="10" class="user-info-right">
                        <dl>
                            <dt>今日线索量</dt>
                            <dd>
                                <countTo v-if="seatDataVolume.newData > 0" :startVal='0' :endVal='seatDataVolume.newData' :duration='3000'></countTo>
                                <p v-else>{{seatDataVolume.newData || 0}}</p>
                            </dd>
                        </dl>
                        <span class="line"></span>
                        <dl>
                            <dt>今日拨通量</dt>
                            <dd>
                                <countTo v-if="seatDataVolume.dlal > 0" :startVal='0' :endVal='seatDataVolume.dlal' :duration='3000'></countTo>
                                <p v-else>{{seatDataVolume.dlal || 0}}</p>
                            </dd>
                        </dl>
                        <span class="line"></span>
                        <dl>
                            <dt>累计销量</dt>
                            <dd>
                                <countTo v-if="seatDataVolume.order > 0" :startVal='0' :endVal='seatDataVolume.order' :duration='3000'></countTo>
                                <p v-else>{{seatDataVolume.order || 0}}</p>
                            </dd>
                        </dl>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <el-row class="express-entry">
            <el-row class="title" type="flex" justify="flex-start">
                <i></i>
                <h3>快速登录入口</h3>
            </el-row>
            <el-row class="entry-list" type="flex" justify="center">
                <el-col :span="8" :gutter="20" v-for="(item, index) in list1" :key="index">
                    <a><img :src="item.url" :alt="item.name" target="_blank" @click="handleClick1(item)" style="cursor: pointer;"></a>
                </el-col>
            </el-row>
            <el-row class="entry-list" type="flex" justify="center">
                <el-col :span="8" :gutter="20" v-for="(item, index) in list2" :key="index">
                    <a><img :src="item.url" :alt="item.name" target="_blank" @click="handleClick2(item)" style="cursor: pointer;"></a>
                </el-col>
            </el-row>
        </el-row>
    </div>
</template>

<script>
import { getUinOutConfigMessage, loginPlatform, getSeatDataVolume } from '../../request/api';
import {getCurrentDate} from '@/assets/js/common'
import countTo from 'vue-count-to';
export default {
    name: 'index',
    components: {
        countTo
    },
    // metaInfo: {
    //     title: '首页',
    //     meta: [
    //         {
    //             name: 'viewport', content: 'maximum-scale=3.0'
    //         }
    //     ]
    // },    
    data() {
        return {
            currentDate: getCurrentDate('-'),
            list1: [
               { name: '京华网校商城后台', https: 'http://www.jhwx.com/admin_jhwx/', url: require('../../assets/images/inserticon01.png'), id: 1},
               { name: '胜学网校商城后台', https: 'https://www.shengxuewangxiao.com/admin_jhwx/index.php', url: require('../../assets/images/inserticon02.png'), id: 2},
               { name: '京华集团商城后台', https: 'https://www.jhwxedu.com/admin_jhwx/index.php', url: require('../../assets/images/inserticon06.png'), id: 3},
            ],
            list2: [
               { name: '京华教育题库后台', https: 'http://kaoshi.jhwx.com/index.php', url: require('../../assets/images/inserticon04.png'), id: 4},
               { name: '京华教育课程后台', https: 'https://cssc.jhwx.com', url: require('../../assets/images/inserticon03.png'), id: 5},
               { name: '京华教育JQ后台', https: 'http://office.jhwx.com/vip/index.do', url: require('../../assets/images/inserticon05.png'), id: 6},
            ],
            bannerList: [
                { url: require('../../assets/images/banner1.png')},
                { url: require('../../assets/images/banner2.png')},
                { url: require('../../assets/images/banner3.png')},
                { url: require('../../assets/images/banner4.png')},
            ],
            form: {
                accessToken: "", //主账号的token信息	
                adminUin: "", //主管理员账号	
                appId: "", //appId
                serverUrl: "", //初始化地址
                uin: "" //坐席号
            },
            seatDataVolume:{}
        }
    },
    created() {
        this.getUinOutConfigMessage();
        this.getSeatDataVolume();
    },
    methods: {
        getSeatDataVolume(){
            this.$smoke_get(getSeatDataVolume).then(res => {
                this.seatDataVolume.newData = Number(res.data.newData) || 0
                this.seatDataVolume.dlal = Number(res.data.dlal) || 0
                this.seatDataVolume.order = Number(res.data.order) || 0
            })
        },
        getUinOutConfigMessage() {
            this.$smoke_post(getUinOutConfigMessage, {
                userUuid: localStorage.getItem('userUuid')
            }).then(res => {
                if(res.code == 200) {
                    this.form.accessToken = res.data.accessToken;
                    this.form.adminUin = res.data.adminUin;
                    this.form.appId = res.data.appId;
                    this.form.serverUrl = res.data.serverUrl;
                    this.form.uin = res.data.uin;
    
                    localStorage.setItem("initOptions", JSON.stringify(this.form));
                }
            })
        },
        handleClick1(item) {
            this.loginPlatform(item.id);
        },
        handleClick2(item) {
            if(item.id == 6) {
                const href = item.https;
                window.open(href, '_blank');
            }else{
                this.loginPlatform(item.id);
            }
        },
        loginPlatform(id) {
            let href = '';
            this.$smoke_post(loginPlatform, {
                loginPlatformType: id
            }).then(res => {
                if(res.code == 200){
                    if(id == 1) {
                        href = '/onelogin/admin_jhwx/privilege.php?act=login&sys=' + res.data.loginPlatform + '&site=' + res.data.loginPlatformType;
                    }else if(id == 2) {
                        href = '/sx_api/admin_jhwx/privilege.php?act=login&sys=' + res.data.loginPlatform + '&site=' + res.data.loginPlatformType;
                    }else if(id == 3) {
                        href = '/edu_api/admin_jhwx/privilege.php?act=login&sys=' + res.data.loginPlatform + '&site=' + res.data.loginPlatformType;
                    }else if(id == 4) {
                        href = '/onelogin/api_sys_login.php?act=login&sys=' + res.data.loginPlatform + '&site=' + res.data.loginPlatformType;
                    }else if(id == 5) {
                        href = '/onelogin/api_sys_login.php?act=login&sys=' + res.data.loginPlatform + '&site=' + res.data.loginPlatformType;
                    }
                    
                    if(res.data.loginPlatform){
                        window.open(href, '_blank');
                    }
                }
            })
        }
    },
    mounted() {
        
    }
}
</script>

<style lang="less" scoped>
body{
    zoom: 1;
    transform: scale(1);
    -moz-transform: scale(1);
    transform-origin: 'center top';
}
.main-area{
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-left: 0 !important;
    .el-carousel{
        .el-carousel-item{
            text-align: center;
            img{
                height: 300px;
            }
        }
    }
    .user-info{
        height: 136px;
        background: #fff;
        border-bottom: 1px solid #E9E9E9;
        align-items: center;
        .user-info-content{
            width: 1194px;
            .user-info-left{
                display: flex;
                flex-direction: row;
                justify-content: flex-start;
                align-items: center;
                .avator{
                    width: 72px;
                    height: 72px;
                    border-radius: 50%;
                    margin-right: 25px;
                }
                section{
                    h2{
                        font-size: 20px;
                        font-weight: 100;
                        color: #000;
                    }
                    p{
                     color: #666;   
                     margin: 12px 0;
                    }
                }
                
            }
            .user-info-right{
                display: flex;
                flex-direction: row;
                justify-content: flex-end;
                align-items: center;
                dl{
                    min-width: 60px;
                    // margin-left: 32px;
                    dt{
                       color: #666; 
                    }
                    dd{
                        font-size: 30px;
                        color: #000;
                        text-align: right;
                    }
                }
                span.line{
                    border-right:1px solid #bbb;
                    height: 40px;
                    width: 32px;
                    margin-right: 32px;
                }
            }
        }
    }
    .express-entry{
        background: #fff;
        margin-top: 15px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 26px 0;
        .title{
            width: 1022px;
            align-items: center;
            i{
                width: 5px;
                height: 18px;
                background: #409EFF;
                border-radius: 3px;
                margin-right: 4px;
            }
            h3{
                font-size: 18px;
                color: #333;
                font-weight: 100;
            }
        }
        .entry-list{
            width: 1022px; 
            margin-top: 18px;
        }
    }
}

    @media screen and (max-width: 1640px) {
        .el-carousel__item{
            img{
                margin-left: -2rem !important;
            }
        }
    }
    @media screen and (min-width: 1920px) {
        .el-carousel__item{
            img{
                // border-radius: 8px;
                width: 100%;
                height: 100%;
                margin-left: 0rem !important;
            }
        }
    }

</style>