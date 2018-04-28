import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import WithRender from './index.html?style=./index.scss';
import create from 'src/utils/websocket';

import ViewGallery from '@assets/images/ViewGallery.png';
import electronics from '@assets/images/electronics.png';

@WithRender
@Component
export default class Index extends Vue {
  user = '';
  active = 0;
  menus = [{
    name: 'list',
    text: '产品列表',
    img: ViewGallery
  }, {
    name: 'map',
    text: '总部大屏',
    img: electronics
  }];
  get title() {
    if (this.menus[this.active]) {
      return this.menus[this.active].text;
    }
    return '';
  }
  created () {
    const current = this.$route.name;
    const index = this.menus.findIndex(val => val.name === current);
    this.active = index;
    this.user = sessionStorage.getItem('user') || 'admin';
  }
}
