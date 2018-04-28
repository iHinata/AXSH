import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import WithRender from './mapchart.html?style=./mapchart.scss';
import Chart from '@components/Chart';
import 'echarts/map/js/china';

const toString = Object.prototype.toString;

@WithRender
@Component({
    components: { Chart }
})
export default class MapChart extends Vue {
    @Prop({ default: 0 }) height: number | string;
    @Prop({ default: 15 }) left: number;
    @Prop({ default: 12 }) right: number;
    @Prop({ default: 0 }) top: number;
    @Prop({ default: true }) notMerge: boolean;
    @Prop({ default: true }) showVisual: boolean;
    @Prop({ default: () => [] }) legend: string[];
    @Prop({ default: () => [] }) color: string[];
    @Prop({ default: () => [] }) data: ChartItem[] | ChartItem[][];

    options = { visualMap: {}, series: [] }

    active = 0;

    @Watch('data')
    onDataChange(nData: ChartItem[] | ChartItem[][]) {
        const opts = { geo: null, visualMap: null, series: [], legend: {} };
        if (this.showVisual) {
            let max = 0;
            (<ChartItem[]>nData).forEach(data => {
                if (toString.call(data) === '[object Array]') {
                    data.forEach(d => {
                        if (d.value > max) {
                            max = <number>d.value;
                        }
                    })
                } else {
                    if (data.value > max) {
                        max = <number>data.value;
                    }
                }
            });
            opts.visualMap = {
                type: 'continuous',
                calculable: true,
                min: 0,
                max: max,
                left: '5%',
                bottom: '20%',
                text: ['高', '低'],           // 文本，默认为数值文本
                itemWidth: 10,
                itemHeight: 50,
                borderRadius: 10,
                inRange: {
                    color: this.color || ['#8CB9DC', '#1B3A7A'],
                    symbol: 'circle'
                },
                textStyle: {
                    color: '#ffffff'
                }
            }
        } else {
            let max = 0;
            (<ChartItem[]>nData).forEach(data => {
                if (toString.call(data) === '[object Array]') {
                    data.forEach(d => {
                        if (d.value > max) {
                            max = <number>d.value;
                        }
                    })
                } else {
                    if (data.value > max) {
                        max = <number>data.value;
                    }
                }
            });
            opts.visualMap = {
                type: 'continuous',
                calculable: true,
                show: this.showVisual,
                min: 0,
                max: max,
                left: '5%',
                bottom: '20%',
                text: ['高', '低'],           // 文本，默认为数值文本
                itemWidth: 10,
                itemHeight: 50,
                borderRadius: 10,
                inRange: {
                    color: this.color || ['#8CB9DC', '#1B3A7A'],
                    symbol: 'circle'
                },
                textStyle: {
                    color: '#ffffff'
                }
            },
            opts.legend = null
            opts.tooltip = {
                trigger: 'item'
            }
            opts.series.push({
                name: 'ChinaMap',
                type: 'map',
                mapType: 'china',
                roam: false,
                data: nData,
                left: '5%',
                right: '5%',
                top: '5%',
            })
        }
        if (this.legend.length > 0) {
            opts.legend = {
                show: false,
                data: this.legend
            }
            opts.geo = {
                map: 'china',
                silent: true,
                top: 0,
                bottom: 30,
                itemStyle: {
                    normal: {
                        areaColor: 'transparent',
                        borderColor: '#B3BCCD'
                    }
                }
            }
            for (let i = 0, len = this.legend.length; i < len; i++) {
                opts.series.push({
                    name: this.legend[i],
                    type: 'scatter',
                    coordinateSystem: 'geo',
                    symbolSize: 8,
                    data: nData[i],
                    label: {
                        normal: {
                            position: 'right',
                            formatter: ({ name, value }) => `{a|${name}}{abg|}\n{per|${value[2]}} 分 安全 {per|${value[4]}} 可用性 {per|${value[3]}}`,
                            backgroundColor: 'rgba(16, 34, 189, 0.3)',
                            borderRadius: 4,
                            padding: [10, 20, 10, 20],
                            rich: {
                                a: {
                                    color: '#fff',
                                    lineHeight: 32,
                                    fontSize: 18,
                                    align: 'center'
                                },
                                b: {
                                    backgroundColor: '#334455',
                                    color: '#eee',
                                    fontSize: 18,
                                    lineHeight: 32
                                },
                                per: {
                                    color: '#eee',
                                    backgroundColor: '#334455',
                                    padding: [2, 4],
                                    borderRadius: 2
                                }
                            }
                        }
                    }
                }, {
                        name: this.legend[i] + 'top 5',
                        type: 'effectScatter',
                        coordinateSystem: 'geo',
                        symbolSize: 10,
                        rippleEffect: {
                            scale: 6
                        },
                        zlevel: -1,
                        data: nData[i].filter(val => val.value && val.value[2] !== 100).map((val, idx, arr) => {
                            return {
                                name: val.name,
                                value: val.value,
                                itemStyle: val.itemStyle,
                                label: {
                                    normal: {
                                        show: idx === (this.active % arr.length) ? true : false,
                                        position: 'left',
                                        formatter: ({ name, value }) => `{a|${name}}{abg|}\n{per|${value[2]}} 分 安全 {per|${value[4]}} 可用性 {per|${value[3]}}`,
                                        backgroundColor: 'rgba(16, 34, 189, 0.3)',
                                        borderRadius: 4,
                                        padding: [10, 20, 10, 20],
                                        rich: {
                                            a: {
                                                color: '#fff',
                                                lineHeight: 32,
                                                fontSize: 18,
                                                align: 'center'
                                            },
                                            b: {
                                                backgroundColor: '#334455',
                                                color: '#eee',
                                                fontSize: 18,
                                                lineHeight: 32
                                            },
                                            per: {
                                                color: '#eee',
                                                backgroundColor: '#334455',
                                                padding: [2, 4],
                                                borderRadius: 2
                                            }
                                        }
                                    }
                                }
                            }
                        })
                    });
            }
        } else {
            opts.legend = null;
            opts.series.push({
                name: '',
                type: 'map',
                mapType: 'china',
                roam: false,
                data: nData,   
            })
            
        }
        this.options = opts;
    }

    mounted() {
        this.onDataChange(this.data);
        if (this.legend.length > 0) {
            setInterval(() => {
                if (this.active > 9999999) {
                    this.active = 0;
                }
                this.active = this.active + 1;
                this.onDataChange(this.data);
            }, 10000);
        }
    }

}
