'use strict';

module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);
  require('connect-livereload')(grunt);

  var appConfig = {
    app: require('./bower.json').appPath || 'app',
    dist: 'dist'
  };

  grunt.initConfig({
    appConfig: appConfig,
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: {
        src: [
          'Gruntfile.js',
          '<%= appConfig.app %>/scripts/{,*/}*.js'
        ]
      }
    },
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= appConfig.dist %>/{,*/}*',
            '!<%= appConfig.dist %>/.git{,*/}*'
          ]
        }]
      },
      dev: '.tmp',
      deploy:'.grunt/ftpush'
    },
    autoprefixer: {
      options: {
        browsers: ['last 2 version']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      },
      dev: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: 'app/styles/'
        }]
      }
    },
    wiredep: {
      app: {
        src: ['<%= appConfig.app %>/index.html'],
        ignorePath: /\.\.\//
      }
    },
    filerev: {
      dist: {
        src: [
          '<%= appConfig.dist %>/scripts/{,*/}*.js',
          '<%= appConfig.dist %>/styles/{,*/}*.css',
          '<%= appConfig.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
          '<%= appConfig.dist %>/styles/fonts/*'
        ]
      }
    },
    useminPrepare: {
      html: '<%= appConfig.app %>/index.html',
      options: {
        dest: '<%= appConfig.dist %>',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglifyjs'],
              css: ['cssmin']
            },
            post: {}
          }
        }
      }
    },
    usemin: {
      html: ['<%= appConfig.dist %>/{,*/}*.html', '<%= appConfig.dist %>/modules/{,*/}*.html'],
      css: ['<%= appConfig.dist %>/styles/{,*/}*.css'],
      options: {
        assetsDirs: ['<%= appConfig.dist %>', '<%= appConfig.dist %>/images']
      }
    },
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= appConfig.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg,gif,svg}',
          dest: '<%= appConfig.dist %>/images'
        }]
      }
    },
    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= appConfig.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%= appConfig.dist %>/images'
        }]
      }
    },
    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          conservativeCollapse: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true,
          removeOptionalTags: true
        },
        files: [{
          expand: true,
          cwd: '<%= appConfig.dist %>',
          src: ['*.html', 'modules/{,*/}*.html'],
          dest: '<%= appConfig.dist %>'
        }]
      }
    },
    less: {
      dev: {
        options: {},
        files: {
          '<%= appConfig.app %>/styles/main.css': '<%= appConfig.app %>/styles/main.less'
        }
      },
      dist: {
        options: {},
        files: {
          '<%= appConfig.app %>/styles/main.css': '<%= appConfig.app %>/styles/main.less'
        }
      },
    },
    cdnify: {
      dist: {
        html: ['<%= appConfig.dist %>/*.html']
      }
    },
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= appConfig.app %>',
          dest: '<%= appConfig.dist %>',
          src: [
            '*.{ico,png,gif,txt}',
            '.htaccess',
            '*.html',
            'robots.txt',
            'sitemap.xml.gz',
            'modules/{,*/}*.html',
            'images/{,*/}*.{webp}',
            'fonts/{,*/}*.*',
            '*.config'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= appConfig.dist %>/images',
          src: ['generated/*']
        }, {
          expand: true,
          cwd: 'app/',
          src: 'fakeData/*',
          dest: '<%= appConfig.dist %>'
        }]
      },
      fonts: {
        files: [{
          expand: true,
          cwd: 'bower_components/bootstrap/dist',
          src: 'fonts/*',
          dest: '<%= appConfig.app %>'
        }, {
          expand: true,
          cwd: 'bower_components/fontawesome',
          src: 'fonts/*',
          dest: '<%= appConfig.app %>'
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= appConfig.app %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      }
    },
    concurrent: {
      dev: [
        'copy:styles',
        'copy:fonts'
      ],
      dist: [
        'copy:styles',
        'copy:fonts',
        'imagemin',
        'svgmin'
      ]
    },
    assemble: {
      options: {
        flatten: false,
        expand: true,
        assets: '',
        layout: 'default.hbs',
        layoutdir: '<%= appConfig.app %>/layouts',
        src: ['<%= appConfig.app %>/views/*.hbs']
      },
      dev: {
        files: [{
          expand: true,
          cwd: '<%= appConfig.app %>/views/',
          src: '**/*.hbs',
          dest: '<%= appConfig.app %>/',
          ext: '.html'
        }]
      }
    },
    connect: {
      options: {
        port: 9001,
        hostname: 'localhost'
      },
      dev: {
        options: {
          open: true,
          middleware: function(connect) {
            return [
              require('connect-livereload')(),
              connect.static('.tmp'),
              connect().use('/bower_components', connect.static('./bower_components')),
              connect.static(appConfig.app)
            ];
          }
        }
      },
      dist: {
        options: {
          open: true,
          base: '<%= appConfig.dist %>'
        }
      }
    },
    watch: {
      options: {
        livereload: true,
      },
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      js: {
        files: ['<%= appConfig.app %>/scripts/{,*/}*.js'],
        tasks: ['newer:jshint:all']
      },
      html: {
        files: ['<%= appConfig.app %>/{,*/}*.html', '<%= appConfig.app %>/modules/{,*/}*.html']
      },
      hbs: {
        files: ['<%= appConfig.app %>/{,*/}*.hbs', '<%= appConfig.app %>/modules/{,*/}*.hbs'],
        tasks: ['assemble']
      },
      styles: {
        files: ['<%= appConfig.app %>/styles/{,*/}*.less'],
        tasks: ['less:dev', 'copy:styles', 'autoprefixer']
      }
    },
    ftpush: {
      build: {
        auth: {
          host: 'waws-prod-bay-045.ftp.azurewebsites.windows.net',
          port: 21,
          authKey: 'gitcheese'
        },
        src: '<%= appConfig.dist %>',
        dest: '/site/wwwroot/',
        keep: ['/app'],
        simple: false
      }
    }
  });

  grunt.registerTask('serve', 'Compile then start a connect web server', function(target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:dev',
      'assemble',
      'wiredep',
      'less:dev',
      'concurrent:dev',
      'autoprefixer:dev',
      'connect:dev',
      'watch'
    ]);
  });

  grunt.registerTask('build', [
    'less:dist',
    'clean:dist',
    'assemble',
    'wiredep',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer:dist',
    'concat',
    'copy:dist',
    'cdnify',
    'cssmin',
    'uglify',
    'filerev',
    'usemin',
    'htmlmin'
  ]);

  grunt.registerTask('clean-deploy', [
    'clean:deploy',
    'ftpush'
  ]);

  grunt.registerTask('deploy', [
    'ftpush'
  ]);

  grunt.registerTask('build-and-deploy', [
    'build',
    'clean-deploy'
  ]);
};
