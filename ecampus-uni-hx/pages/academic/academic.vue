<template>
	<view class="schedule-container">
		<!-- 自定义导航区域 - 在原生导航栏下方 -->
		<view class="custom-nav-area">
			<!-- 刷新按钮和第X周（整体下移） -->
			<view class="week-refresh-row">
				<!-- 刷新按钮 -->
				<view class="refresh-btn" @click="refreshSchedule">
					<u-icon name="reload" size="20" color="#666"></u-icon>
				</view>

				<!-- 第X周 -->
				<view class="week-picker">
					<text class="week-text">第{{ currentWeek }}周</text>
					<u-icon name="arrow-down" size="16" color="#666" class="arrow-icon"></u-icon>
				</view>

				<!-- 菜单按钮（新增，在最右边） -->
				<view class="menu-btn" @click="showMenu = true">
					<u-icon name="order" size="24" color="#666"></u-icon>
				</view>
			</view>
		</view>

		<!-- 课表主内容区 - 可滚动区域 -->
		<scroll-view class="schedule-scroll" scroll-y :scroll-top="scrollTop" @scroll="handleScroll">
			<view class="schedule-content">
				<!-- 左侧时间轴 -->
				<view class="time-axis">
					<view class="time-axis-header"></view>
					<view v-for="(timeSlot, index) in timeSlots" :key="index" class="time-slot">
						<text class="time-text">{{ timeSlot }}</text>
					</view>
				</view>

				<!-- 课表网格 -->
				<view class="schedule-grid">
					<!-- 顶部星期栏 -->
					<view class="week-header">
						<view v-for="(day, index) in weekDays" :key="index" class="day-header"
							:class="{ 'today': isToday(day) }">
							<view class="day-name">{{ day.name }}</view>
							<view class="day-date">{{ day.date }}</view>
						</view>
					</view>

					<!-- 课程网格 -->
					<view class="grid-container">
						<!-- 网格线 -->
						<view class="grid-lines">
							<view v-for="(slot, index) in timeSlots" :key="index" class="grid-row"></view>
						</view>

						<!-- 课程块 -->
						<view v-for="(course, index) in courseList" :key="index" class="course-block"
							:style="getCourseBlockStyle(course)" @click="viewCourseDetail(course)">
							<view class="course-content" :style="{ backgroundColor: getCourseColor(course.name) }">
								<view class="course-name">{{ course.name }}</view>
								<view class="course-location">@{{ course.location }}</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>

		<!-- 菜单弹窗 -->
		<u-action-sheet :show="showMenu" :actions="menuActions" title="功能菜单" @close="showMenu = false"
			@select="handleMenuSelect"></u-action-sheet>

		<!-- 加载状态 -->
		<u-loading-page v-if="loading" :loading="loading" loading-text="加载中..."></u-loading-page>
	</view>
</template>

