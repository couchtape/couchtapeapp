module.exports = function (grunt) {

  grunt.initConfig({
    watch: {
      files: ['client/*'],
      tasks: 'concat'
    },

    concat: {
      mobile: {
        src: ['client/default/js/src/*.js', 'client/mobile/js/src/*.js'],
        dest: 'build/mobile/js/app.js'
      },
      tv: {
        src: ['client/default/js/src/*.js', 'client/tv/js/src/*.js'],
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
      mobile: {
        files: {
          "build/mobile/img/": ["client/default/img/**"],
          'build/mobile.html': 'client/mobile/mobile.html'
        }
      },
      tv: {
        files: {
            "build/tv/img/": ["client/default/img/**"],
            'build/tv.html': 'client/tv/tv.html'
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib');

  grunt.registerTask('build-mobile', 'clean:mobile concat:mobile less:mobile copy:mobile');
  grunt.registerTask('build-tv', 'clean:tv concat:tv less:tv copy:tv');
};
