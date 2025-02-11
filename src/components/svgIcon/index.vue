<template>
	<i v-if="isShowIconSvg" class="el-icon" :style="setIconSvgStyle" :title="title">
		<component :is="getIconName" />
	</i>
	<div v-else-if="isShowIconImg" :style="setIconImgOutStyle" :title="title">
		<img :src="getIconName" :style="setIconSvgInsStyle" />
	</div>
	<svg v-else-if="isShowLocalIconSvg" aria-hidden="true" :style="svgiconStyle" :width="width" :height="height" :title="title">
		<use :xlink:href="`#${name}`" :fill="color" />
	</svg>
	<i v-else :class="getIconName" :style="setIconSvgStyle" :title="title" />
</template>

<script setup lang="ts" name="svgIcon">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useThemeConfig } from '/@/stores/themeConfig';
const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);
// 定义父组件传过来的值
const props = defineProps({
	// svg 图标组件名字
	name: {
		type: String,
	},
	// svg 大小
	size: {
		type: Number,
		default: () => 14,
	},
	// svg 颜色
	color: {
		type: String,
	},
	// 提示
	title: {
		type: String,
	},
	// 位置
	top: {
		type: Number,
	},
	width: {
		type: String,
		default: '16px',
	},
	height: {
		type: String,
		default: '16px',
	},
});
const linesString = ['https', 'http', '/src', '/src/assets/', 'data:image', import.meta.env.VITE_PUBLIC_PATH];

// 获取 icon 图标名称
const getIconName = computed(() => {
	return props?.name;
});
// 用于判断 element plus 自带 svg 图标的显示、隐藏
const isShowIconSvg = computed(() => {
	return props?.name?.startsWith('ele-');
});
// 用于判断在线链接、本地引入等图标显示、隐藏
const isShowIconImg = computed(() => {
	return linesString.find((str) => props.name?.startsWith(str));
});
const isShowLocalIconSvg = computed(() => {
	return props?.name?.startsWith('icon-');
});
// 设置图标样式
const setIconSvgStyle = computed(() => {
	return `font-size: ${props.size}px;color: ${props.color};`;
});
// 设置图片样式
const setIconImgOutStyle = computed(() => {
	return `width: ${props.size}px;height: ${props.size}px;display: inline-block;overflow: hidden;`;
});
// svg图标样式
const svgiconStyle = computed(() => {
	let { isCollapse, layout } = themeConfig.value;
	return `margin-right: ${!isCollapse || layout === 'classic' || document.body.clientWidth < 1000 ? props.size : '0px'};color: ${
		props.color
	}!important;`;
});
// 设置图片样式
const setIconSvgInsStyle = computed(() => {
	const filterStyle: string[] = [];
	const compatibles: string[] = ['-webkit', '-ms', '-o', '-moz'];
	compatibles.forEach((j) => filterStyle.push(`${j}-filter: drop-shadow(${props.color} 30px 0);`));
	return `width: ${props.size}px;height: ${props.size}px;position: relative;left: -${props.size}px;${filterStyle.join('')}`;
});
</script>
