import SockJS from 'sockjs-client';
import Stomp from "@utils/stomp";
import {WS} from '@utils/context';


class WebSocketWrap {
  private sock = null;
  private client = null;
  private subscription = null;
  private callback = null;
  private topic = null;
  private timer = null;
  constructor(private url) {
  }
  subscribe(topic, callback: (res) => void) {
    if (!this.sock) {
      this.sock = new SockJS(this.url);
    }
    this.topic = topic;
    this.callback = callback;
    if (!this.client) {
      this.client = Stomp.over(this.sock);
      this.client.connect({}, () => {
        this.sub();
      });
    } else {
      this.sub();
    }
  }
  private sub() {
    this.downtime();
    this.subscription = this.client.subscribe(this.topic, response => {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.downtime();
      const json = JSON.parse(response.body);
      this.callback(json);
    })
  }
  private downtime() {
    this.timer = setTimeout(() => {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
      this.sock = null;
      this.subscription = null;
      this.client = null;
      this.subscribe(this.topic, this.callback)
    }, 360000);
  }
}


export default function create (url = WS) {
  const ws = new WebSocketWrap(url);
  return ws;
};
