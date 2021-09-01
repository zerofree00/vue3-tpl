// https://github.com/michael-ciniawsky/postcss-load-config
module.exports = {
  plugins: {
    autoprefixer: {
      overrideBrowserslist: ['Android 4.1', 'iOS 7.1', 'Chrome > 31', 'ff > 31', 'ie >= 8']
    },
    'postcss-pxtorem': {
      rootValue: 37.5, //根标签的font-size大小
      unitPrecision: 2, //转换成rem后的小数位数
      propList: ['*'], //需要转换的属性列表
      selectorBlackList: ['html'], //则是一个对css选择器进行过滤的数组，比如你设置为['fs']，那例如fs-xl类名，里面有关px的样式将不被转换，这里也支持正则写法
      replace: true, //默认直接替换属性
      mediaQuery: false,
      minPixelValue: 1.5 //设置小于多少尺寸将不会进行转换。
    }
  }
}
