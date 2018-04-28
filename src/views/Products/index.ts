import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import {Action, State} from 'vuex-class';
import WithRender from './products.html?style=./products.scss';
import List from '@components/List';
import {PRODUCTS_LIST} from '@store/Constants';
import SearchInput from '@components/SearchInput';
import Select from '@components/Select';

@WithRender
@Component({
  components: {List, SearchInput, vSelect: Select}
})
export default class Products extends Vue {
  @Action(PRODUCTS_LIST) queryProducts: Function;
  @State(state => state.products.columns) columns: Column[];
  @State(state => state.products.data) data;
  @State(state => state.products.total) total;

  loading = false;

  pts = [{
    text: '全部',
    value: 'ALL',
    disabled: false
  }, {
    text: '应用管理平台',
    value: '应用管理平台',
    disabled: false
  }, {
    text: '主数据管理平台',
    value: '主数据管理平台',
    disabled: false
  }, {
    text: '统一身份认证',
    value: '统一身份认证',
    disabled: false
  }, /* {
    text: '安心守护',
    value: '安心守护',
    disabled: false
  }, {
    text: '公共服务',
    value: '公共服务',
    disabled: false
  }, */ {
    text: '自助服务',
    value: '自助服务',
    disabled: false
  }];

  versions = [{
    text: '全部',
    value: -1,
    disabled: false
  }, {
    text: '基础版',
    value: 0,
    disabled: false
  }, {
    text: '标准版',
    value: 1,
    disabled: false
  }]

  states = [{
    text: '全部',
    value: 'ALL',
    disabled: false
  }, {
    text: '已启动',
    value: '已启动',
    disabled: false
  }, {
    text: '已过保',
    value: '已过保',
    disabled: false
  }, {
    text: '已终止',
    value: '已终止',
    disabled: false
  }, {
    text: '已验收',
    value: '已验收',
    disabled: false
  }, {
    text: '未启动',
    value: '未启动',
    disabled: false
  }]
  accesses = [{
    text: '全部',
    value: -1,
    disabled: false
  }, {
    text: '已接入',
    value: 1,
    disabled: false
  }, {
    text: '未接入',
    value: 0,
    disabled: false
  }]

  schoolName = '';
  productName = this.pts.find(val => !val.disabled).value;
  version = this.versions.find(val => !val.disabled).value;
  state = this.states.find(val => !val.disabled).value;
  access = this.accesses.find(val => !val.disabled).value;
  useraction = this.accesses.find(val => !val.disabled).value;
  page = 1;
  size = 10;

  created() {
    this.queryList();
  }

  pageChange(page, size) {
    this.page = page;
    this.size = size;
    this.queryList();
  }
  search(name) {
    this.page = 1;
    this.schoolName = name;
    this.queryList();
  }
  queryList() {
    this.loading = true;
    this.queryProducts({
      schoolName: this.schoolName,
      productName: this.productName,
      productState: this.state,
      accessState: this.access,
      useraction_accessState: this.useraction,
      version: this.version,
      pageNum: this.page,
      pageSize: this.size
    }).then(() => {
      this.loading = false;
    })
  }

  @Watch('productName')
  onProductNameChange(name) {
    this.query();
  }
  @Watch('version')
  onVersionChange(name) {
    this.query();
  }
  @Watch('state')
  onStateChange(state) {
    this.query();
  }
  @Watch('access')
  onAccessChange(access) {
    this.query();
  }
  @Watch('useraction')
  onUseractionChange(access) {
    this.query();
  }
  query() {
    this.page = 1;
    this.queryList();
  }

}
