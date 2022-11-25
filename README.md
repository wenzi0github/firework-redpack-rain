# 烟火活动的红包雨

这里主要存放的是源码，构建好的包已经发布在内网了。

[如何打造一款高可用的全屏红包雨](https://www.xiabingbao.com/post/canvas/canvas-redpackrain.html)。

## 引入

```shell
$ npm i @tencent/firework-redpack-rain
```

## 样例

您可以访问[http://firework-redpack-rain.pages.oa.com](http://firework-redpack-rain.pages.oa.com)，查看样例。

## 使用

简要使用：

```javascript
import RedpackRain from '@tencent/firework-redpack-rain';

const rain = new RedpackRain({
  selector: '.rain-container', // 要嵌入的容器
  onClick(isHited) {
    // 点击回调，只要点击就会回调，isHited为boolean类型，表示是否击中红包
    console.log(isHited);
  },
});
rain.start(); // 红包雨开始

setTimeout(function () {
  rain.stop(); // 红包雨结束
}, 6000);
```

在 react 中使用：

```javascript
function App() {
  const rainRef = (useRef < null) | (RedpackRain > null);
  useEffect(() => {
    const rain = new RedpackRain({
      selector: '.rain-container',
    });
    rainRef.current = rain;
    rain.start();

    return () => rain.stop();
  }, []);

  const handleStopClick = () => {
    if (rainRef.current) {
      rainRef.current.stop();
    }
  };

  return (
    <div className="App">
      <button onClick={handleStopClick}>停止</button>
      <div className="rain-container"></div>
    </div>
  );
}
```

## 实例方法说明

实例有 3 个方法。

### start

初始化实例后，并不会立刻启动红包雨，而是执行`start()`后，才开始下红包雨。

### stop

调用`stop()`方法后，即停止下红包雨，并清空 canvas 面板。

### setOptions

可以在下红包雨的过程中，修改配置，需要注意的是：

1. 该方法需要在 start()之后和 stop()之前才能调用，即在下红包雨的过程中才有效；
2. 新的配置只会对后续新产生的的红包有影响，之前已产生红包依然使用之前的配置；

输入的参数与初始化时的参数几乎一样（除了无法设置 selector 外，其他的参数均可以重新设置）；而且，二级配置中也可以只设置部分参数；如下面的配置中，redpack 配置中有多个参数，我们可以只设置 speedMin 和 speedMax 两个参数即可。

```javascript
rain.setOptions({
  interval: 800, // 修改红包产生的时间间隔，单位毫秒
  redpack: {
    speedMin: 40, // 红包下降速度的下限
    speedMax: 40, // 红包下降速度的上限
  },
});
```

其他参数，可以参照下面的`参数说明`。

## 参数说明

`RedpackRain`是一个类，在构建实例时，除`selector`外，其他均为非必须参数。

| 参数                | 是否必填 | 类型                         | 默认值 | 说明                                                 |
| ------------------- | -------- | ---------------------------- | ------ | ---------------------------------------------------- |
| selector            | 是       | string \| HTMLElement        |        | 要渲染红包雨的容器<br/>可以是选择器也可以是 dom 元素 |
| interval            | 否       | number                       | 1600   | 下红包雨的间隔，单位毫秒                             |
| onClick             |          | function(isHited: boolean){} | 空     | 整个红包雨区域的点击，isHited 表示是否命中红包       |
| onMonitor           |          | function({fps}){}            | 空     | 红包雨的 fps 监控                                    |
| redpack             | 否       |                              |        | 红包配置                                             |
| redpack.speedMin    | 否       | number                       | 10     | 红包下降速度的最小值                                 |
| redpack.speedMax    | 否       | number                       | 10     | 红包下降速度的最大值                                 |
| redpack.imgUrl      | 否       | string                       |        | 红包的图片                                           |
| redpack.width       |          | number                       | 192    | 红包的宽度                                           |
| redpack.height      |          | number                       | 216    | 红包的高度                                           |
| bubble              |          |                              |        | 命中红包后的上升气泡的配置                           |
| bubble.imgUrl       |          | string                       |        | 气泡的图片                                           |
| bubble.width        |          | number                       | 156    | 气泡的宽度                                           |
| bubble.height       |          | number                       | 111    | 气泡的高度                                           |
| bubble.speed        |          | number                       | 5      | 气泡每帧上升的高度                                   |
| bubble.opacitySpeed |          | number                       | 0.04   | 气泡每帧减少的透明度                                 |

使用方式：

```javascript
const rain = new RedpackRain({
  selector: document.body,
  interval: 1600,
  redpack: {
    speedMin: 10,
    speedMax: 10,
    imgUrl: 'https://sola.gtimg.cn/aoi/sola/20201226100322_I1ltnkzJVc.png',
    width: 126,
    height: 174,
  },
  bubble: {
    imgUrl: 'https://sola.gtimg.cn/aoi/sola/20201225103914_2QQ9bXg2rU.png',
    width: 156,
    height: 111,
    speed: 5,
    opacitySpeed: 0.04,
  },
  onClick: (isHited) => {
    console.log(isHited);
  },
  onMonitor(monitors) {
    console.log(monitors);
  },
});
```
