import request from '/@/utils/request';

// 查询費用代碼
export function getCostCodeGetListApi() {
	return request({
		url: '/api/CostCode/GetList',
		method: 'GET',
	});
}
// 新增費用代碼
export function postCostCodeCreateApi(data: Object) {
	return request({
		url: '/api/CostCode/Create',
		method: 'POST',
		data: data,
	});
}
// 修改費用代碼
export function postCostCodeUpdateApi(id :string,alias: string) {
	return request({
		url: `/api/CostCode/Update/${id}`,
		method: 'POST',
		params: {alias},
	});
}
// 刪除費用代碼
export function deleteGroupMemberDeleteApi(id : string) {
	return request({
		url: `/api/CostCode/Delete/${id}`,
		method: 'Delete',
	});
}
// 費用代碼模糊搜索下拉框
export function getCostGetCostInfosApi(input: string) {
	return request({
		url: '/api/CostCode/GetCostInfos',
		method: 'GET',
		params: {input},
	});
}
// 打開修改彈窗得到數據
export function getCostCodeApi(id: string) {
	return request({
		url: `/api/CostCode/Get/${id}`,
		method: 'GET',
	});
}
// 打开管理员弹窗获取当前费用代码的管理员
export function getManagersApi(id: string) {
	return request({
		url: `/api/CostCode/${id}/GetManagers`,
		method: 'GET',
	});
}
// 批量增加管理员
export function postAddManagersApi(id: string,data:Object) {
	return request({
		url: `/api/CostCode/${id}/AddManagers`,
		method: 'POST',
		data: data,
	});
}
// 移除管理员
export function postRemoveManagersApi(id: string,data:Object) {
	return request({
		url: `/api/CostCode/${id}/RemoveManagers`,
		method: 'POST',
		data: data,
	});
}




