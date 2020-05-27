# 使用 typescript 开发 npm 包的配置模板

这是一个纯 typescript 开发的 npm 包，没有 react 和 vue 等框架。

```shell
npm run build
```

### 测试

并且集成了 jest 框架的测试功能，执行以下的命令即可：

```shell
npm run test
```

### 格式化

这里使用 prettier 进行格式化操作，并配合 tslint 进行格式化的检查。

### 规范提交信息

采用 husky + commitlint 规范 git 的提交信息。
