
// 基础模块接口
export const getSeatDataVolume = '/smoke_api/phone/clueData/getSeatDataVolume'
export const getUserDetailedList = '/smoke_api/basicApp/getUserDetailedList'; //获取员工详情信息集合
export const getUserLoginMessage = '/smoke_api/basicApp/getUserLoginMessage'; //获取员工信息
export const getOrgUserBasic = '/smoke_api/basicApp/getOrgUserBasic'; //获取组织对应的员工信息
export const getUserDetailed = '/smoke_api/basicApp/getUserDetailed'; //获取员工详情信息
export const exportUserDetailedList = '/smoke_api/basicApp/exportUserDetailedList'; //导出员工详情信息集合
export const login = '/smoke_api/login'; //用户登录
export const logOut = '/smoke_api/logOut'; //登出
export const getUserByToken = '/smoke_api/user/getUserByToken'; //获取员工信息
export const updateUserPassword = '/smoke_api/user/updateUserPassword'; //修改员工密码
export const getUserByNameAndAccountNumber = '/smoke_api/user/getUserByNameAndAccountNumber'; //获取员工信息根据姓名和账号
export const getUserByRoleUuid = '/smoke_api/user/getUserByRoleUuid'; //获取员工信息根据角色
export const insertRoleAndUserRelation = '/smoke_api/user/insertRoleAndUserRelation'; //新增角色和员工的关系
export const deleteRoleAndUserRelation = '/smoke_api/user/deleteRoleAndUserRelation'; //删除角色和员工的关系
export const updateUser = '/smoke_api/user/updateUser'; //修改员工信息
export const addUserJqUser = '/smoke_api/user/addUserJqUser'; //创建员工关联的jq用户信息
export const loginPlatform = '/smoke_api/user/loginPlatform'; //一键登录
export const forgetPassword = '/smoke_api/user/forgetPassword'; //员工忘记密码
export const getRoleList = '/smoke_api/role/getRoleList'; //获取所有角色信息
export const getRoleMenuList = '/smoke_api/role/getRoleMenuList'; //获取角色的菜单信息
export const addRoleMenuRelation = '/smoke_api/role/addRoleMenuRelation'; //新建角色和菜单的关系
export const addRole = '/smoke_api/role/addRole'; //新增角色
export const updateRole = '/smoke_api/role/updateRole'; //修改角色
export const deleteRole = '/smoke_api/role/deleteRole'; //删除角色
export const getRoleDetailedList = '/smoke_api/role/getRoleDetailedList'; //获取所有角色组（包含角色）信息
export const getOrgSubsetByUuid = '/smoke_api/org/getOrgSubsetByUuid'; //查询组织信息（包含子集）
export const addMenu = '/smoke_api/menu/addMenu'; //新增菜单
export const deleteMenu = '/smoke_api/menu/deleteMenu'; //删除菜单
export const getMenuSubsetByUuid = '/smoke_api/menu/getMenuSubsetByUuid'; //查询菜单信息（包含子集）
export const getMenuDetailsSubsetByUuid = '/smoke_api/menu/getMenuDetailsSubsetByUuid'; //查询菜单详情信息（包含子集）
export const updateMenu = '/smoke_api/menu/updateMenu'; //修改菜单
export const itemList = '/smoke_api/phone/pageFieldsMag/itemList'; //页面枚举列表
export const getProfile = '/smoke_api/user/getProfile'; //获取个人资料
export const upProfile = '/smoke_api/user/upProfile'; //获取个人资料
export const sendDingVerCode = '/smoke_api/user/sendDingVerCode'; //发送钉钉验证码

// JQ接口
export const phoneUserList = '/smoke_api/phone/phoneUserList'; //获取jq的员工信息
export const countCallRecord = '/smoke_api/phone/countCallRecord'; //统计通话记录
export const getCallRecord = '/smoke_api/phone/getCallRecord'; //获取通话记录
export const getJqAccountNumberList = '/smoke_api/phone/getJqAccountNumberList'; //获取jq的账号信息集合 (get)

