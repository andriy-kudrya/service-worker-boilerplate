import path from 'path'
import params from './params'

const root = path.join(__dirname, '..', '..')
    , src = path.join(root, 'src')
    , app = path.join(src, 'app')
    , sw = path.join(src, 'sw')
    , assets = path.join(root, 'assets')
    , output = path.join(root, 'dist')
    , config = path.join(root, 'config')
    , eslintConfigFile = path.join(config, 'eslint', params.debug ? 'dev.eslintrc.json' : 'prod.eslintrc.json')
    , tsconfigFile = path.join(src, 'tsconfig.json')
    , tsconfigFileSW = path.join(sw, 'tsconfig.json')

export default {
    root,
    src,
    app,
    sw,
    output,
    assets,
    eslintConfigFile,
    tsconfigFile,
    tsconfigFileSW,
}
