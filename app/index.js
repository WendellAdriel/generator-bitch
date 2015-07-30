'use strict';

var generators = require('yeoman-generator');
var path = require('path');
var slugify = require('underscore.string/slugify');
var mkdirp = require('mkdirp');

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments);
    this.slugify = slugify;

    this.argument('appname', {
      desc: 'create an app with name [appname]',
      type: Boolean,
      required: false,
      defaults: path.basename(process.cwd())
    });
  },
  prompts: function () {
    var cb = this.async();
    var prompts = [
      {
        type: 'input',
        name: 'appname',
        message: 'Application name',
        default: this.appname
      },
      {
        type: 'list',
        name: 'viewEngine',
        message: 'Select view engine you would like to use',
        default: 'jade',
        choices: ['jade', 'ejs']
      },
      {
        type: 'list',
        name: 'preprocessor',
        message: 'Select css preprocessor you would like to use',
        default: 'sass',
        choices: ['sass', 'less']
      }
    ];

    var answersCallback = (function (answers) {
      this.appname = answers.appname;
      this.viewEngine = answers.viewEngine;
      this.preprocessor = answers.preprocessor;
      if (answers.preprocessor) {
        this.extPreprocessor = answers.preprocessor === 'sass' ? 'scss' : 'less';
      }
      cb();
    }).bind(this);

    this.prompt(prompts, answersCallback);
  },
  common: function() {
    this.sourceRoot(path.join(__dirname,  'templates/common'), this);
    this.directory('.', '.');
  },
  express: function() {
    this.sourceRoot(path.join(__dirname,  'templates/express'), this);
    this.directory('.', '.');
  },
  assets: function() {
    mkdirp('assets/imgs');
    mkdirp('assets/styles');
    mkdirp('assets/sprites');
    mkdirp('assets/scripts');
  },
  views: function() {
    this.sourceRoot(path.join(__dirname,  'templates/views/'+this.viewEngine), this);
    this.directory('.', 'assets/views');
  },
  styles: function() {
    this.sourceRoot(path.join(__dirname,  'templates/styles/'+this.preprocessor), this);
    this.directory('.', 'assets/styles');
  },
  public: function() {
    this.sourceRoot(path.join(__dirname,  'templates/public'), this);
    this.directory('.', 'public');
    mkdirp('public/imgs/sprites');
    mkdirp('public/scripts');
  },
  install: function() {
    this.installDependencies({
      bower: true,
      npm: true,
      skipInstall: true
    });
  }
});
