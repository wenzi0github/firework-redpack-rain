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
  }

  async start() {
    this.redpackImg = await this.loadImage(this.redpackImgUrl);
    this.run(-1, -1);
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

  /**
   * 运动
   * @param clientX 点击的坐标
   * @param clientY 点击的坐标
   * @param callback 回调
   */
  run(
    clientX = -1,
    clientY = -1,
    callback?: (props: { redpackId: number; isPointInPath: boolean }) => void,
  ) {
    if (clientX > -1 && clientY > -1) {
      // isPointInPath只能检测最后一个添加到画布上的元素，因此会将当前元素先删了
      // 然后再追加到画布里，再检测点击区域
      this.clear();
    }
    this.requestId = requestAnimationFramePolyfill(() => {
      if (!this.redpackCtx || !this.redpackImg) {
        return;
      }

      // 先清除当前位置
      this.redpackCtx.clearRect(
        this.x - 3,
        this.y - 3,
        this.width + 6,
        this.height + 6,
      );
      if (this.y < this.containerHeight) {
        // 绘制下一个位置
        const nextx = this.x;
        const nexty = this.y + this.speed;
        this.redpackCtx.beginPath();
        this.redpackCtx.rect(nextx, nexty, this.width, this.height);
        this.redpackCtx.drawImage(
          this.redpackImg,
          nextx,
          nexty,
          this.width,
          this.height,
        );
        this.redpackCtx.strokeStyle = 'transparent';
        this.redpackCtx.stroke();
        this.y = nexty;

        const isPointInPath = this.redpackCtx.isPointInPath(clientX, clientY);
        if (typeof callback === 'function' && clientX > -1 && clientY > -1) {
          callback({
            redpackId: this.redpackId,
            isPointInPath,
          });
        }
        if (isPointInPath) {
          // 点击命中
          this.clear();
          this.addBubble();
        } else {
          this.run(-1, -1);
        }
      } else {
        // 超过边界，回调改元素被销毁的事件
        if (typeof this.onDestoryed === 'function') {
          this.onDestoryed(this.redpackId);
        }
      }
    });
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
      this.bubbleCtx.clearRect(nextx, nexty, width, height);

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

  clear() {
    cancelAnimationFramePolyfill(this.requestId);
    this.redpackCtx?.clearRect(
      this.x - 3,
      this.y - 3,
      this.width + 6,
      this.height + 6,
    );
  }
}
export default RedpackItem;
