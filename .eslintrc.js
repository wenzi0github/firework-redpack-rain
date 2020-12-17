module.exports = {
  root: true,
  parser: "@typescript-eslint/parser", //定义ESLint的解析器
  extends: ["plugin:@typescript-eslint/recommended"], //定义文件继承的子规范
  plugins: ["@typescript-eslint"], //定义了该eslint文件所依赖的插件
  env: {
    //指定代码的运行环境
    browser: true,
    node: true,
    es6: true,
  },
  parserOptions: {
    ecmaVersion: 2020,
    ecmaFeatures: {
      legacyDecorators: true,
      experimentalObjectRestSpread: true,
    },
    sourceType: "module",
  },
  rules: {
    eqeqeq: [
      "error",
      "always",
      {
        null: "ignore",
      },
    ],
    "no-console": "off",
    "no-undef": "off",
    "no-unused-vars": "error",
    "no-use-before-define": "error",
    "generator-star-spacing": "off",
    // allow debugger during development
    "no-mixed-spaces-and-tabs": "off",
    indent: ["error", 2, { SwitchCase: 1 }],
    "no-tabs": "off",
    "one-var": "off",
    "one-var-declaration-per-line": ["error", "initializations"],
    "no-var": "error",
    "linebreak-style": ["error", "unix"],
    quotes: ["error", "double"],
    semi: ["error", "always"],
  },
};
