<template>
  <view class="container">
    <!-- LOGO Header -->
    <view class="header">
      <u-image :src="logo" mode="aspectFit" class="logo"></u-image>
    </view>

    <!-- 登录表单 -->
    <view class="login-form">
      <u-form>
        <!-- 学号输入 -->
        <u-form-item>
          <u-input
            v-model="stuId"
            placeholder="请输入学号"
            clearable
            prefix-icon="lock"
          ></u-input>
        </u-form-item>

        <!-- 密码输入 -->
        <u-form-item>
          <u-input
            v-model="password"
            placeholder="请输入密码"
            type="password"
            clearable
            prefix-icon="lock"
          ></u-input>
        </u-form-item>

        <!-- 记住密码 -->
        <view class="checkbox-wrapper" @click="toggleRemember">
          <u-checkbox v-model="saveCount" color="cyan"></u-checkbox>
          <text class="checkbox-label">记住账号密码(仅本地存储)</text>
        </view>

        <!-- 登录按钮 -->
        <u-button class="login-btn" type="primary" @click="login" block>
          登录
        </u-button>
      </u-form>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { loginRequest } from '../../api/api.js'; // 调用封装好的接口

const logo = '/static/img/e学院.png';

const stuId = ref(uni.getStorageSync('account')?.stuId || '');
const password = ref(uni.getStorageSync('account')?.password || '');
const saveCount = ref(true);

function toggleRemember() {
  saveCount.value = !saveCount.value;
}

function login() {
  if (!stuId.value || !password.value) {
    uni.showToast({ title: '请填写学号和密码', icon: 'none' });
    return;
  }

  uni.showLoading({ title: '登录中...', mask: true });

  loginRequest({
    stuId: stuId.value,
    password: password.value
  })
    .then(res => {
      uni.hideLoading();

      if (saveCount.value) {
        uni.setStorageSync('account', { stuId: stuId.value, password: password.value });
      }

      uni.setStorageSync('token', res.cookie || '');
      uni.showToast({ title: '登录成功', icon: 'success' });

      setTimeout(() => {
        uni.redirectTo({ url: '/pages/academic/score' });
      }, 1500);
    })
    .catch(err => {
      uni.hideLoading();
      uni.showToast({ title: err?.msg || '登录失败', icon: 'none' });
    });
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #ffffff;
  height: 100vh;
  padding: 40rpx 30rpx;
}

.header {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 50rpx;

  .logo {
    width: 200rpx;
    height: 200rpx;
  }
}

.login-form {
  width: 100%;

  .checkbox-wrapper {
    display: flex;
    align-items: center;
    margin: 20rpx 0;

    .checkbox-label {
      margin-left: 10rpx;
      font-size: 28rpx;
      color: #333;
    }
  }

  .login-btn {
    margin-top: 30rpx;
  }
}
</style>