// 知识体系接口
export const addClassify = '/smoke_api/knowledgeSystem/classify/addClassify'; //新增分类接口
export const deleteClassifyByUuid = '/smoke_api/knowledgeSystem/classify/deleteClassifyByUuid'; //删除分类接口
export const getClassifyByUuid = '/smoke_api/knowledgeSystem/classify/getClassifyByUuid'; //获取分类信息
export const getClassifyByParentUuid = '/smoke_api/knowledgeSystem/classify/getClassifyByParentUuid'; //获取子分类信息列表
export const updateClassify = '/smoke_api/knowledgeSystem/classify/updateClassify'; //更新分类接口
export const sortNumber1 = '/smoke_api/knowledgeSystem/classify/sortNumber'; //分类移动位置

export const addExamDirection = '/smoke_api/knowledgeSystem/examDirection/addExamDirection'; //新增考试方向
export const deleteExamDirectionByUuid = '/smoke_api/knowledgeSystem/examDirection/deleteExamDirectionByUuid'; //删除考试方向
export const getExamDirectionByUuid = '/smoke_api/knowledgeSystem/examDirection/getExamDirectionByUuid'; //获取考试方向信息
export const updateExamDirection = '/smoke_api/knowledgeSystem/examDirection/updateExamDirection'; //更新考试方向
export const sortNumber2 = '/smoke_api/knowledgeSystem/examDirection/sortNumber'; //考试方向移动位置
export const addExamAndSubjectRelation = '/smoke_api/knowledgeSystem/examDirection/addExamAndSubjectRelation'; //新增考试项和科目的关系
export const deleteExamAndSubjectRelation = '/smoke_api/knowledgeSystem/examDirection/deleteExamAndSubjectRelation'; //删除考试项和科目的关系
export const getExamAndSubjectRelation = '/smoke_api/knowledgeSystem/examDirection/getExamAndSubjectRelation'; //查询考试项和科目的关系
export const updateExamAndSubjectRelation = '/smoke_api/knowledgeSystem/examDirection/updateExamAndSubjectRelation'; //更新考试项和科目的关系
export const sortNumberSubjectRelation = '/smoke_api/knowledgeSystem/examDirection/sortNumberSubjectRelation'; //科目关系移动位置
export const getExamBasic = '/smoke_api/knowledgeSystem/examDirection/getExamBasic'; //查询考试项基本信息
export const getSubjectBasicByExamUuid = '/smoke_api/knowledgeSystem/examDirection/getSubjectBasicByExamUuid'; //查询科目基本信息根据考试项唯一标识

export const addExamCategory = '/smoke_api/knowledgeSystem/examDirection/addExamCategory'; //新增考试项品类
export const updateExamCategory = '/smoke_api/knowledgeSystem/examDirection/updateExamCategory'; //更新考试项品类
export const getExamCategoryByExamUuid = '/smoke_api/knowledgeSystem/examDirection/getExamCategoryByExamUuid'; //获取考试项品类根据考试项唯一标识
export const getExamCategoryByUuid = '/smoke_api/knowledgeSystem/examDirection/getExamCategoryByUuid'; //获取考试项品类根据唯一标识
export const deleteExamCategory = '/smoke_api/knowledgeSystem/examDirection/deleteExamCategory'; //删除考试项品类

export const addSubject = '/smoke_api/knowledgeSystem/subject/addSubject'; //新增科目
export const deleteSubject = '/smoke_api/knowledgeSystem/subject/deleteSubject'; //删除科目
export const getSubjectByName = '/smoke_api/knowledgeSystem/subject/getSubjectByName'; //获取科目信息根据科目名称
export const updateSubject = '/smoke_api/knowledgeSystem/subject/updateSubject'; //更新科目
export const getSubjectByUuid = '/smoke_api/knowledgeSystem/subject/getSubjectByUuid'; //获取科目信息根据uuid

export const addSubjectCatalogue = '/smoke_api/knowledgeSystem/subjectCatalogue/addSubjectCatalogue' //新增科目目录
export const deleteSubjectCatalogueByUuid = '/smoke_api/knowledgeSystem/subjectCatalogue/deleteSubjectCatalogueByUuid' //删除科目目录
export const sortNumber3 = '/smoke_api/knowledgeSystem/subjectCatalogue/sortNumber' //科目目录移动位置
export const updateSubjectCatalogue = '/smoke_api/knowledgeSystem/subjectCatalogue/updateSubjectCatalogue' //更新科目目录
export const getSubjectCatalogueByParentUuid = '/smoke_api/knowledgeSystem/subjectCatalogue/getSubjectCatalogueByParentUuid' //获取目录的子目录信息
export const getSubjectCatalogueByUuid = '/smoke_api/knowledgeSystem/subjectCatalogue/getSubjectCatalogueByUuid' //获取科目目录信息

