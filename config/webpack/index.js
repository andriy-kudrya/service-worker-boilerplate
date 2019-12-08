// glorify node with es modules
require('@babel/register')({
    plugins: ['@babel/plugin-transform-modules-commonjs']
})

module.exports = function (env) {
    require('./params').initParams(env)

    return require('./config.js')
}
