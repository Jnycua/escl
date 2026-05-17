<template>
	<view class="marketplace-page">
		<!-- 顶部搜索 + 发布 + 刷新 -->
		<view class="top-bar">
			<button class="publish-btn" @click="goToPublish">发布</button>
			<input class="search-input" placeholder="搜索商品名称、类别或描述" v-model="searchText" />
			<button class="refresh-btn" @click="refreshItems">⟳</button>
		</view>

		<!-- 分类标签 -->
		<scroll-view class="category-scroll" scroll-x="true" show-scrollbar="false">
			<view class="category-bar">
				<view v-for="cat in categories" :key="cat.id"
					:class="['category-btn', selectedCategory === cat.id ? 'active' : '']"
					@click="selectCategory(cat.id)">
					{{ cat.name }}
				</view>
			</view>
		</scroll-view>

		<!-- 商品列表 -->
		<scroll-view class="items-list" scroll-y="true">
			<view v-for="item in filteredItems" :key="item.id" class="item-card" @click="goToDetail(item.id)">
				<image :src="item.image || defaultImage" class="item-image" mode="aspectFill" />
				<view class="item-info">
					<text class="item-title">{{ item.title }}</text>
					<text class="item-desc">{{ item.description }}</text>
					<view class="item-extra">
						<text class="item-location">📍 {{ item.location }}</text>
						<text class="item-time">⏰ {{ item.time }}</text>
					</view>
					<text class="item-price">¥{{ item.price }}</text>
				</view>
			</view>
		</scroll-view>

		<view v-if="filteredItems.length === 0" class="empty-tip">
			暂无商品，快去发布吧~
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		computed,
		onMounted
	} from 'vue'

	const defaultImage = '/static/default-product.png'
	const searchText = ref('')

	// 分类标签
	const categories = ref([{
			id: 0,
			name: '数码电子'
		},
		{
			id: 1,
			name: '生活用品'
		},
		{
			id: 2,
			name: '学习资料'
		},
		{
			id: 3,
			name: '运动户外'
		}
	])
	const selectedCategory = ref(0)

	// 模拟商品数据
	const mockData = [{
			id: 1,
			title: 'MacBook Air M1 8G 256G',
			description: '轻薄便携，性能强劲，电池续航优秀',
			price: 3680,
			location: '教学楼附近',
			time: '2小时前',
			category: 0,
			image: 'https://via.placeholder.com/150'
		},
		{
			id: 2,
			title: '机械键盘（青轴）',
			description: '手感好，灯光炫酷，配件齐全',
			price: 120,
			location: '宿舍楼A区',
			time: '5小时前',
			category: 0,
			image: 'https://via.placeholder.com/150'
		},
		{
			id: 3,
			title: '高等数学（第七版）上下册',
			description: '同济版，课本全新无笔记',
			price: 45,
			location: '图书馆附近',
			time: '1天前',
			category: 2,
			image: 'https://via.placeholder.com/150'
		},
		{
			id: 4,
			title: '帆布包 + 挂件',
			description: '日系风格，容量大，适合日常出行',
			price: 25,
			location: '宿舍楼B区',
			time: '1天前',
			category: 1,
			image: 'https://via.placeholder.com/150'
		}
	]

	const items = ref([])

	const fetchItems = async () => {
		await new Promise(resolve => setTimeout(resolve, 300))
		items.value = mockData
	}

	const filteredItems = computed(() => {
		return items.value
			.filter(i => selectedCategory.value === 0 || i.category === selectedCategory.value)
			.filter(i => i.title.includes(searchText.value) || i.description.includes(searchText.value))
	})

	const selectCategory = (id) => {
		selectedCategory.value = id
	}

	const goToDetail = (id) => {
		uni.navigateTo({
			url: `/pages/detail/marketDetail?id=${id}`
		})
	}

	const goToPublish = () => {
		uni.navigateTo({
			url: '/pages/detail/marketSend'
		})
	}

	const refreshItems = () => {
		fetchItems()
	}

	onMounted(() => {
		fetchItems()
	})
