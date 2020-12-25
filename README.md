# 烟火活动的红包雨

## 引入

```shell
$ npm i @tencent/firework-redpack-rain
```

## 使用

简要使用：

```javascript
import RedpackRain from '@tencent/firework-redpack-rain';

const rain = new RedpackRain({
  selector: '.rain-container', // 要嵌入的容器
  onClick(isHited) { // 点击回调，只要点击就会回调，isHited为boolean类型，表示是否击中红包
    console.log(isHited);
  }
});
rain.start(); // 红包雨开始

rain.stop(); // 红包雨结束
```
