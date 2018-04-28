import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import WithRender from './map.html?style=./map.scss';

@WithRender
@Component
export default class Map extends Vue {

}
