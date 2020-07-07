<template>

</template>

<script>
import { GetAgreementDetail } from '../../request/api';
import { timestampToTime, classTypeString, orderTypeText, smoke_MJ_4, smoke_MJ_5, sortTextNum, copyData, removeEvery } from '../../assets/js/common';
export default {
  name: 'agreeMentDetails',
  data() {
    return {
      agreementDetail: {}
    }
  },
  created() {
    this.agreeMentDetails(this.$route.query.id);
  },
  methods: {
    agreeMentDetails(id) {

      this.$smoke_get(GetAgreementDetail, {
        param: {agrId: id}
      }).then(res => {
        if(res.status == 0) {
          res.data.agreementDetail.addTime = timestampToTime(res.data.agreementDetail.addTime);
          this.agreementDetail = res.data.agreementDetail;
          const div1 = document.createElement('div');
          div1.id = 'div-agree';
          div1.innerHTML = res.data.agreementDetail.agrBody;
          document.getElementById("app").appendChild(div1);
          const div2 = document.createElement('div');
          div2.id = 'div-zhang';
          div2.innerHTML = "<div style='width: 900px; font-size: 16px; height: 230px; margin: 0 auto; margin-bottom: 40px;'>" + 
          "<div style='position: relative; width:450px; height: 230px; float: left;'>" + 
          "<div style='position: absolute; top: 80px;'>甲方（盖章）：" + res.data.agreementDetail.jiaFangName + "</div>" + 
          "<div style='position: absolute; bottom: 0;'>日期：" + res.data.agreementDetail.addTime + "</div>" + 
          "<div><img src='" + res.data.agreementDetail.sealUrl + "' alt='' width='200' height='200' style='position: absolute; top: 0; border:none'></div></div>" + 
          "<div style='position: relative; width:450px; height: 230px; float: right;'>" + 
          "<div style='position: absolute; bottom: 130px;'>乙方（签字）：" + res.data.agreementDetail.userName + "</div>" + 
          "<div style='position: absolute; bottom: 60px;'>乙方身份证号码：" + res.data.agreementDetail.cardId + "</div>" + 
          "<div style='position: absolute; bottom: 0;'>日期：" + res.data.agreementDetail.addTime + "</div>" + 
          "</div></div>";
          document.getElementById("app").appendChild(div2);
        }
      })
    }
  },
  mounted() {
    
  }
}
</script>

<style lang="less">

  #div-agree {
    position: relative;
    top: -40px;
    width: 900px;
    margin: 0 auto;
    
    p {
      line-height: 200%;
      font-size: 16px!important;
      font-family: '微软雅黑'!important;
      strong {
        font-weight: bold;
      }
      span {
        line-height: 200%;
        font-size: 16px!important;
        font-family: '微软雅黑'!important;
        strong {
          font-weight: bold;
        }
      }
    }
  }

  

</style>