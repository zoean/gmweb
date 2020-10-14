
// 基础模块接口
export const getSeatDataVolume = '/api/phone/clueData/getSeatDataVolume'
export const getUserDetailedList = '/api/basicApp/getUserDetailedList'; //获取员工详情信息集合
export const getUserLoginMessage = '/api/basicApp/getUserLoginMessage'; //获取员工信息
export const getOrgUserBasic = '/api/basicApp/getOrgUserBasic'; //获取组织对应的员工信息
export const getUserDetailed = '/api/basicApp/getUserDetailed'; //获取员工详情信息
export const exportUserDetailedList = '/api/basicApp/exportUserDetailedList'; //导出员工详情信息集合
export const login = '/api/login'; //用户登录
export const logOut = '/api/logOut'; //登出
export const getUserByToken = '/api/user/getUserByToken'; //获取员工信息
export const updateUserPassword = '/api/user/updateUserPassword'; //修改员工密码
export const getUserByNameAndAccountNumber = '/api/user/getUserByNameAndAccountNumber'; //获取员工信息根据姓名和账号
export const getUserByRoleUuid = '/api/user/getUserByRoleUuid'; //获取员工信息根据角色
export const insertRoleAndUserRelation = '/api/user/insertRoleAndUserRelation'; //新增角色和员工的关系
export const deleteRoleAndUserRelation = '/api/user/deleteRoleAndUserRelation'; //删除角色和员工的关系
export const updateUser = '/api/user/updateUser'; //修改员工信息
export const addUserJqUser = '/api/user/addUserJqUser'; //创建员工关联的jq用户信息
export const loginPlatform = '/api/user/loginPlatform'; //一键登录
export const forgetPassword = '/api/user/forgetPassword'; //员工忘记密码
export const getRoleList = '/api/role/getRoleList'; //获取所有角色信息
export const getRoleMenuList = '/api/role/getRoleMenuList'; //获取角色的菜单信息
export const addRoleMenuRelation = '/api/role/addRoleMenuRelation'; //新建角色和菜单的关系
export const addRole = '/api/role/addRole'; //新增角色
export const updateRole = '/api/role/updateRole'; //修改角色
export const deleteRole = '/api/role/deleteRole'; //删除角色
export const getRoleDetailedList = '/api/role/getRoleDetailedList'; //获取所有角色组（包含角色）信息
export const getOrgSubsetByUuid = '/api/org/getOrgSubsetByUuid'; //查询组织信息（包含子集）
export const addMenu = '/api/menu/addMenu'; //新增菜单
export const deleteMenu = '/api/menu/deleteMenu'; //删除菜单
export const getMenuSubsetByUuid = '/api/menu/getMenuSubsetByUuid'; //查询菜单信息（包含子集）
export const getMenuDetailsSubsetByUuid = '/api/menu/getMenuDetailsSubsetByUuid'; //查询菜单详情信息（包含子集）
export const updateMenu = '/api/menu/updateMenu'; //修改菜单
export const itemList = '/api/phone/pageFieldsMag/itemList'; //页面枚举列表
export const getProfile = '/api/user/getProfile'; //获取个人资料
export const upProfile = '/api/user/upProfile'; //获取个人资料
export const sendDingVerCode = '/api/user/sendDingVerCode'; //发送钉钉验证码

// JQ接口
export const phoneUserList = '/api/phone/phoneUserList'; //获取jq的员工信息
export const countCallRecord = '/api/phone/countCallRecord'; //统计通话记录
export const getCallRecord = '/api/phone/getCallRecord'; //获取通话记录
export const getJqAccountNumberList = '/api/phone/getJqAccountNumberList'; //获取jq的账号信息集合 (get)

