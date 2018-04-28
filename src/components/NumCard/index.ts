import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import WithRender from './number.html?style=./number.scss';

@WithRender
@Component
export default class NumCard extends Vue {
  @Prop({default: 0}) num: number;
  @Prop({default: true}) animate: boolean;
  @Prop({default: 20}) size: number;
  @Prop({default: 'rgba(0, 0, 0, 0.4)'}) bgColor: string;

  // height = 0;

  // mounted () {
  //   this.$nextTick(() => {
  //     const children = this.$el.children;
  //     const rect = this.$el.children.item(0).getBoundingClientRect();
  //     this.height = rect.height;
  //   })
  // }

}
