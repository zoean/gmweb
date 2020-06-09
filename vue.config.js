// vue.config.js
const path = require('path')
function resolve(dir) {
  return path.join(__dirname, dir)
}
const production = process.env.NODE_ENV === "development"
module.exports = {
  
    //基本根url配置项
    publicPath: process.env.NODE_ENV === "production" ? "/" : "/",
    

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
        open: true,//设置自动打开
        port: 8080,//设置端口
        host: "0.0.0.0",
        proxy: {//配置跨域
            '/smoke_api': {
                target: 'https://testgm.jhwx.com',
                ws: false,
                changOrigin: true,//允许跨域
                pathRewrite: {
                    '^/smoke_api': ''//请求的时候使用这个smoke_api就可以
                }
            }
        }
    },

    pluginOptions: {
      'style-resources-loader': {
        preProcessor: 'less',
        patterns: []
      }
    },

    configureWebpack: config => {
       if(production){
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
