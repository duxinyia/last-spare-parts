<template>
	<div :class="{ main: !isDialog }" class="main-detail" :style="!isDialog ? 'height: 535px' : ''">
		<div class="table-container" :class="{ 'link-width': !isDialog }">
			<nav v-if="!isDialog" class="pb10">程式發佈詳情</nav>
			<el-form v-if="state.tableData.form" ref="tableSearchRef" :model="state.tableData.form" size="default" label-width="auto">
				<el-row :gutter="35">
					<el-col
						:xs="val.xs || 24"
						:sm="val.sm || 12"
						:md="val.md || 12"
						:lg="val.lg || 12"
						:xl="val.xl || 12"
						class="mb10"
						v-for="(val, key) in state.tableData.search"
						:key="val.prop"
					>
						<el-form-item :label="$t(val.label)" :prop="val.prop">
							<span v-if="val.type === 'text'" style="width: 100%; font-weight: 700; color: #1890ff; word-break: break-all">
								{{
									state.tableData.form.programType && val.transfer
										? $t(val.transfer[state.tableData.form.programType])
										: state.tableData.form[val.prop]
								}}
							</span>
							<span v-if="val.type === 'link'">
								<a style="word-break: break-all" target="_blank" href="javascript:;" @click="clickLink(val.prop)">{{
									state.tableData.form[val.prop]
								}}</a>
							</span>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<Table v-bind="state.tableData" class="table" />
		</div>
	</div>
</template>

