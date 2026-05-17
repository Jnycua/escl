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
						<text class="menu-text">跑腿送物</text>
					</view>
				</u-col>
			</u-row>
			<u-row gutter="16" style="margin-top: 16px;">
				<u-col span="6">
					<view class="menu-item" @click="handleClick2('失物招领')">
						<u-icon name="search" size="44" color="#2979ff"></u-icon>
						<text class="menu-text">失物招领</text>
					</view>
				</u-col>
				<u-col span="6">
					<view class="menu-item" @click="handleClick4('校园黄页')">
						<u-icon name="phone" size="44" color="#2979ff"></u-icon>
						<text class="menu-text">校园黄页</text>
					</view>
				</u-col>
			</u-row>
		</view>

		<!-- 校园日历区域（优化版） -->
		<view class="calendar-area">
			<uni-card :is-full="true" class="custom-calendar-card">
				<!-- 卡片头部 -->
				<view slot="head" class="card-header">
					<view class="header-left">
						<u-icon name="calendar" color="#2979ff" size="20"></u-icon>
						<text class="card-title">校园日历</text>
					</view>
					<text class="view-all" @click="viewAllCalendar">查看全部 ></text>
				</view>

				<!-- 卡片内容：左右布局 -->
				<view class="calendar-body">
					<!-- 左侧：日期展示 -->
					<view class="date-section">
						<text class="today-text">今天</text>
						<text class="date-num">{{ currentDate.day }}</text>
						<text class="date-info">{{ currentDate.month }}月 {{ currentDate.week }}</text>
					</view>

					<!-- 右侧：分割线 -->
					<view class="divider"></view>

					<!-- 右侧：日程列表 -->
					<view class="schedule-section">
						<text class="section-title">今日安排</text>
						<view v-if="scheduleList.length > 0" class="schedule-list">
							<view class="schedule-item" v-for="(item, index) in scheduleList" :key="index">
								<view class="time-badge" :class="item.status">{{ item.time }}</view>
								<view class="schedule-info">
									<text class="course-name">{{ item.title }}</text>
									<text class="course-loc">{{ item.location }}</text>
								</view>
							</view>
						</view>
						<view v-else class="empty-schedule">
							<text>今天没有课程安排，享受闲暇时光吧~</text>
						</view>
					</view>
				</view>
			</uni-card>
		</view>

		<view class="footer-space"></view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'

	const handleClick1 = (name) => {
		console.log(`点击了${name}`)
		uni.navigateTo({
			url: '/pages/life/market'
		})
	}
	const handleClick2 = (name) => {
		console.log(`点击了${name}`)
		uni.navigateTo({
			url: '/pages/life/lost'
		})
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
		uni.navigateTo({
			url: '/pages/life/phone'
		})
	}

	const viewAllCalendar = () => {
		uni.showToast({
			title: '跳转校历',
			icon: 'none'
		})
	}

	// 模拟当前日期数据
	const currentDate = ref({
		day: '17',
		month: '05',
		week: '星期日'
	})

	// 模拟今日课表数据
	const scheduleList = ref([{
			time: '08:00',
			title: '高等数学 (第七版)',
			location: '教学楼 A-101',
			status: 'done'
		},
		{
			time: '14:00',
			title: '大学英语',
			location: '外语楼 302',
			status: 'current'
		},
		{
			time: '19:00',
			title: '社团活动：篮球赛',
			location: '东区体育馆',
			status: 'upcoming'
		}
	])
</script>

<style lang="scss" scoped>
	.campus-container {
		background-color: #f5f5f5;
		min-height: 100vh;
		padding-bottom: 30px;
	}

	// 菜单区域样式优化
	.menu-area {
		padding: 20px 15px;

		.menu-item {
			background-color: #ffffff;
			border-radius: 16rpx;
			padding: 20px 0; // 增加垂直内边距
			margin: 10px 0;
			text-align: center;
			box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
			transition: all 0.2s;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;

			&:active {
				transform: scale(0.95);
				background-color: #f0f8ff;
			}

			.menu-text {
				font-size: 15px;
				color: #333333;
				margin-top: 10px;
				font-weight: 600;
			}
		}
	}

	// 日历区域样式
	.calendar-area {
		padding: 0 15px;

		.custom-calendar-card {
			border-radius: 20rpx;
			overflow: hidden;
		}

		.card-header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding-bottom: 15px;

			.header-left {
				display: flex;
				align-items: center;
				gap: 8px;
			}

			.card-title {
				font-size: 18px;
				font-weight: 700;
				color: #333;
			}

			.view-all {
				font-size: 12px;
				color: #999;
				background: #f0f0f0;
				padding: 4px 10px;
				border-radius: 20rpx;
			}
		}

		.calendar-body {
			display: flex;
			align-items: stretch;
			background-color: #fff;
			border-radius: 12px;
			overflow: hidden;
		}

		// 左侧日期
		.date-section {
			width: 30%;
			background: linear-gradient(135deg, #2979ff 0%, #5c9dff 100%);
			color: #fff;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			padding: 20px 0;

			.today-text {
				font-size: 14px;
				opacity: 0.9;
				margin-bottom: 5px;
			}

			.date-num {
				font-size: 36px;
				font-weight: bold;
				line-height: 1;
			}

			.date-info {
				font-size: 12px;
				margin-top: 8px;
				opacity: 0.9;
			}
		}

		// 分割线
		.divider {
			width: 1px;
			background-color: #f0f0f0;
			margin: 10px 0;
		}

		// 右侧日程
		.schedule-section {
			flex: 1;
			padding: 15px;
			display: flex;
			flex-direction: column;

			.section-title {
				font-size: 14px;
				font-weight: 600;
				color: #333;
				margin-bottom: 12px;
				border-left: 3px solid #2979ff;
				padding-left: 8px;
			}

			.schedule-list {
				flex: 1;
			}

			.schedule-item {
				display: flex;
				margin-bottom: 12px;

				.time-badge {
					width: 50px;
					font-size: 12px;
					color: #2979ff;
					background: #e6f2ff;
					border-radius: 6rpx;
					text-align: center;
					padding: 2px 0;
					margin-right: 10px;
					height: 24px;
					line-height: 24px;
					flex-shrink: 0;

					&.current {
						background: #2979ff;
						color: #fff;
					}

					&.done {
						background: #f0f0f0;
						color: #999;
						text-decoration: line-through;
					}
				}

				.schedule-info {
					display: flex;
					flex-direction: column;
					justify-content: center;

					.course-name {
						font-size: 14px;
						color: #333;
						margin-bottom: 4px;
					}

					.course-loc {
						font-size: 12px;
						color: #999;
					}
				}
			}

			.empty-schedule {
				font-size: 12px;
				color: #999;
				display: flex;
				align-items: center;
				justify-content: center;
				height: 60px;
				background: #fafafa;
				border-radius: 8px;
				border: 1px dashed #eee;
			}
		}
	}

	.footer-space {
		height: 50px;
	}
</style>