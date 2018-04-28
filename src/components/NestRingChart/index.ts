import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import WithRender from './ring.html?style=./ring.scss';
import Chart from '@components/Chart';

@WithRender
@Component({
  components: {Chart}
})
export default class NestRingChart extends Vue {
  @Prop() title: string;
  @Prop({default: 0}) height: number | string;
  @Prop({default: true}) notMerge: boolean;
  @Prop({default: () => []}) data: ChartItem[];
  @Prop({default: () => ['#7238E1', '#1678E9', '#40C637', '#FD6631']}) color: string[];

  // get wrapTitle() {
  //   if (this.title.length > 3) {
  //     return this.title.slice(0, 3) + '\n' + this.title.slice(3)
  //   }
  //   return this.title
  // }

  radius = 13;
  options = { grid: {}, series: []};


  @Watch('data')
  onDataChange(nData: ChartItem[]) {
    const series = nData.map((data, idx) => {
      const left = 100 - <number>data.value;
      const endRadius = 100 - idx * this.radius;
      return {
        name: data.name,
        type: 'pie',
        radius: [`${endRadius - this.radius}%`, `${endRadius}%`],
        center: ['50%', '50%'],
        data: [{
          value: data.value,
          name: idx === nData.length - 1 ? this.title : '占比',
          label: {
            normal: {
              show: idx === nData.length - 1,
              position: 'center',
              color: 'white',
              textStyle: {
                fontSize: '16',
                fontWeight: 'bold'
              }
            }
          },
          itemStyle: {
            normal: {
              color: this.color[idx % this.color.length],
              borderColor: 'black'
            }
          }
        }, {
          value: left,
          name: '剩余',
          label: {
            normal: {
              show: false
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          itemStyle: {
            normal: {
              color: 'rgba(0,4,8,0.30)',
              borderColor: 'rgba(0, 0, 0, 0.1)'
            }
          }
        }],
      }
    })
    this.options = {
      grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      },
      series
    }
  }

  mounted () {
    this.onDataChange(this.data);
  }

}
