import { LocationQueryValue } from 'vue-router';
import request from '/@/utils/request';

// 查询叫料區域（分頁）
export function postRequisitionAreaApi(data: Object,costCodeId:LocationQueryValue | LocationQueryValue[]) {
	return request({
		url: '/api/RequisitionArea/Query',
		method: 'POST',
		data: data,
		params:{costCodeId}
	});
}
// 批量新增叫料區域
export function postRequisitionAreaCreateApi(data: Object,costCodeId:LocationQueryValue | LocationQueryValue[]) {
	return request({
		url: '/api/RequisitionArea/Create',
		method: 'POST',
		params:{costCodeId},
		data: data,
	});
}
// 刪除叫料區域
export function postRequisitionAreaDeleteApi(data: Object,costCodeId:LocationQueryValue | LocationQueryValue[]) {
	return request({
		url: `/api/RequisitionArea/Delete`,
		method: 'POST',
		params:{costCodeId},
    data: data,
	});
}