// 知识体系接口
export const addClassify = '/api/knowledgeSystem/classify/addClassify'; //新增分类接口
export const deleteClassifyByUuid = '/api/knowledgeSystem/classify/deleteClassifyByUuid'; //删除分类接口
export const getClassifyByUuid = '/api/knowledgeSystem/classify/getClassifyByUuid'; //获取分类信息
export const getClassifyByParentUuid = '/api/knowledgeSystem/classify/getClassifyByParentUuid'; //获取子分类信息列表
export const updateClassify = '/api/knowledgeSystem/classify/updateClassify'; //更新分类接口
export const sortNumber1 = '/api/knowledgeSystem/classify/sortNumber'; //分类移动位置

export const addExamDirection = '/api/knowledgeSystem/examDirection/addExamDirection'; //新增考试项目
export const deleteExamDirectionByUuid = '/api/knowledgeSystem/examDirection/deleteExamDirectionByUuid'; //删除考试项目
export const getExamDirectionByUuid = '/api/knowledgeSystem/examDirection/getExamDirectionByUuid'; //获取考试项目信息
export const updateExamDirection = '/api/knowledgeSystem/examDirection/updateExamDirection'; //更新考试项目
export const sortNumber2 = '/api/knowledgeSystem/examDirection/sortNumber'; //考试项目移动位置
export const addExamAndSubjectRelation = '/api/knowledgeSystem/examDirection/addExamAndSubjectRelation'; //新增考试项和科目的关系
export const deleteExamAndSubjectRelation = '/api/knowledgeSystem/examDirection/deleteExamAndSubjectRelation'; //删除考试项和科目的关系
export const getExamAndSubjectRelation = '/api/knowledgeSystem/examDirection/getExamAndSubjectRelation'; //查询考试项和科目的关系
export const updateExamAndSubjectRelation = '/api/knowledgeSystem/examDirection/updateExamAndSubjectRelation'; //更新考试项和科目的关系
export const sortNumberSubjectRelation = '/api/knowledgeSystem/examDirection/sortNumberSubjectRelation'; //科目关系移动位置
export const getExamBasic = '/api/knowledgeSystem/examDirection/getExamBasic'; //查询考试项基本信息
export const getSubjectBasicByExamUuid = '/api/knowledgeSystem/examDirection/getSubjectBasicByExamUuid'; //查询科目基本信息根据考试项唯一标识

export const addExamCategory = '/api/knowledgeSystem/examDirection/addExamCategory'; //新增考试项品类
export const updateExamCategory = '/api/knowledgeSystem/examDirection/updateExamCategory'; //更新考试项品类
export const getExamCategoryByExamUuid = '/api/knowledgeSystem/examDirection/getExamCategoryByExamUuid'; //获取考试项品类根据考试项唯一标识
export const getExamCategoryByUuid = '/api/knowledgeSystem/examDirection/getExamCategoryByUuid'; //获取考试项品类根据唯一标识
export const deleteExamCategory = '/api/knowledgeSystem/examDirection/deleteExamCategory'; //删除考试项品类

export const addSubject = '/api/knowledgeSystem/subject/addSubject'; //新增科目
export const deleteSubject = '/api/knowledgeSystem/subject/deleteSubject'; //删除科目
export const getSubjectByName = '/api/knowledgeSystem/subject/getSubjectByName'; //获取科目信息根据科目名称
export const updateSubject = '/api/knowledgeSystem/subject/updateSubject'; //更新科目
export const getSubjectByUuid = '/api/knowledgeSystem/subject/getSubjectByUuid'; //获取科目信息根据uuid

export const addSubjectCatalogue = '/api/knowledgeSystem/subjectCatalogue/addSubjectCatalogue' //新增科目目录
export const deleteSubjectCatalogueByUuid = '/api/knowledgeSystem/subjectCatalogue/deleteSubjectCatalogueByUuid' //删除科目目录
export const sortNumber3 = '/api/knowledgeSystem/subjectCatalogue/sortNumber' //科目目录移动位置
export const updateSubjectCatalogue = '/api/knowledgeSystem/subjectCatalogue/updateSubjectCatalogue' //更新科目目录
export const getSubjectCatalogueByParentUuid = '/api/knowledgeSystem/subjectCatalogue/getSubjectCatalogueByParentUuid' //获取目录的子目录信息
export const getSubjectCatalogueByUuid = '/api/knowledgeSystem/subjectCatalogue/getSubjectCatalogueByUuid' //获取科目目录信息

