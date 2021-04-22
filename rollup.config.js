export default [
  generateConfig('src/misc/service-worker.js', 'dist/build/service-worker.js'),
  generateConfig('src/misc/content-script.js', 'dist/build/content-script.js'),
  generateConfig('src/popup/main.js',          'dist/build/popup.js'),
  generateConfig('src/options/main.js',        'dist/build/options.js')
];

function generateConfig(input, output) {
  return {
    input,
    output: {
      file: output,
      format: 'module',
      sourcemap: true
    },
    watch: {
      clearScreen: false
    }
  };
}
