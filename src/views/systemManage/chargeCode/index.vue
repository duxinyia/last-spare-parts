<template>
	<div class="table-container layout-padding">
		<div class="table-padding layout-padding-view layout-padding-auto">
			<!-- <TableSearch :search="state.tableData.search" @search="onSearch" :searchConfig="state.tableData.searchConfig" :form="state.tableData.form" /> -->
			<Table
				ref="tableRef"
				v-bind="state.tableData"
				class="table"
				@delRow="onTableDelRow"
				@pageChange="onTablePageChange"
				@sortHeader="onSortHeader"
				@openAdd="openDialog"
				@onOpenOtherDialog="openAdminDialog"
			/>
			<!-- 新增编辑弹窗 -->
			<Dialog
				ref="dialogRef"
				:dialogConfig="state.tableData.dialogConfig"
				@addData="addData"
				:loadingBtn="loadingBtn"
				dialogWidth="30%"
				:isFootBtn="isFootBtn"
				@remoteMethod="((query: string, form: EmptyObjectType)=>remoteMethod(query,form))"
			>
				<template #optionFat="{ row, items }">
					<span style="float: left">{{ t('代碼') }}：{{ row.value }}</span>
					<span style="float: right; color: var(--el-text-color-secondary)">{{ t('名稱') }}：{{ row.label }}</span>
				</template>
			</Dialog>
			<!-- 管理員彈窗 -->
			<Dialog
				ref="adminDialogRef"
				:dialogConfig="state2.tableData.dialogConfig"
				@addData="addAdminData"
				:loadingBtn="loadingBtn"
				:dialogWidth="'50%'"
				:isFootBtn="true"
			>
				<template #dialogTable="{ datas }">
					<el-form ref="tableFormRef" :model="state2.tableData" size="default">
						<Table ref="dialogTableRef" v-bind="state2.tableData" class="table-dialog" @addrow="onAddrow" @delRow="onDelRow"> </Table>
					</el-form>
				</template>
			</Dialog>
		</div>
	</div>
</template>