export const addKnowledgePoints = '/api/knowledgeSystem/knowledgePoints/addKnowledgePoints' //新增知识点
export const deleteKnowledgePoints = '/api/knowledgeSystem/knowledgePoints/deleteKnowledgePoints' //删除知识点
export const getKnowledgePointsByCatalogueUuid = '/api/knowledgeSystem/knowledgePoints/getKnowledgePointsByCatalogueUuid' //获取知识点根据科目目录uuid
export const getKnowledgePointsByUuid = '/api/knowledgeSystem/knowledgePoints/getKnowledgePointsByUuid' //获取知识点根据uuid
export const sortNumber4 = '/api/knowledgeSystem/knowledgePoints/sortNumber' //知识点移动位置
export const updateKnowledgePoints = '/api/knowledgeSystem/knowledgePoints/updateKnowledgePoints' //更新知识点

export const getKnowledgeStructure = '/api/knowledgeSystem/knowledge/getKnowledgeStructure'; //获取知识体系结构
export const getSubjectByExamUuidAndName = '/api/knowledgeSystem/knowledge/getSubjectByExamUuidAndName'; //获取科目根据考试项和科目名称
export const getSubjectCatalogueBySubjectUuid = '/api/knowledgeSystem/knowledge/getSubjectCatalogueBySubjectUuid'; //获取科目目录信息（包含子集）
export const getCatalogueAndKnowBySubjectUuid = '/api/knowledgeSystem/knowledge/getCatalogueAndKnowBySubjectUuid'; //获取知识点信息List
export const getCatalogueKnowBasicBySubjectUuid = '/api/knowledgeSystem/knowledge/getCatalogueKnowBasicBySubjectUuid'; //获取科目目录和知识点的基本信息

export const addCourseVideo = '/api/knowledgeSystem/courseVideo/addCourseVideo'; //新增课程视频
export const getCourseVideoByUuid = '/api/knowledgeSystem/courseVideo/getCourseVideoByUuid'; //获取课程视频根据唯一标识
export const getCourseVideoList = '/api/knowledgeSystem/courseVideo/getCourseVideoList'; //获取课程视频列表
export const updateCourseVideo = '/api/knowledgeSystem/courseVideo/updateCourseVideo'; //更新课程视频
export const deleteCourseVideoByUuid = '/api/knowledgeSystem/courseVideo/deleteCourseVideoByUuid'; //删除课程视频
export const uploadimg = '/api/knowledgeSystem/courseVideo/uploadimg'; //文件上传
export const getFileSize = '/api/knowledgeSystem/courseVideo/getFileSize'; //获取文件大小 

