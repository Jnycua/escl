<template>
	<view class="campus-container">

		<!-- 分类标签栏 -->
		<view class="tabs-area">
			<u-tabs :list="tabList" :current="currentTab" @change="handleTabChange" active-color="#2979ff"
				inactive-color="#999999" :line-color="'#2979ff'" :item-style="{
                    padding: '0 20rpx',
                    height: '80rpx',
                    fontSize: '14px'
                }"></u-tabs>
		</view>

		<!-- 帖子列表 (使用 computed 属性 filteredPosts) -->
		<view class="posts-area">
			<view v-for="post in filteredPosts" :key="post.id" class="post-card" @click="handlePostClick(post.id)">
				<!-- 左侧文本内容 -->
				<view class="post-content">
					<text class="post-title">{{ post.title }}</text>
					<text class="post-date">{{ post.date }}</text>
				</view>

				<!-- 右侧缩略图 -->
				<view class="post-image">
					<u-image :src="post.cover" width="160rpx" height="120rpx" border-radius="8rpx"></u-image>
				</view>
			</view>

			<!-- 当该分类下没有帖子时显示的提示 -->
			<view v-if="filteredPosts.length === 0" class="empty-tip">
				<text>该分类下暂时没有内容</text>
			</view>
		</view>

		<!-- 底部留白 -->
		<view class="footer-space"></view>

		<!-- 悬浮按钮 -->
		<view class="editClass" @click="goToCommentPage">
			<up-icon name="edit-pen" color="#fff" size="36"></up-icon>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		computed,
		onMounted
	} from 'vue'

	// --- 1. 数据定义 ---
	const tabList = ref([])
	const currentTab = ref(0)

	// 给帖子数据增加 category 字段，对应 tabList 的索引
	const postList = ref([
		// 校园搭子 category:0
		{
			id: 1,
			category: 0,
			title: '有没有人想一起打羽毛球的，每天傍晚操场约',
			date: '2026年4月25日',
			cover: 'https://cdn.uviewui.com/uview/album/1.jpg'
		},
		{
			id: 2,
			category: 0,
			title: '求一个早八搭子，一起起床上课不迟到',
			date: '2026年4月24日',
			cover: 'https://cdn.uviewui.com/uview/album/2.jpg'
		},
		{
			id: 3,
			category: 0,
			title: '周末一起去图书馆学习的有吗？互相监督',
			date: '2026年4月23日',
			cover: 'https://cdn.uviewui.com/uview/album/3.jpg'
		},
		{
			id: 4,
			category: 0,
			title: '求跑步搭子，每天晚上操场5公里',
			date: '2026年4月22日',
			cover: 'https://cdn.uviewui.com/uview/album/4.jpg'
		},
		{
			id: 5,
			category: 0,
			title: '干饭搭子在哪里？每天一起去食堂干饭',
			date: '2026年4月21日',
			cover: 'https://cdn.uviewui.com/uview/album/5.jpg'
		},
		{
			id: 6,
			category: 0,
			title: '求室友一枚，爱干净不熬夜，性格好相处',
			date: '2026年4月20日',
			cover: 'https://cdn.uviewui.com/uview/album/6.jpg'
		},
		{
			id: 7,
			category: 0,
			title: '有没有一起考驾照的搭子？组团报名',
			date: '2026年4月19日',
			cover: 'https://cdn.uviewui.com/uview/album/1.jpg'
		},
		{
			id: 8,
			category: 0,
			title: '乒乓球搭子有无？新手也可以一起玩',
			date: '2026年4月18日',
			cover: 'https://cdn.uviewui.com/uview/album/2.jpg'
		},
	
		// 美食分享 category:1
		{
			id: 9,
			category: 1,
			title: '食堂三楼新出的奶油意面真的绝了，强烈推荐',
			date: '2026年4月25日',
			cover: 'https://cdn.uviewui.com/uview/album/3.jpg'
		},
		{
			id: 10,
			category: 1,
			title: '校门口奶茶店新品测评，这杯最好喝',
			date: '2026年4月24日',
			cover: 'https://cdn.uviewui.com/uview/album/4.jpg'
		},
		{
			id: 11,
			category: 1,
			title: '二食堂麻辣香锅，加麻加辣太香了',
			date: '2026年4月23日',
			cover: 'https://cdn.uviewui.com/uview/album/5.jpg'
		},
		{
			id: 12,
			category: 1,
			title: '学校附近新开烤肉店，性价比超高',
			date: '2026年4月22日',
			cover: 'https://cdn.uviewui.com/uview/album/6.jpg'
		},
		{
			id: 13,
			category: 1,
			title: '早餐推荐！食堂包子配豆浆永远的神',
			date: '2026年4月21日',
			cover: 'https://cdn.uviewui.com/uview/album/1.jpg'
		},
		{
			id: 14,
			category: 1,
			title: '水果捞测评，这家分量最足最新鲜',
			date: '2026年4月20日',
			cover: 'https://cdn.uviewui.com/uview/album/2.jpg'
		},
		
		// 热门八卦 category:2
		{
			id: 15,
			category: 2,
			title: '听说学校宿舍要装修了，是真的吗？',
			date: '2026年4月25日',
			cover: 'https://cdn.uviewui.com/uview/album/3.jpg'
		},
		{
			id: 16,
			category: 2,
			title: '校园网红墙打卡，好多人拍照',
			date: '2026年4月24日',
			cover: 'https://cdn.uviewui.com/uview/album/4.jpg'
		},
		{
			id: 17,
			category: 2,
			title: '学校流浪猫也太可爱了吧，每天都来蹭人',
			date: '2026年4月23日',
			cover: 'https://cdn.uviewui.com/uview/album/5.jpg'
		},
		{
			id: 18,
			category: 2,
			title: '下礼拜要降温了，大家注意添衣',
			date: '2026年4月22日',
			cover: 'https://cdn.uviewui.com/uview/album/6.jpg'
		},
		{
			id: 19,
			category: 2,
			title: '校园樱花全开了，拍照超出片',
			date: '2026年4月21日',
			cover: 'https://cdn.uviewui.com/uview/album/1.jpg'
		},
		{
			id: 20,
			category: 2,
			title: '晚自习教室人也太多了吧，学习氛围拉满',
			date: '2026年4月20日',
			cover: 'https://cdn.uviewui.com/uview/album/2.jpg'
		},
	
		// 竞赛讨论 category:3
		{
			id: 21,
			category: 3,
			title: '全国大学生编程竞赛报名已开启，组队吗',
			date: '2026年4月25日',
			cover: 'https://cdn.uviewui.com/uview/album/3.jpg'
		},
		{
			id: 22,
			category: 3,
			title: '互联网+大赛备赛经验分享，干货满满',
			date: '2026年4月24日',
			cover: 'https://cdn.uviewui.com/uview/album/4.jpg'
		},
		{
			id: 23,
			category: 3,
			title: '英语四六级备考资料分享，需要的私',
			date: '2026年4月23日',
			cover: 'https://cdn.uviewui.com/uview/album/5.jpg'
		},
		{
			id: 24,
			category: 3,
			title: '数学建模竞赛找队友，会建模优先',
			date: '2026年4月22日',
			cover: 'https://cdn.uviewui.com/uview/album/6.jpg'
		},
		{
			id: 25,
			category: 3,
			title: '教师资格证备考经验，一次通关',
			date: '2026年4月21日',
			cover: 'https://cdn.uviewui.com/uview/album/1.jpg'
		},
	
		// 文学艺术 category:4
		{
			id: 26,
			category: 4,
			title: '校园诗歌朗诵大赛作品征集中',
			date: '2026年4月25日',
			cover: 'https://cdn.uviewui.com/uview/album/2.jpg'
		},
		{
			id: 27,
			category: 4,
			title: '书法社团作品展，太有气质了',
			date: '2026年4月24日',
			cover: 'https://cdn.uviewui.com/uview/album/3.jpg'
		},
		{
			id: 28,
			category: 4,
			title: '摄影爱好者集合，分享校园美景',
			date: '2026年4月23日',
			cover: 'https://cdn.uviewui.com/uview/album/4.jpg'
		},
		{
			id: 29,
			category: 4,
			title: '手绘社团招新，喜欢画画的快来',
			date: '2026年4月22日',
			cover: 'https://cdn.uviewui.com/uview/album/5.jpg'
		},
		{
			id: 30,
			category: 4,
			title: '读书分享会，每周一起交流好书',
			date: '2026年4月21日',
			cover: 'https://cdn.uviewui.com/uview/album/6.jpg'
		}
	])

	// --- 2. 分类筛选逻辑 (核心) ---
	// 使用 computed 自动根据 currentTab 的变化过滤列表
	const filteredPosts = computed(() => {
		return postList.value.filter(post => post.category === currentTab.value)
	})

	// --- 3. 初始化与事件处理 ---

	onMounted(() => {
		tabList.value = [{
				name: '校园搭子'
			},
			{
				name: '美食分享'
			},
			{
				name: '热门八卦'
			},
			{
				name: '竞赛讨论'
			},
			{
				name: '文学艺术'
			}
		]
	})

	const handleTabChange = (index) => {
		// u-tabs 的 change 事件通常返回 index 或 { index: number }
		const tabIndex = typeof index === 'object' ? index.index : Number(index)
		currentTab.value = tabIndex
	}

	const handlePostClick = (id) => {
		console.log(`点击了帖子 ID: ${id}`)
	}

	const goToCommentPage = () => {
		uni.navigateTo({
			url: '/pages/campus/commentsbmt'
		})
	}
