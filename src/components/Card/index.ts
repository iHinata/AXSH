import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import WithRender from './card.html?style=./card.scss';

@WithRender
@Component
export default class Card extends Vue {
  @Prop() title: string;
  @Prop() date: Date | string;
  @Prop({default: '50%'}) height: number | string;
  @Prop({default: 1}) gutter: number;
  @Prop({default: false}) top: boolean;

  get heightCmp() {
    if (typeof this.height === 'string') {//百分比
      return this.height;
    }
    return this.height + 'px';
  }

  get gutterCmp() {
    return this.gutter * (document.body.clientWidth / 12) * 0.1;
  }

  get topGutter() {
    if (this.top) {
      return this.gutterCmp;
    }
    return 0;
  }


  get formatDate() {
    const type = typeof this.date;
    if (type === 'object') {
      const date = this.date as Date;
      const y = date.getFullYear();
      const M = date.getMonth() + 1;
      const d = date.getDate();
      const h = date.getHours();
      const m = date.getMinutes();
      return `${y}/${M < 10 ? '0' + M : M}/${d < 10 ? '0' + d : d} ${h < 10 ? '0' + h : h}:${m < 10 ? '0' + m : m}`;
    } else {
      return this.date;
    }
  }

}