// 通话数据权限分配
export const addDataAllocationRules = '/api/phone/DataAutDis/addDataAllocationRules'; //新增数据分配组
export const deleteDataAllocationRules = '/api/phone/DataAutDis/deleteDataAllocationRules'; //删除数据分配组
export const getDataAllocationRulesByUuid = '/api/phone/DataAutDis/getDataAllocationRulesByUuid'; //获取数据分配组详情
export const getDataAllocationRulesList = '/api/phone/DataAutDis/getDataAllocationRulesList'; //获取数据分配组集合
export const getDataAllocationStaff = '/api/phone/DataAutDis/getDataAllocationStaff'; //获取数据分配人员信息
export const updateDataAllocationRules = '/api/phone/DataAutDis/updateDataAllocationRules'; //更新数据分配组
export const updateDataAllocationStaff = '/api/phone/DataAutDis/updateDataAllocationStaff'; //更新数据分配人员
export const getDataAllocationUpperLimit = '/api/phone/DataAutDis/getDataAllocationUpperLimit'; //获取数据分配上限信息
export const oneKeyDistribution = '/api/phone/DataAutDis/oneKeyDistribution'; //一键分配线索数据
export const updateDataAllocationUpperLimit = '/api/phone/DataAutDis/updateDataAllocationUpperLimit'; //更新数据分配上线
export const getDataAllocationStaffList = '/api/phone/DataAutDis/getDataAllocationStaffList'; //获取数据分配人员集合
export const deleteDataAllocationStaff = '/api/phone/DataAutDis/deleteDataAllocationStaff'; //移除数据分配人员
export const getUpperLimitList = '/api/phone/DataAutDis/getUpperLimitList'; //获取人员数据分配上限集合
export const addRuleUserAndLimit = '/api/phone/DataAutDis/addRuleUserAndLimit'; //添加规则下人员和已分配上限信息
export const getRuleUserStructureLimit = '/api/phone/DataAutDis/getRuleUserStructureLimit'; //获取规则下人员结构和已分配上限信息
export const getRuleUserLimit = '/api/phone/DataAutDis/getRuleUserLimit'; //获取规则下人员分配上限信息
export const getRuleItem = '/api/phone/DataAutDis/getRuleItem'; //获取分配组项列表
export const getRuleItemAuth = '/api/phone/DataAutDis/getRuleItemAuth'; //获取分配组项列表（带权限）
export const getSchoolList = '/api/phone/DataAutDis/getSchoolList'; //获取分校集合
export const getPopularizeUrl = '/api/phone/DataAutDis/getPopularizeUrl'; //获取推广链接
export const popularizeUrl = '/api/phone/DataAutDis/popularizeUrl'; //生成推广链接

//线索数据
export const getClueDataByUserUuid = '/api/phone/clueData/getClueDataByUserUuid'; //获取员工的线索数据
export const getListField = '/api/phone/pageFieldsMag/getUserPageField';//获取页面字段
export const updateListField = '/api/phone/pageFieldsMag/upUserPageField';//更新页面字段排序、选中状态

export const getClueDataAll = '/api/phone/clueData/getClueDataAll'; //获取员工的全部客户
export const firstConDataList = '/api/phone/clueData/firstConDataList'; //获取员工的首咨线索数据
export const todayCallDataList = '/api/phone/clueData/todayCallDataList'; //获取员工今日联系的线索数据
export const threeDaysNoCallDataList = '/api/phone/clueData/threeDaysNoCallDataList'; //获取员工三日未联系的线索数据
export const clueDataRelease = '/api/phone/clueData/clueDataRelease'; //释放线索数据    
export const orderCallDataList = '/api/phone/clueData/orderCallDataList'; //获取员工成单的线索数据 
export const userOrderDataList = '/api/phone/clueData/userOrderDataList';//获取坐席名下订单列表
export const getOrderPayRecord = '/order-service/order/getOrderPayRecord';//获取订单支付记录
export const getClueDataDetails = '/api/phone/clueData/getClueDataDetails'; //获取线索数据详情    
export const getAllUserClueData = '/api/phone/clueData/getAllUserClueData'; //获取所有坐席线索数据    
export const getSpillPoolClueData = '/api/phone/clueData/getSpillPoolClueData'; //获取溢出池线索数据    
export const consumerCallDataList = '/api/phone/clueData/consumerCallDataList'; //获取用户线索列表数据    
export const getClueDataNumber = '/api/phone/clueData/getClueDataNumber'; //获取坐席的线索数量情况    
export const copyTel = '/api/phone/clueData/copyTel'; //复制手机号码    
export const entryClueData = '/api/phone/clueData/entryClueData'; //手动录入线索数据  
export const jqEntryClueData = '/jhservice/AddUser' //JQ系统客户入库
export const bulkImportClueData = '/api/phone/clueData/bulkImportClueData'; //批量导入线索数据    
export const getOrderCustomer = '/api/phone/clueData/getOrderCustomer'; //获取坐席的成单用户
export const geSeatWork = '/api/phone/clueData/geSeatWork'; //获取坐席的工作情况
export const clueContactSign = '/api/phone/clueData/clueContactSign'; //线索联系标记
export const getClueDatasStashList = '/api/phone/clueData/getClueDatasStashList';//线索数据回收列表
export const rollbackClueDatas = '/api/phone/clueData/rollbackClueDatas/';//线索数据还原

