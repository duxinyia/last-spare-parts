<template>
	<div class="table-container layout-padding">
		<div class="table-padding layout-padding-view layout-padding-auto">
			<CodeEntryPage
				v-if="!route.query.tagsViewName"
				groupPath="/basicData/machineType"
				:btnConfig="[{ type: 'machine', name: '进入', isSure: false, icon: 'ele-Edit', defaultColor: 'primary' }]"
			/>
			<template v-else>
				<el-button class="button" style="width: 30px" size="small" plain @click="goBack">
					<el-icon title="返回" size="20px"> <ele-Back /> </el-icon
				></el-button>

				<TableSearch :search="state.tableData.search" @search="onSearch" :searchConfig="state.tableData.searchConfig" :form="state.tableData.form" />
				<Table
					ref="tableRef"
					v-bind="state.tableData"
					class="table"
					@delRow="onTableDelRow"
					@pageChange="onTablePageChange"
					@sortHeader="onSortHeader"
					@openAdd="openDialog"
					@onOpenOtherDialog="openMPS"
				/>
			</template>
			<!-- 新增群组弹窗 -->
			<Dialog
				ref="dialogRef"
				:dialogConfig="state2.tableData.dialogConfig"
				@addData="addData"
				:loadingBtn="loadingBtn"
				:dialogWidth="'20%'"
				:isFootBtn="true"
			>
				<!-- <template #dialogTable="{ datas }">
					<el-form ref="tableFormRef" :model="state2.tableData" size="default">
						<Table ref="dialogTableRef" v-bind="state2.tableData" class="table-dialog" @addrow="onAddrow" @delRow="onDelRow"> </Table>
					</el-form>
				</template> -->
			</Dialog>
			<!-- MPS弹窗 -->
			<el-dialog draggable :close-on-click-modal="false" v-model="mpsdialogVisible" title="MPS" width="80%">
				<el-carousel :autoplay="false" arrow="always" indicator-position="none">
					<el-carousel-item>
						<div>
							<el-calendar :v-model="new Date()" ref="calendar">
								<template #header="{ date }">
									<span>{{ date }}</span>
								</template>
								<template #date-cell="{ data }">
									<p>
										<!-- {{ mpsData[data.day.toString()] ? mpsData[data.day.toString()] : '' }} -->
									</p>
								</template>
							</el-calendar>
							<el-calendar v-model="timeValue" ref="calendar">
								<template #header="{ date }">
									<span>{{ date }}</span>
								</template>
							</el-calendar>
						</div>
					</el-carousel-item>
				</el-carousel>
			</el-dialog>
		</div>
	</div>
</template>

<script setup lang="ts" name="machineType">
import { defineAsyncComponent, reactive, ref, onMounted, computed, watch, nextTick } from 'vue';
import { ElMessage, FormInstance } from 'element-plus';
import { useI18n } from 'vue-i18n';
// 引入组件
const Table = defineAsyncComponent(() => import('/@/components/table/index.vue'));
// 引入组件
const TableSearch = defineAsyncComponent(() => import('/@/components/search/search.vue'));
const Dialog = defineAsyncComponent(() => import('/@/components/dialog/dialog.vue'));

const CodeEntryPage = defineAsyncComponent(() => import('/@/components/codeEntryPage/index.vue'));
import { useRouter, useRoute } from 'vue-router';
import {
	getQueryMachineTypeMPSApi,
	postMachineTypeCreateApi,
	postMachineTypeDeleteApi,
	postQueryMachineTypesApi,
} from '/@/api/basicData/machineType';
const router = useRouter();
const route = useRoute();

