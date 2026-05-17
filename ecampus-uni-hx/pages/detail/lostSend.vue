<template>
	<view class="lost-send-page">
		<view class="header">发布失物</view>
		<form @submit.prevent="submitItem" class="form">
			<view class="form-item"><text>物品名称</text><input v-model="title" placeholder="请输入物品名称" /></view>
			<view class="form-item"><text>简短描述</text><input v-model="shortDesc" placeholder="描述" /></view>
			<view class="form-item"><text>遗失地点</text><input v-model="location" placeholder="请输入遗失地点" /></view>
			<view class="form-item"><text>图片URL</text><input v-model="image" placeholder="请输入图片链接" /></view>
			<button class="submit-btn" type="submit">发布</button>
		</form>
		<view v-if="successMessage" class="success">{{ successMessage }}</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'

	const title = ref(''),
		shortDesc = ref(''),
		location = ref(''),
		image = ref('')
	const successMessage = ref('')

	const submitItem = () => {
		console.log('发布失物', {
			title: title.value,
			shortDesc: shortDesc.value,
			location: location.value,
			image: image.value
		})
		successMessage.value = '发布成功'
		title.value = '';
		shortDesc.value = '';
		location.value = '';
		image.value = ''
	}
</script>

<style scoped>
	.lost-send-page {
		padding: 20rpx;
		background: #f5f5f5;
		min-height: 100vh;
	}

	.header {
		font-size: 32rpx;
		font-weight: bold;
		margin-bottom: 20rpx;
	}

	.form-item {
		margin-bottom: 20rpx;
	}

	.form-item text {
		display: block;
		margin-bottom: 8rpx;
		font-size: 28rpx;
		font-weight: bold;
	}

	input {
		width: 100%;
		padding: 8rpx;
		border: 1rpx solid #ccc;
		border-radius: 8rpx;
		font-size: 28rpx;
	}

	.submit-btn {
		background: #007aff;
		color: #fff;
		font-size: 28rpx;
		padding: 12rpx;
		border-radius: 12rpx;
	}

	.success {
		color: #52c41a;
		font-size: 28rpx;
		text-align: center;
		margin-top: 20rpx;
	}
</style>