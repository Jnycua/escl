<template>
	<view class="detail">
		<up-navbar title="" bg-color="#00000000" :autoBack="true" left-icon-color="#000"></up-navbar>
		<view class="d-con">
			<image :src="details.dt.img" mode="aspectFill" ></image>
		</view>
	</view>
</template>

<script setup>
	import { onLoad } from '@dcloudio/uni-app'
	import {
		ref,
		reactive
	} from 'vue'
	
	onLoad((opt) => {
		console.log(JSON.parse(decodeURIComponent(opt.item)))
		details.dt = JSON.parse(decodeURIComponent(opt.item))
	})
	
	const details = reactive({
		dt:''
	})
</script>

<style lang="scss">
	.detail {
		background-color: #f5f5f5;
		.d-con {
			image {
				width: 100%;
				height: 600rpx;
			}
		}
	}
</style>