<template>
	<view class="phone-page">
		<!-- 分类列表 -->
		<scroll-view class="category-list" scroll-y="true">
			<view v-for="(group, index) in phoneGroups" :key="index" class="group">
				<!-- 分类标题 -->
				<view class="group-header" @click="toggleGroup(index)">
					<view class="group-title">
						<image :src="group.icon" class="group-icon" mode="aspectFit" />
						<text class="group-name">{{ group.name }}</text>
					</view>
					<text class="group-arrow">{{ group.expanded ? '▼' : '▶' }}</text>
				</view>

				<!-- 分组内容 -->
				<view v-if="group.expanded" class="group-content">
					<view v-for="(item, i) in group.items" :key="i" class="phone-item" @click="callPhone(item.phone)">
						<!-- 左侧：绿色电话图标 -->
						<view class="phone-icon-wrapper">
							<view class="phone-icon">
								<text>📞</text>
							</view>
						</view>

						<!-- 中间：部门名称 -->
						<view class="phone-info">
							<text class="phone-name">{{ item.name }}</text>
						</view>

						<!-- 右侧：电话号码 -->
						<view class="phone-number">
							<text>{{ item.phone }}</text>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'

	const phoneGroups = ref([{
			name: '学生常用',
			icon: '/static/img/学生常用.png', // 对应截图的学士帽
			expanded: true,
			items: [{
					name: '保卫处1',
					phone: '027-68893272'
				},
				{
					name: '保卫处2',
					phone: '027-68893392'
				},
				{
					name: '黄家湖校区综合办公室',
					phone: '027-68893276'
				},
				{
					name: '洪山校区综合办公室',
					phone: '027-51012586'
				},
				{
					name: '教务处',
					phone: '027-68862468'
				},
				{
					name: '后勤集团',
					phone: '027-68862221'
				},
				{
					name: '校医院',
					phone: '027-68893271'
				}
			]
		},
		{
			name: '党政部门',
			icon: '/static/img/党政.png', // 对应截图的党徽
			expanded: false,
			items: [{
					name: '党委办公室',
					phone: '027-xxxxxxx'
				},
				{
					name: '组织部',
					phone: '027-xxxxxxx'
				}
			]
		},
		{
			name: '行政部门',
			icon: '/static/img/行政部门.png', // 对应截图的建筑图标
			expanded: false,
			items: [{
					name: '财务处',
					phone: '027-xxxxxxx'
				},
				{
					name: '人事处',
					phone: '027-xxxxxxx'
				}
			]
		},
		{
			name: '直属单位',
			icon: '/static/img/直属单位.png', // 对应截图的结构图标
			expanded: false,
			items: [{
					name: '图书馆',
					phone: '027-xxxxxxx'
				},
				{
					name: '实验中心',
					phone: '027-xxxxxxx'
				}
			]
		}
	])

	const toggleGroup = (index) => {
		phoneGroups.value[index].expanded = !phoneGroups.value[index].expanded
	}

	const callPhone = (phone) => {
		uni.makePhoneCall({
			phoneNumber: phone
		})
	}
</script>

<style scoped>
	.phone-page {
		background-color: #f5f5f5;
		min-height: 100vh;
	}

	.category-list {
		padding: 20rpx 30rpx;
		/* 增加左右边距，更像App */
	}

	/* --- 分组卡片样式 --- */
	.group {
		margin-bottom: 30rpx;
		background-color: #fff;
		border-radius: 20rpx;
		/* 更大的圆角 */
		overflow: hidden;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.03);
		/* 柔和阴影 */
	}

	/* 分组头部 */
	.group-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30rpx 20rpx;
		background-color: #fff;
	}

	.group-title {
		display: flex;
		align-items: center;
	}

	.group-icon {
		width: 64rpx;
		height: 64rpx;
		margin-right: 20rpx;
	}

	.group-name {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
	}

	.group-arrow {
		font-size: 24rpx;
		color: #999;
	}

	/* --- 列表项样式 --- */
	.group-content {
		border-top: 1rpx solid #f0f0f0;
	}

	.phone-item {
		display: flex;
		align-items: center;
		padding: 28rpx 20rpx;
		border-bottom: 1rpx solid #f5f5f5;
		/* 浅灰色分割线 */
		background-color: #fff;
	}

	/* 最后一项去掉下边框 */
	.phone-item:last-child {
		border-bottom: none;
	}

	/* 绿色电话图标容器 */
	.phone-icon-wrapper {
		margin-right: 24rpx;
		/* 图标与文字的间距 */
	}

	.phone-icon {
		width: 44rpx;
		height: 44rpx;
		border-radius: 50%;
		background-color: #52c41a;
		/* 绿色背景 */
		display: flex;
		justify-content: center;
		align-items: center;
		color: #fff;
		font-size: 22rpx;
		box-shadow: 0 2rpx 4rpx rgba(82, 196, 26, 0.3);
		/* 绿色微光 */
	}

	/* 部门名称 */
	.phone-info {
		flex: 1;
		/* 占据中间剩余空间 */
	}

	.phone-name {
		font-size: 30rpx;
		color: #333;
		display: block;
	}

	/* 电话号码 */
	.phone-number {
		font-size: 28rpx;
		color: #666;
		font-family: monospace;
		/* 等宽字体，数字更好看 */
		margin-left: 10rpx;
	}
</style>