module.exports = function (grunt) {

  grunt.initConfig({
    watch: {
      files: [
        'client/js/src/bootstrap.js',
        'client/js/src/config.js', 
        'client/js/src/*.js'
      ],
      tasks: 'concat'
    },

    concat: {
      build: {
        src: ['client/js/src/*.js'],
        dest: 'client/js/app.js'
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib');

  grunt.registerTask('default', 'concat');
};
