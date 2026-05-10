<template>
	<view class="content">
		<view class="topBox">
			<view class="setbox">
				<view class="set-left">
					<uni-icons type="calendar" size="30" color="#fff"></uni-icons>
					<view class="txt">签到</view>
				</view>
				<view class="set-right">
					<uni-icons type="gear" size="30" color="#fff"></uni-icons>
					<uni-icons type="chat" size="30" color="#fff"></uni-icons>
				</view>
			</view>
			<view class="users" @click="setFun">
				<view class="u-top">
					<template v-if="!userInfo.nickName">
						<image src="/static/img/e学院.png" mode="aspectFill"></image>
						<view class="tit">
							注册 / 登录
						</view>
					</template>
					<template v-else>
						<image :src="userInfo.avatarUrl" mode="aspectFill"></image>
						<view class="tit">
							{{ userInfo.nickName }}
						</view>
					</template>
				</view>
				<view class="u-bottom">
					<up-tag text="标签2" plain shape="circle"></up-tag>
					<up-tag text="标签4" plain> </up-tag>
					<up-tag text="标签5" type="warning" plain plainFill shape="circle"></up-tag>
					<up-tag text="标签6" type="success" plain plainFill></up-tag>
				</view>
			</view>
		</view>
		<view class="listBox">
			<view class="lists">
				<uni-list>
					<uni-list-item :show-extra-icon="true" :extra-icon="extraIcon1" showArrow title="个人信息" clickable></uni-list-item>
					<uni-list-item :show-extra-icon="true" :extra-icon="extraIcon2" showArrow title="我的收藏" clickable></uni-list-item>
					<uni-list-item :show-extra-icon="true" :extra-icon="extraIcon7" showArrow title="我的帖子" clickable></uni-list-item>
					<uni-list-item :show-extra-icon="true" :extra-icon="extraIcon3" showArrow title="我的订单" clickable></uni-list-item>
					<uni-list-item :show-extra-icon="true" :extra-icon="extraIcon4" showArrow title="我的邮件" clickable></uni-list-item>
					<uni-list-item :show-extra-icon="true" :extra-icon="extraIcon5" showArrow title="用户反馈" clickable></uni-list-item>
					<uni-list-item :show-extra-icon="true" :extra-icon="extraIcon6" showArrow title="分享有礼" clickable></uni-list-item>
				</uni-list>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		reactive
	} from 'vue'
	import { onLoad } from '@dcloudio/uni-app'
	import uniList from '@/uni_modules/uni-list/components/uni-list/uni-list.vue';
	import uniListItem from '@/uni_modules/uni-list/components/uni-list-item/uni-list-item.vue';

	
	//不可以直接获取
	onLoad(() => {
		/* uni.getUserProfile({
			desc:"获取用户头像和昵称",
			success(res) {
				console.log(res, 'success')
			},
			fail(err) {
				console.log(err, 'fail')
			}
		}) */
	})

	const userInfo = reactive({
		nickName: '',
		avatarUrl: ''
	})
	
	const setFun = () => {
		//给用户一个确认的提醒
		uni.showModal({
			title:'温馨提示',
			content:'亲，授权微信登录后才能正常使用小程序',
			success(res) {
				if (res.confirm) {
					//需要后端解密用户信息
					/* uni.getUserProfile({ 
						desc:"获取用户头像和昵称",
						success(res) {
							console.log(res, 'success')
						},
						fail(err) {
							console.log(err, 'fail')
						}
					}) */
					//要写接口，先把前段完善后再补
					uni.login({
						success(data) {
							console.log(data)
						}
					})
				}
			}
		})
	}
	
	//图标
	const extraIcon1 = reactive({
		color:'#666666',
		size:'22',
		type:'auth'
	})
	const extraIcon2 = reactive({
		color:'#666666',
		size:'22',
		type:'star'
	})
	const extraIcon3 = reactive({
		color:'#666666',
		size:'22',
		type:'list'
	})
	const extraIcon4 = reactive({
		color:'#666666',
		size:'22',
		type:'email'
	})
	const extraIcon5 = reactive({
		color:'#666666',
		size:'22',
		type:'chatboxes'
	})
	const extraIcon6 = reactive({
		color:'#666666',
		size:'22',
		type:'gift'
	})
	const extraIcon7 = reactive({
		color:'#666666',
		size:'22',
		type:'compose'
	})
</script>

<style lang="scss" scoped>
	.content {
		height: 100vh;
		background-color: #f5f5f5;

		.topBox {
			width: 100%;
			position: relative;
			z-index: 1;
			overflow: hidden;
			padding: 40rpx 20rpx 40rpx;
			box-sizing: border-box;
		}

		.topBox::after {
			content: "";
			width: 140%;
			height: 200px;
			position: absolute;
			z-index: -1;
			top: 0;
			left: -20%;
			background-color: #00aaff;
			border-radius: 0 0 50% 50%;
		}

		.setbox {
			display: flex;
			justify-content: space-between;
			align-items: center;

			.set-left {
				width: 18%;
				display: flex;
				justify-content: space-between;
				align-items: center;
			}

			.txt {
				color: #fff;
				font-size: 30rpx;
			}
		}

		.users {
			margin-top: 35rpx;
			padding: 30rpx;
			box-sizing: border-box;
			height: 280rpx;
			background-color: #fff;
			box-shadow: 1px 10rpx 20rpx #ececec;
			border-radius: 16rpx;

			.u-top {
				display: flex;
				justify-content: flex-start;
				align-items: center;
				margin-bottom: 30rpx;

				image {
					width: 100rpx;
					height: 100rpx;
					border-radius: 50%;
					margin-right: 20rpx;
				}

				.tit {
					font-size: 30rpx;
					font-weight: 700;
					color: #333;
				}
			}

			.u-bottom {
				display: flex;
				align-items: center;
				gap: 20rpx;
				/* 增加标签之间的间隔 */
				margin-top: 50rpx;
				/* 增加顶部间距，使标签更靠下 */
				padding-top: 10rpx;
				/* 增加内边距，进一步下移标签 */
			}
		}
		.listBox {
			height: 200rpx;
			margin: -10rpx anto 0;
			padding: 20rpx;
			box-sizing: border-box;
			border-radius: 12rpx;
		}
	}
</style>