import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import WithRender from './loop.html?style=./loop.scss';
import Home from '../Home';
import Apps from '../Apps';
import Data from '../Data';
import Platform from '../Platform';
import Running from '../Running';
import Navi from '@components/Navi';
import Header from '@components/Header';

@WithRender
@Component({
  components: {Home, Apps, vData: Data, Platform, Running, Navi, vHeader: Header}
})
export default class Loop extends Vue {
  showHeader = false;
  index = 0;
  titles = ['', '平台产品概况', '产品运维概况', '数据建设分析', '运用建设&使用分析']
  get title() {
    return this.titles[this.index];
  }
  created () {
    setInterval(() => {
      this.index = (this.index + 1) % 5;
      console.log(this.index)
      if (this.index === 0) {
        this.showHeader = false;
      } else {
        this.showHeader = true;
      }
    }, 5000);
  }
}