<script setup lang="ts" name="chargeCode">
import { defineAsyncComponent, reactive, ref, onMounted, computed, watch, nextTick } from 'vue';
import { ElMessage, FormInstance } from 'element-plus';
import { useI18n } from 'vue-i18n';
import {
	deleteGroupMemberDeleteApi,
	getCostCodeApi,
	getCostCodeGetListApi,
	getCostGetCostInfosApi,
	getManagersApi,
	postCostCodeCreateApi,
	postCostCodeUpdateApi,
	postAddManagersApi,
	postRemoveManagersApi,
} from '/@/api/systemManage/chargeCode';
// 引入组件
const Table = defineAsyncComponent(() => import('/@/components/table/index.vue'));
const TableSearch = defineAsyncComponent(() => import('/@/components/search/search.vue'));
// 引入组件
const Dialog = defineAsyncComponent(() => import('/@/components/dialog/dialog.vue'));
// 定义变量内容
const { t } = useI18n();
const dialogRef = ref();
const adminDialogRef = ref();
const tableRef = ref<RefType>();
const loadingBtn = ref(false);
const isFootBtn = ref(true);
const dialogTableRef = ref();
const tableFormRef = ref();
const state = reactive<TableDemoState>({
	tableData: {
		// 列表数据（必传）
		data: [],
		// 表头内容（必传，注意格式）
		header: [
			{ key: 'shownName', colWidth: '', title: '費用代碼', type: 'text', isCheck: true },
			{ key: 'creator', colWidth: '', title: '創建人', type: 'text', isCheck: true },
			{ key: 'createTime', colWidth: '', title: '創建時間', type: 'text', isCheck: true },
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
			isPage: false, //是否有分页
			operateWidth: 300,
		},
		topBtnConfig: [{ type: 'add', name: '新增', defaultColor: 'primary', isSure: true, disabled: true }],
		btnConfig: [
			{ type: 'admin', name: '編輯管理員', isSure: false, icon: '', defaultColor: 'success' },
			{ type: 'edit', name: 'message.allButton.editBtn', isSure: false, icon: 'ele-Edit', defaultColor: 'warning' },
			{ type: 'del', name: 'message.allButton.deleteBtn', isSure: true, defaultColor: 'danger' },
		],
		// 搜索表单，动态生成（传空数组时，将不显示搜索，注意格式）
		search: [],
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
		dialogConfig: [
			{
				label: '費用代碼',
				prop: 'costCode',
				placeholder: '請輸入選擇費用代碼',
				required: true,
				type: 'select',
				options: <any>[],
				loading: false,
				filterable: true,
				remote: true,
				isCheck: true,
				remoteShowSuffix: true,
				xs: 24,
				sm: 24,
				md: 24,
				lg: 24,
				xl: 24,
			},
			{
				label: '別名',
				prop: 'alias',
				placeholder: '',
				required: false,
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
const state2 = reactive<TableDemoState>({
	tableData: {
		// 列表数据（必传）
		data: [],
		// 表头内容（必传，注意格式）
		header: [
			{ key: 'userId', colWidth: '', title: '工号', type: 'input', isCheck: true, isRequired: true },
			{ key: 'userName', colWidth: '', title: '姓名', type: 'text', isCheck: true },
		],
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
		dialogConfig: [],
	},
});

// 初始化列表数据
const getTableData = async () => {
	state.tableData.config.loading = true;
	const res = await getCostCodeGetListApi();
	state.tableData.data = res.data;
	if (res.status) {
		state.tableData.config.loading = false;
	}
};
let options: EmptyArrayType = [];
// 費用代碼下拉
const remoteMethod = (query: string, form: EmptyObjectType) => {
	if (query) {
		state.tableData.dialogConfig![0].loading = true;
		setTimeout(async () => {
			const res = await getCostGetCostInfosApi(query);
			state.tableData.dialogConfig![0].loading = false;
			options = res.data.map((item: EmptyObjectType) => {
				return { value: `${item.costCode}`, label: `${item.costName}`, text: `${item.costCode}-${item.costName}`, selected: false };
			});
			state.tableData.dialogConfig![0].options = options;
			const runids: EmptyArrayType = [];
			res.data.forEach((item: any) => {
				runids.push(item.costCode);
			});
			if (res.data.length === 1 && runids.includes(query) && query === res.data[0].costCode) {
				form.costCode = res.data[0];
			}
		}, 800);
	}
	// else {
	// 	state.tableData.search[0].options = [];
	// 	state.tableData.dialogConfig![0].options = [];
	// }
};
// 搜索点击时表单回调
// const onSearch = (data: EmptyObjectType) => {
// 	state.tableData.form = Object.assign({}, state.tableData.form, { ...data });
// 	tableRef.value?.pageReset();
// };
// 打开新增編輯弹窗
const openDialog = async (type: string, row: EmptyObjectType) => {
	if (type === 'edit') {
		const res = await getCostCodeApi(row.id);
		row = { ...res.data };
		row.costCode = `${row.costCode}-${row.costName}`;
	}
	dialogRef.value.openDialog(type, row, '');
	const costCodedialogConfig = state.tableData.dialogConfig![0];
	costCodedialogConfig.type = type === 'edit' ? 'text' : 'select';
};
// 得到当前费用代码管理员
const getAdminData = async (id: string) => {
	const res = await getManagersApi(id);
	res.data.forEach((item: any) => {
		item.notEdit = true;
		// item.delDisabled = true;
	});
	state2.tableData.data = res.data;
};
// 打开管理员弹窗
let openDialogRow: EmptyObjectType = {};
const openAdminDialog = (scope: EmptyObjectType) => {
	openDialogRow = scope.row;
	adminDialogRef.value.openDialog('admin', scope.row, '编辑管理员');
	state2.tableData.config.loading = false;
	getAdminData(scope.row.id);
};
// 新增管理员
const onAddrow = () => {
	state2.tableData.data.push({
		userId: '',
		userName: '',
		delDisabled: false,
	});
	nextTick(() => {
		dialogTableRef.value.setScrollTop();
	});
};
//删除管理员
const onDelRow = async (row: EmptyObjectType, i: number) => {
	let userIds: EmptyArrayType = [];
	if (row.notEdit) {
		userIds.push(row.userId);
		const res = await postRemoveManagersApi(openDialogRow.id, { userIds });
		if (res.status) {
			ElMessage.success(`${t('message.allButton.deleteBtn')}${t('message.hint.success')}`);
			getAdminData(openDialogRow.id);
		}
	} else {
		state2.tableData.data.splice(i, 1);
	}
};
// 新增数据  修改数据
const addData = async (ruleForm: EmptyObjectType, type: string) => {
	loadingBtn.value = true;
	const res = type === 'add' ? await postCostCodeCreateApi(ruleForm) : await postCostCodeUpdateApi(ruleForm.id, ruleForm.alias);
	if (res.status) {
		type === 'add' ? ElMessage.success(t(`message.hint.addSuccess`)) : ElMessage.success(t(`message.hint.modifiedSuccess`));
		dialogRef.value.closeDialog();
		getTableData();
	}
	loadingBtn.value = false;
};
// 新增管理员
const addAdminData = (ruleForm: EmptyObjectType, type: string) => {
	if (!tableFormRef.value) return;
	tableFormRef.value.validate(async (valid: boolean) => {
		if (valid) {
			let userIds: EmptyArrayType = [];
			state2.tableData.data.forEach((item: any) => {
				if (!item.notEdit) {
					userIds.push(item.userId);
				}
			});
			if (userIds.length > 0) {
				loadingBtn.value = true;
				const res = await postAddManagersApi(ruleForm.id, { userIds });
				if (res.status) {
					ElMessage.success(t(`message.hint.addSuccess`));
					adminDialogRef.value.closeDialog();
					getTableData();
				}
				loadingBtn.value = false;
			} else {
				ElMessage.warning(t(`请新增管理员`));
			}
		}
	});
};

// 表格删除当前项回调
const onTableDelRow = async (row: EmptyObjectType, type: string) => {
	const res = await deleteGroupMemberDeleteApi(row.id);
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
	getTableData();
});
</script>
<style scoped lang="scss">
.table-container {
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
