import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import WithRender from './header.html?style=./header.scss';

import TimeDisplay from '@components/TimeDisplay';

@WithRender
@Component({
  components: {TimeDisplay}
})
export default class Header extends Vue {
  @Prop() title: string;
}
