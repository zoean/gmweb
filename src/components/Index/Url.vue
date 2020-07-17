<template>
    <div class="main-area">
        <div class="smoke">
          <el-image :src="require('../../assets/images/baokao.png')" style="width: 100%;"></el-image>
          <div class="text">亲爱的学员大家好，2020年注定是不安分的一年，疫情之下我们还能坚持学习改变自己，我们每个人都值得一个大大的赞! 一年一度的报名即将开始，为了帮助大家更加高效的完成报考工作，特发起此次问卷调查，望各位同学认真填写完整，以防届时影响报考进度。点击下方按钮就可以填写信息就啦!</div>
          <el-button type="primary" round class="button" @click="urlClick">填写信息</el-button>
        </div>
    </div>
</template>

<script>
import { urlText } from '../../assets/js/common'
export default {
    name: 'url',
    data() {
        return {
           
        }
    },
    created() {
      
    },
    methods: {
      urlClick() {
        let href = urlText(Number(this.$route.params.id));
        window.open(href, '_blank');
      }
    },
    mounted() {
        
    }
}
</script>

<style lang="less" scoped>
    .main-area{
      width: 100vw;
      height: 100vh;
      background: #587cf7;
      .smoke{
        width: 100vw;
        position: relative;
        .text{
          width: 78%;
          left: 11%;
          font-size: .8rem;
          color: #3952CF;
          position: absolute;
          top: 38%;
          line-height: 1.9;
        }
        .button{
          width: 50%;
          height: 2rem;
          position: absolute;
          bottom: 16%;
          left: 25%;
          font-size: .82rem;
          line-height: .6rem;
          background: #6B8AF3;
        }
      }
    }
</style>

<style lang="less">
@media screen and (max-width: 1000px) {
  .sidebar-open{
    left: 0px !important;
  }
  .header-padding{
    padding-top: 0 !important;
  }
}
</style>