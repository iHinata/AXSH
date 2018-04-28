import Vue from 'vue';
import './hook';
import router from './router';
import './index.scss';
import store from './store';

// 为了简单明了删除了对IE的支持
(function() {

	// 该事件是核心
	window.addEventListener('storage', function(event) {
		if (event.key === 'getSessionStorage') {
			// 已存在的标签页会收到这个事件
			localStorage.setItem('sessionStorage', JSON.stringify(sessionStorage));
			localStorage.removeItem('sessionStorage');

		} else if (event.key === 'sessionStorage' && !sessionStorage.length) {
			// 新开启的标签页会收到这个事件
			var data = JSON.parse(event.newValue),
					value;

			for (let key in data) {
				sessionStorage.setItem(key, data[key]);
			}
		}
	});

  if (!sessionStorage.length) {
		// 这个调用能触发目标事件，从而达到共享数据的目的
		localStorage.setItem('getSessionStorage', Date.now().toString());
	};
})();

export default new Vue({
  el: '#root',
  router,
  store,
  render: h => h('router-view')
});
