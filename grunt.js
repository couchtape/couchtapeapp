module.exports = function (grunt) {

  grunt.initConfig({
    watch: {
      files: ['client/**'],
      tasks: 'build:mobile build:tv'
    },

    concat: {
      mobile: {
        src: ['client/default/js/libs/angular/angular.js', 'client/default/js/src/bootstrap.js', 'client/default/js/src/apiService.js', 'client/default/js/src/socketIOService.js', 'client/mobile/js/src/*.js'],
        dest: 'build/mobile/js/app.js'
      },
      tv: {
        src: ['client/default/js/libs/angular/angular.js', 'client/default/js/libs/angular/angular-resource.js', 'client/default/js/src/bootstrap.js', 'client/default/js/src/apiService.js', 'client/default/js/src/socketIOService.js', 'client/tv/js/*.js', 'client/tv/js/directives/*.js', 'client/tv/js/controller/*.js'],
        dest: 'build/tv/js/app.js'
      }
    },

    less:{
      mobile: {
        options: {
          paths:["client/"]
        },
        files: {
          'build/mobile/css/main.css':'client/mobile/less/main.less'
        }
      },
      tv: {
        options: {
          paths:["client/"]
        },
        files: {
          'build/tv/css/main.css':'client/tv/less/main.less'
        }
      }
    },

    clean: {
      mobile: ['build/mobile'],
      tv: ['build/tv']
    },

    copy: {
      lib: {
        files: {
          'build/vendor/': 'client/mobile/css/add2home.css'
        }
      },
      mobile: {
        files: {
          "build/mobile/img/": ["client/default/img/**"],
          'build/mobile.html': 'client/mobile/mobile.html',
          'build/mobile/tmpl/': 'client/mobile/tmpl/*'
        }
      },
      tv: {
        files: {
            "build/tv/shaders/": ["client/tv/shaders/**"],
            /*"build/tv/mp3/": ["client/tv/mp3/**"],*/
            "build/tv/img/": ["client/default/img/**"],
            'build/tv.html': 'client/tv/tv.html'
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib');

  grunt.registerTask('default', 'build:mobile build:tv');

  grunt.registerTask('build:mobile', 'clean:mobile concat:mobile less:mobile copy:mobile copy:lib');
  grunt.registerTask('build:tv', 'clean:tv concat:tv less:tv copy:tv copy:lib');
};
