# MvcCore Extension - Form - Custom Javascripts

[![Latest Stable Version](https://img.shields.io/badge/Stable-v4.2.0-brightgreen.svg?style=plastic)](https://github.com/mvccore/ext-form-js/releases)
[![License](https://img.shields.io/badge/Licence-BSD-brightgreen.svg?style=plastic)](https://mvccore.github.io/docs/mvccore/4.0.0/LICENCE.md)
[![Google Closure Build](https://img.shields.io/badge/Google%20Closure%20Build-passing-brightgreen.svg?style=plastic)](https://developers.google.com/closure/compiler/)

Node builder to compile custom javascripts for PHP library MvcCore Form Extension (mvccore/ext-form), which serves web forms and much more.

Custom javascripts are compiled by Google Closure Compiller.

## Instalation
```shell
npm install mvccore/ext-form-js
```

## Excending and custom javascript development
- add, change or remove anything in "node_modules/ext-form-js/src/*.js"
- build your new javascript files
- configure PHP library MvcCore Form Extension to use your custom javascripts

## Building

### Configuration
- open file "node_modules/ext-form-js/dev-tools/build.js"
- edit lines 14 and 15 to change compiled javascript files destination

### Windows
```shell
cd node_modules/ext-form-js/dev-tools
build.cmd
```

### Max/Linux
```shell
cd node_modules/ext-form-js/dev-tools
build.sh
```
