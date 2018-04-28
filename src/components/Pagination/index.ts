import Vue from 'vue';
import { Component, Prop, Watch, Model } from 'vue-property-decorator';
import WithRender from './pagination.html?style=./pagination.scss';

import Select from '@components/Select';

@WithRender
@Component({
  components: {vSelect: Select}
})
export default class Pagination extends Vue {
  @Prop({default: 0}) total: number;
  @Prop({default: 5}) maxShow: number;
  size = 10;
  @Prop({default: 1}) @Model('change') active: number;
  get pages() {
    return Math.ceil(this.total / this.size);
  }
  get counts() {
    if (this.maxShow > this.pages) {
      return this.pages;
    }
    let start = Math.max(this.active - 1, 1);
    let end = Math.min(start + this.maxShow - 1, this.pages);
    if (end - start + 1 < this.maxShow) {
      start = this.pages - this.maxShow + 1;
    }
    const nums = [];
    for (let i = start; i <= end; i++) {
      nums.push(i);
    }
    return nums;
  }
  get disableIndex() {
    return this.active === 1;
  }
  get disableLast() {
    return this.active === this.pages;
  }
  @Watch('size')
  onSizeChange(nSize) {
    this.index();
    this.$emit('onChange', 1, nSize);
  }
  @Watch('active')
  onPageChange(nPage) {
    this.$emit('onChange', nPage, this.size);
  }
  go(page = 1) {
    this.$emit('change', page);
  }
  index() {
    this.go(1);
  }
  last() {
    this.go(this.pages);
  }
  prev() {
    this.go(Math.max(this.active - 1, 1));
  }
  next() {
    this.go(Math.min(this.active + 1, this.pages));
  }
}
