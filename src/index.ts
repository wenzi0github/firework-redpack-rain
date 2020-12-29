import defaultsConfig from './config/defaults';
import RedpackItem from './libs/redpackItem';
import { requestAnimationFramePolyfill, cancelAnimationFramePolyfill } from './utils/animationFrame';
import Visibility from 'gh-qqnews-utils/visibility';

// 每个红包的配置
interface RedpackRainItem {
  speedMin?: number;
  speedMax?: number;
  imgUrl?: string;
  width?: number;
  height?: number;
}

interface BubbleProps {
  imgUrl?: string;
  width?: number;
  height?: number;
  speed?: number;
  opacitySpeed?: number;
}

interface MonitorProps {
  fps: number;
}

interface RedpackRainProps {
  selector: HTMLElement | string;
  interval?: number;
  eventType?: 'click' | 'touchstart';
  redpack?: RedpackRainItem;
  bubble?: BubbleProps;
  onClick?: (isHit: boolean) => void;
  onMonitor?: (props: MonitorProps) => void;
}

class RedpackRain {
  private timer: NodeJS.Timeout | null = null;
  private rainCtx: CanvasRenderingContext2D | null = null;
  private bubbleCtx: CanvasRenderingContext2D | null = null;
  private config = defaultsConfig;
  private parentClientRect = { width: 0, height: 0, top: 0, left: 0 };
  private ratio = 3;
  private redpackItemList: {
    [key: number]: RedpackItem;
  } = {};
  private requestId: number | null = null;
  private fpsBefore = Date.now(); // 计算fps
  private lastRedpackX = 0; // 上个红包的横坐标
  private pageVisibility: Visibility | null = null;

  constructor(props: RedpackRainProps) {
    this.createConfig(props);

    if (typeof props.selector === 'string') {
      const dom: HTMLElement | null = document.querySelector(props.selector);
      if (dom) {
        this.config.selector = dom;
      } else {
        console.error(`rain container cant found, selector: ${props.selector}`);
      }
    } else {
      this.config.selector = props.selector;
    }
    this.creatCanvas();
    this.pageVisibility = new Visibility();
  }

  // 手动配置覆盖掉默认配置
  private createConfig(config: any, parentKey = '') {
    // eslint-disable-next-line no-restricted-syntax
    for (const key in config) {
      const item = config[key];

      if (item) {
        if (typeof item === 'object') {
          this.createConfig(item, key);
        } else {
          if (parentKey) {
            (this.config as any)[parentKey][key] = item;
          } else {
            (this.config as any)[key] = item;
          }
        }
      }
    }
  }

  // 在指定容器内创建2个canvas
  private creatCanvas() {
    const selector: HTMLElement = this.config.selector as HTMLElement;

    const { top, left, width, height } = selector.getBoundingClientRect();

    this.parentClientRect.width = width * this.ratio;
    this.parentClientRect.height = height * this.ratio;
    this.parentClientRect.top = top;
    this.parentClientRect.left = left;

    if (selector.getElementsByTagName('canvas').length === 0) {
      const canvasBubble = document.createElement('canvas');
      canvasBubble.className = 'bubble-redpack-canvas';
      canvasBubble.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1';
      canvasBubble.width = this.parentClientRect.width;
      canvasBubble.height = this.parentClientRect.height;

      const canvasRain = document.createElement('canvas');
      canvasRain.className = 'rain-redpack-canvas';
      canvasRain.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 2';
      canvasRain.width = this.parentClientRect.width;
      canvasRain.height = this.parentClientRect.height;

      const div = document.createElement('div');
      div.className = `rain-item rain-${Date.now()}-${Math.random()}`;
      div.style.cssText = 'position: relative; height: 100%';
      div.appendChild(canvasBubble);
      div.appendChild(canvasRain);

      selector.appendChild(div);

      const rainCanvasSelector: HTMLCanvasElement | null = selector.querySelector('.rain-redpack-canvas');
      const bubbleCanvasSelector: HTMLCanvasElement | null = selector.querySelector('.bubble-redpack-canvas');

      if (rainCanvasSelector && bubbleCanvasSelector) {
        this.rainCtx = rainCanvasSelector.getContext('2d');
        this.bubbleCtx = bubbleCanvasSelector.getContext('2d');
      }
    }
  }

