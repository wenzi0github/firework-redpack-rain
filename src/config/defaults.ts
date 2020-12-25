// 每个红包的配置
interface RedpackRainItem {
  speedMin: number;
  speedMax: number;
  imgUrl: string;
  width: number;
  height: number;
}

interface BubbleProps {
  imgUrl: string;
  width: number;
  height: number;
  speed: number;
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
  interval: 2000,
  redpack: {
    speedMin: 80,
    speedMax: 100,
    imgUrl: 'https://sola.gtimg.cn/aoi/sola/20201225104146_Re9xFvzIuc.png',
    width: 80,
    height: 100,
  },
  bubble: {
    imgUrl: 'https://sola.gtimg.cn/aoi/sola/20201225103914_2QQ9bXg2rU.png',
    width: 30,
    height: 15,
    speed: 2,
  },
  onClick: () => {
    /* isHit */
  },
};
export default defaultsConfig;
