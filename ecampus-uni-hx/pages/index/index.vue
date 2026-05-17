<template>
	<view class="content">
		<up-search placeholder="搜索校园资讯、社团活动" bg-color="#e3e3e3" v-model="keyword"></up-search>
		<up-swiper v-if="list1.length" :list="list1" keyName="image" showTitle radius="8" :autoplay="true"
			height="160"></up-swiper>
		<up-notice-bar text="校园平台持续优化中，欢迎师生体验使用"></up-notice-bar>
		<view class="menu-area" >
			<u-row gutter="16">
				<u-col span="3">
					<view class="menu-item" @click="handleClick1('成绩查询')">
						<u-icon name="order" size="30" color="#2979ff"></u-icon>
						<text class="menu-text">成绩查询</text>
					</view>
				</u-col>
				<u-col span="3">
					<view class="menu-item" @click="handleClick2('二手平台')">
						<u-icon name="bag" size="30" color="#2979ff"></u-icon>
						<text class="menu-text">二手平台</text>
					</view>
				</u-col>
				<u-col span="3">
					<view class="menu-item" @click="handleClick3('跑腿送物')">
						<u-icon name="car" size="30" color="#2979ff"></u-icon>
						<text class="menu-text">跑腿服务</text>
					</view>
				</u-col>
				<u-col span="3">
					<view class="menu-item" @click="handleClick4('失物招领')">
						<u-icon name="search" size="30" color="#2979ff"></u-icon>
						<text class="menu-text">失物招领</text>
					</view>
				</u-col>
			</u-row>
		</view>

		<view class="list">
			<view class="news">
				校园资讯
			</view>
			<up-waterfall v-model="flowList" ref="uWaterfallRef">
				<template v-slot:left="{leftList}">
					<view class="demo-water" v-for="(item,index) in leftList" :key="index" @click="goDetail(item)">
						<up-lazy-load threshold="-450" border-radius="10" :image="item.img"
							:index="index"></up-lazy-load>
						<view class="demo-title">
							{{ item.title }}
						</view>
						<view class="demo-price">
							浏览量：{{ item.times }}
						</view>
						<view class="demo-tag">
							<view class="demo-tag-owner">
								{{ item.tag[0] }}
							</view>
							<view class="demo-tag-text">
								{{ item.tag[1] }}
							</view>
						</view>
						<view class="isDot" v-if="item.isDot">
							{{ item.isDot }}
						</view>
					</view>
				</template>
				<template v-slot:right="{rightList}">
					<view class="demo-water" v-for="(item,index) in rightList" :key="index" @click="goDetail(item)">
						<up-lazy-load threshold="-450" border-radius="10" :image="item.img"
							:index="index"></up-lazy-load>
						<view class="demo-title">
							{{ item.title }}
						</view>
						<view class="demo-price">
							浏览量：{{ item.times }}
						</view>
						<view class="demo-tag">
							<view class="demo-tag-owner">
								{{ item.tag[0] }}
							</view>
							<view class="demo-tag-text">
								{{ item.tag[1] }}
							</view>
						</view>
						<view class="isDot" v-if="item.isDot">
							{{ item.isDot }}
						</view>
					</view>
				</template>
			</up-waterfall>
		</view>
		<view v-if="showTopBtn" @click="Totop" class="topClass">
			<up-icon name="arrow-upward" color="#fff" size="28"></up-icon>
		</view>
	</view>
</template>

