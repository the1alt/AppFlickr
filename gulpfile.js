var gulp = require('gulp');
var browserSync = require('browser-sync');

// Rafraichissement du browser
var reload = browserSync.reload;

var minifyCss = require('gulp-minify-css');
var concatCss = require('gulp-concat-css');
var notify = require("gulp-notify");
var autoprefixer = require('gulp-autoprefixer');
var sass = require('gulp-sass');
var uglify = require("gulp-uglify");
var concat = require('gulp-concat');
var size = require('gulp-size');
var sourcemaps = require('gulp-sourcemaps');
var uncss = require('gulp-uncss');




// task browser-sync qui permet de configurer au lancement browser-sync
gulp.task('browser-sync', function() {
    browserSync({
        port: 3000,
        server: {
            baseDir: "./", //base
            index: "index.html" //fichier a chargé
        }
    });
});



// Création d'une tâche "default"
// Au lancement de default, la tache browser-Sync va se lancer
gulp.task('default',['browser-sync', 'css', 'sass', 'js', 'html',],function(){
  var s = size();
  gulp.watch('./css/*.css',['css']);
  gulp.watch('./sass/**/*.scss',['sass']);
  gulp.watch('./js/*.js', ['js']);
  gulp.watch('./*.html', ['html']);




  //watch permet de "watcher", observer les changements de fichiers css du dossier css et de relancer la tâche "css"
  console.log('Ma tâche par défault...');
});


gulp.task('css',function(){
   console.log('Ma tâche pour le css...');

   return gulp.src('./css/*.css')
   .pipe(autoprefixer({
     browsers:['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'],
    cascade:false}))
   .pipe(concatCss('bundle.css'))//concaténation en 1 seul fichier
   .pipe(minifyCss()) //compression de la css
   .pipe(gulp.dest('dist/css/')) // permet d'envoyer le fichier minifier dans le répertoire dist/css
   .pipe(notify("css compressée et concatenée !"))
   .pipe(reload({stream:true, once:true})); //je relance mon navigateur quand ma tâche css est accomplie : permet de rafraîchir mon navigateur
});

gulp.task('sass',function(){
   console.log('Ma tâche pour le sass...');

   return gulp.src('./sass/*.scss')
   .pipe(sourcemaps.init())
   .pipe(sass().on('error', sass.logError)) //compiler du sass en css
   .pipe(autoprefixer({
     browsers:['>1%','IE 7', 'Firefox <= 20', 'iOS 7']
   }))
   .pipe(concat('bundle-sass.css'))//concaténation en 1 seul fichier
   .pipe(minifyCss()) //compression de la css
  //  .pipe(uncss({
  //           html: ['index.html', 'posts/**/*.html']}))
   .pipe(sourcemaps.write('.'))
   .pipe(gulp.dest('./dist/css/')) // permet d'envoyer le fichier minifier dans le répertoire dist/css
   .pipe(notify("Sass compressée et concatenée !"))
   .pipe(reload({stream:true, once:true})); //je relance mon navigateur quand ma tâche css est accomplie : permet de rafraîchir mon navigateur

});

gulp.task('js',function(){
  return gulp.src('./js/*.js')
  .pipe(concat('app.min.js'))//concaténation en 1 seul fichier
  // .pipe(uglify()) //minify js
  .pipe(gulp.dest('./dist/js/')) // permet d'envoyer le fichier minifier dans le répertoire dist/css
  .pipe(notify("JS modifié !"))
  .pipe(reload({stream:true, once:true})); //je relance mon navigateur quand ma tâche css est accomplie : permet de rafraîchir mon navigateur
});

gulp.task('size', function(){
  return gulp.src('./dist/js/main.min.js')
  .pipe(s)
  .pipe(notify("taille : " + s ));

});


gulp.task('html', function(){
  return gulp.src('./*.html')
  .pipe(reload({stream:true, once:true}));
});
