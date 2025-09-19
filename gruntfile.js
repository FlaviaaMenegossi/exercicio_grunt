module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    less: {  
      development: {
        files: {
          'dev/styles/main.css': 'src/styles/main.less'  
        }
      },
      production: {  
        options: {
          compress: true 
        },
        files: {
          'dist/styles/main.min.css': 'src/styles/main.less'  // Compilação para produção 
        }
      },

      
    },

    watch:{
        less: {
            files: ['src/styles/**/*.less'],
            tasks: ['less:development']    
            },

            options: {
                    spawn: false,
                    livereload: true
                },

            html:{
                files: ['src/index.html'],
                tasks: ['replace:dev']
            }
    },

    html:{
        files: ['src/index.html'],
        tasks: ['replace:dev']
    },

    replace:{
            dev:{
                options:{
                    patterns: [
                        {
                                match: 'ENDERECO_DO_CSS',
                                replacement: './styles/main.css'
                        },

                        
                        {

                            match: 'ENDERECO_DO_JS', 
                            replacement: '../src/scripts/main.js'
                        }
                    ]
                },

                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: ['src/index.html'],
                        dest: 'dev/'
                    }
                ]
            },

            dist:{
                options:{
                    patterns: [
                        {
                                match: 'ENDERECO_DO_CSS',
                                replacement: './styles/main.min.css'
                        },

                        {
                                match: 'ENDERECO_DO_JS',
                                replacement: './scripts/main.min.js'
                        }
                    ]
                },

                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: ['prebuild/index.html'],
                        dest: 'dist/'
                    }
                ]
            }
        },

        htmlmin:{
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true,
                },

                files: {
                    'prebuild/index.html': 'src/index.html'
                }

            }   
        },

        clean:['prebuild'],

        copy:{
            scripts: {
                expand: true,
                cwd: 'src/scripts/',
                src: '**/*.js',
                dest: 'dist/scripts/'
            }
        },

        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                mangle: true,
                compress: {
                    drop_console: true,
                    drop_debugger: true
                }
            },
            development: {
                options: {
                    beautify: true,
                    mangle: false,
                    compress: false,
                    sourceMap: true
                },
                files: {
                    'dist/script.js': ['src/scripts/main.js']
                }
            },
            production: {
                files: {
                    'dist/script.js': ['src/scripts/main.js']
                }
            }
        },



    
  });

  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-replace');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
   grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['watch']);
    grunt.registerTask('build', ['clean', 'less:production', 'htmlmin:dist', 'replace:dist', 'copy:scripts', 'uglify']);
};
