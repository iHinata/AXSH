import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import WithRender from './progress.html?style=./progress.scss';
import ProgressBar from '@components/ProgressBar';

@WithRender
@Component({
  components: {ProgressBar}
})
export default class ProgressBarGroup extends Vue {
  @Prop() data: ChartItem[]
}
