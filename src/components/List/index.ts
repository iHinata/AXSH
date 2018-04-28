import Vue from 'vue';
import { Component, Prop, Watch, Model } from 'vue-property-decorator';
import WithRender from './list.html?style=./list.scss';
import Pagination from '@components/Pagination';
import Loading from '@components/Loading';

@WithRender
@Component({
  components: {Pagination, Loading}
})
export default class List extends Vue {
  @Prop() columns: Column[];
  @Prop() data: any[];
  @Prop({default: 0}) total: number;
  @Prop({default: true}) rownum: boolean;
  @Prop({default: true}) loading: boolean;


  @Prop({default: 1}) @Model('change') page: number;

  active = 1;

  size = 10;

  get startRownum() {
    return (this.active - 1) * this.size;
  }

  pageChange(page, size) {
    this.size = size;
    this.$emit('onChange', page, size);
  }
  @Watch('active')
  onActiveChange(nActive) {
    this.$emit('change', nActive);
  }
  @Watch('page')
  onPageChange(nPage) {
    this.active = nPage;
  }
}
