// vue.config.js
const path = require('path')
function resolve(dir) {
  return path.join(__dirname, dir)
}
module.exports = {

    lintOnSave: false,
  
    // //基本根url配置项
    publicPath: process.env.NODE_ENV === "production" ? "./" : "./",

    //build构建后生成的文件夹
    outputDir: 'dist',

    //静态资源目录
    assetsDir: 'static',

    indexPath: 'index.html',
    filenameHashing: true,
    productionSourceMap: false,

    css: {
        extract: false, // 是否使用css分离插件 ExtractTextPlugin
        sourceMap: false, // 开启 CSS source maps?
        loaderOptions: {}, // css预设器配置项
        modules: false // 启用 CSS modules for all css / pre-processor files.
      },

    devServer: {
        disableHostCheck: true,
        open: true,//设置自动打开
        port: 8080,//设置端口
        host: "0.0.0.0",
        proxy: {//配置跨域
          '/lovestudy': {
            target: process.env.VUE_APP_JHWX,
            ws: false,
            changOrigin: true,//允许跨域
            pathRewrite: {
                '^/lovestudy': '/lovestudy'
            }
          },
          '/api': {
              target: process.env.VUE_APP_GM_JHWX,
              ws: false,
              changOrigin: true,//允许跨域
              pathRewrite: {
                  '^/api': '/api'//请求的时候使用这个api就可以
              }
          },
          '/order-service': {
            target: process.env.VUE_APP_GM_JHWX,
            ws: false,
            changOrigin: true,//允许跨域
            pathRewrite: {
                '^/order-service': '/order-service'
            }
          },
          '/upload-service': {
            target: process.env.VUE_APP_GM_JHWX,
            ws: false,
            changOrigin: true,//允许跨域
            pathRewrite: {
                '^/upload-service': '/upload-service'
            }
          },
          '/sx_api': {
            target: process.env.VUE_APP_SX_JHWX,
            ws: false,
            changOrigin: true,//允许跨域
            pathRewrite: {
                '^/sx_api': '/'
            }
          },
          '/edu_api': {
            target: process.env.VUE_APP_EDU_JHWX,
            ws: false,
            changOrigin: true,//允许跨域
            pathRewrite: {
                '^/edu_api': '/'
            }
          },
          '/onelogin': {
            target: process.env.VUE_APP_WWW_JHWX,
            ws: false,
            changOrigin: true,//允许跨域
            pathRewrite: {
                '^/onelogin': '/'
            }
          },
          '/file_api': {
            target: process.env.VUE_APP_FILE_JHWX,
            ws: false,
            changOrigin: true,//允许跨域
            pathRewrite: {
                '^/file_api': '/'
            }
          },
        }
    },

    pluginOptions: {
      'style-resources-loader': {
        preProcessor: 'less',
        patterns: []
      }
    },

    configureWebpack: config => {
       if(process.env.NODE_ENV == 'production'){
         config.devtool = 'source-map'
       }
    },
    chainWebpack(config) {
      config.module
        .rule('svg')
        .exclude.add(resolve('src/icons'))
        .end()
      config.module
        .rule('icons')
        .test(/\.svg$/)
        .include.add(resolve('src/icons'))
        .end()
        .use('svg-sprite-loader')
        .loader('svg-sprite-loader')
        .options({
          symbolId: 'icon-[name]'
        })
        .end()
    }
}
