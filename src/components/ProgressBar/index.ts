import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import WithRender from './progress.html?style=./progress.scss';

@WithRender
@Component
export default class ProgressBar extends Vue {
  @Prop() data: ChartItem;
}
