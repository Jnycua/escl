<template>
	<view class="publish-page">
		<view class="header">
			<text class="title">发布商品</text>
		</view>

		<form @submit.prevent="submitItem" class="form">
			<view class="form-item">
				<text>商品标题</text>
				<input v-model="title" placeholder="请输入商品标题" />
			</view>

			<view class="form-item">
				<text>价格（元）</text>
				<input v-model="price" type="number" placeholder="请输入价格" />
			</view>

			<view class="form-item">
				<text>描述</text>
				<textarea v-model="description" placeholder="请输入商品描述"></textarea>
			</view>

			<view class="form-item">
				<text>图片 URL</text>
				<input v-model="image" placeholder="请输入图片链接" />
			</view>

			<button class="submit-btn" type="submit">发布</button>
		</form>

		<view v-if="successMessage" class="success">{{ successMessage }}</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'

	const title = ref('')
	const price = ref('')
	const description = ref('')
	const image = ref('')
	const successMessage = ref('')

	const submitItem = () => {
		// 模拟提交
		console.log('发布商品', {
			title: title.value,
			price: price.value,
			description: description.value,
			image: image.value
		})
		successMessage.value = '商品发布成功！'
		// 清空表单
		title.value = ''
		price.value = ''
		description.value = ''
		image.value = ''
	}
</script>

<style scoped>
	.publish-page {
		padding: 20rpx;
		background-color: #f5f5f5;
		min-height: 100vh;
	}

	.header .title {
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

	input,
	textarea {
		width: 100%;
		padding: 8rpx;
		border: 1rpx solid #ccc;
		border-radius: 8rpx;
		font-size: 28rpx;
	}

	textarea {
		min-height: 120rpx;
		resize: none;
	}

	.submit-btn {
		background-color: #007aff;
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