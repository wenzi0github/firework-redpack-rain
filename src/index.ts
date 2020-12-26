import defaultsConfig from './config/defaults';
import RedpackItem from './libs/redpackItem';
import {
  requestAnimationFramePolyfill,
  cancelAnimationFramePolyfill,
} from './utils/animationFrame';

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
  }

  // 手动配置覆盖掉默认配置
  private createConfig(config: any, parentKey = '') {
    for (let key in config) {
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
      canvasBubble.style.cssText = `position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1`;
      canvasBubble.width = this.parentClientRect.width;
      canvasBubble.height = this.parentClientRect.height;

      const canvasRain = document.createElement('canvas');
      canvasRain.className = 'rain-redpack-canvas';
      canvasRain.style.cssText = `position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 2`;
      canvasRain.width = this.parentClientRect.width;
      canvasRain.height = this.parentClientRect.height;

      const div = document.createElement('div');
      div.className = `rain-item rain-${Date.now()}-${Math.random()}`;
      div.style.cssText = 'position: relative; height: 100%';
      div.appendChild(canvasBubble);
      div.appendChild(canvasRain);

      selector.appendChild(div);

      this.rainCtx = (selector.querySelector(
        '.rain-redpack-canvas',
      ) as HTMLCanvasElement).getContext('2d');
      this.bubbleCtx = (selector.querySelector(
        '.bubble-redpack-canvas',
      ) as HTMLCanvasElement).getContext('2d');
    }
  }

  // 创建红包
  private createRedpackItem() {
    if (!this.rainCtx || !this.bubbleCtx) {
      this.stop();
      return;
    }
    const { width, height, speedMax, speedMin, imgUrl } =
      this.config.redpack || {};
    const redpackItemId = Date.now();
    const redpackItem = new RedpackItem({
      redpackId: redpackItemId,
      redpackCtx: this.rainCtx,
      bubbleCtx: this.bubbleCtx,
      x: Math.random() * (this.parentClientRect.width - width * 2) + width, // 避免红包产生在边界
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

  private clickListener = (event: MouseEvent) => {
    const { clientX, clientY } = event;
    const { left, top } = this.parentClientRect;

    if (this.requestId) {
      cancelAnimationFramePolyfill(this.requestId);
    }
    for (const key in this.redpackItemList) {
      const redpackItem = this.redpackItemList[key];

      redpackItem.render(
        (clientX - left) * this.ratio,
        (clientY - top) * this.ratio,
        ({ redpackId, isPointInPath }) => {
          if (typeof this.config.onClick === 'function') {
            if (isPointInPath) {
              delete this.redpackItemList[redpackId];
            }
            this.config.onClick(isPointInPath);
          }
        },
      );
    }
    this.render();
  };

  private fpsBefore = Date.now();
  private render() {
    this.requestId = requestAnimationFramePolyfill(() => {
      this.rainCtx?.clearRect(
        0,
        0,
        this.parentClientRect.width,
        this.parentClientRect.height,
      );
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

  start() {
    // 先停止上一个
    this.stop();
    this.config.selector.addEventListener('click', this.clickListener, false);

    this.createRedpackItem();

    // 创建一个新的红包雨
    this.timer = setInterval(() => {
      if (document.visibilityState === 'hidden' || document.hidden) {
        return;
      }
      this.createRedpackItem();
    }, this.config.interval);
    this.render();
  }
  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    // for (const key in this.redpackItemList) {
    //   const redpackItem = this.redpackItemList[key];

    //   redpackItem.stop();
    // }
    if (this.requestId) {
      cancelAnimationFramePolyfill(this.requestId);
      this.requestId = null;
    }
    this.rainCtx?.clearRect(
      0,
      0,
      this.parentClientRect.width,
      this.parentClientRect.height,
    );
    this.config.selector.removeEventListener('click', this.clickListener);
  }
}
export default RedpackRain;
