import axios from 'axios'
import router from '../router'
import auth from "../authenticator";
import iView from 'iview'

axios.defaults.timeout = 300000;
axios.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';

axios.interceptors.request.use(
  config => {
    var token = auth.getUserToken();
    if (token && !config.headers.UserToken) {
      config.headers.UserToken = token;
    }
    if (config.method === 'post' && config.data) {
      config.data = JSON.stringify(config.data);
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  });



axios.interceptors.response.use(
  response => {
    if (response && response.data && response.data.RetCode == 1401) {
      iView.Message.error({ content: "登录已过期!请重新登录!", duration: 5 });
      router.replace({ name: 'login', query: { ReturnUrl: router.currentRoute.fullPath } });
    }
    return response;
  },
  error => {

    if (axios.isCancel(error)) {
      return new Promise(() => { });
    }
    else if (error.code == "ECONNABORTED") {
      iView.Message.error({ content: "网络超时! 请检查网络!", duration: 5 });
      return Promise.reject(error);
    }
    else {
      if (error.response) {
        switch (error.response.status) {
          case 401:
            {
              iView.Message.error({ content: "登录已过期!请重新登录!", duration: 5 });
              router.replace({ name: 'login', query: { ReturnUrl: router.currentRoute.fullPath } });
            }
        }
      }
      return Promise.reject(error);
    }

  });
export default axios;
