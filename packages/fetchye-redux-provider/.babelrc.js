const { BABEL_ENV } = process.env
const cjs = BABEL_ENV === 'commonjs'

module.exports = {
  presets: [['amex', { 'preset-env': { modules: cjs && 'commonjs' }, modern: true }]],
}
