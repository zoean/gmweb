<template>
    <div class="main-area">
        <el-carousel trigger="click" height="300px">
            <el-carousel-item v-for="item in bannerList" :key="item.url" style="background: #F7F7F7;">
                <img :src="item.url" alt="">
            </el-carousel-item>
        </el-carousel>
        <el-row class="user-info" type="flex" justify="center">
            <el-col class="user-info-content">
                <el-row type="flex" justify="space-between">
                    <el-col :span="12" type="flex" justify="space-between" class="user-info-left">
                        <img class="avator" :src="$store.state.avatar ? $store.state.avatar : require('../../assets/images/header_img.png')" alt="">
                        <section>
                            <h2>早安，{{$store.state.name}}，祝你开心每一天！</h2>
                            <p>{{$store.state.userRole}}&nbsp;&nbsp;|&nbsp;&nbsp;{{$store.state.userDepartment}}&nbsp;&nbsp;|&nbsp;&nbsp;{{$store.state.curDate}}</p>
                        </section>
                    </el-col>
                    <el-col :span="12" class="user-info-right">
                        <dl>
                            <dt>今日线索量</dt>
                            <dd>
                                <countTo :startVal='0' :endVal='556' :duration='3000'></countTo>
                            </dd>
                        </dl>
                        <span class="line"></span>
                        <dl>
                            <dt>今日拨通量</dt>
                            <dd>
                                <countTo :startVal='0' :endVal='122' :duration='3000'></countTo>
                            </dd>
                        </dl>
                        <span class="line"></span>
                        <dl>
                            <dt>累计销量</dt>
                            <dd>
                                <countTo :startVal='0' :endVal='66' :duration='3000'></countTo>
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
                <el-col :span="8" :gutter="20" v-for="(item, index) in list1" :key="index" @click="handleClick1(item)">
                    <a :href="item.https"><img :src="item.url" :alt="item.name" target="_blank"></a>
                </el-col>
            </el-row>
            <el-row class="entry-list" type="flex" justify="center">
                <el-col :span="8" :gutter="20" v-for="(item, index) in list2" :key="index">
                    <a :href="item.https"><img :src="item.url" :alt="item.name"></a>
                </el-col>
            </el-row>
        </el-row>
    </div>
</template>

<script>
import { getUinOutConfigMessage, loginPlatform } from '../../request/api';
import {getCurrentDate} from '@/assets/js/common'
import countTo from 'vue-count-to';
export default {
    name: 'index',
    components: {
        countTo
    },
    data() {
        return {
            currentDate: getCurrentDate('-'),
            list1: [
               { name: '京华网校商城后台', https: 'http://www.jhwx.com/admin_jhwx/', url: require('../../assets/images/inserticon01.png'), id: 1},
               { name: '胜学网校商城后台', https: 'https://www.shengxuewangxiao.com/admin_jhwx/index.php', url: require('../../assets/images/inserticon02.png'), id: 2},
               { name: '京华教育课程后台', https: 'https://cssc.jhwx.com', url: require('../../assets/images/inserticon03.png'), id: 3},
            ],
            list2: [
               { name: '京华教育题库后台', https: 'http://kaoshi.jhwx.com/index.php', url: require('../../assets/images/inserticon04.png'), id: 4},
               { name: '京华教育JQ后台', https: 'http://office.jhwx.com/vip/index.do', url: require('../../assets/images/inserticon05.png'), id: 5},
               { name: '京华集团商城后台', https: 'https://www.jhwxedu.com/admin_jhwx/index.php', url: require('../../assets/images/inserticon06.png'), id: 6},
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
            }
        }
    },
    created() {
        this.getUinOutConfigMessage();
    },
    methods: {
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
            if(item.id == 1){
                this.loginPlatform(item.id);
            }else{
                const href = item.https;
                window.open(href, '_blank');
            }
        },
        handleClick2() {
            const href = item.https;
            window.open(href, '_blank');
        },
        loginPlatform(id) {
            this.$smoke_post(loginPlatform, {
                loginPlatformType: id
            }).then(res => {
                if(res.code == 200){
                    const href = 'https://test.jhwx.com/admin_jhwx/privilege.php?act=login&sys=' + res.data.loginPlatform;
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
                     color: #999;   
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
                    // margin-left: 32px;
                    dt{
                       color: #999; 
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