<script setup lang="ts" name="programReleaseLink">
import { useRoute, useRouter } from 'vue-router';
import { defineAsyncComponent, reactive, ref, onMounted, watch } from 'vue';
import { ElMessage } from 'element-plus';
// 引入组件
import { useI18n } from 'vue-i18n';
import { getPublishDetailApi } from '/@/api/programManagement/programRelease';
// 引入组件
const Table = defineAsyncComponent(() => import('/@/components/table/index.vue'));
const { t } = useI18n();
const route = useRoute();
const router = useRouter();
// 定义父组件传过来的值
const props = defineProps({
	isDialog: {
		type: Boolean,
		default: () => false,
	},
	checkNoRef: {
		type: Object,
		default: () => {},
	},
});
const state = reactive<TableDemoState>({
	tableData: {
		// 列表数据（必传）
		data: [],
		// 表头内容（必传，注意格式）
		header: [
			// { key: 'line', colWidth: '', title: '線體', type: 'text', isCheck: true },
			{ key: 'stationName', colWidth: '', title: 'message.pages.stationName', type: 'text', isCheck: true },
			{ key: 'stationCode', colWidth: '', title: 'message.pages.stationCode', type: 'text', isCheck: true, isRequired: false },
			{ key: 'machineType', colWidth: '', title: 'message.pages.machineType', type: 'text', isCheck: true },
		],
		// 配置项（必传）
		config: {
			total: 0, // 列表总数
			loading: false, // loading 加载
			isBorder: false, // 是否显示表格边框
			isSerialNo: true, // 是否显示表格序号
			isSelection: false, // 是否显示表格多选
			isOperate: false, // 是否显示表格操作栏
			isButton: false, //是否显示表格上面的新增删除按钮
			isInlineEditing: false, //是否是行内编辑
			isTopTool: false, //是否有表格右上角工具
			isPage: false, //是否有分页
			isDialogTab: true, //是否是弹窗里面的表格
			height: 200,
		},
		// 给后端的数据
		form: {},
		// 搜索表单，动态生成（传空数组时，将不显示搜索，注意格式）
		search: [
			{ type: 'text', label: 'message.pages.projectName', placeholder: '', prop: 'projectName', required: false },
			{ type: 'text', label: 'message.pages.productionlinetype', placeholder: '', prop: 'productionLineType', required: false },
			{ type: 'text', label: 'message.pages.stage', placeholder: '', prop: 'stage', required: false },
			{
				label: 'message.pages.projectCode',
				prop: 'projectCode',
				placeholder: '',
				required: false,
				type: 'text',
				standbyType: 'text',
				isCheck: true,
			},
			{
				label: 'message.pages.programName',
				prop: 'programName',
				placeholder: '',
				required: false,
				type: 'text',
				standbyType: 'text',
				isCheck: true,
			},
			{
				type: 'link',
				label: 'message.pages.packageName',
				placeholder: '',
				prop: 'programAttName',
				required: false,
				xs: 24,
				sm: 24,
				md: 24,
				lg: 24,
				xl: 24,
			},
			{
				type: 'text',
				label: 'message.pages.releaseType',
				placeholder: '',
				prop: 'programType',
				required: false,
				transfer: {
					1: 'message.pages.basePackage',
					2: 'message.pages.patchPackage',
					3: 'message.pages.completePackage',
				},
			},
			{ type: 'text', label: 'message.pages.programVersion', placeholder: '', prop: 'version', required: false },
			{ type: 'text', label: 'message.pages.packageSize', placeholder: '', prop: 'fileSize', required: false },
			{ type: 'text', label: 'message.pages.releaseTime', placeholder: '', prop: 'createTime', required: false },
			{ type: 'link', label: 'LWS', placeholder: '', prop: 'lwsFileName', required: false, xs: 24, sm: 24, md: 24, lg: 24, xl: 24 },
			{ type: 'text', label: 'message.pages.publishers', placeholder: '', prop: 'creator', required: false },
			{
				type: 'text',
				label: 'CheckSum',
				placeholder: '',
				prop: 'checksum',
				required: false,
				xs: 24,
				sm: 24,
				md: 24,
				lg: 24,
				xl: 24,
			},
			{
				type: 'text',
				label: 'message.pages.updateDescription',
				placeholder: '',
				prop: 'describe',
				required: false,
				xs: 24,
				sm: 24,
				md: 24,
				lg: 24,
				xl: 24,
			},
			// { type: 'text', label: 'message.pages.releaseStatus', placeholder: '', prop: 'runStatusText', required: false },
			// { type: 'link', label: '下載程式包', placeholder: '', prop: 'filePath', required: false, xs: 24, sm: 24, md: 24, lg: 24, xl: 24 },
		],
		dialogConfig: [],
		btnConfig: [],
		// 搜索参数（不用传，用于分页、搜索时传给后台的值，`getTableData` 中使用）
		page: {
			pageNum: 1,
			pageSize: 10,
		},
	},
});
watch(
	() => props.checkNoRef,
	() => {
		getTableData();
	}
);
// 点击文件
const clickLink = (prop: string) => {
	// data[scope.$index][item.key + 'Link']
	console.log(state.tableData.form);
	let path = prop === 'programAttName' ? state.tableData.form['filePath'] : state.tableData.form['lwsFilePath'];
	window.open(path, '_blank');
	// window.open(`${import.meta.env.MODE === 'development' ? import.meta.env.VITE_API_URL : window.webConfig.webApiBaseUrl}${path}`, '_blank');
};
// 初始化数据
// link/programReleaseLink?comkey=2eca7c4b-6995-4ba4-a596-b5497f214990
const getTableData = async () => {
	state.tableData.config.loading = true;
	state.tableData.config['height'] = props.isDialog ? 300 : 200;
	let comkey = props.isDialog ? props.checkNoRef.publishId : route.query.comkey;
	let allData: EmptyObjectType = {};
	if (props.isDialog) {
		allData = { ...props.checkNoRef };
		state.tableData.config.loading = false;
	} else {
		const res = await getPublishDetailApi(comkey);
		allData = res.data;
		if (res.status) {
			state.tableData.config.loading = false;
		} else {
			state.tableData.form = {};
		}
	}
	// const programTypeMap: EmptyObjectType = {
	// 	1: '基礎包',
	// 	2: '補丁包',
	// 	3: '完整包',
	// };
	// allData.programType = allData.programType;
	allData.creator = `${allData.creator} / ${allData.creatorName}`;
	allData.fileSize = `${allData.fileSize} MB`;
	state.tableData.form = allData;
	state.tableData.data = allData.stationMachines;
};

// 页面加载时
onMounted(() => {
	getTableData();
});
</script>

<style scoped lang="scss">
:deep(.table-form) {
	width: 100% !important;
}
.main {
	overflow: auto;
	padding: 0 25%;
	// width: 100%;
	background-color: white;
	display: flex;
	align-items: center;
	justify-content: center;
}

.table-container {
	width: 100%;
	height: 100%;
}
.link-width {
	width: 100% !important;
}
nav {
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 20px;
}
// .box-card {
// 	width: 1000px;
// }
.describe {
	display: flex;
	margin-top: 10px;
	span {
		width: 100px;
	}
}
</style>
