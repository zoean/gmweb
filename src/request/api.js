
export const login = '/api/login'; //用户登录
export const logOut = '/api/logOut'; //登出
export const getUserByToken = '/api/user/getUserByToken'; //获取员工信息
export const updateUserPassword = '/api/user/updateUserPassword'; //修改员工密码
export const getUserDetailedList = '/api/basicApp/getUserDetailedList'; //获取员工详情信息集合
export const getOrgSubsetByUuid = '/api/org/getOrgSubsetByUuid'; //查询组织信息（包含子集）
export const getRoleList = '/api/role/getRoleList'; //获取所有角色信息
export const getRoleMenuList = '/api/role/getRoleMenuList'; //获取角色的菜单信息
export const getRoleGroupList = '/api/role/getRoleGroupList'; //获取所有角色组（包含角色）信息
export const addMenu = '/api/menu/addMenu'; //新增菜单
export const deleteMenu = '/api/menu/deleteMenu'; //删除菜单
export const getMenuSubsetByUuid = '/api/menu/getMenuSubsetByUuid'; //查询菜单信息（包含子集）
export const getMenuDetailsSubsetByUuid = '/api/menu/getMenuDetailsSubsetByUuid'; //查询菜单详情信息（包含子集）
export const updateMenu = '/api/menu/updateMenu'; //修改菜单
