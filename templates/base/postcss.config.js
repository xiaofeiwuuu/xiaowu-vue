module.exports = {
  plugins: {
    'postcss-pxtorem': {
      rootValue: 37.5, // Vant 官方使用的是 37.5
      propList: ['*'],
      selectorBlackList: ['.norem'], // 过滤掉 .norem 开头的 class，不进行 rem 转换
    },
  },
}; 