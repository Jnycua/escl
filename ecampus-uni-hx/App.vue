<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/* 注意要写在第一行，注意不能引入至uni.scss，同时给style标签加入lang="scss"属性 */
	@import "@/uni_modules/uview-plus/index.scss";
	
	@import "colorui/main.css";
	@import "colorui/icon.css";
	@import "colorui/animation.css"; 
	
	/* 设置主题色 */
	page {
	  --theme: #6a11cb; /* 紫色主题 */
	  --backgroundColor: #f8f9fa;
	  background-color: var(--backgroundColor);
	}
</style>