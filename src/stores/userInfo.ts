import { defineStore } from 'pinia';
import Cookies from 'js-cookie';
import { Local, Session } from '/@/utils/storage';
import { useLoginApi } from '../api/login';
import { rejects } from 'assert';
/**
 * 用户信息
 * @methods setUserInfos 设置用户信息
 */
export const useUserInfo = defineStore('userInfo', {
	state: (): UserInfosState => ({
		userInfos: {
			userName: '',
			userId:'',
			userPassword:'',
			time: 0,
			roles: [],
			authBtnList: [],
		},
	}),
	actions: {
		async setUserInfos() {
			// 存储用户信息到浏览器缓存
			if (Session.get('userInfo')) {			
				this.userInfos = Session.get('userInfo');
			} else {
				const userInfos = <UserInfos>await this.getApiUserInfo();
				this.userInfos = userInfos;
			}
		},
		// 接口数据
		async getApiUserInfo() {
			return new Promise((resolve,rejects) => {
				setTimeout(async() => {
					const userName = Cookies.get('userId')||Cookies.get('userName');
					const userPassword=Cookies.get('userPassword')
					try{
						const res = await useLoginApi(userName, userPassword);
						if(res.status){
							Session.set('token', res.data.token);
							Cookies.set('userName', res.data.username);
							Cookies.set('userId', res.data.userId);
							// / 添加是否缓存组件状态
							const menudatas = addIsKeepAlive(res.data.datas);
							Local.set('datas', menudatas);
								// const tenantDatas=Session.get('tenantDatas')
						// const isSign=Session.get('isSign')
						let defaultRoles: Array<string> = [];
						let defaultAuthBtnList: Array<string> = [];
						// admin 页面权限标识，对应路由 meta.roles，用于控制路由的显示/隐藏
						let adminRoles: Array<string> = ['admin'];
						// admin 按钮权限标识
						let adminAuthBtnList: Array<string> = ['btn.add', 'btn.del', 'btn.edit', 'btn.link'];
						// test 页面权限标识，对应路由 meta.roles，用于控制路由的显示/隐藏
						let testRoles: Array<string> = ['common'];
						// test 按钮权限标识
						let testAuthBtnList: Array<string> = ['btn.add', 'btn.link'];
						// 不同用户模拟不同的用户权限
						// if (userName === 'admin') {
							defaultRoles = adminRoles;
							defaultAuthBtnList = adminAuthBtnList;
						// } else {
						// 	defaultRoles = testRoles;
						// 	defaultAuthBtnList = testAuthBtnList;
						// }
						// 用户信息模拟数据
						const userInfos = {
							userName: userName,
							userId:res.data.userId,
							// isSign:isSign,
							// tenantDatas:tenantDatas,
							time: new Date().getTime(),
							roles: defaultRoles,
							authBtnList: defaultAuthBtnList,
							userPassword:userPassword
						};
						Session.set('userInfo', userInfos);
						resolve(userInfos);
						}else{
							rejects();
						}			
					}catch{
						rejects();
					}
					
				}, 0);
			});
		},
	},
});
// 在路由里面所有的meta里面加上isKeepAlive字段(是否缓存组件状态)
const addIsKeepAlive = (datas: EmptyArrayType) => {
	datas.forEach((item) => {
		item.meta['isKeepAlive'] = true;
		item.children &&
			item.children.forEach((c: any) => {
				let reg = new RegExp('/', 'g');
				c.name = c.name.replace(reg, '');
			});
		// 菜单是否隐藏
		item.meta['isHide'] = Boolean(item.hidden);
		if (item.children) {
			addIsKeepAlive(item.children);
		}
	});
	return datas;
};