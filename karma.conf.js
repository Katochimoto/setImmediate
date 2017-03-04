module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'sinon-chai'],
    files: [
      { pattern: 'src/**/*.js', included: false },
      'test/spec/**/*.js'
    ],

    preprocessors: {
      'src/**/*.js': ['rollup'],
      'test/spec/**/*.js': ['rollup'],
    },
    rollupPreprocessor: {
      plugins: [
        require('rollup-plugin-babel')({
          exclude: 'node_modules/**',
          babelrc: false,
          presets: [
            'stage-0',
            'es2015-rollup'
          ]
        }),
      ],
      format: 'iife',
      moduleName: 'immediate',
      sourceMap: 'inline'
    },

    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: [ 'PhantomJS' ],
    singleRun: false
  });
};
