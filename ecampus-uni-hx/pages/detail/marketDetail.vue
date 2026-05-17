<template>
	<view class="detail-page">
		<view class="header">
			<text class="title">{{ item.title }}</text>
		</view>

		<image :src="item.image || defaultImage" class="item-image" mode="aspectFill"></image>

		<view class="item-info">
			<text class="item-price">¥{{ item.price }}</text>
			<text class="item-desc">{{ item.description }}</text>
		</view>

		<button class="contact-btn" @click="contactSeller">联系卖家</button>
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

	const defaultImage = '/static/default-product.png'
	const route = useRoute()
	const itemId = route.query.id

	const item = ref({})

	const mockItems = [{
			id: 1,
			title: '二手手机',
			price: 500,
			description: '使用良好，几乎无划痕',
			image: 'https://via.placeholder.com/150'
		},
		{
			id: 2,
			title: '二手书籍',
			price: 30,
			description: '大学教材，九成新',
			image: 'https://via.placeholder.com/150'
		},
		{
			id: 3,
			title: '二手电脑椅',
			price: 120,
			description: '办公椅，舒适耐用',
			image: 'https://via.placeholder.com/150'
		}
	]

	onMounted(() => {
		// 模拟获取详情
		item.value = mockItems.find(i => i.id == itemId) || {
			title: '商品不存在',
			price: 0,
			description: '',
			image: ''
		}
	})

	const contactSeller = () => {
		uni.showToast({
			title: '模拟联系卖家功能',
			icon: 'none'
		})
	}
</script>

<style scoped>
	.detail-page {
		padding: 20rpx;
		background-color: #f5f5f5;
		min-height: 100vh;
	}

	.header .title {
		font-size: 32rpx;
		font-weight: bold;
		margin-bottom: 20rpx;
	}

	.item-image {
		width: 100%;
		height: 300rpx;
		border-radius: 12rpx;
		margin-bottom: 20rpx;
	}

	.item-info {
		background-color: #fff;
		padding: 20rpx;
		border-radius: 12rpx;
		margin-bottom: 20rpx;
	}

	.item-price {
		font-size: 28rpx;
		color: #ff4d4f;
		font-weight: bold;
	}

	.item-desc {
		font-size: 24rpx;
		color: #666;
		margin-top: 12rpx;
	}

	.contact-btn {
		background-color: #007aff;
		color: #fff;
		font-size: 28rpx;
		padding: 12rpx;
		border-radius: 12rpx;
		text-align: center;
	}
</style>