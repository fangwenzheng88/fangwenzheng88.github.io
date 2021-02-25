import Vue from 'vue';
import {
  Input,
  Tabs,
  TabPane,
  Tree,
  Container,
  Aside,
  Main,
  Footer,
  Loading,
  Icon,
  Backtop
} from 'element-ui';

Vue.use(Input);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Tree);
Vue.use(Container);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Footer);
Vue.use(Icon);
Vue.use(Backtop);

Vue.use(Loading.directive);

Vue.prototype.$loading = Loading.service;
