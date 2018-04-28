import axios from '@utils/axios';
import {RUNNING_QUERY} from '@store/Constants';
import dataFormat from '@utils/dataFormat';
const state = {
  startTime: '',
  userCount: 0,
  axUserCount: 0,
  userCountThisWeekend: 0,
  appCount: 0,
  appCountThisWeek: 0,
  hostCount: 0,
  hostCountThisWeek: 0,
  dbCount: 0,
  dbCountThisWeek: 0
};
const mutations = {
  [RUNNING_QUERY](state, {runStatusOverview = {}, maintainObject = {}, getRunStatusOverviewTotalCount = {}} = {}) {
    const rso = dataFormat(runStatusOverview)[0] || {};
    const mo = dataFormat(maintainObject)[0] || {};
    const grsotc = dataFormat(getRunStatusOverviewTotalCount)[0] || {};
    state.startTime = rso.startTime;
    state.userCount = rso.userCount || 0;
    state.axUserCount = grsotc.total_count || 0;
    state.userCountThisWeekend = rso.userCountThisWeekend || 0;
    state.hostCount = mo.hostCount || 0;
    state.hostCountThisWeek = mo.hostCountThisWeek || 0;
    state.appCount = mo.appCount || 0;
    state.appCountThisWeek = mo.appCountThisWeek || 0;
    state.dbCount = mo.dbCount || 0;
    state.dbCountThisWeek = mo.dbCountThisWeek || 0;
  }
};
const actions = {
  async [RUNNING_QUERY]({commit}, payload) {
    const {data, status} = await axios.post('/axshProductMaintain/getBigScreenInfo', {});
    if (status === 200) {
      commit(RUNNING_QUERY, data);
    }
  }
};

export default {
  state,
  mutations,
  actions
}
