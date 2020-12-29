import {
  cancelAnimationFramePolyfill,
  requestAnimationFramePolyfill,
} from '../utils/animationFrame';
import { BubbleProps } from '../config/defaults';

interface RedpackItemProps {
  redpackId: number; // 红包标识
  redpackCtx: CanvasRenderingContext2D;
  bubbleCtx: CanvasRenderingContext2D;
  x: number; // 起始坐标x
  y: number; // 起始坐标y
  redpackImgUrl: string; // 图片地址
  width: number;
  height: number;
  speedMin: number;
  speedMax: number;
  bubble: BubbleProps;
  containerHeight: number;
  onDestoryed: (id: number) => void;
}

class RedpackItem {
  redpackId = -1; // 当前标识
  requestId = -1; // 动画的标识，用于清除动画
  x = 0;
  y = 0;
  speed = 1;
  redpackCtx: CanvasRenderingContext2D | null = null;
  bubbleCtx: CanvasRenderingContext2D | null = null;
  width = 0;
  height = 0;
  bubbleConfig: BubbleProps | null = null;
  redpackImgUrl = '';
  redpackImg: HTMLImageElement | null = null;
  containerHeight = 0;
  onDestoryed: ((id: number) => void) | null = null;
  angle = 0;
  ratio = 1;

  constructor({
    redpackId,
    redpackCtx,
    bubbleCtx,
    x,
    y,
    redpackImgUrl,
    width,
    height,
    speedMax,
    speedMin,
    bubble,
    containerHeight,
    onDestoryed,
  }: RedpackItemProps) {
    this.redpackId = redpackId;
    this.redpackCtx = redpackCtx;
    this.bubbleCtx = bubbleCtx;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = (speedMax - speedMin) * Math.random() + speedMin;
    this.redpackImgUrl = redpackImgUrl;
    this.containerHeight = containerHeight;
    this.onDestoryed = onDestoryed;
    this.bubbleConfig = bubble;

    const random = Math.random();
    const angle = ((random * 30 + 10) * Math.PI) / 180;
    this.angle = random < 0.5 ? angle : 0 - angle;
    this.ratio = random * 0.6 + 0.6;
  }

  async start() {
    this.redpackImg = await this.loadImage(this.redpackImgUrl);
    this.render();
  }

  // 加载图片
  loadImage(imgUrl: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = imgUrl;
      if (img.complete) {
        return resolve(img);
      }
      img.onload = () => {
        resolve(img);
      };
      img.onerror = reject;
    });
  }

  render() {
    const { redpackCtx } = this;
    if (!redpackCtx || !this.redpackImg) {
      return;
    }

    // 先清除当前位置
    // this.clear();
    if (this.y < this.containerHeight) {
      // 绘制下一个位置
      const nextx = this.x;
      const nexty = this.y + this.speed;

      redpackCtx.save();
      redpackCtx.beginPath();
      redpackCtx.rect(nextx, nexty, this.width, this.height);
      redpackCtx.translate(nextx + this.width / 2, nexty + this.height / 2);
      redpackCtx.scale(this.ratio, this.ratio);
      redpackCtx.rotate(this.angle);
      redpackCtx.drawImage(
        this.redpackImg,
        -this.width / 2,
        -this.height / 2,
        this.width,
        this.height,
      );
      redpackCtx.strokeStyle = 'transparent';
      redpackCtx.stroke();
      redpackCtx.restore();
      this.y = nexty;
    } else {
      // 超过边界，回调改元素被销毁的事件
      if (typeof this.onDestoryed === 'function') {
        this.onDestoryed(this.redpackId);
      }
    }
  }

  // 添加气泡
  async addBubble() {
    if (!this.bubbleCtx || !this.bubbleConfig) {
      return;
    }
    const { imgUrl, width, height, opacitySpeed, speed } = this.bubbleConfig;
    const bubbleImg = await this.loadImage(imgUrl);

    const nextx = this.x;
    let nexty = this.y;

    let alpha = 1;
    const bbs = () => {
      alpha -= opacitySpeed;
      if (!this.bubbleCtx) {
        return;
      }
      this.bubbleCtx.clearRect(nextx - 10, nexty - 10, width + 20, height + 20);

      if (alpha > 0) {
        this.bubbleCtx.save();
        this.bubbleCtx.globalAlpha = alpha;

        nexty -= speed;
        this.bubbleCtx.drawImage(bubbleImg, nextx, nexty, width, height);
        this.bubbleCtx.restore();
        requestAnimationFramePolyfill(bbs);
      }
    };

    requestAnimationFramePolyfill(bbs);
  }

  stop() {
    cancelAnimationFramePolyfill(this.requestId);
  }
}
export default RedpackItem;
