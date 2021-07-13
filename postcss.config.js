/* px转换成rem的配置 */
module.exports = {
  plugins: {
    autoprefixer: {
      //这个配置没有问题，但是编译控制台会报警告，因为vue-cli是通过.browserslistrc配置的
      //browsers: ['Android >= 4.0', 'iOS >= 8'],
    },
    'postcss-pxtorem': {
      rootValue: 37.5,
      //需要转换的css属性
      propList: ['*'],
    },
  },
};