</script>

<style lang="scss" scoped>
	.campus-container {
		background-color: #f5f5f5;
		min-height: 100vh;
		padding-bottom: 30px;
	}

	.tabs-area {
		background-color: #ffffff;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
	}

	.posts-area {
		padding: 20px 15px;
		min-height: 200rpx;
		/* 保证有一定高度 */
		display: flex;
		flex-direction: column;
		align-items: center;

		.post-card {
			background-color: #ffffff;
			border-radius: 16rpx;
			padding: 16px;
			margin-bottom: 12px;
			box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
			display: flex;
			align-items: stretch;
			gap: 12px;
			width: 100%;
			/* 确保卡片占满宽度 */
			transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

			&:active {
				transform: scale(0.98);
				box-shadow: 0 6px 16px rgba(41, 121, 255, 0.15);
			}

			.post-content {
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				min-width: 0;

				.post-title {
					font-size: 15px;
					font-weight: bold;
					color: #333333;
					line-height: 1.6;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					overflow: hidden;
					word-break: break-all;
					margin-bottom: 8px;
				}

				.post-date {
					font-size: 12px;
					color: #999999;
				}
			}

			.post-image {
				width: 160rpx;
				height: 120rpx;
				flex-shrink: 0;
				border-radius: 8rpx;
				overflow: hidden;
			}
		}

		.empty-tip {
			margin-top: 100rpx;
			color: #999;
			font-size: 14px;
			text-align: center;
		}
	}

	.editClass {
		position: fixed;
		bottom: 120rpx;
		right: 30rpx;
		background-color: #2979ff;
		/* 改为品牌色更显眼 */
		padding: 20rpx;
		width: 60rpx;
		height: 60rpx;
		border-radius: 40rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		box-shadow: 0 4px 10px rgba(41, 121, 255, 0.4);
		transition: transform 0.1s;
		z-index: 99;

		/* 点击时的缩放效果 */
		&:active {
			transform: scale(0.9);
		}
	}

	.footer-space {
		height: 50px;
	}
</style>