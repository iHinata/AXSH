import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import WithRender from './timedisplay.html?style=./timedisplay.scss';

@WithRender
@Component
export default class TimeDisplay extends Vue {
  now = new Date()
  days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  created () {
    setInterval(() => {
      this.now = new Date();
    }, 10000);
  }
  get date() {
    const y = this.now.getFullYear();
    const m = this.now.getMonth() + 1;
    const d = this.now.getDate();
    return `${y}-${m < 10 ? '0' + m : m}-${d < 10 ? '0' + d : d}`;
  }
  get day() {
    return this.days[this.now.getDay()];
  }
  get time() {
    const h = this.now.getHours();
    const m = this.now.getMinutes();
    return `${h < 10 ? '0' + h : h}:${m < 10 ? '0' + m : m}`;
  }
}
