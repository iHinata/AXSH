import {PRODUCTS_LIST, PRODUCTS_ACCESS} from '@store/Constants';
import axios from '@utils/axios';
import dataFormat from '@utils/dataFormat';

const state = {
  columns: [{
    dataIndex: 'ywx',
    name: '产品线',
    width: '10%'
  }, {
    dataIndex: 'khmc',
    name: '学校名称',
    width: '12%'
  }, {
    dataIndex: 'qdsj',
    name: '最新签署时间',
    width: '8%'
  }, {
    dataIndex: 'numcontract',
    name: '合同数',
    width: '5%'
  }, {
    dataIndex: 'version',
    name: '当前版本',
    width: '8%'
  }, {
    dataIndex: 'latest_version',
    name: '最新版本',
    width: '8%'
  }, {
    dataIndex: 'ztzt',
    name: '项目状态',
    width: '23%'
  }, {
    dataIndex: 'data_access',
    name: '接入状态',
    render: function(val, row) {
      let state = '';
      if (row.ywx === '应用管理平台') {
        if (row.useraction_access > 0) {
          state += '<div class="products--in">用户行为</div>'
        } else {
          state += '<div class="products--out">用户行为</div>'
        }
      }
      if (val > 0) {
        state += '<div class="products--in">运行数据</div>'
      } else {
        state += '<div class="products--out">运行数据</div>'
      }
      return state;
    }
  }, {
    dataIndex: 'school_code',
    name: '操作',
    width: '6%',
    align: 'center',
    render: function(val, row) {
      return `<a href="screenlist/${val}/${row.access_token}" class="button">查看</a>`
    }
  }],
  data: [],
  total: 0
};

const mutations = {
  [PRODUCTS_LIST](state, payload) {
    state.data = dataFormat(payload);
    if (payload && payload.pageInfo) {
      state.total = payload.pageInfo.total;
    }
  }
}

const actions = {
  async [PRODUCTS_LIST]({commit}, {
    schoolName='', productName='主数据管理平台', productState='已启动', accessState=-1,
    pageNum=1, pageSize=10, useraction_accessState=-1, version = ''} = {}) {
    const param = {
      schoolName: `%${schoolName}%`,
      productName,
      productState,
      accessState,
      useraction_accessState,
      pageNum,
      version: productName=== '应用管理平台' ? version : -1,
      pageSize
    }
    const {data, status} = await axios.post('/call/mgtContract', param);
    if (status === 200) {
      commit(PRODUCTS_LIST, data);
    }
  }
}

export default {
  state,
  mutations,
  actions
}
