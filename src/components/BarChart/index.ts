import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import WithRender from './bar.html?style=./bar.scss';
import Chart from '@components/Chart';

import ovalPng from '@assets/images/oval.png';
@WithRender
@Component({
  components: { Chart }
})
export default class BarChart extends Vue {
  @Prop({ default: 0 }) height: number | string;
  @Prop({ default: true }) notMerge: boolean;
  @Prop({ default: false }) showLabel: boolean;
  @Prop() title: string;
  @Prop() yName: string;
  @Prop({ default: () => [] }) data: ChartItem[];
  @Prop({ default: () => [] }) x: string[];
  @Prop({ default: () => [] }) legend: any[];
  @Prop({ default:  0}) titleY: number;
  @Prop({ default:  100}) legendY: number;
  @Prop({ default:  16}) fontSize: number;
  @Prop({default: () => ['#7238E1', '#1678E9', '#40C637', '#FD6631']}) color: string[];

  options = { title: {}, series: [], xAxis: [], yAxis: [], grid: {}, color: [], legend: null };

  get wrapX() {
    return this.x.map(x => {
      if (x.length > 5) {
        return x.slice(0, 5) + '\n' + x.slice(5)
      }
      return x;
    })
  }

  @Watch('data')
  onDataChange(nData: ChartItem[]) {
    const series = nData.map(data => {
      return {
        name: data.name,
        type: data.type ? data.type : 'bar',
        symbol: `image:/${ovalPng.replace('/appsummary', '')}`,
        symbolSize: 12,
        stack: 'one',
        data: data.value
      }
    });
    let legend = {};
    if (this.legend.length > 0) {
      legend = {
        textStyle: {
          color: '#fff'
        },
        top: this.legendY,
        data: this.legend
      }
    }
    this.options = {
      legend: legend,
      title: {
        text: this.title,
        x: 'center',
        y: this.titleY,
        textStyle: {
          color: 'white',
          fontSize: this.fontSize
        }
      },
      grid: {
        top: '30%',
        bottom: 0,
        left: 0,
        right: 0,
        containLabel: true
      },
      xAxis: [{
        type: 'category',
        axisLine: {
          lineStyle: {
            color: '#eaeaea'
          }
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          color: 'white',
          // formatter: value => value.split('').splice(3, 0, '\n').join(''),
          interval: 0
        },
        data: this.wrapX
      }],
      yAxis: [{
        name: this.yName,
        nameTextStyle: {
          color: '#fff'
        },
        type: 'value',
        axisLine: {
          show: false
        },
        axisLabel: {
          color: 'white'
        },
        axisTick: {
          show: false
        },
        splitLine: {
          lineStyle: {
            color: '#eaeaea',
            opacity: 0.3
          }
        }
      }],
      series: series,
      color: this.color
    }
  }

  mounted() {
    this.onDataChange(this.data);
  }
}
