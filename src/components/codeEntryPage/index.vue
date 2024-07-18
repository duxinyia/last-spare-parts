<template>
	<Table ref="tableRef" v-bind="state.tableData" class="table" @openAdd="openDialog" @onOpenOtherDialog="openGroup" />
</template>

<script setup lang="ts" name="codeEntryPage">
import { defineAsyncComponent, reactive, ref, onMounted, computed, watch, nextTick } from 'vue';
import { ElMessage, FormInstance } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { getCostCodeGetListApi } from '/@/api/systemManage/chargeCode';
// 引入组件
const Table = defineAsyncComponent(() => import('/@/components/table/index.vue'));
const props = defineProps({
	// 地址
	groupPath: {
		type: String,
		default: () => '',
	},
	btnConfig: {
		type: Array<TableButtonType>,
		default: () => [{ type: 'entry', name: '进入', isSure: false, icon: 'ele-Edit', defaultColor: 'primary' }],
	},
});
// 定义变量内容
const { t } = useI18n();
const tableRef = ref<RefType>();
const emit = defineEmits(['getRouteTableData']);
const state = reactive<TableDemoState>({
	tableData: {
		// 列表数据（必传）
		data: [],
		// 表头内容（必传，注意格式）
		header: [
			{ key: 'shownName', colWidth: '', title: '费用代码', type: 'text', isCheck: true },
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
			isButton: false, //是否显示表格上面的新增删除按钮
			isInlineEditing: false, //是否是行内编辑
			isTopTool: false, //是否有表格右上角工具
			isPage: false, //是否有分页
			operateWidth: 110,
		},
		topBtnConfig: [],
		btnConfig: props.btnConfig,
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

// 打开新增編輯弹窗
const openDialog = (type: string, row: EmptyObjectType) => {};
import { useRouter } from 'vue-router';
const router = useRouter();
const openGroup = async (scope: EmptyObjectType) => {
	const params: EmptyObjectType = { id: scope.row.id };
	params.tagsViewName = `${scope.row.shownName}`;
	router.push({
		path: props.groupPath,
		query: params,
	});
	emit('getRouteTableData');
};
// 页面加载时
onMounted(() => {
	getTableData();
});
</script>

<style scoped lang="scss"></style>
