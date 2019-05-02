var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
// 下面这四个插件没有什么用了
var ExtractTextPlugin = require('extract-text-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

const components = require('../components')
console.log('============', components)

// 这里如果不是测试环境，就改成我们自己的打包环境
//  暂时这个测试的我还不会，但是看到开源框架都安装了这个unit测试
// 所以这里暂时不用理会其他的。环境变量先改成我们自己的就好
var env = process.env.NODE_ENV === 'testing'
  ? require('../config/test.env')
  : config.buildProdLib.env

// 该模块下由于咱们是打成js包,所以很多文件都不需要生成和处理
// 这里啰嗦一句，从配置本地预览开发环境和打包环境 都是覆盖了baseWebpackConfig中的入口和输出目录
// 所以建议直接把baseWebpackConfig中的entry和output移除
var webpackConfig = merge(baseWebpackConfig, {
  entry: {
    'cloud-form': './src/components/form/CloudForm.vue',
    'cloud-table': './src/components/table/CloudTable.vue',
    'cloud-table-crud': './src/components/table/CloudTableCRUD.vue'
  },
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true
    })
  },
  // devtool: config.build.productionSourceMap ? '#source-map' : false,
  output: {
    path: config.buildProdLib.assetsRoot,
    // 再次增加一个变量目录
    publicPath: config.buildProdLib.assetsPublicPath,
    // 库文件名，同样我们需要把这两个都写到配置里面去
    filename: config.buildProdLib.filename,
    // 库名称
    library: config.buildProdLib.library,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  // 增加一个配置，在iview中定义的，百度说是支持不同的加载方式
  externals: {
    vue: {
      root: 'Vue',
      commonjs: 'vue',
      commonjs2: 'vue',
      amd: 'vue'
    }
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: true, // Must be set to true if using source-maps in production
        terserOptions: {
          // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
        }
      })
    ]
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': env
    }),
    // extract css into its own file
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].css')
    })
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    // new OptimizeCSSPlugin({
    //   cssProcessorOptions: {
    //     safe: true
    //   }
    // }),
    // 这里的HtmlWebpackPlugin插件用不到了，直接删除掉了
    // 下面的插件也是用不到的了
    // split vendor js into its own file
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'vendor',
    //   minChunks: function (module, count) {
    //     // any required modules inside node_modules are extracted to vendor
    //     return (
    //       module.resource &&
    //       /\.js$/.test(module.resource) &&
    //       module.resource.indexOf(
    //         path.join(__dirname, '../node_modules')
    //       ) === 0
    //     )
    //   }
    // }),
    // 这个配置应该是压缩js的

  ]
})

// 这个压缩没有什么用了
// if (config.build.productionGzip) {
//   var CompressionWebpackPlugin = require('compression-webpack-plugin')
//
//   webpackConfig.plugins.push(
//     new CompressionWebpackPlugin({
//       asset: '[path].gz[query]',
//       algorithm: 'gzip',
//       test: new RegExp(
//         '\\.(' +
//         config.build.productionGzipExtensions.join('|') +
//         ')$'
//       ),
//       threshold: 10240,
//       minRatio: 0.8
//     })
//   )
// }
// npm run build:prodLib --report  显示构建报表
if (config.buildProdLib.bundleAnalyzerReport) {
  var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}
console.log(webpackConfig)
module.exports = webpackConfig
