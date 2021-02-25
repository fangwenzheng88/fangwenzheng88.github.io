import Vue from 'vue';
import App from './App.vue';
import router from './router';
// import store from './store';
import './tools/element';
import 'highlight.js/styles/github.css';
import 'github-markdown-css/github-markdown.css';
Vue.config.productionTip = false;
new Vue({
  router,
  // store,
  render: (h) => h(App)
}).$mount('#app');
