var gulp = require('gulp'),
  sass = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  minCss = require('gulp-clean-css'),
  server = require('gulp-webserver'),
  querystring = require('querystring')

var mock = require('./public/mock')

var userList = [
  {
    user: 'jack',
    pwd: '123',
    isLogin: false
  }
]

gulp.task('css', function() {
  gulp
    .src('./public/sass/user/*.scss')
    .pipe(sass())
    .pipe(
      autoprefixer({
        browsers: ['last 2 versions', 'Android >= 4.0']
      })
    )
    .pipe(minCss())
    .pipe(gulp.dest('./public/css'))
})

gulp.task('watch', function() {
  gulp.watch('./public/sass/user/*.scss', ['css'])
})

gulp.task('server', ['css'], function() {
  gulp.src('./public').pipe(
    server({
      port: 8080,
      open: false,
      livereload: true,
      middleware: function(req, res, next) {
        if (/\/api/g.test(req.url)) {
          req.url = decodeURI(req.url)
          //req.url=querystring.unescape(req.url);
          var data = mock(req.url)
          res.end(JSON.stringify(data))
        } else if (req.url == '/login') {
          var reqArr = []
          req.on('data', function(chunck) {
            reqArr.push(chunck)
          })
          req.on('end', function() {
            var str = Buffer.concat(reqArr).toString()
            var json = querystring.parse(str)
            var flag = false
            console.log(json)
            userList.forEach(function(item, index) {
              if (item.user == json.user && item.pwd == json.pwd) {
                item.isLogin = true
                flag = true
                res.end(
                  JSON.stringify({
                    code: 0,
                    msg: '登录成功'
                  })
                )
              }
            })
            if (!flag) {
              res.end(
                JSON.stringify({
                  code: 1,
                  msg: '登录失败'
                })
              )
            }
            next()
          })
        }
        next()
      }
    })
  )
})

gulp.task('default', ['watch', 'server'])
