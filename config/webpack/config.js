import params from './params'
import paths from './paths'
import { appPlugins, swPlugins } from './plugins'
import { appRules, swRules } from './rules'
import devServer from './dev-server'

const config = {
    context: paths.app,
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.local.json', '.json'],
        alias: {
            '#': paths.app,
        },
    },
    mode: params.debug ? 'development' : 'production',
    devtool: 'source-map',
    devServer,
}

export default [
    {
        ...config,
        name: 'app',
        target: 'web',
        entry: {
            app: ['./bootstrap/main'],
        },
        output: {
            path: paths.output,
            publicPath: '/',
            filename: params.debug ? '[name].js' : '[name].[chunkhash].js',
            pathinfo: params.debug,
        },
        module: { rules: appRules },
        plugins: appPlugins,
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
                },
            },
        },
    },
    {
        ...config,
        name: 'sw',
        target: 'webworker',
        entry: {
            [params.serviceWorkerName]: ['./service-worker/main'],
        },
        output: {
            path: paths.output,
            publicPath: '/',
            filename: '[name].js',
            pathinfo: params.debug,
        },
        module: { rules: swRules },
        plugins: swPlugins,
    },
]
