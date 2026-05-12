<template>
	<view class="academic-container">
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

				<!-- 菜单按钮 -->
				<view class="menu-btn" @click="showMenu = true">
					<u-icon name="more-dot-fill" size="24" color="#666"></u-icon>
				</view>
			</view>
		</view>

		<!-- 课表主内容区 - 可滚动区域 -->
		<!-- <scroll-view class="schedule-scroll" scroll-y :scroll-top="scrollTop" @scroll="handleScroll"> -->
		<scroll-view class="schedule-scroll" scroll-y :scroll-top="scrollTop" @scroll="handleScroll"
			scroll-with-animation enable-back-to-top style="height: calc(100vh - 90rpx);">
			<view class="schedule-content">
				<!-- 左侧时间轴 -->
				<view class="time-axis">
					<view class="time-axis-header">
						<text class="month-text">{{ currentMonth }}</text>
					</view>
					<view v-for="(timeSlot, index) in timeSlots" :key="index" class="time-slot">
						<text class="time-text">{{ timeSlot.time }}</text>
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
							:class="{ 'long-press-active': isLongPressed(course.id) }"
							:style="getCourseBlockStyle(course)" @click="viewCourseDetail(course)"
							@longpress="handleLongPress(course)">
							<view class="course-content" :style="{ backgroundColor: getCourseColor(course.name) }">
								<view class="course-name">{{ course.name }}</view>
								<view class="course-location">@{{ course.location || '暂无地址' }}</view>
							</view>
						</view>

						<!-- 空白格子用于添加新课程 -->
						<view v-for="blankCell in blankCells" :key="`${blankCell.day}-${blankCell.timeSlot}`"
							class="blank-cell"
							:class="{ 'long-press-active': isLongPressed(`${blankCell.day}-${blankCell.timeSlot}`) }"
							:style="getBlankCellStyle(blankCell)" @longpress="handleLongPressEmpty(blankCell)">
						</view>

						<!-- 当前时间指示器 -->
						<!-- <view v-if="currentTimeIndicator.visible" class="current-time-indicator"
							:style="getCurrentTimeIndicatorStyle()">
						</view> -->
					</view>
				</view>
			</view>
		</scroll-view>

		<!-- 课程编辑弹窗 -->
		<!-- <u-popup :show="showEditPopup" mode="center" :round="10" @close="closeEditPopup"> -->
		<u-popup :show="showEditPopup" mode="center" :round="10" @close="closeEditPopup" :mask="false"
			:mask-background-color="transparent" :custom-style="{'background':'transparent'}">
			<view class="edit-popup-content">
				<view class="popup-header">
					<text class="popup-title">{{ editingCourse.id ? '编辑课程' : '添加课程' }}</text>
					<u-icon name="close" size="24" color="#999" @click="closeEditPopup"></u-icon>
				</view>

				<view class="form-group">
					<text class="label">课程名称</text>
					<input class="input" v-model="editingCourse.name" placeholder="请输入课程名称" />
				</view>

				<view class="form-group">
					<text class="label">上课地点</text>
					<input class="input" v-model="editingCourse.location" placeholder="请输入上课地点" />
				</view>

				<view class="form-group">
					<text class="label">教师姓名</text>
					<input class="input" v-model="editingCourse.teacher" placeholder="请输入教师姓名" />
				</view>

				<view class="form-group">
					<text class="label">星期</text>
					<u-picker mode="selector" :columns="[weekOptions]" :defaultIndex="[editingCourse.day - 1]"
						@confirm="onDayChange" @cancel="showDayPicker = false" :show="showDayPicker"></u-picker>
					<view class="picker-value" @click="showDayPicker = true">
						{{ weekOptions[editingCourse.day - 1] }}
						<u-icon name="arrow-down" size="16" color="#999"></u-icon>
					</view>
				</view>

				<view class="form-group">
					<text class="label">节次</text>
					<u-picker mode="selector" :columns="[timeSlotOptions]" :defaultIndex="[editingCourse.timeSlot - 1]"
						@confirm="onTimeSlotChange" @cancel="showTimeSlotPicker = false"
						:show="showTimeSlotPicker"></u-picker>
					<view class="picker-value" @click="showTimeSlotPicker = true">
						{{ timeSlotOptions[editingCourse.timeSlot - 1] }}
						<u-icon name="arrow-down" size="16" color="#999"></u-icon>
					</view>
				</view>

				<view class="form-group">
					<text class="label">持续节数</text>
					<u-picker mode="selector" :columns="[durationOptions]" :defaultIndex="[editingCourse.duration - 1]"
						@confirm="onDurationChange" @cancel="showDurationPicker = false"
						:show="showDurationPicker"></u-picker>
					<view class="picker-value" @click="showDurationPicker = true">
						{{ durationOptions[editingCourse.duration - 1] }}
						<u-icon name="arrow-down" size="16" color="#999"></u-icon>
					</view>
				</view>

				<view class="button-group">
					<button class="btn-cancel" @click="closeEditPopup">取消</button>
					<button class="btn-confirm" @click="saveCourse">保存</button>
				</view>
			</view>
		</u-popup>

		<!-- 菜单弹窗 -->
		<u-action-sheet :show="showMenu" :actions="menuActions" title="功能菜单" @close="showMenu = false"
			@select="handleMenuSelect"></u-action-sheet>

		<!-- 加载状态 -->
		<u-loading-page v-if="loading" :loading="loading" loading-text="加载中..."></u-loading-page>

		<!-- 网络错误提示 -->
		<view v-if="networkError" class="network-error">
			<view class="error-content">
				<u-icon name="wifi-off" size="60" color="#909399"></u-icon>
				<text class="error-text">网络连接失败</text>
				<text class="error-desc">无法连接到服务器，请检查网络设置</text>
				<button class="retry-btn" @click="loadSchedule">重新连接</button>
			</view>
		</view>

		<!-- 服务器配置提示 -->
		<view v-if="showServerConfig" class="server-config-modal">
			<view class="config-content">
				<text class="config-title">服务器配置</text>
				<text class="config-desc">请确保后端服务器已启动</text>
				<text class="config-info">1. 启动 Node.js 服务：npm run server</text>
				<text class="config-info">2. 访问：http://localhost:3000/courses</text>
				<button class="close-btn" @click="showServerConfig = false">我知道了</button>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		computed,
		onMounted,
		onUnmounted
	} from 'vue'
	import {
		onLoad,
		onShow
	} from '@dcloudio/uni-app'

	// 导入API函数
	import {
		getCourseListRequest
	} from '@/api/api.js'

	// 响应式数据
	const currentWeek = ref(1)
	const currentMonth = ref('05月')
	const loading = ref(false)
	const showMenu = ref(false)
	const scrollTop = ref(0)
	const networkError = ref(false)
	const showServerConfig = ref(false)
	const showEditPopup = ref(false)
	const showDayPicker = ref(false)
	const showTimeSlotPicker = ref(false)
	const showDurationPicker = ref(false)
	const longPressedItems = ref([])

	// 编辑中的课程数据
	const editingCourse = ref({
		id: null,
		name: '',
		location: '',
		teacher: '',
		day: 1,
		timeSlot: 1,
		duration: 1,
		color: '#2979FF'
	})

	// 解析API数据后存储的课程列表
	const courseList = ref([])

	// 时间槽位定义（按实际课表时间段）
	const timeSlots = ref([{
			time: '08:20-10:00',
			period: '1-2节',
			index: 1
		},
		{
			time: '10:20-12:00',
			period: '3-4节',
			index: 2
		},
		{
			time: '14:00-15:40',
			period: '5-6节',
			index: 3
		},
		{
			time: '16:00-17:40',
			period: '7-8节',
			index: 4
		},
		{
			time: '18:40-20:20',
			period: '9-10节',
			index: 5
		},
		{
			time: '20:30-22:10',
			period: '11-12节',
			index: 6
		}
	])

	// 当前时间指示器
	const currentTimeIndicator = ref({
		visible: false,
		time: null,
		slotIndex: 0,
		position: 0
	})

	// 菜单选项
	const menuActions = ref([{
			name: '成绩查询',
			color: '#2979ff',
			fontSize: '16px',
			icon: 'list',
			action: 'scores'
		},
		{
			name: '考试安排',
			color: '#ff6b6b',
			fontSize: '16px',
			icon: 'calendar',
			action: 'exams'
		},
		{
			name: '课表设置',
			color: '#9c88ff',
			fontSize: '16px',
			icon: 'setting',
			action: 'settings'
		}
	])

	// 星期数据
	const weekDays = ref([{
			name: '周一',
			date: '29日',
			fullDate: '2023-05-29',
			index: 1
		},
		{
			name: '周二',
			date: '30日',
			fullDate: '2023-05-30',
			index: 2
		},
		{
			name: '周三',
			date: '31日',
			fullDate: '2023-05-31',
			index: 3
		},
		{
			name: '周四',
			date: '01日',
			fullDate: '2023-06-01',
			index: 4
		},
		{
			name: '周五',
			date: '02日',
			fullDate: '2023-06-02',
			index: 5
		},
		{
			name: '周六',
			date: '03日',
			fullDate: '2023-06-03',
			index: 6
		},
		{
			name: '周日',
			date: '04日',
			fullDate: '2023-06-04',
			index: 7
		}
	])

	// 课程颜色映射
	const courseColors = {
		'思想政治实践课1': '#FF6B6B',
		'创新设计与创业基础': '#4ECDC4',
		'财务会计1': '#45B7D1',
		'小程序开发从入门到放弃': '#96CEB4',
		'大学英语A2': '#FFEAA7',
		'大学体育2': '#DDA0DD',
		'高等数学A2': '#98D8AA',
		'中国近现代史纲要': '#F8B195',
		'默认': '#2979FF'
	}

	// 解析 rawSection 字段
	const parseRawSection = (rawSection) => {
		if (!rawSection) return {
			day: 1,
			startPeriod: 1,
			endPeriod: 1
		};

		// 提取星期
		let day = 1; // 默认星期一
		if (rawSection.includes('一')) day = 1;
		else if (rawSection.includes('二')) day = 2;
		else if (rawSection.includes('三')) day = 3;
		else if (rawSection.includes('四')) day = 4;
		else if (rawSection.includes('五')) day = 5;
		else if (rawSection.includes('六')) day = 6;
		else if (rawSection.includes('日') || rawSection.includes('七')) day = 7;

		// 提取节次范围
		const timeMatch = rawSection.match(/\[(\d+)-(\d+)节\]/);
		if (timeMatch) {
			const startPeriod = parseInt(timeMatch[1]);
			const endPeriod = parseInt(timeMatch[2]);
			return {
				day,
				startPeriod,
				endPeriod
			};
		} else {
			// 如果没有找到范围，尝试找单独的节次
			const singleTimeMatch = rawSection.match(/\[(\d+)节\]/);
			if (singleTimeMatch) {
				const period = parseInt(singleTimeMatch[1]);
				return {
					day,
					startPeriod: period,
					endPeriod: period
				};
			}
		}

		return {
			day: 1,
			startPeriod: 1,
			endPeriod: 1
		};
	}

	// 将时间段映射到课表索引
	const mapPeriodToIndex = (period) => {
		if (period >= 1 && period <= 2) return 1; // 1-2节 -> 第1个时间段
		if (period >= 3 && period <= 4) return 2; // 3-4节 -> 第2个时间段
		if (period >= 5 && period <= 6) return 3; // 5-6节 -> 第3个时间段
		if (period >= 7 && period <= 8) return 4; // 7-8节 -> 第4个时间段
		if (period >= 9 && period <= 10) return 5; // 9-10节 -> 第5个时间段
		if (period >= 11 && period <= 12) return 6; // 11-12节 -> 第6个时间段
		return 1; // 默认第一个时间段
	}

	// 将API返回的课程数据转换为课表所需的格式
	const transformApiToSchedule = (apiCourses) => {
		const transformedCourses = [];

		apiCourses.forEach((apiCourse, index) => {
			// 解析 rawSection 字段
			const parsedSection = parseRawSection(apiCourse.rawSection);

			// 获取时间段索引
			const startIndex = mapPeriodToIndex(parsedSection.startPeriod);
			const endIndex = mapPeriodToIndex(parsedSection.endPeriod);

			// 计算持续时间
			const duration = endIndex - startIndex + 1;

			// 创建转换后的课程对象
			const course = {
				id: index + 1,
				name: apiCourse.name,
				location: apiCourse.address || apiCourse.location || '待定',
				day: parsedSection.day, // 星期几 (1-7)
				timeSlot: startIndex, // 开始时间段索引
				duration: duration, // 持续时间段数
				color: courseColors[apiCourse.name] || courseColors['默认'],
				num: apiCourse.num || '',
				credit: apiCourse.credit || 0,
				totalHours: apiCourse.totalHours || 0,
				teacher: apiCourse.teacher || '未知',
				week: apiCourse.week || '全周',
				category: apiCourse.category || '必修',
				sectionInfo: `${parsedSection.startPeriod}-${parsedSection.endPeriod}节`,
				rawSection: apiCourse.rawSection
			};

			transformedCourses.push(course);
		});

		return transformedCourses;
	}

	// 计算空白格子
	const blankCells = computed(() => {
		const blanks = [];
		const occupied = {};

		// 记录已有课程占用的位置
		courseList.value.forEach(course => {
			for (let i = 0; i < course.duration; i++) {
				const slotIndex = course.timeSlot + i;
				const key = `${course.day}-${slotIndex}`;
				occupied[key] = true;
			}
		});

		// 生成空白格子
		for (let day = 1; day <= 7; day++) {
			for (let timeSlot = 1; timeSlot <= 6; timeSlot++) {
				const key = `${day}-${timeSlot}`;
				if (!occupied[key]) {
					blanks.push({
						day,
						timeSlot
					});
				}
			}
		}

		return blanks;
	});

	// 页面加载
	onLoad(async () => {
		console.log('课表页面加载')
		await loadSchedule()
	})

	// 页面显示
	onShow(() => {
		console.log('课表页面显示')
	})

	// 加载课表数据
	const loadSchedule = async () => {
		loading.value = true
		networkError.value = false

		try {
			// 检查网络状态
			const networkType = await new Promise(resolve => {
				uni.getNetworkType({
					success: (res) => resolve(res.networkType),
					fail: () => resolve('unknown')
				});
			});

			if (networkType === 'none') {
				throw new Error('网络不可用');
			}

			// 调用API获取课程数据
			const response = await getCourseListRequest({});

			// 检查API返回的数据格式是否正确
			if (Array.isArray(response)) {
				// 转换API数据为课表格式
				courseList.value = transformApiToSchedule(response);
				console.log('转换后的课程数据:', courseList.value);
			} else if (response && Array.isArray(response.data)) {
				// 如果API返回格式为 { code: 200, msg: "请求成功", data: [...] }
				courseList.value = transformApiToSchedule(response.data);
				console.log('转换后的课程数据:', courseList.value);
			} else {
				uni.showToast({
					title: '数据格式错误',
					icon: 'none'
				});
			}
		} catch (error) {
			console.error('API请求失败:', error);

			// 显示错误信息
			if (error.errMsg && error.errMsg.includes('fail')) {
				networkError.value = true;
				uni.showToast({
					title: '网络请求失败，请检查服务器连接',
					icon: 'none'
				});
			} else {
				uni.showToast({
					title: error.message || '网络请求失败，请检查网络',
					icon: 'none'
				});
			}
		} finally {
			loading.value = false;
		}
	}

	// 刷新课表数据
	const refreshSchedule = async () => {
		loading.value = true
		networkError.value = false
		console.log('刷新课表数据')

		try {
			// 检查网络状态
			const networkType = await new Promise(resolve => {
				uni.getNetworkType({
					success: (res) => resolve(res.networkType),
					fail: () => resolve('unknown')
				});
			});

			if (networkType === 'none') {
				throw new Error('网络不可用');
			}

			// 调用API获取最新课程数据
			const response = await getCourseListRequest({});

			if (Array.isArray(response)) {
				// 转换API数据为课表格式
				courseList.value = transformApiToSchedule(response);
				console.log('刷新后的课程数据:', courseList.value);
			} else if (response && Array.isArray(response.data)) {
				// 如果API返回格式为 { code: 200, msg: "请求成功", data: [...] }
				courseList.value = transformApiToSchedule(response.data);
				console.log('刷新后的课程数据:', courseList.value);
			} else {
				uni.showToast({
					title: '数据格式错误',
					icon: 'none'
				});
			}

			uni.showToast({
				title: '课表已刷新',
				icon: 'success',
				duration: 1500
			});
		} catch (error) {
			console.error('刷新API请求失败:', error);

			// 显示错误信息
			if (error.errMsg && error.errMsg.includes('fail')) {
				networkError.value = true;
				uni.showToast({
					title: '网络请求失败，请检查服务器连接',
					icon: 'none'
				});
			} else {
				uni.showToast({
					title: error.message || '网络请求失败，请检查网络',
					icon: 'none'
				});
			}
		} finally {
			loading.value = false;
		}
	}

	// 判断是否是今天
	const isToday = (day) => {
		const today = new Date();
		const todayDay = today.getDate();
		return day.date === `${todayDay.toString().padStart(2, '0')}日`;
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

	// 获取空白格子样式
	const getBlankCellStyle = (cell) => {
		const dayWidth = 100 / 7 // 每天占网格宽度的百分比
		const slotHeight = 200 // 每个时间段高度（单位：rpx）

		// 计算位置
		const left = `${(cell.day - 1) * dayWidth}%`
		const top = `${(cell.timeSlot - 1) * slotHeight}rpx`
		const height = `${slotHeight}rpx`
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

		uni.showModal({
			title: course.name,
			content: `课程编号：${course.num}\n学分：${course.credit}\n教师：${course.teacher}\n地点：${course.location}\n时间：${course.sectionInfo}\n星期：${['', '一', '二', '三', '四', '五', '六', '日'][course.day]}\n周次：${course.week}\n类型：${course.category}\n原始时间：${course.rawSection}`,
			showCancel: true,
			confirmText: '确定',
			cancelText: '关闭'
		})
	}

	// 处理长按课程
	const handleLongPress = (course) => {
		console.log('长按课程:', course)

		// 添加长按效果
		addLongPressEffect(course.id)

		// 设置编辑课程数据
		editingCourse.value = {
			id: course.id,
			name: course.name,
			location: course.location,
			teacher: course.teacher,
			day: course.day,
			timeSlot: course.timeSlot,
			duration: course.duration,
			color: course.color
		}

		// 显示编辑弹窗
		showEditPopup.value = true
	}

	// 处理长按空白格
	const handleLongPressEmpty = (cell) => {
		console.log('长按空白格:', cell)

		// 添加长按效果
		addLongPressEffect(`${cell.day}-${cell.timeSlot}`)

		// 设置新增课程数据
		editingCourse.value = {
			id: null,
			name: '',
			location: '',
			teacher: '',
			day: cell.day,
			timeSlot: cell.timeSlot,
			duration: 1,
			color: '#2979FF'
		}

		// 显示编辑弹窗
		showEditPopup.value = true
	}

	// 添加长按效果
	const addLongPressEffect = (itemId) => {
		// 移除之前的长按效果
		longPressedItems.value = longPressedItems.value.filter(id => id !== itemId)

		// 添加当前项目的长按效果
		longPressedItems.value.push(itemId)

		// 3秒后自动移除效果
		setTimeout(() => {
			longPressedItems.value = longPressedItems.value.filter(id => id !== itemId)
		}, 3000)
	}

	// 检查项目是否处于长按状态
	const isLongPressed = (itemId) => {
		return longPressedItems.value.includes(itemId)
	}

	// 关闭编辑弹窗
	const closeEditPopup = () => {
		showEditPopup.value = false
		editingCourse.value = {
			id: null,
			name: '',
			location: '',
			teacher: '',
			day: 1,
			timeSlot: 1,
			duration: 1,
			color: '#2979FF'
		}
	}

	// 保存课程
	const saveCourse = () => {
		if (!editingCourse.value.name.trim()) {
			uni.showToast({
				title: '请输入课程名称',
				icon: 'none'
			});
			return;
		}

		if (editingCourse.value.id) {
			// 编辑现有课程
			const index = courseList.value.findIndex(c => c.id === editingCourse.value.id);
			if (index !== -1) {
				courseList.value[index] = {
					...editingCourse.value
				};
			}
		} else {
			// 添加新课程
			const newId = Math.max(...courseList.value.map(c => c.id), 0) + 1;
			courseList.value.push({
				...editingCourse.value,
				id: newId
			});
		}

		uni.showToast({
			title: editingCourse.value.id ? '课程已更新' : '课程已添加',
			icon: 'success'
		});

		closeEditPopup();
	}

	// 处理菜单选择
	const handleMenuSelect = (item) => {
		console.log('点击的菜单项:', item);
		showMenu.value = false

		switch (item.action) {
			case 'scores':
				// 成绩查询页面
				uni.navigateTo({
					url: '/pages/academic/score'
				});
				break;
			case 'exams':
				// 考试安排页面
				uni.navigateTo({
					url: '/pages/academic/exam'
				});
				break;
			case 'settings':
				// 课表设置页面
				uni.navigateTo({
					url: '/pages/academic/settings'
				});
				break;
			default:
				uni.showToast({
					title: '功能暂未开放',
					icon: 'none'
				});
		}
	}

	// 更新当前时间指示器
	const updateCurrentTimeIndicator = () => {
		const now = new Date();
		const currentHour = now.getHours();
		const currentMinute = now.getMinutes();
		const currentTime = currentHour * 60 + currentMinute; // 转换为分钟数便于比较

		// 定义课表时间段（分钟数）
		const timeRanges = [{
				start: 8 * 60 + 20,
				end: 10 * 60,
				index: 1
			}, // 08:20-10:00
			{
				start: 10 * 60 + 20,
				end: 12 * 60,
				index: 2
			}, // 10:20-12:00
			{
				start: 14 * 60,
				end: 15 * 60 + 40,
				index: 3
			}, // 14:00-15:40
			{
				start: 16 * 60,
				end: 17 * 60 + 40,
				index: 4
			}, // 16:00-17:40
			{
				start: 18 * 60 + 40,
				end: 20 * 60 + 20,
				index: 5
			}, // 18:40-20:20
			{
				start: 20 * 60 + 30,
				end: 22 * 60 + 10,
				index: 6
			} // 20:30-22:10
		];

		// 检查当前时间是否在课表时间段内
		for (let i = 0; i < timeRanges.length; i++) {
			const range = timeRanges[i];
			if (currentTime >= range.start && currentTime <= range.end) {
				// 计算当前时间在时间段内的相对位置
				const totalDuration = range.end - range.start;
				const elapsed = currentTime - range.start;
				const positionPercent = (elapsed / totalDuration) * 100;

				currentTimeIndicator.value = {
					visible: true,
					time: now,
					slotIndex: range.index,
					position: positionPercent
				};
				return;
			}
		}

		// 如果不在上课时间段内，隐藏指示器
		currentTimeIndicator.value = {
			visible: false,
			time: null,
			slotIndex: 0,
			position: 0
		};
	};

	// 获取当前时间指示器样式
	const getCurrentTimeIndicatorStyle = () => {
		const dayWidth = 100 / 7;
		const slotHeight = 200; // 每个时间段高度（单位：rpx）

		// 计算位置
		const left = '0';
		const top =
			`${(currentTimeIndicator.value.slotIndex - 1) * slotHeight + (slotHeight * currentTimeIndicator.value.position / 100)}rpx`;
		const width = '100%';

		return {
			left,
			top,
			width,
			height: '4rpx',
			backgroundColor: '#ff4757',
			position: 'absolute',
			zIndex: '20',
			borderRadius: '2rpx'
		};
	};

	// 获取星期选项
	const weekOptions = computed(() => {
		return ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
	});

	// 获取时间槽选项
	const timeSlotOptions = computed(() => {
		return timeSlots.value.map(slot => slot.period);
	});

	// 获取持续时间选项
	const durationOptions = computed(() => {
		return Array.from({
			length: 6
		}, (_, i) => `${i + 1}节`);
	});

	// 处理星期变化
	const onDayChange = (value) => {
		editingCourse.value.day = value[0] + 1;
		showDayPicker.value = false;
	};

	// 处理时间槽变化
	const onTimeSlotChange = (value) => {
		editingCourse.value.timeSlot = value[0] + 1;
		showTimeSlotPicker.value = false;
	};

	// 处理持续时间变化
	const onDurationChange = (value) => {
		editingCourse.value.duration = value[0] + 1;
		showDurationPicker.value = false;
	};

	// 更新当前月份
	const updateCurrentMonth = () => {
		const now = new Date();
		const month = now.getMonth() + 1;
		currentMonth.value = `${month.toString().padStart(2, '0')}月`;
	};

	// 初始化定时器
	let timer = null;

	onMounted(() => {
		// 更新当前月份
		updateCurrentMonth();

		// 初始化当前时间指示器
		updateCurrentTimeIndicator();

		// 每分钟更新一次当前时间指示器
		timer = setInterval(() => {
			updateCurrentTimeIndicator();
		}, 60000); // 每分钟更新一次
	});

	onUnmounted(() => {
		// 清除定时器
		if (timer) {
			clearInterval(timer);
		}
	});
</script>

<style lang="scss" scoped>
	.academic-container {
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

	/* 课表滚动容器 */
	.schedule-scroll {
		flex: 1;
		/* 移除 overflow: hidden，改为 auto 或由 scroll-view 自身控制 */
		// overflow-y: auto;
	}

	.schedule-content {
		display: flex;
		position: relative;
	}

	/* 时间轴 */
	.time-axis {
		width: 100rpx;
		/* 改为原来的一半 */
		flex-shrink: 0;
		background-color: #ffffff;

		.time-axis-header {
			height: 80rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			border-bottom: 1px solid #f0f0f0;
		}

		.month-text {
			font-size: 26rpx;
			color: #333;
			font-weight: 500;
		}

		.time-slot {
			height: 200rpx;
			/* 恢复原来的高度 */
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			border-bottom: 1px solid #f0f0f0;
			padding: 10rpx 0;
			text-align: center;
		}

		.time-text {
			font-size: 24rpx;
			color: #333;
			font-weight: 500;
		}
	}

	/* 课表网格 */
	.schedule-grid {
		flex: 1;
		display: flex;
		flex-direction: column;
		background-color: #ffffff;
	}

	/* 星期头部 */
	.week-header {
		display: flex;
		height: 80rpx;
		flex-shrink: 0;

		.day-header {
			flex: 1;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			border-right: 1px solid #f0f0f0;

			&:last-child {
				border-right: none;
			}

			&.today {
				background-color: #fff9e6;
			}
		}

		.day-name {
			font-size: 26rpx;
			color: #333;
			font-weight: 500;
		}

		.day-date {
			font-size: 22rpx;
			color: #999;
			margin-top: 4rpx;
		}
	}

	/* 网格容器 */
	.grid-container {
		flex: 1;
		position: relative;
		/* 给 grid-container 添加背景，方便调试 */

		// background: #f0f0f0;
		/* 临时添加，确认网格是否完整渲染 */
		// height: 1200rpx; // 关键：设置课表总高度


		.grid-lines {
			width: 100%;

			.grid-row {
				height: 200rpx;
				/* 恢复原来的高度 */
				border-bottom: 1px solid #f0f0f0;

				&:last-child {
					border-bottom: none;
				}
			}
		}
	}

	/* 课程块 */
	.course-block {
		position: absolute;
		padding: 8rpx;
		z-index: 10;
		transition: all 0.2s ease;

		&.long-press-active {
			transform: scale(0.98);
			opacity: 0.8;
		}

		.course-content {
			width: 100%;
			height: 100%;
			border-radius: 12rpx;
			padding: 12rpx;
			box-sizing: border-box;
			display: flex;
			flex-direction: column;
			justify-content: center;
			overflow: hidden;
			box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);

			.course-name {
				font-size: 24rpx;
				color: #fff;
				font-weight: 500;
				word-break: break-all;
				line-height: 1.3;
			}

			.course-location {
				font-size: 20rpx;
				color: rgba(255, 255, 255, 0.9);
				margin-top: 4rpx;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
		}
	}

	/* 空白格子 */
	.blank-cell {
		position: absolute;
		z-index: 5;
		transition: all 0.2s ease;

		&.long-press-active {
			background-color: rgba(255, 71, 87, 0.2);
			border: 2rpx dashed #ff4757;
		}
	}

	/* 当前时间指示器 */
	.current-time-indicator {
		position: absolute;
		left: 0;
		height: 4rpx;
		background-color: #ff4757;
		z-index: 20;
		border-radius: 2rpx;
		box-shadow: 0 0 8rpx rgba(255, 71, 87, 0.6);
	}

	/* 编辑弹窗样式 */
	.edit-popup-content {
		width: 600rpx;
		padding: 40rpx;
		background-color: #fff;
		border-radius: 20rpx;
	}

	.popup-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 30rpx;
	}

	.popup-title {
		font-size: 32rpx;
		color: #333;
		font-weight: bold;
	}

	.form-group {
		margin-bottom: 30rpx;

		.label {
			display: block;
			font-size: 28rpx;
			color: #333;
			margin-bottom: 10rpx;
		}

		.input {
			width: 100%;
			height: 80rpx;
			border: 2rpx solid #e5e5e5;
			border-radius: 10rpx;
			padding: 0 20rpx;
			font-size: 28rpx;
			box-sizing: border-box;
		}

		.picker-value {
			width: 100%;
			height: 80rpx;
			border: 2rpx solid #e5e5e5;
			border-radius: 10rpx;
			padding: 0 20rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: 28rpx;
			color: #333;
		}
	}

	.button-group {
		display: flex;
		gap: 20rpx;
		margin-top: 20rpx;
	}

	.btn-cancel {
		flex: 1;
		height: 80rpx;
		background-color: #f5f5f5;
		color: #666;
		border-radius: 10rpx;
		border: none;
		font-size: 28rpx;
	}

	.btn-confirm {
		flex: 1;
		height: 80rpx;
		background-color: #2979ff;
		color: white;
		border-radius: 10rpx;
		border: none;
		font-size: 28rpx;
	}

	/* 网络错误提示 */
	.network-error {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #f8f9fa;
		z-index: 1000;
	}

	.error-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 40rpx;
	}

	.error-text {
		font-size: 32rpx;
		color: #333;
		margin-top: 20rpx;
		font-weight: 500;
	}

	.error-desc {
		font-size: 26rpx;
		color: #999;
		margin-top: 10rpx;
		text-align: center;
	}

	.retry-btn {
		margin-top: 40rpx;
		padding: 20rpx 40rpx;
		background-color: #2979ff;
		color: white;
		border-radius: 10rpx;
		border: none;
		font-size: 28rpx;
	}

	/* 服务器配置提示模态框 */
	.server-config-modal {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 2000;
	}

	.config-content {
		background-color: #fff;
		border-radius: 20rpx;
		padding: 40rpx;
		width: 80%;
		max-width: 500rpx;
		text-align: center;
	}

	.config-title {
		font-size: 32rpx;
		color: #333;
		font-weight: bold;
		display: block;
		margin-bottom: 20rpx;
	}

	.config-desc {
		font-size: 26rpx;
		color: #666;
		display: block;
		margin-bottom: 30rpx;
	}

	.config-info {
		font-size: 24rpx;
		color: #999;
		display: block;
		text-align: left;
		margin-bottom: 10rpx;
	}

	.close-btn {
		margin-top: 30rpx;
		padding: 20rpx 40rpx;
		background-color: #2979ff;
		color: white;
		border-radius: 10rpx;
		border: none;
		font-size: 28rpx;
	}
</style>