//外呼接口
export const getAdminUinToken = '/api/phone/outbound/getAdminUinToken'; //获取主账号token（9814692）
export const getUinOutConfigMessage = '/api/phone/outbound/getUinOutConfigMessage'; //获取坐席外呼配置信息
export const phoneOut = '/api/phone/outbound/phoneOut'; //手机外呼
export const seatOut = '/api/phone/outbound/seatOut'; //坐席外呼
export const phoneOutTea = '/api/phone/outbound/phoneOutTea'; //手机外呼（班主任）
export const seatOutTea = '/api/phone/outbound/seatOutTea'; //坐席外呼（班主任）

//Excel导入和导出
export const outExcelKnow = '/api/knowledgeSystem/knowExcel/outExcelKnow'; //知识点目录导出
export const outExcelSubject = '/api/knowledgeSystem/knowExcel/outExcelSubject'; //科目目录导出
export const readExcelSubject = '/api/knowledgeSystem/knowExcel/readExcelSubject'; //科目目录导入
export const readExcelKnow = '/api/knowledgeSystem/knowExcel/readExcelKnow'; //知识点导入

export const getRecoveryPoolDataList = '/api/phone/clueData/getRecoveryPoolDataList'; //获取回收池的线索数据
export const getUserRPCDList = '/api/phone/clueData/getUserRPCDList'; //获取待分配回收池线索数据
export const obtainRPCD = '/api/phone/clueData/obtainRPCD'; //员工获取回收池线索数据
export const getExteClueData = '/api/phone/clueData/getExteClueData'; //获取推广人员的线索数据
export const getExteAllClueData = '/api/phone/clueData/getExteAllClueData'; //获取推广人员的所有线索数据
export const deleteClueDatas = '/api/phone/clueData/deleteClueDatas/';//删除线索

//渠道管理
export const channelGetList = '/api/phone/channel/getList'; //渠道列表
export const channelAdd = '/api/phone/channel/add'; //渠道列表
export const channelDelete = '/api/phone/channel/delete'; //渠道列表
export const channelUpdate = '/api/phone/channel/update'; //渠道列表
export const channeGet = '/api/phone/channel/get'; //渠道列表

//线索备注
export const addClueDataNotes = '/api/phone/notes/addClueDataNotes'; //新增线索数据备注
export const getClueDataNotes = '/api/phone/notes/getClueDataNotes'; //线索数据备注列表
export const getClueDataNotesDetails = '/api/phone/notes/getClueDataNotesDetails'; //获取线索数据备注的详情信息
export const addClassTeaStuNotes = '/api/phone/notes/addClassTeaStuNotes'; //班主任新增学员备注
export const getClassTeaStuNotes = '/api/phone/notes/getClassTeaStuNotes'; //班主任学员备注列表

//枚举管理
export const addEnum = '/api/phone/dataDictionary/addEnum'; //新增枚举
export const addEnumItem = '/api/phone/dataDictionary/addEnumItem'; //新增枚举项
export const enumItemSort = '/api/phone/dataDictionary/enumItemSort'; //枚举项排序
export const getEnum = '/api/phone/dataDictionary/getEnum'; //获取枚举详情
export const getEnumItem = '/api/phone/dataDictionary/getEnumItem'; //获取枚举项列表
export const getEnumList = '/api/phone/dataDictionary/getEnumList'; //获取枚举列表
export const updateEnum = '/api/phone/dataDictionary/updateEnum'; //修改枚举
export const updateEnumItem = '/api/phone/dataDictionary/updateEnumItem'; //修改枚举项
export const enumByEnumNums = '/api/phone/dataDictionary/enumByEnumNums'; //根据枚举编号获取枚举列表

