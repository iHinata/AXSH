import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import WithRender from './chart.html?style=./chart.scss';
import echarts from 'echarts';
import 'echarts/map/js/china';

@WithRender
@Component
export default class Chart extends Vue {
  @Prop({default: '100%'}) height: number | string;
  @Prop() options: any;
  @Prop({default: true}) notMerge: boolean;

  instance = null;

  resize() {
    if (this.instance) {
      this.instance.resize();
    }
  }
  beforeDestroy () {
    window.removeEventListener('resize', this.resize)
  }
  mounted () {
    window.addEventListener('resize', this.resize)
    if (this.options) {
      this.instance = echarts.init(this.$refs.chart);
      this.instance.setOption(this.options, this.notMerge);
    }
  }
  @Watch('options')
  onOptsChange(nOpt) {
    if (!this.instance) {
      this.instance = echarts.init(this.$refs.chart);
    }
    this.instance.setOption(nOpt, this.notMerge)
  }

  get heightCmp() {
    if (typeof this.height === 'string') {
      return this.height;
    }
    return this.height + 'px'
  }

}
