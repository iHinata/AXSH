import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import WithRender from './line.html?style=./line.scss';
import Chart from '@components/Chart';

@WithRender
@Component({
  components: { Chart }
})
export default class LineChart extends Vue {
  @Prop({ default: 0 }) height: number | string;
  @Prop({ default: true }) notMerge: boolean;
  @Prop({ default: true }) smooth: boolean;
  @Prop({ default: () => [] }) x: string[];
  @Prop({ default: () => [] }) data: ChartItem[];
  @Prop({default: () => ['#6EC02B', '#34A124', '#2EA371', '#347DA3', '#0E5BB0']}) color: string[];

  options = { legend: {}, series: [], xAxis: [], yAxis: [], grid: {}, color: [] }

  @Watch('data')
  onDataChange(nData: ChartItem[]) {
    const legend = [];
    const series = nData.map(data => {
      legend.push(data.name);
      return {
        name: data.name,
        type: 'line',
        stack: 'one',
        showSymbol: false,
        smooth: this.smooth,
        areaStyle: { normal: {opacity: 0.2} },
        data: data.value
      }
    })
    this.options = {
      legend: {
        left: 'center',
        top: 10,
        icon: 'circle',
        textStyle: {
          color: '#ffffff'
        },
        data: legend
      },
      grid: {
        top: '20%',
        left: '3%',
        right: '3%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          axisTick: {
            show: false
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#eaeaea',
              opacity: 0.1
            }
          },
          axisLabel: {
            color: 'white'
          },
          axisLine: {
            lineStyle: {
              color: 'white'
            }
          },
          data: this.x
        }
      ],
      yAxis: [
        {
          type: 'value',
          splitLine: {
            lineStyle: {
              color: '#eaeaea',
              opacity: 0.3
            }
          },
          axisLine: {
            show: false
          },
          axisLabel: {
            color: 'white'
          },
          axisTick: {
            show: false
          }
        }
      ],
      series: series,
      color: this.color
    }
  }

  mounted() {
    this.onDataChange(this.data);
  }
}
