import request from '/@/utils/request';

/**
 * （不建议写成 request.post(xxx)，因为这样 post 时，无法 params 与 data 同时传参）
 *
 * 登录api接口集合
 * @method signIn 用户登录
 * @method signOut 用户退出登录
 */

export function useLoginApi(userId:String,password:String) {
			return request({
				url: '/api/User/Login',
				method: 'post',
				data:{
					userId,password
				}
			});
}
// 获取新的token
// export function getTokenApi() {
// 	return request({
// 		url: '/api/User/ReplaceToken',
// 		method: 'post',
// 	});
// }
export function useLogin(params: object) {
	return request({
		url: '/Login/InterUserLogin',
		method: 'get',
		params
	});
}
