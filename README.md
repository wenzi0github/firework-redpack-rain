# 使用 typescript 开发 npm 包的配置模板

## 背景介绍(Background)

[![version](https://img.shields.io/npm/v/gh-qqnews-report?color=brightgreen&style=flat-square)](https://www.npmjs.com/package/gh-qqnews-report)
![size](https://img.shields.io/bundlephobia/min/gh-qqnews-report)

在日常的工作中，经常会有重复性的功能，这里就可以提炼成为一个组件。那么如何将其提炼出来，并发布为 npm 包呢。这个仓库就是提供一个模板。

这是一个纯 typescript 开发的 npm 包，没有 react 和 vue 等框架。

这里的徽章标签可以去 [https://img.shields.io](https://img.shields.io) 生成。

-   集成了 jest 的测试框架，可以直接在**\_\_tests\_\_**的目录编写测试样例。
-   使用 prettier 进行格式化操作，并配合 tslint 进行格式化的检查
-   采用 husky + commitlint 规范 git 的提交信息

## 使用

本模板的安装是从 git 仓库 clone 下来，然后安装 npm 包后，即可进行开发，开箱即用。

### 下载：

```shell
$ git clone https://github.com/wenzi0github/npm-webpack-ts.git ./gh-qqnews-report
```

安装相应的 npm 包：

```shell
$ cd ./gh-qqnews-report
$ npm install --save-dev
```

### 修改 package.json

这里要修改配置文件中的信息了：

```json
{
    "name": "your project name", // 修改为自己项目的英文名
    "version": "0.0.1", // 版本号，建议从0.0.1开始
    "description": "这是一个干什么的仓库", // 描述
    "main": "dist/index.js", // 入口文件是哪个
    "types": "dist/index.d.ts", // typescript的定义入口文件
    "repository": "https://github.com/wenzi0github/npm-webpack-ts.git", // 自己仓库的地址
    "files": ["dist"] // 要把哪些文件发布到npm上
}
```

## readme 模板

你可以按照以下的格式介绍你的仓库的功能。

### 安装(Install)

针对已经开发好的 npm 包，要介绍给用户时，可以这样介绍，我们以`gh-qqnews-report`包为例：

使用 npm:

```shell
$ npm install gh-qqnews-report
```

使用 bower:

```shell
$ bower install gh-qqnews-report
```

使用 yarn:

```shell
$ yarn add gh-qqnews-report
```

使用 jsDelivr 的 CDN 地址:

```html
<script src="https://cdn.jsdelivr.net/npm/gh-qqnews-report"></script>
```

使用 unpkg 的 CDN 地址:

```html
<script src="https://unpkg.com/gh-qqnews-report"></script>
```

### 使用方式(Usage)

这里要提供先直接用一个简单的例子，介绍如何使用。

```javascript
const report = new Report({
    actid: 56, // 每个项目的actid均不相同，请向产品经理确认
});
report.send({
    pagename: "mainpage",
    event_id: "pv",
});
```

### 样例(example)

更多详细的使用方法介绍。

### 维护者(Maintainers)

[wenzi0github](https://github.com/wenzi0github)

### 贡献者(Contributing)

无

### 协议(License)

[MIT](./LICENSE)