<script setup>
	import {
		ref,
		computed,
		onMounted
	} from 'vue'
	import {
		onLoad,
		onShow
	} from '@dcloudio/uni-app'

	// 响应式数据
	const currentWeek = ref(1)
	const currentMonth = ref('05月')
	const loading = ref(false)
	const showMenu = ref(false) // 控制菜单显示
	const scrollTop = ref(0)

	// 时间槽位定义（6个时间段）
	const timeSlots = ref([
		'08:20-10:00',
		'10:20-12:00',
		'14:00-15:40',
		'16:00-17:40',
		'18:40-20:20',
		'20:30-22:10'
	])

	// 菜单选项
	const menuActions = ref([{
			name: '成绩查询',
			color: '#2979ff',
			fontSize: '16px',
			icon: 'order',
			url: '/pages/academic/score'  // 添加这行
		},
		{
			name: '考试提醒',
			color: '#2979ff',
			fontSize: '16px',
			icon: 'bell',
			url: '/pages/academic/exam'  // 添加这行
		}
	])

	// 星期数据
	const weekDays = ref([{
			name: '周一',
			date: '29日',
			fullDate: '2023-05-29'
		},
		{
			name: '周二',
			date: '30日',
			fullDate: '2023-05-30'
		},
		{
			name: '周三',
			date: '31日',
			fullDate: '2023-05-31'
		},
		{
			name: '周四',
			date: '01日',
			fullDate: '2023-06-01'
		},
		{
			name: '周五',
			date: '02日',
			fullDate: '2023-06-02'
		},
		{
			name: '周六',
			date: '03日',
			fullDate: '2023-06-03'
		},
		{
			name: '周日',
			date: '04日',
			fullDate: '2023-06-04'
		}
	])

	// 课程数据 - 重新映射到6个时间段
	const courseList = ref([{
			id: 1,
			name: '网络工程',
			location: '博雅楼302',
			day: 1, // 周一
			timeSlot: 1, // 第1个时间段 (08:20-10:00)
			duration: 1, // 持续1个时间段
			color: '#FF6B6B'
		},
		{
			id: 2,
			name: '马克思主义',
			location: '长征教室',
			day: 1, // 周一
			timeSlot: 2, // 第2个时间段 (10:20-12:00)
			duration: 1, // 持续1个时间段
			color: '#4ECDC4'
		},
		{
			id: 3,
			name: '大学体育1',
			location: '篮球场',
			day: 3, // 周三
			timeSlot: 3, // 第3个时间段 (14:00-15:40)
			duration: 1, // 持续1个时间段
			color: '#45B7D1'
		},
		{
			id: 4,
			name: '创新创业大学生就业指导',
			location: '躬行楼302',
			day: 4, // 周四
			timeSlot: 4, // 第4个时间段 (16:00-17:40)
			duration: 1, // 持续1个时间段
			color: '#96CEB4'
		},
		{
			id: 5,
			name: '大学英语1',
			location: '信达楼302',
			day: 4, // 周四
			timeSlot: 2, // 第2个时间段 (10:20-12:00)
			duration: 1, // 持续1个时间段
			color: '#FFEAA7'
		},
		{
			id: 6,
			name: '这是一个很长的课表名称',
			location: '很长的地址302',
			day: 2, // 周二
			timeSlot: 5, // 第5个时间段 (18:40-20:20)
			duration: 1, // 持续1个时间段
			color: '#DDA0DD'
		},
		{
			id: 7,
			name: '大学体育1',
			location: '篮球场',
			day: 5, // 周五
			timeSlot: 2, // 第2个时间段 (10:20-12:00)
			duration: 1, // 持续1个时间段
			color: '#98D8AA'
		},
		{
			id: 8,
			name: '大学英语1',
			location: '信达楼302',
			day: 5, // 周五
			timeSlot: 6, // 第6个时间段 (20:30-22:10)
			duration: 1, // 持续1个时间段
			color: '#F8B195'
		}
	])

	// 课程颜色映射
	const courseColors = {
		'网络工程': '#FF6B6B',
		'马克思主义': '#4ECDC4',
		'大学体育1': '#45B7D1',
		'创新创业大学生就业指导': '#96CEB4',
		'大学英语1': '#FFEAA7',
		'这是一个很长的课表名称': '#DDA0DD',
		'默认': '#2979FF'
	}

	// 页面加载
	onLoad(() => {
		console.log('课表页面加载')
		loadScheduleData()
	})

	// 页面显示
	onShow(() => {
		console.log('课表页面显示')
	})

	// 加载课表数据
	const loadScheduleData = () => {
		loading.value = true

		// 模拟API请求
		setTimeout(() => {
			loading.value = false
		}, 500)
	}

	// 刷新课表
	const refreshSchedule = () => {
		loading.value = true
		console.log('刷新课表数据')

		// 模拟刷新
		setTimeout(() => {
			loading.value = false
			uni.showToast({
				title: '课表已刷新',
				icon: 'success',
				duration: 1500
			})
		}, 800)
	}

	// 判断是否是今天
	const isToday = (day) => {
		// 这里简化处理，实际应该比较日期
		// 假设今天是6月1日
		return day.date === '01日'
	}

	// 获取课程块样式
	const getCourseBlockStyle = (course) => {
		const dayWidth = 100 / 7 // 每天占网格宽度的百分比
		const slotHeight = 200 // 每个时间段高度（单位：rpx）

		// 计算位置
		const left = `${(course.day - 1) * dayWidth}%`
		const top = `${(course.timeSlot - 1) * slotHeight}rpx`
		const height = `${course.duration * slotHeight}rpx`
		const width = `${dayWidth}%`

		return {
			left,
			top,
			height,
			width
		}
	}

	// 获取课程颜色
	const getCourseColor = (courseName) => {
		return courseColors[courseName] || courseColors['默认']
	}

	// 处理滚动事件
	const handleScroll = (e) => {
		// 如果需要记录滚动位置，可以在这里处理
		// console.log('滚动位置:', e.detail.scrollTop)
	}

	// 查看课程详情
	const viewCourseDetail = (course) => {
		console.log('查看课程详情:', course)

		const timeSlotText = timeSlots.value[course.timeSlot - 1]

		uni.showModal({
			title: course.name,
			content: `地点：${course.location}\n时间：${timeSlotText}\n星期：${course.day}`,
			showCancel: true,
			confirmText: '确定',
			cancelText: '关闭'
		})
	}

	// 【重点修改】处理菜单选择
		const handleMenuSelect = (item) => {  // 这里改为接收 item 而不是 index
			console.log('点击的菜单项:', item); // 打印出来看看是不是拿到了 url
			
			showMenu.value = false
			
			// 直接判断 item 是否存在且包含 url
			if (item && item.url) {
				uni.navigateTo({
					url: item.url,
					fail: (err) => {
						console.error('跳转失败:', err);
						uni.showToast({
							title: '页面不存在，请检查 pages.json',
							icon: 'none'
						});
					}
				});
			} else {
				console.error('菜单项数据异常或缺少 url:', item);
				uni.showToast({
					title: '菜单配置错误',
					icon: 'none'
				});
			}
		}
