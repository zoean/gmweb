<template>
    <div class="main-area">

        <el-row style="width: 100%; height: 580px; margin-top: .5rem; margin-left: 11.5%; border: 1px solid #E6E6E8; border-radius:10px; background:#fff;">

            <el-col :span="6" class="smoke-fff" style="height:100%; border-radius:10px 0 0 10px; border-right: 1px dashed #e6e6e8;">

                <div style="padding-top: 50px; text-align: center;">

                    <el-image
                        style="width: 50px; height: 50px; border-radius: 50%;"
                        :src="$store.state.avatar ? $store.state.avatar : require('../../assets/images/header_img.png')">
                    </el-image>

                </div>

                <div style="font-size: 18px; margin-top:.2rem; text-align: center;"><span>姓名：</span><span>{{$store.state.name}}</span></div>
                
                <div class="left-css"><span style="float: left;">手机号：</span><span style="float: right; color:#578CBA;">{{$store.state.accountNumber}}</span></div>

                <div class="left-css"><span style="float: left;">所在部门：</span><span style="float: right; color:#578CBA;">-- --</span></div>

                <div class="left-css"><span style="float: left;">今日线索量：</span><span style="float: right; color:#578CBA;">0 条</span></div>

                <div class="left-css"><span style="float: left;">今日拨通量：</span><span style="float: right; color:#578CBA;">0 通</span></div>

                <div class="left-css"><span style="float: left;">累积销量：</span><span style="float: right; color:#578CBA;">0 单</span></div>

            </el-col>

            <el-col :span="18" style="height:100%;">

                <el-row class="row-css">

                    <el-carousel trigger="click" height="200px">
                      <el-carousel-item v-for="item in bannerList" :key="item.url" style="background: #F7F7F7;">
                        <img :src="item.url" alt="">
                      </el-carousel-item>
                    </el-carousel>

                </el-row>

                <el-row style="margin-top: 120px; margin-bottom: 20px; font-size: 18px; padding-left: 30px;">
                    <span style="display:inline-block;width:12px;height:12px;background:rgba(72,143,247,1);border-radius:50%; margin-right: 5px;"></span>
                     快捷入口
                </el-row>

                <el-row class="row-css" :gutter="30" style="padding: 0 30px;">

                    <el-col :span="8" v-for="(item,index) in list1" :key="index">

                        <el-card class="box-card" shadow="hover">

                            <a target="_blank" @click="handleClick1(item)">
                                <img style="width: .5rem; height: .5rem; position: relative; top: .17rem;" :src="item.url"/>
                                <div class="name">{{item.name}}</div>
                            </a>

                        </el-card>

                    </el-col>

                </el-row>

                <el-row class="row-css" :gutter="30" style="padding: 0 30px;">

                    <el-col :span="8" v-for="(item,index) in list2" :key="index">

                        <el-card class="box-card" shadow="hover" @click="handleClick2(item)">

                            <a target="_blank">
                                <img style="width: .5rem; height: .5rem; position: relative; top: .17rem;" :src="item.url"/>
                                <div class="name">{{item.name}}</div>
                            </a>

                        </el-card>

                    </el-col>

                </el-row>

            </el-col>

        </el-row>

        
    </div>
</template>

<script>
import { getUinOutConfigMessage, loginPlatform } from '../../request/api';
export default {
    name: 'index',
    data() {
        return {
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
                { url: require('../../assets/images/banner1.jpg')},
                { url: require('../../assets/images/banner2.jpg')},
                { url: require('../../assets/images/banner3.jpg')},
                { url: require('../../assets/images/banner4.jpg')},
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
        width: calc( 100vw - 3.8rem );
        .left-css{
            font-size: 14px; width: 200px; 
            overflow: hidden; margin: 0 auto;
            margin-top:.2rem;
        }
        .box-card {
            width: 100%;
            border-radius: 4px;
            height:1rem;
            margin-top: .2rem;
            a{
                display: block;
                width: 100%;
                height: 1rem;
                font-size: .22rem;
                text-align: center;
                padding-right: .2rem;
                cursor: pointer;
                line-height: 1rem;
                .name{
                    display: inline-block;
                    position: relative;
                    top: 0px;
                    left: 20px;
                }
            }
        }
        .row-css{
            &:first-of-type{
                height: 130px;
                padding: 20px 30px;
            }
        }
        .small{
            font-size: .4rem;
            text-align: center;
            line-height: 200px;
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
                border-radius: 8px;
                width: 100%;
                height: 100%;
                margin-left: 0rem !important;
            }
        }
    }

</style>