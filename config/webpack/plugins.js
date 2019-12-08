import webpack from 'webpack'
import HtmlPlugin from 'html-webpack-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'

import params from './params'
import paths from './paths'

const forkTsChecker = new ForkTsCheckerWebpackPlugin({
        tsconfig: paths.tsconfigFile,
        formatter: 'codeframe',
        eslint: true,
        eslintOptions: {
            configFile: paths.eslintConfigFile,
        },
    })
    , define = new webpack.DefinePlugin({
        DEBUG: JSON.stringify(params.debug),
        API: JSON.stringify(params.api),
        SERVICE_WORKER_NAME: JSON.stringify(params.serviceWorkerName),
        'process.env.NODE_ENV': JSON.stringify(params.debug ? 'development' : 'production'),
    })
    , provide = new webpack.ProvidePlugin({
        trace: ['#/utils/debug', 'trace'],
    })


const appPlugins = [
        forkTsChecker,
        define,
        provide,
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: 'styles-[id].css',
            // filename: params.debug ? '[name].css' : '[name].[chunkhash:4].css',
            // chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
        }),
        new HtmlPlugin({
            filename: 'index.html',
            template: `${paths.assets}/index.html`,
        }),
        params.analyze && new BundleAnalyzerPlugin({ analyzerMode: 'static', openAnalyzer: false }),
        new CleanWebpackPlugin(),
    ].filter(_ => _)
    , swPlugins = [
        forkTsChecker,
        define,
        provide,
    ]



export { appPlugins, swPlugins }
