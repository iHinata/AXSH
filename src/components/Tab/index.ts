import Vue from 'vue';
import { Component, Prop, Watch, Model } from 'vue-property-decorator';
import WithRender from './tab.html?style=./tab.scss';

@WithRender
@Component
export default class Tab extends Vue {
  @Prop() data: string[];
  @Prop({default: 0}) @Model('change') active: number;

  change(tab) {
    this.$emit('change', tab);
  }
}
