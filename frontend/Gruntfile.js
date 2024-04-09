module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: 'src/assets/css',
                    src: ['*.css', '!*.min.css'],
                    dest: 'dist/assets/css',
                    ext: '.min.css'
                }]
            }
        },

        uglify: {
            my_target: {
                files: {
                    'dist/app/app.min.js': ['src/app/**/*.js'],
                    'dist/libs/libs.min.js': ['src/libs/**/*.js'] 
                }
            }
        },

        copy: {
            html: {
                src: 'src/index.html',
                dest: 'dist/index.html'
            },
            assets: {
                expand: true,
                cwd: 'src/assets/',
                src: '**',
                dest: 'dist/assets/'
            },
            libs: {
                expand: true,
                cwd: 'src/libs/',
                src: '**',
                dest: 'dist/libs/'
            },
            app: {
                expand: true,
                cwd: 'src/app/',
                src: '**',
                dest: 'dist/app/'
            },
            scripts: {
                expand: true,
                cwd: 'src/scripts/',
                src: '**',
                dest: 'dist/scripts/'
            },
        },
        
        watch: {
            css: {
                files: ['src/assets/css/**/*.css'],
                tasks: ['cssmin']
            },
            js: {
                files: ['src/app/**/*.js', 'src/libs/**/*.js'],
                tasks: ['uglify']
            }
        },

        connect: {
            server: {
                options: {
                    port: 8080,
                    base: 'src',
                    open: true,
                    livereload: true,
                    hostname: 'localhost'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy'); 
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect'); 


    grunt.registerTask('default', ['cssmin', 'uglify', 'copy']); 
    grunt.registerTask('serve', ['connect:server', 'watch']); 
    grunt.registerTask('build', ['cssmin', 'uglify', 'copy']); 
};
