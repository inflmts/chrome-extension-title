export default [
  // The service worker apparently only works if you put it in the extension root directory
  generateConfig('src/misc/service-worker.js', 'dist/service-worker.js'),
  generateConfig('src/misc/content-script.js', 'dist/build/content-script.js'),
  generateConfig('src/popup/main.js',          'dist/build/popup.js'),
  generateConfig('src/options/main.js',        'dist/build/options.js')
];

function generateConfig(input, output) {
  return {
    input,
    output: {
      file: output,
      format: 'module'
    },
    watch: {
      clearScreen: false
    }
  };
}