export const addKnowledgePoints = '/smoke_api/knowledgeSystem/knowledgePoints/addKnowledgePoints' //新增知识点
export const deleteKnowledgePoints = '/smoke_api/knowledgeSystem/knowledgePoints/deleteKnowledgePoints' //删除知识点
export const getKnowledgePointsByCatalogueUuid = '/smoke_api/knowledgeSystem/knowledgePoints/getKnowledgePointsByCatalogueUuid' //获取知识点根据科目目录uuid
export const getKnowledgePointsByUuid = '/smoke_api/knowledgeSystem/knowledgePoints/getKnowledgePointsByUuid' //获取知识点根据uuid
export const sortNumber4 = '/smoke_api/knowledgeSystem/knowledgePoints/sortNumber' //知识点移动位置
export const updateKnowledgePoints = '/smoke_api/knowledgeSystem/knowledgePoints/updateKnowledgePoints' //更新知识点

export const getKnowledgeStructure = '/smoke_api/knowledgeSystem/knowledge/getKnowledgeStructure'; //获取知识体系结构
export const getSubjectByExamUuidAndName = '/smoke_api/knowledgeSystem/knowledge/getSubjectByExamUuidAndName'; //获取科目根据考试项和科目名称
export const getSubjectCatalogueBySubjectUuid = '/smoke_api/knowledgeSystem/knowledge/getSubjectCatalogueBySubjectUuid'; //获取科目目录信息（包含子集）
export const getCatalogueAndKnowBySubjectUuid = '/smoke_api/knowledgeSystem/knowledge/getCatalogueAndKnowBySubjectUuid'; //获取知识点信息List
export const getCatalogueKnowBasicBySubjectUuid = '/smoke_api/knowledgeSystem/knowledge/getCatalogueKnowBasicBySubjectUuid'; //获取科目目录和知识点的基本信息

export const addCourseVideo = '/smoke_api/knowledgeSystem/courseVideo/addCourseVideo'; //新增课程视频
export const getCourseVideoByUuid = '/smoke_api/knowledgeSystem/courseVideo/getCourseVideoByUuid'; //获取课程视频根据唯一标识
export const getCourseVideoList = '/smoke_api/knowledgeSystem/courseVideo/getCourseVideoList'; //获取课程视频列表
export const updateCourseVideo = '/smoke_api/knowledgeSystem/courseVideo/updateCourseVideo'; //更新课程视频
export const deleteCourseVideoByUuid = '/smoke_api/knowledgeSystem/courseVideo/deleteCourseVideoByUuid'; //删除课程视频
export const uploadimg = '/smoke_api/knowledgeSystem/courseVideo/uploadimg'; //文件上传
export const getFileSize = '/smoke_api/knowledgeSystem/courseVideo/getFileSize'; //获取文件大小 

