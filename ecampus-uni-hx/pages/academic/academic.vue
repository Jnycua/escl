<template>
  <view class="academic-container">

    <!-- 功能入口区 -->
    <view class="function-area">
      <u-row gutter="16">
        <u-col span="6">
          <view class="function-card" @click="handleGradeQuery">
            <u-icon name="info-circle" size="40" color="#2979ff"></u-icon>
            <text class="card-title">成绩查询</text>
          </view>
        </u-col>
        <u-col span="6">
          <view class="function-card" @click="handleExamReminder">
            <u-icon name="bell" size="40" color="#2979ff"></u-icon>
            <text class="card-title">考试提醒</text>
          </view>
        </u-col>
      </u-row>
    </view>

    <!-- 课表展示区 -->
    <view class="schedule-area">
      <uni-card :is-full="true">
        <template #head>
          <view class="card-header">
            <text class="card-header-title">课表展示</text>
          </view>
        </template>
        <view class="schedule-content">
          <view class="schedule-grid">
            <view class="day-column" v-for="(day, index) in weekDays" :key="index">
              <text class="day-name">{{ day }}</text>
              <view class="course-slot" :class="{'has-course': index === 0 || index === 2}">
                <text class="slot-text">
                  {{ index === 0 ? '高等数学' : index === 2 ? '数据结构' : '暂无' }}
                </text>
              </view>
            </view>
          </view>
        </view>
      </uni-card>
    </view>

    <!-- 底部留白 -->
    <view class="footer-space"></view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

// 定义响应式数据
const weekDays = ref(['周一', '周二', '周三', '周四', '周五'])

// 方法
const handleGradeQuery = () => {
  console.log('点击了成绩查询')
  // 可以跳转到成绩查询页面
  // uni.navigateTo({ url: '/pages/grade/grade' })
}

const handleExamReminder = () => {
  console.log('点击了考试提醒')
  // 可以跳转到考试提醒页面
  // uni.navigateTo({ url: '/pages/exam/exam' })
}
</script>

<style lang="scss" scoped>
.academic-container {
  background-color: #f5f5f5;
  min-height: 100vh;
  padding-bottom: 30px;
}

// 功能入口区
.function-area {
  padding: 20px 15px;
  
  .function-card {
    background-color: #ffffff;
    border-radius: 14px;
    //padding: 24px 16px;
	padding: 16px 16px;
    text-align: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    &:active {
      transform: translateY(-6px);
      box-shadow: 0 6px 16px rgba(41, 121, 255, 0.2);
      background: linear-gradient(135deg, #f8fbff 0%, #ffffff 100%);
    }

    .card-title {
      font-size: 15px;
      color: #333333;
      margin-top: 8px; /* 原来为 12px */
      font-weight: 600;
    }
  }
}

// 课表展示区
.schedule-area {
  padding: 0 15px;

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 12px;
    border-bottom: 1px solid #f0f0f0;
  }

  .card-header-title {
    font-size: 16px;
    font-weight: 700;
    color: #2979ff;
  }

  .schedule-content {
    min-height: 220px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fafafa;
    border-radius: 8px;
    padding: 20px;

    .schedule-grid {
      display: flex;
      justify-content: space-around;
      width: 100%;
      gap: 8px;

      .day-column {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;

        .day-name {
          font-size: 12px;
          color: #666666;
          font-weight: 600;
        }

        .course-slot {
          width: 100%;
          min-height: 60px;
          background-color: #f8f9fa;
          border-radius: 8px;
          border: 1px solid #e9ecef;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px;
          
          &.has-course {
            background-color: #2979ff;
            border-color: #2979ff;
            
            .slot-text {
              color: #ffffff;
              font-weight: 600;
            }
          }

          .slot-text {
            font-size: 12px;
            color: #6c757d;
            text-align: center;
            line-height: 1.4;
          }
        }
      }
    }
  }
}

// 底部留白
.footer-space {
  height: 50px;
}
</style>