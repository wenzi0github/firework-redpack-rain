// 每个红包的配置
interface RedpackRainItem {
  speedMin: number;
  speedMax: number;
  imgUrl: string[];
  width: number;
  height: number;
}

export interface BubbleProps {
  imgUrl: string;
  width: number;
  height: number;
  speed: number;
  opacitySpeed: number;
}

interface RedpackRainProps {
  selector: HTMLElement;
  interval: number;
  redpack: RedpackRainItem;
  bubble: BubbleProps;
  onClick?: (isHit: boolean) => void;
}

const defaultsConfig: RedpackRainProps = {
  selector: document.body,
  interval: 1600,
  redpack: {
    speedMin: 10,
    speedMax: 10,
    imgUrl: [
      'https://sola.gtimg.cn/aoi/sola/20201225104146_Re9xFvzIuc.png',
      'https://sola.gtimg.cn/aoi/sola/20201214112804_3fZjO9VCOV.png',
    ],
    width: 192,
    height: 216,
  },
  bubble: {
    imgUrl: 'https://sola.gtimg.cn/aoi/sola/20201225103914_2QQ9bXg2rU.png',
    width: 156,
    height: 111,
    speed: 5,
    opacitySpeed: 0.04,
  },
  onClick: () => {
    /* isHit */
  },
};
export default defaultsConfig;