  /**
   * 返回红包创建时的x轴坐标
   * https://git.code.oa.com/news-gh-team/firework-redpack-rain/issues/2
   * @param width 红包的宽度
   */
  private getRedpackItemX(width: number): number {
    let x = this.lastRedpackX;
    do {
      x = Math.floor(Math.random() * (this.parentClientRect.width - width * 3) + width); // 避免红包产生在边界
    } while (Math.abs(this.lastRedpackX - x) <= width * 1.5); // 避免先后两个红包重叠

    this.lastRedpackX = x;
    return x;
  }

  // 创建红包
  private createRedpackItem() {
    if (!this.rainCtx || !this.bubbleCtx) {
      this.stop();
      return;
    }
    const { width, height, speedMax, speedMin, imgUrl } = this.config.redpack || {};
    const redpackItemId = Date.now();
    const x = this.getRedpackItemX(width);
    const redpackItem = new RedpackItem({
      redpackId: redpackItemId,
      redpackCtx: this.rainCtx,
      bubbleCtx: this.bubbleCtx,
      x,
      y: -this.config.redpack.height,
      redpackImgUrl: imgUrl,
      width,
      height,
      speedMax,
      speedMin,
      bubble: this.config.bubble,
      containerHeight: this.parentClientRect.height,
      onDestoryed: (id) => {
        delete this.redpackItemList[id];
      },
    });
    redpackItem.start();
    this.redpackItemList[redpackItemId] = redpackItem;
  }

  private clickListener = (event: MouseEvent | TouchEvent) => {
    if (typeof this.config.onClick !== 'function') {
      return;
    }
    let touchClients: Array<{ clientX: number; clientY: number }> = []; // 手指触控的坐标
    if (event.type === 'touchstart') {
      // touchstart
      touchClients = Array.prototype.slice.call((event as TouchEvent).touches).map(touch => ({
        clientX: touch.clientX,
        clientY: touch.clientY,
      }));
    } else {
      // click
      touchClients = [
        {
          clientX: (event as MouseEvent).clientX,
          clientY: (event as MouseEvent).clientY,
        },
      ];
    }

    const { left, top } = this.parentClientRect;

    if (this.requestId) {
      cancelAnimationFramePolyfill(this.requestId);
    }
    touchClients.forEach(({ clientX, clientY }) => {
      const myClientX = (clientX - left) * this.ratio;
      const myClientY = (clientY - top) * this.ratio;
      // eslint-disable-next-line no-restricted-syntax
      for (const key in this.redpackItemList) {
        const redpackItem = this.redpackItemList[key];
        const { x, y, width, height } = redpackItem;

        const diff = 14;
        let isHited = false;
        if (
          myClientX >= x - diff
          && myClientX <= x + width + diff
          && myClientY >= y - diff
          && myClientY <= y + height + diff
        ) {
          delete this.redpackItemList[key];
          redpackItem.addBubble();
          isHited = true;
        }
        if (typeof this.config.onClick === 'function') {
          this.config.onClick(isHited);
        }
      }
    });
    this.render();
  };

  private render() {
    this.requestId = requestAnimationFramePolyfill(() => {
      this.rainCtx?.clearRect(0, 0, this.parentClientRect.width, this.parentClientRect.height);
      // eslint-disable-next-line no-restricted-syntax
      for (const key in this.redpackItemList) {
        const redpackItem = this.redpackItemList[key];

        redpackItem.render();
      }
      const now = Date.now();
      const fps = Math.round(1000 / (now - this.fpsBefore));
      this.fpsBefore = now;
      if (typeof this.config.onMonitor === 'function') {
        this.config.onMonitor({ fps });
      }
      this.render();
    });
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  start() {
    // 先停止上一个
    this.stop();
    this.config.selector.addEventListener(this.config.eventType, this.clickListener, false);

    this.createRedpackItem();

    // 创建一个新的红包雨
    this.timer = setInterval(() => {
      this.createRedpackItem();
    }, this.config.interval);
    this.render();

    this.pageVisibility?.visibilityChange((isShow) => {
      if (isShow) {
        // 创建一个新的红包雨
        this.timer = setInterval(() => {
          this.createRedpackItem();
        }, this.config.interval);
      } else {
        if (this.timer) {
          clearInterval(this.timer);
          this.timer = null;
        }
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    if (this.requestId) {
      cancelAnimationFramePolyfill(this.requestId);
      this.requestId = null;
    }
    this.rainCtx?.clearRect(0, 0, this.parentClientRect.width, this.parentClientRect.height);
    this.config.selector.removeEventListener(this.config.eventType, this.clickListener);

    this.pageVisibility?.destory();
  }
}
export default RedpackRain;
