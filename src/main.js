import Vue from 'vue';
import ElementUI from 'element-ui';
import axios from 'axios'
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';
import echarts from 'echarts';
import 'echarts/extension/bmap/bmap'

Vue.use(ElementUI);
Vue.prototype.$axios = axios;
Vue.prototype.$echarts = echarts;

new Vue({
  el: '#app',
  render: h => h(App)
});