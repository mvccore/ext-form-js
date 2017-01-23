# SimpleForm - Custom Javascript Support Classes

[![Latest Stable Version](https://img.shields.io/badge/Stable-v3.1.0-brightgreen.svg?style=plastic)](https://github.com/mvccore/example-helloworld/releases)
[![License](https://img.shields.io/badge/Licence-BSD-brightgreen.svg?style=plastic)](https://github.com/mvccore/example-helloworld/blob/master/LICENCE.md)
![PHP Version](https://img.shields.io/badge/PHP->=5.3-brightgreen.svg?style=plastic)

Node builder to compile custom javascripts for PHP SimpleForm library (mvccore/simpleform), which serves web forms and much more.

Custom javascripts are compiled by Google Closure Compiller.

## Instalation
```shell
npm install mvccore/simpleform-custom-js
```

## Excending and custom javascript development
- add, change or remove anything in "node_modules/simpleform-custom-js/jrc/*.js"
- build your new javascript files
- configure PHP SimpleForm library to use your custom javascripts

## Building

### Configuration
- open file "node_modules/simpleform-custom-js/dev-tools/build.js"
- edit lines 14 and 15 to change compiled javascript files destination

### Windows
```shell
cd node_modules/simpleform-custom-js/dev-tools
build.cmd
```

### Max/Linux
```shell
cd node_modules/simpleform-custom-js/dev-tools
build.sh
```
