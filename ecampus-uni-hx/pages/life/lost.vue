<template>
	<view class="lost-page">
		<!-- 顶部栏 -->
		<view class="top-bar">
			<button class="publish-btn" @click="goToPublish">发布失物</button>
			<input class="search-input" placeholder="搜索" v-model="searchText" />
			<button class="refresh-btn" @click="refreshItems">⟳</button>
		</view>

		<!-- 分类标签 -->
		<scroll-view class="category-scroll" scroll-x="true" show-scrollbar="false">
			<view class="category-bar">
				<view v-for="cat in categories" :key="cat.id"
					:class="['category-btn', selectedCategory===cat.id?'active':'']" @click="selectCategory(cat.id)">
					{{ cat.name }}
				</view>
			</view>
		</scroll-view>

		<!-- 失物列表 -->
		<scroll-view class="items-list" scroll-y="true">
			<view v-for="item in filteredItems" :key="item.id" class="item-card" @click="goToDetail(item.id)">
				<image :src="item.image || defaultImage" class="item-image" mode="aspectFill" />
				<view class="item-info">
					<text class="item-title">{{ item.title }}</text>
					<text class="item-desc">{{ item.shortDesc }}</text>
					<view class="item-extra">
						<text class="item-location">📍 {{ item.location }}</text>
						<text class="item-time">{{ item.time }}</text>
					</view>
				</view>
			</view>
		</scroll-view>

		<view v-if="filteredItems.length===0" class="empty-tip">暂无失物</view>
	</view>
</template>

<script setup>
	import {
		ref,
		computed,
		onMounted
	} from 'vue'

	const defaultImage = '/static/default-item.png'
	const searchText = ref('')

	const categories = ref([{
			id: 0,
			name: '数码电子产品'
		},
		{
			id: 1,
			name: '书籍文具'
		},
		{
			id: 2,
			name: '衣物服饰'
		},
		{
			id: 3,
			name: '其他物品'
		}
	])
	const selectedCategory = ref(0)

	const items = ref([{
			id: 1,
			title: 'MacBook Air',
			shortDesc: '银色轻薄',
			location: '教学楼',
			time: '2小时前',
			category: 0,
			image: 'https://via.placeholder.com/150'
		},
		{
			id: 2,
			title: '蓝色衬衫',
			shortDesc: '长袖',
			location: '宿舍A区',
			time: '5小时前',
			category: 2,
			image: 'https://via.placeholder.com/150'
		},
		{
			id: 3,
			title: '黑色背包',
			shortDesc: '小背包',
			location: '图书馆',
			time: '1天前',
			category: 3,
			image: 'https://via.placeholder.com/150'
		},
	])

	const filteredItems = computed(() => {
		return items.value
			.filter(i => selectedCategory.value === 0 || i.category === selectedCategory.value)
			.filter(i => i.title.includes(searchText.value) || i.shortDesc.includes(searchText.value))
	})

	const selectCategory = (id) => {
		selectedCategory.value = id
	}

	const goToDetail = (id) => {
		uni.navigateTo({
			url: `/pages/detail/lostDetail?id=${id}`
		})
	}

	const goToPublish = () => {
		uni.navigateTo({
			url: '/pages/detail/lostSend'
		})
	}

	const refreshItems = () => {
		// 模拟刷新
		console.log('刷新列表')
	}

	onMounted(() => {
		/* 可在此请求真实接口 */
	})
</script>

<style scoped>
	.lost-page {
		background: #f2f4f7;
		/* 更柔和的背景色 */
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

	/* 发布按钮 - 蓝色胶囊风格 */
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
		border: 1rpx solid #e5e5e5;
		transition: all 0.3s ease;
	}

	/* 分类按钮 - 选中状态 */
	.category-btn.active {
		background-color: #e6f2ff;
		color: #007aff;
		border-color: #007aff;
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
		background: #fff;
		border-radius: 20rpx;
		/* 增大圆角 */
		overflow: hidden;
		padding: 20rpx;
		/* 增加内边距 */
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
		/* 增加阴影 */
		border: 1rpx solid #f0f0f0;
	}

	.item-image {
		width: 160rpx;
		/* 增大图片 */
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

	.empty-tip {
		text-align: center;
		font-size: 28rpx;
		color: #999;
		margin-top: 100rpx;
	}
</style>