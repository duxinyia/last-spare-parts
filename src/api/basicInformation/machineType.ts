import { LocationQueryValue } from 'vue-router';
import request from '/@/utils/request';

// 查询機種（分頁）
export function postQueryMachineTypesApi(data: Object,costCodeId:LocationQueryValue | LocationQueryValue[]) {
	return request({
		url: '/api/MachineType/QueryMachineTypes',
		method: 'POST',
		data: data,
		params:{costCodeId}
	});
}
// 批量新增機種
export function postMachineTypeCreateApi(data: Object,costCodeId:LocationQueryValue | LocationQueryValue[]) {
	return request({
		url: '/api/MachineType/Create',
		method: 'POST',
		params:{costCodeId},
		data: data,
	});
}
// 刪除機種
export function postMachineTypeDeleteApi(data: Object,costCodeId:LocationQueryValue | LocationQueryValue[]) {
	return request({
		url: `/api/MachineType/Delete`,
		method: 'POST',
		params:{costCodeId},
    data: data,
	});
}