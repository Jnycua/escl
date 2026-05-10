<template>
    <view class="campus-container">

        <!-- 分类标签栏 -->
        <view class="tabs-area">
            <u-tabs 
                :list="tabList"
                :current="currentTab"
                @change="handleTabChange"
                active-color="#2979ff"
                inactive-color="#999999"
                :line-color="'#2979ff'"
                :item-style="{
                    padding: '0 20rpx',
                    height: '80rpx',
                    fontSize: '14px'
                }"
            ></u-tabs>
        </view>

        <!-- 帖子列表 -->
        <view class="posts-area">
            <view 
                v-for="post in postList" 
                :key="post.id"
                class="post-card"
                @click="handlePostClick(post.id)"
            >
                <!-- 左侧文本内容 -->
                <view class="post-content">
                    <text class="post-title">{{ post.title }}</text>
                    <text class="post-date">{{ post.date }}</text>
                </view>

                <!-- 右侧缩略图 -->
                <view class="post-image">
                    <u-image
                        :src="post.cover"
                        width="160rpx"
                        height="120rpx"
                        border-radius="8rpx"
                    ></u-image>
                </view>
            </view>
        </view>

        <!-- 底部留白 -->
        <view class="footer-space"></view>
		<view class="editClass">
			<up-icon name="edit-pen" color="#fff" size="28"></up-icon>
		</view>
    </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 分类标签
const tabList = ref([]) // 初始化为空数组

const currentTab = ref(0)

// 帖子 mock 数据
const postList = ref([
    {
        id: 1,
        title: '有没有人想一起打羽毛球的',
        date: '2026年4月25日',
        cover: 'https://cdn.uviewui.com/uview/album/1.jpg'
    },
    {
        id: 2,
        title: '校园食堂新菜单发布，奶油意面真的绝',
        date: '2026年4月24日',
        cover: 'https://cdn.uviewui.com/uview/album/2.jpg'
    },
    {
        id: 3,
        title: '听说学校最近要装修宿舍，有内幕吗',
        date: '2026年4月23日',
        cover: 'https://cdn.uviewui.com/uview/album/3.jpg'
    },
    {
        id: 4,
        title: '全国大学生编程竞赛报名已开启',
        date: '2026年4月22日',
        cover: 'https://cdn.uviewui.com/uview/album/4.jpg'
    },
    {
        id: 5,
        title: '诗歌朗诵大赛参赛作品征集中',
        date: '2026年4月21日',
        cover: 'https://cdn.uviewui.com/uview/album/5.jpg'
    },
    {
        id: 6,
        title: '求室友一枚，非诚勿扰',
        date: '2026年4月20日',
        cover: 'https://cdn.uviewui.com/uview/album/6.jpg'
    }
])

// 在组件挂载后初始化 tabList
onMounted(() => {
    tabList.value = [
        { name: '校园搭子' },
        { name: '美食分享' },
        { name: '热门八卦' },
        { name: '竞赛讨论' },
        { name: '文学艺术' }
    ]
})

// 点击分类处理
/* const handleTabChange = (index) => {
	const tabIndex = typeof index === 'object' ? index.index : Number(index)
    currentTab.value = tabIndex
    console.log(`切换到: ${tabList.value[index].name}`)
	
	// 安全访问 tabList
	    if (tabList.value && tabList.value[tabIndex]) {
	        console.log(`切换到: ${tabList.value[tabIndex].name}`)
	    } else {
	        console.log(`切换到索引: ${tabIndex}`)
	    }
} */

const handleTabChange = (index) => {
  console.log('handleTabChange 被调用，参数 index 为：', index);
  
  // 1. 安全地解析索引
  let tabIndex;
  if (typeof index === 'object' && index !== null) {
    // 处理 u-tabs 可能传回对象的情况
    tabIndex = index.index !== undefined ? Number(index.index) : 0;
  } else {
    // 处理直接传回数字的情况
    tabIndex = Number(index) || 0;
  }
  
  console.log('解析后的 tabIndex 为：', tabIndex);
  
  // 2. 安全地获取标签名
  let tabName = '未知标签';
  if (tabList.value && 
      Array.isArray(tabList.value) && 
      tabList.value[tabIndex] && 
      tabList.value[tabIndex].name) {
    tabName = tabList.value[tabIndex].name;
  } else {
    console.warn(`无法获取索引 ${tabIndex} 对应的标签名，tabList 状态：`, tabList.value);
  }
  
  // 3. 更新当前选中的标签
  currentTab.value = tabIndex;
  
  // 4. 打印成功日志
  console.log(`✅ 成功切换到: 【${tabName}】, 索引: ${tabIndex}`);
}

// 点击帖子处理
const handlePostClick = (id) => {
    console.log(`点击了帖子 ID: ${id}`)
}
</script>

<style lang="scss" scoped>
.campus-container {
    background-color: #f5f5f5;
    min-height: 100vh;
    padding-bottom: 30px;
}


// 分类标签栏
.tabs-area {
    background-color: #ffffff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
    padding-top: 0;
}

// 帖子列表区域
.posts-area {
    padding: 20px 15px;

    .post-card {
        background-color: #ffffff;
        border-radius: 16rpx;
        padding: 16px;
        margin-bottom: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        display: flex;
        align-items: stretch;
        gap: 12px;
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
}

.editClass {
		position: fixed;
		bottom: 120rpx;
		right: 30rpx;
		background-color: rgba(0,0,0,0.5);
		padding: 20rpx;
		width: 44rpx;
		height: 44rpx;
		border-radius: 40rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

// 底部留白
.footer-space {
    height: 50px;
}
</style>