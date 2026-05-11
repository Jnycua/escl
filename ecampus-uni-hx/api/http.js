// let baseUrl = 'http://127.0.0.1:3000'

// 创建请求

// export default function http(url, data = {}, method = 'GET') {

// 	//对外支持链式调用
// 	return new Promise((resolve, reject) => {
// 		uni.request({
// 			url:baseUrl + url,
// 			data,
// 			method,
// 			header:{
// 				'token':uni.getStorageSync('token')||''
// 			},
// 			success: res => {
// 				//http的状态码
// 				if(res.statusCode == 200) {
// 					if(res.data.code == 0) {
// 						resolve(res.data.data)
// 					}else if(res.data.code == 1){
// 						uni.showToast({
// 							title:res.data.msg,
// 							icon:'none'
// 						})
// 						reject(res.data.msg)
// 					}
// 				}
// 			},
// 			fail: () => {
// 				uni.showToast({
// 					title:'服务器请求异常',
// 					icon:'none'
// 				})
// 			}
// 		})
// 	})
// }

export default function createRequest(options) {
	// 返回一个Promise对象
	return new Promise((resolve, reject) => {
		const token = uni.getStorageSync('token')
		// 未登录状态，跳转到登录页面
		if (options.needLogin !== false && !token) {
			uni.showToast({
				title: '请先登录',
				icon: 'none'
			})
			setTimeout(() => {
				uni.redirectTo({
					url: '/pages/academic/login', //后改为若未登录则跳转至导入课表页面
				})
			}, 1000);
			reject(new Error('未登录')) // 拒绝Promise，让调用方知道因未登录失败
			return
		}
		// 构建请求url
		// 这里暂时配置本地环境域名
		// 等我们把环境配置讲了，再进一步优化
		const baseUrl = "http://localhost:3000"
		const url = `${baseUrl}${options.url}`

		// 构建请求header，把token放到header
		const header = {
			token: token || ''
		}

		// 设置showLoading
		// 因为showLoading要配合hideLoading使用，因此需要记录这个变量
		let showLoading = false
		if (options.loading !== false) {
			showLoading = true
			uni.showLoading({
				title: '正在加载',
				mask: true
			})
		}

		// 发送请求
		uni.request({
			url,
			method: options.method || 'GET',
			timeout: options.timeout || 20000,
			header,
			data: options.data || {},
			success: (res) => { // 在这里统一处理响应
				// 首先检查HTTP状态码
				if (res.statusCode === 200) {
					// 再检查业务状态码 (根据您的后端约定，此处以res.data.code为例)
					switch (res.data.code) {
						case 0: // 成功
							resolve(res.data.data) // 返回数据部分
							break
						case 403: // 登录失效
							uni.showToast({
								title: '登录已失效，请重新登录',
								icon: 'none'
							})
							uni.removeStorageSync('token') // 清除过期token
							setTimeout(() => {
								uni.redirectTo({
									url: '/pages/login/index'
								})
							}, 1000)
							reject(res.data)
							break
						case -1: // 其他业务错误
						default:
							uni.showToast({
								title: res.data.msg || '请求失败',
								icon: 'none'
							})
							reject(res.data)
					}
				} else {
					// HTTP错误
					uni.showToast({
						title: `请求失败(${res.statusCode})`,
						icon: 'none'
					})
					reject(new Error(`HTTP ${res.statusCode}`))
				}
			},
			fail: (err) => {
				uni.showToast({
					title: '网络请求失败，请检查网络',
					icon: 'none'
				})
				reject(err)
			},
			complete: () => {
				if (showLoading) uni.hideLoading()
			}
		})
	})
}