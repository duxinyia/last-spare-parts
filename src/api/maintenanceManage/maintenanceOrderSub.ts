import request from '/@/utils/request';
// 查询接口
export function getQueryExitPageApi(data: Object) {
	return request({
		url: '/api/Stock/QueryExitPage',
		method: 'POST',
		data: data,
	});
}
// 提报单提报接口
export function getSubmitRepairOrderApi(data: Object) {
	return request({
		url: '/api/ToolRepair/SubmitRepairOrder',
		method: 'POST',
		data: data,
	});
}
// 根据退库id查询退库的条码
export function GetExitStoreQrCodeListApi(exitId: string) {
	return request({
		url: '/api/Stock/GetExitStoreQrCodeList',
		method: 'GET',
		params: { exitId },
	});
}
