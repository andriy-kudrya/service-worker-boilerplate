import params from './params'
import paths from './paths'
import plugins from './plugins'
import rules from './rules'
import devServer from './dev-server'

const config = {
    context: paths.app,
    entry: {
        app: ['./bootstrap/main']
    },
    output: {
        path: paths.output,
        publicPath: '/',
        filename: params.debug ? '[name].js' : '[name].[chunkhash].js',
        pathinfo: params.debug
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.local.json', '.json'],
        alias: {
            '#': paths.app
        }
    },
    module: { rules },
    plugins,
    mode: params.debug ? 'development' : 'production',
    devtool: 'source-map',
    devServer,
    optimization: {
        noEmitOnErrors: true,
        runtimeChunk: { name: 'manifest' },
        splitChunks: {
            minSize: 0,
            cacheGroups: {
                vendor: {
                    chunks: 'all',
                    test: /node_modules/,
                    name: 'vendor',
                    // priority: 10,
                    enforce: true,
                },
            }
        }
    },
}

export default config
