import { LocationQueryValue } from 'vue-router';
import request from '/@/utils/request';

// 查询群组（分頁）
export function postGroupMemberQueryApi(data: Object,costCodeId:LocationQueryValue | LocationQueryValue[]) {
	return request({
		url: '/api/GroupMember/Query',
		method: 'POST',
		data: data,
		params:{costCodeId}
	});
}
// 批量新增群組
export function postGroupMemberCreateApi(data: Object,costCodeId:LocationQueryValue | LocationQueryValue[]) {
	return request({
		url: '/api/GroupMember/Create',
		method: 'POST',
		params:{costCodeId},
		data: data,
	});
}
// 刪除群組
export function postGroupMemberDeleteApi(data: Object,costCodeId:LocationQueryValue | LocationQueryValue[]) {
	return request({
		url: `/api/GroupMember/Delete`,
		method: 'POST',
		params:{costCodeId},
    data: data,
	});
}