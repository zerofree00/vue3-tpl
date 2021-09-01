// vue.config.js
const path = require('path')
const resolve = dir => path.join(__dirname, dir)

const vConsolePlugin = require('vconsole-webpack-plugin')
// 生成文件压缩包
const FileManagerPlugin = require('filemanager-webpack-plugin')

// 配置打包出来的名字
const outputDirName = 'dist'

// 获取 ip
const os = require('os')

let localhost = getNetworkIp()

module.exports = {
  publicPath: './', // 基本路径
  outputDir: 'dist/' + outputDirName, // 输出文件目录
  devServer: {
    open: true,
    host: localhost,
    port: '8080',
    disableHostCheck: true,
    proxy: {
      '/apis': {
        target: 'http://192.168.2.220:9008/twoaR6',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/apis': ''
        }
      }
    }
  },
  // eslint-loader 是否在保存的时候检查
  lintOnSave: true,
  // 超出隐藏
  transpileDependencies: ['vant'],
  // 去除map文件
  productionSourceMap: false,
  configureWebpack: config => {
    //生产环境去掉vconsole调试器
    let pluginsDev = [
      new vConsolePlugin({
        filter: [],
        // enable: false
        enable: process.env.NODE_ENV !== 'production'
      })
    ]

    if (process.env.NODE_ENV === 'production') {
      /* 生成 复制版本号文件， 并压缩文件 */
      config.plugins.push(
        new FileManagerPlugin({
          onStart: {
            delete: ['./*.zip', './dist']
          },
          onEnd: {
            archive: [
              {
                source: `./dist/${outputDirName}`,
                destination: `./dist/${outputDirName}.zip`
              }
            ]
          }
        })
      )
      // vue cli4取消生成环境console
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
    }

    config.plugins = [...config.plugins, ...pluginsDev]
  },
  chainWebpack: config => {
    config.resolve.alias
      .set('@$', resolve('src'))
      .set('assets', resolve('src/assets'))
      .set('utils', resolve('src/assets/utils'))
      .set('api', resolve('src/api'))
      .set('components', resolve('src/components'))
      .set('stylus', resolve('src/assets/stylus'))
      .set('view', resolve('src/view'))
      .set('viewOavr', resolve('src/view/oavr'))

    // 压缩代码
    config.optimization.minimize(true)
    config.when(process.env.NODE_ENV !== 'development', config => {
      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          libs: {
            name: 'chunk-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial' // only package third parties that are initially dependent
          },
          Vant: {
            name: 'chunk-Vant',
            priority: 20,
            test: /[\\/]node_modules[\\/]_?vant(.*)/
          },
          commons: {
            name: 'chunk-commons',
            test: resolve('src/components'), // can customize your rules
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true
          }
        }
      })
      config.optimization.runtimeChunk('single')
    })
  }
}
// 获取 本机ip，打开直接是ip地址访问
function getNetworkIp() {
  let needHost = '' // 打开的host
  try {
    // 获得网络接口列表
    let network = os.networkInterfaces()
    for (let dev in network) {
      let iface = network[dev]
      for (let i = 0; i < iface.length; i++) {
        let alias = iface[i]
        if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
          needHost = alias.address
        }
      }
    }
  } catch (e) {
    needHost = '0.0.0.0'
  }
  return needHost
}
