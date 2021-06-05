const path = require("path");
const CompressionPlugin = require("compression-webpack-plugin");
function resolve(dir) {
    return path.join(__dirname, dir);
}

module.exports = {
    publicPath:'.',
    productionSourceMap:false,
    chainWebpack: config => {  //路径简写
        config.resolve.alias
            .set("@", resolve("src"))
            .set("assets", resolve("src/assets"))
            .set("components", resolve("src/components"))
            .set("views", resolve("src/views"))

        config.optimization.minimizer('terser').tap(options => {
            options[0].terserOptions.compress.drop_console = true
            return options
        })

        config.plugins.delete('prefetch')
        config.plugins.delete('preload')
    },
    configureWebpack: config => {
        if (process.env.NODE_ENV === 'production') {
            return {
                plugins:[new CompressionPlugin({
                    test:/\.js$|\.html$|\.css/,
                    threshold:4096,
                    deleteOriginalAssets:false
                })]
            }
        }
    }
}