// 定义变量内容
const timeValue = ref(new Date(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate()));
const { t } = useI18n();
const tableRef = ref<RefType>();
const loadingBtn = ref(false);
const dialogRef = ref();
const dialogTableRef = ref();
const mpsdialogVisible = ref(false);
const state = reactive<TableDemoState>({
	tableData: {
		// 列表数据（必传）
		data: [],
		// 表头内容（必传，注意格式）
		header: [{ key: 'machineType', colWidth: '', title: '機種', type: 'text', isCheck: true }],
		// 配置项（必传）
		config: {
			total: 0, // 列表总数
			loading: true, // loading 加载
			isBorder: false, // 是否显示表格边框
			isSerialNo: true, // 是否显示表格序号
			isSelection: false, // 是否显示表格多选
			isOperate: true, // 是否显示表格操作栏
			isButton: true, //是否显示表格上面的新增删除按钮
			isInlineEditing: false, //是否是行内编辑
			isTopTool: false, //是否有表格右上角工具
			isPage: true, //是否有分页
			operateWidth: 190,
		},
		topBtnConfig: [{ type: 'add', name: '新增', defaultColor: 'primary', isSure: true, disabled: true }],
		btnConfig: [
			{ type: 'mps', name: '获取MPS', isSure: false, defaultColor: 'success' },
			{ type: 'del', name: 'message.allButton.deleteBtn', isSure: true, defaultColor: 'danger' },
		],
		// 搜索表单，动态生成（传空数组时，将不显示搜索，注意格式）
		search: [
			{
				label: '機種',
				prop: 'machineType',
				required: false,
				type: 'input',
				placeholder: '',
			},
		],
		searchConfig: {
			isSearchBtn: true,
		},
		// 给后端的数据
		form: {},
		// 搜索参数（不用传，用于分页、搜索时传给后台的值，`getTableData` 中使用）
		page: {
			pageNum: 1,
			pageSize: 10,
		},
		// 打印标题
		printName: '',
		// 弹窗表单
		dialogConfig: [],
	},
});
const state2 = reactive<TableDemoState>({
	tableData: {
		// 列表数据（必传）
		data: [],
		// 表头内容（必传，注意格式）
		header: [{ key: 'machineType', colWidth: '', title: '機種', type: 'input', isCheck: true, isRequired: true }],
		// 配置项（必传）
		config: {
			total: 0, // 列表总数
			loading: false, // loading 加载
			isBorder: false, // 是否显示表格边框
			isSerialNo: true, // 是否显示表格序号
			isSelection: false, // 是否显示表格多选
			isOperate: true, // 是否显示表格操作栏
			isButton: true, //是否显示表格上面的新增删除按钮
			isInlineEditing: false, //是否是行内编辑
			isTopTool: false, //是否有表格右上角工具
			isPage: false, //是否有分页
			height: 380,
			isAddRowBtn: true,
			operateWidth: 120,
		},
		topBtnConfig: [{ type: 'add', name: '新增', defaultColor: 'primary', isSure: true, disabled: true }],
		btnConfig: [{ type: 'del', name: 'message.allButton.deleteBtn', isSure: true, defaultColor: 'danger' }],
		// 搜索表单，动态生成（传空数组时，将不显示搜索，注意格式）
		search: [],
		searchConfig: {
			isSearchBtn: false,
		},
		// 给后端的数据
		form: {},
		// 搜索参数（不用传，用于分页、搜索时传给后台的值，`getTableData` 中使用）
		page: {
			pageNum: 1,
			pageSize: 10,
		},
		// 打印标题
		printName: '',
		// 弹窗表单
		dialogConfig: [
			{
				label: '機種',
				prop: 'machineType',
				placeholder: '',
				required: true,
				type: 'input',
				xs: 24,
				sm: 24,
				md: 24,
				lg: 24,
				xl: 24,
				isCheck: true,
			},
		],
	},
});
// 初始化列表数据
const getTableData = async () => {
	state.tableData.config.loading = true;
	const form = state.tableData.form;
	let data = {
		...form,
		page: state.tableData.page,
	};
	const res = await postQueryMachineTypesApi(data, route.query.id);
	state.tableData.data = res.data.items;
	state.tableData.config.total = res.data.totalCount;
	if (res.status) {
		state.tableData.config.loading = false;
	}
};