//页面字段管理
export const addPage = '/api/phone/pageFieldsMag/addPage';//新增页面
export const getPage = '/api/phone/pageFieldsMag/pageList';//获取页面列表
export const updatePage = '/api/phone/pageFieldsMag/updatePage';//更新页面信息
export const addField = '/api/phone/pageFieldsMag/addPageField';//新增字段
export const updateField = '/api/phone/pageFieldsMag/updatePageField';//更新字段
export const getField = '/api/phone/pageFieldsMag/pageFieldList';//字段列表
export const getFieldDetail = '/api/phone/pageFieldsMag/pageFieldDetails'//获取字段详情;

//通话记录
export const getClueCallLog = '/api/phone/callLog/getClueCallLog'; //获取线索数据的通话记录

//班主任管理
export const addClass = '/api/phone/classTeacher/addClass'; //创建班级
export const addClassTeacher = '/api/phone/classTeacher/addClassTeacher'; //添加班主任
export const getClassList = '/api/phone/classTeacher/getClassList'; //获取班级列表
export const getOrgStrAndClassTch = '/api/phone/classTeacher/getOrgStrAndClassTch'; //获取组织架构和班主任
export const getClassTeacherList = '/api/phone/classTeacher/getClassTeacherList'; //获取班级的班主任列表
export const delVerClassTeacher = '/api/phone/classTeacher/delVerClassTeacher'; //删除班主任
export const getClassTeaOptionByClassUuid = '/api/phone/classTeacher/getClassTeaOptionByClassUuid'; //获取班级下的班主任选项
export const transferOfficer = '/api/phone/classTeacher/transferOfficer'; //转学员
export const getClassTeaClass = '/api/phone/classTeacher/getClassTeaClass'; //获取班主任的班级列表
export const getClassTeaClassWait = '/api/phone/classTeacher/getClassTeaClassWait'; //获取班主任的班级列表(待领取)
export const getSupStuList = '/api/phone/classTeacher/getSupStuList'; //主管管理的所有学员
export const transferStu = '/api/phone/classTeacher/transferStu'; //转移学员
export const getTransferStuCTList = '/api/phone/classTeacher/getTransferStuCTList'; //获取转移学员的班主任列表
export const getSendMsgClassTeaStudent = '/api/phone/classTeacher/getSendMsgClassTeaStudent'; //发送短信（班主任学员列表）
export const getSendMsgSupStuList = '/api/phone/classTeacher/getSendMsgSupStuList'; //发送短信（主管管理的所有学员）
export const classTeaExamItem = '/api/phone/classTeacher/classTeaExamItem'; //班主任的考试项目列表
export const clTeaOrgFilterBox = '/api/phone/classTeacher/clTeaOrgFilterBox'; //获取班主任的组织筛选框

//学员管理
export const getWaitStudentList = '/api/phone/classTeacher/getWaitStudentList'; //获取待分配学员订单列表
export const classTeaGetWaitStudent = '/api/phone/classTeacher/classTeaGetWaitStudent'; //班主任获取待分配的学员
export const getClassTeaStudent = '/api/phone/classTeacher/getClassTeaStudent'; //班主任学员列表
export const getOrderList = '/order-service/order/getOrderList' //获取用户订单列表
export const getOrderList4Teacher = '/order-service/order/getOrderList4Teacher' //获取坐席订单列表

//学员信息
export const getStudentDetails = '/api/phone/student/getStudentDetails'; //获取学员详情

//数据查看权限
export const getPermission = '/api/phone/dataViewPermission/getPermission' //获取数据权限
export const getPermissionUpdate = '/api/phone/dataViewPermission/update' //更新数据权限
export const dataViewPermissionUserList = '/api/phone/dataViewPermission/userList' //获取数据权限==》人员

//线索流转
export const spillPoolActSeat = '/api/phone/theCirculation/spillPoolActSeat' //溢出池线索数据分配给指定坐席
export const recPoolActSeat = '/api/phone/theCirculation/recPoolActSeat' //回收池线索数据分配给指定坐席
export const spillPoolActClueRule = '/api/phone/theCirculation/spillPoolActClueRule' //溢出池线索数据分配给指定分配组
export const seatActSeat = '/api/phone/theCirculation/seatActSeat' //坐席线索数据分配给指定坐席

//主推班型
export const getGoodsList = '/order-service/goods/getGoodsList' //主推班型

