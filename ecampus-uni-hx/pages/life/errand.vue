<template>
	<view class="content">
		<view class="header-fixed">
			<!-- 顶部导航栏 -->
			<view class="navbar">
				<!-- <view class="navbar-left"> -->
				<up-navbar title="跑腿服务" bg-color="#00000000" :autoBack="true" left-icon-color="#000"></up-navbar>
				<!-- </view> -->
				<!-- <view class="navbar-right">
					<u-icon name="list" size="24" color="#333333"></u-icon>
				</view> -->
			</view>

			<!-- 分类切换 -->
			<view class="category-area">
				<view v-for="(category, index) in categoryList" :key="index" class="category-item"
					:class="{ active: currentCategory === index }" @click="handleCategoryChange(index)">
					<text>{{ category }}</text>
				</view>
			</view>
		</view>

		<view class="errand-container">

			<!-- 标题区域 -->
			<view class="title-area">
				<text class="section-title">跑腿接单大厅</text>
			</view>

			<!-- 订单列表（两列布局） -->
			<!-- <view class="orders-container">
				<view class="orders-wrapper">
					<view v-for="order in filteredOrders" :key="order.id" class="order-card"
						@click="handleCardClick(order.id)">
						<view class="order-header">
							<text class="order-no">订单号: {{ order.orderNo }}</text>
						</view>

						<view class="order-body">
							<text class="order-content">{{ order.content }}</text>
							<text class="order-address">{{ order.address }}</text>
						</view>

						<view class="order-footer">
							<view class="price-box">
								<text class="price-label">赏金</text>
								<text class="price-value">¥{{ order.price }}</text>
							</view>
							<u-button type="primary" size="small" shape="circle"
								@click.stop="handleAcceptOrder(order.id)"
								style="width: 70px; height: 70px; display: flex; align-items: center; justify-content: center;">
								<u-icon name="arrow-right" size="20" color="#ffffff"></u-icon>
							</u-button>
						</view>
					</view>
				</view>
			</view> -->
			<up-waterfall v-model="filteredOrders" ref="uWaterfallRef">
				<template v-slot:left="{leftList}">
					<view class="demo-water" v-for="(order,index) in leftList" :key="order.id"
						@click="handleCardClick(order.id)">
						<view class="order-header">
							<text class="order-no">订单号: {{ order.orderNo }}</text>
						</view>
						<view class="order-body">
							<text class="order-content">{{ order.content }}</text>
							<text class="order-address">{{ order.address }}</text>
						</view>
						<view class="order-footer">
							<view class="price-box">
								<!-- <text class="price-label">赏金</text> -->
								<text class="price-value">¥{{ order.price }}</text>
							</view>
							<u-button type="primary" size="small" shape="circle"
								@click.stop="handleAcceptOrder(order.id)" style="width: 70px; height: 70px;">
								<u-icon name="arrow-right" size="20" color="#ffffff"></u-icon>
							</u-button>
						</view>
					</view>
				</template>
				<template v-slot:right="{rightList}">
					<view class="demo-water" v-for="(order,index) in rightList" :key="order.id"
						@click="handleCardClick(order.id)">
						<view class="order-header">
							<text class="order-no">订单号: {{ order.orderNo }}</text>
						</view>
						<view class="order-body">
							<text class="order-content">{{ order.content }}</text>
							<text class="order-address">{{ order.address }}</text>
						</view>
						<view class="order-footer">
							<view class="price-box">
								<!-- <text class="price-label">赏金</text> -->
								<text class="price-value">¥{{ order.price }}</text>
							</view>
							<u-button type="primary" size="small" shape="circle"
								@click.stop="handleAcceptOrder(order.id)" style="width: 70px; height: 70px;">
								<u-icon name="arrow-right" size="20" color="#ffffff"></u-icon>
							</u-button>
						</view>
					</view>
				</template>
			</up-waterfall>


			<!-- 底部发单按钮 -->
			<view class="publish-btn-area">
				<u-button type="primary" text="我要发单" shape="circle" @click="handlePublish"
					class="publish-btn"></u-button>
				<view class="order-list-btn" @click="handleOrderList">
					<u-icon name="list" size="28" color="#ffffff"></u-icon>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		onLoad,
		onReachBottom,
	} from '@dcloudio/uni-app'
	import {
		ref,
		reactive,
		computed,
		nextTick
	} from 'vue'

	const uWaterfallRef = ref(null)

	onLoad((opt) => {
		if (opt && opt.name) {
			try {
				const data = JSON.parse(decodeURIComponent(opt.name))
				console.log(data)
			} catch (error) {
				console.error('参数解析错误:', error)
			}
		} else {
			console.log('页面直接打开或参数为空，使用默认数据')
		}
		// 2. 初始化时加载默认分类数据
		updateOrderList()
	})

	// ✅ 触底加载
	// onReachBottom(() => {
	// 	console.log('触底加载新订单')
	// 	setTimeout(() => {
	// 		addRandomOrder()
	// 	}, 500)
	// })

	// 分类列表
	const categoryList = ref(['帮买', '帮送', '帮取', '代排队'])
	const currentCategory = ref(0)

	// 订单 mock 数据
	const orderList = ref([{
			id: 1,
			orderNo: 'ORD20260425001',
			type: 0,
			content: '购买校外便利店的饮料和零食',
			address: '文理楼北边',
			price: 15
		},
		{
			id: 2,
			orderNo: 'ORD20260425002',
			type: 1,
			content: '送快递到学生宿舍5号楼',
			address: '宿舍楼5号',
			price: 8
		},
		{
			id: 3,
			orderNo: 'ORD20260425003',
			type: 2,
			content: '帮忙取教材到图书馆',
			address: '图书馆一楼',
			price: 12
		},
		{
			id: 4,
			orderNo: 'ORD20260425004',
			type: 0,
			content: '去食堂买早餐',
			address: '宿舍楼2号',
			price: 10
		},
		{
			id: 5,
			orderNo: 'ORD20260425005',
			type: 1,
			content: '将行李送到火车站',
			address: '火车站',
			price: 25
		},
		{
			id: 6,
			orderNo: 'ORD20260425006',
			type: 3,
			content: '帮忙排队办理校卡',
			address: '校务处',
			price: 20
		},
		{
			id: 7,
			orderNo: 'ORD20260425007',
			type: 0,
			content: '购买奶茶一杯',
			address: '宿舍楼3号',
			price: 8
		},
		{
			id: 8,
			orderNo: 'ORD20260425008',
			type: 2,
			content: '取包裹到自提点',
			address: '宿舍楼1号',
			price: 5
		},
		{
			id: 9,
			orderNo: 'ORD20260425009',
			type: 1,
			content: '送文件到办公室',
			address: '行政楼3楼',
			price: 12
		},
		{
			id: 10,
			orderNo: 'ORD20260425010',
			type: 0,
			content: '购买日用品和洗护用品',
			address: '宿舍楼4号',
			price: 18
		}
	])

	// 根据分类过滤订单
	// const filteredOrders = computed(() => {
	// 	return orderList.value.filter(order => order.type === currentCategory.value)
	// })
	// 3. 【关键修改】将 computed 改为 ref，用于绑定 waterfall
	const filteredOrders = ref([])

	// 4. 【新增】更新订单列表的函数
	const updateOrderList = () => {
		// 过滤出当前分类的订单
		const newList = orderList.value.filter(order => order.type === currentCategory.value)

		// 方案 A: 直接赋值 (大多数情况下有效，因为引用变了)
		// 如果方案 A 无效，尝试方案 B

		// 方案 B: 先清空，再赋值 (更稳妥，强制 waterfall 重排)
		// 注意：up-waterfall 可能有 clear 方法，查阅文档。如果没有，直接赋空数组再赋新值
		// filteredOrders.value = [] 
		// nextTick(() => {
		//    filteredOrders.value = newList
		// })

		// 这里先尝试直接赋值，因为 computed 也是返回新引用，之前不行可能是组件内部问题
		// 但为了确保万无一失，我们采用“先清后加”的策略模拟
		filteredOrders.value = newList

		// 如果发现还是没刷新，取消下面注释使用 nextTick 策略
		/*
		nextTick(() => {
		    // 某些版本可能需要手动触发 layout，但通常赋值即可
		})
		*/
	}

	// 分类切换
	const handleCategoryChange = (index) => {
		if (currentCategory.value === index) return

		currentCategory.value = index
		console.log(`切换到: ${categoryList.value[index]}`)

		// 切换分类时，重新计算并赋值
		// 为了强制 waterfall 组件感知到数据的“彻底”变化，可以先置空
		/* filteredOrders.value = []
		
		nextTick(() => {
			updateOrderList()
		})

        // ✅ 关键步骤：获取组件实例并调用 clear() 方法
    const waterfall = uWaterfallRef.value
    if (waterfall && waterfall.clear) {
        waterfall.clear()
    } */
		// 等待组件内部状态重置
		//await nextTick()

		// 重新赋值新的数据
		filteredOrders.value = orderList.value.filter(order => order.type === currentCategory.value)
	}

	// 卡片点击
	const handleCardClick = (orderId) => {
		console.log(`点击了订单 ID: ${orderId}`)
	}

	// ✅ 模拟添加随机订单
	// const addRandomOrder = () => {
	// 	const contents = [
	// 		'购买咖啡',
	// 		'送快递到教室',
	// 		'帮忙打印资料',
	// 		'取快递到宿舍',
	// 		'买饭到宿舍',
	// 		'代取借书证',
	// 		'送文件到办公室',
	// 		'购买零食饮料'
	// 	]
	// 	const addresses = ['文理楼', '宿舍楼1号', '宿舍楼2号', '图书馆', '食堂', '校务处', '行政楼']

	// 	for (let i = 0; i < 4; i++) {
	// 		const newOrder = {
	// 			id: orderList.value.length + i + 1,
	// 			orderNo: `ORD${Date.now()}${i}`,
	// 			type: currentCategory.value,
	// 			content: contents[Math.floor(Math.random() * contents.length)],
	// 			address: addresses[Math.floor(Math.random() * addresses.length)],
	// 			price: Math.floor(Math.random() * 30) + 5
	// 		}
	// 		orderList.value.push(newOrder)
	// 	}
	// }

	// 接单
	const handleAcceptOrder = (orderId) => {
		console.log(`接单了订单 ID: ${orderId}`)
	}

	// 发单
	const handlePublish = () => {
		console.log('发单')
	}

	// 返回
	const handleBack = () => {
		console.log('返回')
	}
