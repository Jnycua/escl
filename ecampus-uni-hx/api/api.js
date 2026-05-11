import createRequest from './http.js'

//定义接口

//登录
export function loginRequest(data) {
  return createRequest({
    url: '/login',
    method: 'POST',
    data,
    needLogin: false // 注意，这里要为false
  })
}
//获取有效成绩
export function getScoreListRequest(data) {
	return createRequest({
		url:'/scores',
		//默认get方法可不写
		//method:'GET',
		data
		//needLogin:false //不需要登录
	})
}

//获取原始成绩
export function getRawScoreListRequest(data) {
	return createRequest({
		url:'/raw-scores',
		//默认get方法可不写
		//method:'GET',
		data
		//needLogin:false //不需要登录
	})
}

//获取课表内容
export function getCourseListRequest(data) {
	return createRequest({
		url:'/courses',
		//默认get方法可不写
		//method:'GET',
		data
		//needLogin:false //不需要登录
	})
}