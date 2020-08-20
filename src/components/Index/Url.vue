<template>
    <div class="main-area">
        <div class="smoke">
          <el-image :src="require('../../assets/images/message.png')" style="width: 100%;"></el-image>
          <div class="text" ref="text"></div>
        </div>
    </div>
</template>

<script>
import { textUrl } from '../../assets/js/common';
import { getUrlMsg } from '../../request/api';
export default {
    name: 'url',
    data() {
        return {
           messageData: {}
        }
    },
    created() {
      this.getUrlMsg();
    },
    methods: {
      getUrlMsg() {
        this.$smoke_get(getUrlMsg + `/` + this.$route.params.id, {}).then(res => {
          if(res.code == 200) {
            this.messageData = res.data;
            this.$refs.text.innerHTML = textUrl(this.messageData.msg);
          }
        })
      }
    },
    mounted() {
        
    },
    watch: {
      '$route.params.id'(val){
        this.getUrlMsg();
      }
    }
}
</script>

<style lang="less" scoped>
    .main-area{
      width: 100vw;
      .smoke{
        width: 100vw;
        .text{
          width: 100vw;
          background: #fff;
          padding: 20px;
          font-size: .8rem;
          color: #333;
          line-height: 1.9;
          word-break:break-all;
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