</script>

<style lang="scss" scoped>
	.schedule-container {
		width: 100%;
		height: 100vh;
		background-color: #f8f9fa;
		display: flex;
		flex-direction: column;
	}

	/* 自定义导航区域 - 在原生导航栏下方 */
	.custom-nav-area {
		background-color: #ffffff;
		padding: 20rpx 30rpx 10rpx;
		border-bottom: 1px solid #f0f0f0;
		flex-shrink: 0;
	}

	/* 刷新按钮、第X周、菜单按钮 在同一行 */
	.week-refresh-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
	}

	/* 刷新按钮样式 */
	.refresh-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 60rpx;
		height: 60rpx;
		border-radius: 30rpx;
		background-color: #f5f5f5;
		transition: all 0.3s;
	}

	.refresh-btn:active {
		background-color: #e0e0e0;
		transform: rotate(180deg);
	}

	/* 第X周样式 */
	.week-picker {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 10rpx 20rpx;
		background-color: #f5f5f5;
		border-radius: 20rpx;
	}

	.week-text {
		font-size: 28rpx;
		color: #333;
		font-weight: 500;
	}

	.arrow-icon {
		margin-left: 10rpx;
	}

	/* 菜单按钮样式 */
	.menu-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 60rpx;
		height: 60rpx;
		border-radius: 30rpx;
		background-color: #f5f5f5;
		transition: all 0.3s;
	}

	.menu-btn:active {
		background-color: #e0e0e0;
	}

	/* 可滚动区域 */
	.schedule-scroll {
		flex: 1;
		height: 0;
		/* 重要：使scroll-view能正确计算高度 */
		min-height: 1200rpx;
		/* 新增 */
	}

	/* 课表主内容区 */
	.schedule-content {
		display: flex;
		background-color: #fff;
		min-height: 100%;
		/* 确保内容高度足够滚动 */
	}

	/* 左侧时间轴 */
	.time-axis {
		width: 80rpx;
		/* 增加宽度以适应时间文字 */
		background-color: #fff;
		border-right: 1px solid #f0f0f0;
		flex-shrink: 0;
		
		min-height: 1200rpx; /* 新增 */
	}

	.time-axis-header {
		height: 80rpx;
		border-bottom: 1px solid #f0f0f0;
	}

	.time-slot {
		height: 200rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border-bottom: 1px solid #f0f0f0;
	}

	.time-text {
		font-size: 20rpx;
		/* 减小字体以适应时间文字 */
		color: #666;
		text-align: center;
		line-height: 1.4;
		white-space: pre-line;
		/* 允许换行 */
	}

	/* 课表网格 */
	.schedule-grid {
		flex: 1;
		display: flex;
		flex-direction: column;
		min-width: 0;
		/* 防止flex布局溢出 */
	}

	/* 顶部星期栏 */
	.week-header {
		display: flex;
		height: 80rpx;
		border-bottom: 1px solid #f0f0f0;
		flex-shrink: 0;
	}

	.day-header {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		border-right: 1px solid #f0f0f0;
		min-width: 0;
	}

	.day-header:last-child {
		border-right: none;
	}

	.day-header.today {
		background-color: #2979ff;
		border-radius: 8rpx;
	}

	.day-header.today .day-name,
	.day-header.today .day-date {
		color: #fff;
	}

	.day-name {
		font-size: 24rpx;
		color: #333;
		font-weight: 500;
		white-space: nowrap;
	}

	.day-date {
		font-size: 20rpx;
		color: #999;
		margin-top: 4rpx;
		white-space: nowrap;
	}

	/* 课程网格容器 */
	.grid-container {
		flex: 1;
		position: relative;
		background-color: #fff;
		height: 1200rpx;
		/* 6个时间段 * 120rpx = 720rpx */
	}

	/* 网格线 */
	.grid-lines {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
	}

	.grid-row {
		height: 200rpx;
		border-bottom: 1px solid #f0f0f0;
	}

	.grid-row:last-child {
		border-bottom: none;
	}

	/* 课程块 */
	.course-block {
		position: absolute;
		box-sizing: border-box;
		padding: 4rpx;
		z-index: 1;
	}

	.course-content {
		width: 100%;
		height: 100%;
		border-radius: 8rpx;
		padding: 12rpx 8rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
		overflow: hidden;
		transition: transform 0.2s;
	}

	.course-content:active {
		transform: scale(0.98);
	}

	.course-name {
		font-size: 24rpx;
		color: #fff;
		font-weight: 500;
		line-height: 1.3;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		word-break: break-word;
	}

	.course-location {
		font-size: 20rpx;
		color: rgba(255, 255, 255, 0.9);
		margin-top: 4rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>