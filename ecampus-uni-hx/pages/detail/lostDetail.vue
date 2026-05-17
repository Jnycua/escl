<template>
	<view class="lost-detail-page">
		<image :src="item.image||defaultImage" class="item-image" mode="aspectFill" />
		<view class="item-info">
			<text class="item-title">{{ item.title }}</text>
			<text class="item-desc">{{ item.shortDesc }}</text>
			<view class="item-extra">
				<text class="item-location">遗失地点：{{ item.location }}</text>
				<text class="item-time">{{ item.time }}</text>
			</view>
		</view>
		<button class="contact-btn" @click="contact">联系失主</button>
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue'
	import {
		useRoute
	} from 'vue-router'

	const route = useRoute()
	const id = route.query.id
	const defaultImage = '/static/default-item.png'
	const item = ref({})

	const mockItems = [{
			id: 1,
			title: 'MacBook Air',
			shortDesc: '银色轻薄',
			location: '教学楼',
			time: '2小时前',
			image: 'https://via.placeholder.com/150'
		},
		{
			id: 2,
			title: '蓝色衬衫',
			shortDesc: '长袖',
			location: '宿舍A区',
			time: '5小时前',
			image: 'https://via.placeholder.com/150'
		}
	]

	onMounted(() => {
		item.value = mockItems.find(i => i.id == id) || {
			title: '物品不存在',
			shortDesc: '',
			location: '',
			time: '',
			image: ''
		}
	})

	const contact = () => {
		uni.showToast({
			title: '模拟联系失主功能',
			icon: 'none'
		})
	}
</script>

<style scoped>
	.lost-detail-page {
		padding: 20rpx;
		background: #f5f5f5;
		min-height: 100vh;
	}

	.item-image {
		width: 100%;
		height: 300rpx;
		border-radius: 16rpx;
		margin-bottom: 20rpx;
	}

	.item-info {
		background: #fff;
		padding: 20rpx;
		border-radius: 16rpx;
		margin-bottom: 20rpx;
	}

	.item-title {
		font-size: 28rpx;
		font-weight: bold;
		margin-bottom: 6rpx;
	}

	.item-desc {
		font-size: 24rpx;
		color: #666;
		margin-bottom: 6rpx;
	}

	.item-extra {
		display: flex;
		justify-content: space-between;
		font-size: 22rpx;
		color: #999;
	}

	.contact-btn {
		background: #007aff;
		color: #fff;
		font-size: 28rpx;
		padding: 12rpx;
		border-radius: 12rpx;
		text-align: center;
	}
</style>