// 通话数据权限分配
export const addDataAllocationRules = '/smoke_api/phone/DataAutDis/addDataAllocationRules'; //新增数据分配组
export const deleteDataAllocationRules = '/smoke_api/phone/DataAutDis/deleteDataAllocationRules'; //删除数据分配组
export const getDataAllocationRulesByUuid = '/smoke_api/phone/DataAutDis/getDataAllocationRulesByUuid'; //获取数据分配组详情
export const getDataAllocationRulesList = '/smoke_api/phone/DataAutDis/getDataAllocationRulesList'; //获取数据分配组集合
export const getDataAllocationStaff = '/smoke_api/phone/DataAutDis/getDataAllocationStaff'; //获取数据分配人员信息
export const updateDataAllocationRules = '/smoke_api/phone/DataAutDis/updateDataAllocationRules'; //更新数据分配组
export const updateDataAllocationStaff = '/smoke_api/phone/DataAutDis/updateDataAllocationStaff'; //更新数据分配人员
export const getDataAllocationUpperLimit = '/smoke_api/phone/DataAutDis/getDataAllocationUpperLimit'; //获取数据分配上限信息
export const oneKeyDistribution = '/smoke_api/phone/DataAutDis/oneKeyDistribution'; //一键分配线索数据
export const updateDataAllocationUpperLimit = '/smoke_api/phone/DataAutDis/updateDataAllocationUpperLimit'; //更新数据分配上线
export const getDataAllocationStaffList = '/smoke_api/phone/DataAutDis/getDataAllocationStaffList'; //获取数据分配人员集合
export const deleteDataAllocationStaff = '/smoke_api/phone/DataAutDis/deleteDataAllocationStaff'; //移除数据分配人员
export const getUpperLimitList = '/smoke_api/phone/DataAutDis/getUpperLimitList'; //获取人员数据分配上限集合
export const addRuleUserAndLimit = '/smoke_api/phone/DataAutDis/addRuleUserAndLimit'; //添加规则下人员和已分配上限信息
export const getRuleUserStructureLimit = '/smoke_api/phone/DataAutDis/getRuleUserStructureLimit'; //获取规则下人员结构和已分配上限信息
export const getRuleUserLimit = '/smoke_api/phone/DataAutDis/getRuleUserLimit'; //获取规则下人员分配上限信息
export const getRuleItem = '/smoke_api/phone/DataAutDis/getRuleItem'; //获取分配组项列表
export const getRuleItemAuth = '/smoke_api/phone/DataAutDis/getRuleItemAuth'; //获取分配组项列表（带权限）
export const getSchoolList = '/smoke_api/phone/DataAutDis/getSchoolList'; //获取分校集合
export const getPopularizeUrl = '/smoke_api/phone/DataAutDis/getPopularizeUrl'; //获取推广链接
export const popularizeUrl = '/smoke_api/phone/DataAutDis/popularizeUrl'; //生成推广链接

//线索数据
export const getClueDataByUserUuid = '/smoke_api/phone/clueData/getClueDataByUserUuid'; //获取员工的线索数据
export const getListField = '/smoke_api/phone/pageFieldsMag/getUserPageField';//获取页面字段
export const updateListField = '/smoke_api/phone/pageFieldsMag/upUserPageField';//更新页面字段排序、选中状态

export const getClueDataAll = '/smoke_api/phone/clueData/getClueDataAll'; //获取员工的全部客户
export const firstConDataList = '/smoke_api/phone/clueData/firstConDataList'; //获取员工的首咨线索数据
export const todayCallDataList = '/smoke_api/phone/clueData/todayCallDataList'; //获取员工今日联系的线索数据
export const threeDaysNoCallDataList = '/smoke_api/phone/clueData/threeDaysNoCallDataList'; //获取员工三日未联系的线索数据
export const clueDataRelease = '/smoke_api/phone/clueData/clueDataRelease'; //释放线索数据    
export const orderCallDataList = '/smoke_api/phone/clueData/orderCallDataList'; //获取员工成单的线索数据 
export const userOrderDataList = '/smoke_api/phone/clueData/userOrderDataList';//获取坐席名下订单列表
export const getOrderPayRecord = '/order-service/order/getOrderPayRecord';//获取订单支付记录
export const getClueDataDetails = '/smoke_api/phone/clueData/getClueDataDetails'; //获取线索数据详情    
export const getAllUserClueData = '/smoke_api/phone/clueData/getAllUserClueData'; //获取所有坐席线索数据    
export const getSpillPoolClueData = '/smoke_api/phone/clueData/getSpillPoolClueData'; //获取溢出池线索数据    
export const consumerCallDataList = '/smoke_api/phone/clueData/consumerCallDataList'; //获取用户线索列表数据    
export const getClueDataNumber = '/smoke_api/phone/clueData/getClueDataNumber'; //获取坐席的线索数量情况    
export const copyTel = '/smoke_api/phone/clueData/copyTel'; //复制手机号码    
export const entryClueData = '/smoke_api/phone/clueData/entryClueData'; //手动录入线索数据    
export const bulkImportClueData = '/smoke_api/phone/clueData/bulkImportClueData'; //批量导入线索数据    
export const getOrderCustomer = '/smoke_api/phone/clueData/getOrderCustomer'; //获取坐席的成单用户    

