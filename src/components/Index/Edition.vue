<template>
  <div class="block">
    <el-page-header @back="goBack" class="title" content="更新日志">
    </el-page-header>
    <el-timeline>
      <el-timeline-item timestamp="v 1.1.0 -- 2020/07/31" placement="top">
        <el-card>
          <h4>新增功能</h4>
          <p>1、增加坐席根据线索入库时间对线索进行分类</p>
          <p>2、回收池线索管理页面增加线索属性</p>
          <p>3、可领取公池数据页面增加线索属性</p>
          <p>4、电话记录查询页面增加筛选项</p>
          <p>5、代报考学员管理页面增加批量分配功能</p>
          <p>6、增加坐席对今日数据联系情况标记功能</p>
          <p>7、优化教务统计页面数据展示，增加今日数据</p>
          <p>8、优化教务统计页面展示效果</p>
          <p>9、增加回访及时度页面</p>
          <p>10、增加回访监控页面</p>
          <p>11、增加版本记录页面</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
export default {
    name: 'Edition',
    data() {
        return {
           
        }
    },
    created() {
        
    },
    methods: {
      goBack() {
        this.$router.go(-1);
      }
    },
    mounted() {
        
    }
}
</script>

<style lang="less">
    .block{
      .title{
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 20px;
      }
      .el-timeline-item__timestamp{
        font-size: 16px;
      } 
      .el-timeline-item__content{
        margin-top: 20px;
        width: 80%;
      }
      .el-card__body{
        padding: 20px !important;
      }
      h4{
        margin-bottom: 10px;
      }
    }
</style>