import Vue from 'vue';
import { Component, Prop, Watch, Model } from 'vue-property-decorator';
import WithRender from './select.html?style=./select.scss';

@WithRender
@Component
export default class Select extends Vue {
  @Prop() label: string;
  @Prop({default: false}) disabled: boolean;
  @Prop({default: () => []}) items: any[];
  @Prop({default: 0}) defautActive: number;
  @Prop({default: false}) up: boolean;
  @Prop({default: false}) autoFire: boolean;
  @Prop({default: 2}) size: number;
  show = false;
  active = this.defautActive || 0;
  top = '0';
  @Model('change') @Prop() value;
  get showText() {
    if (this.items && this.items[this.active]) {
      return this.items[this.active].text || this.items[this.active]
    }
    return '';
  }
  created() {
    if (this.autoFire && this.items && this.items.length > 0) {
      let index = this.active;
      if (!this.items[index]) {
        index = 0;
      }
      this.itemClick(this.items[index], index);
    }
  }
  mounted() {
    // 计算下拉框大小, 进行定位
    if (this.up) {
      let totalHeight = this.items.length * 12;
      const dom = this.$refs.dropdown as HTMLElement;
      const prev = dom.style.display;
      dom.style.display = 'block';
      totalHeight = dom.clientHeight;
      dom.style.display = prev;
      if (totalHeight > 200) {
        totalHeight = 200;
      }
      this.top = -2 - totalHeight + 'px';
    } else {
      this.top = '25px';
    }
  }
  @Watch('items')
  onItemsChange(newItems) {
    if (this.autoFire && typeof newItems !== 'undefined') {
      this.itemClick(newItems[0], 0);
    }
  }
  toggle() {
    if (this.disabled || this.items === undefined || this.items.length === 0) {
      return;
    }
    this.show = !this.show;
    if (this.show) {
      // hack !!!
      this.$nextTick(() => (this.$refs.dropdown as HTMLElement).focus());
    }
  }
  hide() {
    this.show = false;
  }
  itemClick(item, idx) {
    this.$emit('change', item, idx);
    this.active = idx;
    this.show = false;
  }
}
