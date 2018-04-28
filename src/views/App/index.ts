import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import WithRender from './app.html?style=./app.scss';
// import Navi from '@components/Navi';
import Header from '@components/Header';

@WithRender
@Component({
  components: {vHeader: Header}
})
export default class App extends Vue {
  showHeader = false;
  title = '';
  auth = false;
  nobg = true;

  beforeRouteEnter(to, from, next) {
    let title = '';
    let showHeader = to.meta.showHeader || false;
    // console.log(to, from);

    if (to.meta && to.meta.title) {
      title = to.meta.title;
    }
    if (to.meta && to.meta.auth) {
      const name = sessionStorage.getItem('user');
      if (!name) {
        next({name: 'login'})
        return;
      }
    }
    next(vm => {
      vm.showHeader = showHeader;
      vm.title = title;
      vm.nobg = to.meta.nobg || false;
    })
  }
  @Watch('$route')
  onRouteChange(nRoute) {
    let title = '';
    if (nRoute.meta && nRoute.meta.auth) {
      const name = sessionStorage.getItem('user');
      if (!name) {
        this.$router.replace({name: 'login'});
      }
    }
    if (nRoute.meta && nRoute.meta.title) {
      title = nRoute.meta.title;
    }
    this.showHeader = nRoute.meta.showHeader || false;
    this.title = title;
    this.nobg = nRoute.meta.nobg || false;
  }
}
