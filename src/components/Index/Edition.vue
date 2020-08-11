<template>
  <div class="block">
    <el-page-header @back="goBack" class="title" content="更新日志">
    </el-page-header>
    <el-timeline>
      <el-timeline-item timestamp="v 1.1.4 -- 2020/08/11" placement="top">
        <el-card>
          <h4>修复bug</h4>
          <p>1、修复微信管理页面的组织架构筛选</p>
          <p>2、修复微信管理页面的筛选数据显示</p>
          <p>3、修复微信管理页面的时间筛选</p>
        </el-card>
      </el-timeline-item>
      
      <el-timeline-item timestamp="v 1.1.3 -- 2020/08/07" placement="top">
        <el-card>
          <h4>新增功能</h4>
          <p>1、增加记录坐席添加客户微信数量功能</p>
          <p>2、修改协议入口位置及内容展示样式</p>
          <p>3、所辖学员页面列表去掉分校字段</p>
          <p>4、代报考管理页面增加分配时间段筛选项</p>
        </el-card>
      </el-timeline-item>
      <el-timeline-item timestamp="v 1.1.2 -- 2020/08/04" placement="top">
        <el-card>
          <h4>新增功能</h4>
          <p>1、我的学员页面增加“报考省份”的筛选</p>
          <p>2、学员详情-课程列表增加课程有效期</p>
          <p>3、用户id的筛选</p>
          <p>4、所辖学员页面增加“成单平台字段”</p>
          <p>5、新学员管理增加拨打电话功能</p>
          <h4>修复bug</h4>
          <p>1、开班监控和回访监控的显示bug</p>
          <p>2、修复新学员管理报名时间筛选bug</p>
        </el-card>
      </el-timeline-item>
      <el-timeline-item timestamp="v 1.1.1 -- 2020/08/03" placement="top">
        <el-card>
          <h4>新增功能</h4>
          <p>1、修改中药师、西药师收集信息内容</p>
          <p>2、报考员管理页面新增批量转移功能</p>
          <h4>修复bug</h4>
          <p>1、优化教务统计页面展示效果</p>
          <p>2、修改报考管理转移学员bug</p>
        </el-card>
      </el-timeline-item>
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
        padding: 10px 20px 20px 20px !important;
      }
      h4{
        margin-top: 10px;
        margin-bottom: 6px;
      }
    }
</style>