//外呼接口
export const getAdminUinToken = '/smoke_api/phone/outbound/getAdminUinToken'; //获取主账号token（9814692）
export const getUinOutConfigMessage = '/smoke_api/phone/outbound/getUinOutConfigMessage'; //获取坐席外呼配置信息
export const phoneOut = '/smoke_api/phone/outbound/phoneOut'; //手机外呼
export const seatOut = '/smoke_api/phone/outbound/seatOut'; //坐席外呼
export const phoneOutTea = '/smoke_api/phone/outbound/phoneOutTea'; //手机外呼（班主任）
export const seatOutTea = '/smoke_api/phone/outbound/seatOutTea'; //坐席外呼（班主任）

//Excel导入和导出
export const outExcelKnow = '/smoke_api/knowledgeSystem/knowExcel/outExcelKnow'; //知识点目录导出
export const outExcelSubject = '/smoke_api/knowledgeSystem/knowExcel/outExcelSubject'; //科目目录导出
export const readExcelSubject = '/smoke_api/knowledgeSystem/knowExcel/readExcelSubject'; //科目目录导入
export const readExcelKnow = '/smoke_api/knowledgeSystem/knowExcel/readExcelKnow'; //知识点导入

export const getRecoveryPoolDataList = '/smoke_api/phone/clueData/getRecoveryPoolDataList'; //获取回收池的线索数据
export const getUserRPCDList = '/smoke_api/phone/clueData/getUserRPCDList'; //获取待分配回收池线索数据
export const obtainRPCD = '/smoke_api/phone/clueData/obtainRPCD'; //员工获取回收池线索数据

//渠道管理
export const channelGetList = '/smoke_api/phone/channel/getList'; //渠道列表
export const channelAdd = '/smoke_api/phone/channel/add'; //渠道列表
export const channelDelete = '/smoke_api/phone/channel/delete'; //渠道列表
export const channelUpdate = '/smoke_api/phone/channel/update'; //渠道列表
export const channeGet = '/smoke_api/phone/channel/get'; //渠道列表

//线索备注
export const addClueDataNotes = '/smoke_api/phone/notes/addClueDataNotes'; //新增线索数据备注
export const getClueDataNotes = '/smoke_api/phone/notes/getClueDataNotes'; //线索数据备注列表
export const getClueDataNotesDetails = '/smoke_api/phone/notes/getClueDataNotesDetails'; //获取线索数据备注的详情信息
export const addClassTeaStuNotes = '/smoke_api/phone/notes/addClassTeaStuNotes'; //班主任新增学员备注
export const getClassTeaStuNotes = '/smoke_api/phone/notes/getClassTeaStuNotes'; //班主任学员备注列表

//枚举管理
export const addEnum = '/smoke_api/phone/dataDictionary/addEnum'; //新增枚举
export const addEnumItem = '/smoke_api/phone/dataDictionary/addEnumItem'; //新增枚举项
export const enumItemSort = '/smoke_api/phone/dataDictionary/enumItemSort'; //枚举项排序
export const getEnum = '/smoke_api/phone/dataDictionary/getEnum'; //获取枚举详情
export const getEnumItem = '/smoke_api/phone/dataDictionary/getEnumItem'; //获取枚举项列表
export const getEnumList = '/smoke_api/phone/dataDictionary/getEnumList'; //获取枚举列表
export const updateEnum = '/smoke_api/phone/dataDictionary/updateEnum'; //修改枚举
export const updateEnumItem = '/smoke_api/phone/dataDictionary/updateEnumItem'; //修改枚举项
export const enumByEnumNums = '/smoke_api/phone/dataDictionary/enumByEnumNums'; //根据枚举编号获取枚举列表

//页面字段管理
export const addPage = '/smoke_api/phone/pageFieldsMag/addPage';//新增页面
export const getPage = '/smoke_api/phone/pageFieldsMag/pageList';//获取页面列表
export const updatePage = '/smoke_api/phone/pageFieldsMag/updatePage';//更新页面信息
export const addField = '/smoke_api/phone/pageFieldsMag/addPageField';//新增字段
export const updateField = '/smoke_api/phone/pageFieldsMag/updatePageField';//更新字段
export const getField = '/smoke_api/phone/pageFieldsMag/pageFieldList';//字段列表
export const getFieldDetail = '/smoke_api/phone/pageFieldsMag/pageFieldDetails'//获取字段详情;

