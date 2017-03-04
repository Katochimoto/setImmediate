import RollupPluginNodeResolve from 'rollup-plugin-node-resolve';
import RollupPluginCommonJS from 'rollup-plugin-commonjs';
import RollupPluginFilesize from 'rollup-plugin-filesize';
import RollupPluginBabel from 'rollup-plugin-babel';
import RollupPluginMinify from 'rollup-plugin-minify'

export default {
  entry: 'src/index.js',
  dest: 'dist/setImmediate.js',
  format: 'umd',
  sourceMap: true,
  useStrict: true,
  context: 'window',
  moduleName: 'immediate',
  plugins: [
    RollupPluginBabel({
      exclude: 'node_modules/**',
      babelrc: false,
      presets: [
        'stage-0',
        'es2015-rollup'
      ]
    }),
    RollupPluginNodeResolve({
      jsnext: true,
      module: true,
      main: true,
      browser: true
    }),
    RollupPluginCommonJS({
      include: 'node_modules/**'
    }),
    RollupPluginMinify({
      umd: 'dist/setImmediate.min.js'
    }),
    RollupPluginFilesize()
  ]
};
