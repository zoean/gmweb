<template>
    <div class="main-area">

        <el-row style="width: 100%; height: 700px; margin-top: 5%; margin-left: 11.5%;">

            <el-col :span="6" class="smoke-fff" style="height:100%;">

                <div style="padding-top: 1rem; text-align: center;"><i class="el-icon-user" style="font-size: .6rem;"></i></div>

                <div style="font-size: .2rem; margin-top:.3rem; padding-left: 1rem;"><span>姓名：</span><span>{{$store.state.name}}</span></div>
                
                <div style="font-size: .2rem; margin-top:.3rem; padding-left: 1rem;"><span>手机号：</span>{{$store.state.accountNumber}}</div>

                <div style="font-size: .2rem; margin-top:.3rem; padding-left: 1rem;"><span>所在部门：</span>战狼组</div>

                <div style="font-size: .2rem; margin-top:.3rem; padding-left: 1rem;"><span>今日线索量：</span>155条</div>

                <div style="font-size: .2rem; margin-top:.3rem; padding-left: 1rem;"><span>今日拨通量：</span>122通</div>

                <div style="font-size: .2rem; margin-top:.3rem; padding-left: 1rem;"><span>累积销量：</span>166单</div>


            </el-col>

            <el-col :span="17" :offset="1" style="height:100%;">

                <el-row class="row-css">

                    <el-carousel trigger="click" height="200px">
                      <el-carousel-item v-for="item in bannerList" :key="item.url" style="background: #ccc;">
                        <img :src="item.url" alt="">
                      </el-carousel-item>
                    </el-carousel>

                </el-row>

                <el-row style="margin-top: 120px; margin-bottom: 20px; font-size: 20px;">快捷入口：</el-row>

                <el-row class="row-css" :gutter="30">

                    <el-col :span="8" v-for="(item,index) in list1" :key="index">

                        <el-card class="box-card" shadow="hover">

                            <a :href="item.https" target="_blank">
                                <el-image style="width: 40px; height: 40px; margin-top: 20px;" :src="item.url" fit="fit"></el-image>
                                <div style="margin-top: 10px;">{{item.name}}</div>
                            </a>

                        </el-card>

                    </el-col>

                </el-row>

                <el-row class="row-css" :gutter="30">

                    <el-col :span="8" v-for="(item,index) in list2" :key="index">

                        <el-card class="box-card" shadow="hover">

                            <a :href="item.https" target="_blank">
                                <el-image style="width: 40px; height: 40px; margin-top: 20px;" :src="item.url" fit="fit"></el-image>
                                <div style="margin-top: 10px;">{{item.name}}</div>
                            </a>

                        </el-card>

                    </el-col>

                </el-row>

            </el-col>

        </el-row>

        
    </div>
</template>

<script>
export default {
    name: 'index',
    data() {
        return {
            list1: [
               { name: '京华网校商城后台', https: 'http://www.jhwx.com/admin_jhwx/', url: require('../../assets/images/inserticon01.png')},
               { name: '胜学网校商城后台', https: 'https://www.shengxuewangxiao.com/admin_jhwx/index.php', url: require('../../assets/images/inserticon01.png')},
               { name: '京华教育课程后台', https: 'https://cssc.jhwx.com', url: require('../../assets/images/inserticon01.png')},
            ],
            list2: [
               { name: '京华教育题库后台', https: 'http://kaoshi.jhwx.com/index.php', url: require('../../assets/images/inserticon01.png')},
               { name: '京华教育JQ后台', https: 'http://office.jhwx.com/vip/index.do', url: require('../../assets/images/inserticon01.png')},
               { name: '京华集团商城后台', https: 'https://www.jhwxedu.com/admin_jhwx/index.php', url: require('../../assets/images/inserticon01.png')},
            ],
            bannerList: [
                { url: require('../../assets/images/banner1.jpg')},
                { url: require('../../assets/images/banner2.jpg')},
                { url: require('../../assets/images/banner3.jpg')},
                { url: require('../../assets/images/banner4.jpg')},
            ]
        }
    },
    created() {

    },
    methods: {
        
    },
    mounted() {
        
    }
}
</script>

<style lang="less" scoped>
    .main-area{
        width: calc( 100vw - 3.65rem );
        .box-card {
            width: 100%;
            border-radius: 4px;
            height: 120px;
            a{
                display: block;
                width: 100%;
                height: 120px;
                font-size: 15px;
                text-align: center;
            }
        }
        .row-css{
            height: 140px;
            &:first-of-type{
                margin-top: 0;
            }
            &:nth-of-type(2){
                margin-top: 200px !important;
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
                margin-left: 0rem !important;
            }
        }
    }

</style>
<style>
.el-card__body{
    padding: 0 !important;
}
</style>