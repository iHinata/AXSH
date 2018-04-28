import {APPS_HIGH_SCORE, APPS_HIGH_SCORE_COMMET, APPS_HIGH_PVUV} from '@store/Constants';
import axios from '@utils/axios';
import dataFormat from '@utils/dataFormat';

const state = {
  app: null,
  commets: [],
  pvuv: {}
};

const mutations = {
  [APPS_HIGH_SCORE](state, payload) {
    state.app = dataFormat(payload)[0] || {};
  },
  [APPS_HIGH_PVUV](state, payload) {
    state.pvuv = dataFormat(payload)[0] || {};
  },
  [APPS_HIGH_SCORE_COMMET](state, payload) {
    state.commets = dataFormat(payload);
  }
};

const actions = {
  async [APPS_HIGH_SCORE]({commit}, rn = -1) {
    const {data, status} = await axios.post('/call/queryHighScoreAssess', {rn});
    if (status === 200) {
      commit(APPS_HIGH_SCORE, data);
    }
  },
  async [APPS_HIGH_PVUV]({commit}, appid = -1) {
    const {data, status} = await axios.post('/call/appTotalPVUV', {appid});
    if (status === 200) {
      commit(APPS_HIGH_PVUV, data);
    }
  },
  async [APPS_HIGH_SCORE_COMMET]({commit}, appId = -1) {
    const {data, status} = await axios.post('/call/queryAssessList', {appId});
    if (status === 200) {
      commit(APPS_HIGH_SCORE_COMMET, data);
    }
  }
}

export default {
  state,
  mutations,
  actions
}
