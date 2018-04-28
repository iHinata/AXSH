import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import WithRender from './rating.html?style=./rating.scss';

@WithRender
@Component
export default class Rating extends Vue {
  @Prop({default: 0}) num: number;
  @Prop({default: 5}) total: number;
  get full() {
    return Math.floor(this.num);
  }
  get hasHalf() {
    return 0 !== this.num - this.full;
  }
  get empty() {
    let left = this.total - this.full;
    if (this.hasHalf) {
      left --;
    }
    return left;
  }
}
