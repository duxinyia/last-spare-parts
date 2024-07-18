<template>
	<div class="table-container layout-padding">
		<div class="table-padding layout-padding-view layout-padding-auto">
			<CodeEntryPage v-if="!route.query.tagsViewName" groupPath="/basicData/machineTool" />
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
				/>
			</template>
			<!-- 新增群组弹窗 -->
			<Dialog
				ref="dialogRef"
				:dialogConfig="state2.tableData.dialogConfig"
				@addData="addData"
				:loadingBtn="loadingBtn"
				:dialogWidth="'50%'"
				:isFootBtn="true"
			>
				<!-- <template #dialogTable="{ datas }">
					<el-form ref="tableFormRef" :model="state2.tableData" size="default">
						<Table ref="dialogTableRef" v-bind="state2.tableData" class="table-dialog" @addrow="onAddrow" @delRow="onDelRow"> </Table>
					</el-form>
				</template> -->
			</Dialog>
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
import { postMachineCreateApi, postMachineDeleteApi, postMachineQueryApi } from '/@/api/basicData/machineTool';
const router = useRouter();
const route = useRoute();

// 定义变量内容
const { t } = useI18n();
const tableRef = ref<RefType>();
const loadingBtn = ref(false);
const dialogRef = ref();
const dialogTableRef = ref();
const tableFormRef = ref();
const state = reactive<TableDemoState>({
	tableData: {
		// 列表数据（必传）
		data: [],
		// 表头内容（必传，注意格式）
		header: [
			{ key: 'matno', colWidth: '', title: '機臺料號', type: 'text', isCheck: true },
			{ key: 'name', colWidth: '', title: '機臺名稱', type: 'text', isCheck: true },
			{ key: 'modelNo', colWidth: '', title: '機臺型號', type: 'text', isCheck: true },
			{ key: 'vendor', colWidth: '', title: '供應商', type: 'text', isCheck: true },
			{ key: 'quantity', colWidth: '', title: '機臺數量', type: 'text', isCheck: true },
			{
				key: 'hasSerialNo',
				colWidth: '',
				title: '是否有編號',
				type: 'text',
				isCheck: true,
				transfer: {
					true: '是',
					false: '否',
				},
			},
		],
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
			operateWidth: 100,
		},
		topBtnConfig: [{ type: 'add', name: '新增', defaultColor: 'primary', isSure: true, disabled: true }],
		btnConfig: [{ type: 'del', name: 'message.allButton.deleteBtn', isSure: true, defaultColor: 'danger' }],
		// 搜索表单，动态生成（传空数组时，将不显示搜索，注意格式）
		search: [
			{ label: '機臺料號', prop: 'matno', placeholder: '', required: false, type: 'input', isCheck: true },
			{ label: '機臺名稱', prop: 'name', placeholder: '', required: false, type: 'input', isCheck: true },
			{ label: '機臺型號', prop: 'modelNo', placeholder: '', required: false, type: 'input', isCheck: true },
			{ label: '供應商', prop: 'vendor', placeholder: '', required: false, type: 'input', isCheck: true },
			{
				label: '是否有編號',
				prop: 'hasSerialNo',
				required: false,
				type: 'select',
				placeholder: '',
				options: [
					{ value: true, label: '是', text: '是' },
					{ value: false, label: '否', text: '否' },
				],
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
		header: [{ key: 'machineType', colWidth: '', title: '機臺', type: 'input', isCheck: true, isRequired: true }],
		// 配置项（必传）
		config: {
			total: 0, // 列表总数
			loading: false, // loading 加载
			isBorder: false, // 是否显示表格边框
			isSerialNo: true, // 是否显示表格序号
			isSelection: false, // 是否显示表格多选
			isOperate: true, // 是否显示表格操作栏
			isButton: false, //是否显示表格上面的新增删除按钮
			isInlineEditing: true, //是否是行内编辑
			isTopTool: false, //是否有表格右上角工具
			isPage: false, //是否有分页
			height: 380,
			isAddRowBtn: true,
			operateWidth: 90,
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
			{ label: '機臺料號', prop: 'matno', placeholder: '', required: true, type: 'input', isCheck: true },
			{ label: '機臺名稱', prop: 'name', placeholder: '', required: true, type: 'input', isCheck: true },
			{ label: '機臺型號', prop: 'modelNo', placeholder: '', required: true, type: 'input', isCheck: true },
			{ label: '供應商', prop: 'vendor', placeholder: '', required: true, type: 'input', isCheck: true },
			{ label: '機臺數量', prop: 'quantity', placeholder: '', required: true, type: 'number', isCheck: true, precision: 0 },
			{ label: '是否有編號', prop: 'hasSerialNo', placeholder: '', required: false, type: 'switch', isCheck: true },
		],
	},
});
// 初始化列表数据
const getTableData = async () => {
	state.tableData.config.loading = true;
	const form = state.tableData.form;
	let data: MachineQueryGet = {
		...form,
		page: state.tableData.page,
	};
	const res = await postMachineQueryApi(data, route.query.id);
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
// 返回上一页
const goBack = () => {
	router.push({
		path: '/basicData/machineTool',
	});
};
// 批量新增群组
const addData = async (ruleForm: EmptyObjectType, type: string) => {
	// if (!tableFormRef.value) return;
	// tableFormRef.value.validate(async (valid: boolean) => {
	// 	if (valid) {
	let items: EmptyArrayType = [];
	// state2.tableData.data.forEach((item: any) => {
	items.push({ ...ruleForm });
	// });
	if (items.length > 0) {
		loadingBtn.value = true;
		const res = await postMachineCreateApi({ items }, route.query.id);
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
	const res = await postMachineDeleteApi([row.id], route.query.id);
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
		padding: 15px;
		.table {
			flex: 1;
			overflow: hidden;
		}
	}
}
:deep(.download-form) {
	margin-bottom: 50px !important;
}
</style>