//站内消息
export const readUuid = '/api/phone/stationNews/read/' //读取信息
export const getStationNews = '/api/phone/stationNews/getStationNews' //获取消息列表
export const noReadNum = '/api/phone/stationNews/noReadNum' //获取未读消息数量

//线索模板导出
export const clueDataTem = '/api/phone/excel/clueDataTem' //线索模板导出
export const readExcelClueData = '/api/phone/excel/readExcelClueData';//模板录入
export const registerExportExcel = '/api/phone/excel/registerExportExcel';//报考信息导出Excel
export const registerExportZip = '/api/phone/excel/registerExportZip';//报考信息导出Zip
export const directorClueExport = '/api/phone/excel/directorClueExport';//主管线索导出Excel
export const personalClueExport = '/api/phone/excel/personalClueExport';//个人线索导出Excel
export const testAllClueExport = '/api/phone/testUtil/testAllClueExport';//test-查询主管线索导出数据
export const uploadFile = '/upload-service/upload/file';//模板录入

//lovestudy
export const GetAgreementDetail = '/lovestudy/api/agreement/GetAgreementDetail' //协议
export const GetAgreementList = '/lovestudy/api/agreement/GetAgreementList' //协议列表
export const GetCourseList4Teacher = '/lovestudy/api/study/GetCourseList4Teacher' //课程列表
export const GetCityList = '/lovestudy/api/address/GetCityList' //城市数据
export const updateAddress = '/order-service/order/updateAddress' //修改收货人地址
export const xieyi = '/xieyi.php?act=agrinfo&order_sn=' //xieyi

//userRecord
export const moduleList = '/api/data/systemLog/moduleList' //查询操作对象接口
export const systemLogList = '/api/data/systemLog/list' //查询日志列表

//短信模板
export const getSMSTem = '/api/phone/getSMSTem' //获取短信模板
export const createSMSMsg = '/api/phone/createSMSMsg' //创建短信内容
export const getSMSMsgDel = '/api/phone/getSMSMsgDel' //获取短信内容详情
export const getSMSMsgList = '/api/phone/getSMSMsgList' //获取短信内容集合
export const getSMSMsgBaseList = '/api/phone/getSMSMsgBaseList' //获取短信基础内容集合
export const getSMSTemList = '/api/phone/getSMSTemList' //获取短信模板列表
export const groupSMS = '/api/phone/groupSMS' //群发消息
export const getSMSRecordList = '/api/phone/getSMSRecordList' //获取短信记录列表
export const getUrlMsg = '/api/phone/urlMsg/getUrl' //获取报考的url内容

//代报考管理
export const registerList = '/api/phone/register/list' //查询报考信息列表
export const queryProvinceAll = '/api/phone/register/queryProvinceAll' //查询报考信息列表
export const queryUserList = '/api/phone/register/queryUserList' //查询分配报考员列表
export const allocationUser = '/api/phone/register/allocationUser' //分配报考员操作
export const registerGet = '/api/phone/register/get' //查看报考信息
export const registerCheck = '/api/phone/register/check' //审核报考信息
export const updataPayment = '/api/phone/register/updataPayment' //更新报考交费状态
export const queryRegisterProcess = '/api/phone/register/queryRegisterProcess' //查询代报考进度
export const queryItemList = '/api/phone/register/queryItemList' //查询报考项目信息
export const downloadList = '/api/phone/register/downloadList' //查看下载任务接口

// 教务统计
export const getTeaWork='/api/phone/classTeacher/teaWork'//获取班主任的工作情况

//服务监测
export const openClass = '/api/phone/qualityTesting/openClass' //班主任的开班情况
export const orgOpenClass = '/api/phone/qualityTesting/orgOpenClass' //组织下班主任开班情况
export const returnVisit = '/api/phone/qualityTesting/returnVisit' //质检班主任的回访情况
export const orgReturnVisit = '/api/phone/qualityTesting/orgReturnVisit' //质检组织的班主任回访情况

