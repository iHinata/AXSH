const conf = require('./gulp.conf');
var proxy = require('http-proxy-middleware');
var api = proxy('/appsummary', {target: 'http://172.20.6.183:9998/', changeOrigin: true});


module.exports = function () {
  return {
    server: {
      baseDir: [
        conf.paths.tmp,
        conf.paths.src
      ],
      middleware: []
    },
    open: false
  };
};
