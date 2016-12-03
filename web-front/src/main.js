import Vue from 'vue';
import App from './App';
require('hchs-vue-charts');

/* eslint-disable no-undef */
Vue.use(VueCharts);

/* eslint-disable no-new */
new Vue({
	el: '#app',
	template: '<App/>',
	components: { App }
});