//微信管理
export const wxNumList = '/api/phone/saleAddWX/wxNumList' //获取销售添加微信数量集合
export const upWxNum= '/api/phone/saleAddWX/upWxNum' //销售修改微信数量

//目标管理-公司
export const getYearTargetList = '/api/data/companyTarget/getYearTargetList' //公司年目标列表
export const getLastYear = '/api/data/companyTarget/getLastYear' //查询公司上一年总流水
export const addOrEditYearTarget = '/api/data/companyTarget/addOrEditYearTarget' //新增 | 修改 公司年度目标
export const getComYearDetail = '/api/data/companyTarget/getYearDetail' //查询公司年目标详情

export const getCurrentYear = '/api/data/companyTarget/getCurrentYear' //公司本年度所有月的目标流水
export const getComMonthList = '/api/data/companyTarget/getMonthList' //公司月目标列表
export const getComMonthDetail = '/api/data/companyTarget/getMonthDetail' //查询公司月份目标详情
export const addOrEditMonthTarget = '/api/data/companyTarget/addOrEditMonthTarget' //新增 | 修改 公司月份目标

export const getCurrentMonth = '/api/data/companyTarget/getCurrentMonth' //查询公司本月所有天的目标流水
export const getComDailyList = '/api/data/companyTarget/getDailyList' //公司日目标列表
export const getComDailyDetail = '/api/data/companyTarget/getDailyDetail' //公司日目标详情
export const addOrEditDailyTarget = '/api/data/companyTarget/addOrEditDailyTarget' //新增 | 修改 公司月份下的日目标

//目标管理-部门
export const getManageOrgList = '/api/data/deptTarget/getManageOrgList' //查询当前登录用户管理的组织
export const getLastDeptYear = '/api/data/deptTarget/getLastDeptYear' //查询上级部门和子部门的年度目标流水
export const addOrEditDeptYear = '/api/data/deptTarget/addOrEditYear' //部门 - 年 -新增 | 修改 年度目标
export const getDeptYearDetail = '/api/data/deptTarget/getYearDetail' //部门 - 年 -查询年目标详情
export const getDeptYearList = '/api/data/deptTarget/getYearList' //部门 - 年 - 目标列表

export const getDeptMonthList = '/api/data/deptTarget/getMonthList' //部门 - 月 - 目标列表
export const getDeptMonthDetail = '/api/data/deptTarget/getMonthDetail' //部门 - 月 -查询月目标详情
export const addOrEditDeptMonth = '/api/data/deptTarget/addOrEditMonth' //部门 - 月 -新增 | 修改 月度目标

export const getDeptDailyList = '/api/data/deptTarget/getDailyList' //公司—日—目标列表
export const getDeptDailyDetail = '/api/data/deptTarget/getDailyDetail' //部门 - 日 -查询日目标详情
export const addOrEditDeptDaily = '/api/data/deptTarget/addOrEditDaily' //部门 - 日 -新增 | 修改 日目标





//数据看板
export const dayWork = '/api/data/saleStatistics/dayWork' //获取销售每天的工作情况的数据看板
export const orgDayWork = '/api/data/saleStatistics/orgDayWork' //获取组织下销售人员工作情况的数据看板
export const orgDayWorkSum = '/api/data/saleStatistics/orgDayWorkSum' //获取组织下销售人员每天的工作情况的数据汇总看板
export const todayWork = '/api/data/saleStatistics/todayWork' //获取销售今天工作情况的数据看板
export const orgTodayWork = '/api/data/saleStatistics/orgTodayWork' //获取组织下销售人员今天工作情况汇总的数据看板
export const orgSaleDayWork = '/api/data/saleStatistics/orgSaleDayWork' //获取组织下销售人员每天的工作情况的数据看板
export const saleDataOrg = '/api/data/saleStatistics/saleDataOrg' //获取销售的数据组织权限
export const orgSaleAims = '/api/data/saleStatistics/orgSaleAims' //获取组织的销售人员的今日目标完成情况
export const saleAims = '/api/data/saleStatistics/saleAims' //获取销售的今日目标完成情况
