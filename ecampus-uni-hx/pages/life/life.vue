<template>
	<view class="campus-container">

		<!-- 功能入口区（2x2 网格） -->
		<view class="menu-area">
			<u-row gutter="16">
				<u-col span="6">
					<view class="menu-item" @click="handleClick1('二手平台')">
						<u-icon name="bag" size="44" color="#2979ff"></u-icon>
						<text class="menu-text">二手平台</text>
					</view>
				</u-col>
				<u-col span="6">
					<view class="menu-item" @click="handleClick3('跑腿送物')">
						<u-icon name="car" size="44" color="#2979ff"></u-icon>
						<text class="menu-text" >跑腿送物</text>
					</view>
				</u-col>
			</u-row>
			<u-row gutter="16">
				<u-col span="6">
					<view class="menu-item1" @click="handleClick2('失物招领')">
						<u-icon name="search" size="44" color="#2979ff"></u-icon>
						<text class="menu-text">失物招领</text>
					</view>
				</u-col>
				<u-col span="6">
					<view class="menu-item1" @click="handleClick4('校园黄页')">
						<u-icon name="phone" size="44" color="#2979ff"></u-icon>
						<text class="menu-text">校园黄页</text>
					</view>
				</u-col>
			</u-row>
		</view>

		<!-- 校园日历区域 -->
		<view class="calendar-area">
			<uni-card :is-full="true">
				<view slot="head" class="card-header">
					<text class="card-title">学校日历</text>
				</view>
				<view class="calendar-content">
					<text class="placeholder-text">暂无日历数据</text>
				</view>
			</uni-card>
		</view>

		<!-- 底部留白 -->
		<view class="footer-space"></view>
	</view>
</template>

<script setup>
	
	
	const handleClick1 = (name) => {
		console.log(`点击了${name}`)
	}
	const handleClick2 = (name) => {
		console.log(`点击了${name}`)
	}
	const handleClick3 = (name) => {
		console.log(`点击了${name}`)
		const can = JSON.stringify(name)
		uni.navigateTo({
			url: `/pages/life/errand?name=${encodeURIComponent(can)}`
		})
	}
	const handleClick4 = (name) => {
		console.log(`点击了${name}`)
	}
</script>

<style lang="scss" scoped>
	.campus-container {
		background-color: #f5f5f5;
		min-height: 100vh;
		padding-bottom: 30px;
	}

	// 功能入口区
	.menu-area {
		padding: 20px 15px;

		.menu-item {
			background-color: #ffffff;
			border-radius: 16rpx;
			padding: 16px 16px;
			text-align: center;
			box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
			transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;

			&:active {
				transform: scale(0.96);
				box-shadow: 0 6px 16px rgba(41, 121, 255, 0.2);
				background: linear-gradient(135deg, #f8fbff 0%, #ffffff 100%);
			}

			.menu-text {
				font-size: 14px;
				color: #333333;
				margin-top: 12px;
				font-weight: 600;
			}
		}

		.menu-item1 {
			background-color: #ffffff;
			border-radius: 16rpx;
			padding: 16px 16px;
			margin-top: 13px;
			text-align: center;
			box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
			transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;

			&:active {
				transform: scale(0.96);
				box-shadow: 0 6px 16px rgba(41, 121, 255, 0.2);
				background: linear-gradient(135deg, #f8fbff 0%, #ffffff 100%);
			}

			.menu-text {
				font-size: 14px;
				color: #333333;
				margin-top: 12px;
				font-weight: 600;
			}
		}
	}

	// 校园日历区域
	.calendar-area {
		padding: 0 15px;
		margin-bottom: 20px;

		.card-header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding-bottom: 12px;
			border-bottom: 1px solid #f0f0f0;
		}

		.card-title {
			font-size: 16px;
			font-weight: 700;
			color: #2979ff;
		}

		.calendar-content {
			min-height: 240px;
			display: flex;
			align-items: center;
			justify-content: center;
			background-color: #fafafa;
			border-radius: 8px;
			padding: 20px;

			.placeholder-text {
				font-size: 14px;
				color: #999999;
			}
		}
	}

	// 底部留白
	.footer-space {
		height: 50px;
	}
</style>