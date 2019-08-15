// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import VueResource from 'vue-resource'
import VueCookie from 'vue-cookie'
import iView from 'iview'
import componentsList from './components/global_component/index.js' //加载公共组件
import 'iview/dist/styles/iview.css';
import store from './vuex/store.js';
import iviewEn from 'iview/dist/locale/en-US';
import iviewCn from 'iview/dist/locale/zh-CN';
import VueI18n from 'vue-i18n'
import LangEn from './lang/en.js'
import LangCn from './lang/cn.js'

//import axios from './common/axios.js';

const iviewLang = localStorage.getItem("Language") && localStorage.getItem("Language") == "cn" ? iviewCn : iviewEn;

Vue.use(VueResource)
Vue.use(VueCookie)
Vue.use(VueI18n)
Vue.use(iView, { iviewLang});
Vue.use(Vuex)
Vue.use(componentsList);

//Vue.prototype.axios = axios

Vue.config.productionTip = false;

const i18n = new VueI18n({
  locale: (localStorage.getItem("Language") || "en"),
  messages: {
    'en': LangEn,
    'cn': LangCn
  }
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  template: '<App/>',
  components: { App },
  store
})
