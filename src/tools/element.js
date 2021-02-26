import Vue from 'vue';
import { Input, Tabs, TabPane, Tree, Loading, Icon, Backtop } from 'element-ui';

Vue.use(Input);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Tree);
Vue.use(Icon);
Vue.use(Backtop);

Vue.use(Loading.directive);

Vue.prototype.$loading = Loading.service;
