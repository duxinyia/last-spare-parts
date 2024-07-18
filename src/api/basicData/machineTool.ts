import { LocationQueryValue } from 'vue-router';
import request from '/@/utils/request';

// 查询机台（分頁）
export function postMachineQueryApi(data: Object,costCodeId:LocationQueryValue | LocationQueryValue[]) {
	return request({
		url: '/api/Machine/Query',
		method: 'POST',
		data: data,
		params:{costCodeId}
	});
}
// 批量新增机台
export function postMachineCreateApi(data: Object,costCodeId:LocationQueryValue | LocationQueryValue[]) {
	return request({
		url: '/api/Machine/Create',
		method: 'POST',
		params:{costCodeId},
		data: data,
	});
}
// 刪除机台
export function postMachineDeleteApi(data: Object,costCodeId:LocationQueryValue | LocationQueryValue[]) {
	return request({
		url: `/api/Machine/Delete`,
		method: 'POST',
		params:{costCodeId},
		data: data,
	});
}