<template>
    <div class="main-area">

        <div class="index-title">欢迎来到京华大地--综合后台</div>

        <el-card 
            class="box-card" 
            shadow="hover" 
            v-for="(item, index) in list"
            :key="index"
        >
            <a :href="item.https" target="_blank">
                <div>{{item.name}}</div>
            </a>
        </el-card>
    </div>
</template>

<script>
export default {
    name: 'index',
    data() {
        return {
           list: [
               { name: '京华网校商城后台', https: 'http://www.jhwx.com/admin_jhwx/'},
               { name: '胜学网校商城后台', https: 'https://www.shengxuewangxiao.com/admin_jhwx/index.php'},
               { name: '京华教育课程后台', https: 'https://cssc.jhwx.com'},
               { name: '京华教育题库后台', https: 'http://kaoshi.jhwx.com/index.php'},
               { name: '京华教育JQ后台', https: 'http://office.jhwx.com/vip/index.do'},
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
        .index-title{
            font-size: .4rem;
            text-align: center;
            margin-top: .4rem;
        }
        .box-card {
            border: 1px solid #eee;
            width: 2.2rem;
            height: 1.4rem;
            margin-left: 1rem;
            margin-top: 1rem;
            float: left;
            a{
                display: block;
                width: 2.2rem;
                height: 1.4rem;
                font-size: .2rem;
                text-align: center;
                line-height: 1.4rem;
            }
        }
    }
</style>
<style>
.el-card__body{
    padding: 0 !important;
}
</style>