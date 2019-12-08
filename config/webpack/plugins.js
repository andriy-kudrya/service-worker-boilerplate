import webpack from 'webpack'
import HtmlPlugin from 'html-webpack-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import WebpackManifestPlugin from 'webpack-manifest-plugin'

import params from './params'
import paths from './paths'

const define = new webpack.DefinePlugin({
        DEBUG: JSON.stringify(params.debug),
        API: JSON.stringify(params.api),
        SERVICE_WORKER_NAME: JSON.stringify(params.serviceWorkerName),
        ASSET_MANIFEST_FILE_NAME: JSON.stringify(params.assetManifestFileName),
        SW_ID: JSON.stringify(new Date().toISOString()),
        'process.env.NODE_ENV': JSON.stringify(params.debug ? 'development' : 'production'),
    })
    , provide = new webpack.ProvidePlugin({
        trace: ['#/utils/debug', 'trace'],
    })
    , forkTsChecker = new ForkTsCheckerWebpackPlugin({
        tsconfig: paths.tsconfigFile,
        formatter: 'codeframe',
        eslint: true,
        eslintOptions: {
            configFile: paths.eslintConfigFile,
        },
    })


const appPlugins = [
        // new CleanWebpackPlugin(),
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
        new WebpackManifestPlugin({
            fileName: params.assetManifestFileName,
            filter: _ => !_.name.endsWith('.map'),
        }),
        params.analyze && new BundleAnalyzerPlugin({ analyzerMode: 'static', openAnalyzer: false }),
    ].filter(_ => _)
    , swPlugins = [
        new ForkTsCheckerWebpackPlugin({
            tsconfig: paths.tsconfigFileSW,
            formatter: 'codeframe',
            eslint: true,
            eslintOptions: {
                configFile: paths.eslintConfigFile,
            },
        }),
        define,
        provide,
    ]



export { appPlugins, swPlugins }
