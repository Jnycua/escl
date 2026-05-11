<template>
	<view>

		<view class="container">
			<!-- 成绩类型切换 -->
			<view class="header">
				<view class="score-types">
					<view class="score-type" :class="{ active: type === 1 }" @tap="changeScoreType(1)">
						有效成绩
					</view>
					<view class="score-type" :class="{ active: type === 2 }" @tap="changeScoreType(2)">
						原始成绩
					</view>
				</view>

				<!-- 学期选择 -->
				<view class="score-term">
					<picker mode="selector" :range="list" range-key="termName" :value="termIndex" @change="changeTerm">
						选择学期 <text class="cuIcon-unfold"></text>
					</picker>
				</view>

				<!-- 刷新按钮 -->
				<view class="update-btn" @tap="update">
					<text class="cuIcon-refresh"></text>
				</view>
			</view>

			<!-- 成绩列表 -->
			<view class="score-list" v-if="list.length > 0">
				<view class="term-name">{{ list[termIndex].termName }}</view>
				<view class="list">
					<view v-for="item in list[termIndex].scoreList" :key="item.num" class="score-item">
						<view class="course-name">
							<view>{{ item.name }}</view>
							<view v-if="type === 2" class="raw-score__content">
								<view v-if="item.normalScore">平时：{{ item.normalScore }}</view>
								<view>
									<text v-if="item.midtermScore">期中：{{ item.midtermScore }}</text>
									<text v-if="item.finalScore">期末：{{ item.finalScore }}</text>
								</view>
							</view>
						</view>

						<view class="course-score" :class="getScoreClass(type === 1 ? item.score : item.complexScore)">
							{{ type === 1 ? item.score : item.complexScore }}
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue'
	import {
		getScoreListRequest,
		getRawScoreListRequest
	} from '../../api/api.js'

	const scoreCacheKey = 'scores'
	const rawScoreCacheKey = 'rawScores'

	const type = ref(1) // 1 = 有效成绩, 2 = 原始成绩
	const list = ref([]) // 成绩列表
	const termIndex = ref(0) // 当前学期索引

	// 获取缓存或请求数据
	const getList = () => {
		const cache =
			type.value === 1 ?
			uni.getStorageSync(scoreCacheKey) :
			uni.getStorageSync(rawScoreCacheKey)
		if (cache && cache.length) {
			list.value = cache
			return
		}
		update()
	}

	// 刷新数据
	const update = async () => {
		try {
			let res = []
			if (type.value === 1) {
				res = await getScoreListRequest()
			} else {
				res = await getRawScoreListRequest()
			}
			list.value = res // res 应该是数组 [{termName, scoreList}, ...]
			uni.setStorageSync(
				type.value === 1 ? scoreCacheKey : rawScoreCacheKey,
				res
			)
		} catch (err) {
			console.error('获取成绩失败', err)
			uni.showToast({
				title: '刷新失败',
				icon: 'none'
			})
		}
	}

	const getScoreClass = (score) => {
		if (score >= 90) return 'score-high' // 蓝色
		if (score >= 60) return 'score-medium' // 绿色
		return 'score-low' // 灰色
	}

	// 切换成绩类型
	const changeScoreType = (newType) => {
		type.value = newType
		termIndex.value = 0
		getList()
	}

	// 切换学期
	const changeTerm = (e) => {
		termIndex.value = e.detail.value
	}

	// 页面加载
	onMounted(() => {
		getList()
	})
</script>

<style lang="scss" scoped>
	page {
	  background: linear-gradient(0deg,
	      rgba(161, 140, 209, 0.2) 0%,
	      rgba(251, 194, 235, 0.2) 100%);
	}
	
	.container {
	  padding: 20rpx;
	}
	
	.header {
	  display: flex;
	  align-items: center;
	  justify-content: space-between;
	}
	
	.score-types {
	  width: 312rpx;
	  padding: 8rpx 10rpx;
	  display: flex;
	  justify-content: space-between;
	}
	
	.score-type {
	  width: calc((100% - 20rpx) / 2);
	  height: 70rpx;
	  border-radius: 20rpx;
	  background: rgba(173, 216, 230, 0.5); /* 淡蓝色 */
	  display: flex;
	  align-items: center;
	  justify-content: center;
	  font-size: 24rpx;
	  color: #3b3b3b;
	  transition: 0.2s;
	}
	
	.score-type.active {
	  background: #1E90FF; /* 激活淡蓝色 */
	  color: #ffffff;
	}
	
	.score-term {
	  width: 176rpx;
	  font-size: 22rpx;
	  color: #3b3b3b;
	  display: flex;
	  justify-content: center;
	  align-items: center;
	}
	
	.update-btn {
	  width: 100rpx;
	  height: 100rpx;
	  display: flex;
	  justify-content: center;
	  align-items: center;
	  font-size: 36rpx;
	  color: #1E90FF; /* 淡蓝色 */
	  transition: 0.2s;
	}
	
	.score-list {
	  width: 100%;
	  border-radius: 20rpx;
	  background: #fafafa;
	  box-shadow: 0px 0px 10px -20px rgba(0, 0, 0, 0.05);
	  margin-top: 26rpx;
	  padding: 30rpx;
	}
	
	.term-name {
	  font-size: 32rpx;
	  color: #555555;
	  text-align: center;
	}
	
	.list {
	  margin-top: 30rpx;
	}
	
	.score-item {
	  display: flex;
	  align-items: center;
	  justify-content: space-between;
	  min-height: 70rpx;
	  margin-top: 12rpx;
	  border-bottom: 1rpx solid rgba(232, 224, 235, 0.5);
	}
	
	.course-name {
	  font-size: 32rpx;
	  color: #333333;
	}
	
	.course-score {
	  font-size: 32rpx;
	}
	
	/* 分数颜色控制 */
	.course-score.score-high {
	  color: #1E90FF; /* 蓝色，大于90 */
	}
	
	.course-score.score-medium {
	  color: #00aa00; /* 绿色，60-90 */
	}
	
	.course-score.score-low {
	  color: #9c9c9c; /* 灰色，小于60 */
	}
	
	.raw-score__content {
	  font-weight: 400;
	  font-size: 24rpx;
	  color: #999999;
	}
</style>