<script setup>
	import {
		onLoad,
		onReachBottom,
		onPageScroll
	} from '@dcloudio/uni-app'
	import {
		ref,
		reactive,
		onMounted,
	} from 'vue';
	
	const handleClick1 = (name) => {
	    console.log(`点击了${name}`)
		uni.navigateTo({ url: '/pages/academic/score' })
	}
	const handleClick2 = (name) => {
	    console.log(`点击了${name}`)
		uni.navigateTo({ url: '/pages/life/market' })
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
		uni.navigateTo({ url: '/pages/life/lost' })
	}
	

	// 响应式数据  
	const keyword = ref('');

	// 校园轮播图数据
	const list1 = reactive([
		{
			image: '/static/img/school1.png',
			title: '春季校园运动会火热报名中',
		},
		{
			image: '/static/img/school2.png',
			title: '图书馆自习室开放时间调整通知',
		},
		{
			image: '/static/img/school3.png',
			title: '校级创新创业大赛正式启动',
		},
	]);

	//瀑布流校园资讯数据
	const flowList = ref([]);
	const leftList = ref([
		{
			img: '/static/img/school1.png',
			title: '文学院开展经典诵读主题团日活动',
			times: '1286',
			tag: ['文学院', '校园活动']
		},
		{
			img: '/static/img/school2.png',
			title: '计算机学院举办前端技术分享讲座',
			times: '2563',
			tag: ['计科院', '学习干货'],
			isDot: '精选'
		},
		{
			img: '/static/img/school3.png',
			title: '校园志愿者服务队招新公告发布',
			times: '968',
			tag: ['校团委', '志愿活动']
		},
		{
			img: '/static/img/school1.png',
			title: '2026年春季普通话考试报名通知',
			times: '3652',
			tag: ['教务处', '考试通知']
		},
		{
			img: '/static/img/school2.png',
			title: '宿舍文明卫生评比活动圆满结束',
			times: '1520',
			tag: ['宿管中心', '校园日常']
		},
	]);
	const rightList = ref([
		{
			img: '/static/img/school3.png',
			title: '学生会文艺部校园歌手大赛筹备进行中',
			times: '2135',
			tag: ['校学生会', '文娱赛事']
		},
		{
			img: '/static/img/school1.png',
			title: '心理健康中心开设免费心理咨询服务',
			times: '1862',
			tag: ['心理中心', '暖心推送'],
			isDot: '推荐'
		},
		{
			img: '/static/img/school2.png',
			title: '校外兼职防诈骗安全知识宣讲',
			times: '4521',
			tag: ['保卫处', '安全科普']
		},
		{
			img: '/static/img/school3.png',
			title: '毕业季校园跳蚤市场活动预告',
			times: '3256',
			tag: ['生活服务', '热门活动']
		},
		{
			img: '/static/img/school1.png',
			title: '专升本备考经验分享交流会顺利举办',
			times: '2890',
			tag: ['升学备考', '经验分享']
		},
		{
			img: '/static/img/school2.png',
			title: '食堂新增特色菜品，满足师生多样口味',
			times: '5632',
			tag: ['校园食堂', '校园生活']
		},
		{
			img: '/static/img/school3.png',
			title: '羽毛球校园友谊赛报名通道开启',
			times: '1689',
			tag: ['体育部', '体育赛事']
		},
		{
			img: '/static/img/school1.png',
			title: '班级团建户外素质拓展活动推荐方案',
			times: '1357',
			tag: ['班级活动', '团建参考'],
			isDot: '新品'
		},
		{
			img: '/static/img/school2.png',
			title: '校园快递驿站取件时间调整说明',
			times: '6892',
			tag: ['后勤服务', '便民通知']
		},
		{
			img: '/static/img/school3.png',
			title: '考研上岸学长学姐备考心得合集',
			times: '7563',
			tag: ['考研干货', '学霸经验']
		}
	]);
	//滚动是否显示
	const showTopBtn = ref(0);

	// 在组件挂载后，将leftList赋值给flowList
	onMounted(() => {
		flowList.value = [...leftList.value, ...rightList.value];
	});
	onReachBottom(() => {
		console.log('触底')
		// 模拟触底后数据的加载
		setTimeout(() => {
			addRandomData()
		}, 1000)
	})
	//滚动监听
	onPageScroll((e) => {
		if (e.scrollTop > 600) {
			showTopBtn.value = 1
		} else {
			showTopBtn.value = 0
		}
	})
	const Totop = () => {
		uni.pageScrollTo({
			scrollTop: 0,
			duration: 300
		})
	}

	const goDetail = (item) => {
		const can = JSON.stringify(item)
		uni.navigateTo({
			url: `/pages/detail/detail?item=${encodeURIComponent(can)}`
		})
	}

	// 模拟后端返回的数据
	const addRandomData = () => {
		for (let i = 0; i < 10; i++) {
			let index = uni.$u.random(0, flowList.value.length - 1)
			let item = JSON.parse(JSON.stringify(flowList.value[index]))
			item.id = uni.$u.guid()
			flowList.value.push(item)
		}
	}
</script>

<style>
	page {
		background-color: rgb(240, 240, 240);
	}
</style>

<style lang="scss" scoped>
	.content {
		padding: 20rpx 20rpx;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}
	
	.menu-area {
	    padding: 10px 10px;
		margin-top: 5px;
	
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
	            font-size: 10px;
	            color: #333333;
	            margin-top: 3px;
	            font-weight: 600;
	        }
	    }
	}
	

	.list {
		margin: 15rpx 0;
		
		.news {
		    font-size: 25px;
		    color: #333333;
		    margin-top: 3px;
		    font-weight: 600;
		}

		.demo-water {
			margin: 10rpx 10rpx 10rpx 0;
			background-color: #fff;
			border-radius: 16rpx;
			padding: 16rpx;
			position: relative;
		}

		.demo-title {
			font-size: 30rpx;
			margin-top: 10rpx;
			color: #303133;
		}

		.demo-price {
			font-size: 24rpx;
			color: #777;
			margin-top: 10rpx;
		}

		.demo-tag {
			display: flex;
			margin-top: 10rpx;

			.demo-tag-owner {
				border: 1px solid rgb(252, 163, 129);
				color: #ffaa00;
				font-size: 20rpx;
				display: flex;
				align-items: center;
				padding: 4rpx 14rpx;
				border-radius: 50rpx;
			}

			.demo-tag-text {
				border: 1px solid #00aaff;
				color: #ffaa00;
				margin-left: 20rpx;
				font-size: 20rpx;
				display: flex;
				align-items: center;
				padding: 4rpx 14rpx;
				border-radius: 50rpx;
			}
		}

		.isDot {
			position: absolute;
			top: 20rpx;
			right: 20rpx;
			font-size: 24rpx;
			color: #fff;
			line-height: 32rpx;
			background-color: #ff0000;
			text-align: center;
			border-radius: 10rpx;
			padding: 4rpx 10rpx;
		}
	}

	.topClass {
		position: fixed;
		bottom: 120rpx;
		right: 30rpx;
		background-color: rgba(0, 0, 0, 0.5);
		padding: 20rpx;
		width: 44rpx;
		height: 44rpx;
		border-radius: 40rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>