</script>

<style scoped>
	/* 定义全局蓝色变量，方便后续修改 */
	:root {
		--theme-color: #007aff;
	}

	.marketplace-page {
		background-color: #f2f4f7;
		padding: 20rpx;
		min-height: 100vh;
	}

	/* 顶部搜索栏 */
	.top-bar {
		display: flex;
		align-items: center;
		gap: 15rpx;
		margin-bottom: 20rpx;
	}

	/* 发布按钮 - 蓝色实心 */
	.publish-btn {
		padding: 0 30rpx;
		height: 64rpx;
		line-height: 64rpx;
		border-radius: 32rpx;
		background-color: #007aff;
		color: #ffffff;
		font-size: 28rpx;
		border: none;
		margin: 0;
		box-shadow: 0 4rpx 12rpx rgba(0, 122, 255, 0.3);
	}

	/* 搜索框 */
	.search-input {
		flex: 1;
		height: 64rpx;
		padding: 0 24rpx;
		border-radius: 32rpx;
		background-color: #ffffff;
		font-size: 26rpx;
		color: #333;
		border: 1rpx solid #e5e5e5;
	}

	/* 刷新按钮 - 蓝色实心 */
	.refresh-btn {
		width: 64rpx;
		height: 64rpx;
		border-radius: 32rpx;
		background-color: #007aff;
		color: #ffffff;
		border: none;
		margin: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
		padding: 0;
	}

	/* 分类标签滚动区域 */
	.category-scroll {
		white-space: nowrap;
		margin-bottom: 20rpx;
		padding-bottom: 4rpx;
		/* 隐藏滚动条 */
	}

	.category-bar {
		display: flex;
		gap: 20rpx;
		padding: 0 10rpx;
	}

	/* 分类按钮 - 胶囊风格 */
	.category-btn {
		padding: 10rpx 30rpx;
		border-radius: 30rpx;
		font-size: 26rpx;
		color: #666666;
		background-color: #e5e5e5;
		/* 默认浅灰底 */
		border: 1rpx solid #e5e5e5;
		transition: all 0.3s ease;
	}

	/* 分类按钮 - 选中状态 */
	.category-btn.active {
		background-color: #e6f2ff;
		/* 选中浅蓝底 */
		color: #007aff;
		/* 选中文字蓝色 */
		border-color: #007aff;
		/* 选中边框蓝色 */
		font-weight: 600;
	}

	/* 商品列表 */
	.items-list {
		display: flex;
		flex-direction: column;
		gap: 20rpx;
	}

	.item-card {
		display: flex;
		background-color: #ffffff;
		border-radius: 20rpx;
		overflow: hidden;
		padding: 20rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.03);
		border: 1rpx solid #f0f0f0;
	}

	.item-image {
		width: 160rpx;
		height: 160rpx;
		border-radius: 16rpx;
		margin-right: 24rpx;
		background-color: #f9f9f9;
	}

	.item-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding-top: 4rpx;
	}

	.item-title {
		font-size: 30rpx;
		font-weight: bold;
		color: #333;
		line-height: 1.4;
	}

	.item-desc {
		font-size: 24rpx;
		color: #888888;
		line-height: 1.4;
	}

	.item-extra {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 8rpx;
	}

	.item-location {
		font-size: 22rpx;
		color: #999;
		background-color: #f5f5f5;
		padding: 4rpx 12rpx;
		border-radius: 8rpx;
	}

	.item-time {
		font-size: 22rpx;
		color: #bbb;
	}

	/* 价格 - 蓝色高亮 */
	.item-price {
		font-size: 32rpx;
		color: #007aff;
		font-weight: bold;
		align-self: flex-end;
		/* 靠右对齐 */
		margin-top: 8rpx;
	}

	/* 空状态 */
	.empty-tip {
		text-align: center;
		font-size: 28rpx;
		color: #999;
		margin-top: 100rpx;
	}
</style>