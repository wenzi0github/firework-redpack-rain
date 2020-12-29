## 1.0.8

- fix: 修复调用 setOptions 修改参数时，会产生多个 visibilityChange 事件，进而导致产生多个 setInterval；

## 1.0.7

- fix: 添加一个 clear()方法，仅擦除面板，但还保留数据，便于用于修改 interval 参数；

## 1.0.6

- feat: 添加 setOptions 方法，可以在下红包雨的过程中修改后续红包的行为；
- fix: 当调用 stop()方法后应当清除之前存储的红包数据；

## 1.0.5

- fix: 添加坐标判断，提高点击的精度；
- fix: 调整红包产生的位置，只在距离屏幕边缘 redpackWidth 的中间位置产生红包；
- feat: 添加 touchstart 类型；

## 1.0.2

- feat: 将每个红包的 requestAnimationFrame 提升到主流程中；
- feat: 添加 fps 的监控；
- fix: 页面不可见时不创建新的红包；
