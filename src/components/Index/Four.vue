<template>
    <div class="main-area">
        <img src="../../assets/images/404.png" alt="" class="images-404">
        <div class="text-404">网页不存在</div>
        <div class="text-back">3秒后自动返回首页</div>
    </div>
</template>

<script>
export default {
    name: 'four',
    data() {
        return {
           
        }
    },
    created() {
        this.backfun();
    },
    methods: {
        backfun() {
            const that = this;
            setTimeout(function(){ 
                that.$router.push({
                    path: '/'
                })
            }, 3000);
        }
    },
    mounted() {
        
    }
}
</script>

<style lang="less" scoped>
    .main-area{
        width: 100vw;
        text-align: center;
        .images-404{
            margin-top: 2rem;
        }
        .text-404{
            font-size: 18px;
            margin-top: 40px;
            letter-spacing: 10px;
        }
        .text-back{
            font-size: 18px;
            margin-top: 20px;
            letter-spacing: 10px;
        }
    }
</style>