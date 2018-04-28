import axios from '@utils/axios';
import {LOGIN} from '@store/Constants';

const state = {
  msg: '',
  show: false
}

let timer = null;

const mutations = {
  [LOGIN](state, {returnStatus = '0', errorMsg = '错误'} = {}) {
    if (returnStatus === '0') {
      state.msg = errorMsg || '登录失败';
      state.show = true;
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        state.show = false;
      }, 3000);
    } else {
      state.msg = '';
      state.show = false;
    }
  }
}

const actions = {
  async [LOGIN]({commit}, {userName = '', pwd = ''} = {}) {
    const {data, status} = await axios.post('/login', {userName, pwd});
    if (status === 200) {
      commit(LOGIN, data);
    }
    return data;
  }
}
export default {
  state,
  mutations,
  actions
};
