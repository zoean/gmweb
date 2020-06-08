<template>
  
  <div style="width: 900;">

    <div style="width: 50%;">
      1111
    </div>

    <div class="agree-right">
      2222
    </div>

  </div>

</template>

<script>
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
      let that = this;
      let url = "https://testapp.jhwx.com/lovestudy/api/agreement/GetAgreementDetail?param=" + "{'agrId':" + id + "}";
      var ajaxObj = new XMLHttpRequest();
      ajaxObj.open('get', url)
      ajaxObj.send();
      ajaxObj.onreadystatechange = function () {
      // 为了保证 数据 完整返回，我们一般会判断 两个值
          if (ajaxObj.readyState == 4 && ajaxObj.status == 200) {
              // 如果能够进到这个判断 说明 数据 完美的回来了,并且请求的页面是存在的
              // 5.在注册的事件中 获取 返回的 内容 并修改页面的显示
              // 数据是保存在 异步对象的 属性中
              let res = JSON.parse(ajaxObj.responseText);
              console.log(res.data.agreementDetail);
              this.agreementDetail = res.data.agreementDetail;
              const div = document.createElement('div');
              div.id = 'div-agree';
              div.innerHTML = res.data.agreementDetail.agrBody;
              document.getElementById("el-container").appendChild(div);
          }
      }
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