module.exports = function(grunt) {
    'use strict';

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            options: grunt.file.readJSON('jshint.json'),
            all: {
                options: {
                    ignores: ['node_modules/**/*.js', 'lib/<%= pkg.name %>.min.js']
                },
                src: ['**/*.js']
            }
        },
        simplemocha: {
            options: {
                globals: ['should'],
                timeout: 3000,
                ignoreLeaks: false,
                ui: 'bdd',
                reporter: 'spec'
            },
            all: { src: 'test/**/*.js' }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> v<%= pkg.version %> - by Pixels and Bytes */\n',
                mangle: false
            },
            build: {
                files: {
                    'lib/<%= pkg.name %>.min.js': ['lib/<%= pkg.name %>.js']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-simple-mocha');

    // Default task(s)
    grunt.registerTask('test', ['jshint:all', 'simplemocha:all']);
    grunt.registerTask('build', ['test', 'uglify:build']);
    grunt.registerTask('default', ['build']);

};