//通话记录
export const getClueCallLog = '/smoke_api/phone/callLog/getClueCallLog'; //获取线索数据的通话记录

//班主任管理
export const addClass = '/smoke_api/phone/classTeacher/addClass'; //创建班级
export const addClassTeacher = '/smoke_api/phone/classTeacher/addClassTeacher'; //添加班主任
export const getClassList = '/smoke_api/phone/classTeacher/getClassList'; //获取班级列表
export const getOrgStrAndClassTch = '/smoke_api/phone/classTeacher/getOrgStrAndClassTch'; //获取组织架构和班主任
export const getClassTeacherList = '/smoke_api/phone/classTeacher/getClassTeacherList'; //获取班级的班主任列表
export const delVerClassTeacher = '/smoke_api/phone/classTeacher/delVerClassTeacher'; //删除班主任
export const getClassTeaOptionByClassUuid = '/smoke_api/phone/classTeacher/getClassTeaOptionByClassUuid'; //获取班级下的班主任选项
export const transferOfficer = '/smoke_api/phone/classTeacher/transferOfficer'; //转学员
export const getClassTeaClass = '/smoke_api/phone/classTeacher/getClassTeaClass'; //获取班主任的班级列表
export const getClassTeaClassWait = '/smoke_api/phone/classTeacher/getClassTeaClassWait'; //获取班主任的班级列表(待领取)
export const getSupStuList = '/smoke_api/phone/classTeacher/getSupStuList'; //主管管理的所有学员
export const transferStu = '/smoke_api/phone/classTeacher/transferStu'; //转移学员
export const getTransferStuCTList = '/smoke_api/phone/classTeacher/getTransferStuCTList'; //获取转移学员的班主任列表

//学员管理
export const getWaitStudentList = '/smoke_api/phone/classTeacher/getWaitStudentList'; //获取待分配学员订单列表
export const classTeaGetWaitStudent = '/smoke_api/phone/classTeacher/classTeaGetWaitStudent'; //班主任获取待分配的学员
export const getClassTeaStudent = '/smoke_api/phone/classTeacher/getClassTeaStudent'; //班主任学员列表
export const getOrderList = '/order-service/order/getOrderList' //获取用户订单列表
export const getOrderList4Teacher = '/order-service/order/getOrderList4Teacher' //获取坐席订单列表

//学员信息
export const getStudentDetails = '/smoke_api/phone/student/getStudentDetails'; //获取学员详情

//数据查看权限
export const getPermission = '/smoke_api/phone/dataViewPermission/getPermission' //获取数据权限
export const getPermissionUpdate = '/smoke_api/phone/dataViewPermission/update' //更新数据权限

//线索流转
export const spillPoolActSeat = '/smoke_api/phone/theCirculation/spillPoolActSeat' //溢出池线索数据分配给指定坐席
export const recPoolActSeat = '/smoke_api/phone/theCirculation/recPoolActSeat' //回收池线索数据分配给指定坐席
export const spillPoolActClueRule = '/smoke_api/phone/theCirculation/spillPoolActClueRule' //溢出池线索数据分配给指定分配组

//主推班型
export const getGoodsList = '/order-service/goods/getGoodsList' //主推班型

//站内消息
export const readUuid = '/smoke_api/phone/stationNews/read/' //读取信息
export const getStationNews = '/smoke_api/phone/stationNews/getStationNews' //获取消息列表
export const noReadNum = '/smoke_api/phone/stationNews/noReadNum' //获取未读消息数量

//线索模板导出
export const clueDataTem = '/smoke_api/phone/excel/clueDataTem' //线索模板导出
export const readExcelClueData = '/smoke_api/phone/excel/readExcelClueData';//模板录入
export const uploadFile = '/upload-service/upload/file';//模板录入

//lovestudy
export const GetAgreementDetail = '/lovestudy/api/agreement/GetAgreementDetail' //协议
export const GetAgreementList = '/lovestudy/api/agreement/GetAgreementList' //协议列表
export const GetCourseList4Teacher = '/lovestudy/api/agreement/GetCourseList4Teacher' //课程列表