</script>

<style lang="scss" scoped>
	.content {
		padding: 0;
	}

	.header-fixed {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		background-color: #ffffff;
		z-index: 99;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
	}

	.errand-container {
		background-color: #f5f5f5;
		min-height: 100vh;
		padding-bottom: 100px;
		margin-top: 140px;
	}

	// 分类切换
	.category-area {
		background-color: #ffffff;
		padding: 16px;
		display: flex;
		gap: 12px;
		overflow-x: auto;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

		.category-item {
			flex-shrink: 0;
			padding: 8px 20px;
			margin-top: 80px;
			border: 1px solid #e0e0e0;
			border-radius: 999rpx;
			background-color: #ffffff;
			color: #666666;
			font-size: 14px;
			transition: all 0.3s ease;
			white-space: nowrap;

			&.active {
				background-color: #2979ff;
				color: #ffffff;
				border-color: #2979ff;
			}
		}
	}

	// 标题区域
	.title-area {
		padding: 20px 16px 12px;

		.section-title {
			font-size: 18px;
			font-weight: bold;
			color: #333333;
		}
	}

	// ✅ 瀑布流样式
	.demo-water {
		margin: 15rpx 5rpx 15rpx 15rpx;
		background-color: #ffffff;
		border-radius: 16rpx;
		padding: 8px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		display: flex;
		flex-direction: column;

		&:active {
			transform: scale(0.96);
			box-shadow: 0 6px 16px rgba(41, 121, 255, 0.15);
		}

		.order-header {
			margin-bottom: 8px;

			.order-no {
				font-size: 11px;
				color: #999999;
			}
		}

		.order-body {
			flex: 1;
			margin-bottom: 12px;

			.order-content {
				display: block;
				font-size: 13px;
				font-weight: 600;
				color: #333333;
				line-height: 1.5;
				margin-bottom: 6px;
			}

			.order-address {
				display: block;
				font-size: 12px;
				color: #666666;
			}
		}

		.order-footer {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 8px;

			.price-box {
				display: flex;
				flex-direction: column;
				align-items: center;

				// .price-label {
				// 	font-size: 11px;
				// 	color: #999999;
				// 	margin-bottom: 2px;
				// }

				.price-value {
					font-size: 16px;
					font-weight: bold;
					color: #ff7a18;
				}
			}
		}

		// 订单列表容器
		.orders-container {
			padding: 0 16px 80px;


		}

		/* .orders-wrapper {
			display: flex;
			flex-wrap: wrap;
			gap: 12px;
			justify-content: space-between;

			.order-card {
				width: calc(50% - 6px);
				background-color: #ffffff;
				border-radius: 16rpx;
				padding: 12px;
				box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
				transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
				display: flex;
				flex-direction: column;

				&:active {
					transform: scale(0.96);
					box-shadow: 0 6px 16px rgba(41, 121, 255, 0.15);
				}

				.order-header {
					margin-bottom: 8px;

					.order-no {
						font-size: 11px;
						color: #999999;
					}
				}

				.order-body {
					flex: 1;
					margin-bottom: 12px;

					.order-content {
						display: block;
						font-size: 13px;
						font-weight: 600;
						color: #333333;
						line-height: 1.5;
						margin-bottom: 6px;
					}

					.order-address {
						display: block;
						font-size: 12px;
						color: #666666;
					}
				}

				.order-footer {
					display: flex;
					align-items: center;
					justify-content: space-between;
					gap: 8px;

					.price-box {
						display: flex;
						flex-direction: column;
						align-items: center;

						.price-label {
							font-size: 11px;
							color: #999999;
							margin-bottom: 2px;
						}

						.price-value {
							font-size: 16px;
							font-weight: bold;
							color: #ff7a18;
						}
					}
				}
			}
		} */
	}

	// 底部发单按钮
	.publish-btn-area {
		position: fixed;
		bottom: 20px;
		left: 0;
		right: 0;
		display: flex;
		justify-content: center;
		gap: 16px;
		padding: 0 16px;
		z-index: 99;

		.publish-btn {
			width: calc(100% - 100px);
			background: linear-gradient(90deg, #ff7a18, #ffb347);
			border: none;
		}

		.order-list-btn {
			width: 40px;
			height: 40px;
			background-color: #2979ff;
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
			box-shadow: 0 4px 12px rgba(41, 121, 255, 0.3);
			flex-shrink: 0;
		}
	}
</style>