// 打开新增編輯弹窗
const openDialog = (type: string, row: EmptyObjectType) => {
	// state2.tableData.data = [
	// 	{
	// 		userId: '',
	// 	},
	// ];
	dialogRef.value.openDialog(type, row, '');
};
// 获取某机种两个月MPS
const mpsData = ref();
const getMachineTypeMPS = async (data: EmptyObjectType) => {
	const res = await getQueryMachineTypeMPSApi(data);
	mpsData.value = res.data;
	console.log(mpsData.value);
};
// 打开MPS
const openMPS = (scope: EmptyObjectType, type: string) => {
	mpsdialogVisible.value = true;
	const { id } = scope.row;
	const getData = {
		MachineTypeId: id,
		Year: new Date().getFullYear().toString(),
		StartMonth: '7',
	};
	getMachineTypeMPS(getData);
	console.log(scope);
};
// 返回上一页
const goBack = () => {
	router.push({
		path: '/basicData/machineType',
	});
};
// 批量新增群组
const addData = async (ruleForm: EmptyObjectType, type: string) => {
	// if (!tableFormRef.value) return;
	// tableFormRef.value.validate(async (valid: boolean) => {
	// 	if (valid) {
	let machineTypes: EmptyArrayType = [];
	// state2.tableData.data.forEach((item: any) => {
	machineTypes.push(ruleForm.machineType);
	// });
	if (machineTypes.length > 0) {
		loadingBtn.value = true;
		const res = await postMachineTypeCreateApi({ machineTypes }, route.query.id);
		if (res.status) {
			ElMessage.success(t(`message.hint.addSuccess`));
			dialogRef.value.closeDialog();
			getTableData();
		}
		loadingBtn.value = false;
		// } else {
		// 	ElMessage.warning(t(`请新增`));
		// }
	}
	// });
};
// 新增一行
const onAddrow = () => {
	state2.tableData.data.push({
		userId: '',
	});
	nextTick(() => {
		dialogTableRef.value.setScrollTop();
	});
};
//删除群组
const onDelRow = async (row: EmptyObjectType, i: number) => {
	state2.tableData.data.splice(i, 1);
};
// 搜索点击时表单回调
const onSearch = (data: EmptyObjectType) => {
	state.tableData.form = Object.assign({}, state.tableData.form, { ...data });
	tableRef.value?.pageReset();
};
// 表格删除当前项回调
const onTableDelRow = async (row: EmptyObjectType, type: string) => {
	const res = await postMachineTypeDeleteApi({ machineTypeIds: [row.id] }, route.query.id);
	if (res.status) {
		ElMessage.success(`${t('message.allButton.deleteBtn')} ${t('message.hint.success')}`);
		getTableData();
	}
};
// 分页改变时回调
const onTablePageChange = (page: TableDemoPageType) => {
	state.tableData.page.pageNum = page.pageNum;
	state.tableData.page.pageSize = page.pageSize;
	getTableData();
};
// 拖动显示列排序回调
const onSortHeader = (data: TableHeaderType[]) => {
	state.tableData.header = data;
};
// 页面加载时
onMounted(() => {
	if (!route.query.tagsViewName) return;
	getTableData();
});
</script>

<style scoped lang="scss">
.table-container {
	// width: 100%;
	.table-padding {
		padding: 0.0781rem;
		.table {
			flex: 1;
			overflow: hidden;
		}
	}
}
:deep(.download-form) {
	margin-bottom: 0.2604rem !important;
}
:deep(.el-carousel__container) {
	height: 545px !important;
}

.el-carousel__item > div {
	color: #475669;
	// height: 100%;
	justify-content: center;
	align-items: center;
	display: flex;
	margin: 0 50px;
	text-align: center;
	// .content {
	// 	margin: 0 10px;
	// 	width: 20%;
	// 	height: 100px;
	// 	border: 1px solid var(--el-color-primary-light-6);
	// 	div {
	// 		height: 50%;
	// 		display: flex;
	// 		flex-direction: column;
	// 		justify-content: center;
	// 		align-items: center;
	// 	}
	// }
}
:deep(.el-carousel__arrow) {
	background-color: var(--el-color-primary);
	color: #fff;
}
</style>
