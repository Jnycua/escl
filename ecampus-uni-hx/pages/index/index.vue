<template>
	<view class="content">
		<up-search placeholder="搜索内容" bg-color="#e3e3e3" v-model="keyword"></up-search>
		<up-swiper v-if="list1.length" :list="list1" keyName="image" showTitle radius="8" :autoplay="true"
			height="160"></up-swiper>
		<up-notice-bar text="小程序内容正在开发中"></up-notice-bar>
		<view class="menu-area" >
			<u-row gutter="16">
				<u-col span="3">
					<view class="menu-item" @click="handleClick1('课表查询')">
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
							{{ item.times }}
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
							{{ item.times }}
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
	

	// 响应式数据  
	const keyword = ref('');

	// 使用 reactive 创建响应式数组  
	const list1 = reactive([{
			image: '/static/img/uno.png',
			title: '图片内容正在加载中1......',
		},
		{
			image: '/static/img/uno.png',
			title: '图片内容正在加载中2......',
		},
		{
			image: '/static/img/uno.png',
			title: '图片内容正在加载中3......',
		},
	]);

	//waterfall
	const flowList = ref([]);
	const leftList = ref([{
			img: '/static/img/uno.png',
			title: '北国风光，千里冰封，万里雪飘',
			times: '35次',
			tag: ['李白旗舰店', '热门']
		},
		{
			img: '/static/img/uno.png',
			title: '望长城内外，惟余莽莽',
			times: '75次',
			tag: ['杜甫旗舰店', '推荐'],
			isDot: '推荐'
		},
		{
			img: '/static/img/uno.png',
			title: '大河上下，顿失滔滔',
			times: '385次',
			tag: ['白居易旗舰店', '热门']
		},
		{
			img: '/static/img/uno.png',
			title: '欲与天公试比高',
			times: '784次',
			tag: ['李易旗舰店', '最新']
		},
		{
			img: '/static/img/uno.png',
			title: '须晴日，看红装素裹，分外妖娆',
			times: '7891次',
			tag: ['甫白旗舰店', '热门']
		},
	]);
	const rightList = ref([{
			img: '/static/img/uno.png',
			title: '明月几时有，把酒问青天',
			times: '42次',
			tag: ['苏轼旗舰店', '热卖']
		},
		{
			img: '/static/img/uno.png',
			title: '床前明月光，疑是地上霜',
			times: '68次',
			tag: ['李白诗社', '新品'],
			isDot: '新品'
		},
		{
			img: '/static/img/uno.png',
			title: '春眠不觉晓，处处闻啼鸟',
			times: '299次',
			tag: ['孟浩然专卖', '热门']
		},
		{
			img: '/static/img/uno.png',
			title: '红豆生南国，春来发几枝',
			times: '520次',
			tag: ['王维精品店', '浪漫']
		},
		{
			img: '/static/img/uno.png',
			title: '两个黄鹂鸣翠柳，一行白鹭上青天',
			times: '168次',
			tag: ['杜甫草堂', '热门']
		},
		{
			img: '/static/img/uno.png',
			title: '举头望明月，低头思故乡',
			times: '365次',
			tag: ['李白思乡', '经典']
		},
		{
			img: '/static/img/uno.png',
			title: '野火烧不尽，春风吹又生',
			times: '666次',
			tag: ['白居易诗铺', '热销']
		},
		{
			img: '/static/img/uno.png',
			title: '桃花潭水深千尺，不及汪伦送我情',
			times: '999次',
			tag: ['李白友情', '推荐'],
			isDot: '推荐'
		},
		{
			img: '/static/img/uno.png',
			title: '海内存知己，天涯若比邻',
			times: '1314次',
			tag: ['王勃知己', '热门']
		},
		{
			img: '/static/img/uno.png',
			title: '问君能有几多愁，恰似一江春水向东流',
			times: '888次',
			tag: ['李煜愁思', '文艺']
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