<template>
	<div class="main-login">
		<div class="login-container"></div>
		<!-- 公司logo -->
		<div class="login-top">
			<div class="login-top-logo">
				<img :src="logoMini" />
			</div>
		</div>
		<div class="login-bottom">
			<div class="login-right-warp flex-margin">
				<div class="login-right-warp-mian">
					<div class="login-right-warp-main-title">欢迎登录{{ $t(getThemeConfig.globalTitle) }}</div>
					<div class="login-right-warp-main-form">
						<div>
							<Account />
						</div>
					</div>
				</div>
			</div>
		</div>
		<!-- 底部描述框 -->
		<transition
			appear
			mode="out-in"
			:duration="1000"
			enter-active-class="animate__animated animate__backInUp"
			leave-active-class="animate__animated animate__fadeOutRight"
		>
			<div class="copyright-info">
				<div class="copyright">
					<el-icon class="icon"><ele-CollectionTag /></el-icon>
					Copyright © 2023. Foxconn All rights reserved
				</div>
				<div class="author-info">
					<div>
						<!-- <span class="author">
							<el-icon class="icon"><ele-UserFilled /></el-icon>陳亞君/5060-85855
						</span>
						<span class="mail">
							<el-icon class="icon"><ele-Message /></el-icon>wwlh-wwfol-chen.yj@mail.foxconn.com
						</span> -->
						&nbsp;&nbsp;
						<span class="author">
							<el-icon class="icon"><ele-UserFilled /></el-icon>孫千禧/5060-76343
						</span>
						<span class="mail">
							<el-icon class="icon"><ele-Message /></el-icon>wwjc-mis-net@mail.foxconn.com
						</span>
						&nbsp;&nbsp;
						<span class="author">
							<el-icon class="icon"><ele-UserFilled /></el-icon>杜欣怡/82585
						</span>
						<span class="mail">
							<el-icon class="icon"><ele-Message /></el-icon>wwlh-mis-feweb@mail.foxconn.com
						</span>
					</div>
				</div>
				<!-- <div class="address">
					{{ textAddress }}系統地址：
					<a target="" :title="`點擊跳轉到${textAddress}系統地址`" :href="systemAddress">{{ systemAddress }}</a>
				</div> -->
			</div>
		</transition>
	</div>
</template>

<script setup lang="ts" name="loginIndex">
import { defineAsyncComponent, onMounted, reactive, computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useThemeConfig } from '/@/stores/themeConfig';
import { NextLoading } from '/@/utils/loading';
import logoMini from '/@/assets/images/new_logo.png';
import { useI18n } from 'vue-i18n';
// 引入组件
const Account = defineAsyncComponent(() => import('/@/views/login/component/account.vue'));

// 定义变量内容
const { t } = useI18n();
const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);
const state = reactive({
	tabsActiveName: 'account',
	isScan: false,
});
const systemAddress = ref('');
const textAddress = ref('');
// 获取布局配置信息
const getThemeConfig = computed(() => {
	return themeConfig.value;
});
// 页面加载时
onMounted(() => {
	NextLoading.done();
	systemAddress.value = window.webConfig.systemAddress;
	textAddress.value = window.webConfig.text;
});
</script>

<style scoped lang="scss">
.main-login {
	width: 100%;
	height: 100%;
}
.login-container {
	height: 100%;
	background: url('../../assets/images/login-page.png') no-repeat center;
	position: relative;
	// background-size: 100% 100%;
}
.login-top {
	height: 120px;
	margin-right: 100px;
	.login-top-logo {
		position: absolute;
		top: 30px;
		left: 47px;
		z-index: 1;
		animation: logoAnimation 0.3s ease;
		img {
			width: 210px;
			height: 48px;
		}
	}

	.login-left-waves {
		position: absolute;
		top: 0;
		right: -100px;
	}
}
.login-bottom {
	position: absolute;
	top: 47%;
	left: 72%;
	transform: translate(-50%, -50%);
	.login-bottom-img {
		// position: absolute;
		// top: 50%;
		// left: 50%;
		// transform: translate(-50%, -50%);
		width: 50%;
		// height: 52%;
		img {
			width: 100%;
			height: 100%;
			animation: error-num 0.6s ease;
		}
	}
	.login-right-warp {
		// border: 1px solid var(--el-color-primary-light-3);
		border-radius: 3px;
		width: 500px;
		height: 550px;
		position: relative;
		overflow: hidden;
		background-color: transparent;
		.login-right-warp-mian {
			display: flex;
			flex-direction: column;
			height: 100%;
			.login-right-warp-main-title {
				color: #ff855f;
				height: 81px;
				line-height: 52px;
				font-size: 32px;
				text-align: center;
				letter-spacing: 3px;
				animation: logoAnimation 0.3s ease;
				animation-delay: 0.3s;
				font-weight: 600;
				// font-style: italic;
				// color: var(--el-text-color-primary);
			}
			.login-right-warp-main-form {
				flex: 1;
				padding: 0 50px 50px;
				.login-content-main-sacn {
					position: absolute;
					top: 0;
					right: 0;
					width: 50px;
					height: 50px;
					overflow: hidden;
					cursor: pointer;
					transition: all ease 0.3s;
					color: var(--el-color-primary);
					&-delta {
						position: absolute;
						width: 35px;
						height: 70px;
						z-index: 2;
						top: 2px;
						right: 21px;
						background: var(--el-color-white);
						transform: rotate(-45deg);
					}
					&:hover {
						opacity: 1;
						transition: all ease 0.3s;
						color: var(--el-color-primary) !important;
					}
					i {
						width: 47px;
						height: 50px;
						display: inline-block;
						font-size: 48px;
						position: absolute;
						right: 1px;
						top: 0px;
					}
				}
			}
		}
	}
}
.copyright-info {
	position: fixed;
	width: 100%;
	bottom: 2.6042vw;
	font-size: 14px;
	margin: auto;
	text-align: center;
	// color: var(--next-color-white);
	color: #383838;
	.copyright {
		.location {
			margin-left: 10px;
			cursor: pointer;
			color: yellow;
		}
	}
	.icon {
		margin-right: 4px;
		vertical-align: middle;
	}
	.author-info {
		margin-top: 2px;
		.author {
			margin-right: 10px;
		}
	}
}
.address {
	margin-top: 15px;
	a {
		color: yellow;
		cursor: pointer;
	}
}
</style>
