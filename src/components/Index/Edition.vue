<template>
  <div class="block">
    <el-page-header @back="goBack" class="title" content="更新日志">
    </el-page-header>

    <el-timeline>
      <el-timeline-item timestamp="v 1.1.41 -- 2020/11/20" placement="top">
        <el-card>
          <h4>新增功能</h4>
          <p>1、员工管理页面按入职时间倒序</p>
          <p>2、全部客户页面按领取时间倒序</p>
          <p>3、三日未联按最近一次联系时间正序</p>
          <p>4、坐席数据管理页面按领取时间倒序</p>
          <p>5、员工管理页面增加员工工号筛选项及分校字段</p>
        </el-card>
      </el-timeline-item>
      <el-timeline-item timestamp="v 1.1.40 -- 2020/11/19" placement="top">
        <el-card>
          <h4>新增功能</h4>
          <p>1、可领取公池数据页面增加释放人字段</p>
        </el-card>
      </el-timeline-item>
      <el-timeline-item timestamp="v 1.1.39 -- 2020/11/18" placement="top">
        <el-card>
          <h4>新增功能</h4>
          <p>1、我的学员页面增加复制手机号码按钮</p>
          <p>2、电话记录查询页面拨打时间筛选增加快捷键</p>
          <h4>修复bug</h4>
          <p>1、修复可领取公池数据页面渠道推广传值问题</p>
          <p>2、修复可领取公池数据页面地区框显示不全问题</p>
        </el-card>
      </el-timeline-item>
      <el-timeline-item timestamp="v 1.1.38 -- 2020/11/17" placement="top">
        <el-card>
          <h4>新增功能</h4>
          <p>1、组织架构筛选支持可搜索</p>
          <p>2、生成推广链接增加头条链接</p>
          <h4>修复bug</h4>
          <p>1、修复QQ浏览器复制失败bug</p>
        </el-card>
      </el-timeline-item>
      <el-timeline-item timestamp="v 1.1.37 -- 2020/11/13" placement="top">
        <el-card>
          <h4>新增功能</h4>
          <p>1、溢出池数据管理页面新增订单数量</p>
        </el-card>
      </el-timeline-item>
      <el-timeline-item timestamp="v 1.1.36 -- 2020/11/12" placement="top">
        <el-card>
          <h4>新增功能</h4>
          <p>1、个人线索、主管线索页面新增分配组筛选项</p>
          <p>2、可领取公池数据页面新增入库时间筛选、最近联系时间筛选项</p>
          <p>3、分配组每日上限支持设置0</p>
          <p>4、手机号搜索支持后模糊搜索</p>
        </el-card>
      </el-timeline-item>
      <el-timeline-item timestamp="v 1.1.35 -- 2020/11/06" placement="top">
        <el-card>
          <h4>新增功能</h4>
          <p>1、新增销售新建客户功能</p>
          <p>2、代报考增加考期管理</p>
          <p>3、优化已成单页面上下滚动</p>
          <p>4、搜索手机号自动去除空格</p>
          <p>5、溢出池搜索区域间距优化</p>
          <p>6、数据权限页面员工分校编辑UI优化</p>
          <h4>修复bug</h4>
          <p>1、修复主管年目标、公司目标loading Bug</p>
        </el-card>
      </el-timeline-item>
      <el-timeline-item timestamp="v 1.1.34 -- 2020/11/04" placement="top">
        <el-card>
          <h4>新增功能</h4>
          <p>1、新增菜单排序功能</p>
          <p>2、坐席数据管理页面UI优化</p>
          <p>3、员工编辑页面编辑信息后返回带搜索条件</p>
          <p>4、主管目标、公司目标增加搜索条件不为空验证</p>
          <h4>修复bug</h4>
          <p>1、修复坐席管理页面列表横向滚动bug</p>
          <p>2、修复主管目标、公司目标loading Bug</p>
        </el-card>
      </el-timeline-item>
      <el-timeline-item timestamp="v 1.1.33 -- 2020/10/28" placement="top">
        <el-card>
          <h4>新增功能</h4>
          <p>1、发短信名单确认页面增加总人数</p>
          <p>2、新增线索检索页面</p>
          <p>3、全部客户页面增加满库提示</p>
          <p>4、可领取公海数据页面增加推广渠道筛选项</p>
          <p>5、报考员管理页面怎加报考员筛选项</p>
          <p>6、报考员管理增加审核失败原因筛选</p>
          <p>7、客户信息页面增加备注记录</p>
          <p>8、坐席数据管理页面增加成单状态筛选项</p>
          <p>9、个人线索页面、主管线索页面增加拨通/拨打字段</p>
          <p>10、跟进信息添加后再次打开显示最新一次记录</p>
          <p>11、群发短信菜单名称改成短信记录</p>
          <h4>修复bug</h4>
          <p>1、修复基础管理菜单配置bug</p>
          <p>2、修复菜单管理页面修改菜单菜单类型回显是数字bug</p>
          <p>3、修复一级菜单刷新bug</p>
        </el-card>
      </el-timeline-item>
      <el-timeline-item timestamp="v 1.1.32 -- 2020/10/27" placement="top">
        <el-card>
          <h4>新增功能</h4>
          <p>1、销售看板，销售主管看板新增工作明细模块</p>
        </el-card>
      </el-timeline-item> 
      <el-timeline-item timestamp="v 1.1.31 -- 2020/10/23" placement="top">
        <el-card>
          <h4>新增功能</h4>
          <p>1、下次联系时间改为非必填</p>
          <p>2、推广链接记录页面推广账号改成支持可输入筛选</p>
          <p>3、客户信息增加订单记录</p>
          <p>4、客户信息跟进记录优化显示</p>
          <p>5、电话记录查询增加时长筛选项</p>
          <h4>修复bug</h4>
          <p>1、销售部分修复数值准确性</p>
        </el-card>
      </el-timeline-item>
      <el-timeline-item timestamp="v 1.1.30 -- 2020/10/22" placement="top">
        <el-card>
          <h4>新增功能</h4>
          <p>1、新增今日首咨页面</p>
          <p>2、优化可领取公海数据显示逻辑</p>
        </el-card>
      </el-timeline-item>
      <el-timeline-item timestamp="v 1.1.29 -- 2020/10/21" placement="top">
        <el-card>
          <h4>新增功能</h4>
          <p>1、新增批量导入数据权限</p>
          <p>2、分配组设置增加分校权限管理</p>
          <h4>修复bug</h4>
          <p>1、修复回收池页面请求超时问题</p>
          <p>2、修复回收池页面分配至人渲染问题</p>
          <p>3、修改个人线索页面、主管线索页面线索转移人员范围</p>
        </el-card>
      </el-timeline-item>
      <el-timeline-item timestamp="v 1.1.28 -- 2020/10/20" placement="top">
        <el-card>
          <h4>新增功能</h4>
          <p>1、员工管理页面是否在职默认选中在职</p>
          <p>2、主管线索和个人线索页面入库时间默认时间调整为当日0:00:00-23:59:59</p>
          <h4>修复bug</h4>
          <p>1、修复主管线索、个人线索考试项目筛选未起作用问题</p>
        </el-card>
      </el-timeline-item>
      <el-timeline-item timestamp="v 1.1.27 -- 2020/10/19" placement="top">
        <el-card>
          <h4>新增功能</h4>
          <p>1、销售主管看板增加统计字段和各自段排序</p>
          <p>2、今日联系、三日未联、已注册、可领取公池数据页面新增备注字段</p>
        </el-card>
      </el-timeline-item>
      <el-timeline-item timestamp="v 1.1.26 -- 2020/10/16" placement="top">
        <el-card>
          <h4>新增功能</h4>
          <p>1、增加批量导入功能</p>
          <p>2、坐席数据管理页面增加成单状态、线索状态字段</p>
          <p>3、全部客户页面增加线索状态字段</p>
          <h4>修复bug</h4>
          <p>1、优化溢出池/回收池，无法分配到坐席名下的提示语</p>
          <p>2、优化主管线索、个人线索分配至人的弹框</p>
          <p>3、修复电话记录查询时间筛选项</p>
        </el-card>
      </el-timeline-item>
      <el-timeline-item timestamp="v 1.1.25 -- 2020/10/15" placement="top">
        <el-card>
          <h4>新增功能</h4>
          <p>1、增加个人线索、主管线索删除功能</p>
          <p>2、增加线索回收站页面</p>
          <p>3、全部客户页面是否成单筛选项默认选中未成单</p>
          <p>4、电话记录查询页面时间筛选项默认选中近30天</p>
          <p>5、增加用户使用教程入口</p>
          <p>6、个人线索、主管线索增加线索转移功能</p>
          <h4>修复bug</h4>
          <p>1、修复短信内容记录页面滑动问题</p>
          <p>2、修复员工列表显示问题</p>
          <p>3、修复全部客户、主管线索列表中的数据半屏展示问题</p>
          <p>4、修复分配引擎切换页码无数据问题</p>
          <p>5、修复员工列表编辑后无数据问题</p>
          <p>6、优化已成单订单列表页面的显示</p>
        </el-card>
      </el-timeline-item>
      <el-timeline-item timestamp="v 1.1.24 -- 2020/10/12" placement="top">
        <el-card>
          <h4>新增功能</h4>
          <p>1、UI优化</p>
          <p>2、可领取公海数据时间相关字段增加排序功能</p>
          <p>3、录入线索支持多种链接格式</p>
          <p>4、优化菜单栏收起按钮展示</p>
          <p>5、页面增加页面名称</p>
        </el-card>
      </el-timeline-item>
      <el-timeline-item timestamp="v 1.1.23 -- 2020/09/23" placement="top">
        <el-card>
          <h4>新增功能</h4>
          <p>1、通话弹框新增手机号码归属地</p>
          <h4>修复bug</h4>
          <p>1、banner的UI调整</p>
          <p>2、坐席线索管理页面转移线索功能优化</p>
        </el-card>
      </el-timeline-item> 
      <el-timeline-item timestamp="v 1.1.22 -- 2020/09/22" placement="top">
        <el-card>
          <h4>新增功能</h4>
          <p>1、坐席数据管理新增线索转移</p>
          <p>2、推广配置页面配置组员弹框增加今日已分字段</p>
        </el-card>
      </el-timeline-item> 
      <el-timeline-item timestamp="v 1.1.21 -- 2020/09/22" placement="top">
        <el-card>
          <h4>修复bug</h4>
          <p>1、修复添加备注页面操作失败的bug</p>
          <p>2、我的工作台模块页面取消客户信息入口</p>
          <p>3、修复系统复制功能在浏览器方面的兼容性问题</p>
        </el-card>
      </el-timeline-item>
      <el-timeline-item timestamp="v 1.1.20 -- 2020/09/21" placement="top">
        <el-card>
          <h4>新增功能</h4>
          <p>1、去掉全部客户页面客户信息按钮</p>
          <p>2、增加溢出池数据自动分配功能</p>
          <p>3、客户信息弹框手机号码增加复制电话号码按钮、手机外呼按钮、座机外呼按钮、释放数据按钮</p>
          <p>4、优化左侧菜单栏UI</p>
          <p>5、录入线索数据与JQ系统数据排重</p>
          <p>6、增加默认权限</p>
          <p>7、员工信息页面员工手机号规则隐藏</p>
        </el-card>
      </el-timeline-item> 
      <el-timeline-item timestamp="v 1.1.19 -- 2020/09/16" placement="top">
        <el-card>
          <h4>新增功能</h4>
          <p>1、优化login登录页</p>
          <p>2、优化销售看板在Safari浏览器下的布局兼容性问题</p>
          <h4>修复bug</h4>
          <p>1、修复了首咨释放功能</p>
        </el-card>
      </el-timeline-item> 
      <el-timeline-item timestamp="v 1.1.18 -- 2020/09/15" placement="top">
        <el-card>
          <h4>新增功能</h4>
          <p>1、优化通话弹窗UI</p>
          <p>2、全部客户新增公海数据批量释放功能</p>
          <p>3、主管线索和个人线索页面新增推广落地页字段</p>
          <p>4、微信管理页面组织架构筛选替换筛选项</p>
          <p>5、新增南昌分校</p>
        </el-card>
      </el-timeline-item> 
      <el-timeline-item timestamp="v 1.1.17 -- 2020/09/11" placement="top">
        <el-card>
          <h4>新增功能</h4>
          <p>1、修改推广线索归属逻辑</p>
          <p>2、录音下载组件功能优化</p>
          <p>3、今日流水统一修改为保留两位小数</p>
          <p>4、销售看板、销售主管看板目标进度UI优化</p>
          <p>5、座机外呼弹框UI优化</p>
          <h4>修复bug</h4>
          <p>1.修复已成单订单页面的筛选项问题</p>
          <p>2.修复通时明细页面的日期筛选问题</p>
          <p>3.修复回首池、溢出池组织架构不显示问题</p>
        </el-card>
      </el-timeline-item> 
      <el-timeline-item timestamp="v 1.1.16 -- 2020/09/08" placement="top">
        <el-card>
          <h4>修复bug</h4>
          <p>1、优化数据权限响应速度</p>
          <p>2、优化数据看板响应速度</p>
          <p>3、退出功能优化</p>
        </el-card>
      </el-timeline-item> 
      <el-timeline-item timestamp="v 1.1.15 -- 2020/09/07" placement="top">
        <el-card>
          <h4>新增功能</h4>
          <p>1、个人线索页面、主管线索页面新增导出功能</p>
          <p>2、优化不同尺寸显示器显示效果</p>
          <h4>修复bug</h4>
          <p>1、通话详情页面样式优化</p>
        </el-card>
      </el-timeline-item>   
      <el-timeline-item timestamp="v 1.1.14 -- 2020/09/03" placement="top">
        <el-card>
          <h4>新增功能</h4>
          <p>1、主管线索页面增加列表字段及筛选项</p>
          <p>2、个人线索页面增加列表字段及筛选项</p>
          <p>3、优化销售主管看板通话明细弹框显示及数据准确性</p>
          <p>4、全部客户页面，导入成单数据去掉高亮显示</p>
          <h4>修复bug</h4>
          <p>1、修复优化座机外拨通话弹框</p>
        </el-card>
      </el-timeline-item>
      <el-timeline-item timestamp="v 1.1.13 -- 2020/09/02" placement="top">
        <el-card>
          <h4>新增功能</h4>
          <p>1、增加坐席拨打弹框</p>
          <p>2、增加员工管理页面搜索条件缓存</p>
          <h4>修复bug</h4>
          <p>1、修复通话记录audio缓存bug</p>
          <p>2、修复数据看板超额完成目标的百分比显示</p>
        </el-card>
      </el-timeline-item>
      <el-timeline-item timestamp="v 1.1.12 -- 2020/08/31" placement="top">
        <el-card>
          <h4>新增功能</h4>
          <p>1、增加销售目标管理功能模块</p>
          <p>2、优化新增微信数量页面UI</p>
        </el-card>
      </el-timeline-item>
      <el-timeline-item timestamp="v 1.1.11 -- 2020/08/27" placement="top">
        <el-card>
          <h4>新增功能</h4>
          <p>1、修改推广配置页面一键分配显示逻辑</p>
          <p>2、发短信功能入口从我的学员页面调整到所辖学员页面</p>
          <p>3、客户信息录录音组件替换</p>
          <p>4、销售跟进备注改为限制300字以内</p>
          <p>5、全部客户页面备注字段列表显示字数限制，鼠标移入折行显示全部内容</p>
        </el-card>
      </el-timeline-item>
      <el-timeline-item timestamp="v 1.1.10 -- 2020/08/24" placement="top">
        <el-card>
          <h4>新增功能</h4>
          <p>1、全部客户页面新增成单状态字段，新增意向等级、成单状态筛选项</p>
          <p>2、全部客户页面增加【意向等级】筛选项</p>
          <p>3、坐席数据管理页面增加【所属坐席】、【意向等级】筛选项</p>
          <p>4、坐席管理页面增加数据按进入时间筛选选项卡</p>
          <p>5、个人线索和主管线索页面入库时间默认当天时间00:00:00-23:59:59</p>
          <p>6、个人线索和主管线索页面入库时间筛选器上增加今日、近7天、本月、近30天快捷键</p>
          <h4>修复bug</h4>
          <p>1、修复复制电话号码bug</p>
          <p>2、修复选项卡时间组件转化时间戳的bug</p>
        </el-card>
      </el-timeline-item>
      <el-timeline-item timestamp="v 1.1.9 -- 2020/08/23" placement="top">
        <el-card>
          <h4>新增功能</h4>
          <p>1、保存备注由跳转到跟进记录改为原列表</p>
          <h4>修复bug</h4>
          <p>1、优化数据筛选选项卡卡顿问题</p>
          <p>2、解决点击复制手机号码按钮重复点击问题</p>
        </el-card>
      </el-timeline-item>
      <el-timeline-item timestamp="v 1.1.8 -- 2020/08/21" placement="top">
        <el-card>
          <h4>新增功能</h4>
          <p>1、分配上限由各分配组公用一个上限改为所在分配组上限之和</p>
          <h4>修复bug</h4>
          <p>1、修复考试项目数据的回显问题</p>
          <p>2、修复生成推广链接的id</p>
        </el-card>
      </el-timeline-item>
      <el-timeline-item timestamp="v 1.1.7 -- 2020/08/19" placement="top">
        <el-card>
          <h4>新增功能</h4>
          <p>1、微信管理页面增加合计功能和字段排序功能</p>
          <h4>修复bug</h4>
          <p>1、修复全部客户页面搜索查询bugg</p>
        </el-card>
      </el-timeline-item>
      <el-timeline-item timestamp="v 1.1.6 -- 2020/08/14" placement="top">
        <el-card>
          <h4>新增功能</h4>
          <p>1、完善销售看板数据</p>
          <p>2、完善销售主管看板数据</p>
          <h4>修复bug</h4>
          <p>1、修复了一键复制手机号码在Safari浏览器下的兼容性bug</p>
        </el-card>
      </el-timeline-item>
      <el-timeline-item timestamp="v 1.1.5 -- 2020/08/11" placement="top">
        <el-card>
          <h4>新增功能</h4>
          <p>1、增加销售个人通时明细</p>
        </el-card>
      </el-timeline-item>
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
      width: 70%;
      margin: 20px auto 0;
      margin-left: 20%;
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