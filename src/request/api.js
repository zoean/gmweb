
// 基础模块接口
export const getUserDetailedList = '/api/basicApp/getUserDetailedList'; //获取员工详情信息集合
export const getUserLoginMessage = '/api/basicApp/getUserLoginMessage'; //获取员工信息
export const getOrgUserBasic = '/api/basicApp/getOrgUserBasic'; //获取组织对应的员工信息
export const getUserDetailed = '/api/basicApp/getUserDetailed'; //获取员工详情信息
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

export const addExamDirection = '/api/knowledgeSystem/examDirection/addExamDirection'; //新增考试方向
export const deleteExamDirectionByUuid = '/api/knowledgeSystem/examDirection/deleteExamDirectionByUuid'; //删除考试方向
export const getExamDirectionByUuid = '/api/knowledgeSystem/examDirection/getExamDirectionByUuid'; //获取考试方向信息
export const updateExamDirection = '/api/knowledgeSystem/examDirection/updateExamDirection'; //更新考试方向
export const sortNumber2 = '/api/knowledgeSystem/examDirection/sortNumber'; //考试方向移动位置

export const getKnowledgeStructure = '/api/knowledgeSystem/knowledge/getKnowledgeStructure'; //获取知识体系结构