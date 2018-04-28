import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import WithRender from './pie.html?style=./pie.scss';
import Chart from '@components/Chart';

@WithRender
@Component({
  components: {Chart}
})
export default class PieChart extends Vue {
  @Prop({default: 0}) height: number | string;
  @Prop({default: true}) notMerge: boolean;
  @Prop({default: true}) show: boolean;
  @Prop({default: false}) showNumber: boolean;
  @Prop({default: () => []}) data: ChartItem[];
  @Prop() title: string;
  @Prop({default: () => [0, '70%']}) radius: string[];
  @Prop({default: () => ['#7238E1', '#1678E9', '#40C637', '#FD6631']}) color: string[];
  @Prop({default: 'center'}) align: string;
  @Prop({default: () => ({top: 15})}) legendPos: {top?: number, left?: number, bottom?: number, right?: number };
  @Prop({default: 'inside'}) labelPos: string;
  @Prop({default: ''}) iconUrl: string;
  @Prop({default: 25}) fontSize: number;
  @Prop({default: 1}) count: number;
  @Prop({default: () => []}) centerText: string[];
  @Prop({default: 'horizontal'}) orient: string;
  @Prop() center: string[];
  @Prop({default: 1}) col: number;

  options = {title: {}, grid: {}, series: [], color: [], legend: {}};

  @Watch('data')
  onDataChange(nData: ChartItem[]) {
    let legend: string[] = null;
    const series = []
    if (this.count === 1) {
      legend = nData.map(data => data.name);
      series.push({
        name: '',
        type: 'pie',
        center: this.center ? this.center : ['50%', this.title ? '65%' : '50%'],
        radius: this.radius,
        data: this.centerText.length > 0 ? nData.concat({
          value: 0,
          name: this.centerText[0],
          label: {
            normal: {
              position: 'center',
              fontSize: 14,
              color: '#fff',
              formatter: () => { 
                  let text = this.centerText[0]
                  return text
                }
            }
          }}) : nData,
        labelLine: {
          normal: {
            length: 0
          }
        },
        label: {
          normal: {
            formatter: (param) => this.showNumber ? param.value : ((param.percent as number).toFixed(1) + '%'),
            fontFamily: 'DINCondensed',
            fontSize: this.fontSize,
            position: this.labelPos
          }
        }
      })
    } else {
      legend = nData[0].map(data => data.name)
      const left = 100 / nData.length;
      const radius = parseInt(this.radius[1]) - parseInt(this.radius[0]);
      for (let i = 0; i < nData.length; i++) {
        let d = nData[i];
        if (d.every(item => item.value === 0)) {
          d = [];
        }
        series.push({
          name: '',
          type: 'pie',
          center: [`${left * i + radius}%`, '60%'],
          radius: this.radius,
          data: d.concat({
            value: 0,
            name: this.centerText[i],
            itemStyle: {
              normal: {
                color: 'transparent'
              }
            },
            label: {
              normal: {
                position: 'center',
                fontSize: 14,
                color: '#fff',
                formatter: () => this.centerText[i]
              }
            }}),
          labelLine: {
            normal: {
              length: 6,
              length2: 0
            }
          },
          label: {
            normal: {
              formatter: (param) => this.showNumber ? param.value : ((param.percent as number).toFixed(1) + '%'),
              fontFamily: 'DINCondensed',
              fontSize: this.fontSize,
              position: this.labelPos
            }
          }
        })
      }
    }
    if (this.col > 1) {
      const temp = []
      for (let i=0; i<legend.length; i++) {
        temp.push(legend[i]);
        if ((i + 1) % this.col === 0) {
          temp.push('\n');
        }
      }
      legend = temp;
    }
    this.options = {
      title : {
        text: this.title,
        x: this.align,
        textStyle: {
          color: 'white',
          fontSize: 16
        }
      },
      grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      },
      series : series,
      legend: {
        data: legend,
        show: this.show,
        icon: 'circle',
        orient: this.orient,
        formatter: name => `{a|${name}}`,
        textStyle: {
          color: '#ffffff',
          rich: {
            a: {
              width: this.col > 1 ? 100 / this.col : 'auto',
            }
          }
        },
        top: this.legendPos.top,
        left: this.legendPos.left || 'center',
        bottom: this.legendPos.bottom,
        right: this.legendPos.right
      },
      color: this.color
    }
  }

  mounted () {
    this.onDataChange(this.data);
  }

}
